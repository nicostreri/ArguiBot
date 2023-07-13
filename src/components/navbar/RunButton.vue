<script setup>
    //Stores
    import { useProjectStore } from "../../stores/project";
    import { PlayIcon, CheckIcon } from "tdesign-icons-vue-next";
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
            <PlayIcon size="25px"></PlayIcon>
            <!-- <PlayIcon name="play"/> -->
        </t-button>
    </template>
    <template v-else>
        <t-button
            :disabled="!project.allowsRun.value"
            shape="circle" 
            theme="success"
            :onClick="props.onClick"
        >
            <CheckIcon size="20px"/>
        </t-button>
    </template>
</template>