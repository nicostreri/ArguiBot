<script setup>
  //UI Components
  import { FileIcon } from 'tdesign-icons-vue-next';

  import E from './NavEvents';

  const emit = defineEmits(['onSelect'])
  const eClick = (eventName) => () => {
    emit('onSelect', eventName);
  }
</script>

<template>
  <t-submenu title="Archivo" class="over-bar">
    <template #icon><FileIcon /></template>
    
    <t-menu-item :onClick="eClick(E.SAVE_EVENT)">Guardar</t-menu-item>
  </t-submenu>
</template>