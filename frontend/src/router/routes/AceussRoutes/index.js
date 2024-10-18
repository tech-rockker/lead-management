import { lazy } from 'react'
import ExtraRoutes from './ExtraRoutes'
import AdminRoutes from './adminRoutes'
import CalenderRoutes from './calenderRoutes'
import CompanyRoutes from './companyRoutes'

const AcceussRoutes = [
  ...CalenderRoutes,
  ...AdminRoutes,
  ...CompanyRoutes,
  ...ExtraRoutes,

  // login
  {
    path: '/authentication',
    exact: true,
    component: lazy(() => import('../../../views/auth/login')),
    layout: 'BlankLayout',
    name: 'authentication',
    meta: {
      authRoute: true
    }
  },
  // forgot password
  {
    path: '/authentication/forgot-password',
    component: lazy(() => import('../../../views/auth/forgotPassword')),
    layout: 'BlankLayout',
    exact: true,
    name: 'authentication.forgotPassword',
    meta: {
      authRoute: true
    }
  },
  // reset password
  {
    path: '/authentication/reset-password/:token',
    component: lazy(() => import('../../../views/auth/resetPassword')),
    layout: 'BlankLayout',
    exact: true,
    name: 'authentication.resetPassword',
    meta: {
      authRoute: true
    }
  }
]

export default AcceussRoutes
