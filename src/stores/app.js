/**
 * Global App settings
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import { useBoardStore } from "./board";
import { usePortStore } from "./port";
import { usePackLibsStore } from "./packLibs";

//Tauri APIs
import { invoke } from "@tauri-apps/api";

export const useAppStore = defineStore('app', () => {
    //Used stores
    const board = useBoardStore();
    const port = usePortStore();
    const packLibs = usePackLibsStore();

    //Properties
    const isDarkTheme = ref(false);

    //Getters
    //...
    
    //Actions
    function toggleDarkTheme(enableDarkTheme){
        if(enableDarkTheme){
            document.documentElement.setAttribute('theme-mode', 'dark');
        }else{
            document.documentElement.removeAttribute('theme-mode');
        }
    }

    function startApp(){
        toggleDarkTheme(isDarkTheme.value);
        board.updateList();
        port.updateList();
        packLibs.checkUpdates();
    }

    function toggleTheme(){
        isDarkTheme.value = !isDarkTheme.value;
        toggleDarkTheme(isDarkTheme.value);
    }

    function onStartVue(){
        invoke('close_splashscreen');
    }

    return {isDarkTheme, startApp, toggleTheme, onStartVue};
},
{
    persist: true
});