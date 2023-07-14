import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

//Tauri API
import { save as saveTauri } from '@tauri-apps/api/dialog';
import { writeTextFile } from "@tauri-apps/api/fs";

//Stores
import { useBoardStore } from "./board";
import { usePortStore } from "./port";
import { useGroupStore } from "./group";

//Blockly and Arduino imports
import * as Blockly from "blockly";
import blocklyOptions from "./../config/blocklyOptions";
import arduinoGenerator from "./../blockly/generators/arduino/arduino";
import { changeBoard } from "../blockly/generators/arduino/boards";
import { verifySaveCompileAndUploadSketch } from "./../helpers/arduinoCLIService";

export const useProjectStore = defineStore("currentProject", () => {
    //Stores
    const board = useBoardStore();
    const port = usePortStore();
    const group = useGroupStore();

    //Project edit data
    const isOpened = ref(false); //Indicates if there is a project open
    const currentProjectData = ref({});
    const currentAttachedWorkspace = ref(undefined);
    const workspaceCode = ref({blocks: {blocks: [{'type': 'board_setup_loop'}]}});
    const unsavedChanges = ref(false);
    const generatedCode = ref("");
    const showingGeneratedCode = ref(true);
    const canBeSaved = ref(false);
    const canBeRun = ref(false);
    const running = ref(false);
    const ranSuccessfully = ref(false);
    const opening = ref(false);
    const saving = ref(false);

    //Blockly and Arduino CLI data
    const localSketchID = ref(undefined);
    
    //Getters
    const isProjectOpen = computed(() => isOpened.value);
    const allowsSave = computed(() => canBeSaved.value);
    const allowsRun = computed(() => canBeRun.value);
    const isRunning = computed(() => running.value);
    const ranSuccessfullyRecently = computed(() => ranSuccessfully.value);
    const projectGeneratedCode = computed(() => generatedCode.value);
    const canBeClosed = computed(() => {
        return isOpened.value && !running.value;
    });
    const showGeneratedCode = computed(() => showingGeneratedCode.value);
    const isOpening = computed(() => opening.value);
    const isSaving = computed(() => saving.value);

    watch(() => board.currentSelectedBoard, () => {
        _handleCurrentWorkspaceChange({});
    })

    //Actions related to Blockly
    function _updateWorkspaceCode(){
        if(!currentAttachedWorkspace.value) return;

        const jsonSerialization = Blockly.serialization.workspaces.save(currentAttachedWorkspace.value);
        workspaceCode.value = jsonSerialization;
        console.log("Serializando", jsonSerialization);
    }

    function _handleCurrentWorkspaceChange(bEvent){
        if(bEvent.isUiEvent || !currentAttachedWorkspace.value) return;
        unsavedChanges.value = true;
        
        _updateWorkspaceCode();

        //Update generated Arduino code
        if(!changeBoard(currentAttachedWorkspace.value, board.currentSelectedBoard)){
            generatedCode.value = "// Placa de Desarrollo incompatible.";
            canBeRun.value = false;
            return;
        }
        const arduinoCode = arduinoGenerator.workspaceToCode(currentAttachedWorkspace.value);
        generatedCode.value = arduinoCode;
        canBeRun.value = true;
    }

    /**
     * 
     * @param {ref<HTMLElement>} element Reference to the container element where blockly is rendered
     */
    function attach(element){
        detach();
        
        //Mount Blockly
        const wrkspace = Blockly.inject(element.value, blocklyOptions);
        wrkspace.addChangeListener(Blockly.Events.disableOrphans);
        wrkspace.addChangeListener(_handleCurrentWorkspaceChange);

        //Render project
        changeBoard(wrkspace, board.currentSelectedBoard);
        Blockly.serialization.workspaces.load(workspaceCode.value, wrkspace);
        currentAttachedWorkspace.value = wrkspace;
    }

    function undo(){
        if(!currentAttachedWorkspace.value) return;
        currentAttachedWorkspace.value.undo();
    }
    
    function redo(){
        if(!currentAttachedWorkspace.value) return;
        currentAttachedWorkspace.value.undo(true);
    }

    function notifyUIChange(){
        if(!currentAttachedWorkspace.value) return;
        setTimeout(() => {
          Blockly.svgResize(currentAttachedWorkspace.value);
        }, 50);
    }
    
    function detach(){
        if(!currentAttachedWorkspace.value) return;
        currentAttachedWorkspace.value.dispose();
        currentAttachedWorkspace.value = undefined;
    }

    function toggleShowGeneratedCode(){
        showingGeneratedCode.value = !showingGeneratedCode.value;
        notifyUIChange();
    }

    async function run(){
        running.value = true;
        ranSuccessfully.value = false;
        canBeRun.value = false;
        return verifySaveCompileAndUploadSketch({ 
            sketchID: localSketchID.value,
            boardFQBN: board.currentSelectedBoard,
            boardPort: port.currentSelectedPort,
            sourceCode: generatedCode.value,
            onUpdateProgress: console.log         
        }).then((result) => {
            localSketchID.value = result;
            ranSuccessfully.value = true;
            setTimeout(() => {
                ranSuccessfully.value = false;
            }, 2000);
            return true;
        }).finally(() => {
            running.value = false;
            canBeRun.value = true;
        });
    }

    async function open(projectID){
        close();
        if(!board.currentSelectedBoard) throw new Error("Selecionar una Placa de Desarrollo antes de continuar.");

        //Find project data
        const projectData = group.projects.filter(p => p.id == projectID)[0];
        if(!projectData) throw new Error("Proyecto no encontrado.");
        currentProjectData.value = projectData;

        opening.value = true;
        //Fetch source code
        const sourceCode = await fetch(projectData.getURL).then((response => {
            if(!response.ok) throw new Error("El servidor no respondió correctamente.");
            return response.json();
        })).catch(e => {
            opening.value = false;
            throw new Error("No se pudo obtener el proyecto desde el Servidor.");
        });
        //Check board
        if(sourceCode.board != board.currentSelectedBoard){
            opening.value = false;
            throw new Error("El proyecto no está diseñado para la Placa de Desarrollo seleccionada.");
        }

        workspaceCode.value = sourceCode.project;
        if(currentAttachedWorkspace.value){
            Blockly.serialization.workspaces.load(sourceCode.project, currentAttachedWorkspace.value);
        }
        canBeSaved.value = true;
        opening.value = false;
        isOpened.value = true;
    }

    async function save(){
        if(!isOpened.value || !canBeSaved.value) return;
        saving.value = true;
        //Save the current state of the workspace
        const dataToSave = {
            project: workspaceCode.value,
            board: board.currentSelectedBoard
        };

        await fetch(currentProjectData.value.setURL, {
            method: "POST",
            body: JSON.stringify(dataToSave),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(()=>{
            unsavedChanges.value = false;
        }).catch(e=>{
            throw new Error("No se pudo guardar el proyecto en el Servidor.");
        }).finally(() => {
            saving.value = false;
        });
    }

    async function localSave(){
        if(!isOpened.value || !canBeSaved.value) return;

        const filePath = await saveTauri({
            title: "Guardar copia local del proyecto",
            filters: [{
              name: 'Archivos RST',
              extensions: ['rst']
            }]
        });
        const projectToSave = JSON.stringify({
            project: workspaceCode.value,
            board: board.currentSelectedBoard
        });
        try{
            await writeTextFile(filePath, projectToSave);
        }catch(e){
            throw new Error("No se pudo guardar localmente.");
        }
    }

    function close(forceClose = false){
        if(!isOpened.value) return;
        if(unsavedChanges.value && !forceClose) 
            throw new Error("Guardar el proyecto actual para continuar.");

        //Reset internal data
        isOpened.value = false;
        currentProjectData.value = {};
        unsavedChanges.value = false;
        generatedCode.value = "";
        showingGeneratedCode.value = true;
        canBeSaved.value = false;
        canBeRun.value = false;
        running.value = false;
        ranSuccessfully.value = false;        
    }

    return {
        isProjectOpen, isOpening, isSaving,
        allowsSave, allowsRun, isRunning, ranSuccessfullyRecently, projectGeneratedCode, canBeClosed, showGeneratedCode,
        attach, undo, redo, notifyUIChange, detach, toggleShowGeneratedCode, save, run, open, close,
        localSave
    };
});