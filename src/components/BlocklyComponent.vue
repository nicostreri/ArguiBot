<script setup>
import { onMounted, ref, shallowRef } from "vue";
import * as Blockly from "blockly";

// Internal state
const blocklyToolbox = ref();
const blocklyDiv = ref();
const workspace = shallowRef();

// Component API
const props = defineProps(["options"]);
const emit = defineEmits(['change']);

// Methods
const getBlocklyOptions = () => {
  const options = props.options || {};
  if (!options.toolbox) {
    options.toolbox = blocklyToolbox.value;
  }
  return options;
};

const handleWorkspaceChange = (event) => {
  if(event.isUiEvent) return;
  emit("change", workspace.value);
};

const undo = () => {
  workspace.value.undo();
};

const redo = () => {
  workspace.value.undo(true);
};

const notifyChange = () => {
  setTimeout(() => {
    Blockly.svgResize(workspace.value);
  }, 50);
  emit("change", workspace.value);
}

onMounted(() => {
  const wrkspace = Blockly.inject(blocklyDiv.value, getBlocklyOptions());
  wrkspace.addChangeListener(Blockly.Events.disableOrphans);
  wrkspace.addChangeListener(handleWorkspaceChange);
  Blockly.serialization.workspaces.load(
    {blocks: {blocks: [{'type': 'board_setup_loop'}]}},
    wrkspace
  );

  workspace.value = wrkspace;
});

defineExpose({undo, redo, notifyChange});
</script>

<template>
  <div>
    <div ref="blocklyDiv" class="blocklyDiv" ></div>
    <xml ref="blocklyToolbox" style="display: none"><slot></slot></xml>
  </div>
</template>

<style scoped>
  .blocklyDiv {
    height: 100%;
    width: 100%;
    text-align: left;
  }
</style>