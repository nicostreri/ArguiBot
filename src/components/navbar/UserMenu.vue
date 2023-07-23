<script setup>
    import { UserIcon } from 'tdesign-icons-vue-next';
    import { useGroupStore } from '../../stores/group';
    import { computed, ref } from 'vue';
    import { NotifyPlugin } from 'tdesign-vue-next';
    
    //Store
    const group = useGroupStore();

    //State
    const visibleMembersDialog = ref(false);
    const members = ref(group.members);

    //Handlers
    const handleLogout = () => {
        group.logout().catch(e => {
        NotifyPlugin('error', { 
            title: 'Oops!!', 
            content: e.message,
            closeBtn: true,
            placement: 'bottom-right',
            duration: 5000
        });
        });
    }

    const handleShowMembers = () => {
        visibleMembersDialog.value = true;
        members.value = group.members;
    }

    const handleSaveMembers = () => {
        visibleMembersDialog.value = false
        group.updateMembers(members.value).then(()=>{
            NotifyPlugin('success', { 
                title: 'Guardado', 
                content: "Integrantes actualizados.",
                closeBtn: true,
                placement: 'bottom-right',
                duration: 5000
            });
        }).catch(e=>{
            console.error(e);
            NotifyPlugin('error', { 
                title: 'Oops!!', 
                content: "Falló la actualización de los integrantes.",
                closeBtn: true,
                placement: 'bottom-right',
                duration: 5000
            });
        });
    }

    const options = computed(() => {
        return [
            { content: group.name, value: 1, disabled: true },
            { content: 'Ver integrantes', value: 2, onClick: handleShowMembers, divider: true },
            { content: 'Cerrar Sesión', value: 3, onClick: handleLogout },
        ]
    });
</script>

<template>
    <t-dropdown class="over-bar" :options="options" :min-column-width="125">
        <t-button shape="circle" variant="text">
            <t-avatar>
                <template #icon><UserIcon/></template>
            </t-avatar>
        </t-button>
    </t-dropdown>

    <t-dialog
      v-model:visible="visibleMembersDialog"
      attach="body"
      header="Integrantes del Grupo"
      destroy-on-close
      confirmBtn="Guardar"
      :cancelBtn="null"
      :on-confirm="handleSaveMembers"
    >
      <template #body>
        Completar los integrantes del grupo:
        <t-tagInput v-model="members" placeholder=""/>
        <br>
        Presionar <t-tag>Enter</t-tag> entre cada integrante.
      </template>
    </t-dialog>
</template>