<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAdd" persistent scrollable max-width="480">
      <v-card v-if="dialogAdd">
        <v-card-title class="headline">Tambah Ketidakhadiran</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select
                  autofocus
                  label="Pilih Jenis Ketidakhadiran"
                  autocomplete
                  v-bind:items="item_absencestypes"
                  item-text="absencestype"
                  v-validate="'required'"
                  data-vv-name="absencestype"
                  :error-messages="errors.collect('absencestype')"
                  v-model="absencestype"
                ></v-select>
              </v-flex>
              <v-flex>
                <v-menu
                  ref="menu_startDate"
                  lazy
                  :close-on-content-click="false"
                  v-model="menu_startDate"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  :return-value.sync="startDate"
                >
                  <v-text-field
                    slot="activator"
                    label="Mulai Tanggal"
                    v-model="startDate"
                    v-validate="'required'"
                    data-vv-name="startDate"
                    data-vv-as="startDate"
                    prepend-icon="event"
                    validate-on-blur
                    readonly
                    @blur="onBlur('startDate')"
                    :error-messages="errors.collect('startDate')"
                  ></v-text-field>
                  <v-date-picker
                    locale="id"
                    v-model="date_for_startDate"
                    @input="startDate = formatDate($event)">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu_startDate = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu_startDate.save(startDate)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex>
                <v-menu
                  ref="menu_endDate"
                  lazy
                  :close-on-content-click="false"
                  v-model="menu_endDate"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  :return-value.sync="endDate"
                >
                  <v-text-field
                    slot="activator"
                    label="Selesai Tanggal"
                    v-model="endDate"
                    v-validate="'required'"
                    data-vv-name="endDate"
                    data-vv-as="endDate"
                    prepend-icon="event"
                    validate-on-blur
                    readonly
                    @blur="onBlur('endDate')"
                    :error-messages="errors.collect('endDate')"
                  ></v-text-field>
                  <v-date-picker
                    locale="id"
                    :min="minDate"
                    v-model="date_for_endDate"
                    @input="endDate = formatDate($event)">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu_endDate = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu_endDate.save(endDate)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-model="desc"
                  v-validate="'required'"
                  data-vv-name="desc"
                  label="Deskripsi Ketidakhadiran"
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
  import moment from 'moment'
  import {formatFormDate, parseFormDate} from '~/utils/format'
  import {mapState, mapGetters} from 'vuex'
  moment.locale('id')
  const customHelptext = {
    en: {
      custom: {
        startDate: {
          required: 'Tanggal Mulai harus diisi.'
        },
        endDate: {
          required: 'Tanggal Selesai harus diisi.'
        },
        absencestype: {
          required: 'Jenis Ketidakhadiran harus dipilih.'
        },
        desc: {
          required: 'Deskripsi Ketidakhadiran harus diisi.'
        }
      }
    }
  }

  export default {
    data: () => ({
      dialogAdd: false,
      loading: false,
      search: null,
      absencestype: null,
      desc: null,
      menu_startDate: false,
      date_for_startDate: null,
      startDate: null,
      menu_endDate: false,
      date_for_endDate: null,
      endDate: null
    }),
    computed: {
      ...mapState({
      }),
      ...mapGetters({
        dataUser: 'usersauthentication/current',
        absencestypesselect: 'absencestypesselect/list'
      }),
      minDate () {
        return parseFormDate(this.startDate)
      },
      item_absencestypes () {
        let _output = []
        if (this.absencestypesselect.length > 0) {
          this.absencestypesselect.forEach((item) => {
            let data = {
              _id: item._id,
              absencestype: item.name
            }
            _output.push(data)
          })
        }
        return _output
      }
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
                let newAbsence = {
                  user: this.dataUser._id,
                  absencestype: this.absencestype,
                  startDate: parseFormDate(this.startDate),
                  endDate: parseFormDate(this.endDate),
                  desc: this.desc,
                  status: false
                }
                this.$store.dispatch('absencesmanagement/create', newAbsence)
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
      formatDate (value) {
        return formatFormDate(value)
      },
      onBlur (field) {
        setTimeout(() => this.$validator.validate(field), 500)
      },
      resetAll () {
        this.$store.commit('absencesmanagement/clearCreateError')
        this.$validator.reset()
        this.search = null
        this.absencestype = null
        this.desc = null
        this.menu_startDate = false
        this.date_for_startDate = null
        this.startDate = null
        this.menu_endDate = false
        this.date_for_endDate = null
        this.endDate = null
      }
    },
    created () {
      this.$root.$on('openDialogAddAbsence', () => {
        this.dialogAdd = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
