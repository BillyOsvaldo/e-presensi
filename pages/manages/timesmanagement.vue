<template>
  <div class="timesmanagement-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="timesmanage"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ formatDate(props.item.startDate) }}</td>
        <td style="font-weight: 500;">{{ formatDate(props.item.endDate) }}</td>
        <td style="font-weight: 500;">{{ props.item.timeIn }}</td>
        <td style="font-weight: 500;">{{ props.item.timeOut }}</td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top
              >
              <v-btn
                slot="activator" icon class="mx-0" @click.native="editItem(props.item)">
                <v-icon color="grey darken-1">edit</v-icon>
              </v-btn>
              <span>Ubah</span>
            </v-tooltip>
          </div>
        </td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top
              >
              <v-btn
                :disabled="disableDelete(props.item.startDate)"
                slot="activator" icon class="mx-0" @click.native="deleteItem(props.item)">
                <v-icon color="grey darken-1">delete</v-icon>
              </v-btn>
              <span>Hapus</span>
            </v-tooltip>
          </div>
        </td>
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
        @click.native="addItem"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <dialogAdd/>
    <dialogEdit/>
    <dialogDelete/>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogAdd from '~/components/dialogs/manages/timesmanagement/_add'
import dialogEdit from '~/components/dialogs/manages/timesmanagement/_edit'
import dialogDelete from '~/components/dialogs/manages/timesmanagement/_delete'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
import {defaultDateFormat} from '~/utils/format'
export default {
  data: () => ({
    dialog: false,
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
      { text: 'Tanggal Mulai', align: 'left', value: 'startDate' },
      { text: 'Tanggal Berakhir', align: 'left', sortable: false, value: 'endDate' },
      { text: 'Jam Masuk', align: 'left', value: 'timeIn' },
      { text: 'Jam Pulang', align: 'left', sortable: false, value: 'timeOut' },
      { text: 'edit', value: 'name', sortable: false, class: 'action' },
      { text: 'delete', value: 'name', sortable: false, class: 'action' }
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
    dialogAdd,
    dialogEdit,
    dialogDelete
  },
  computed: {
    ...mapState({
      timesmanage: 'timesmanagement'
    }),
    ...mapGetters({
      timesmanagementList: 'timesmanagement/list'
    }),
    loadData () {
      if (typeof this.timesmanagementList !== 'undefined') {
        this.items = this.timesmanagementList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'timesmanage', this.items.length)
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
    this.$store.dispatch('setBreadcrumbs', [])
    this.$store.commit('timesmanagement/clearAll')
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
          this.$store.dispatch('timesmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    disableDelete (value) {
      return Boolean(new Date(value) <= new Date())
    },
    onResize () {
      resizeTable(this, window, 'timesmanage')
    },
    formatDate (value) {
      return defaultDateFormat(value)
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('timesmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('timesmanagement').on('created', (doc) => {
        if (this.tempAdded.length === 0) {
          this.tempAdded.push(doc._id)
        } else {
          if (this.tempAdded.find((i) => i !== doc._id)) {
            this.tempAdded.push(doc._id)
          }
        }
      })
      api.service('timesmanagement').on('removed', (doc) => {
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

      if (this.scrollBottom && !this.nextPage && this.items.length < this.timesmanage.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.timesmanage.pagination.default.total) {
          skipValue = this.timesmanage.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('timesmanagement/find', params)
      }
    },
    addItem () {
      this.$root.$emit('openDialogAddTimesManage')
    },
    editItem (item) {
      this.$store.commit('timesmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditTimesManage')
    },
    deleteItem (item) {
      this.$store.commit('timesmanagement/setCurrent', item)
      this.$root.$emit('openDialogDeleteTimesManage')
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
      this.$store.dispatch('timesmanagement/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('timesmanagement/patch', [_upId._id, _up, params])
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
      this.$store.dispatch('timesmanagement/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('timesmanagement/patch', [_downId._id, _down, params])
        })
    }
  },
  mounted () {
    generateTable(this, window, 'timesmanage')
  }
}
</script>

<style lang="sass">
  .timesmanagement
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
