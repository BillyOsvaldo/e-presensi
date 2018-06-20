<template>
  <div>
  <v-card v-if="filterTable"
  style="position:absolute; 
  background:#fff; 
  z-index:99;
  width:400px;
  right:10px; "
  >
    <v-card-title class="headline">
    Filter Laporan
    </v-card-title>
      <v-card-text style="max-height: 300px;">
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-select
                :items="items_bulan"
                v-model="pilih_bulan"
                label="Bulan"
                class="input-group--focused"
                item-value="value"
                ></v-select>
            </v-flex>
            <v-flex xs12>
                <v-select
                :items="items_tahun"
                v-model="pilih_tahun"
                label="Tahun"
                class="input-group--focused"
                item-value="value"
                ></v-select>
            </v-flex>
          </v-layout>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn depressed color="error" @click.native="closedialogButton">Batal</v-btn>
      <v-spacer></v-spacer>
      <v-btn depressed color="primary" @click="onSubmit">Proses</v-btn>
    </v-card-actions>
  </v-card>
  <div class="reports-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="reports"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ props.item.name }}</td>
        <td style="font-weight: 500;">{{ props.item.tepat_waktu }}</td>
        <td class="text-xs-left">{{ props.item.telat }}</td>
        <td class="text-xs-left">{{ props.item.pulang_cepat }}</td>
        <td style="font-weight: 500;">{{ props.item.alpa }}</td>
        <td style="font-weight: 500;">{{ props.item.dl }}</td>
        <td style="font-weight: 500;">{{ props.item.cuti }}</td>
        <td style="font-weight: 500;">{{ props.item.izin }}</td>
        <td style="font-weight: 500;">{{ props.item.sakit }}</td>
      </template>
      <template slot="no-data">
        <span>Belum ada data.</span>
      </template>
    </v-data-table>
    <v-fab-transition>
      <v-btn
        class="btn--floating--custom"
        color="red"
        dark
        fixed
        bottom
        right
        fab
        @click.native=""
      >
        <v-icon>print</v-icon>
      </v-btn>
    </v-fab-transition>
    <dialogSync/>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import dialogSync from '~/components/dialogs/manages/machinesusers/_sync'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
