<template>
    <div data-tauri-drag-region class="titlebar"></div>
      <t-head-menu class="menu" value="item1" expand-type="popup">
        <template #logo>
          <img height="28" src="icon.png" alt="logo"/>
        </template>
        <t-submenu title="Archivo" class="over-bar">
          <template #icon>
            <t-icon name="file"/>
          </template>
          <t-menu-item :onClick="()=>{$emit('onSelect', 'file:save')}">Guardar</t-menu-item>
        </t-submenu>
        <t-submenu title="Editor" class="over-bar">
          <template #icon>
            <t-icon name="edit-1"/>
          </template>
          <t-menu-item :onClick="()=>{$emit('onSelect', 'editor:undo')}">Deshacer último cambio</t-menu-item>
          <t-menu-item :onClick="()=>{$emit('onSelect', 'editor:redo')}">Rehacer último cambio</t-menu-item>
          <t-menu-item :onClick="()=>{$emit('onSelect', 'editor:toggleCode')}">Ver/Ocultar código generado </t-menu-item>
          <t-menu-item :onClick="()=>{$emit('onSelect', 'editor:toggleTheme')}">Alternar apariencia visual</t-menu-item>
        </t-submenu>
        <t-menu-item value="item2" class="over-bar">Programación</t-menu-item>
        <template #operations>
          <a href="javascript:;" class="over-bar">
            <t-icon class="t-menu__operations-icon" name="rollback" :onClick="()=>{$emit('onSelect', 'editor:undo')}"/>
          </a>
          <a href="javascript:;" class="over-bar">
            <t-icon class="t-menu__operations-icon" name="rollfront" :onClick="()=>{$emit('onSelect', 'editor:redo')}"/>
          </a>
          <a href="javascript:;" class="over-bar">
            <t-icon class="t-menu__operations-icon" name="save" :onClick="()=>{$emit('onSelect', 'file:save')}"/>
          </a>
          
          <ServerStatus class="over-bar"></ServerStatus>
          
          <a href="javascript:;" class="window-button min-button"><t-icon class="t-menu__operations-icon" name="remove" :onClick="handleMinimize"/></a>
          <a href="javascript:;" class="window-button"><t-icon class="t-menu__operations-icon" name="rectangle" :onClick="handleMaximize"/></a>
          <a href="javascript:;" class="window-button"><t-icon class="t-menu__operations-icon" name="close" :onClick="handleClose"/></a>
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
  .window-button {
    padding-bottom: 30px;
    margin-right: -16px;
    z-index: 2;
  }

  .min-button{
    padding-left: 25px;
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
</style>

<script>
    //UI components
    import ServerStatus from "./ServerStatus.vue";

    //Tauri APIs
    import { appWindow } from '@tauri-apps/api/window'
    export default {
        components: {
            ServerStatus
        },
        methods: {
            handleMinimize(){
                appWindow.minimize();
            },
            handleMaximize(){
                appWindow.toggleMaximize()
            },
            handleClose(){
                appWindow.close()
            }
        },
        emits: ["onSelect"],
        data(){
          return {
            collapsed: true
          }
        }
    }
</script>