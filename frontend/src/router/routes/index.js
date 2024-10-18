// ** Routes Imports
import AppRoutes from './Apps'
import FormRoutes from './Forms'
import PagesRoutes from './Pages'
import TablesRoutes from './Tables'
import ChartsRoutes from './Charts'
import DashboardRoutes from './Dashboards'
import UiElementRoutes from './UiElements'
import ExtensionsRoutes from './Extensions'
import PageLayoutsRoutes from './PageLayouts'
import AceussRoutes from './AceussRoutes'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/dashboard/home'

// ** Merge Routes
const Routes = [
  // ...AppRoutes,
  // ...PagesRoutes,
  // ...UiElementRoutes,
  // ...ExtensionsRoutes,
  // ...PageLayoutsRoutes,
  // ...FormRoutes,
  // ...TablesRoutes,
  // ...ChartsRoutes,

  ...AceussRoutes,
  ...DashboardRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
