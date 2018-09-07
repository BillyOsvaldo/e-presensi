<template>
  <div class="subtoolbar">
    <v-toolbar height="33" light color="white" style="padding: 0 8px;">
      <div v-if="this.breadcrumbs" style="margin: 0px">
        <v-breadcrumbs>
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item
            v-for="item in this.breadcrumbs"
            :disabled="item.disabled"
            :key="item.text"
            :to="item.to"
            exact
            ripple
          >
            {{ item.text }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </div>
    </v-toolbar>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters({
      menuList: 'menus/list',
      breadcrumbsLists: 'breadcrumbs'
    }),
    menu () {
      let path = this.$route.path
      if (this.$route.params) {
        let replace = '/' + this.$route.params.id
        path = path.replace(replace, '')
      }
      return this.menuList.find((item) => item.to === path)
    },
    breadcrumbs () {
      let items = []
      if (this.breadcrumbsLists.length > 0) {
        items = this.breadcrumbsLists
      } else {
        let item = {
          text: this.menu.name,
          disabled: false
        }
        items.push(item)
      }
      return items
    }
  }
}
</script>