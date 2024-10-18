import { lazy } from 'react'
import { UserTypes } from '../../../utility/Const'
import { Permissions } from '../../../utility/Permissions'

const CompanyRoutes = [
  {
    path: '/company',
    name: 'company',
    component: lazy(() => import('../../../views/dashboard/home')),
    meta: {
      title: 'company',
      ...Permissions.dashboardBrowse
    }
  },
  {
    path: '/persons/implementations',
    name: 'persons.implementations',
    component: lazy(() => import('../../../views/personsIpAssign')),
    meta: {
      title: 'persons-implementation',
      ...Permissions.requestsBrowse
    }
  },
  //User Management
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
    path: '/users/employees/create',
    component: lazy(() => import('../../../views/userManagement/UserForm')),
    exact: true,
    name: 'users.employees.create',
    meta: {
      title: 'users',
      userType: UserTypes.employee,
      ...Permissions.employeesAdd
    }
  },
  {
    path: '/users/employees/update/:id',
    component: lazy(() => import('../../../views/userManagement/UserForm')),
    exact: true,
    name: 'users.employees.update',
    meta: {
      title: 'users',
      ...Permissions.employeesEdit
    }
  },
  {
    path: '/users/employees/:id',
    component: lazy(() => import('../../../views/userManagement/UserDetails')),
    exact: true,
    name: 'users.employees.detail',
    meta: {
      title: 'users',
      ...Permissions.employeesRead
    }
  },
  {
    path: '/users/stats',
    component: lazy(() => import('../../../views/stats')),
    exact: true,
    name: 'users.stats',
    meta: {
      title: 'stats',

      ...Permissions.patientsBrowse
    }
  },
  {
    path: '/users/patients',
    component: lazy(() => import('../../../views/userManagement/patient')),
    exact: true,
    name: 'users.patients',
    meta: {
      title: 'patients',

      ...Permissions.patientsBrowse
    }
  },
  {
    path: '/users/patients/create',
    component: lazy(() => import('../../../views/userManagement/UserForm')),
    exact: true,
    name: 'users.patients.create',
    meta: {
      title: 'users',
      userType: UserTypes.patient,
      ...Permissions.patientsAdd
    }
  },
  {
    path: '/users/patients/update/:id',
    component: lazy(() => import('../../../views/userManagement/UserForm')),
    exact: true,
    name: 'users.patients.update',
    meta: {
      title: 'users',
      ...Permissions.patientsEdit
    }
  },
  {
    path: '/users/patients/:id',
    component: lazy(() => import('../../../views/userManagement/UserDetails')),
    exact: true,
    name: 'users.patients.detail',
    meta: {
      title: 'users',
      ...Permissions.patientsRead
    }
  },
  {
    path: '/users/nurses',
    component: lazy(() => import('../../../views/userManagement/nurse')),
    exact: true,
    name: 'users.nurses',
    meta: {
      title: 'nurses',
      ...Permissions.nursesBrowse
    }
  },
  {
    path: '/users/nurses/create',
    component: lazy(() => import('../../../views/userManagement/UserForm')),
    exact: true,
    name: 'users.nurses.create',
    meta: {
      title: 'users',
      ...Permissions.nursesAdd
    }
  },
  {
    path: '/users/nurses/update/:id',
    component: lazy(() => import('../../../views/userManagement/UserForm')),
    exact: true,
    name: 'users.nurses.update',
    meta: {
      title: 'users',
      ...Permissions.nursesEdit
    }
  },
  {
    path: '/users/nurses/:id',
    component: lazy(() => import('../../../views/userManagement/UserDetails')),
    exact: true,
    name: 'users.nurses.detail',
    meta: {
      title: 'users',
      ...Permissions.nursesRead
    }
  },

  /////////////User End
  /////////////Branch
  {
    path: '/branch',
    component: lazy(() => import('../../../views/branch')),
    exact: true,
    name: 'branch',
    meta: {
      title: 'branch',
      ...Permissions.branchBrowse
    }
  },
  // {
  //     path: '/branch/details/:id',
  //     component: lazy(() => import('../../../views/branch/AddOrUpdateBranch')),
  //     exact: true,
  //     name: "branch.details",
  //     meta: {
  //         title: "branch",
  //         ...Permissions.branchRead
  //     }
  // },
  {
    path: '/branch/create',
    component: lazy(() => import('../../../views/branch/BranchForm')),
    exact: true,
    name: 'branch.create',
    meta: {
      title: 'branch',
      ...Permissions.branchAdd
    }
  },
  {
    path: '/branch/update/:id',
    component: lazy(() => import('../../../views/branch/BranchForm')),
    exact: true,
    name: 'branch.update',
    meta: {
      title: 'branch',
      ...Permissions.branchEdit
    }
  },
  //////Branch
  ////work shift
  {
    path: '/schedule/calendar',
    component: lazy(() => import('../../../views/scheduleMaster/schedule/CalendarView')),
    exact: true,
    name: 'schedule.calendar',
    meta: {
      title: 'schedule',
      ...Permissions.scheduleSelfBrowse
    }
  },
  {
    path: '/schedule/table',
    component: lazy(() => import('../../../views/scheduleMaster/schedule/TemplateView')),
    exact: true,
    name: 'schedule.table',
    meta: {
      title: 'schedule',
      ...Permissions.scheduleSelfBrowse
    }
  },
  {
    path: '/schedule/ov',
    component: lazy(() => import('../../../views/scheduleMaster/obe')),
    exact: true,
    name: 'schedule.ov',
    meta: {
      title: 'ov',
      ...Permissions.scheduleSelfBrowse
    }
  },
  {
    path: '/schedule/ov/:token/:id',
    component: lazy(() => import('../../../views/scheduleMaster/obe')),
    exact: true,
    name: 'schedule.ov-list',
    meta: {
      title: 'ov',
      ...Permissions.scheduleSelfBrowse
    }
  },
  {
    path: '/schedule/template',
    component: lazy(() => import('../../../views/scheduleMaster/scheduleTemplate')),
    exact: true,
    name: 'schedule.template',
    meta: {
      title: 'schedule-template',
      ...Permissions.scheduleTemplateBrowse
    }
  },
  {
    path: '/employee/hoursApproval',
    component: lazy(() => import('../../../views/scheduleMaster/hoursApproval')),
    exact: true,
    name: 'employee.hoursApproval',
    meta: {
      title: 'hours-approval',
      ...Permissions.hoursApprovalBrowse
    }
  },
  {
    path: '/schedule/template/view/:id',
    component: lazy(() => import('../../../views/scheduleMaster/schedule/TemplateView')),
    exact: true,
    name: 'schedule.template.view',
    meta: {
      title: 'schedule-template-view',
      ...Permissions.scheduleTemplateBrowse
    }
  },
  {
    path: '/schedule/template/view/calender/:id/:status?',
    component: lazy(() => import('../../../views/scheduleMaster/schedule/CalendarView')),
    exact: true,
    name: 'schedule.calender.view',
    meta: {
      title: 'schedule-calender-view',
      ...Permissions.scheduleTemplateBrowse
    }
  },
  {
    path: '/schedule/leave/calendar',
    component: lazy(() => import('../../../views/scheduleMaster/leave/LeaveCalendarView')),
    exact: true,
    name: 'schedule.leave.calendar',
    meta: {
      title: 'leaves',
      ...Permissions.leaveSelfBrowse
    }
  },
  {
    path: '/schedule/leave/card_view',
    component: lazy(() => import('../../../views/scheduleMaster/leave')),
    exact: true,
    name: 'schedule.leave.card_view',
    meta: {
      title: 'leaves',
      ...Permissions.leaveSelfBrowse
    }
  },
  {
    path: '/schedule/shifts',
    component: lazy(() => import('../../../views/scheduleMaster/workShift')),
    exact: true,
    name: 'schedule.shifts',
    meta: {
      title: 'work-shift',
      ...Permissions.scheduleSelfBrowse
    }
  },
  {
    path: '/schedule/reports/stats-report',
    component: lazy(() => import('../../../views/scheduleMaster/ScReports')),
    exact: true,
    name: 'schedule.reports.stats-report',
    meta: {
      title: 'stats-reports',
      ...Permissions.scheduleSelfBrowse
    }
  },
  {
    path: '/schedule/reports/table-report',
    component: lazy(() => import('../../../views/scheduleMaster/ScReports/ScheduleTableReports')),
    exact: true,
    name: 'schedule.reports.table-report',
    meta: {
      title: 'table-reports',
      ...Permissions.scheduleSelfBrowse
    }
  },
  {
    path: '/schedule/employee/reports',
    component: lazy(() => import('../../../views/scheduleMaster/ScReports/EmployeeReports')),
    exact: true,
    name: 'schedule.employee.reports',
    meta: {
      title: 'employee-reports',
      ...Permissions.scheduleSelfBrowse
    }
  },
  ///
  ///////////implementation Plan
  {
    path: '/implementation-plans',
    component: lazy(() => import('../../../views/masters/ip')),
    exact: true,
    name: 'implementations',
    meta: {
      title: 'implementations',
      ...Permissions.ipSelfBrowse
    }
  },
  {
    path: '/followups/ip/:ip',
    component: lazy(() => import('../../../views/masters/followups')),
    exact: true,
    name: 'implementations.followups',
    meta: {
      title: 'followups',
      form: 'IP',
      ...Permissions.ipFollowUpsSelfBrowse
    }
  },

  {
    path: '/implementation-plans/history/:id',
    component: lazy(() => import('../../../views/masters/ip')),
    exact: true,
    name: 'implementations.history',
    meta: {
      title: 'implementations',
      ...Permissions.ipSelfBrowse
    }
  },
  // {
  //     path: '/implementation-plans/create',
  //     component: lazy(() => import('../../../views/masters/ip/AddUpdateIP')),
  //     exact: true,
  //     name: "implementations.create",
  //     meta: {
  //         title: "implementations",
  //         ...Permissions.ipSelfAdd
  //     }
  // },
  {
    path: '/implementation-plans/:id',
    component: lazy(() => import('../../../views/masters/ip/fragment/IPDetails')),
    exact: true,
    name: 'implementations.detail',
    meta: {
      title: 'implementations',
      ...Permissions.ipSelfRead
    }
  },
  // {
  //     path: '/implementation-plans/update/:id',
  //     component: lazy(() => import('../../../views/masters/ip/AddUpdateIP')),
  //     exact: true,
  //     name: "implementations.update",
  //     meta: {
  //         title: "implementations",
  //         ...Permissions.ipSelfEdit
  //     }
  // },
  ////implementation end
  {
    path: '/company-work-shift',
    component: lazy(() => import('../../../views/companyWorkShift')),
    exact: true,
    name: 'company-work-shift',
    meta: {
      title: 'company-work-shift',
      action: 'browse',
      resource: 'company-work-shift',
      ...Permissions.workShiftBrowse
    }
  },

  {
    path: '/followups',
    component: lazy(() => import('../../../views/masters/followups')),
    exact: true,
    name: 'followups',
    meta: {
      title: 'followups',
      ...Permissions.ipFollowUpsSelfBrowse
    }
  },
  {
    path: '/followups/history/:ip/:parent',
    component: lazy(() => import('../../../views/masters/followups')),
    exact: true,
    name: 'followups.history',
    meta: {
      title: 'followups',
      ...Permissions.ipFollowUpsSelfBrowse
    }
  },
  // {
  //     path: '/followups/details/:id',
  //     component: lazy(() => import('../../../views/masters/followups/followupsDetails')),
  //     exact: true,
  //     name: "followups.details",
  //     meta: {
  //         title: "followups-detail",
  //         ...Permissions.ipFollowUpsSelfRead
  //     }
  // },
  {
    path: '/department',
    component: lazy(() => import('../../../views/masters/department')),
    exact: true,
    name: 'department',
    meta: {
      title: 'department',
      ...Permissions.departmentsBrowse
    }
  },
  {
    path: '/permissions',
    component: lazy(() => import('../../../views/permissions')),
    exact: true,
    name: 'permissions',
    meta: {
      title: 'permissions',
      ...Permissions.dashboardBrowse
    }
  },

  {
    path: '/questions',
    component: lazy(() => import('../../../views/masters/questions')),
    exact: true,
    name: 'questions',
    meta: {
      title: 'questions',
      ...Permissions.questionsBrowse
    }
  },
  {
    path: '/timeline',
    component: lazy(() => import('../../../views/masters/timeline')),
    exact: true,
    name: 'timeline',
    meta: {
      title: 'timeline',
      ...Permissions.activitySelfBrowse
    }
  },
  {
    path: '/timeline/ip/:id',
    component: lazy(() => import('../../../views/masters/timeline')),
    exact: true,
    name: 'ip.timeline',
    meta: {
      title: 'timeline',
      ...Permissions.activitySelfBrowse
    }
  },
  {
    path: '/trashed-activity',
    component: lazy(() => import('../../../views/activityTrash')),
    exact: true,
    name: 'trashed-activity',
    meta: {
      title: 'trashed-activity',
      ...Permissions.trashedActivityBrowse
    }
  },
  {
    path: '/deviation',
    component: lazy(() => import('../../../views/devitation')),
    exact: true,
    name: 'deviation',
    meta: {
      title: 'deviation',
      ...Permissions.deviationSelfBrowse
    }
  },
  {
    path: '/patient-cashier',
    component: lazy(() => import('../../../views/patientCashiers/PatientCashierTableVIew')),
    exact: true,
    name: 'patient-cashier',
    meta: {
      title: 'patient-cashier',
      ...Permissions.patientCashiersBrowse
    }
  },
  {
    path: '/deviation-stats',
    component: lazy(() => import('../../../views/devitation/stats/chart')),
    exact: true,
    name: 'deviation-stats',
    meta: {
      title: 'deviation-stats',
      ...Permissions.deviationSelfBrowse
    }
  },
  {
    path: '/stampling',
    component: lazy(() => import('../../../views/stampling')),
    exact: true,
    name: 'stampling',
    meta: {
      title: 'stampling',
      ...Permissions.stamplingBrowse
    }
  },
  // {
  //     path: '/stampling-report',
  //     component: lazy(() => import('../../../views/stampling/StamplingReport/TableReports')),
  //     exact: true,
  //     name: "stampling-report",
  //     meta: {
  //         title: "shiftWise-report",
  //         ...Permissions.stamplingBrowse
  //     }
  // },
  // {
  //     path: '/stampling-report-daywise',
  //     component: lazy(() => import('../../../views/stampling/StamplingReport/DayReports')),
  //     exact: true,
  //     name: "stampling-report-daywise",
  //     meta: {
  //         title: "dayWise-report",
  //         ...Permissions.stamplingBrowse
  //     }
  // },
  {
    path: '/company-package',
    component: lazy(() => import('../../../views/settings/package')),
    exact: true,
    name: 'company-package',
    meta: {
      title: 'packages',
      ...Permissions.stamplingBrowse
    }
  }
]
export default CompanyRoutes
