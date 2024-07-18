/**
 * Global App settings
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import { useBoardStore } from "./board";
import { usePortStore } from "./port";
import { useProjectStore } from "./project";
import { usePackLibsStore } from "./packLibs";

//Tauri APIs
import { invoke } from "@tauri-apps/api";

export const useAppStore = defineStore('app', () => {
    //Used stores
    const board = useBoardStore();
    const port = usePortStore();
    const packLibs = usePackLibsStore();
    const project = useProjectStore();

    //Properties
    const isDarkTheme = ref(false);
    const aboutDialogOpenned = ref(false);

    //Getters
    //...
    
    //Actions
    function initAutoSave(){
        setInterval(() => {
            console.log("Start auto save...");
            project.save().then(() => {
                console.log("Auto saved!");
            }).catch((e) => {
                console.log("Fail auto save", e);
            });
        }, 30000);
    }

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
        initAutoSave();
    }

    function toggleTheme(){
        isDarkTheme.value = !isDarkTheme.value;
        toggleDarkTheme(isDarkTheme.value);
    }

    function toggleAboutDialog(){
        aboutDialogOpenned.value = !aboutDialogOpenned.value;
        console.log(aboutDialogOpenned);
    }

    function onStartVue(){
        setTimeout(() => {
            invoke('close_splashscreen');
        }, 5000);
    }

    return {isDarkTheme, aboutDialogOpenned, startApp, toggleTheme, toggleAboutDialog, onStartVue};
},
{
    persist: true
});