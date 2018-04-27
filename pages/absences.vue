<template>
  <div class="absences-content" v-resize="onResize" style="background: #fff;">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="absences"
      id="scroll-target"
      :pagination.sync="pagination"
      v-bind="loadData + loadNextPage"
    >
      <template slot="items" slot-scope="props">
        <td :style="(!props.item.status) ? 'font-weight: bold;' : ''">{{ props.item.absencestype.name }}</td>
        <td :style="(!props.item.status) ? 'font-weight: bold;' : ''">{{ formatDate(props.item.startDate) }}</td>
        <td :style="(!props.item.status) ? 'font-weight: bold;' : ''">{{ formatDate(props.item.endDate) }}</td>
        <td :style="(!props.item.status) ? 'font-weight: bold;' : ''"><v-chip :color="(props.item.status) ? 'green' : ''" :text-color="(props.item.status) ? 'white' : ''">{{ (props.item.status) ? 'Disetujui' : 'Belum disetujui' }}</v-chip></td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              :disabled="(props.item.status) ? true : false"
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
        </td>
        <td class="text-xs-center">
          <div>
            <v-tooltip
              :disabled="(props.item.status) ? true : false"
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
    <dialogEdit/>
    <dialogDelete/>
  </div>
</template>

<script>
import api from '~/api/feathers-client'
import {mapState, mapGetters} from 'vuex'
import dialogAdd from '~/components/dialogs/absences/_add'
import dialogEdit from '~/components/dialogs/absences/_edit'
import dialogDelete from '~/components/dialogs/absences/_delete'
import {generateTable, resizeTable, loadData} from '~/utils/datatable'
import {defaultDateFormat} from '~/utils/format'
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
      { text: 'Jenis Ketidakhadiran', align: 'left', value: 'absencestype.name' },
      { text: 'Mulai Tanggal', align: 'left', sortable: false, value: 'startDate' },
      { text: 'Selesai Tanggal', align: 'left', sortable: false, value: 'endDate' },
      { text: 'Status', align: 'left', sortable: false, value: 'status' },
      { text: 'edit', value: 'name', sortable: false, class: 'action' },
      { text: 'delete', value: 'name', sortable: false, class: 'action' }
    ],
    pagination: {
      sortBy: 'status',
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
    dialogEdit,
    dialogDelete
  },
  computed: {
    ...mapState({
      absences: 'absencesmanagement'
    }),
    ...mapGetters({
      absencesList: 'absencesmanagement/list'
    }),
    loadData () {
      if (typeof this.absencesList !== 'undefined') {
        this.items = this.absencesList
        if (this.items.length > 0 && this.tableCreated) {
          loadData(this, 'absences', this.items.length)
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
    this.$store.commit('absencesmanagement/clearAll')
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
          this.$store.dispatch('absencesmanagement/find', params)
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      resizeTable(this, window, 'absences')
    },
    initialize () {
      let params = {
        query: {}
      }
      this.$store.dispatch('absencesmanagement/find', params)
        .then(response => {
          this.total = response.total
          this.$store.dispatch('setNavigationCount', this.total)
        })
      this.$store.dispatch('setNavigationCount', this.total)
      api.service('absencesmanagement').on('created', (doc) => {
        if (this.tempAdded.length === 0) {
          this.tempAdded.push(doc._id)
        } else {
          if (this.tempAdded.find((i) => i !== doc._id)) {
            this.tempAdded.push(doc._id)
          }
        }
      })
      api.service('absencesmanagement').on('removed', (doc) => {
        if (this.tempAdded.length > 0) {
          this.tempAdded.splice(this.tempAdded[this.tempAdded.indexOf(doc._id)], 1)
        } else {
          this.total--
        }
      })
      this.$store.dispatch('absencestypesselect/find', params)
    },
    getNextPage () {
      if (!this.scrollBottom) {
        this.nextPage = false
      }

      if (this.scrollBottom && !this.nextPage && this.items.length < this.absences.pagination.default.total) {
        this.nextPage = true
        this.skipPage++
        let skipValue = this.skipPage * 10
        if (skipValue > this.absences.pagination.default.total) {
          skipValue = this.absences.pagination.default.total
        }
        let params = {
          query: {
            $sort: this.sortValue,
            $skip: skipValue
          }
        }
        this.$store.dispatch('absencesmanagement/find', params)
      }
    },
    addItem () {
      this.$root.$emit('openDialogAddAbsence')
    },
    editItem (item) {
      this.$store.commit('absencesmanagement/setCurrent', item)
      this.$root.$emit('openDialogEditAbsence')
    },
    deleteItem (item) {
      this.$store.commit('absencesmanagement/setCurrent', item)
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
  mounted () {
    generateTable(this, window, 'absences')
  }
}
</script>

<style lang="sass">
  .absences
    position: relative
    zoom: 1
    min-width: 1000px
    min-height: 20px
    display: block
    width: 100%
    overflow: unset
</style>
