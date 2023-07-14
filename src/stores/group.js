import { defineStore } from "pinia";
import { GET_GROUP_DATA_URL, SET_GROUP_MEMBERS_URL } from "../config/globals";
import { computed, ref } from "vue";
import { useProjectStore } from "./project";

export const useGroupStore = defineStore("currentGroup", () => {
    //Stores
    const project = useProjectStore();

    //Properties
    const groupData = ref({});
    const loadingData = ref(false);

    //Getters
    const isLoading = computed(() => loadingData);
    const isLoggedIn = computed(() => {
        return groupData.value.groupID != undefined;
    });
    const projects = computed(() => {
        if(!groupData.value.projects) return [];
        return groupData.value.projects;
    });
    const name = computed(() => {
        if(!groupData.value.groupName) return "[Acceso Local]";
        return groupData.value.groupName;
    });
    const members = computed(() => {
        if(!groupData.value.members) return [];
        return groupData.value.members;
    })

    //Actions
    async function loadGroup(groupID){
        loadingData.value = true;

        const fetchedData = await fetch(GET_GROUP_DATA_URL.replace("%GID", groupID))
        .then(response => {
            console.log(response);
            if(response.status == 404){
                const e = new Error("El código de grupo ingresado no existe.");
                e.owned = true;
                throw e;
            }
            if(response.ok) return response.json();
            const e = new Error("Ingrese un código de grupo correcto.");
            e.owned = true;
            throw e;
        })
        .catch(e => {
            if(e.owned) throw e;
            throw new Error("No se pudo obtener la información del grupo. Reintente nuevamente.");
        })
        .finally(() => {
            loadingData.value = false;
        });

        groupData.value = fetchedData;
    }

    async function logout(){
        await project.close();
        groupData.value = {};
    }

    async function updateMembers(membersList){
        await fetch(SET_GROUP_MEMBERS_URL.replace("%GID", groupData.value.groupID), {
            method: "POST",
            body: JSON.stringify(membersList),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(()=>{
            groupData.value.members = membersList;
        }).catch(e=>{
            throw new Error("Falló el guardo de los integrantes.");
        });
    }

    return { name, members, isLoading, isLoggedIn, projects, loadGroup, updateMembers, logout};
});