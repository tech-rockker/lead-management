// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import todo from '@src/examples/apps/todo/store'
import chat from '../views/chat/store'
import users from '@src/examples/apps/user/store'
import email from '@src/examples/apps/email/store'
import invoice from '@src/examples/apps/invoice/store'
import calendar from '@src/examples/apps/calendar/store'
import ecommerce from '@src/examples/apps/ecommerce/store'
import dataTables from '@src/examples/tables/data-tables/store'
import permissions from '@src/examples/apps/roles-permissions/store'
import categories from './reducers/categories'
import companiesTypes from './reducers/companiesTypes'
import companies from './reducers/companies'
import packages from './reducers/packages'
import activityCls from './reducers/activityClassification'
import moduleApis from './reducers/modules'
import userTypesApis from './reducers/user-types'
import licenseCls from './reducers/license'
import notificationCls from './reducers/notifications'
import requests from './reducers/requests'
import categoriesTypes from './reducers/categoriesTypes'
import categoriesParent from './reducers/categoriesParent'
import Permissions from './reducers/Permissions'
import departments from './reducers/departments'
import userManagement from './reducers/userManagement'
import activity from './reducers/activity'
import ip from './reducers/ip'
import followups from './reducers/followups'
import companyWorkShift from './reducers/companyWorkShift'
import bank from './reducers/bank'
import salary from './reducers/salary'
import roles from './reducers/roles'
import common from './reducers/common'
import branch from './reducers/branch'
import questions from './reducers/questions'
import redWord from './reducers/redWord'
import paragraph from './reducers/paragraph'
import task from './reducers/task'
import comment from './reducers/comment'
import emergencyContact from './reducers/emergencyContact'
import emailTemplate from './reducers/emailTemplate'
import smsTemplate from './reducers/smsTemplate'
import approval from './reducers/approval'
import dashboard from './reducers/dashboard'
import activitytrashed from './reducers/activitytrashed'
import fileupload from './reducers/fileupload'
import journal from './reducers/journal'
import devitation from './reducers/devitation'
import patientCashiers from './reducers/patientCashiers.js'
import languageLabel from './reducers/languageLabel'
import schedule from './reducers/schedule'
import ovhour from './reducers/ovhour'
import leave from './reducers/leave'
import stampling from './reducers/stampling'
import scheduleTemplate from './reducers/scheduleTemplate'
import pack from './reducers/package'
import log from './reducers/logs'
import folderUpload from './reducers/folderUpload'

const rootReducer = {
  log,
  folderUpload,
  pack,
  scheduleTemplate,
  ovhour,
  schedule,
  leave,
  languageLabel,
  activity,
  approval,
  journal,
  smsTemplate,
  dashboard,
  emailTemplate,
  emergencyContact,
  comment,
  task,
  paragraph,
  redWord,
  questions,
  branch,
  common,
  roles,
  salary,
  bank,
  companyWorkShift,
  followups,
  ip,
  userManagement,
  departments,
  Permissions,
  categoriesParent,
  categoriesTypes,
  companies,
  requests,
  notificationCls,
  licenseCls,
  userTypesApis,
  moduleApis,
  activityCls,
  categories,
  companiesTypes,
  packages,
  activitytrashed,
  fileupload,
  devitation,
  patientCashiers,
  stampling,

  auth,
  todo,
  chat,
  email,
  users,
  navbar,
  layout,
  invoice,
  calendar,
  ecommerce,
  dataTables,
  permissions
}

export default rootReducer
