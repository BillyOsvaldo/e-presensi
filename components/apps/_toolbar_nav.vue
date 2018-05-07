<template>
  <div>
    <v-toolbar flat dark color="primary" style="padding: 0 8px;">
      <v-toolbar-side-icon @click.stop="isOpen = !isOpen"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">{{appName}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="white--text">
        <v-icon>search</v-icon>
      </v-btn>
      <v-menu
        offset-x
        :close-on-content-click="false"
        :nudge-width="300"
        absolute
        v-model="menuApps"
      >
        <v-btn slot="activator" icon color="white--text">
          <v-icon>apps</v-icon>
        </v-btn>
        <v-card>
          <v-list>
            
          </v-list>
        </v-card>
      </v-menu>
      <v-menu
        offset-x
        :close-on-content-click="false"
        :nudge-width="300"
        absolute
        v-model="menuProfile"
      >
        <v-avatar slot="activator" size="36px" style="margin: 0 16px; cursor: pointer;" class="grey">
          <span class="white--text headline">{{ avatarName }}</span>
        </v-avatar>
        <v-card>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <v-icon class="primary white--text">person</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ nameOfMenuProfile }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn depressed @click="toProfile">Ubah Profil</v-btn>
            <v-spacer></v-spacer>
            <v-btn depressed color="primary" @click="logoutAccount">Keluar</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>

    <v-navigation-drawer
        temporary
        v-model="isOpen"
        absolute
      >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title style="font-size: 24px;
            font-weight: 400;">{{appName}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0">
        <v-list-tile
        v-for="item in menuList"
        :key="item._id"
        ripple
        router
        :to="item.to"
        exact
        @click="">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
        appName: '',
        isOpen: null,
        menuProfile: false,
        menuApps: false
      }
    },
    computed: {
      ...mapGetters({
        menuapp: 'menus/list',
        user: 'usersauthentication/current'
      }),
      menuList () {
        let menu = this.menuapp.sort((a, b) => {
          return a.order - b.order
        })
        return menu
      },
      avatarName () {
        if (this.user.profile) {
          return this.user.profile.name.first_name.charAt(0).toUpperCase()
        } else {
          if (this.user) {
            return this.user.username.charAt(0).toUpperCase()
          }
        }
      },
      nameOfMenuProfile () {
        if (this.user.profile) {
          return this.user.profile.name.first_name + ' ' + this.user.profile.name.last_name
        } else {
          if (this.user) {
            return this.user.username.toUpperCase()
          }
        }
      }
    },
    methods: {
      ...mapActions('auth', ['logout']),
      logoutAccount () {
        this.menuProfile = false
        this.logout().then(() => {
          window.location = process.env.HOST_URL_SSO + '/signin'
        })
      },
      toProfile () {
        this.menuProfile = false
        window.location = process.env.HOST_URL_SSO + '/profile'
      }
    },
    created () {
      this.appName = process.env.APP_NAME
    }
  }
</script>

<style lang="sass">
  .pt-0
    margin-top: 16px
  .list__tile.list__tile--active
    color: rgba(0,0,0,0.87)
    opacity: 1
    background: #eee !important
  .list__tile--link:hover
    background: #f7f7f7
  .navigation-drawer__border
    display: none
</style>
