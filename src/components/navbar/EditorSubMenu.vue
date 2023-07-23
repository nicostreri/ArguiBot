<script setup>
  //UI Components
  import Divider from './Divider.vue';
  import { Edit1Icon } from 'tdesign-icons-vue-next';

  import E from './NavEvents';

  const props = defineProps(['availableBoards', 'availablePorts']);
  const emit = defineEmits(['onSelect']);
  const e = (eventName) => {
    emit('onSelect', eventName);
  }
</script>

<template>
  <t-submenu title="Editor" class="over-bar">
    <template #icon><Edit1Icon /></template>
    
    <t-menu-item :onClick="()=>{e(E.UNDO_EVENT)}">Deshacer último cambio</t-menu-item>
    <t-menu-item :onClick="()=>{e(E.REDO_EVENT)}">Rehacer último cambio</t-menu-item>
    <Divider/>
    <t-menu-item :onClick="()=>{e(E.TCODE_EVENT)}">Ver/Ocultar código generado </t-menu-item>
    <t-menu-item :onClick="()=>{e(E.TTHEME_EVENT)}">Alternar apariencia visual</t-menu-item>
  </t-submenu>
</template>