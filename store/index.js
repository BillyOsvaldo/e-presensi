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
    service('organizationsselect'),
    service('machinesusersmanagement'),
    service('findusersbyorganization'),
    service('findmachinesusersbyorganization'),
    service('fingersusers'),
    service('absencestypesmanagement'),
    service('absencesmanagement'),
    service('absencestypesselect'),
    service('presencesreports'),
    /* service('userRegistration'),
    service('userapp'),
    service('addresses'),
    service('coderegs'),
    service('checkcode', {
      idField: 'code'
    }),
    service('resend-email', {
      idField: 'status'
    }),
    service('checkuser', {
      idField: 'status'
    }),
    service('users'),
    service('profiles'),
    service('postcodes'),
    service('organizationusers'),
    service('organizations'),
    service('roles'),
    service('permissions'),
    service('administrators'),
    service('apps'),
    service('usersmanagement'),
    service('coderegsmanagement'),
    service('organizationsmanagement'),
    service('appsmanagement'),
    service('permissionsmanagement'),
    service('appsselect'),
    service('administratorsselect'),
    service('rolesmanagement'),
    service('structuresmanagement'),
    service('organizationsselect'),
    service('structuresselect'),
    service('organizationstructuresmanagement'),
    service('structureparentselect'),
    service('administratorsmanagement'),
    service('organizationusersmanagement'),
    service('usersselect'),
    service('organizationstructuresusersmanagement'),
    service('organizationstructuresusersdraftmanagement'),
    service('organizationstructuresselect'),
    service('organizationusersexpand'),
    service('organizationusersdraftmanagement'),
    service('organizationusersbyuser'),
    service('organizationstructuresusersbyuser'),
    service('checkorganizationusers'),
    service('allorganizationusersdraft'),
    service('administratorsorganizationsmanagement'),
    service('permissionsadminorganizationsselect'),
    service('checkemail', {
      idField: 'status'
    }),
    service('checkusername', {
      idField: 'status'
    }),
    service('administratorpermissionsmanagement'),  */
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
