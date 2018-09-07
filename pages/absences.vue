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
            {{ props.item.absencestype.name }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ formatDate(props.item.startDate) }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ formatDate(props.item.endDate) }}
          </div>
        </td>
        <td class="w-dynamic">
          <div>
            <v-chip :color="(props.item.status) ? 'green' : ''" :text-color="(props.item.status) ? 'white' : ''">{{ (props.item.status) ? 'Disetujui' : 'Belum disetujui' }}</v-chip>
          </div>
        </td>
        <td class="v-action">
          <div class="w-action content__action">
            <div class="btn__action">
              <v-tooltip
                v-if="!(props.item.status) ? true : false"
                top
                >
                <v-btn
                  :disabled="(props.item.status) ? true : false"
                  slot="activator" icon class="mx-0" @click.native="editItem(props.item)">
                  <v-icon color="grey darken-1">edit</v-icon>
                </v-btn>
                <span>Ubah</span>
              </v-tooltip>
            </div>
            <div class="btn__action">
              <v-tooltip
                v-if="!(props.item.status) ? true : false"
                top
                >
                <v-btn
                  :disabled="(props.item.status) ? true : false"
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
      <dialogEdit/>
      <dialogDelete/>
    </template>
  </dataTable>
</template>

<script>
import {mapGetters} from 'vuex'
import dataTable from '~/components/templates/datatable_pagination'
import dialogAdd from '~/components/dialogs/absences/_add'
import dialogEdit from '~/components/dialogs/absences/_edit'
import dialogDelete from '~/components/dialogs/absences/_delete'
import {defaultDateFormat} from '~/utils/format'
export default {
  data: () => ({
    serviceName: 'absences',
    defaultFilter: [],
    filterValue: [],
    itemsFilter: [],
    itemsSelectFilter: [],
    headers: [
      { text: 'Jenis Ketidakhadiran', value: 'absencestype.name', align: 'left', sortable: true, class: 'w-space w-large' },
      { text: 'Mulai Tanggal', value: 'startDate', align: 'left', class: 'w-normal' },
      { text: 'Selesai Tanggal', value: 'endDate', align: 'left', class: 'w-normal' },
      { text: 'Status', value: 'status', align: 'left', class: 'w-normal' },
      { text: 'action', value: 'name', class: 'w-action' }
    ],
    additionalFilter: [],
    pagination: {
      sortBy: 'status',
      rowsPerPage: 10,
      descending: false,
      page: 1
    },
    sortBy: {
      'status': 1
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
      let filter = {
        key: 'user._id',
        type: 'Text',
        value: this.user._id
      }
      this.additionalFilter.push(filter)
      let params = {}
      this.$store.dispatch('absencestypesselect/find', params)
    },
    addItem () {
      this.$root.$emit('openDialogAddAbsence')
    },
    editItem (item) {
      this.$store.commit('absences/setCurrent', item)
      this.$root.$emit('openDialogEditAbsence')
    },
    deleteItem (item) {
      this.$store.commit('absences/setCurrent', item)
      this.$root.$emit('opendialogDeleteAbsence')
    },
    formatDate (item) {
      if (typeof item !== 'undefined') {
        return defaultDateFormat(item)
      } else {
        return '-'
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