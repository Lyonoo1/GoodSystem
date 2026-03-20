import { getToken } from '@/utils/auth'

const WHITE_LIST = ['/login']

export function setupGuards(router) {
  router.beforeEach((to, _from, next) => {
    if (to.meta && to.meta.title) {
      document.title = `${to.meta.title} - GPT_WEB`
    } else {
      document.title = 'GPT_WEB'
    }

    const token = getToken()
    if (token) {
      if (to.path === '/login') return next({ path: '/' })
      return next()
    }

    if (WHITE_LIST.includes(to.path)) return next()
    return next({ path: '/login', query: { redirect: to.fullPath } })
  })
}

