<template>
  <t-tooltip
    class="placement align"
    content="Estado de la conexión con el servidor"
    :overlay-style="{ width: '200px' }"
    placement="left"
    show-arrow
    :delay=2000
  >
    <a href="javascript:;"><t-icon :class="{'server-icon-online': status, 'server-icon-offline': !status}" name="server"/></a>
  </t-tooltip>
</template>

<style scoped>
  .server-icon-online {
    color: var(--td-success-color);
  }

  .server-icon-offline {
    color: var(--td-error-color)
  }
</style>

<script>
  export default {
    data() {
      return {
        status: navigator.onLine
      }
    },
    mounted() {
      window.addEventListener('online', this.updateOnlineStatus)
      window.addEventListener('offline', this.updateOnlineStatus)
    },
    beforeDestroy() {
      window.removeEventListener('online', this.updateOnlineStatus)
      window.removeEventListener('offline', this.updateOnlineStatus)
    },
    methods: {
      updateOnlineStatus(event){
        const { type } = event;
        this.status = type === 'online'
      }
    }
  }
</script>