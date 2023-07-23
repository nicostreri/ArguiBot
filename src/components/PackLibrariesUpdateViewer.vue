<script setup>
import { usePackLibsStore } from "./../stores/packLibs";
const libs = usePackLibsStore();

</script>

<template>
    <t-message v-if="libs.isUpdating.value" class="viewer" :duration="0">
        <t-space>
            {{libs.currentMessage.value}}
            <div class="progressbar">
                <t-progress theme="line" :percentage="libs.currentProgress" />
            </div>
        </t-space>
    </t-message>
    <t-message v-if="libs.isInstalling.value" class="viewer" :duration="0">
        <t-space>
            {{libs.currentMessage.value}}
            <t-loading></t-loading>
        </t-space>
    </t-message>
</template>

<style scoped>
    .viewer {
        position: fixed;
        left: 10px;
        bottom: 10px;
        z-index: 100;
    }

    .progressbar {
        width: 200px
    }
</style>