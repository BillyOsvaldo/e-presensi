<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAdd" persistent scrollable max-width="480">
      <v-card v-if="dialogAdd">
        <v-card-title class="headline">Tambah Mesin Presensi</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Nama Mesin"
                  :error-messages="errors.collect('name')"
                  ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="dev_id"
                  v-validate="'required'"
                  data-vv-name="dev_id"
                  label="Nomor Mesin"
                  :error-messages="errors.collect('dev_id')"
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
          required: 'Nama Mesin harus diisi.'
        },
        dev_id: {
          required: 'Nomor Mesin harus diisi.'
        }
      }
    }
  }

  export default {
    data: () => ({
      dialogAdd: false,
      email: null,
      loading: false,
      search: null,
      name: null,
      dev_id: null
    }),
    computed: {
      ...mapState({
      }),
      ...mapGetters({
        userData: 'usersauthentication/current'
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
                let newMachine = {
                  name: this.name,
                  organization: this.userData.organization._id,
                  dev_id: this.dev_id
                }
                this.$store.dispatch('machinesmanagement/create', newMachine)
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
        this.$store.commit('machinesmanagement/clearCreateError')
        this.$validator.reset()
        this.name = null
        this.search = null
        this.dev_id = null
      }
    },
    created () {
      this.$root.$on('openDialogAddMachines', () => {
        this.dialogAdd = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
