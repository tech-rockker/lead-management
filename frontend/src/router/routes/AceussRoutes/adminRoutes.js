import { lazy } from 'react'
import { Permissions } from '../../../utility/Permissions'

const AdminRoutes = [
  // Dashboards
  // {
  //     path: '/user/profile/:id?',
  //     name: "users.profile",
  //     component: lazy(() => import('../../../views/users/profile')),
  //     exact: true,
  //     meta: {
  //         title: "profile",
  //         ...Permissions.profileBrowse
  //     }
  // },
  {
    path: '/users/employees',
    component: lazy(() => import('../../../views/userManagement')),
    exact: true,
    name: 'users.employees',
    meta: {
      title: 'employees',
      ...Permissions.employeesBrowse
    }
  },
  {
    path: '/admin/employees',
    component: lazy(() => import('../../../views/userManagement')),
    exact: true,
    name: 'users.employees-admin',
    meta: {
      title: 'employees',
      ...Permissions.adminEmployeeBrowse
    }
  },
  {
    path: '/dashboard/home',
    name: 'dashboard.home',
    component: lazy(() => import('../../../views/dashboard/home')),
    meta: {
      title: 'Home',
      ...Permissions.dashboardBrowse
    }
  },

  {
    path: '/activity',
    component: lazy(() => import('../../../views/activity')),
    exact: true,
    name: 'activity',
    meta: {
      title: 'my-activity',
      ...Permissions.activitySelfBrowse
    }
  },
  {
    path: '/activity/:id',
    component: lazy(() => import('../../../views/activity/activityView/activityDetailModal')),
    exact: true,
    name: 'activity.detail',
    meta: {
      title: 'my-activity',
      ...Permissions.activitySelfRead
    }
  },

  ///Company
  {
    path: '/companies',
    component: lazy(() => import('../../../views/companies')),
    exact: true,
    name: 'companies',
    meta: {
      title: 'companies',
      ...Permissions.companiesBrowse
    }
  },
  {
    path: '/companies/create',
    component: lazy(() => import('../../../views/companies/companyForm.js')),
    exact: true,
    name: 'companies.create',
    meta: {
      title: 'companies',
      ...Permissions.companiesAdd
    }
  },

  {
    path: '/company/:id',
    component: lazy(() => import('../../../views/companies/companyDetails')),
    exact: true,
    name: 'companies.detail',
    meta: {
      title: 'companies',
      ...Permissions.companiesRead
    }
  },
  {
    path: '/company/update/:id',
    component: lazy(() => import('../../../views/companies/companyForm')),
    exact: true,
    name: 'companies.update',
    meta: {
      title: 'companies',
      ...Permissions.companiesEdit
    }
  },
  {
    path: '/master/profile/:id',

    component: lazy(() => import('../../../views/profile')),
    name: 'master.profile',
    meta: {
      title: 'company',
      ...Permissions.profileBrowse
    }
  },

  {
    path: '/profile/company/update/:id',
    component: lazy(() => import('../../../views/companies/companyForm')),
    exact: true,
    name: 'profile.companies.update',
    meta: {
      title: 'profile-details',
      ...Permissions.profileEdit
    }
  },
  /////Company
  {
    path: '/requests',
    component: lazy(() => import('../../../views/requests')),
    exact: true,
    name: 'requests',
    meta: {
      title: 'requests',
      ...Permissions.requestsBrowse
    }
  },
  {
    path: '/notifications',
    component: lazy(() => import('../../../views/notifications')),
    exact: true,
    name: 'notifications',
    meta: {
      title: 'notifications',
      ...Permissions.notificationsBrowse
    }
  },

  //journal
  {
    path: '/journal',
    component: lazy(() => import('../../../views/Journal/Journal')),
    exact: true,
    name: 'journal',
    meta: {
      title: 'journal',
      ...Permissions.journalSelfBrowse
    }
  },
  {
    path: '/stats',
    component: lazy(() => import('../../../views/Journal/JournalStats')),
    exact: true,
    name: 'stats',
    meta: {
      title: 'stats',
      ...Permissions.journalSelfBrowse
    }
  },
  //log
  {
    path: '/log/sms',
    component: lazy(() => import('../../../views/log/SmsLog')),
    exact: true,
    name: 'log.sms',
    meta: {
      title: 'sms-log',
      ...Permissions.smsLogBrowse
    }
  },
  {
    path: '/log/bankID',
    component: lazy(() => import('../../../views/log/BankIDLog')),
    exact: true,
    name: 'log.bankID',
    meta: {
      title: 'bankID-log',
      ...Permissions.bankIdLogBrowse
    }
  },
  {
    path: '/log/activity',
    component: lazy(() => import('../../../views/log/ActivityLog')),
    exact: true,
    name: 'log.activity',
    meta: {
      title: 'activity-log',
      ...Permissions.activityLogBrowse
    }
  },

  // Masters
  {
    path: '/master/categories',
    component: lazy(() => import('../../../views/masters/categories')),
    exact: true,
    name: 'master.categories',
    meta: {
      title: 'categories',
      ...Permissions.categoriesBrowse
    }
  },
  {
    path: '/master/categories/sub-categories/:id/:type',
    component: lazy(() => import('../../../views/masters/categories/subCategory')),
    exact: true,
    name: 'master.categories.sub-categories',
    meta: {
      title: 'sub-categories',
      ...Permissions.categoriesBrowse
    }
  },
  {
    path: '/master/category/types',
    component: lazy(() => import('../../../views/masters/categories/categoryTypes')),
    exact: true,
    name: 'master.categories.types',
    meta: {
      title: 'category-type',
      ...Permissions.categoriesBrowse
    }
  },
  {
    path: '/master/patient/types',
    component: lazy(() => import('../../../views/masters/patientTypes')),
    exact: true,
    name: 'master.patient.types',
    meta: {
      title: 'patient-type',
      ...Permissions.activitiesClsBrowse
    }
  },

  {
    path: '/master/activity-classification',
    component: lazy(() => import('../../../views/masters/activityClassification')),
    exact: true,
    name: 'master.activity-classification',
    meta: {
      title: 'activity-classification',
      ...Permissions.activitiesClsBrowse
    }
  },
  {
    path: '/master/red-word',
    component: lazy(() => import('../../../views/masters/redWord')),
    exact: true,
    name: 'master.red-word',
    meta: {
      title: 'red-word',
      ...Permissions.wordsBrowse
    }
  },
  {
    path: '/master/languages',
    component: lazy(() => import('../../../views/masters/language')),
    exact: true,
    name: 'master.import_language',
    meta: {
      title: 'import-language',
      ...Permissions.importLanguage
    }
  },
  {
    path: '/master/languages/labels/:id',
    component: lazy(() => import('../../../views/masters/language/label')),
    exact: true,
    name: 'master.language.labels',
    meta: {
      title: 'language-labels',
      ...Permissions.importLanguage
    }
  },
  {
    path: '/master/tasks',
    component: lazy(() => import('../../../views/masters/tasks')),
    exact: true,
    name: 'master.tasks',
    meta: {
      title: 'tasks',
      ...Permissions.taskBrowse
    }
  },

  // {
  //     path: '/master/subtasks/crate/:parent',
  //     component: lazy(() => import('../../../views/masters/tasks/fragment/TaskModal')),
  //     exact: true,
  //     name: "master.subtask.create",
  //     meta: {
  //         type: "subtask",
  //         title: "subtask-create",
  //         ...Permissions.taskBrowse
  //     }
  // },

  {
    path: '/master/paragraphs',
    component: lazy(() => import('../../../views/masters/paragraph')),
    exact: true,
    name: 'master.paragraphs',
    meta: {
      title: 'paragraphs',
      ...Permissions.paragraphsBrowse
    }
  },

  {
    path: '/master/roles-permissions',
    component: lazy(() => import('../../../views/masters/roles')),
    exact: true,
    name: 'master.roles',
    meta: {
      title: 'roles',
      ...Permissions.rolesBrowse
    }
  },
  {
    path: '/master/all-permissions',
    component: lazy(() => import('../../../views/masters/roles/DefinePermissions')),
    exact: true,
    name: 'master.all-permissions',
    meta: {
      title: 'roles',
      ...Permissions.rolesBrowse
    }
  },
  {
    path: '/master/modules',
    component: lazy(() => import('../../../views/masters/modules')),
    exact: true,
    name: 'master.modules',
    meta: {
      title: 'Modules',
      ...Permissions.modulesBrowse
    }
  },
  {
    path: '/master/packages',
    component: lazy(() => import('../../../views/masters/packages')),
    exact: true,
    name: 'master.packages',
    meta: {
      title: 'packages',
      ...Permissions.packagesBrowse
    }
  },
  {
    path: '/master/user-types',
    component: lazy(() => import('../../../views/masters/userTypes')),
    exact: true,
    name: 'master.userTypes',
    meta: {
      title: 'user-types',
      ...Permissions.userTypeBrowse
    }
  },
  {
    path: '/master/company-types',
    component: lazy(() => import('../../../views/masters/companyTypes/index')),
    exact: true,
    name: 'master.companyTypes',
    meta: {
      title: 'company-types',
      ...Permissions.companyTypeBrowse
    }
  },
  {
    path: '/settings/general',
    component: lazy(() => import('../../../views/settings')),
    exact: true,
    name: 'settings.general',
    meta: {
      title: 'settings',
      ...Permissions.settingsBrowse
    }
  },
  {
    path: '/settings/email-template',
    component: lazy(() => import('../../../views/settings/emailTemplate')),
    exact: true,
    name: 'settings.emailTemplate',
    meta: {
      type: 'browse',
      title: 'email-notifications',
      ...Permissions.emailTemplateBrowse
    }
  },
  {
    path: '/settings/sms-template',
    component: lazy(() => import('../../../views/settings/smsTemplate')),
    exact: true,
    name: 'settings.smsTemplate',
    meta: {
      type: 'browse',
      title: 'SMS Template',
      ...Permissions.emailTemplateBrowse
    }
  },
  {
    path: '/settings/licences',
    component: lazy(() => import('../../../views/settings/License')),
    exact: true,
    name: 'settings.licences',
    meta: {
      title: 'licences',
      ...Permissions.licencesBrowse
    }
  },
  // {
  //     path: '/settings/licenses/add-update',
  //     component: lazy(() => import('../../../views/settings/License/addUpdateLicense')),
  //     exact: true,
  //     name: "settings.licenses",
  //     meta: {
  //         title: "licenses",
  //         ...Permissions.licencesAdd
  //     }
  // },
  {
    path: '/feedback',
    component: lazy(() => import('../../../views/pages/feedback')),
    exact: true,
    name: 'feedback',
    meta: {
      title: 'feedback',
      ...Permissions.feedbacksBrowse
    }
  },
  {
    path: '/reports',
    component: lazy(() => import('../../../views/pages/reports')),
    exact: true,
    name: 'reports',
    meta: {
      title: 'reports',
      action: 'browse',
      resource: 'reports',
      ...Permissions.reportsBrowse
    }
  },
  {
    path: '/settings/manageFiles',
    component: lazy(() => import('../../../views/settings/uploadFiles')),
    exact: true,
    name: 'settings.manageFiles',
    meta: {
      title: 'manage-files-and-folders',
      action: 'browse',
      resource: 'files',
      ...Permissions.fileBrowse
    }
  },
  {
    path: '/settings/manageFiles/folder/:id',
    component: lazy(() => import('../../../views/settings/uploadFiles/fileList')),
    exact: true,
    name: 'settings.manageFiles.folder.details',
    meta: {
      ...Permissions.fileBrowse
    }
  },
  {
    path: '/settings/manageFiles/files',
    component: lazy(() => import('../../../views/settings/uploadFiles')),
    exact: true,
    name: 'settings.manageFiles.files',
    meta: {
      title: 'files',
      action: 'browse',
      ...Permissions.fileBrowse
    }
  },
  {
    path: '/settings/manageFiles/folders',
    component: lazy(() => import('../../../views/settings/uploadFiles')),
    exact: true,
    name: 'settings.manageFiles.folders',
    meta: {
      title: 'folders',
      action: 'browse',
      ...Permissions.fileBrowse
    }
  },
  {
    path: '/settings/myFavorites',
    component: lazy(() => import('../../../views/settings/uploadFiles')),
    exact: true,
    name: 'settings.myFavorites',
    meta: {
      title: 'my-favorites',
      action: 'browse',
      resource: 'files',
      ...Permissions.fileBrowse
    }
  },
  {
    path: '/settings/myFavorites/folder/:id',
    component: lazy(() => import('../../../views/settings/uploadFiles/fileList')),
    exact: true,
    name: 'settings.myFavorites.folder.details',
    meta: {
      ...Permissions.fileBrowse
    }
  },
  {
    path: '/settings/myFavorites/files',
    component: lazy(() => import('../../../views/settings/uploadFiles')),
    exact: true,
    name: 'settings.myFavorites.files',
    meta: {
      title: 'files',
      action: 'browse',
      ...Permissions.fileBrowse
    }
  },
  {
    path: '/settings/myFavorites/folders',
    component: lazy(() => import('../../../views/settings/uploadFiles')),
    exact: true,
    name: 'settings.myFavorites.folders',
    meta: {
      title: 'folders',
      action: 'browse',
      ...Permissions.fileBrowse
    }
  },
  {
    path: '/log/file',
    component: lazy(() => import('../../../views/log/FileLog')),
    exact: true,
    name: 'log.file',
    meta: {
      title: 'file-access-log',
      ...Permissions.fileLogBrowse
    }
  }
]

export default AdminRoutes
