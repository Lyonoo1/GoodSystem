export default {
  namespaced: true,
  state: () => ({
    sidebarCollapsed: false,
  }),
  mutations: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed(state, val) {
      state.sidebarCollapsed = !!val
    },
  },
}

