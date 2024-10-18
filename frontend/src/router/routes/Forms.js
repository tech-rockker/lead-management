import { lazy } from 'react'
import { Permissions } from '../../utility/Permissions'

const FormRoutes = [
  {
    path: '/forms/elements/input',
    component: lazy(() => import('../../examples/forms/form-elements/input'))
  },
  {
    path: '/forms/elements/input-group',
    component: lazy(() => import('../../examples/forms/form-elements/input-groups'))
  },
  {
    path: '/forms/elements/input-mask',
    component: lazy(() => import('../../examples/forms/form-elements/input-mask'))
  },
  {
    path: '/forms/elements/textarea',
    component: lazy(() => import('../../examples/forms/form-elements/textarea'))
  },
  {
    path: '/forms/elements/checkbox',
    component: lazy(() => import('../../examples/forms/form-elements/checkboxes'))
  },
  {
    path: '/forms/elements/radio',
    component: lazy(() => import('../../examples/forms/form-elements/radio'))
  },
  {
    path: '/forms/elements/switch',
    component: lazy(() => import('../../examples/forms/form-elements/switch'))
  },
  {
    path: '/forms/elements/select',
    component: lazy(() => import('../../examples/forms/form-elements/select'))
  },
  {
    path: '/forms/elements/number-input',
    component: lazy(() => import('../../examples/forms/form-elements/number-input'))
  },
  {
    path: '/forms/elements/file-uploader',
    component: lazy(() => import('../../examples/forms/form-elements/file-uploader'))
  },
  {
    path: '/forms/elements/editor',
    component: lazy(() => import('../../examples/forms/form-elements/editor'))
  },
  {
    path: '/forms/elements/pickers',
    component: lazy(() => import('../../examples/forms/form-elements/datepicker'))
  },
  {
    path: '/forms/layout/form-layout',
    component: lazy(() => import('../../examples/forms/form-layouts'))
  },
  {
    path: '/forms/wizard',
    component: lazy(() => import('../../examples/forms/wizard')),
    meta: {
      title: 'wizart',
      ...Permissions.patientsAdd
    }
  },
  {
    path: '/forms/form-validation',
    component: lazy(() => import('../../examples/forms/validation'))
  },
  {
    path: '/forms/form-repeater',
    component: lazy(() => import('../../examples/forms/form-repeater'))
  }
]

export default FormRoutes
