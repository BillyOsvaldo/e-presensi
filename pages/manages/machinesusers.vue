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
    :additionalFilter="additionalFilter"
    >
    <template slot="items-dataTable" slot-scope="{props}">
      <tr class="item-dataTable">
        <td style="font-weight: 500;">
          <div class="w-space w-large">
            {{ (props.item.user) ? props.item.user.profile.name.first_name + ' ' +props.item.user.profile.name.last_name : '' }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ (props.item.machine) ? props.item.machine.dev_id : '' }}
          </div>
        </td>
        <td>
          <div class="w-large">
            {{ (props.item.user) ? props.item.user.organizationuser.organization.name : '' }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ (props.item.status) ? 'Terdaftar' : 'Belum Terdaftar' }}
          </div>
        </td>
        <td class="w-dynamic">
          <div>
            {{ (props.item.fingersusers) ? 'Ada' : 'Belum Ada' }}
          </div>
        </td>
        <td class="v-action" style="display: none;">
        </td>
      </tr>
    </template>
    <template slot="fab">
     <!--<v-speed-dial
        class="v-btn--floating--custom"
        fixed
        bottom
        left
        transition="slide-y-reverse-transition"
      >
        <v-btn
          slot="activator"
          color="green"
          dark
          fab
          hover
        >
          <v-icon>cached</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="indigo"
          @click.native="syncItem"
        >
          <v-icon>import_export</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="red"
          @click.native="deleteItem"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-speed-dial>-->
      <v-fab-transition>
        <v-btn
          v-show="showFAB"
          class="v-btn--floating--custom"
          color="secondary"
          dark
          fixed
          fab
          @click.native="syncItem"
        >
          <v-icon>cached</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    <template slot="dialogs">
      <dialogSync/>
      <dialogDelete/>
    </template>
  </dataTable>
</template>

<script>
import {mapGetters} from 'vuex'
import dataTable from '~/components/templates/datatable_pagination'
import dialogSync from '~/components/dialogs/manages/machinesusers/_sync'
import dialogDelete from '~/components/dialogs/manages/machinesusers/_delete'
export default {
  data: () => ({
    serviceName: 'machinesusersmanagement',
    defaultFilter: [],
    filterValue: [],
    itemsFilter: [],
    itemsSelectFilter: [],
    headers: [
      { text: 'Nama', value: 'user.profile.name', align: 'left', sortable: true, class: 'w-space w-large' },
      { text: 'ID Machine', value: 'machine.dev_id', align: 'left', class: 'w-normal' },
      { text: 'Organisasi', value: 'user.organization', align: 'left', class: 'w-large' },
      { text: 'Status', value: 'status', align: 'left', class: 'w-normal' },
      { text: 'Sidik Jari', align: 'left', value: 'fingersusers', class: 'w-normal' }
    ],
    additionalFilter: [],
    pagination: {
      sortBy: 'user.profile.name.first_name',
      rowsPerPage: 10,
      descending: false,
      page: 1
    },
    sortBy: {
      'user.profile.name.first_name': 1
    },
    showFAB: false,
    items: []
  }),
  components: {
    dataTable,
    dialogSync,
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
      if (this.user.organization) {
        let filter = {
          key: 'user.organizationuser.organization._id',
          type: 'Select',
          value: this.user.organizationuser.organization._id
        }
        this.additionalFilter.push(filter)
      }
      let params = {}
      this.$store.dispatch('organizationsselect/find', params)
    },
    syncItem () {
      this.$root.$emit('openDialogSyncMachinesusers')
    },
    deleteItem (item) {
      this.$root.$emit('opendialogDeleteMachineUsers')
    }
  },
  created () {
    this.$store.dispatch('setBreadcrumbs', [])
    this.$store.commit(this.serviceName + '/clearAll')
    this.initialize()
  }
}
</script>