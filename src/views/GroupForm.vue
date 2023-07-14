<script setup>
    import { APP_COPYRIGHT_MSG } from '../config/globals';
    import { BrowseIcon } from 'tdesign-icons-vue-next';
    import { ref } from 'vue';
    import { NotifyPlugin } from 'tdesign-vue-next';
    import { Vue3Lottie } from 'vue3-lottie';

    import loginAnimation from "./../assets/animation_login.json";

    //Stores
    import { useAppStore } from '../stores/app';
    import { useGroupStore } from '../stores/group';
    const app = useAppStore();
    const group = useGroupStore();
    
    //Internal state
    const groupID = ref('');
    
    //Handlers
    const handleToggleTheme = () => {
        app.toggleTheme();
    }

    const handleEnterButton = () => {
        group.loadGroup(groupID.value).catch(e=>{
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
    <t-layout class="layout">
        <t-header data-tauri-drag-region>
            <t-head-menu class="navbar" value="groupFromView">
                <template #logo>
                    <img height="28" src="icon.png" alt="Logo de la aplicación"/>
                </template>
            </t-head-menu>
        </t-header>
        <t-content class="content">
            <t-space align="center" direction="vertical">
                <Vue3Lottie :animationData="loginAnimation" :height="200" :width="200" />
                <h1>Iniciar sesión para continuar</h1>
                <t-space>
                    <t-input class="input-group" v-model="groupID" clearable placeholder="Código de grupo" />
                    <t-button :loading="group.isLoading.value" :onClick="handleEnterButton">Ingresar</t-button>
                </t-space>
            </t-space>
        </t-content>
        <t-footer>
            <t-space align="center" :size="20">
                {{ APP_COPYRIGHT_MSG }}
                <t-button variant="outline" size="small" :onClick="handleToggleTheme">
                    <template #icon><BrowseIcon /></template>
                    Alternar apariencia visual
                </t-button>
            </t-space>
        </t-footer>
      </t-layout>
</template>

<style scoped>
    .layout {
        width: 100%;
        min-height: 100%; 
        position: absolute; 
    }

    .navbar {
        width: 25px;
        padding-left: 15px;
    }

    .input-group {
        max-width: 200px;
        min-width: 200px;
    }

    .content {
        width: 100%;
        height: 100%;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>