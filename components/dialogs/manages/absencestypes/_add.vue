<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAdd" persistent scrollable max-width="480">
      <v-card v-if="dialogAdd">
        <v-card-title class="headline">Tambah Jenis Ketidakhadiran</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Jenis Ketidakhadiran"
                  :error-messages="errors.collect('name')"
                  ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="desc"
                  v-validate="'required'"
                  data-vv-name="desc"
                  label="Deskripsi"
                  :error-messages="errors.collect('desc')"
                  ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="closedialogAddButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postCreated">Tambah</v-btn>
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
          required: 'Nama Jenis Ketidakhadiran harus diisi.'
        },
        desc: {
          required: 'Deskripsi harus diisi.'
        }
      }
    }
  }

  export default {
    data: () => ({
      dialogAdd: false,
      loading: false,
      search: null,
      name: null,
      desc: null
    }),
    computed: {
      ...mapState({
      }),
      ...mapGetters({
      })
    },
    methods: {
      closedialogAddButton () {
        this.dialogAdd = !this.dialogAdd
        this.resetAll()
      },
      postCreated () {
        setTimeout(() => {
          this.$validator.validateAll()
            .then((result) => {
              if (result) {
                let newAbsenceType = {
                  name: this.name,
                  desc: this.desc
                }
                this.$store.dispatch('absencestypesmanagement/create', newAbsenceType)
                  .then(response => {
                    if (response) {
                      this.dialogAdd = false
                      this.resetAll()
                    }
                  })
              }
            })
        }, 100)
      },
      onBlur (field) {
        setTimeout(() => this.$validator.validate(field), 500)
      },
      resetAll () {
        this.$store.commit('absencestypesmanagement/clearCreateError')
        this.$validator.reset()
        this.name = null
        this.search = null
        this.desc = null
      }
    },
    created () {
      this.$root.$on('openDialogAddAbsenceType', () => {
        this.dialogAdd = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
