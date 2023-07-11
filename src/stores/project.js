import { defineStore } from "pinia";
import { computed, ref } from "vue";
import * as Blockly from "blockly";
import arduinoGenerator from "./../blockly/generators/arduino/arduino";
import { verifySaveCompileAndUploadSketch } from "./../helpers/arduinoCLIService";
import { changeBoard } from "../blockly/generators/arduino/boards";
import { useBoardStore } from "./board";
import { usePortStore } from "./port";
import { NotifyPlugin } from 'tdesign-vue-next';

export const useProjectStore = defineStore("currentProject", () => {
    //Stores
    const board = useBoardStore();
    const port = usePortStore();

    //Current project properties
    const canBeSaved = ref(false);
    const canBeCompiled = ref(false);
    const cloudID = ref(undefined);
    const projectType = ref("arduino");
    const projectCode = ref(undefined);
    
    //Generation data
    const generatedCode = ref("");
    const localSketchID = ref(undefined);
    const isCompilingAndUploading = ref(false);
    const ranSuccessfully = ref(false);
    
    //Getters
    const allowsSave = computed(() => canBeSaved);
    const allowsRun = computed(() => canBeCompiled);
    const isRunning = computed(() => isCompilingAndUploading);
    const ranSuccessfullyRecently = computed(() => ranSuccessfully);
    const projectGeneratedCode = computed(() => generatedCode);

    //Actions
    function updateArduinoProjectFromWorkspace(workspace){
        if(projectType.value != "arduino") return;
        
        if(!changeBoard(workspace, board.currentSelectedBoard)){
            generatedCode.value = "// Placa de Desarrollo incompatible.";
            canBeCompiled.value = false;
            return;
        }
        const arduinoCode = arduinoGenerator.workspaceToCode(workspace);
        generatedCode.value = arduinoCode;
        canBeCompiled.value = true;
    }

    function updateProjectFromWorkspace(workspace){
        const jsonSerialization = Blockly.serialization.workspaces.save(workspace);
        projectCode.value = jsonSerialization;

        if(projectType.value == "arduino"){
            updateArduinoProjectFromWorkspace(workspace);
        }
    }

    async function run(){
        isCompilingAndUploading.value = true;
        ranSuccessfully.value = false;

        verifySaveCompileAndUploadSketch({ 
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
        }).catch((e)=> {
            NotifyPlugin('error', { 
                title: 'Oops!!', 
                content: e.message,
                closeBtn: true,
                placement: 'bottom-right',
                duration: 5000
            });
        }).finally(() => {
            isCompilingAndUploading.value = false;
        });
    }

    return {
        allowsSave, 
        allowsRun, 
        isRunning, 
        ranSuccessfullyRecently, 
        projectGeneratedCode, 
        updateProjectFromWorkspace, 
        run
    };
});