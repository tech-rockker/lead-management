import { lazy } from 'react'

const ChartMapsRoutes = [
  {
    path: '/charts/apex',
    component: lazy(() => import('../../examples/charts/apex'))
  },
  {
    path: '/charts/chartjs',
    component: lazy(() => import('../../examples/charts/chart-js'))
  },
  {
    path: '/charts/recharts',
    component: lazy(() => import('../../examples/charts/recharts'))
  }
]

export default ChartMapsRoutes
