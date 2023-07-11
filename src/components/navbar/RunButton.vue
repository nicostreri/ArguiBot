<script setup>
    //Stores
    import { useProjectStore } from "../../stores/project";
    const project = useProjectStore();
    
    const props = defineProps(["onClick"]);
</script>

<template>
    <template v-if="!project.ranSuccessfullyRecently.value">
        <t-button
            :disabled="!project.allowsRun.value"
            :loading="project.isRunning.value"
            :shape="project.isRunning.value ? 'round' : 'circle'" 
            :onClick="props.onClick"
        >
            <t-icon size="25px" name="play"/>
        </t-button>
    </template>
    <template v-else>
        <t-button
            :disabled="!project.allowsRun.value"
            shape="circle" 
            theme="success"
            :onClick="props.onClick"
        >
            <t-icon size="25px" name="check"/>
        </t-button>
    </template>
</template>