<template>
  <div class="home">
    <v-layout justify-center row wrap>
      <div style="overflow-x: auto;overflow-y: hidden;position: fixed; top: 130px; left: 0; right: 0; bottom: 0;">
        <div class="fullcalendar" v-bind="loadData"></div>
      </div>
    </v-layout>
  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import 'fullcalendar'
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/gcal'
import 'assets/styles/materialFullCalender.scss'
import api from '~/api/feathers-client'
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    fc: null,
    m: moment().month() + 1,
    y: moment().year()
  }),
  computed: {
    ...mapGetters({
      'dataUser': 'usersauthentication/current',
      'reportList': 'presencesreportssingle/list'
    }),
    loadData () {
      if (this.reportList) {
        if (this.cal) {
          // console.log(this.reportList)
          this.cal.fullCalendar('renderEvents', this.reportList)
        }
      }
    }
  },
  methods: {
    initialize () {
      let params = {
        query: {
          user: this.dataUser._id,
          month: this.m,
          year: this.y
        }
      }
      this.$store.dispatch('presencesreportssingle/find', params)

      api.service('presences').on('created', (doc) => {
        console.log(doc)
      })
    }
  },
  created () {
    this.$store.commit('presencesreportssingle/clearAll')
    this.initialize()
    this.$store.dispatch('setNavigationCount', 0)
  },
  mounted () {
    var args = {
      header: {
        left: 'today',
        center: 'title',
        right: 'prev,next'
      },
      locale: 'id',
      defaultView: 'month',
      height: 'parent',
      googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
      eventSources: [
        {
          googleCalendarId: 'id.indonesian#holiday@group.v.calendar.google.com',
          className: 'gcal-event'
        }
      ],
      eventClick: function (event) {
        return false
      }
    }
    var self = this
    this.cal = $(self.$el.querySelector('.fullcalendar'))
    this.cal.fullCalendar(args)
    this.$el.querySelector('.fc-today-button').addEventListener('click', () => {
      this.m = moment().month() + 1
      let params = {
        query: {
          user: this.dataUser._id,
          month: this.m,
          year: this.y
        }
      }
      this.$store.dispatch('presencesreportssingle/find', params)
    })
    this.$el.querySelector('.fc-next-button').addEventListener('click', () => {
      this.m++
      let params = {
        query: {
          user: this.dataUser._id,
          month: this.m,
          year: this.y
        }
      }
      this.$store.dispatch('presencesreportssingle/find', params)
    })
    this.$el.querySelector('.fc-prev-button').addEventListener('click', () => {
      this.m--
      let params = {
        query: {
          user: this.dataUser._id,
          month: this.m,
          year: this.y
        }
      }
      this.$store.dispatch('presencesreportssingle/find', params)
    })
  }
}
</script>

<style lang="sass">
  .fc-sun, .gcal-event
    background-color: #FF5252
    color: white
    padding: 2px
    border: none
    border-radius: 0
    min-height: 36px
    line-height: 34px
  .fc-today
    background-color: #FFF9C4 !important
  .mode-in
    background-color: #2196F3 !important
    border: none
    padding: 2px
    text-align: center
    border-radius: 0
  .mode-out
    background-color: #8BC34A !important
    border: none
    padding: 2px
    text-align: center
    border-radius: 0
  .absence
    padding: 2px
    border: none
    text-align: center
    border-radius: 0
    min-height: 36px
    line-height: 35px
  .ijin
    background-color: #FF9800 !important
  .dinas-luar
    background-color: #9C27B0 !important
  .cuti
    background-color: #009688 !important
  .sakit
    background-color: #795548 !important
</style>
