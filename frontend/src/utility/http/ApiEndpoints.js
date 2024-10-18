export default {
  //////////////UserTypes endpoints ///////////
  loadUserTypes: 'user-type-list',
  addUserTypes: '',
  updateUserTypes: '',
  deleteUserTypes: '',
  employee_datewise_work: 'employee-datewise-work',
  //////////////License ////////
  loadLicenseCls: 'administration/activitycls',
  addLicenseCls: 'license',
  updateLicenseCls: 'license',
  deleteLicenseCls: 'license',
  ///////Notifications///
  LoadNotificationCls: 'administration/companies',
  addNotificationCls: '',
  updateNotificationCls: '',
  deleteNotificationCls: '',
  ///////requests///////
  LoadRequest: 'module-requests',
  addRequest: 'module-request',
  updateRequest: '',
  requestApprove: 'module-request-status/',
  deleteRequest: '',
  /////////language///////////
  lang_label_list: 'administration/labels',
  lang_label_add: 'administration/label',
  lang_label_edit: 'administration/label/',
  lang_label_view: 'administration/label/',
  lang_label_delete: ' administration/label/',
  //////////////smsTemplate
  add_sms_template: 'administration/sms-template',
  edit_sms_template: 'administration/sms-template/',
  view_sms_template: 'administration/sms-template/',
  delete_sms_template: 'administration/sms-template/',
  load_sms_template: 'administration/sms-templates',
  /////////////////////////////Admin_Start//////////////////////////
  /////Company
  addComp: 'administration/user',
  loadComp: 'administration/companies',
  editComp: 'administration/user/',
  viewComp: 'administration/user/',
  deleteComp: 'administration/user/',
  compStats: 'administration/company-stats/',
  load_comp_only: 'administration/company-setting-list',
  /////Package
  addPackage: 'administration/package',
  loadPackage: 'administration/packages',
  editPackage: 'administration/package/',
  deletePackage: 'administration/package/',
  viewPackages: 'administration/package/',
  loadPackage_user: 'get-company-assigned-packages',
  /////ActivityCls
  loadActivityCls: 'administration/activitycls',
  addActivityCls: 'administration/activity-cls',
  editActivityCls: 'administration/activity-cls/',
  deleteActivityCls: 'administration/activity-cls/',
  /////Module
  loadModule: 'administration/modules',
  addModule: 'administration/module',
  editModule: 'administration/module/',
  deleteModule: 'administration/module/',
  get_modules: 'get-modules',
  /////Permissions
  permissionsByType: 'user-type-permission',
  permissions: 'administration/permissions',
  add_permissions: 'administration/permission',
  edit_permissions: 'administration/permission/',
  view_permissions: 'administration/permission/',
  delete_permissions: 'administration/permission/',
  /////////////////////////////Admin_End//////////////////////////
  /////////////////////////////Common_Start//////////////////////////
  /////Common
  user_type_list: 'user-type-list',
  change_password: 'change-password',
  user_detail: 'user-detail',
  country_list: 'country-list',
  agency_list: 'agency-list',
  person_approval: 'request-for-approval',
  /////Login/LogOut/Password
  test: 'test',
  login: 'login',
  forgotPassword: 'forgot-password',
  changePassword: 'change-password',
  resetPassword: 'password-reset',
  patientPassword: 'patient-password-change',
  userEmailChange: 'user-email-update',
  /////Bank
  add_bank: 'bank',
  edit_bank: 'bank/',
  delete_bank: 'bank/',
  bank_list: 'banks',
  view_bank: 'bank/',
  /////Salary
  salary_detail: 'salary-detail',
  update_salary_detail: 'update-salary-detail',
  /////Roles
  role_list: 'roles',
  add_role: 'role',
  view_role: 'role/',
  delete_role: 'role/',
  edit_role: 'role/',
  /////////////////////////////Common_End//////////////////////////
  /////////////////////////////User_Start//////////////////////////
  /////Department
  add_department: 'department',
  edit_department: 'department/',
  delete_department: 'department/',
  department_list: 'departments',
  view_department: 'department/',

  /////User_Management
  all_branches_users: 'all-users',
  user_list: 'users',
  add_user: 'user',
  edit_user: 'user/',
  delete_user: 'user/',
  person: 'person/',
  view_user: 'user/',
  get_users: 'get-users',
  get_users_drop: 'users-dd',
  get_user_message: 'get-users-with-latest-message',
  importPatient: 'patient-import',
  getSampleFile: 'download-patient-import-sample-file',
  assign_working: 'employee-assigned-working-hour/',
  add_assign_work: 'employee-assigned-working-hour',
  assign_emp_to_branch: 'assign-employee-to-branches',
  assigned_emp_to_branch: 'assigned-employee-to-branches',
  assigned_branch_to_emp: 'assigned-branch-to-employees',
  switch_branch: 'switch-branch',

  /////CompanyType
  loadCompTypes: 'company-types',
  saveNewCompType: 'company-type',
  updateCompType: 'company-type/',
  deleteCompType: 'company-type/',
  /////Category_Type
  loadCatTypes: 'category-types',
  addCatType: 'category-type',
  deleteCatType: 'category-type/',
  editCatType: 'category-type/',
  /////Category
  loadCategories: 'categories',
  viewCategories: 'category/',
  loadCategoryParents: 'category-parent-list',
  saveCategory: 'category',
  editCategory: 'category/',
  categories_child: 'category-child-list',

  deleteCategoryById: 'category/',
  /////Activity
  activity_list: 'activities',
  add_activity: 'activity',
  edit_activity: 'activity/',
  delete_activity: 'activity/',
  view_activity: 'activity/',
  activity_assignments: 'activity_assignments',
  approve_activity: 'approved-activity',
  activity_action: 'activity-action',
  assign_activity: 'activity_assignments',
  tag_activity: 'activity-tag',
  activityNotApplicable: 'activity-not-applicable',
  assigned_employee_removed: 'activity-employee-remove',
  /////IP
  patient_plan_list: 'ips',
  add_patient_plan: 'ip',
  edit_patient_plan: 'ip/',
  view_patient_plan: 'ip/',
  approved_patient_plan: 'approved-patient-plan',
  delete_patient_plan: 'ip/',
  ip_assign_to_employee: 'ip-assign-to-employee',
  view_ip_assign: 'view-ip-assigne',
  ip_edit_history: 'ip-edit-history',
  ip_followups_print: 'ip-followups-print/',
  ip_print: 'ip-print/',
  ip_templates: 'ip-template-list',
  patient_person_list: 'patient-person-list',
  completeIp: 'ip-action',

  ////////Journal////////////
  createJournal: 'journal',
  listJournal: 'journals',
  editJournal: 'journal/',
  listJournalAction: 'journal-actions',
  createJournalAction: 'journal-action',
  editJournalAction: 'journal-action/',
  viewJournal: 'journal/',
  actionJournal: 'action-journal',
  viewJournalAction: 'journal-action/',
  // actionJournalAction : "action-journal-action",
  journalStats: 'statistics-journal',
  actionJournalAction: 'action-journal-action',
  timeReportJournal: 'get-twm-wise-journal-report',
  printJournal: 'print-journal',
  timeReportJournal: 'get-twm-wise-journal-report',
  activeJournal: 'is-active-journal',
  actionJournalSign: 'action-journal',

  /////FollowUps
  follow_up_list: 'followups',
  add_follow_up: 'follow-up',
  edit_follow_up: 'follow-up/',
  delete_follow_up: 'follow-up/',
  view_follow_up: 'follow-up/',
  approved_follow_up: 'approved-ip-follow-up',
  follow_up_complete: 'follow-up-complete',
  followup_edit_history: 'followup-edit-history',
  activity_edit_history: 'activiy-edit-history',
  completeFollowUp: 'follow-up-complete',
  /////CompanyWorkShift
  add_work_shift: 'work-shift',
  edit_work_shift: 'work-shift/',
  delete_work_shift: 'work-shift/',
  work_shift_list: 'workshifts',
  view_work_shift: 'work-shift/',
  employee_list: 'employee-list',
  shift_assign_to_employee: 'shift-assigne-to-employee',
  view_assign_shift: 'view-assigne-shift',

  /////////Branch///////
  add_branch: 'branch',
  edit_branch: 'branch/',
  load_branch: 'branches',
  delete_branch: 'branch/',
  view_branch: 'branch/',
  ////////patient types
  ///////redWord/////////
  add_redWord: 'word',
  edit_redWord: 'word/',
  load_redWord: 'words',
  delete_redWOrd: 'word/',
  ///////////redWord
  ///////paragraph/////////
  add_paragraph: 'paragraph',
  edit_paragraph: 'paragraph/',
  load_paragraph: 'paragraphs',
  delete_paragraph: 'paragraph/',
  ///////////paragraph
  patient_types: 'patient-types',
  ////////////questions//////////
  add_question: 'question',
  load_question: 'questions',
  edit_question: 'question/',
  delete_Question: '',
  /////////////////////////////User_End//////////////////////////

  ////////Question
  ////Tasks//
  add_task: 'task',
  load_task: 'tasks',
  edit_task: 'task/',
  delete_task: 'task/',
  view_task: 'task/',
  action_task: 'task-action',
  ///////////Country//////
  country_list: 'country-list',

  // questions ///
  questions: 'questions',

  /// Files upload ///
  uploadFiles: 'file-uploads',
  uploadFilesList: 'admin-files',
  deleteFiles: 'administration/admin-file/',
  uploadFilesListUser: 'company-files',
  deleteFilesUser: 'company-file-delete/',
  moveFilesUserToFolder: 'company-file-move',
  doneFileSign: 'file-sign-done',
  viewOnlyFile: 'view-file',

  /// Folder Upload ///
  createFolder: 'admin-files-folder',
  loadFolders: 'admin-files-folder/index',
  updateFolder: 'admin-files-folder/',
  deleteFolder: 'admin-files-folder/',

  //File Folder bookmark
  update_file_folder_bookmark: 'update-file-folder-bookmark/',
  show_file_folder_bookmark: 'show-file-folder-bookmark',
  //////Comments//////
  load_comment: 'comment-list',
  add_comment: 'comment',
  edit_comment: 'comment/',
  delete_comment: 'comment/',

  ////////////emergency contact
  add_emergency_contact: 'emergency-contact',
  load_emergency_contact: 'emergency-contacts',
  update_emergency_contact: 'emergency-contact/',
  delete_emergency_contact: 'emergency-contact/',

  ///////////////email template

  add_email_template: 'administration/email-template',
  edit_email_template: 'administration/email-template/',
  view_email_template: 'administration/email-template/',
  delete_email_template: 'administration/email-template/',
  load_email_template: 'administration/email-templates',

  load_comment: 'comment-list',
  add_comment: 'comment',
  edit_comment: 'comment/',
  delete_comment: 'comment/',

  ////// Update Setting
  update_setting: 'setting-update',
  company_setting: 'company-setting/',

  ///request approval

  approval_request_list: 'approval-request-list',
  request_for_approval: 'request-for-approval',
  /////calendar list /////
  // load_calendar : "calander-task"

  //dashboard
  dashboardDetails: 'dashboard',
  acceptTerms: 'file-access-log',

  permissionsAll: 'all-permissions',
  permissionsAllUpdate: 'add-user-type-has-permissions',

  // all logs
  fetchOnlyActivityLog: 'fetch-only-activity-log/',
  activityLog: 'administration/activities-log',
  bankIDLog: 'administration/mobile-bank-id-log',
  smsLog: 'administration/sms-log',
  getActivityLog: 'administration/activities-log-info/',
  fileLog: 'file-access-log',
  fileLogList: 'file-access-history',

  //trashed activity
  trashed_activity_list: 'trashed-activites',
  trashed_activity_delete: 'trashed-activites-permanent-delete/',
  restore_trashed: 'trashed-activites-restore/',

  //devitations
  devitation_list: 'deviations',
  view_devitation: 'deviation/',
  add_devitation: 'deviation',
  edit_devitation: 'deviation/',
  delete_devitation: 'deviation/',
  devitation_action: 'action-deviation',
  devitation_stats: 'statistics-deviation',
  print_devitation: 'print-deviation',
  timeReportdeviation: 'get-twm-wise-deviation',
  get_month_wise_deviation: 'get-month-wise-deviation',

  // Patient Cashiers
  load_patient_cashier: 'patient-cashiers',
  add_patient_cashier: 'patient-cashier',
  get_tmw_wise_activity_report: 'get-tmw-wise-activity-report',
  patient_cashiers_export: 'patient-cashiers-export',
  ///notifications
  create_notification: 'notification',
  notification_read: 'read',
  notification_list: 'notifications',
  notification_show: 'notification/',
  notification_delete: 'notification/',
  user_notification_delete: 'user-notification-delete',
  user_notification_read_all: 'user-notification-read-all',
  unread_count: 'unread-notification-count',
  get_ip_goal_subgoal_report: 'get-ip-goal-subgoal-report',

  // Bookmarks
  bookmarks: 'bookmarks',
  bookmark: 'bookmark',
  bookmarkAdd: 'administration/bookmark-master',

  //License key
  addLicense: 'administration/licence-key',
  loadLicense: 'administration/licence-keys',
  viewLicense: 'administration/licence-key/',
  addCompLicense: 'company-subscription-extend',
  updateLicense: 'administration/licence-key/',
  assignLicense: 'administration/assign-licence-key/',
  statusLicense: '/get-licence-status',
  expireLicense: 'administration/cancel-licence-key/',

  ///update profile
  update_profile: 'update-profile',
  ////get  language
  get_language: 'administration/language',
  import_language: 'administration/labels-import',
  add_language: 'administration/language',
  edit_language: 'administration/language/',
  view_language: 'administration/language/',
  delete_language: 'administration/language/',
  language_sample_export: 'administration/labels-export',
  getAllLanguage: 'get-languages',
  language_sample_export: 'administration/labels-export',

  // messages
  get_messages: 'get-messages',

  //////////Schedule Master
  schedule_list: 'schedules',
  schedule_list_2: 'schedules-copy',
  schedule_add: 'schedule',
  schedule_edit: 'schedule/',
  schedule_view: 'schedule/',
  schedule_delete: 'schedule/',
  schedule_reports: 'schedule-reports',
  schedule_filter: 'schedule-filter',
  schedule_stats: 'schedule-stats',
  schedule_export_emp_based: 'employee-working-hours-export',
  schedule_export_patient_based: 'employee-working-hours-export',

  //ovhours
  ovhour_list: 'ovhours',
  ovhour_add: 'ovhour',
  ovhour_edit: 'ovhour/',
  ovhour_view: 'ovhour/',
  ovhour_delete: 'ovhour/',
  ov_import: 'obe-hours-import',

  //leave
  add_leave: 'leave',
  leave_load: 'leaves',
  edit_leave: 'leave/',
  delete_leave: 'leave/',
  view_leave: 'leave/',
  all_leaves: 'user-leaves/',
  approve_leave: 'leaves-approve',
  without_stamp: 'leaves-approve-by-group-id/',
  leave_schedule: 'leave-schedule-slot-selected',
  company_leave: 'company-leave',
  leave_schedule: 'leave-schedule-slot-selected',
  leave_schedule_filter: 'schedule-filter',
  company_leaves: 'company-leaves',
  get_company_leave: 'get-company-leaves',
  leave_schedule_slot_selected: 'leave-schedule-slot-selected',

  //stampling
  stampling_list: 'stamplings',
  stampling_view: 'stampling/',
  stampling_add: 'stampling',
  stampling_edit: 'stampling/',
  stampling_delete: 'stampling/',
  stampling_get: 'stamp-in-data',
  stampling_report: 'stampling-reports',
  stamp_report: 'stampling-datewise-reports',
  stamp_report_day_export: 'stampling-datewise-reports',
  stamp_report_export: 'stampling-reports',

  //schedule template
  schedule_template_list: 'schedule-templates',
  schedule_template_add: 'schedule-template',
  schedule_template_update: 'schedule-template/',
  schedule_template_delete: 'schedule-template/',
  schedule_template_view: 'schedule-template/',
  schedule_template_clone: 'schedule-clones',
  schedule_change_status: 'schedule-template-change-status/',

  ////approval-hours list
  patient_completed_hours: 'patient-completed-hours',

  //employee hours approval
  employee_dateWise_work: 'employee-datewise-work',
  schedule_approve: 'schedule-approve',
  schedule_verify: 'schedule-verify',
  get_schedules_data: 'get-schedules-data',
  get_schedules_data_patient: 'get-patients-data',
  employee_hours_export: 'employee-working-hours-export',

  package_details: 'get-company-active-package',
  bankidmessage: 'administration/company-bank-id-msg-usage/',

  //storage info
  getStorageUsage: 'get-storage-usage'
}
