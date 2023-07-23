<script setup>
    //Stores
    import { useProjectStore } from "../../stores/project";
    import { SaveIcon } from "tdesign-icons-vue-next";
    const project = useProjectStore();
    
    const props = defineProps(["onClick"]);
</script>

<template>
    <t-button v-if="!project.solvedCorrectly"
        :disabled="!project.allowsSave"
        :loading="project.isSaving"
        :shape="project.isSaving ? 'round' : 'circle'" 
        :onClick="props.onClick"
        class="op-button"
        :variant="project.isSaving ? 'outline' : 'text'"
    >
        <SaveIcon/>
    </t-button>

    <t-tooltip v-else class="op-button" content="Solucionado correctamente, no se permite modificar." placement="bottom">
        <t-button
            shape="circle"   
            variant="text"
        > 
            <SaveIcon/>
        </t-button>
    </t-tooltip>
</template>

<style scoped>
    .op-button {
        box-shadow: none;
    }
</style>