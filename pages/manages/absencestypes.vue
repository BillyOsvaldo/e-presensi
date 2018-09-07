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
            {{ props.item.name }}
          </div>
        </td>
        <td class="w-dynamic">
          <div>
            {{ props.item.desc }}
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
import dialogAdd from '~/components/dialogs/manages/absencestypes/_add'
import dialogEdit from '~/components/dialogs/manages/absencestypes/_edit'
import dialogDelete from '~/components/dialogs/manages/absencestypes/_delete'
export default {
  data: () => ({
    serviceName: 'absencestypesmanagement',
    defaultFilter: [],
    filterValue: [],
    itemsFilter: [],
    itemsSelectFilter: [],
    headers: [
      { text: 'Nama', value: 'name', align: 'left', class: 'w-space w-large' },
      { text: 'Deskripsi', value: 'desc', align: 'left', class: 'w-dynamic' },
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
    dialogEdit,
    dialogDelete
  },
  computed: {
    ...mapGetters({
      menuList: 'menus/list'
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
    initialize () {},
    addItem () {
      this.$root.$emit('openDialogAddAbsenceType')
    },
    editItem (item) {
      this.$store.commit('absencestypesmanagement/setCurrent', item)
      this.$root.$emit('opendialogEditAbsenceType')
    },
    deleteItem (item) {
      this.$store.commit('absencestypesmanagement/setCurrent', item)
      this.$root.$emit('opendialogDeleteAbsenceType')
    }
  },
  created () {
    this.$store.dispatch('setBreadcrumbs', [])
    this.$store.commit(this.serviceName + '/clearAll')
    this.initialize()
  }
}
</script>