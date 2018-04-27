import Vue from 'vue'
if (process.browser) {
  window.onNuxtReady(() => {
    const VueFullCalendar = require('vue-full-calendar')
    Vue.component('full-calendar', VueFullCalendar)
    Vue.use(VueFullCalendar)
  })
}
