<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogDelete" persistent scrollable max-width="480">
      <v-card v-if="dialogDelete">
        <v-card-title class="headline">Hapus Ketidakhadiran</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                Apakah anda ingin menghapus ketidakhadiran ini?
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closeDialogButton">Batal</v-btn>
          <v-btn flat color="primary"
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
      dialogDelete: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({
      absences: 'absences/current'
    })
  },
  methods: {
    closeDialogButton () {
      this.dialogDelete = !this.dialogDelete
      this.resetAll()
    },
    postUpdate () {
      this.$store.commit('absences/clearRemoveError')
      this.$store.dispatch('absences/remove', this.absences._id)
        .then(response => {
          if (response) {
            this.dialogDelete = false
            this.resetAll()
          }
        })
    },
    resetAll () {
      this.$store.commit('absences/clearRemoveError')
    }
  },
  created () {
    this.$root.$on('opendialogDeleteAbsence', () => {
      this.dialogDelete = true
    })
  }
}
</script>