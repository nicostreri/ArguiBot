<script setup>
  import E from "./NavEvents";
  
  //Stores
  import { useProjectStore } from "../../stores/project";
  const project = useProjectStore();

  //UI components
  import ServerStatus from "./../ServerStatus.vue";
  import FileSubMenu from "./FileSubMenu.vue";
  import EditorSubMenu from "./EditorSubMenu.vue";
  import ProgrammingSubMenu from "./ProgrammingSubMenu.vue";
  import RunButton from "./RunButton.vue";
  import { RollbackIcon, RollfrontIcon, SaveIcon } from "tdesign-icons-vue-next";

  //Events
  const emit = defineEmits(['onSelect']);
  const e = (eventName) => {
    emit('onSelect', eventName);
  };
  const eClick = (eventName) => () => {
    console.log(eventName);
    e(eventName);
  };
</script>

<template>
  <div data-tauri-drag-region class="titlebar"></div>

  <t-head-menu class="menu" value="appMainMenu" expand-type="popup">
    <template #logo><img height="28" src="icon.png" alt="Logo de la aplicación"/></template>
        <FileSubMenu @onSelect="e" />
        <EditorSubMenu @onSelect="e"/>
        <ProgrammingSubMenu @onSelect="e"/>
        
        <template #operations>
          <t-space class="over-bar" style="padding-right: 110px;">
            <RunButton class="op-button" :onClick="eClick(E.COMPILE_UPLOAD_EVENT)"></RunButton>
            <t-button shape="square" variant="text" class="op-button" :onClick="eClick(E.UNDO_EVENT)"><RollbackIcon /></t-button>
            <t-button shape="square" variant="text" class="op-button" :onClick="eClick(E.REDO_EVENT)"><RollfrontIcon/></t-button>
            <t-button :disabled="!project.allowsSave.value" variant="text" class="op-button" :onClick="eClick(E.SAVE_EVENT)">
              <SaveIcon/>
            </t-button>
            <ServerStatus></ServerStatus>
          </t-space>
          </template>
      </t-head-menu>
</template>

<style scoped>
  .menu {
    padding-left: 15px;
  }

  .over-bar {
    z-index: 2;
  }

  .titlebar {
    height: var(--td-comp-size-xxxl);
    user-select: none;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }

  .op-button {
    box-shadow: none;
  }
</style>