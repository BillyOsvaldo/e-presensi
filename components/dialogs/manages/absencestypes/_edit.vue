<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEdit" persistent scrollable max-width="480">
      <v-card v-if="dialogEdit">
        <v-card-title class="headline">Ubah Jenis Ketidakhadiran</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap  v-bind="loadData">
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
          <v-btn flat @click.native="closedialogEditButton">Batal</v-btn>
          <v-btn flat color="primary"
            @click.native="postCreated">Ubah</v-btn>
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
      dialogEdit: false,
      loading: false,
      search: null,
      name: null,
      desc: null
    }),
    computed: {
      ...mapState({
      }),
      ...mapGetters({
        absencetype: 'absencestypesmanagement/current'
      }),
      loadData () {
        if (this.dialogEdit) {
          this.$validator.reset()
          this.name = (typeof this.absencetype.name === 'undefined') ? '' : this.absencetype.name
          this.desc = (typeof this.absencetype.desc === 'undefined') ? '' : this.absencetype.desc
        }
      }
    },
    methods: {
      closedialogEditButton () {
        this.dialogEdit = !this.dialogEdit
        this.resetAll()
      },
      postCreated () {
        setTimeout(() => {
          this.$validator.validateAll()
            .then((result) => {
              if (result) {
                let data = {
                  name: this.name,
                  desc: this.desc
                }
                let params = {}
                this.$store.commit('absencestypesmanagement/clearPatchError')
                this.$store.dispatch('absencestypesmanagement/patch', [this.absencetype._id, data, params])
                  .then(response => {
                    if (response) {
                      this.dialogEdit = false
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
        this.$store.commit('absencestypesmanagement/clearPatchError')
        this.$validator.reset()
        this.name = null
        this.search = null
        this.desc = null
      }
    },
    created () {
      this.$root.$on('opendialogEditAbsenceType', () => {
        this.dialogEdit = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
