<script setup>
    //Stores
    import { useProjectStore } from "../../stores/project";
    import { SaveIcon } from "tdesign-icons-vue-next";
    const project = useProjectStore();
    
    const props = defineProps(["onClick"]);
</script>

<template>
    <t-button
        :disabled="!project.allowsSave"
        :loading="project.isSaving"
        :shape="project.isSaving ? 'round' : 'circle'" 
        :onClick="props.onClick"
        class="op-button"
        :variant="project.isSaving ? 'outline' : 'text'"
    >
        <SaveIcon/>
    </t-button>
</template>

<style scoped>
    .op-button {
        box-shadow: none;
    }
</style>