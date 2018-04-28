<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogDelete" persistent scrollable max-width="360">
      <v-card v-if="dialogDelete">
        <v-card-title class="headline">Hapus Semua Pengguna</v-card-title>
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
            @click.native="processDelete">Hapus</v-btn>
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
      dialogDelete: false,
      value: 0,
      total: 0,
      disableBtn: false,
      finish: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({
      userData: 'usersauthentication/current',
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
      this.dialogDelete = !this.dialogDelete
      this.resetAll()
    },
    syncData () {
      let count = 0
      let timeout = 0
      // remove User
      this.machineUsersList.forEach((item) => {
        setTimeout(() => {
          count++
          this.value = Math.floor(count / this.total * 100)
          this.$store.dispatch('machinesusersmanagement/remove', item._id)
        }, (timeout++) * 1000)
      })
    },
    processDelete () {
      this.disableBtn = true
      let params = {
        query: {
          organization: this.userData.organization._id
        }
      }
      this.$store.dispatch('findmachinesusersbyorganization/find', params)
        .then(response => {
          this.total += response.total
          this.syncData()
        })
    },
    resetAll () {
      this.dialogDelete = false
      this.value = 0
      this.total = 0
      this.disableBtn = false
      this.finish = false
      this.$store.commit('machinesmanagement/clearRemoveError')
      this.$store.commit('findusersbyorganization/clearAll')
      this.$store.commit('findmachinesusersbyorganization/clearAll')
    }
  },
  created () {
    this.$root.$on('opendialogDeleteMachineUsers', () => {
      this.dialogDelete = true
    })
  }
}
</script>