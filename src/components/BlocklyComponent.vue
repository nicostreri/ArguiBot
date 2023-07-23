<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useProjectStore } from "../stores/project";

const project = useProjectStore();
const blocklyDiv = ref();

onMounted(() => {
  project.attach(blocklyDiv);
});

onUnmounted(() => {
  project.detach();
})
</script>

<template>
  <div>
    <div ref="blocklyDiv" class="blocklyDiv" ></div>
  </div>
</template>

<style scoped>
  .blocklyDiv {
    height: 100%;
    width: 100%;
    text-align: left;
  }
</style>