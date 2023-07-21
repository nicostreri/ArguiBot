<script setup>
  //UI Components
  import { ErrorCircleIcon } from 'tdesign-icons-vue-next';

  import { computed } from 'vue';
  const props = defineProps(['title', 'options', 'modelValue', 'loading']);
  const emit = defineEmits(['update:modelValue']);

  const currentValue = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value)
    }
  });
</script>

<template>
  <t-submenu>
    <template #title>
      <span>{{ title }}</span>
    </template>

    <!-- Show loading -->
    <t-space v-if="loading" class="size-space">
      <t-loading size="small" text="Cargando datos"></t-loading>
    </t-space>
    
    <!-- Render items -->
    <t-space v-if="!loading" class="radio-list size-space">
      <template v-if="!options.length"><ErrorCircleIcon size="large"/>Sin datos</template>

      <t-radio-group v-model="currentValue">
        <t-menu-item v-for="item in options">
          <t-radio :value="item.key">{{ item.name }}</t-radio>
        </t-menu-item>
      </t-radio-group>
    </t-space>
  </t-submenu>
</template>

<style scoped>
  .size-space{
    min-width: 150px;
  }
  .radio-list{
    overflow: auto;
    max-height: 300px;
  }

  .radio-list::-webkit-scrollbar{
    width: 6px;
    background: transparent;
  }

  .radio-list::-webkit-scrollbar-thumb {
    background-color: #e4e4e4;
    border-radius: 100px;
  }

  .radio-list::-webkit-scrollbar-track{
    border-radius: 6px;
    border: 4px solid transparent;
    background-clip: content-box;
    background-color: transparent;
  }
</style>