<template>
  <div class="home">
    <v-layout justify-center row wrap>
      <div style="overflow-x: auto;overflow-y: hidden;position: fixed; top: 130px; left: 0; right: 0; bottom: 0;">
        <div class="fullcalendar"></div>
      </div>
    </v-layout>
  </div>
</template>

<script>
import $ from 'jquery'
import 'fullcalendar'
import 'fullcalendar/dist/fullcalendar.css'
import 'fullcalendar/dist/gcal'
import 'assets/styles/materialFullCalender.scss'
export default {
  mounted () {
    var args = {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      locale: 'id',
      defaultView: 'month',
      height: 'parent',
      googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
      events: {
        googleCalendarId: 'id.indonesian#holiday@group.v.calendar.google.com',
        className: 'gcal-event'
      }
    }
    var self = this
    this.cal = $(self.$el.querySelector('.fullcalendar'))
    this.cal.fullCalendar(args)
  }
}
</script>

<style lang="sass">
  .fc-sun, .gcal-event
    background-color: #E53935
    color: white
</style>
