import { getPath } from '../../router/RouteHelper'
import { log } from './common'

export const DashboardLocator = (type, dashboards, history, status) => {
  const item = dashboards
  log(item)
  switch (type) {
    case 'ip':
      history.push({
        pathname: getPath('implementations'),
        state: {
          status,
          dashboards
        }
      })
      break
    case 'task':
      history.push({
        pathname: getPath('master.tasks'),
        state: {
          status,
          dashboards
        }
      })
      break
    default:
      break
  }
}
