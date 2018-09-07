<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogDeleteMenus" persistent scrollable max-width="480">
      <v-card v-if="dialogDeleteMenus">
        <v-card-title class="headline">Hapus Menu</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container>
            <v-layout wrap>
              <v-flex xs12>
                Apakah anda ingin menghapus menu ini?
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
      dialogDeleteMenus: false
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters({
      menusmanagement: 'menusmanagement/current'
    })
  },
  methods: {
    closeDialogButton () {
      this.dialogDeleteMenus = !this.dialogDeleteMenus
      this.resetAll()
    },
    postUpdate () {
      this.$store.commit('menusmanagement/clearRemoveError')
      this.$store.dispatch('menusmanagement/remove', this.menusmanagement._id)
        .then(response => {
          if (response) {
            this.dialogDeleteMenus = false
            this.resetAll()
          }
        })
    },
    resetAll () {
      this.$store.commit('menusmanagement/clearRemoveError')
    }
  },
  created () {
    this.$root.$on('openDialogDeleteMenus', () => {
      this.dialogDeleteMenus = true
    })
  }
}
</script>