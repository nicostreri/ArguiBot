<template>
  <t-layout class="layout">
    <t-header>
      <t-head-menu class="menu" theme="light" value="item1" >
        <template #logo>
          HELLO
        </template>
        <t-menu-item value="item1">
          <t-icon name="search" class="t-menu__operations-icon"></t-icon>
        </t-menu-item>
        <t-menu-item value="item2"> Option 1 </t-menu-item>
        <t-menu-item value="item3"> Option 2 </t-menu-item>
        <t-menu-item value="item4" :disabled="true"> Option 3 </t-menu-item>
        <template #operations>
          <a href="javascript:;"><t-icon class="t-menu__operations-icon" name="rollback" :onClick="handleUndo"/></a>
          <a href="javascript:;"><t-icon class="t-menu__operations-icon" name="rollfront" :onClick="handleRedo" /></a>
          <a href="javascript:;"><t-icon class="t-menu__operations-icon" name="save"/></a> <!-- TODO -->
          <server-status></server-status>
        </template>
      </t-head-menu>
    </t-header>
    <t-content class="content">
      <BlocklyComponent class="blockly-editor" :options="options" ref="foo"></BlocklyComponent>
      <prism-editor class="code-view" v-model="codeText" :highlight="highlighter" line-numbers :readonly=true></prism-editor>
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
  import 'prismjs/components/prism-javascript';
  import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

  //Tauri APIs
  import { invoke } from "@tauri-apps/api";

  //Others
  import blocklyOptions from "./config/blocklyOptions";
  import { javascriptGenerator } from "blockly/javascript";
  // import "./blocks/stocks";
  
  export default {
    data() {
      return {
        codeText: "",
        options: blocklyOptions
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
        return highlight(code, languages.js);
      },
      handleWorkspaceChange(){
        const generatedCode = javascriptGenerator.workspaceToCode(this.$refs.foo.workspace);
        this.codeText = generatedCode;
      },
      handleUndo(){
        this.$refs.foo.workspace.undo();
      },
      handleRedo(){
        this.$refs.foo.workspace.undo(true);
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