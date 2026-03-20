import { routes } from '@/router'

function isRoutable(item) {
  return item && item.meta && !item.meta.hideInMenu
}

function resolvePath(basePath, path) {
  if (!basePath) return path.startsWith('/') ? path : `/${path}`
  if (path.startsWith('/')) return path
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`
  return `${base}${path}`.replace(/\/+/g, '/')
}

export function getMenuTree() {
  const root = routes.find((r) => r.path === '/')
  const children = (root && root.children) || []

  return children
    .filter(isRoutable)
    .map((r) => {
      const fullPath = resolvePath('', r.path)
      const node = {
        path: fullPath,
        title: r.meta?.title || '',
        icon: r.meta?.icon || '',
        children: [],
      }

      if (Array.isArray(r.children) && r.children.length) {
        node.children = r.children
          .filter(isRoutable)
          .map((c) => ({
            path: resolvePath(fullPath, c.path),
            title: c.meta?.title || '',
          }))
      }

      return node
    })
}

