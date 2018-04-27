<template>
  <div class="menus-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="menus"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td>
          <v-icon
            small
            :color="props.item.color">{{props.item.icon}}</v-icon></td>
        <td style="font-weight: 500;">{{ props.item.name }}</td>
        <td style="font-weight: 500;">{{ props.item.desc }}</td>
        <td class="text-xs-left">{{ props.item.to }}</td>
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
              :disabled="(props.index === 0 ? true: false)"
              top
              >
              <v-btn
                :disabled="(props.index === 0 ? true : false)"
                slot="activator" icon class="mx-0" @click.native="changeOrderUp(items, props.item)">
                <v-icon color="grey darken-1">arrow_upward</v-icon>
              </v-btn>
              <span>Ubah Urutan ke atas</span>
            </v-tooltip>
          </div>
        </td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              :disabled="(props.index === (items.length - 1) ? true : false)"
              top
              >
              <v-btn
                :disabled="(props.index === (items.length - 1) ? true : false)"
                slot="activator" icon class="mx-0" @click.native="changeOrderBottom(items, props.item)">
                <v-icon color="grey darken-1">arrow_downward</v-icon>
              </v-btn>
              <span>Ubah Urutan ke bawah</span>
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
        @click.native="$root.$emit('openDialogAddMenus')"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <dialogAdd/>
    <dialogEdit/>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogAdd from '~/components/dialogs/manages/menus/_add'
import dialogEdit from '~/components/dialogs/manages/menus/_edit'
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
      { text: '', align: 'left', sortable: false, value: 'icon', class: 'small' },
      { text: 'Nama', align: 'left', value: 'name' },
      { text: 'Deskripsi', align: 'left', sortable: false, value: 'desc' },
      { text: 'Path', value: 'to', sortable: false, align: 'left' },
      { text: 'edit', value: 'name', sortable: false, class: 'action' },
      { text: 'up', value: 'name', sortable: false, class: 'action' },
      { text: 'down', value: 'name', sortable: false, class: 'action' }
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
    dialogEdit
  },
  computed: {
    ...mapState({
      menus: 'menusmanagement'
    }),
    ...mapGetters({
      menusList: 'menusmanagement/list'
    }),
    loadData () {
      if (typeof this.menusList !== 'undefined') {
        this.items = this.menusList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'menus', this.items.length)
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
    this.$store.commit('menusmanagement/clearAll')
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
          this.$store.dispatch('menusmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'menus')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('menusmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('menusmanagement').on('created', (doc) => {
        if (this.tempAdded.length === 0) {
          this.tempAdded.push(doc._id)
        } else {
          if (this.tempAdded.find((i) => i !== doc._id)) {
            this.tempAdded.push(doc._id)
          }
        }
      })
      let paramspermissions = {
        query: {
          $or: [
            {app: process.env.ID_APP},
            {app: null}
          ]
        }
      }
      this.$store.dispatch('rolesselect/find', params)
      this.$store.dispatch('permissionsselect/find', paramspermissions)
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }

      if (this.scrollBottom && !this.nextPage && this.items.length < this.menus.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.menus.pagination.default.total) {
          skipValue = this.menus.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('menusmanagement/find', params)
      }
    },
    editItem (item) {
      this.$store.commit('menusmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditMenus')
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
      this.$store.dispatch('menusmanagement/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('menusmanagement/patch', [_upId._id, _up, params])
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
      this.$store.dispatch('menusmanagement/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch('menusmanagement/patch', [_downId._id, _down, params])
        })
    }
  },
  mounted () {
    this.$store.dispatch('setNavigationTitle', 'Manajemen Menu')
    generateTable(this, window, 'menus')
  }
}
</script>

<style lang="sass">
  .menus
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
