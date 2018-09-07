<template>
  <dataTable
    :menu="menu"
    :defaultFilter="defaultFilter"
    :itemsFilter="itemsFilter"
    :itemsSelectFilter="itemsSelectFilter"
    :filterItems.sync="filterValue"
    :paginationDefault="pagination"
    :pagination.sync="pagination"
    :headers="headers"
    :sortBy.sync="sortBy"
    :serviceName="serviceName"
    :showFAB.sync="showFAB"
    :items.sync="items"
    >
    <template slot="items-dataTable" slot-scope="{props}">
      <tr class="item-dataTable">
        <td style="font-weight: 500;">
          <div class="w-space w-large">
            <v-icon
              small
              :color="props.item.color">{{props.item.icon}}
            </v-icon>
            <span style="margin-left: 8px">{{ props.item.name }}</span>
          </div>
        </td>
        <td>
          <div class="w-large">{{ props.item.desc }}</div>
        </td>
        <td class="w-dynamic">
          <div>
            {{ props.item.to }}
          </div>
        </td>
        <td class="v-action">
          <div class="w-action content__action">
            <div class="btn__action">
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
            <div class="btn__action">
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
            <div class="btn__action">
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
            <div class="btn__action">
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
          </div>
        </td>
      </tr>
    </template>
    <template slot="fab">
      <v-fab-transition>
        <v-btn
          v-show="showFAB"
          class="v-btn--floating--custom"
          color="secondary"
          dark
          fixed
          fab
          @click.native="addMenu"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    <template slot="dialogs">
      <dialogAdd/>
      <dialogEdit/>
      <dialogDelete/>
    </template>
  </dataTable>
</template>

<script>
import {mapGetters} from 'vuex'
import dataTable from '~/components/templates/datatable_pagination'
import dialogAdd from '~/components/dialogs/manages/menus/_add'
import dialogEdit from '~/components/dialogs/manages/menus/_edit'
import dialogDelete from '~/components/dialogs/manages/menus/_delete'
export default {
  data: () => ({
    serviceName: 'menusmanagement',
    defaultFilter: [],
    filterValue: [],
    itemsFilter: [],
    itemsSelectFilter: [],
    headers: [
      { text: 'Nama', value: 'name', align: 'left', class: 'w-space w-large' },
      { text: 'Deskripsi', value: 'desc', align: 'left', class: 'w-large' },
      { text: 'Path', value: 'to', align: 'left', class: 'w-dynamic' },
      { text: 'action', value: 'name', class: 'w-action' }
    ],
    pagination: {
      sortBy: 'order',
      rowsPerPage: -1,
      descending: false,
      page: 1
    },
    sortBy: {
      'order': 1
    },
    showFAB: false,
    items: []
  }),
  components: {
    dataTable,
    dialogAdd,
    dialogEdit,
    dialogDelete
  },
  computed: {
    ...mapGetters({
      menuList: 'menus/list',
      permissions: 'permissions/current',
      role: 'roles/current'
    }),
    menu () {
      return this.menuList.find((item) => item.to === this.$route.path).name
    }
  },
  watch: {
    filterValue (val) {},
    sortBy (val) {},
    pagination (val) {}
  },
  methods: {
    initialize () {
      let params = {
        query: {}
      }
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
    addMenu () {
      this.$root.$emit('openDialogAddMenus')
    },
    editItem (item) {
      this.$store.commit(this.serviceName + '/setCurrent', item)
      this.$root.$emit('openDialogEditMenus')
    },
    deleteItem (item) {
      this.$store.commit(this.serviceName + '/setCurrent', item)
      this.$root.$emit('openDialogDeleteMenus')
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
      this.$store.dispatch(this.serviceName + '/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch(this.serviceName + '/patch', [_upId._id, _up, params])
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
      this.$store.dispatch(this.serviceName + '/patch', [item._id, _select, params])
        .then(response => {
          this.$store.dispatch(this.serviceName + '/patch', [_downId._id, _down, params])
        })
    }
  },
  created () {
    this.$store.dispatch('setBreadcrumbs', [])
    this.$store.commit(this.serviceName + '/clearAll')
    this.initialize()
  }
}
</script>