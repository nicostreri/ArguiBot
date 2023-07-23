import { defineStore } from "pinia"
import { ref, computed } from "vue";

import {getAvailablePorts} from "./../helpers/arduinoCLIService";

export const usePortStore = defineStore('port', () => {
    //Properties
    const currentSelectedPort= ref(undefined);
    const availablePorts = ref([]);
    const loading = ref(false);

    //Getters
    const connectedPorts = computed(() => availablePorts.value);
  
    //Actions
    function updateList() {
        loading.value = true;
        getAvailablePorts().then(ports => {
            availablePorts.value = ports;
            currentSelectedPort.value = undefined;
        }).finally(()=>{
            loading.value = false;
        });
    }
  
    return {currentSelectedPort, loading, connectedPorts, updateList};
  })