/* Action = Permission, Resource = Group-Group */

export const Permissions = Object.freeze({
  // Profile
  profileBrowse: {
    action: 'profile-browse',
    resource: 'profile',
    belongs_to: 3
  },
  profileEdit: {
    action: 'profile-edit',
    resource: 'profile',
    belongs_to: 3
  },
  // End Profile

  // Dashboard
  dashboardBrowse: {
    action: 'dashboard-browse',
    resource: 'dashboard',
    belongs_to: 3
  },
  // End Dashboard

  // requests
  requestsBrowse: {
    action: 'requests-browse',
    resource: 'requests',
    belongs_to: 3
  },
  requestsRead: {
    action: 'requests-read',
    resource: 'requests',
    belongs_to: 3
  },
  requestsEdit: {
    action: 'requests-edit',
    resource: 'requests',
    belongs_to: 3
  },
  requestsAdd: {
    action: 'requests-add',
    resource: 'requests',
    belongs_to: 3
  },
  requestsDelete: {
    action: 'requests-delete',
    resource: 'requests',
    belongs_to: 3
  },
  // end requests

  // notifications
  notificationsBrowse: {
    action: 'notifications-browse',
    resource: 'notifications',
    belongs_to: 3
  },
  notificationsRead: {
    action: 'notifications-read',
    resource: 'notifications',
    belongs_to: 3
  },
  notificationsEdit: {
    action: 'notifications-edit',
    resource: 'notifications',
    belongs_to: 3
  },
  notificationsAdd: {
    action: 'notifications-add',
    resource: 'notifications',
    belongs_to: 3
  },
  notificationsDelete: {
    action: 'notifications-delete',
    resource: 'notifications',
    belongs_to: 3
  },
  // end notifications

  // Users - Admin
  usersBrowse: {
    action: 'users-browse',
    resource: 'users',
    belongs_to: 3
  },
  usersRead: {
    action: 'users-read',
    resource: 'users',
    belongs_to: 3
  },
  usersEdit: {
    action: 'users-edit',
    resource: 'users',
    belongs_to: 3
  },
  usersAdd: {
    action: 'users-add',
    resource: 'users',
    belongs_to: 3
  },
  usersDelete: {
    action: 'users-delete',
    resource: 'users',
    belongs_to: 3
  },
  // End Users

  // Activity Classifications
  activitiesClsBrowse: {
    action: 'activitiesCls-browse',
    resource: 'activitiesCls'
  },
  activitiesClsRead: {
    action: 'activitiesCls-read',
    resource: 'activitiesCls'
  },
  activitiesClsEdit: {
    action: 'activitiesCls-edit',
    resource: 'activitiesCls'
  },
  activitiesClsAdd: {
    action: 'activitiesCls-add',
    resource: 'activitiesCls'
  },
  activitiesClsDelete: {
    action: 'activitiesCls-delete',
    resource: 'activitiesCls'
  },
  // End Activity Classifications

  // Companies
  companiesBrowse: {
    action: 'companies-browse',
    resource: 'companies',
    belongs_to: 3
  },
  companiesRead: {
    action: 'companies-read',
    resource: 'companies',
    belongs_to: 3
  },
  companiesEdit: {
    action: 'companies-edit',
    resource: 'companies',
    belongs_to: 3
  },
  companiesAdd: {
    action: 'companies-add',
    resource: 'companies',
    belongs_to: 3
  },
  companiesDelete: {
    action: 'companies-delete',
    resource: 'companies',
    belongs_to: 3
  },
  // End companies

  // categories
  categoriesBrowse: {
    action: 'categories-browse',
    resource: 'categories',
    belongs_to: 3
  },
  categoriesRead: {
    action: 'categories-read',
    resource: 'categories',
    belongs_to: 3
  },
  categoriesEdit: {
    action: 'categories-edit',
    resource: 'categories',
    belongs_to: 3
  },
  categoriesAdd: {
    action: 'categories-add',
    resource: 'categories',
    belongs_to: 3
  },
  categoriesDelete: {
    action: 'categories-delete',
    resource: 'categories',
    belongs_to: 3
  },
  // end categories

  // task
  taskBrowse: {
    action: 'task-browse',
    resource: 'task',
    belongs_to: 2
  },
  taskRead: {
    action: 'task-read',
    resource: 'task',
    belongs_to: 2
  },
  taskEdit: {
    action: 'task-edit',
    resource: 'task',
    belongs_to: 2
  },
  taskAdd: {
    action: 'task-add',
    resource: 'task',
    belongs_to: 2
  },
  taskDelete: {
    action: 'task-delete',
    resource: 'task',
    belongs_to: 2
  },
  // task end

  // categoryTypes
  categoryTypesBrowse: {
    action: 'categoryTypes-browse',
    resource: 'categoryTypes',
    belongs_to: 1
  },
  categoryTypesRead: {
    action: 'categoryTypes-read',
    resource: 'categoryTypes',
    belongs_to: 1
  },
  categoryTypesEdit: {
    action: 'categoryTypes-edit',
    resource: 'categoryTypes',
    belongs_to: 1
  },
  categoryTypesAdd: {
    action: 'categoryTypes-add',
    resource: 'categoryTypes',
    belongs_to: 1
  },
  categoryTypesDelete: {
    action: 'categoryTypes-delete',
    resource: 'categoryTypes',
    belongs_to: 1
  },
  // end categoryTypes

  // roles
  rolesBrowse: {
    action: 'role-browse',
    resource: 'role',
    belongs_to: 3
  },
  rolesRead: {
    action: 'role-read',
    resource: 'role',
    belongs_to: 3
  },
  rolesEdit: {
    action: 'role-edit',
    resource: 'role',
    belongs_to: 3
  },
  rolesAdd: {
    action: 'role-add',
    resource: 'role',
    belongs_to: 3
  },
  rolesDelete: {
    action: 'role-delete',
    resource: 'role',
    belongs_to: 3
  },
  // end roles

  // licenses
  licensesBrowse: {
    action: 'licenses-browse',
    resource: 'licenses',
    belongs_to: 1
  },
  licensesRead: {
    action: 'licenses-read',
    resource: 'licenses',
    belongs_to: 1
  },
  licensesEdit: {
    action: 'licenses-edit',
    resource: 'licenses',
    belongs_to: 1
  },
  licensesAdd: {
    action: 'licenses-add',
    resource: 'licenses',
    belongs_to: 1
  },
  licensesDelete: {
    action: 'licenses-delete',
    resource: 'licenses',
    belongs_to: 1
  },
  licensesAssign: {
    action: 'licenses-assign',
    resource: 'licenses',
    belongs_to: 1
  },
  // end licenses

  // modules
  modulesBrowse: {
    action: 'modules-browse',
    resource: 'modules',
    belongs_to: 1
  },
  modulesRead: {
    action: 'modules-read',
    resource: 'modules',
    belongs_to: 1
  },
  modulesEdit: {
    action: 'modules-edit',
    resource: 'modules',
    belongs_to: 1
  },
  modulesAdd: {
    action: 'modules-add',
    resource: 'modules',
    belongs_to: 1
  },
  modulesDelete: {
    action: 'modules-delete',
    resource: 'modules',
    belongs_to: 1
  },
  // end modules

  // packages
  packagesBrowse: {
    action: 'packages-browse',
    resource: 'packages',
    belongs_to: 1
  },
  packagesRead: {
    action: 'packages-read',
    resource: 'packages',
    belongs_to: 1
  },
  packagesEdit: {
    action: 'packages-edit',
    resource: 'packages',
    belongs_to: 1
  },
  packagesAdd: {
    action: 'packages-add',
    resource: 'packages',
    belongs_to: 1
  },
  packagesDelete: {
    action: 'packages-delete',
    resource: 'packages',
    belongs_to: 1
  },
  packagesBrowseCompany: {
    action: 'packages-view-company',
    resource: 'packages',
    belongs_to: 2
  },
  // end packages

  // userType
  userTypeBrowse: {
    action: 'userType-browse',
    resource: 'userType',
    belongs_to: 1
  },
  userTypeRead: {
    action: 'userType-read',
    resource: 'userType',
    belongs_to: 1
  },
  userTypeEdit: {
    action: 'userType-edit',
    resource: 'userType',
    belongs_to: 1
  },
  userTypeAdd: {
    action: 'userType-add',
    resource: 'userType',
    belongs_to: 1
  },
  userTypeDelete: {
    action: 'userType-delete',
    resource: 'userType',
    belongs_to: 1
  },
  // end userType

  // companyType
  companyTypeBrowse: {
    action: 'companyType-browse',
    resource: 'companyType',
    belongs_to: 1
  },
  companyTypeRead: {
    action: 'companyType-read',
    resource: 'companyType',
    belongs_to: 1
  },
  companyTypeEdit: {
    action: 'companyType-edit',
    resource: 'companyType',
    belongs_to: 1
  },
  companyTypeAdd: {
    action: 'companyType-add',
    resource: 'companyType',
    belongs_to: 1
  },
  companyTypeDelete: {
    action: 'companyType-delete',
    resource: 'companyType',
    belongs_to: 1
  },
  // end companyType

  // settings
  settingsBrowse: {
    action: 'settings-browse',
    resource: 'settings',
    belongs_to: 1
  },
  settingsRead: {
    action: 'settings-read',
    resource: 'settings',
    belongs_to: 1
  },
  settingsEdit: {
    action: 'settings-edit',
    resource: 'settings',
    belongs_to: 1
  },
  settingsAdd: {
    action: 'settings-add',
    resource: 'settings',
    belongs_to: 1
  },
  settingsDelete: {
    action: 'settings-delete',
    resource: 'settings',
    belongs_to: 1
  },
  // end settings

  // employees
  employeesBrowse: {
    action: 'employees-browse',
    resource: 'employees',
    belongs_to: 3
  },
  employeesRead: {
    action: 'employees-read',
    resource: 'employees',
    belongs_to: 3
  },
  employeesEdit: {
    action: 'employees-edit',
    resource: 'employees',
    belongs_to: 3
  },
  employeesAdd: {
    action: 'employees-add',
    resource: 'employees',
    belongs_to: 3
  },
  employeesDelete: {
    action: 'employees-delete',
    resource: 'employees',
    belongs_to: 3
  },
  // end employees

  // patients
  patientsBrowse: {
    action: 'patients-browse',
    resource: 'patients',
    belongs_to: 2
  },
  patientsRead: {
    action: 'patients-read',
    resource: 'patients',
    belongs_to: 2
  },
  patientsEdit: {
    action: 'patients-edit',
    resource: 'patients',
    belongs_to: 2
  },
  patientsAdd: {
    action: 'patients-add',
    resource: 'patients',
    belongs_to: 2
  },
  patientsDelete: {
    action: 'patients-delete',
    resource: 'patients',
    belongs_to: 2
  },
  // end patients

  // departments
  departmentsBrowse: {
    action: 'departments-browse',
    resource: 'departments',
    belongs_to: 2
  },
  departmentsRead: {
    action: 'departments-read',
    resource: 'departments',
    belongs_to: 2
  },
  departmentsEdit: {
    action: 'departments-edit',
    resource: 'departments',
    belongs_to: 2
  },
  departmentsAdd: {
    action: 'departments-add',
    resource: 'departments',
    belongs_to: 2
  },
  departmentsDelete: {
    action: 'departments-delete',
    resource: 'departments',
    belongs_to: 2
  },
  // end departments

  // activitySelf
  activitySelfBrowse: {
    action: 'activity-browse',
    resource: 'activity',
    belongs_to: 2
  },
  activitySelfRead: {
    action: 'activity-read',
    resource: 'activity',
    belongs_to: 2
  },
  activitySelfEdit: {
    action: 'activity-edit',
    resource: 'activity',
    belongs_to: 2
  },
  activitySelfAdd: {
    action: 'activity-add',
    resource: 'activity',
    belongs_to: 2
  },
  activitySelfDelete: {
    action: 'activity-delete',
    resource: 'activity',
    belongs_to: 2
  },
  activitySelfStats: {
    action: 'activity-stats',
    resource: 'activity',
    belongs_to: 2
  },
  // end activitySelf

  // journalSelf
  journalSelfBrowse: {
    action: 'journal-browse',
    resource: 'journal'
  },
  journalSelfRead: {
    action: 'journal-read',
    resource: 'journal'
  },
  journalSelfEdit: {
    action: 'journal-edit',
    resource: 'journal'
  },
  journalSelfAdd: {
    action: 'journal-add',
    resource: 'journal'
  },
  journalSelfDelete: {
    action: 'journal-delete',
    resource: 'journal'
  },
  journalSelfAction: {
    action: 'journal-action',
    resource: 'journal'
  },
  journalSelfResult: {
    action: 'result',
    resource: 'journal'
  },
  journalSelfPrint: {
    action: 'journal-print',
    resource: 'print'
  },
  journalStatsView: {
    action: 'journal-stats-view',
    resource: 'journal'
  },

  // end journalSelf

  // deviationSelf
  deviationSelfBrowse: {
    action: 'deviation-browse',
    resource: 'deviation'
  },
  deviationSelfRead: {
    action: 'deviation-read',
    resource: 'deviation'
  },
  deviationSelfEdit: {
    action: 'deviation-edit',
    resource: 'deviation'
  },
  deviationSelfAdd: {
    action: 'deviation-add',
    resource: 'deviation'
  },
  deviationSelfDelete: {
    action: 'deviation-delete',
    resource: 'deviation'
  },
  deviationStatsView: {
    action: 'deviation-stats-view',
    resource: 'deviation'
  },
  // end deviationSelf

  // scheduleSelf
  scheduleSelfBrowse: {
    action: 'schedule-browse',
    resource: 'schedule'
  },
  scheduleSelfRead: {
    action: 'schedule-read',
    resource: 'schedule'
  },
  scheduleSelfEdit: {
    action: 'schedule-edit',
    resource: 'schedule'
  },
  scheduleSelfAdd: {
    action: 'schedule-add',
    resource: 'schedule'
  },
  scheduleSelfDelete: {
    action: 'schedule-delete',
    resource: 'schedule'
  },
  // end scheduleSelf

  // // patientFamily
  // patientFamilyBrowse: {
  //     action: "patientFamily-browse",
  //     resource: "patientFamily"
  // },
  // patientFamilyRead: {
  //     action: "patientFamily-read",
  //     resource: "patientFamily"
  // },
  // patientFamilyEdit: {
  //     action: "patientFamily-edit",
  //     resource: "patientFamily"
  // },
  // patientFamilyAdd: {
  //     action: "patientFamily-add",
  //     resource: "patientFamily"
  // },
  // patientFamilyDelete: {
  //     action: "patientFamily-delete",
  //     resource: "patientFamily"
  // },
  // // end patientFamily

  // // patientContactPerson
  // patientContactPersonBrowse: {
  //     action: "patientContactPerson-browse",
  //     resource: "patientContactPerson"
  // },
  // patientContactPersonRead: {
  //     action: "patientContactPerson-read",
  //     resource: "patientContactPerson"
  // },
  // patientContactPersonEdit: {
  //     action: "patientContactPerson-edit",
  //     resource: "patientContactPerson"
  // },
  // patientContactPersonAdd: {
  //     action: "patientContactPerson-add",
  //     resource: "patientContactPerson"
  // },
  // patientContactPersonDelete: {
  //     action: "patientContactPerson-delete",
  //     resource: "patientContactPerson"
  // },
  // // end patientContactPerson

  // branch
  branchBrowse: {
    action: 'branch-browse',
    resource: 'branch'
  },
  branchRead: {
    action: 'branch-read',
    resource: 'branch'
  },
  branchEdit: {
    action: 'branch-edit',
    resource: 'branch'
  },
  branchAdd: {
    action: 'branch-add',
    resource: 'branch'
  },
  branchDelete: {
    action: 'branch-delete',
    resource: 'branch'
  },
  // end branch

  // ipSelf
  ipSelfBrowse: {
    action: 'ip-browse',
    resource: 'ip'
  },
  ipSelfRead: {
    action: 'ip-read',
    resource: 'ip'
  },
  ipSelfEdit: {
    action: 'ip-edit',
    resource: 'ip'
  },
  ipSelfAdd: {
    action: 'ip-add',
    resource: 'ip'
  },
  ipSelfDelete: {
    action: 'ip-delete',
    resource: 'ip'
  },
  // end ipSelf

  // ipFollowUpsSelf
  ipFollowUpsSelfBrowse: {
    action: 'followup-browse',
    resource: 'followup'
  },
  ipFollowUpsSelfRead: {
    action: 'followup-read',
    resource: 'followup'
  },
  ipFollowUpsSelfEdit: {
    action: 'followup-edit',
    resource: 'followup'
  },
  ipFollowUpsSelfAdd: {
    action: 'followup-add',
    resource: 'followup'
  },
  ipFollowUpsSelfDelete: {
    action: 'followup-delete',
    resource: 'followup'
  },
  // end ipFollowUpsSelf

  // feedbacks
  feedbacksBrowse: {
    action: 'feedbacks-browse',
    resource: 'feedbacks'
  },
  feedbacksRead: {
    action: 'feedbacks-read',
    resource: 'feedbacks'
  },
  feedbacksEdit: {
    action: 'feedbacks-edit',
    resource: 'feedbacks'
  },
  feedbacksAdd: {
    action: 'feedbacks-add',
    resource: 'feedbacks'
  },
  feedbacksDelete: {
    action: 'feedbacks-delete',
    resource: 'feedbacks'
  },
  // end feedbacks

  // reports
  reportsBrowse: {
    action: 'reports-browse',
    resource: 'reports'
  },
  reportsRead: {
    action: 'reports-read',
    resource: 'reports'
  },
  reportsEdit: {
    action: 'reports-edit',
    resource: 'reports'
  },
  reportsAdd: {
    action: 'reports-add',
    resource: 'reports'
  },
  reportsDelete: {
    action: 'reports-delete',
    resource: 'reports'
  },
  // end reports

  // workShift
  workShiftBrowse: {
    action: 'workShift-browse',
    resource: 'workShift'
  },
  workShiftRead: {
    action: 'workShift-read',
    resource: 'workShift'
  },
  workShiftEdit: {
    action: 'workShift-edit',
    resource: 'workShift'
  },
  workShiftAdd: {
    action: 'workShift-add',
    resource: 'workShift'
  },
  workShiftDelete: {
    action: 'workShift-delete',
    resource: 'workShift'
  },
  // end workShift

  // start EmailTemplate
  emailTemplateBrowse: {
    action: 'EmailTemplate-browse',
    resource: 'EmailTemplate'
  },
  emailTemplateRead: {
    action: 'EmailTemplate-read',
    resource: 'EmailTemplate'
  },
  emailTemplateAdd: {
    action: 'EmailTemplate-add',
    resource: 'EmailTemplate'
  },
  emailTemplateEdit: {
    action: 'EmailTemplate-edit',
    resource: 'EmailTemplate'
  },
  emailTemplateDelete: {
    action: 'EmailTemplate-delete',
    resource: 'EmailTemplate'
  },
  // end EmailTemplate

  // Bank Detail
  bankBrowse: {
    action: 'bank-browse',
    resource: 'bank'
  },
  bankRead: {
    action: 'bank-read',
    resource: 'bank'
  },
  bankAdd: {
    action: 'bank-add',
    resource: 'bank'
  },
  bankEdit: {
    action: 'bank-edit',
    resource: 'bank'
  },
  bankDelete: {
    action: 'bank-delete',
    resource: 'bank'
  },
  // end Bank Detail

  // Paragraph Detail
  paragraphsBrowse: {
    action: 'paragraphs-browse',
    resource: 'paragraphs'
  },
  paragraphsRead: {
    action: 'paragraphs-read',
    resource: 'paragraphs'
  },
  paragraphsAdd: {
    action: 'paragraphs-add',
    resource: 'paragraphs'
  },
  paragraphsEdit: {
    action: 'paragraphs-edit',
    resource: 'paragraphs'
  },
  paragraphsDelete: {
    action: 'paragraphs-delete',
    resource: 'paragraphs'
  },
  // end Paragraph Detail

  // Words Detail
  wordsBrowse: {
    action: 'words-browse',
    resource: 'words'
  },
  wordsRead: {
    action: 'words-read',
    resource: 'words'
  },
  wordsAdd: {
    action: 'words-add',
    resource: 'words'
  },
  wordsEdit: {
    action: 'words-edit',
    resource: 'words'
  },
  wordsDelete: {
    action: 'words-delete',
    resource: 'words'
  },
  // end Words Detail

  // Questions Detail
  questionsBrowse: {
    action: 'questions-browse',
    resource: 'questions'
  },
  questionsRead: {
    action: 'questions-read',
    resource: 'questions'
  },
  questionsAdd: {
    action: 'questions-add',
    resource: 'questions'
  },
  questionsEdit: {
    action: 'questions-edit',
    resource: 'questions'
  },
  questionsDelete: {
    action: 'questions-delete',
    resource: 'questions'
  },
  // end Questions Detail

  // Licences Detail
  licencesBrowse: {
    action: 'licences-browse',
    resource: 'licences'
  },
  licencesRead: {
    action: 'licences-read',
    resource: 'licences'
  },
  licencesAdd: {
    action: 'licences-add',
    resource: 'licences'
  },
  licencesEdit: {
    action: 'licences-edit',
    resource: 'licences'
  },
  licencesDelete: {
    action: 'licences-delete',
    resource: 'licences'
  },
  licencesAssign: {
    action: 'licences-assign',
    resource: 'licences'
  },
  licencesExpire: {
    action: 'licences-expire',
    resource: 'licences'
  },
  // end Licences Detail

  // AdminEmployee Detail
  adminEmployeeBrowse: {
    action: 'adminEmployee-browse',
    resource: 'adminEmployee'
  },
  adminEmployeeRead: {
    action: 'adminEmployee-read',
    resource: 'adminEmployee'
  },
  adminEmployeeAdd: {
    action: 'adminEmployee-add',
    resource: 'adminEmployee'
  },
  adminEmployeeEdit: {
    action: 'adminEmployee-edit',
    resource: 'adminEmployee'
  },
  adminEmployeeDelete: {
    action: 'adminEmployee-delete',
    resource: 'adminEmployee'
  },
  // end AdminEmployee Detail

  // Calendar Start
  calendarBrowse: {
    action: 'calendar-browse',
    resource: 'calendar'
  },
  // end Calendar

  // Is CategoryEditPermission
  isCategoryEditPermission: {
    action: 'isCategoryEditPermission-edit',
    resource: 'isCategoryEditPermission'
  },
  // end categoryEditPermission

  // start command
  commandRead: {
    action: 'command-read',
    resource: 'command'
  },
  // end command

  // Persons Detail
  personsBrowse: {
    action: 'persons-browse',
    resource: 'persons'
  },
  personsRead: {
    action: 'persons-read',
    resource: 'persons'
  },
  personsAdd: {
    action: 'persons-add',
    resource: 'persons'
  },
  personsEdit: {
    action: 'persons-edit',
    resource: 'persons'
  },
  personsDelete: {
    action: 'persons-delete',
    resource: 'persons'
  },
  // end Persons Detail

  // Patient Import
  patientImport: {
    action: 'patient-browse',
    resource: 'patient-import'
  },
  //end patient import

  // File Upload
  fileBrowse: {
    action: 'files-browse',
    resource: 'files'
  },
  fileAdd: {
    action: 'files-add',
    resource: 'files'
  },
  fileRead: {
    action: 'files-read',
    resource: 'files'
  },
  fileDelete: {
    action: 'files-delete',
    resource: 'files'
  },
  fileUploadCompany: {
    action: 'files-upload-for-usertype',
    resource: 'files'
  },

  // Internal Comment
  readInternalComment: {
    action: 'internalCom-read',
    resource: 'command'
  },
  //log
  smsLogBrowse: {
    action: 'smsLog-browse',
    resource: 'Log'
  },
  bankIdLogBrowse: {
    action: 'bankIdLog-browse',
    resource: 'Log'
  },
  activityLogBrowse: {
    action: 'activityLog-browse',
    resource: 'Log'
  },
  activityLogRead: {
    action: 'activityLog-read',
    resource: 'Log'
  },
  fileLogBrowse: {
    action: 'fileLog-browse',
    resource: 'Log'
  },

  //trashed activity
  trashedActivityBrowse: {
    action: 'trashed-activites',
    resource: 'activity'
  },
  trashedActivityDelete: {
    action: 'trashed-activites-permanent-delete',
    resource: 'activity'
  },
  trashedActivityRestore: {
    action: 'trashed-activites-restore',
    resource: 'activity'
  },

  // Patient Cashiers
  patientCashiersBrowse: {
    action: 'patient_cashiers',
    resource: 'patient_cashiers'
  },
  patientCashiersAdd: {
    action: 'patient_cashier-add',
    resource: 'patient_cashiers'
  },

  //Investigation
  investigationBrowse: {
    action: 'investigation',
    resource: 'investigation'
  },

  // Print Journal and Deviation
  deviationPrint: {
    action: 'deviation-print',
    resource: 'print'
  },
  journalPrint: {
    action: 'journal-print',
    resource: 'print'
  },

  //ststs
  journalStats: {
    action: 'journal-stats-view',
    resource: 'journal'
  },
  deviationStats: {
    action: 'deviation-stats-view',
    resource: 'deviation'
  },

  // language import
  importLanguage: {
    action: 'import-language',
    resource: 'language'
  },

  //leave
  leaveSelfBrowse: {
    action: 'leave-browse',
    resource: 'leave'
  },
  leaveSelfAdd: {
    action: 'leave-add',
    resource: 'leave'
  },
  leaveSelfEdit: {
    action: 'leave-edit',
    resource: 'leave'
  },
  leaveSelfDelete: {
    action: 'leave-delete',
    resource: 'leave'
  },
  leaveSelfBrowse: {
    action: 'leave-browse',
    resource: 'leave'
  },
  leaveSelfRead: {
    action: 'leave-read',
    resource: 'leave'
  },

  //Stampling
  stamplingBrowse: {
    action: 'stampling-browse',
    resource: 'stampling'
  },
  stamplingAdd: {
    action: 'stampling-add',
    resource: 'stampling'
  },
  stamplingEdit: {
    action: 'stampling-edit',
    resource: 'stampling'
  },
  stamplingDelete: {
    action: 'stampling-delete',
    resource: 'stampling'
  },
  stamplingRead: {
    action: 'stampling-read',
    resource: 'stampling'
  },
  ///schedule-template
  scheduleTemplateBrowse: {
    action: 'schedule-template-browse',
    resource: 'schedule-template'
  },
  scheduleTemplateAdd: {
    action: 'schedule-template-add',
    resource: 'schedule-template'
  },
  scheduleTemplateEdit: {
    action: 'schedule-template-edit',
    resource: 'schedule-template'
  },
  scheduleTemplateDelete: {
    action: 'schedule-template-delete',
    resource: 'schedule-template'
  },
  scheduleTemplateRead: {
    action: 'schedule-template-read',
    resource: 'schedule-template'
  },
  ///////hours Approval

  hoursApprovalBrowse: {
    action: 'hours-approval-browse',
    resource: 'hours-approval'
  },
  hoursApprovalAdd: {
    action: 'hours-approval-add',
    resource: 'hours-approval'
  },
  hoursApprovalEdit: {
    action: 'hours-approval-edit',
    resource: 'hours-approval'
  },
  hoursApprovalDelete: {
    action: 'hours-approval-delete',
    resource: 'hours-approval'
  },
  hoursApprovalRead: {
    action: 'hours-approval-read',
    resource: 'hours-approval'
  }
})
