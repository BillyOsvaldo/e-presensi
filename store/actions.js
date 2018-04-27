import {initAuth} from '../utils/initauth'
import * as mutations from './mutation-types'

export default {
  nuxtServerInit ({ commit, dispatch }, { req }) {
    return initAuth({
      commit,
      dispatch,
      req,
      moduleName: 'auth',
      cookieName: 'feathers-jwt'
    })
  },
  setNavigationTitle (context, title) {
    context.commit(mutations.SET_NAVIGATION_TITLE, title)
  },
  setNavigationCount (context, count) {
    context.commit(mutations.SET_NAVIGATION_COUNT, count)
  }
}
