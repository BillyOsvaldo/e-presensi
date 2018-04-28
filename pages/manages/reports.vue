<template>
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
        <td style="font-weight: 500;">{{ props.item.cuti }}</td>
        <td style="font-weight: 500;">{{ props.item.ijin }}</td>
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
    <dialogAddAll/>
    <dialogDelete/>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogSync from '~/components/dialogs/manages/machinesusers/_sync'
import dialogAddAll from '~/components/dialogs/manages/machines/_addAll'
import dialogDelete from '~/components/dialogs/manages/machines/_delete'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
export default {
  data: () => ({
    dialog: false,
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
    dialogSync,
    dialogAddAll,
    dialogDelete
  },
  computed: {
    ...mapState({
      reports: 'presencesreports'
    }),
    ...mapGetters({
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
  },
  watch: {
    pagination: {
      handler (val) {
        if (val.sortBy !== null) {
          let sortBy = val.sortBy.replace('_timestamp', '')
          this.sortValue = {
            [sortBy]: (val.descending === true) ? -1 : 1
          }
          let params = {
            query: {
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
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('presencesreports/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('presencesreports').on('created', (doc) => {
        if (this.tempAdded.length === 0) {
          this.tempAdded.push(doc._id)
        } else {
          if (this.tempAdded.find((i) => i !== doc._id)) {
            this.tempAdded.push(doc._id)
          }
        }
      })
      api.service('fingersusers').on('created', (doc) => {
        let item = this.items.find((i) => i.user._id === doc.user)
        if (item) {
          item.fingersusers = doc
          this.$store.commit('fingersusers/updateItem', item)
        }
      })
      api.service('presencesreports').on('removed', (doc) => {
        if (this.tempAdded.length > 0) {
          this.tempAdded.splice(this.tempAdded[this.tempAdded.indexOf(doc._id)], 1)
        } else {
          this.total--
        }
      })
      this.$store.dispatch('organizationsselect/find', params)
    },
    getNextPage () {
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
    deleteItem (item) {
      this.$store.commit('presencesreports/setCurrent', item)
      this.$root.$emit('opendialogDeleteMachineUsers')
    },
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
