<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddMenus" persistent scrollable max-width="480">
      <v-card v-if="dialogAddMenus">
        <v-card-title class="headline">Tambah Menu</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Nama Menu"
                  :error-messages="errors.collect('name')"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="desc"
                  v-validate="'required'"
                  data-vv-name="desc"
                  label="Deskripsi"
                  :error-messages="errors.collect('desc')"></v-text-field>
              </v-flex>
              <v-flex sm6 style="text-align: center;">
                <v-icon
                  style="margin: auto;height: 100%;" 
                  x-large
                  :color="defaultcolor">{{defaulticon}}</v-icon>
              </v-flex>
              <v-flex sm6>  
                <v-flex xs12>
                  <v-text-field
                    v-model="icon"
                    label="Material Icon"
                    v-validate="'required'"
                    data-vv-name="icon"
                    :error-messages="errors.collect('icon')">
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="color"
                    label="Warna Icon Menu"
                    v-validate="'required'"
                    data-vv-name="color"
                    :error-messages="errors.collect('color')">
                  ></v-text-field>
                </v-flex>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="to"
                  label="Path Menu"
                  v-validate="'required'"
                  data-vv-name="to"
                  :error-messages="errors.collect('to')">
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="roles"
                  label="Roles"
                  multiple
                  chips
                  :items="itemsRoles">
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="permissions"
                  label="Permissions"
                  multiple
                  chips
                  :items="itemsPermissions">
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">Tambah</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
const customHelptext = {
  en: {
    custom: {
      name: {
        required: 'Nama Menu harus diisi'
      },
      desc: {
        required: 'Deskripsi harus diisi'
      },
      icon: {
        required: 'Nama Icon harus diisi.'
      },
      color: {
        required: 'Warna Icon harus diisi.'
      },
      to: {
        required: 'Path Menu harus diisi.'
      }
    }
  }
}

export default {
  data () {
    return {
      dialogAddMenus: false,
      defaulticon: 'home',
      defaultcolor: '',
      name: null,
      desc: null,
      icon: 'home',
      color: null,
      to: null,
      permissions: [],
      roles: []
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
      rolesselect: 'rolesselect/list',
      permissionsselect: 'permissionsselect/list'
    }),
    itemsRoles () {
      let _output = []
      if (this.rolesselect.length > 0) {
        this.rolesselect.forEach((role) => {
          _output.push(role.name)
        })
      }
      return _output
    },
    itemsPermissions () {
      let _output = []
      if (this.permissionsselect.length > 0) {
        this.permissionsselect.forEach((permission) => {
          _output.push(permission.administrator.name + ((permission.app === null) ? '' : ': ' + permission.app.name))
        })
      }
      return _output
    },
    roleList () {
      let output = []
      this.roles.forEach((name) => {
        let role = this.rolesselect.find((item) => item.name === name)
        output.push(role._id)
      })
      return output
    },
    permissionList () {
      let output = []
      this.permissions.forEach((name) => {
        let names = name.split(': ')
        if (names.length > 1) {
          let permission = this.permissionsselect.find((item) => (item.administrator.name === names[0] && item.app.name === names[1]))
          output.push(permission._id)
        } else {
          let permission = this.permissionsselect.find((item) => item.administrator.name === name)
          output.push(permission._id)
        }
      })
      return output
    }
  },
  watch: {
    icon (val) {
      if (val !== null) {
        this.defaulticon = val
      }
    },
    color (val) {
      if (val !== null) {
        this.defaultcolor = val
      }
    }
  },
  methods: {
    closeDialogButton () {
      this.dialogAddMenus = !this.dialogAddMenus
      this.resetAll()
    },
    postUpdate () {
      this.$validator.validateAll()
        .then((result) => {
          if (result) {
            let data = {
              name: this.name,
              desc: this.desc,
              icon: this.icon,
              color: this.color,
              to: this.to,
              roles: this.roleList,
              permissions: this.permissionList
            }
            this.$store.commit('menusmanagement/clearCreateError')
            this.$store.dispatch('menusmanagement/create', data)
              .then(response => {
                if (response) {
                  this.dialogAddMenus = false
                  this.resetAll()
                }
              })
          }
        })
    },
    resetAll () {
      this.$store.commit('menusmanagement/clearCreateError')
      this.$validator.reset()
      this.defaulticon = 'home'
      this.defaultcolor = ''
      this.name = null
      this.desc = null
      this.icon = 'home'
      this.color = null
      this.to = null
      this.permissions = []
      this.roles = []
    }
  },
  created () {
    this.$root.$on('openDialogAddMenus', () => {
      this.dialogAddMenus = true
    })
    this.$validator.localize(customHelptext)
  }
}
</script>

<style lang="sass">
</style>
