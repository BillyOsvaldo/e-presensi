<template>
  <v-progress-linear v-if="isShow" height="3" v-bind:indeterminate="true"></v-progress-linear>
</template>

<script>
  export default {
    props: {
      isShow: Boolean
    }
  }
</script>

<style lang="sass" scoped>
  .progress-linear
    margin: 0px
    position: absolute
    top: 0
    width: 100%
</style>
