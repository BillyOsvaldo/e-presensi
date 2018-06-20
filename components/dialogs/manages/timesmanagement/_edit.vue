<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditTimesManage" persistent scrollable max-width="480">
      <v-card v-if="dialogEditTimesManage">
        <v-card-title class="headline">Ubah Pengelola Waktu</v-card-title>
          <v-card-text style="max-height: 300px;">
            <v-container grid-list-md>
              <v-layout wrap v-bind="loadData">
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
  import {formatFormDate, parseFormDate, formatFormTime, parseFormTime} from '~/utils/format'
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
      dialogEditTimesManage: false,
      loading: false,
      search: null,
      name: null,
      desc: null,
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
        timesManage: 'timesmanagement/current'
      }),
      minDate () {
        return parseFormDate(this.startDate)
      },
      loadData () {
        if (this.dialogEditTimesManage) {
          this.$validator.reset()
          this.date_for_startDate = moment(this.timesManage.startDate).format('YYYY-MM-DD')
          this.startDate = (this.timesManage.startDate) ? formatFormDate(moment(this.timesManage.startDate).format('YYYY-MM-DD')) : ''
          this.date_for_endDate = moment(this.timesManage.endDate).format('YYYY-MM-DD')
          this.endDate = (this.timesManage.endDate) ? formatFormDate(moment(this.timesManage.endDate).format('YYYY-MM-DD')) : ''
          this.timeIn = (typeof this.timesManage.timeIn === 'undefined') ? '' : this.timesManage.timeIn
          this.timeOut = (typeof this.timesManage.timeOut === 'undefined') ? '' : this.timesManage.timeOut
        }
      }
    },
    methods: {
      closedialogEditButton () {
        this.dialogEditTimesManage = !this.dialogEditTimesManage
        this.resetAll()
      },
      postCreated () {
        setTimeout(() => {
          this.$validator.validateAll()
            .then((result) => {
              if (result) {
                let data = {
                  startDate: parseFormDate(this.startDate),
                  endDate: parseFormDate(this.endDate),
                  timeIn: parseFormTime(this.timeIn),
                  timeOut: parseFormTime(this.timeOut)
                }
                let params = {}
                this.$store.commit('timesmanagement/clearPatchError')
                this.$store.dispatch('timesmanagement/patch', [this.timesManage._id, data, params])
                  .then(response => {
                    if (response) {
                      this.dialogEditTimesManage = false
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
        this.$store.commit('timesmanagement/clearPatchError')
        this.$validator.reset()
        this.name = null
        this.search = null
        this.desc = null
      }
    },
    created () {
      this.$root.$on('openDialogEditTimesManage', () => {
        this.dialogEditTimesManage = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
