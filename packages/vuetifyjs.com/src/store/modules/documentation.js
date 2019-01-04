import { set } from '@/util/vuex'
import deprecatedIn from '@/data/deprecated'
import newIn from '@/data/new'

export default {
  namespaced: true,

  state: {
    deprecatedIn,
    newIn,
    page: null
  },

  mutations: {
    setPage: set('page')
  }
}
