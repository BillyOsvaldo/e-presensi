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
            {{ props.item.name }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ props.item.datang_tepat_waktu }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ props.item.telat }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ props.item.pulang_tepat_waktu }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ props.item.pulang_cepat }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ props.item.alpa }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ props.item.dl }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ props.item.cuti }}
          </div>
        </td>
        <td class="w-dynamic">
          <div>
            {{ props.item.sakit }}
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
    serviceName: 'presencesreports',
    defaultFilter: [],
    filterValue: [],
    itemsFilter: [],
    itemsSelectFilter: [],
    headers: [
      { text: 'Nama', value: 'name', align: 'left', sortable: true, class: 'w-space w-large' },
      { text: 'Datang Tepat  Waktu', value: 'tepat_waktu', align: 'left', class: 'w-normal' },
      { text: 'Datang Terlambat', value: 'telat', align: 'left', class: 'w-normal' },
      { text: 'Pulang Tepat Waktu', value: 'pulang_tepat_waktu', align: 'left', class: 'w-normal' },
      { text: 'Pulang Cepat', value: 'pulang_cepat', align: 'left', class: 'w-normal' },
      { text: 'Alpha', value: 'alpa', align: 'left', class: 'w-normal' },
      { text: 'Dinas Luar', value: 'dl', align: 'left', class: 'w-normal' },
      { text: 'Cuti', value: 'cuti', align: 'left', class: 'w-normal' },
      { text: 'Sakit', align: 'left', value: 'sakit', class: 'w-normal' }
    ],
    additionalFilter: [],
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
    items: [],
    pilih_bulan: null,
    pilih_tahun: null
  }),
  components: {
    dataTable,
    dialogSync,
    dialogDelete
  },
  computed: {
    ...mapGetters({
      menuList: 'menus/list',
      user: 'usersauthentication/current',
      itemLists: 'presencesreports/list'
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
          key: 'organization',
          type: 'Select',
          value: this.user.organizationuser.organization._id
        }
        this.additionalFilter.push(filter)
        var { bulan, tahun } = this.monthYear()
        let month = {
          key: 'month',
          type: 'Text',
          value: bulan
        }
        let year = {
          key: 'year',
          type: 'Text',
          value: tahun
        }
        this.additionalFilter.push(month)
        this.additionalFilter.push(year)
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
    }
  },
  created () {
    this.$store.dispatch('setBreadcrumbs', [])
    this.$store.commit(this.serviceName + '/clearAll')
    this.initialize()
  }
}
</script>