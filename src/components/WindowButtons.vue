<script setup>
  //Tauri APIs
  import { appWindow } from '@tauri-apps/api/window'

  //Methods
  const handleMinimize = () => {
    appWindow.minimize();
  };

  const handleMaximize = () => {
    appWindow.toggleMaximize()
  };
  
  const handleClose = () => {
    appWindow.close()
  };
</script>

<template>
  <div class="buttons">
    <t-button shape="square" variant="text" class="op-button"><t-icon name="remove" :onClick="handleMinimize"/></t-button>
    <t-button shape="square" variant="text" class="op-button"><t-icon name="rectangle" :onClick="handleMaximize"/></t-button>
    <t-button shape="square" variant="text" class="op-button"><t-icon name="close" :onClick="handleClose"/></t-button>      
  </div>
</template>

<style scoped>
  .buttons{
    z-index: 2;
    position: fixed;
    right: 0px;
    top: 0px;
    line-height: 1px;
  }

  .op-button {
    box-shadow: none;
  }
</style>