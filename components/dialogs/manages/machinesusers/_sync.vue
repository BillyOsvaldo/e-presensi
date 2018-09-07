<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogSync" persistent scrollable max-width="360">
      <v-card v-if="dialogSync">
        <v-card-title class="headline">Sinkronisasi Pengguna</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 style="text-align: center;">
                <v-progress-circular
                  v-bind:size="100"
                  v-bind:width="15"
                  v-bind:rotate="90"
                  v-bind:value="value"
                  color="red"
                >
                  {{ (finish) ? 'OK' : value + '%' }}
                </v-progress-circular>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat v-if="!finish" @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1" v-if="!finish" :disabled="disableBtn"
            @click.native="processSync">Sinkronisasi</v-btn>
          <v-btn flat color="blue darken-1" v-if="finish"
            @click.native="closeDialogButton">Keluar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  data () {
    return {
      dialogSync: false,
      value: 0,
      total: 0,
      disableBtn: false,
      finish: false,
      userInMachines: [],
      userInServer: [],
      currentSync: {},
      onSyncUser: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({
      user: 'usersauthentication/current',
      usersList: 'findusersbyorganization/list',
      machineUsersList: 'findmachinesusersbyorganization/list'
    })
  },
  watch: {
    value (val) {
      if (val === 100) {
        setTimeout(() => {
          this.finish = true
        }, 600)
      }
    }
  },
  methods: {
    closeDialogButton () {
      this.dialogSync = !this.dialogSync
      this.resetAll()
    },
    async syncData () {
      // const sleep = ms => new Promise(res => setTimeout(res, ms))
      // add user and remove user
      let count = 0
      for (let item of this.usersList) {
        count++
        this.value = Math.floor(count / this.total * 100)
        console.log('item', item._id)
        console.log('compare', this.machineUsersList)
        if (!(this.machineUsersList.find((i) => i.user._id === item._id))) {
          console.log('add!!')
          let itemAdd = {
            user: item._id,
            organization: this.user.organizationuser.organization._id
          }
          await this.$store.dispatch('machinesusersmanagement/create', itemAdd)
          await this.sleep(500)
        }
      }

      for (let item of this.machineUsersList) {
        count++
        this.value = Math.floor(count / this.total * 100)
        if (!(this.usersList.find((i) => i._id === item.user._id))) {
          await this.$store.dispatch('machinesusersmanagement/remove', item._id)
          await this.sleep(500)
        }
      }
    },
    processSync () {
      this.disableBtn = true
      let params = {
        query: {
          'organization': this.user.organizationuser.organization._id
        }
      }
      this.$store.dispatch('findusersbyorganization/find', params)
        .then(response => {
          this.total += response.total
          this.$store.dispatch('findmachinesusersbyorganization/find', params)
            .then(response => {
              console.log('resp', response)
              this.total += response.total
              this.syncData()
            })
        })
    },
    resetAll () {
      this.dialogSync = false
      this.value = 0
      this.total = 0
      this.disableBtn = false
      this.finish = false
      this.$store.commit('machinesmanagement/clearRemoveError')
      this.$store.commit('findusersbyorganization/clearAll')
      this.$store.commit('findmachinesusersbyorganization/clearAll')
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },
  created () {
    this.$root.$on('openDialogSyncMachinesusers', () => {
      this.dialogSync = true
    })
  }
}
</script>