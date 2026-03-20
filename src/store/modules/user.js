import { clearToken, clearUserInfo, getToken, getUserInfo, setToken, setUserInfo } from '@/utils/auth'

function mockFetchUser(username) {
  return {
    id: 'u_001',
    name: username || 'Admin',
    role: '管理员',
    avatar: '',
  }
}

export default {
  namespaced: true,
  state: () => ({
    token: getToken(),
    userInfo: getUserInfo(),
  }),
  getters: {
    isAuthed(state) {
      return !!state.token
    },
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
  },
  actions: {
    async login({ commit }, payload) {
      const { username } = payload || {}
      const token = `mock_${Date.now()}`
      const userInfo = mockFetchUser(username)

      setToken(token)
      setUserInfo(userInfo)
      commit('setToken', token)
      commit('setUserInfo', userInfo)
    },
    logout({ commit }) {
      clearToken()
      clearUserInfo()
      commit('setToken', '')
      commit('setUserInfo', null)
    },
    hydrate({ commit }) {
      commit('setToken', getToken())
      commit('setUserInfo', getUserInfo())
    },
  },
}

