<template>
  <div class="codereg-content __main-content"  v-resize="onResize">
    <div class="role-grid" style="padding-top: 24px">
      <div class="content-flex elevation-1">
        <div class="flex__ flex__content flex__header--content">
          <div class="flex__content">
            <div class="header__content header__content--title">
              <div>
                <span class="header--title">{{ menu }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="loader__datatable">
          <v-progress-linear v-if="loading" :indeterminate="true" height="3" style="margin: 0;"></v-progress-linear>
        </div>
        <div class="flex__">
          <div class="flex__filter">
            <div style="margin-left: 18px; width: 100%">
              <div v-if="iconAddFilter" class="v-add-filter__icon">
                  <v-icon>add</v-icon>
                  <span>Tambah Filter</span>
              </div>
              <v-combobox
                class="v-datatable-filter"
                v-model="filter"
                :items="itemsFilter"
                :search-input.sync="searchFilter"
                @input="updateFilter"
                hide-selected
                multiple
                chips
                hide-details
                single-line
                no-filter
                deletable-chips
                item-text="value"
                item-value="_id"
                ref="filterBox"
                :menu-props="{contentClass:'v-autocomplete__table-filter elevation-5'}"
                @blur="onBlurFilter"
                @click="onClickFilter"
                v-bind="loadDefaultFilter">
                <template
                  v-if="item === Object(item)"
                  slot="selection"
                  slot-scope="{ item, parent, selected }"
                >
                  <v-chip
                    style="margin: 0px 8px 0px 0px;"
                    color="grey lighten-3"
                    :close="(!item.protected)"
                    :selected="selected"
                    @input="onCloseChips(item)"
                  >
                    <span>
                      {{ item.value }}
                    </span>
                  </v-chip>
                </template>
              </v-combobox>
              <v-dialog
                v-model="dialogFilter"
                max-width="300"
                hide-overlay
                content-class="v-dialog__datatable-filter elevation-1">
                <v-card v-if="dialogFilter">
                  <v-card-title class="primary white--text"
                    style="padding: 8px 8px 8px 16px; font-size: 14px;font-weight: 500;">
                    <span>{{ dialogFilterItem.text }}</span>
                    <v-spacer></v-spacer>
                    <v-btn icon style="margin: 0;" @click.native="closeDialogFilter">
                      <v-icon color="white">close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text style="padding-top: 8px">
                    <v-flex v-if="dialogFilterItem.typeFilter === 'Text'">
                      <v-text-field
                        v-model="word_filter"
                        autofocus
                        label="Filter"></v-text-field>
                    </v-flex>
                    <v-flex v-if="dialogFilterItem.typeFilter === 'Select'">
                      <v-autocomplete
                        autofocus
                        v-model="word_filter"
                        :items="itemSelectFilter"
                        item-text="text"
                        item-value="_id"
                        label="Filter"></v-autocomplete>
                    </v-flex>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      flat
                      :disabled="disableBtnFilter"
                      @click.native="actionFilter">Terapkan</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </div>
        <v-data-table
          :headers="headers"
          :items="items"
          class="__data-table"
          :total-items="totalItems"
          :paginationDefault="paginationDefault"
          :pagination.sync="pagination"
          rows-per-page-text="Jumlah Baris"
          :sortBy="sortBy"
          ref="dataTable"
          >
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['text-xs-' + header.align, header.class, 'column', header.sortable ? 'sortable':'', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="(header.sortable) ? changeSort(header.value):''"
              >
                <content>
                  <span class="__content">
                    <span>{{ header.text }}</span>
                    <span style="padding: 0 4px;" v-if="header.sortable"><v-icon small>arrow_upward</v-icon></span>
                  </span>
                </content>
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <slot name="items-dataTable" :props="props"/>
          </template>
          <template slot="no-data">
            <tr style="display: block;position: relative;width: 100%; background: #fff;">
              <td style="display: block; width: 100%;">
                <div style="line-height: 48px; margin-left: 16px;">
                  <span>Data tidak ditemukan.</span>
                </div>
              </td>
            </tr>
          </template>
          <template slot="no-results">
            <tr style="display: block;position: relative;width: 100%; background: #fff;">
              <td style="display: block; width: 100%;">
                <div style="line-height: 48px; margin-left: 16px;">
                  <span>Data tidak ditemukan.</span>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
        <div class="loadingBackgroundContent" v-bind:class="{ isActive: loading }">
          <div v-if="loading" class="loadingBackgroundDatatable"></div>
        </div>
        <slot name="fab"></slot>
        <slot name="dialogs"></slot>
        <slot name="snackbar"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import api from '~/api/feathers-client'
export default {
  props: {
    menu: String,
    itemsFilter: Array,
    itemsSelectFilter: Array,
    headers: Array,
    paginationDefault: {},
    defaultFilter: Array,
    additionalFilter: Array,
    serviceName: String
  },
  data: () => ({
    initLoadData: true,
    filter: null,
    filterValue: [],
    searchFilter: null,
    itemsSelected: [],
    dialogFilter: false,
    dialogFilterItem: {
      text: '',
      typeFilter: ''
    },
    word_filter: '',
    sortBy: '',
    pagination: {},
    iconAddFilter: true,
    leftFilter: 0,
    cancelFilter: false,
    hasLoadDefaultFilter: false,
    lastSeen: {},
    totalItems: 0,
    items: [],
    loading: true
  }),
  computed: {
    itemLists () {
      return this.$store.getters[this.serviceName + '/list']
    },
    itemSelectFilter () {
      let items = []
      if (this.dialogFilterItem.typeFilter === 'Select') {
        let selectItems = this.itemsSelectFilter.find((item) => item.key === this.dialogFilterItem.filter)
        items = selectItems.items
      }
      return items
    },
    disableBtnFilter () {
      if (this.dialogFilterItem.typeFilter === 'Select') {
        if (this.word_filter.toString().length > 0) {
          return false
        } else {
          return true
        }
      } else {
        if (this.word_filter.length < 1) {
          return true
        } else {
          return false
        }
      }
    },
    loadDefaultFilter () {
      let tempFilter = []
      if (this.defaultFilter.length > 0) {
        this.defaultFilter.forEach((item) => {
          if (item.type === 'Select') {
            let filter = this.itemsFilter.find(i => i.filter === item.key)
            filter.valueFilter = item.value
            filter.selected = true
            let itemsSelect = this.itemsSelectFilter.find(i => i.key === item.key)
            if (itemsSelect.items.length > 0) {
              let itemSelect = itemsSelect.items.find(i => i._id === item.value)
              filter.value = filter.text + ' : ' + itemSelect.text
            }
            tempFilter.push(filter)
          } else {

          }
        })
        this.hasLoadDefaultFilter = true
        this.iconAddFilter = false
        this.filter = tempFilter
      }
    }
  },
  watch: {
    filter (val) {
      this.itemsSelected = []
      val.forEach((item) => {
        this.itemsSelected.push(item.filter)
        let i = this.itemsFilter.find((i) => i.filter === item.filter)
        if (i.typeFilter !== 'Select') {
          i.value = item.text + ': ' + item.valueFilter
        }
        i.selected = true
      })
      this.$refs.filterBox.isMenuActive = false
      this.$nextTick(() => {
        let dialog = this.$root.$el.querySelector('.v-dialog__datatable-filter')
        let autocomplete = this.$root.$el.querySelector('.v-autocomplete__table-filter')
        this.leftFilter = this.$el.querySelector('.v-datatable-filter .v-select__selections input').offsetLeft
        dialog.style.left = autocomplete.style.left
        dialog.style.top = autocomplete.style.top
        if (this.itemsSelected.length > 0) {
          dialog.style.marginLeft = this.leftFilter + 'px'
        } else {
          dialog.style.marginLeft = '0px'
        }
        autocomplete.style.marginLeft = this.leftFilter + 'px'
      })
      let output = []
      this.filter.forEach((filter) => {
        let item = {
          key: filter.filter,
          value: filter.valueFilter,
          type: filter.typeFilter,
          withId: filter.withId
        }
        output.push(item)
      })
      if (!this.dialogFilter && !this.cancelFilter && !this.hasLoadDefaultFilter) {
        this.pagination.page = 1
        this.$emit('update:filterItems', output)
        this.filterValue = output
        this.fetchData(this.pagination)
      }
      this.cancelFilter = false
      this.hasLoadDefaultFilter = false
    },
    searchFilter (val) {
      if (val) {
        this.itemsFilter.filter((i) => !i.selected).forEach((item) => {
          if (item.typeFilter !== 'Select') {
            item.valueFilter = val
          }
          item.value = item.text + ' "' + val + '"'
        })
      } else {
        this.itemsFilter.filter((i) => !i.selected).forEach((item) => {
          item.valueFilter = ''
          item.value = item.text
        })
      }
    },
    pagination: {
      handler (val) {
        this.$emit('update:pagination', val)
        if (!this.initLoadData) {
          if (val.rowsPerPage !== this.lastSeen.rowsPerPage) {
            this.fetchData(this.pagination)
          } else if (val.page > this.lastSeen.page && this.lastSeen.sortBy === val.sortBy) {
            this.fetchData(this.pagination)
          } else {
            this.parseData()
          }
        }
      }
    },
    deep: true
  },
  methods: {
    onResize () {
      this.generateTable(this, window)
      this.createEffect(this, window)
    },
    generateTable (element, getWindow, action) {
      let roleGrid = element.$el.querySelector('.role-grid')
      let toolbars = element.$root.$el.querySelectorAll('.v-toolbar')
      let position = element.$el.querySelector('.__data-table')
      let headPosition = element.$el.querySelector('.v-datatable thead')
      let bodyDataTable = element.$el.querySelector('.v-datatable tbody')
      let actionPosition = element.$el.querySelector('.v-datatable__actions')
      let loader = element.$el.querySelector('.loader__datatable')
      let bgLoader = element.$el.querySelector('.loadingBackgroundContent')
      let toolbarsHeight = 1
      toolbars.forEach((items) => {
        toolbarsHeight += items.clientHeight
      })
      let addHeight = 0
      if (position.clientWidth !== headPosition.clientWidth) {
        addHeight += 10
      } else {
        addHeight = 0
      }
      if (action === 'init') {
        if (getWindow.innerWidth < 721) {
          toolbarsHeight -= 8
        }
      }
      bodyDataTable.setAttribute('style', 'height: calc(100vh - (' + (toolbarsHeight + position.offsetTop + headPosition.clientHeight + actionPosition.clientHeight + addHeight) + 'px + ' + roleGrid.style.paddingTop + '))')
      if (loader) {
        loader.setAttribute('style', 'top: ' + position.offsetTop + 'px')
        bgLoader.setAttribute('style', 'top: ' + position.offsetTop + 'px')
      }
    },
    createEffect (element, getWindow) {
      if (this.items.length > 0) {
        let scrollLeft = 0
        let scrollTable = element.$el.querySelector('.v-table__overflow')
        let position = element.$el.querySelector('.__data-table')
        let bodyDataTable = element.$el.querySelector('.v-datatable tbody')
        bodyDataTable.addEventListener('mouseover', (e) => {
          if (position.clientWidth !== bodyDataTable.clientWidth) {
            let tr = e.path.find((i) => i.className && i.className === 'item-dataTable')
            if (tr) {
              let td = tr.querySelector('td.v-action')
              let left = position.clientWidth - td.clientWidth + scrollLeft
              if (left < (bodyDataTable.clientWidth - td.clientWidth)) {
                tr.addEventListener('mouseleave', (e) => {
                  td.setAttribute('style', '')
                })
                td.setAttribute('style', 'position: absolute; width: auto; left: ' + left + 'px')
              }
            }
          }
        })
        scrollTable.addEventListener('scroll', (e) => {
          scrollLeft = e.target.scrollLeft
        })
      }
    },
    updateFilter () {
      if (this.filter.length > 0) {
        if (this.filter.find((a) => typeof a.valueFilter !== 'undefined')) {
          let check = this.filter.find((item) => item.valueFilter.length < 1)
          if (check) {
            this.word_filter = check.valueFilter
            check.valueFilter = ''
            this.dialogFilterItem = check
            this.dialogFilter = true
          }
        } else {
          this.filter = []
          this.cancelFilter = true
        }
        this.filter = this.filter.filter((item) => item.valueFilter)
      }
    },
    actionFilter () {
      let item = this.dialogFilterItem
      if (item.typeFilter === 'Select') {
        let val = this.itemSelectFilter.find((item) => item._id === this.word_filter)
        item.value = item.text + ': ' + val.text
      } else {
        item.value = item.text + ': ' + item.valueFilter
      }
      item.valueFilter = this.word_filter
      item.selected = true
      this.itemsSelected.push(item.filter)
      this.filter.push(item)
      this.dialogFilter = !this.dialogFilter
      this.word_filter = ''
    },
    sortByDefault () {
      let sortBy = {}
      sortBy[this.pagination.sortBy.replace('_timestamp', '')] = (this.pagination.descending === true) ? -1 : 1
      this.$emit('update:sortBy', sortBy)
      this.sortBy = sortBy
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
      let sortBy = {}
      sortBy[this.pagination.sortBy.replace('_timestamp', '')] = (this.pagination.descending === true) ? -1 : 1
      this.$emit('update:sortBy', sortBy)
      this.sortBy = sortBy
      if ((this.lastSeen.page * this.pagination.rowsPerPage) < this.totalItems && this.pagination.rowsPerPage !== -1) {
        this.fetchData(this.pagination)
      } else {
        this.parseData()
      }
    },
    closeDialogFilter () {
      this.dialogFilter = !this.dialogFilter
      this.word_filter = ''
      if (this.filter === null || this.filter.length === 0) {
        this.iconAddFilter = true
      }
    },
    onClickFilter () {
      this.iconAddFilter = false
      let autocomplete = this.$root.$el.querySelector('.v-autocomplete__table-filter')
      autocomplete.style.marginLeft = this.leftFilter + 'px'
    },
    onBlurFilter () {
      if (this.dialogFilter) {
        this.iconAddFilter = false
      } else if (this.filter === null || this.filter.length === 0) {
        this.iconAddFilter = true
      }
    },
    onCloseChips (item) {
      let remove = this.itemsFilter.find((i) => i === item)
      remove.value = remove.text
      remove.valueFilter = ''
      remove.selected = false
      this.filter = this.filter.filter((i) => i !== item)
      this.itemsSelected = this.itemsSelected.filter(i => i !== item.filter)
      if (this.filter === null || this.filter.length === 0) {
        this.iconAddFilter = true
      }
    },
    createLastSeen (val) {
      this.lastSeen = val
    },
    async fetchData (val, action) {
      this.loading = true
      this.createLastSeen(val)
      let params = {
        query: {
          $sort: this.sortBy,
          $limit: this.pagination.rowsPerPage,
          $skip: (this.pagination.rowsPerPage !== -1) ? ((this.pagination.page - 1) * this.pagination.rowsPerPage) : 0
        }
      }
      if (this.additionalFilter && this.additionalFilter.length > 0) {
        this.additionalFilter.forEach((item) => {
          params.query[item.key] = item.value
        })
      }
      if (this.filterValue.length > 0) {
        this.filterValue.forEach((item) => {
          if (item.type === 'Text') {
            let query = {}
            query['$search'] = item.value
            params.query[item.key] = query
          } else {
            params.query[item.key] = item.value
          }
        })
      }
      if (action !== 'init') {
        await this.sleep(1000)
      }
      this.$store.dispatch(this.serviceName + '/find', params)
        .then(response => {
          this.$emit('update:showFAB', true)
          this.loading = false
          this.totalItems = response.total
          this.parseData()
          switch (action) {
            case 'init':
              this.initLoadData = false
              this.loading = false
              break
          }
        })
    },
    parseData () {
      if (this.itemLists) {
        let sortBy = this.pagination.sortBy.replace('_timestamp', '')
        let start = 0
        let end = this.totalItems
        if (this.pagination.rowsPerPage > 0) {
          start = ((this.pagination.page - 1) * this.pagination.rowsPerPage)
          end = this.pagination.rowsPerPage * this.pagination.page
        }
        if (this.totalItems > 0) {
          let tempItems = this.itemLists
          if (this.filterValue.length > 0) {
            this.filterValue.forEach((filter) => {
              if (filter.type === 'Text') {
                tempItems = tempItems.filter(item => _.get(item, filter.key).toLowerCase().includes(filter.value.toLowerCase()))
              } else {
                if (filter.withId) {
                  tempItems = tempItems.filter(item => _.get(item, filter.key)._id === filter.value)
                } else {
                  tempItems = tempItems.filter(item => _.get(item, filter.key) === filter.value)
                }
              }
            })
          }
          this.items = (_.orderBy(tempItems, sortBy, (this.pagination.descending === true) ? 'desc' : 'asc')).slice(start, end)
        } else {
          this.items = []
        }
        this.$emit('update:items', this.items)
        this.createEffect(this, window)
      }
    },
    eventSocket () {
      api.service(this.serviceName).on('created', () => {
        this.totalItems++
        this.parseData()
      })
      api.service(this.serviceName).on('patched', () => {
        this.parseData()
      })
      api.service(this.serviceName).on('updated', () => {
        this.parseData()
      })
      api.service(this.serviceName).on('removed', () => {
        this.totalItems--
        this.parseData()
      })
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },
  mounted () {
    this.$store.dispatch('setBreadcrumbs', [])
    this.generateTable(this, window, 'init')
    this.pagination = this.paginationDefault
    this.sortByDefault()
    this.fetchData(this.pagination, 'init')
    this.eventSocket()
    this.$root.$on('pushDataTable', (serviceName, action) => {
      if (this.serviceName === serviceName) {
        switch (action) {
          case 'created':
            this.totalItems++
            break
          case 'removed':
            this.totalItems--
            break
        }
        this.parseData()
      }
    })
  }
}
</script>

<style lang="sass">
  .loadingBackgroundContent
    position: absolute
    width: 100%
    height: 100vh
    top: 114px
    display: none
    &.isActive
      display: block
    .loadingBackgroundDatatable
      height: 100vh
      background: #fff
      opacity: 0.4
</style>