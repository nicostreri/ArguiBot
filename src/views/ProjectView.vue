<script setup>
  //Stores
  import { useProjectStore } from "./../stores/project";
  const project = useProjectStore();
  
  //UI components
  import NavBar from "./../components/navbar/NavBar.vue";
  import BlocklyComponent from "./../components/BlocklyComponent.vue";
  import CodeViewer from "./../components/CodeViewer.vue"; 
  import { Vue3Lottie } from 'vue3-lottie'

  import selectAnimation from "./../assets/animation_select_project.json"; 
</script>

<template>
  <t-layout class="layout">
    <t-header>
      <NavBar></NavBar>
    </t-header>
    <t-content v-if="project.isProjectOpen" class="content">
      <BlocklyComponent class="blockly-editor" :class="{'blockly-fullscreen': !project.showGeneratedCode}"></BlocklyComponent>
      <CodeViewer v-if="project.showGeneratedCode" class="code-view" v-model="project.projectGeneratedCode"></CodeViewer>
    </t-content>
    <t-content v-else class="not-open-project">
      <t-space v-if="!project.isOpening" align="center">
        <Vue3Lottie :animationData="selectAnimation" :height="200" :width="200" />
        <t-space direction="vertical">
          <h3>Selecciona un proyecto para comenzar.</h3>
        </t-space>
      </t-space>
      <t-space v-else align="center">
        <t-loading></t-loading>
      </t-space>
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

  .not-open-project {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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
  }
</style>