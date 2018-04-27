<template>
  <div class="machinesusers-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="machinesusers"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ (props.item.user) ? props.item.user.profile.name.first_name + ' ' +props.item.user.profile.name.last_name : '' }}</td>
        <td style="font-weight: 500;">{{ (props.item.machine) ? props.item.machine.dev_id : '' }}</td>
        <td class="text-xs-left">{{ (props.item.user) ? props.item.user.organization.name : '' }}</td>
        <td style="font-weight: 500;">{{ (props.item.status) ? 'Terdaftar' : 'Belum Terdaftar' }}</td>
        <td style="font-weight: 500;">{{ (props.item.fingersusers) ? 'Ada' : 'Belum Ada' }}</td>
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
        @click.native="syncItem"
      >
        <v-icon>cached</v-icon>
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
      { text: 'Nama', align: 'left', value: 'user.profile.name' },
      { text: 'ID Machine', align: 'left', sortable: false, value: 'machine.dev_id' },
      { text: 'Organisasi', value: 'user.organization', sortable: false, align: 'left' },
      { text: 'Status', value: 'status', sortable: false, align: 'left' },
      { text: 'Sidik Jari', value: 'fingersusers', sortable: false, align: 'left' }
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
      machinesusers: 'machinesusersmanagement'
    }),
    ...mapGetters({
      userData: 'usersauthentication/current',
      machinesusersList: 'machinesusersmanagement/list'
    }),
    loadData () {
      if (typeof this.machinesusersList !== 'undefined') {
        this.items = this.machinesusersList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'machinesusers', this.items.length)
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
    this.$store.commit('machinesusersmanagement/clearAll')
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
          this.$store.dispatch('machinesusersmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'machinesusers')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('machinesusersmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('machinesusersmanagement').on('created', (doc) => {
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
          console.log(item)
          this.$store.commit('fingersusers/updateItem', item)
        }
      })
      api.service('machinesusersmanagement').on('removed', (doc) => {
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

      if (this.scrollBottom && !this.nextPage && this.items.length < this.machinesusers.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.machinesusers.pagination.default.total) {
          skipValue = this.machinesusers.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('machinesusersmanagement/find', params)
      }
    },
    syncItem () {
      this.$root.$emit('openDialogSyncMachinesusers')
    },
    deleteItem (item) {
      this.$store.commit('machinesusersmanagement/setCurrent', item)
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
      this.$store.dispatch('machinesusersmanagement/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('machinesusersmanagement/patch', [_upId._id, _up, params])
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
      this.$store.dispatch('machinesusersmanagement/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('machinesusersmanagement/patch', [_downId._id, _down, params])
        })
    }
  },
  mounted () {
    generateTable(this, window, 'machinesusers')
  }
}
</script>

<style lang="sass">
  .machinesusers
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
