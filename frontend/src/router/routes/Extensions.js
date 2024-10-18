import { lazy } from 'react'

const ExtensionsRoutes = [
  {
    path: '/extensions/sweet-alert',
    component: lazy(() => import('../../examples/extensions/sweet-alert'))
  },
  {
    path: '/extensions/toastr',
    component: lazy(() => import('../../examples/extensions/toastify'))
  },
  {
    path: '/extensions/slider',
    component: lazy(() => import('../../examples/extensions/sliders'))
  },
  // {
  //     path: '/extensions/drag-and-drop',
  //     component: lazy(() => import('../../examples/extensions/drag-and-drop'))
  // },
  {
    path: '/extensions/tour',
    component: lazy(() => import('../../examples/extensions/tour'))
  },
  {
    path: '/extensions/clipboard',
    component: lazy(() => import('../../examples/extensions/copy-to-clipboard'))
  },
  {
    path: '/extensions/react-player',
    component: lazy(() => import('../../examples/extensions/react-player'))
  },
  {
    path: '/extensions/context-menu',
    component: lazy(() => import('../../examples/extensions/context-menu'))
  },
  {
    path: '/extensions/swiper',
    component: lazy(() => import('../../examples/extensions/swiper'))
  },
  {
    path: '/access-control',
    component: lazy(() => import('../../examples/extensions/access-control')),
    meta: {
      action: 'read',
      resource: 'ACL'
    }
  },
  {
    path: '/extensions/ratings',
    component: lazy(() => import('../../examples/extensions/ratings'))
  },
  {
    path: '/extensions/pagination',
    component: lazy(() => import('../../examples/extensions/pagination'))
  },
  {
    path: '/extensions/import',
    component: lazy(() => import('../../examples/extensions/import-export/Import'))
  },
  {
    path: '/extensions/export',
    component: lazy(() => import('../../examples/extensions/import-export/Export'))
  },
  {
    path: '/extensions/export-selected',
    component: lazy(() => import('../../examples/extensions/import-export/ExportSelected'))
  },
  {
    path: '/extensions/i18n',
    component: lazy(() => import('../../examples/extensions/i18n'))
  }
]

export default ExtensionsRoutes
