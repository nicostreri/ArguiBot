import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

//Tauri API
import { save as saveTauri } from '@tauri-apps/api/dialog';
import { writeTextFile } from "@tauri-apps/api/fs";
import { WebviewWindow } from '@tauri-apps/api/window'

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
import { MARK_FOR_REVIEW_URL } from "../config/globals";

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
    const workspaceResetCode = ref({blocks: {blocks: [{'type': 'board_setup_loop'}]}});
    const unsavedChanges = ref(false);
    const generatedCode = ref("");
    const showingGeneratedCode = ref(false);
    const canBeSaved = ref(false);
    const canBeRun = ref(false);
    const canBeReset = ref(false);
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
    const hasReview = computed(() => {
        if(!currentProjectData.value.revised) return false;
        return currentProjectData.value.solvedWithError;
    });
    const reviewComment = computed(() => {
        if(!currentProjectData.value.revised) return "";
        return currentProjectData.value.comment;
    });
    const solvedCorrectly = computed(() => {
        if(!currentProjectData.value.solvedCorrectly) return false;
        return currentProjectData.value.solvedCorrectly;
    });
    const isResettable = computed(() => canBeReset.value);
    const hasInstructions = computed(() => currentProjectData.value.exerciseURL ? true : false);

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
        if(sourceCode.projectReset){
            canBeReset.value = true;
            workspaceResetCode.value = sourceCode.projectReset;
        }

        currentProjectData.value = projectData;
        canBeSaved.value = true;
        opening.value = false;
        isOpened.value = true;
    }

    async function save(){
        if(!isOpened.value || !canBeSaved.value) return;
        if(solvedCorrectly.value) return; //read only

        saving.value = true;
        //Save the current state of the workspace
        const dataToSave = {
            project: workspaceCode.value,
            board: board.currentSelectedBoard,
            projectReset: workspaceResetCode.value
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

    async function markForReview(){
        if(!isOpened.value || !canBeSaved.value) return;
        await fetch(MARK_FOR_REVIEW_URL
            .replace("%GID", group.groupID)
            .replace("%PID", currentProjectData.value.id)
        ).catch(e=>{
            console.error(e);
            throw new Error("No se pudo enviar para revisión.");
        })
    }

    function reset(){
        if(!canBeReset.value) return;
        workspaceCode.value = workspaceResetCode.value;
        if(currentAttachedWorkspace.value){
            Blockly.serialization.workspaces.load(workspaceResetCode.value, currentAttachedWorkspace.value);
        }
    }

    function close(forceClose = false){
        if(!isOpened.value) return;
        if(unsavedChanges.value && !forceClose) 
            throw new Error("Guardar el proyecto actual para continuar.");

        let webview = WebviewWindow.getByLabel("exerciseInstructions");
        if(webview){
            webview.close();
        }
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
        canBeReset.value = false;
        workspaceResetCode.value = {blocks: {blocks: [{'type': 'board_setup_loop'}]}};
    }

    async function showExerciseInstructions(){
        if(!currentProjectData.value.exerciseURL) 
            throw new Error("El proyecto no tiene asignada una consigna.");
        
        let webview = WebviewWindow.getByLabel("exerciseInstructions");
        if(!webview){
            webview = new WebviewWindow("exerciseInstructions", {
                url: currentProjectData.value.exerciseURL,
                center: true,
                focus: true,
                title: "Consigna: " + currentProjectData.value.name
            });
        }else{
            webview.unminimize();
            webview.setFocus();
        }
    }


    return {
        isProjectOpen, isOpening, isSaving, hasReview, reviewComment, solvedCorrectly, isResettable, hasInstructions,
        allowsSave, allowsRun, isRunning, ranSuccessfullyRecently, projectGeneratedCode, canBeClosed, showGeneratedCode,
        attach, undo, redo, notifyUIChange, detach, toggleShowGeneratedCode, save, run, open, close,
        localSave, markForReview, reset, showExerciseInstructions
    };
});