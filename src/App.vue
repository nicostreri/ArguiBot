<template>
  <t-layout class="layout">
    <t-header>
      <NavBar @onSelect="handleMenu"></NavBar>
    </t-header>
    <t-content class="content">
      <BlocklyComponent class="blockly-editor" :class="{'blockly-fullscreen': !toggleCode}" :options="options" ref="foo"></BlocklyComponent>
      <prism-editor v-if="toggleCode" class="code-view" v-model="codeText" :highlight="highlighter" line-numbers :readonly=true></prism-editor>
    </t-content>
  </t-layout>
</template>

<script>
  //UI components
  import NavBar from "./components/NavBar.vue";
  import BlocklyComponent from "./components/BlocklyComponent.vue";
  import { PrismEditor } from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
  import { highlight, languages } from 'prismjs/components/prism-core';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-c';
  import 'prismjs/components/prism-cpp';
  import 'prismjs/components/prism-arduino';
  import 'prismjs/themes/prism-solarizedlight.css';

  //Tauri APIs
  import { invoke } from "@tauri-apps/api";

  //Others
  import blocklyOptions from "./config/blocklyOptions";
  import arduinoGenerator from "./blockly/generators/arduino/arduino";
  import './blockly/blocks';
  
  export default {
    data() {
      return {
        codeText: "",
        options: blocklyOptions,
        toggleCode: true
      }
    },
    mounted() {
      invoke('close_splashscreen');
      this.$refs.foo.workspace.addChangeListener(this.handleWorkspaceChange);
      this.$refs.foo.serialization.workspaces.load({blocks: {blocks: [{'type': 'board_setup_loop'}]}}, this.$refs.foo.workspace);

    },
    components: {
      NavBar,
      BlocklyComponent,
      PrismEditor
    },
    methods: {
      highlighter(code) {
        return highlight(code, languages.arduino);
      },
      handleWorkspaceChange(event){
        if(event.isUiEvent) return;
        const generatedCode = arduinoGenerator.workspaceToCode(this.$refs.foo.workspace);
        this.codeText = generatedCode;
      },
      handleUndo(){
        this.$refs.foo.workspace.undo();
      },
      handleRedo(){
        this.$refs.foo.workspace.undo(true);
      },
      handleToggleCode(){
        this.toggleCode = !this.toggleCode;
        setTimeout(() => {
          this.$refs.foo.svgResize(this.$refs.foo.workspace);
        }, 50);
      },
      handleToggleTheme(){
        this.toggleTheme = !this.toggleTheme;
        if(this.toggleTheme){
          document.documentElement.setAttribute('theme-mode', 'dark');
        }else{
          document.documentElement.removeAttribute('theme-mode');
        }
      },
      handleSave(){
        alert("TODO: Implementar guardado remoto en servidor");
      },
      handleMenu(event){
        switch(event){
          case "file:save": this.handleSave(); break;
          case "editor:undo": this.handleUndo(); break;
          case "editor:redo": this.handleRedo(); break;
          case "editor:toggleCode": this.handleToggleCode(); break;
          case "editor:toggleTheme": this.handleToggleTheme(); break;
          default: throw "Missing handler for " + event;
        }
      }
    }
  }
</script>

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