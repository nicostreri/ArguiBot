<script setup>
  import { ref, onMounted } from 'vue';
  import {licenses} from '../thirdPartyLicenses';

  //Stores
  import { useAppStore } from "../stores/app";
  const app = useAppStore();

  //Tauri APIs
  import { getName, getVersion } from '@tauri-apps/api/app';

  //Status
  const appName = ref('');
  const appVersion = ref('');

  //Methods
  const fetchAppData = async () => {
    try {
      const name = await getName();
      const version = await getVersion();
      appName.value = name;
      appVersion.value = version;
    } catch (error) {
      console.error('Error fetching app name:', error);
    }
  };

  const handleClose = () => {
    app.toggleAboutDialog();
  };

  onMounted(() => {
    fetchAppData();
  });
</script>

<template>
  <t-dialog
      v-model:visible="app.aboutDialogOpenned"
      attach="body"
      :header="appName"
      destroy-on-close
      confirmBtn="Cerrar"
      :on-confirm="handleClose"
      :cancelBtn="null"
    >
      <template #body>
        Versión instalada: <t-tag>{{ appVersion }}</t-tag>
        <br>
        Desarrollado por Streri Labs
        <br>
        Licencias de Terceros:
        <br>
        <t-list size="small">
          <t-list-item v-for="i in licenses">
            <t-link size="small" theme="default" :href="i.link" target="_blank">{{i.title}}</t-link>
          </t-list-item>
        </t-list>
      </template>
    </t-dialog>
</template>

<style scoped>
</style>