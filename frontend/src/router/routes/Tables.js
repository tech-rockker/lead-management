import { lazy } from 'react'

const TablesRoutes = [
  {
    path: '/tables/reactstrap',
    component: lazy(() => import('../../examples/tables/reactstrap'))
  },
  {
    path: '/datatables/basic',
    component: lazy(() => import('../../examples/tables/data-tables/basic'))
  },
  {
    path: '/datatables/advance',
    component: lazy(() => import('../../examples/tables/data-tables/advance'))
  }
]

export default TablesRoutes
