<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogDelete" persistent scrollable max-width="480">
      <v-card v-if="dialogDelete">
        <v-card-title class="headline">Hapus Jenis Ketidakhadiran</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                Apakah anda ingin menghapus jenis ketidakhadiran ini?
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
      dialogDelete: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({
      absencestypesmanagement: 'absencestypesmanagement/current'
    })
  },
  methods: {
    closeDialogButton () {
      this.dialogDelete = !this.dialogDelete
      this.resetAll()
    },
    postUpdate () {
      this.$store.commit('absencestypesmanagement/clearRemoveError')
      this.$store.dispatch('absencestypesmanagement/remove', this.absencestypesmanagement._id)
        .then(response => {
          if (response) {
            this.dialogDelete = false
            this.resetAll()
          }
        })
    },
    resetAll () {
      this.$store.commit('absencestypesmanagement/clearRemoveError')
    }
  },
  created () {
    this.$root.$on('opendialogDeleteAbsenceType', () => {
      this.dialogDelete = true
    })
  }
}
</script>