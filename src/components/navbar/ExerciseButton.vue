<script setup>
    //UI Components
    import { BrowseIcon } from "tdesign-icons-vue-next";
    import { NotifyPlugin } from "tdesign-vue-next";
    import { watch, ref } from "vue";

    //Stores
    import {useProjectStore} from "./../../stores/project";
    const project = useProjectStore();

    //Internal state
    const focusEffect = ref(false);

    const handleClick = async () => {
        project.showExerciseInstructions().catch((e) => {
            NotifyPlugin('error', { 
                title: 'Oops!!', 
                content: e.message,
                closeBtn: true,
                placement: 'bottom-right',
                duration: 5000
            });
        })
    }

    const sleep = function(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    watch(() => project.isProjectOpen, async () => {
        await sleep(500);
        for (let i = 0; i < 4; i++) {
            focusEffect.value = true;
            await sleep(500);
            focusEffect.value = false;
            await sleep(500);
        }
    });
</script>

<template>
    <t-button v-if="project.hasInstructions" shape="round" :variant="focusEffect ? 'base' : 'text'" :onClick="handleClick">
        <template #icon><BrowseIcon/></template>
        Consigna
    </t-button>
</template>