<template>
  <div class="home">
    <v-container style="max-width: 100%;">
      <v-layout row wrap>
        <v-flex
          d-flex
          xs12 sm4 md3 lg2
          v-for="item in menuList"
          :key="item._id"
          style="padding: 16px;"
        >
          <v-card
            class="menu-item"
            flat
            tile
            exact
            :to="item.to">
            <div class="menu-item-content">
              <v-icon style="font-size: 54px;" :color="item.color">{{item.icon}}</v-icon>
              <div class="title-menu line-menu">{{item.name}}</div>
              <div class="desc-menu line-menu">{{item.desc}}</div>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters({
      menuapp: 'menus/list'
    }),
    menuList () {
      let menu = this.menuapp.sort((a, b) => {
        return a.order - b.order
      })
      return menu.filter(item => item.to !== '/')
    }
  },
  mounted () {
    this.$store.dispatch('setBreadcrumbs', [])
    this.$store.dispatch('setNavigationCount', 0)
  }
}
</script>

<style lang="sass" scoped>
  .home
    background: #fff
    overflow-y: scroll
    min-height: 100vh
    height: 100vh
</style>
<style lang="sass">
  .menu-item
    text-align: center
    padding: 16px
    cursor: pointer
    width: 196px
    &:hover
      background: #cccccc4d
  .menu-item-content
    p
      height: 36px
      font-size: 12px
</style>
