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
          <div class="w-space w-normal">
            {{ props.item.name }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ props.item.dev_id }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ (props.item.organization) ? props.item.organization.name : '' }}
          </div>
        </td>
        <td>
          <div class="w-large">
            {{ timeMachine(props.item.fk_time) }}
          </div>
        </td>
        <td class="w-dynamic">
          <div>
            <v-icon :color="(props.item.is_match) ? 'green':'red'">{{ (props.item.is_match) ? 'done':'close' }}</v-icon>
          </div>
        </td>
        <td class="v-action">
          <div class="w-action content__action">
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
          @click.native="addItem"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    <template slot="dialogs">
      <dialogAdd/>
      <dialogAddAll/>
      <dialogDelete/>
    </template>
  </dataTable>
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'
import dataTable from '~/components/templates/datatable_pagination'
import dialogAdd from '~/components/dialogs/manages/machines/_add'
import dialogAddAll from '~/components/dialogs/manages/machines/_addAll'
import dialogDelete from '~/components/dialogs/manages/machines/_delete'
export default {
  data: () => ({
    serviceName: 'machinesmanagement',
    defaultFilter: [],
    filterValue: [],
    itemsFilter: [],
    itemsSelectFilter: [],
    headers: [
      { text: 'Nama', value: 'name', align: 'left', sortable: true, class: 'w-space w-normal' },
      { text: 'Dev ID', value: 'dev_id', align: 'left', class: 'w-normal' },
      { text: 'Organisasi', value: 'organization', align: 'left', class: 'w-normal' },
      { text: 'Update Terakhir', value: 'date', align: 'left', class: 'w-large' },
      { text: 'Sinkron Server', value: 'is_match', align: 'left', class: 'w-dynamic' },
      { text: 'action', value: 'name', class: 'w-action' }
    ],
    pagination: {
      sortBy: 'name',
      rowsPerPage: 10,
      descending: false,
      page: 1
    },
    sortBy: {
      'name': 1
    },
    showFAB: false,
    items: []
  }),
  components: {
    dataTable,
    dialogAdd,
    dialogAddAll,
    dialogDelete
  },
  computed: {
    ...mapGetters({
      menuList: 'menus/list',
      user: 'usersauthentication/current'
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
      let params = {}
      this.$store.dispatch('organizationsselect/find', params)
    },
    addItem () {
      if (this.user.organization) {
        this.$root.$emit('openDialogAddMachines')
      } else {
        this.$root.$emit('openDialogAddAllMachines')
      }
    },
    deleteItem (item) {
      this.$store.commit('machinesmanagement/setCurrent', item)
      this.$root.$emit('opendialogDeleteMachine')
    },
    timeMachine (time) {
      return moment(time, 'YYYYMMDDHHmmss').format('DD MMMM YYYY - HH:mm:ss')
    }
  },
  created () {
    this.$store.dispatch('setBreadcrumbs', [])
    this.$store.commit(this.serviceName + '/clearAll')
    this.initialize()
  }
}
</script>