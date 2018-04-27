<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEdit" persistent scrollable max-width="480">
      <v-card v-if="dialogEdit">
        <v-card-title class="headline">Ubah Ketidakhadiran</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap v-bind="loadData">
              <v-flex xs12>
                <v-select
                  autofocus
                  label="Pilih Jenis Ketidakhadiran"
                  autocomplete
                  v-bind:items="item_absencestypes"
                  item-text="absencestype"
                  item-value="_id"
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
          <v-btn flat @click.native="closedialogEditButton">Batal</v-btn>
          <v-btn flat color="blue darken-1"
            @click.native="postCreated">Ubah</v-btn>
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
      dialogEdit: false,
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
        absences: 'absencesmanagement/current',
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
      },
      loadData () {
        if (this.dialogEdit) {
          this.$validator.reset()
          this.absencestype = (this.absences.absencestype) ? this.absences.absencestype._id : ''
          this.date_for_startDate = moment(this.absences.startDate).format('YYYY-MM-DD')
          this.startDate = (this.absences.startDate) ? formatFormDate(moment(this.absences.startDate).format('YYYY-MM-DD')) : ''
          this.date_for_endDate = moment(this.absences.endDate).format('YYYY-MM-DD')
          this.endDate = (this.absences.endDate) ? formatFormDate(moment(this.absences.endDate).format('YYYY-MM-DD')) : ''
          this.desc = (this.absences.desc) ? this.absences.desc : ''
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
                  user: this.dataUser._id,
                  absencestype: this.absencestype,
                  startDate: parseFormDate(this.startDate),
                  endDate: parseFormDate(this.endDate),
                  desc: this.desc,
                  status: false
                }
                let params = {}
                this.$store.commit('absencesmanagement/clearPatchError')
                this.$store.dispatch('absencesmanagement/patch', [this.absences._id, data, params])
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
      formatDate (value) {
        return formatFormDate(value)
      },
      onBlur (field) {
        setTimeout(() => this.$validator.validate(field), 500)
      },
      resetAll () {
        this.$store.commit('absencesmanagement/clearPatchError')
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
      this.$root.$on('openDialogEditAbsence', () => {
        this.dialogEdit = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
