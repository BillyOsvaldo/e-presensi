<template>
  <div class="machines-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="machines"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td style="font-weight: 500;">{{ props.item.name }}</td>
        <td style="font-weight: 500;">{{ props.item.dev_id }}</td>
        <td class="text-xs-left">{{ (props.item.organization) ? props.item.organization.name : '' }}</td>
        <td style="font-weight: 500;"></td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              top
              >
              <v-btn
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
    <dialogAddAll/>
    <dialogDelete/>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogAdd from '~/components/dialogs/manages/machines/_add'
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
      { text: 'Nama', align: 'left', value: 'name' },
      { text: 'Dev ID', align: 'left', sortable: false, value: 'dev_id' },
      { text: 'Organisasi', value: 'organization', sortable: false, align: 'left' },
      { text: 'Update Terakhir', value: 'organization', sortable: false, align: 'left' },
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
    dialogAddAll,
    dialogDelete
  },
  computed: {
    ...mapState({
      machines: 'machinesmanagement'
    }),
    ...mapGetters({
      userData: 'usersauthentication/current',
      machinesList: 'machinesmanagement/list'
    }),
    loadData () {
      if (typeof this.machinesList !== 'undefined') {
        this.items = this.machinesList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'machines', this.items.length)
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
    this.$store.commit('machinesmanagement/clearAll')
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
          this.$store.dispatch('machinesmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'machines')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('machinesmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('machinesmanagement').on('created', (doc) => {
        if (this.tempAdded.length === 0) {
          this.tempAdded.push(doc._id)
        } else {
          if (this.tempAdded.find((i) => i !== doc._id)) {
            this.tempAdded.push(doc._id)
          }
        }
      })
      api.service('machinesmanagement').on('removed', (doc) => {
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

      if (this.scrollBottom && !this.nextPage && this.items.length < this.machines.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.machines.pagination.default.total) {
          skipValue = this.machines.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('machinesmanagement/find', params)
      }
    },
    addItem () {
      if (this.userData.organization) {
        this.$root.$emit('openDialogAddMachines')
      } else {
        this.$root.$emit('openDialogAddAllMachines')
      }
    },
    deleteItem (item) {
      this.$store.commit('machinesmanagement/setCurrent', item)
      this.$root.$emit('opendialogDeleteMachine')
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
      this.$store.dispatch('machinesmanagement/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('machinesmanagement/patch', [_upId._id, _up, params])
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
      this.$store.dispatch('machinesmanagement/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('machinesmanagement/patch', [_downId._id, _down, params])
        })
    }
  },
  mounted () {
    generateTable(this, window, 'machines')
  }
}
</script>

<style lang="sass">
  .machines
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
