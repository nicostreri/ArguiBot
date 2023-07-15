<script setup>
  //UI Components
  import { FileIcon, ErrorCircleIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-vue-next';
  import Divider from "./Divider.vue";
  import { NotifyPlugin } from 'tdesign-vue-next';

  import E from './NavEvents';

  //Stores
  import { useProjectStore } from '../../stores/project';
  import { useGroupStore } from '../../stores/group';
  const project = useProjectStore();
  const group = useGroupStore();

  //Events
  const emit = defineEmits(['onSelect'])
  const eClick = (eventName) => () => {
    emit('onSelect', eventName);
  }

  const openProject = (id) => () => {
    project.open(id).catch(e => {
      NotifyPlugin('error', { 
        title: 'Oops!!', 
        content: e.message,
        closeBtn: true,
        placement: 'bottom-right',
        duration: 5000
      });
    });
  }

  
</script>

<template>
  <t-submenu title="Proyecto" class="over-bar">
    <template #icon><FileIcon /></template>

    <t-submenu title="Abrir proyecto en línea">
      <!-- Render items -->
      <t-space :size="4" direction="vertical" class="project-list size-space" >
        <template v-if="!group.projects.length">
          <t-space>
            <ErrorCircleIcon size="large"/>Sin proyectos disponibles.
          </t-space>
        </template>

        <t-menu-item v-for="p in group.projects" :onClick="openProject(p.id)">
            {{ p.name }} 
            <CheckCircleFilledIcon v-if="p.solvedCorrectly" style="color: var(--td-success-color)"/> 
            <ErrorCircleFilledIcon v-if="p.solvedWithError" style="color: var(--td-warning-color)"/>
        </t-menu-item>
      </t-space>
    </t-submenu>

    <Divider></Divider>
    <t-menu-item :disabled="!project.allowsSave || project.solvedCorrectly" :onClick="eClick(E.SAVE_CLOSE_EVENT)">Guardar y Cerrar proyecto</t-menu-item>
    <t-menu-item :disabled="!project.canBeClosed" :onClick="eClick(E.FORCE_CLOSE_PROJECT_EVENT)">
      Cerrar proyecto sin guardar
    </t-menu-item>
    <Divider/>
    <t-menu-item :disabled="!project.allowsSave" :onClick="eClick(E.DOWNLOAD_PROJECT_EVENT)">Descargar copia del proyecto</t-menu-item>
  </t-submenu>
</template>

<style scoped>
  .size-space{
    min-width: 250px;
  }
  .project-list{
    overflow: auto;
    max-height: 500px;
  }

  .project-list::-webkit-scrollbar{
    width: 6px;
    background: transparent;
  }

  .project-list::-webkit-scrollbar-thumb {
    background-color: #e4e4e4;
    border-radius: 100px;
  }

  .project-list::-webkit-scrollbar-track{
    border-radius: 6px;
    border: 4px solid transparent;
    background-clip: content-box;
    background-color: transparent;
  }
</style>