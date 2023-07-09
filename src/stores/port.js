import { defineStore } from "pinia"
import { ref, computed } from "vue";

export const usePortStore = defineStore('port', () => {
    //Properties
    const currentSelectedPort= ref(undefined);
    const availablePorts = ref([]);
    const loading = ref(false);

    //Getters
    const connectedPorts = computed(() => availablePorts.value);
  
    //Actions
    function updateList() {
        availablePorts.value = [{key:"Demo", name:"Puerto Demo"}];
    }
  
    return {currentSelectedPort, loading, connectedPorts, updateList};
  })