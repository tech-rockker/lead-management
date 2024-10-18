import { lazy } from 'react'

const UiElementRoutes = [
  {
    path: '/ui-element/typography',
    component: lazy(() => import('../../examples/ui-elements/typography'))
  },
  {
    path: '/icons/reactfeather',
    component: lazy(() => import('../../examples/ui-elements/icons'))
  },
  {
    path: '/cards/basic',
    component: lazy(() => import('../../examples/ui-elements/cards/basic'))
  },
  {
    path: '/cards/advance',
    component: lazy(() => import('../../examples/ui-elements/cards/advance'))
  },
  {
    path: '/cards/statistics',
    component: lazy(() => import('../../examples/ui-elements/cards/statistics'))
  },
  {
    path: '/cards/analytics',
    component: lazy(() => import('../../examples/ui-elements/cards/analytics'))
  },
  {
    path: '/cards/action',
    component: lazy(() => import('../../examples/ui-elements/cards/actions'))
  },
  {
    path: '/components/accordion',
    component: lazy(() => import('../../examples/components/accordion'))
  },
  {
    path: '/components/alerts',
    component: lazy(() => import('../../examples/components/alerts'))
  },
  {
    path: '/components/auto-complete',
    component: lazy(() => import('../../examples/components/autocomplete'))
  },
  {
    path: '/components/avatar',
    component: lazy(() => import('../../examples/components/avatar'))
  },
  {
    path: '/components/badges',
    component: lazy(() => import('../../examples/components/badge'))
  },
  {
    path: '/components/blockui',
    component: lazy(() => import('../../examples/components/block-ui'))
  },
  {
    path: '/components/breadcrumbs',
    component: lazy(() => import('../../examples/components/breadcrumbs'))
  },
  {
    path: '/components/buttons',
    component: lazy(() => import('../../examples/components/buttons'))
  },
  {
    path: '/components/carousel',
    component: lazy(() => import('../../examples/components/carousel'))
  },
  {
    path: '/components/collapse',
    component: lazy(() => import('../../examples/components/collapse'))
  },
  {
    path: '/components/divider',
    component: lazy(() => import('../../examples/components/divider'))
  },
  {
    path: '/components/dropdowns',
    component: lazy(() => import('../../examples/components/dropdowns'))
  },
  {
    path: '/components/list-group',
    component: lazy(() => import('../../examples/components/listGroup'))
  },
  {
    path: '/components/modals',
    component: lazy(() => import('../../examples/components/modal'))
  },
  {
    path: '/components/nav-component',
    component: lazy(() => import('../../examples/components/navComponent'))
  },
  {
    path: '/components/offcanvas',
    component: lazy(() => import('../../examples/components/offcanvas'))
  },
  {
    path: '/components/pagination',
    component: lazy(() => import('../../examples/components/pagination'))
  },
  {
    path: '/components/pill-badges',
    component: lazy(() => import('../../examples/components/badgePills'))
  },
  {
    path: '/components/pills-component',
    component: lazy(() => import('../../examples/components/tabPills'))
  },
  {
    path: '/components/popovers',
    component: lazy(() => import('../../examples/components/popovers'))
  },
  {
    path: '/components/progress',
    component: lazy(() => import('../../examples/components/progress'))
  },
  {
    path: '/components/spinners',
    component: lazy(() => import('../../examples/components/spinners'))
  },
  {
    path: '/components/tabs-component',
    component: lazy(() => import('../../examples/components/tabs'))
  },
  {
    path: '/components/timeline',
    component: lazy(() => import('../../examples/components/timeline'))
  },
  {
    path: '/components/toasts',
    component: lazy(() => import('../../examples/components/toasts'))
  },
  {
    path: '/components/tooltips',
    component: lazy(() => import('../../examples/components/tooltips'))
  }
]

export default UiElementRoutes
