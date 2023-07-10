import { defineStore } from "pinia"
import { ref, computed } from "vue";

import {getInstalledBoards} from "./../helpers/arduinoCLIService";

export const useBoardStore = defineStore('board', () => {
    //Properties
    const currentSelectedBoard = ref(undefined);
    const availableBoards = ref([]);
    const loading = ref(false);

    //Getters
    const installedBoards = computed(() => availableBoards.value);
  
    //Actions
    function updateList() {
        loading.value = true;
        getInstalledBoards().then(boards=>{
            availableBoards.value = boards;
        }).finally(()=>{
            loading.value = false;
        });
    }
  
    return {currentSelectedBoard, loading, installedBoards, updateList};
  })