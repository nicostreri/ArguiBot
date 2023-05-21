<template>
  <t-layout class="layout">
    <t-header>
      <t-head-menu class="menu" theme="light" value="item1" expand-type="popup">
        <template #logo>
          <img height="28" src="icon.png" alt="logo" />
        </template>
        <t-submenu title="Editor">
          <template #icon>
            <t-icon name="edit-1"/>
          </template>
          <t-menu-item :onClick="handleUndo"> Deshacer último cambio</t-menu-item>
          <t-menu-item :onClick="handleRedo"> Rehacer último cambio</t-menu-item>
          <t-menu-item :onClick="handleToggleCode"> Ver/Ocultar código generado </t-menu-item>
        </t-submenu>
        <t-menu-item value="item2"> Option 1 </t-menu-item>
        <t-menu-item value="item3"> Option 2 </t-menu-item>
        <template #operations>
          <a href="javascript:;"><t-icon class="t-menu__operations-icon" name="rollback" :onClick="handleUndo"/></a>
          <a href="javascript:;"><t-icon class="t-menu__operations-icon" name="rollfront" :onClick="handleRedo" /></a>
          <a href="javascript:;"><t-icon class="t-menu__operations-icon" name="save" :onClick="handleSave"/></a>
          <server-status></server-status>
        </template>
      </t-head-menu>
    </t-header>
    <t-content class="content">
      <BlocklyComponent class="blockly-editor" :class="{'blockly-fullscreen': !toggleCode}" :options="options" ref="foo"></BlocklyComponent>
      <prism-editor v-if="toggleCode" class="code-view" v-model="codeText" :highlight="highlighter" line-numbers :readonly=true></prism-editor>
    </t-content>
  </t-layout>
</template>

<script>
  //Components
  import BlocklyComponent from "./components/BlocklyComponent.vue";
  import ServerStatus from "./components/ServerStatus.vue";
  import { PrismEditor } from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
  import { highlight, languages } from 'prismjs/components/prism-core';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-c';
  import 'prismjs/components/prism-cpp';
  import 'prismjs/components/prism-arduino';
  import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

  //Tauri APIs
  import { invoke } from "@tauri-apps/api";

  //Others
  import blocklyOptions from "./config/blocklyOptions";
  import arduinoGenerator from "./blockly/generators/arduino";
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
    },
    components: {
      BlocklyComponent,
      PrismEditor,
      ServerStatus
    },
    methods: {
      highlighter(code) {
        return highlight(code, languages.arduino);
      },
      handleWorkspaceChange(){
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
      handleSave(){
        alert("TODO: Implementar guardado remoto en servidor");
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

  .menu {
    padding-left: 15px;
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
    float: right; 
    width: 34%; 
    height: 100%;
    margin: 0; 
    background-color: #F0F0F0;
    overflow: auto;
  }

  .prism-editor__textarea:focus {
    outline: none;
  }

</style>