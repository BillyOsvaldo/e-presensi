<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogEditSettings" persistent scrollable max-width="480">
      <v-card v-if="dialogEditSettings">
        <v-card-title class="headline">Ubah Pengaturan</v-card-title>
        <v-card-text style="max-height: 300px;">
          <v-container grid-list-md>
            <v-layout wrap  v-bind="loadData">
              <v-flex xs12>
                <v-text-field
                  autofocus
                  disabled="disabled"
                  v-model="name"
                  v-validate="'required'"
                  data-vv-name="name"
                  label="Nama Pengaturan"
                  :error-messages="errors.collect('name')"
                  ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  autofocus
                  v-show="false"
                  disabled="disabled"
                  v-model="type"
                  v-validate="'required'"
                  data-vv-name="type"
                  label="Type Value"
                  :error-messages="errors.collect('type')"
                  ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-show="changeValueString(this.settings)"
                  autofocus
                  v-model="value"
                  v-validate="'required'"
                  data-vv-name="value"
                  label="Deskripsi"
                  :error-messages="errors.collect('value')"
                  ></v-text-field>
              </v-flex>
              <v-flex>
                  <v-menu
                    ref="menu_time"
                    lazy
                    :close-on-content-click="false"
                    v-model="menu_time"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                    :return-value.sync="time"
                  >
                    <v-text-field
                      v-show="changeValuePicker(this.settings)"
                      slot="activator"
                      label="Jam"
                      v-model="time"
                      v-validate="'required'"
                      data-vv-name="time"
                      data-vv-as="time"
                      prepend-icon="schedule"
                      validate-on-blur
                      readonly
                      @blur="onBlur('time')"
                      :error-messages="errors.collect('time')"
                    ></v-text-field>
                    <v-time-picker
                      format="24hr"
                      locale="id"
                      v-model="date_for_time"
                      @input="time = formatTime($event)">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu_time = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu_time.save(time)">OK</v-btn>
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
  import {formatFormTime} from '~/utils/format'
  import {mapState, mapGetters} from 'vuex'
  const customHelptext = {
    en: {
      custom: {
        name: {
          required: 'Nama Jenis Ketidakhadiran harus diisi.'
        },
        value: {
          required: 'Deskripsi harus diisi.'
        },
        time: {
          required: 'Jam harus diisi'
        }
      }
    }
  }

  export default {
    data: () => ({
      dialogEditSettings: false,
      loading: false,
      name: null,
      type: null,
      value: null,
      time: null,
      date_for_time: null,
      menu_time: false
    }),
    computed: {
      ...mapState({
      }),
      ...mapGetters({
        settings: 'settings/current'
      }),
      loadData () {
        if (this.dialogEditSettings) {
          this.$validator.reset()
          this.name = (typeof this.settings.name === 'undefined') ? '' : this.settings.name
          this.type = (typeof this.settings.type === 'undefined') ? '' : this.settings.type
          this.value = (typeof this.settings.value === 'undefined') ? '' : this.settings.value
          this.time = (typeof this.settings.value === 'undefined') ? '' : this.settings.value
        }
      }
    },
    methods: {
      changeValuePicker (value) {
        return (value.type === 'timepicker')
      },
      changeValueString (value) {
        return (value.type === 'string')
      },
      closedialogEditButton () {
        this.dialogEditSettings = !this.dialogEditSettings
        this.resetAll()
      },
      formatTime (value) {
        return formatFormTime(value)
      },
      postCreated () {
        setTimeout(() => {
          this.$validator.validateAll()
            .then((result) => {
              if (result) {
                var value
                if (this.type === 'timepicker') {
                  value = this.time
                } else {
                  value = this.value
                }
                let data = {
                  name: this.name,
                  type: this.type,
                  value: value
                }
                let params = {}
                this.$store.commit('settings/clearPatchError')
                console.log('saadsadadas', this.time, this.value)
                this.$store.dispatch('settings/patch', [this.settings._id, data, params])
                  .then(response => {
                    if (response) {
                      this.dialogEditSettings = false
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
        this.$store.commit('settings/clearPatchError')
        this.$validator.reset()
        this.name = null
        this.value = null
        this.time = null
      }
    },
    created () {
      this.$root.$on('opendialogEditSettings', () => {
        this.dialogEditSettings = true
      })
      this.$validator.localize(customHelptext)
    }
  }
</script>
