<template>
  <section class="flash_container" v-if="isFlash">
    <img width="120" src="../../static/images/logo_purbalingga.png" />
  </section>
</template>

<script>
  export default {
    props: {
      isFlash: Boolean
    }
  }
</script>

<style scoped lang="sass">
  .flash_container
    justify-content: center
    align-items: center
    text-align: center
    min-height: 100vh
    display: flex
</style>
