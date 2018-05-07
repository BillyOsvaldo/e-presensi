<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogDeleteTimesManage" persistent scrollable max-width="480">
      <v-card v-if="dialogDeleteTimesManage">
        <v-card-title class="headline">Hapus Pengelola Waktu</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                Apakah anda ingin menghapus jenis pengelola waktu ini?
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postUpdate">Hapus</v-btn>
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
      dialogDeleteTimesManage: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({
      timesmanagement: 'timesmanagement/current'
    })
  },
  methods: {
    closeDialogButton () {
      this.dialogDeleteTimesManage = !this.dialogDeleteTimesManage
      this.resetAll()
    },
    postUpdate () {
      this.$store.commit('timesmanagement/clearRemoveError')
      this.$store.dispatch('timesmanagement/remove', this.timesmanagement._id)
        .then(response => {
          if (response) {
            this.dialogDeleteTimesManage = false
            this.resetAll()
          }
        })
    },
    resetAll () {
      this.$store.commit('timesmanagement/clearRemoveError')
    }
  },
  created () {
    this.$root.$on('openDialogDeleteTimesManage', () => {
      this.dialogDeleteTimesManage = true
    })
  }
}
</script>