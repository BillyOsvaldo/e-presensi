import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'
import feathersClient from '../api/feathers-client'
import state from './state.js'
import getters from './getters.js'
import mutations from './mutations.js'
import actions from './actions.js'

const { service, auth } = feathersVuex(feathersClient, { idField: '_id' })

Vue.use(Vuex)

export const storeSocket = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [
    service('usersauthentication'),
    service('menus'),
    service('menusmanagement'),
    service('rolesselect'),
    service('permissionsselect'),
    service('machinesmanagement'),
    service('machinesusers'),
    service('organizationsselect'),
    service('machinesusersmanagement'),
    service('findusersbyorganization'),
    service('findmachinesusersbyorganization'),
    service('fingersusers'),
    service('absencestypesmanagement'),
    service('absences'),
    service('absencesmanagement'),
    service('absencestypesselect'),
    service('settings'),
    service('timesmanagement'),
    service('presencesreportssingle', {
      idField: 'id'
    }),
    service('presences'),
    service('presencesreports'),
    service('presencestoday'),
    service('presencestodaysummary'),
    service('infoorganizations'),
    service('applists'),
    service('timeserver', {
      idField: 'time'
    }),
    service('presencestodayorganizations'),
    auth(
      {
        state: {
          publicPages: [
            'signin', 'signup'
          ]
        },
        userService: 'users'
      }
    )
  ]
})

const createStore = () => {
  return storeSocket
}

export default createStore
