import * as mutations from './mutation-types'

export default {
  [mutations.SET_NAVIGATION_TITLE] (state, title) {
    state.navigation_title = title
  },
  [mutations.SET_NAVIGATION_COUNT] (state, count) {
    state.navigation_count = count
  }
}
