<script setup>
    import { onMounted } from 'vue';

    //Views
    import ProjectView from './views/ProjectView.vue';
    import GroupForm from './views/GroupForm.vue';

    //Components
    import WindowButtons from "./components/WindowButtons.vue";
    import AboutDialog from "./components/AboutDialog.vue";
    import PackLibrariesUpdateViewer from "./components/PackLibrariesUpdateViewer.vue";

    //Stores
    import { useGroupStore } from './stores/group';
    import { useAppStore } from './stores/app';
    const group = useGroupStore();
    const app = useAppStore();

    onMounted(()=>{
        app.onStartVue();
    });
</script>
<template>
    <WindowButtons></WindowButtons>
    <AboutDialog></AboutDialog>

    <ProjectView v-if="group.isLoggedIn"></ProjectView>
    <GroupForm v-if="!group.isLoggedIn"></GroupForm>

    <PackLibrariesUpdateViewer></PackLibrariesUpdateViewer>
</template>