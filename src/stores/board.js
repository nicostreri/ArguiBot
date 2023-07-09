import { defineStore } from "pinia"
import { ref, computed } from "vue";

export const useBoardStore = defineStore('board', () => {
    //Properties
    const currentSelectedBoard = ref(undefined);
    const availableBoards = ref([]);
    const loading = ref(false);

    //Getters
    const installedBoards = computed(() => availableBoards.value);
  
    //Actions
    function updateList() {
        availableBoards.value = [{key:"Demo", name:"Demo Placa"}];
    }
  
    return {currentSelectedBoard, loading, installedBoards, updateList};
  })