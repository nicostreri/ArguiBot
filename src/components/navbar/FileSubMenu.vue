<script setup>
  //UI Components
  import { FileIcon } from 'tdesign-icons-vue-next';
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

  //Handler
  const logout = () => {
    group.logout().catch(e => {
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

    <t-menu-item v-for="p in group.projects" :onClick="openProject(p.id)">{{ p.name }}</t-menu-item>

    <Divider></Divider>
    <t-menu-item :disabled="!project.allowsSave" :onClick="eClick(E.SAVE_CLOSE_EVENT)">Guardar y Cerrar proyecto</t-menu-item>
    <t-menu-item :disabled="!project.canBeClosed" :onClick="eClick(E.FORCE_CLOSE_PROJECT_EVENT)">
      Cerrar proyecto sin guardar
    </t-menu-item>
    <t-menu-item :onClick="logout">Cerrar Sesión</t-menu-item>
  </t-submenu>
</template>