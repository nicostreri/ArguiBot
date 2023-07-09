<script setup>
  import E from "./NavEvents";

  //Store
  import {useBoardStore} from "./../../stores/board";
  import {usePortStore} from "./../../stores/port";
  const board = useBoardStore();
  const port = usePortStore();

  //UI Components
  import MenuRadioList from "./../MenuRadioList.vue";
  import Divider from "./Divider.vue";

  const emit = defineEmits(['onSelect']);
  const e = (eventName) => {
    emit('onSelect', eventName);
  }

 
</script>

<template>
  <t-submenu title="Programación" class="over-bar">
    <template #icon><t-icon name="edit-1"/></template>
    
    <MenuRadioList 
      title="Seleccionar Placa de Desarrollo" 
      :options="board.installedBoards" 
      v-model="board.currentSelectedBoard"
      :loading="board.loading"
      />
    <MenuRadioList 
      title="Seleccionar Puerto" 
      :options="port.connectedPorts" 
      v-model="port.currentSelectedPort"
      :loading="port.loading"
      />
    
    <Divider/>
    <t-menu-item :onClick="()=>{e(E.SEARCH_PORT_EVENT)}">Buscar puertos disponibles</t-menu-item>
    <t-menu-item :onClick="()=>{e(E.COMPILE_UPLOAD_EVENT)}">Compilar y Subir</t-menu-item>
  </t-submenu>
</template>