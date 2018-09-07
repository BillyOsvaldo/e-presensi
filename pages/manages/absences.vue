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
            {{ props.item.user.profile.name.first_name + ' ' + props.item.user.profile.name.last_name }}
          </div>
        </td>
        <td>
          <div class="w-normal">
            {{ props.item.absencestype.name }}
          </div>
        </td>
        <td>
          <div class="w-large">
            {{ (props.item.startDate !== props.item.endDate) ? formatDate(props.item.startDate) + ' - ' + formatDate(props.item.endDate) : formatDate(props.item.startDate)}}
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
                  slot="activator" icon class="mx-0" @click.native="reviewItem(props.item)">
                  <v-icon color="grey darken-1">spellcheck</v-icon>
                </v-btn>
                <span>Review</span>
              </v-tooltip>
            </div>
            <div class="btn__action">
              <v-tooltip
                v-if="!(!props.item.status) ? true : false"
                top
                >
                <v-btn
                  :disabled="(!props.item.status) ? true : false"
                  slot="activator" icon class="mx-0" @click.native="cancelItem(props.item)">
                  <v-icon color="grey darken-1">undo</v-icon>
                </v-btn>
                <span>Batalkan</span>
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
      <dialogReview/>
      <dialogCancel/>
    </template>
  </dataTable>
</template>

<script>
import {mapGetters} from 'vuex'
import dataTable from '~/components/templates/datatable_pagination'
import dialogAdd from '~/components/dialogs/manages/absences/_add'
import dialogReview from '~/components/dialogs/manages/absences/_review'
import dialogCancel from '~/components/dialogs/manages/absences/_cancel'
import {defaultDateFormat} from '~/utils/format'
export default {
  data: () => ({
    serviceName: 'absencesmanagement',
    defaultFilter: [],
    filterValue: [],
    itemsFilter: [],
    itemsSelectFilter: [],
    headers: [
      { text: 'Nama', value: 'user.profile.name.first_name', align: 'left', sortable: true, class: 'w-space w-large' },
      { text: 'Jenis Ketidakhadiran', value: 'absencestype.name', align: 'left', class: 'w-normal' },
      { text: 'Tanggal', value: 'startDate', align: 'left', class: 'w-large' },
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
    dialogReview,
    dialogCancel
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
      if (this.user.organizationuser.organization) {
        let filter = {
          key: 'user.organizationuser.organization._id',
          type: 'Select',
          value: this.user.organizationuser.organization._id
        }
        this.additionalFilter.push(filter)
      }
      let params = {}
      this.$store.dispatch('absencestypesselect/find', params)
      if (this.user.organizationuser.organization) {
        params = {
          query: {
            organization: this.user.organization._id
          }
        }
      }
      this.$store.dispatch('findusersbyorganization/find', params)
    },
    addItem () {
      this.$root.$emit('openDialogAddAbsence')
    },
    reviewItem (item) {
      this.$store.commit('absencesmanagement/setCurrent', item)
      this.$root.$emit('openDialogReviewAbsence')
    },
    cancelItem (item) {
      this.$store.commit('absencesmanagement/setCurrent', item)
      this.$root.$emit('openDialogCancelAbsence')
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