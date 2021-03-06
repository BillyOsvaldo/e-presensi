<template>
  <v-app light v-bind="processData">
    <loader :isShow="isLoading" />
    <flash :isFlash="isFlashing" />
    <toolbarnav v-if="hasToolbarLoaded" />
    <subtoolbar v-if="hasSubToolbarLoaded" />
    <nuxt v-if="hasLoaded"/>
  </v-app>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import api from '../api/feathers-client'
import loader from '../components/apps/_loader'
import flash from '../components/apps/_flash'
import toolbarnav from '../components/apps/_toolbar_nav'
import subtoolbar from '../components/apps/_subtoolbar'
export default {
  data () {
    return {
      isLoading: false,
      isFlashing: false,
      verified: false,
      hasToolbarLoaded: false,
      hasSubToolbarLoaded: false,
      hasLoaded: false,
      hasMenuLoaded: false,
      hasUserLoading: false,
      hasUserLoaded: false
    }
  },
  components: {
    loader,
    flash,
    toolbarnav,
    subtoolbar
  },
  computed: {
    ...mapState({
      auth: 'auth',
      user: 'usersauthentication'
    }),
    ...mapGetters({
      dataUser: 'usersauthentication/current',
      menuList: 'menus/list'
    }),
    processData: function () {
      if (this.auth.publicPages.includes(this.$route.name)) {
        this.hasLoaded = true
      } else {
        this.hasLoaded = false
      }

      // start loading
      if (!this.hasMenuLoaded && !this.auth.publicPages.includes(this.$route.name)) {
        this.isLoading = true
        this.isFlashing = true
      }

      // init menu
      /* if (this.auth.user && !this.auth.publicPages.includes(this.$route.name)) {
        if (!this.hasMenuLoaded) {
          this.hasMenuLoaded = true
          this.initMenu()
        }
      } */

      // verified page
      if (this.menuList.length > 0 && this.$route.path) {
        let path = this.$route.path
        if (this.$route.params) {
          let replace = '/' + this.$route.params.id
          path = path.replace(replace, '')
        }
        let _checkMenu = this.menuList.find((item) => item.to === path)
        if (typeof _checkMenu !== 'object') {
          this.verified = false
          this.$router.push('/')
        } else {
          // remove absences if not have profile
          if (!this.dataUser.profile && this.$route.path === '/absences') {
            this.verified = false
            this.$router.push('/')
          } else {
            this.verified = true
          }
        }
      }

      // menu loaded
      if (this.verified && this.hasMenuLoaded) {
        this.isLoading = false
        this.isFlashing = false
        this.hasToolbarLoaded = true
        this.hasSubToolbarLoaded = true
        this.hasLoaded = true
      }
    }
  },
  methods: {
    initAuth () {
      if (this.auth.accessToken && this.dataUser) {
        // this.loadDataUser(this.dataUser)
      } else {
        if (this.auth.payload) {
          let params = {
            strategy: 'jwt',
            accessToken: this.auth.accessToken
          }
          api.authenticate(params).then(response => {
            this.$store.dispatch('usersauthentication/get', this.auth.payload.userId).then((user) => {
              // JWT authentication successful
              if (user) {
                this.preventAuth(user)
              }
            })
          })
        }
      }
    },
    initMenu (user) {
      let permission = null
      let role = null
      if (user.permissions && user.permissions.length > 0) {
        permission = user.permissions[0]._id
      }
      if (user.position && user.position.length > 0) {
        role = user.position.role[0]._id
      }
      let params = {
        query: {
          $or: [
            {permissions: permission},
            {roles: role},
            { $and: [ { roles: [] }, { permissions: [] } ] }
          ]
        }
      }
      this.$store.dispatch('menus/find', params)
        .then(response => {
          if (response) {
            // remove absences & myreport if not have profile
            if (!this.dataUser.profile) {
              let itemAbsences = response.data.find((i) => i.name === 'KetidakhadiranKu')
              this.$store.commit('menus/removeItem', itemAbsences)
              let itemPresensiKu = response.data.find((i) => i.name === 'PresensiKu')
              this.$store.commit('menus/removeItem', itemPresensiKu)
            }
            this.hasMenuLoaded = true
          }
        })
    },
    initAppList () {
      let params = {
        query: {
          status: true
        }
      }
      this.$store.dispatch('applists/find', params)
        .then(response => {
          response.data.forEach((item) => {
            var image = require('~/static/images/' + item.service + '.png')
            item.image = image
            this.$store.commit('applists/updateItem', item)
          })
        })
    },
    preventAuth (user) {
      if (user.profile === null &&
      user.permissions.length === 0 &&
      user.role.length === 0) {
        window.location = process.env.HOST_URL_SSO
      } else {
        this.initAppList()
        this.initMenu(user)
      }
    }
  },
  created () {
    this.initAuth()
    this.$store.commit('menus/clearAll')
  }
}
</script>

<style lang="sass">
  @import '../assets/styles/app.sass'
</style>
