import { lazy } from 'react'
import { Permissions } from '../../../utility/Permissions'

const ExtraRoutes = [
  {
    path: '/country-list',
    component: lazy(() => import('../../../views/common/countryList')),
    exact: true,
    name: 'country-list',
    meta: {
      title: 'country-list',
      action: 'browse',
      resource: 'country-list'
    }
  },

  {
    path: '/permissions',
    component: lazy(() => import('../../../views/permissions')),
    exact: true,
    name: 'permissions',
    meta: {
      title: 'permissions',
      action: 'browse',
      resource: 'permissions'
    }
  },
  {
    path: '/contact-us',
    component: lazy(() => import('../../../views/pages/contactUs')),
    exact: true,
    name: 'contact-us',
    meta: {
      title: 'contact-us',
      action: 'browse',
      resource: 'contact-us'
    }
  },
  {
    path: '/chat-msg',
    component: lazy(() => import('../../../views/ChatsAndMessage')),
    exact: true,
    name: 'chat-msg',
    meta: {
      title: 'Messages',
      action: 'browse',
      resource: 'chat-msg'
    }
  },
  {
    path: '/settings/bank-detail',
    component: lazy(() => import('../../../views/settings/bankDetail')),
    exact: true,
    name: 'settings.bankDetail',
    meta: {
      type: 'browse',
      title: 'Bank Detail',
      ...Permissions.bankBrowse
    }
  },
  {
    path: '/socket',
    component: lazy(() => import('../../../utility/hooks/useSocket')),
    exact: true,
    name: 'socket',
    meta: {
      type: 'browse',
      title: 'SOcket Detail',
      ...Permissions.notificationsBrowse
    }
  },
  {
    path: '/license-renew',
    component: lazy(() => import('../../../views/auth/license')),
    exact: true,
    name: 'license',
    layout: 'BlankLayout',
    meta: {
      title: 'license',
      authRoute: true
    }
  },
  {
    path: '/messages',
    component: lazy(() => import('../../../views/chat')),
    exact: true,
    name: 'messages',
    appLayout: true,
    className: 'chat-application',
    meta: {
      title: 'messages',
      ...Permissions.dashboardBrowse
    }
  }
]

export default ExtraRoutes
