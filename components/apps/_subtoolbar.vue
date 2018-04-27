<template>
  <div class="subtoolbar">
    <v-toolbar flat light color="white" style="padding: 0 8px;">
      <v-toolbar-title>{{ this.menu.name }}<span v-if="count" class="count">({{count}})</span></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="white--text">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider/>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters({
      menuList: 'menus/list',
      count: 'navigationCount'
    }),
    menu () {
      return this.menuList.find((item) => item.to === this.$route.path)
    }
  }
}
</script>
<style lang="sass" scoped>
  .count
    font-size: 17px
    font-weight: 400
    font-style: italic
    margin-left: 4px
</style>