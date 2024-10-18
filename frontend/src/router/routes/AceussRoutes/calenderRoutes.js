import { lazy } from 'react'
import { Permissions } from '../../../utility/Permissions'

const CalenderRoutes = [
  {
    path: '/master/task/calendar',
    component: lazy(() => import('../../../views/calendar/index')),
    exact: true,
    name: 'master.task.calendar',
    meta: {
      title: 'calendar',
      ...Permissions.calendarBrowse
    }
  }
]

export default CalenderRoutes
