<script setup>
  import { NotifyPlugin } from "tdesign-vue-next";
  import E from "./NavEvents";
  
  //Stores
  import { useProjectStore } from "../../stores/project";
  import { useAppStore } from "../../stores/app";
  import { usePortStore } from "../../stores/port";
  const project = useProjectStore();
  const app = useAppStore();
  const ports = usePortStore();

  //UI components
  import ServerStatus from "./../ServerStatus.vue";
  import FileSubMenu from "./FileSubMenu.vue";
  import EditorSubMenu from "./EditorSubMenu.vue";
  import ProgrammingSubMenu from "./ProgrammingSubMenu.vue";
  import RunButton from "./RunButton.vue";
  import { RollbackIcon, RollfrontIcon, AppIcon, InfoCircleIcon } from "tdesign-icons-vue-next";
  import SaveButton from "./SaveButton.vue";
  import UserMenu from "./UserMenu.vue";
  import ReviewButton from "./ReviewButton.vue";
  import ExerciseButton from "./ExerciseButton.vue";

  const clickToSelect = (eventName) => () => {
    handleSelectedOption(eventName);
  };

  const handleRun = () => {
    project.run()
    .catch(e => {
      NotifyPlugin('error', { 
        title: 'Oops!!', 
        content: e.message,
        closeBtn: true,
        placement: 'bottom-right',
        duration: 5000
      });
    }); 
  };

  const handleSave = async () => {
    await project.save()
    .catch(e => {
      NotifyPlugin('error', { 
        title: 'Oops!!', 
        content: e.message,
        closeBtn: true,
        placement: 'bottom-right',
        duration: 5000
      });
    });
  }

  const handleSaveAndClose = async () => {
    await handleSave();
    project.close();
  };

  const handleDownload = async () => {
    await project.localSave()
    .catch(e => {
      NotifyPlugin('error', { 
        title: 'Oops!!', 
        content: e.message,
        closeBtn: true,
        placement: 'bottom-right',
        duration: 5000
      });
    });
  }

  const handleSelectedOption = (event) => {
    switch(event){
      case E.UNDO_EVENT: project.undo(); break;
      case E.REDO_EVENT: project.redo(); break;
      case E.TCODE_EVENT: project.toggleShowGeneratedCode(); break;
      case E.TTHEME_EVENT: app.toggleTheme(); break;

      case E.SAVE_EVENT: handleSave(); break;
      case E.SAVE_CLOSE_EVENT: handleSaveAndClose(); break;
      case E.DOWNLOAD_PROJECT_EVENT: handleDownload(); break;
      case E.FORCE_CLOSE_PROJECT_EVENT: project.close(true); break;

      case E.SEARCH_PORT_EVENT: ports.updateList(); break;
      case E.RUN_EVENT: handleRun(); break;

      case E.ABOUT_INFO_EVENT: app.toggleAboutDialog(); break;
      default: throw "Missing handler for " + event;
    }
  }
</script>

<template>
  <div data-tauri-drag-region class="titlebar"></div>

  <t-head-menu  class="menu" value="appMainMenu" expand-type="popup">
    <template #logo><img height="28" src="/icon.png" alt="Logo de la aplicación"/></template>

    <t-submenu title="Menú" class="over-bar">
      <template #icon><AppIcon /></template>
      <FileSubMenu @onSelect="handleSelectedOption" />
      <EditorSubMenu @onSelect="handleSelectedOption"/>
      <ProgrammingSubMenu @onSelect="handleSelectedOption"/>

      <t-menu-item :onClick="clickToSelect(E.ABOUT_INFO_EVENT)">
        <template #icon>
          <InfoCircleIcon></InfoCircleIcon>
        </template>
        Acerca de...
      </t-menu-item>
    </t-submenu>
         
    <template #operations>
      <t-space class="over-bar" style="padding-right: 110px;">
        <ReviewButton></ReviewButton>
        <ExerciseButton></ExerciseButton>
        <RunButton class="op-button" :onClick="clickToSelect(E.RUN_EVENT)"></RunButton>
        <t-button shape="square" variant="text" class="op-button" :onClick="clickToSelect(E.UNDO_EVENT)">
          <RollbackIcon />
        </t-button>
        <t-button shape="square" variant="text" class="op-button" :onClick="clickToSelect(E.REDO_EVENT)">
          <RollfrontIcon/>
        </t-button>
        <SaveButton :onClick="clickToSelect(E.SAVE_EVENT)"></SaveButton>
        <ServerStatus></ServerStatus>
        <UserMenu></UserMenu>
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