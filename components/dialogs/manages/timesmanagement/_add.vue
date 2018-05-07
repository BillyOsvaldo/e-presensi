<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogAddTimesManage" persistent scrollable max-width="480">
      <v-card v-if="dialogAddTimesManage">
        <v-card-title class="headline">Tambah Pengelola Waktu</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap>
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
               <v-flex>
                <v-menu
                  ref="menu_timeIn"
                  lazy
                  :close-on-content-click="false"
                  v-model="menu_timeIn"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  :return-value.sync="timeIn"
                >
                  <v-text-field
                    slot="activator"
                    label="Jam Masuk"
                    v-model="timeIn"
                    v-validate="'required'"
                    data-vv-name="timeIn"
                    data-vv-as="timeIn"
                    prepend-icon="schedule"
                    validate-on-blur
                    readonly
                    @blur="onBlur('timeIn')"
                    :error-messages="errors.collect('timeIn')"
                  ></v-text-field>
                  <v-time-picker
                    format="24hr"
                    locale="id"
                    v-model="date_for_timeIn"
                    @input="timeIn = formatTime($event)">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu_timeIn = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu_timeIn.save(timeIn)">OK</v-btn>
                  </v-time-picker>
                </v-menu>
              </v-flex>
              <v-flex>
                <v-menu
                  ref="menu_timeOut"
                  lazy
                  :close-on-content-click="false"
                  v-model="menu_timeOut"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  :return-value.sync="timeOut"
                >
                  <v-text-field
                    slot="activator"
                    label="Jam Pulang"
                    v-model="timeOut"
                    v-validate="'required'"
                    data-vv-name="timeOut"
                    data-vv-as="timeOut"
                    prepend-icon="schedule"
                    validate-on-blur
                    readonly
                    @blur="onBlur('timeOut')"
                    :error-messages="errors.collect('timeOut')"
                  ></v-text-field>
                  <v-time-picker
                    format="24hr"
                    locale="id"
                    v-model="date_for_timeOut"
                    @input="timeOut = formatTime($event)">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu_timeOut = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu_timeOut.save(timeOut)">OK</v-btn>
                  </v-time-picker>
                </v-menu>
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
  import {formatFormDate, parseFormDate, formatFormTime, parseFormTime} from '~/utils/format'
  import {mapState, mapGetters} from 'vuex'
  moment.locale('id')
  const customHelptext = {
    en: {
      custom: {
        user: {
          required: 'Nama pengguna harus dipilih.'
        },
        startDate: {
          required: 'Tanggal Mulai harus diisi.'
        },
        endDate: {
          required: 'Tanggal Selesai harus diisi.'
        },
        timeIn: {
          required: 'Jam Masuk Harus diisi.'
        },
        timeOut: {
          required: 'Jam Pu Harus diisi.'
        }
      }
    }
  }

  export default {
    data: () => ({
      dialogAddTimesManage: false,
      loading: false,
      menu_startDate: false,
      date_for_startDate: null,
      startDate: null,
      menu_endDate: false,
      date_for_endDate: null,
      endDate: null,
      menu_timeIn: false,
      date_for_timeIn: null,
      timeIn: null,
      menu_timeOut: false,
      date_for_timeOut: null,
      timeOut: null
    }),
    computed: {
      ...mapState({
      }),
      ...mapGetters({
      }),
      minDate () {
        return parseFormDate(this.startDate)
      }
    },
    methods: {
      closedialogAddButton () {
        this.dialogAddTimesManage = !this.dialogAddTimesManage
        this.resetAll()
      },
      postCreated () {
        setTimeout(() => {
          this.$validator.validateAll()
            .then((result) => {
              if (result) {
                let newTimesManage = {
                  startDate: parseFormDate(this.startDate),
                  endDate: parseFormDate(this.endDate),
                  timeIn: parseFormTime(this.timeIn),
                  timeOut: parseFormTime(this.timeOut)
                }
                this.$store.dispatch('timesmanagement/create', newTimesManage)
                  .then(response => {
                    if (response) {
                      this.dialogAddTimesManage = false
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
      formatTime (value) {
        return formatFormTime(value)
      },
      onBlur (field) {
        setTimeout(() => this.$validator.validate(field), 500)
      },
      resetAll () {
        this.$store.commit('timesmanagement/clearCreateError')
        this.$validator.reset()
        this.menu_startDate = false
        this.date_for_startDate = null
        this.startDate = null
        this.menu_endDate = false
        this.date_for_endDate = null
        this.endDate = null
        this.timeIn = null
        this.timeOut = null
        this.menu_timeIn = false
        this.menu_timeOut = false
      }
    },
    created () {
      this.$root.$on('openDialogAddTimesManage', () => {
        this.dialogAddTimesManage = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
