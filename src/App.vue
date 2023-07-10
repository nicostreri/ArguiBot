<script setup>
  import { onMounted, ref } from "vue";
  import E from "./components/navbar/NavEvents";

  //Stores
  import { useAppStore } from "./stores/app";
  import { usePortStore } from "./stores/port";

  const app = useAppStore();
  const ports = usePortStore();

  //UI components
  import WindowButtons from "./components/WindowButtons.vue";
  import NavBar from "./components/navbar/NavBar.vue";
  import BlocklyComponent from "./components/BlocklyComponent.vue";
  import CodeViewer from "./components/CodeViewer.vue";

  //Blockly configuration
  import blocklyOptions from "./config/blocklyOptions";
  import arduinoGenerator from "./blockly/generators/arduino/arduino";
  import { changeBoard } from "./blockly/generators/arduino/boards";

  //Internal state
  const showCode = ref(true);
  const arduinoCode = ref("");
  const blockly = ref();
  
  //Methods
  const handleBlocklyChange = (workspace) => {
    console.log("Change");
    const generatedCode = arduinoGenerator.workspaceToCode(workspace);

    //TODO Mapear con la opcion elegida por el ussuario actualmente en la barra de navegacion
    changeBoard(workspace, "uno");
    arduinoCode.value = generatedCode;
  }

  const handleSave = () => {
    alert("TODO: Implementar guardado remoto en servidor");
  };

  const handleUndoRedo = (isUndo) => {
    if(isUndo){
      blockly.value.undo();
    }else{
      blockly.value.redo();
    }
  }

  const handleToggleCode = () => {
    showCode.value = !showCode.value;
    blockly.value.updateView();     
  };

  const handleMenu = (event) => {
    switch(event){
      case E.SAVE_EVENT: handleSave(); break;
      case E.UNDO_EVENT: handleUndoRedo(true); break;
      case E.REDO_EVENT: handleUndoRedo(false); break;
      case E.TCODE_EVENT: handleToggleCode(); break;
      case E.TTHEME_EVENT: app.toggleTheme(); break;
      case E.SEARCH_PORT_EVENT: ports.updateList(); break;
      default: throw "Missing handler for " + event;
    }
  }

  onMounted(()=>{
    app.onStartVue();
  });
</script>

<template>
  <t-layout class="layout">
    <t-header>
      <NavBar @onSelect="handleMenu"></NavBar>
      <WindowButtons></WindowButtons>
    </t-header>
    <t-content class="content">
      <BlocklyComponent 
        class="blockly-editor" 
        :class="{'blockly-fullscreen': !showCode}" 
        :options="blocklyOptions" 
        ref="blockly"
        @change="handleBlocklyChange">
      </BlocklyComponent>
      <CodeViewer v-if="showCode" class="code-view" v-model="arduinoCode"></CodeViewer>
    </t-content>
  </t-layout>
</template>

<style scoped>
  .layout {
    width: 100%;
    min-height: 100%; 
    position: absolute; 
  }

  .content {
    width: 100%;
    height: 100%;
    margin: 0;
    display: table;
  }

  .blockly-editor {   
    float: left; 
    width: 66%; 
    height: 100%;
    margin: 0; 
  } 

  .blockly-fullscreen {
    width: 100%;
  }

  .code-view {
    width: 34%; 
    height: 100%;
    margin: 0; 
    overflow: auto;
  }
</style>