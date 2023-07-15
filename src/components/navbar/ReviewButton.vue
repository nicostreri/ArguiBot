<script setup>
    //UI Components
    import {BrowseIcon} from "tdesign-icons-vue-next";
    import {NotifyPlugin} from "tdesign-vue-next";

    //Stores
    import { useProjectStore } from '../../stores/project';
    const project = useProjectStore();

    //Internal state
    import {ref} from 'vue';
    const visibleReviewDialog = ref(false);

    const handleViewButton = () => {
        visibleReviewDialog.value = true;
    }

    const handleMarkForReview = () => {
        visibleReviewDialog.value = false;
        project.markForReview()
        .then(()=>{
            NotifyPlugin('success', { 
                title: 'Genial!!', 
                content: "Enviado para ser revisado nuevamente.",
                closeBtn: true,
                placement: 'bottom-right',
                duration: 5000
            });
        })
        .catch(e=>{
            NotifyPlugin('error', { 
                title: 'Oops!!', 
                content: e.message,
                closeBtn: true,
                placement: 'bottom-right',
                duration: 5000
            });
        });
    }
</script>
<template>
    <t-button v-if="project.hasReview" :onClick="handleViewButton"
        shape="round" theme="warning" variant="outline"
    >
        <template #icon><BrowseIcon/></template> Ver revisión del docente
    </t-button>

    <t-dialog
      v-model:visible="visibleReviewDialog"
      attach="body"
      header="Revisión del Docente"
      destroy-on-close
      confirmBtn="Enviar a revisión nuevamente"
      cancelBtn="Cerrar"
      :on-confirm="handleMarkForReview"
    >
      <template #body>
        {{ project.reviewComment }}
      </template>
    </t-dialog>
</template>