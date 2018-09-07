<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogCancel" persistent scrollable max-width="480">
      <v-card v-if="dialogCancel">
        <v-card-title class="headline">Batalkan Ketidakhadiran</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                Apakah anda ingin membatalkan ketidakhadiran ini?
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Keluar</v-btn>
          <v-btn flat color="primary"
            @click.native="postUpdate">Batalkan</v-btn>
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
      dialogCancel: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({
      absences: 'absencesmanagement/current'
    })
  },
  methods: {
    closeDialogButton () {
      this.dialogCancel = !this.dialogCancel
      this.resetAll()
    },
    postUpdate () {
      this.$store.commit('absencesmanagement/clearRemoveError')
      this.$store.dispatch('absencesmanagement/remove', this.absences._id)
        .then(response => {
          if (response) {
            this.dialogCancel = false
            this.resetAll()
          }
        })
    },
    resetAll () {
      this.$store.commit('absencesmanagement/clearRemoveError')
    }
  },
  created () {
    this.$root.$on('openDialogCancelAbsence', () => {
      this.dialogCancel = true
    })
  }
}
</script>