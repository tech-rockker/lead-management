import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

const PagesRoutes = [
  {
    path: '/login',
    component: lazy(() => import('../../examples/pages/authentication/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/pages/login-basic',
    component: lazy(() => import('../../examples/pages/authentication/LoginBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/login-cover',
    component: lazy(() => import('../../examples/pages/authentication/LoginCover')),
    layout: 'BlankLayout'
  },
  {
    path: '/register',
    component: lazy(() => import('../../examples/pages/authentication/Register')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/pages/register-basic',
    component: lazy(() => import('../../examples/pages/authentication/RegisterBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/register-cover',
    component: lazy(() => import('../../examples/pages/authentication/RegisterCover')),
    layout: 'BlankLayout'
  },
  {
    path: '/forgot-password',
    component: lazy(() => import('../../examples/pages/authentication/ForgotPassword')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/pages/forgot-password-basic',
    component: lazy(() => import('../../examples/pages/authentication/ForgotPasswordBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/forgot-password-cover',
    component: lazy(() => import('../../examples/pages/authentication/ForgotPasswordCover.js')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/reset-password-basic',
    component: lazy(() => import('../../examples/pages/authentication/ResetPasswordBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/reset-password-cover',
    component: lazy(() => import('../../examples/pages/authentication/ResetPasswordCover')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/verify-email-basic',
    component: lazy(() => import('../../examples/pages/authentication/VerifyEmailBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/verify-email-cover',
    component: lazy(() => import('../../examples/pages/authentication/VerifyEmailCover')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/two-steps-basic',
    component: lazy(() => import('../../examples/pages/authentication/TwoStepsBasic')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/two-steps-cover',
    component: lazy(() => import('../../examples/pages/authentication/TwoStepsCover')),
    layout: 'BlankLayout'
  },
  {
    path: '/pages/profile',
    component: lazy(() => import('../../examples/pages/profile'))
  },
  {
    path: '/pages/faq',
    component: lazy(() => import('../../examples/pages/faq'))
  },
  {
    path: '/pages/knowledge-base',
    exact: true,
    component: lazy(() => import('../../examples/pages/knowledge-base/KnowledgeBase'))
  },
  {
    path: '/pages/knowledge-base/:category',
    exact: true,
    component: lazy(() => import('../../examples/pages/knowledge-base/KnowledgeBaseCategory')),
    meta: {
      navLink: '/pages/knowledge-base'
    }
  },
  {
    path: '/pages/knowledge-base/:category/:question',
    component: lazy(() =>
      import('../../examples/pages/knowledge-base/KnowledgeBaseCategoryQuestion')
    ),
    meta: {
      navLink: '/pages/knowledge-base'
    }
  },
  {
    path: '/pages/account-settings',
    component: lazy(() => import('../../examples/pages/account-settings'))
  },
  {
    path: '/pages/license',
    component: lazy(() => import('../../examples/pages/license'))
  },
  {
    path: '/pages/api-key',
    component: lazy(() => import('../../examples/pages/api-key'))
  },
  {
    path: '/pages/modal-examples',
    component: lazy(() => import('../../examples/pages/modal-examples'))
  },
  {
    path: '/pages/blog/list',
    exact: true,
    component: lazy(() => import('../../examples/pages/blog/list'))
  },
  {
    path: '/pages/blog/detail/:id',
    exact: true,
    component: lazy(() => import('../../examples/pages/blog/details')),
    meta: {
      navLink: '/pages/blog/detail'
    }
  },
  {
    path: '/pages/blog/detail',
    exact: true,
    component: () => <Redirect to='/pages/blog/detail/1' />
  },
  {
    path: '/pages/blog/edit/:id',
    exact: true,
    component: lazy(() => import('../../examples/pages/blog/edit')),
    meta: {
      navLink: '/pages/blog/edit'
    }
  },
  {
    path: '/pages/blog/edit',
    exact: true,
    component: () => <Redirect to='/pages/blog/edit/1' />
  },
  {
    path: '/pages/pricing',
    component: lazy(() => import('../../examples/pages/pricing'))
  },
  {
    path: '/misc/coming-soon',
    component: lazy(() => import('../../examples/pages/misc/ComingSoon')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/misc/not-authorized',
    component: lazy(() => import('../../examples/pages/misc/NotAuthorized')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/misc/maintenance',
    component: lazy(() => import('../../examples/pages/misc/Maintenance')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/misc/error',
    component: lazy(() => import('../../examples/pages/misc/Error')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  }
]

export default PagesRoutes
