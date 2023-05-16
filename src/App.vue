<template>
  <div id="app">
    <BlocklyComponent id="blocklyEditor" :options="options" ref="foo"></BlocklyComponent>
    <div id="code">
      <prism-editor v-model="codeText" :highlight="highlighter" line-numbers :readonly=true></prism-editor>
    </div>
  </div>
</template>

<script>
  //Components
  import BlocklyComponent from "./components/BlocklyComponent.vue";
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
      PrismEditor
    },
    methods: {
      highlighter(code) {
        return highlight(code, languages.js);
      },
      handleWorkspaceChange(){
        const generatedCode = javascriptGenerator.workspaceToCode(this.$refs.foo.workspace);
        this.codeText = generatedCode;
      }
    }
  }
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  html, body {
    margin: 0;
  }

  #code {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 30%;
    height: 100%;
    margin: 0;
    background-color: #f5f2f0;
    overflow-x: auto;
  }

  #blocklyEditor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 70%;
    height: 100%;
  }

  .prism-editor__textarea:focus {
    outline: none;
  }
</style>