import moment from 'moment'
export default {
  data: () => ({
    dialog: false,
    pilih_bulan: null,
    pilih_tahun: null,
    items_bulan: [
      { text: 'Januari', value: 1 },
      { text: 'Februari', value: 2 },
      { text: 'Maret', value: 3 },
      { text: 'April', value: 4 },
      { text: 'Mei', value: 5 },
      { text: 'Juni', value: 6 },
      { text: 'Juli', value: 7 },
      { text: 'Agustus', value: 8 },
      { text: 'September', value: 9 },
      { text: 'Oktober', value: 10 },
      { text: 'November', value: 11 },
      { text: 'Desember', value: 12 }
    ],
    items_tahun: [
      { text: '2018', value: 2018 },
      { text: '2019', value: 2019 },
      { text: '2020', value: 2018 },
      { text: '2021', value: 2019 }
    ],
    filterTable: false,
    desc: null,
    desc1: null,
    tableCreated: false,
    scrollBottom: false,
    nextPage: false,
    sortValue: {},
    skipPage: 0,
    total: 0,
    windowSize: {
      x: 0,
      y: 0
    },
    headers: [
      { text: 'Nama', align: 'left', value: 'name' },
      { text: 'Tepat  Waktu', align: 'left', sortable: false, value: 'tepat_waktu' },
      { text: 'Telat', value: 'telat', sortable: false, align: 'left' },
      { text: 'Pulang Cepat', value: 'pulang_cepat', sortable: false, align: 'left' },
      { text: 'Alpha', value: 'alpa', sortable: false, align: 'left' },
      { text: 'Dinas Luar', value: 'dl', sortable: false, align: 'left' },
      { text: 'Cuti', value: 'cuti', sortable: false, align: 'left' },
      { text: 'Izin', value: 'ijin', sortable: false, align: 'left' },
      { text: 'Sakit', value: 'sakit', sortable: false, align: 'left' }
    ],
    pagination: {
      sortBy: 'order',
      rowsPerPage: -1,
      descending: false
    },
    items: [],
    doResendEmail: false,
    snackbarView: false,
    textSnackbar: '',
    tempAdded: []
  }),
  components: {
    dialogSync
  },
  computed: {
    ...mapState({
      reports: 'presencesreports'
    }),
    ...mapGetters({
      userData: 'usersauthentication/current',
      reportsList: 'presencesreports/list'
    }),
    loadData () {
      if (typeof this.reportsList !== 'undefined') {
        this.items = this.reportsList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'reports', this.items.length)
        }
        if (this.tempAdded) {
          let total = this.total + this.tempAdded.length
          this.$store.dispatch('setNavigationCount', total)
        }
      }
    },
    loadNextPage () {
      this.getNextPage()
    }
  },
  created () {
    this.$store.commit('presencesreports/clearAll')
    this.initialize()
    this.$root.$on('openDialogFilterReport', () => {
      this.filterTable = !this.filterTable
    })
  },
  watch: {
    pagination: {
      handler (val) {
        if (val.sortBy !== null) {
          let sortBy = val.sortBy.replace('_timestamp', '')
          this.sortValue = {
            [sortBy]: (val.descending === true) ? -1 : 1
          }
          var { bulan, tahun } = this.monthYear()
          let params = {
            query: {
              organization: this.userData.organization._id,
              month: bulan,
              year: tahun,
              $sort: this.sortValue
            }
          }
          this.$store.dispatch('presencesreports/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'reports')
    },
    momentBulan () {
      var mBulan = moment.months()
      return {
        mBulan
      }
    },
    momentTahun () {
      var mTahun = moment.year()
      // console.log(moment().diff('1981', 'years'))
      return {
        mTahun
      }
    },
    monthYear () {
      var bulan
      var tahun
      // console.log(this.pilih_tahun)
      if (this.pilih_bulan === null || this.pilih_tahun === null) {
        bulan = (new Date()).getMonth() + 1
        tahun = (new Date()).getFullYear()
      } else {
        bulan = this.pilih_bulan
        tahun = this.pilih_tahun
      }
      return {
        bulan, tahun
      }
    },
    onSubmit () {
      var { bulan, tahun } = this.monthYear()
      let params = {
        query: {
          organization: this.userData.organization._id,
          month: bulan,
          year: tahun,
          $sort: this.sortValue
        }
      }
      this.$store.dispatch('presencesreports/find', params)
        .then(response => {
          if (response) {
            this.filterTable = false
            this.resetAll()
          }
        })
    },
    closedialogButton () {
      this.filterTable = !this.filterTable
      this.resetAll()
    },
    resetAll () {
      this.pilih_tahun = null
      this.pilih_bulan = null
    },
    initialize () {
      var { bulan, tahun } = this.monthYear()
      let paramsOrganization = {
        query: {
          organization: this.userData.organization._id, month: bulan, year: tahun
        }
      }
      this.$store.dispatch('presencesreports/find', paramsOrganization)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      this.$store.dispatch('presencesreports/find', paramsOrganization)
    },
    getNextPage () {
      var { bulan, tahun } = this.monthYear()
      if (!this.scrollBottom) {
        this.nextPage = false
      }
      if (this.scrollBottom && !this.nextPage && this.items.length < this.reports.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.reports.pagination.default.total) {
          skipValue = this.reports.pagination.default.total
        }
        let params = {
          query: {
            organization: this.userData.organization._id,
            month: bulan,
            year: tahun,
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('presencesreports/find', params)
      }
    },
    // syncItem () {
    //   this.$root.$emit('openDialogSyncMachinesusers')
    // },
    changeOrderUp (items, item) {
      let _upId = items.find((i) => i.order === (item.order - 1))
      let _select = {
        order: (item.order - 1)
      }
      let _up = {
        order: (item.order)
      }
      let params = {}
      this.$store.dispatch('presencesreports/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('presencesreports/patch', [_upId._id, _up, params])
        })
    },
    changeOrderBottom (items, item) {
      let _downId = items.find((i) => i.order === (item.order + 1))
      let _select = {
        order: (item.order + 1)
      }
      let _down = {
        order: (item.order)
      }
      let params = {}
      this.$store.dispatch('presencesreports/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('presencesreports/patch', [_downId._id, _down, params])
        })
    }
  },
  mounted () {
    generateTable(this, window, 'reports')
  }
}
</script>

<style lang="sass">
  .reports
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
