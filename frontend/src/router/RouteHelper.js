import { Routes } from './routes'
import { formatRoute } from 'react-router-named-routes'

export const getPath = (name, params = null) => {
  const route = Routes.find((r) => r.name === name)
  if (route === undefined) {
    throw new Error('Route Not Found!! Please check the route name.')
  }
  const path = route?.path
  if (params && path) {
    return formatRoute(path, params)
  } else return path
}
