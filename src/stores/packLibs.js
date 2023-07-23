import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { installLibrariesUpdate } from "../helpers/arduinoCLILibraryService";
import { NotifyPlugin } from "tdesign-vue-next";

export const usePackLibsStore = defineStore('packLibs', () => {
    //Internal state
    const updating = ref(false);
    const installing = ref(false);
    const progress = ref(0);
    const totalProgress = ref(1);
    const message = ref("");

    //Getters
    const isUpdating = computed(() => updating);
    const isInstalling = computed(() => installing);
    const currentProgress = computed(() => {
        return Math.round((progress.value * 100) / totalProgress.value);
    });
    const currentMessage = computed(() => message);
    
    //Actions
    function resetStore(){
        //Reset store
        updating.value = false;
        installing.value = false;
        progress.value = 0;
        totalProgress.value = 1;
        message.value = "";
    }

    async function checkUpdates(){
        installLibrariesUpdate((e) => {
            switch (e.event) {
                case "startDownload": 
                    updating.value = true; 
                    message.value = "Descargando Pack de bibliotecas";
                    break;
                case "finishDownload": updating.value = false; break;
                case "progress": 
                    if(totalProgress.value != e.total) totalProgress.value = e.total;    
                    progress.value += + e.progress;
                    break;
                case "startInstall": 
                    installing.value = true;
                    message.value = "Instalando Pack de bibliotecas";
                    break;
                case "finishInstall": installing.value = false; break;
                default:
                    break;
            }
            console.log(e);
        }).then((result) => {
            if(!result) return; //the latest version is already installed
            NotifyPlugin('success', { 
                title: 'Actualización', 
                content: "El Pack de Bibliotecas se actualizó correctamente.",
                closeBtn: true,
                placement: 'bottom-right',
                duration: 5000
            });
        }).catch((e)=>{
            console.error(e);
            NotifyPlugin('error', { 
                title: 'Oops!!', 
                content: e.message,
                closeBtn: true,
                placement: 'bottom-right',
                duration: 5000
            });
        }).finally(() => {
            resetStore();
        });
    }
    
    return { isUpdating, isInstalling, currentProgress, currentMessage, checkUpdates };
});