import {
  BusinessOutlined,
  ClassOutlined,
  GroupAddOutlined,
  HomeWorkOutlined,
  Language,
  LocalActivityOutlined,
  PartyMode,
  QuestionAnswer,
  Report,
  Rotate90DegreesCcw,
  SignalCellular0Bar,
  StorageOutlined
} from '@material-ui/icons'
import {
  Activity,
  Anchor,
  Bell,
  Bluetooth,
  Briefcase,
  Calendar,
  Circle,
  Clipboard,
  Clock,
  Codesandbox,
  Columns,
  Cpu,
  Crosshair,
  File,
  FileText,
  Flag,
  HelpCircle,
  Key,
  Layers,
  Mail,
  MessageSquare,
  Package,
  Pocket,
  Scissors,
  Settings,
  Slack,
  StopCircle,
  Table,
  Target,
  Tool,
  TrendingUp,
  Twitch,
  UserPlus,
  Users,
  Star
} from 'react-feather'
import { getPath } from '../../router/RouteHelper'
import { UserTypes } from '../../utility/Const'
import { Permissions } from '../../utility/Permissions'

export default [
  {
    id: 'home',
    title: 'dashboard',
    icon: <HomeWorkOutlined size={12} />,
    navLink: getPath('dashboard.home'),
    userTypes: Object.values(UserTypes),
    ...Permissions.dashboardBrowse
  },
  {
    id: 'log-menu',
    title: 'log-menu',
    icon: <Layers size={12} />,
    children: [
      {
        id: 'sms-log',
        title: 'sms-log',
        icon: <Circle size={12} />,
        navLink: getPath('log.sms'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.smsLogBrowse
      },
      {
        id: 'bankID-log',
        title: 'bankID-log',
        icon: <Circle size={12} />,
        navLink: getPath('log.bankID'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.bankIdLogBrowse
      },
      {
        id: 'activity-log',
        title: 'activity-log',
        icon: <Circle size={12} />,
        navLink: getPath('log.activity'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.activityLogBrowse
      },
      {
        id: 'file-log',
        title: 'file-access-log',
        icon: <Circle size={12} />,
        navLink: getPath('log.file'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.fileLogBrowse
      }
    ]
  },
  {
    id: 'activities',
    title: 'activities',
    icon: <Activity size={12} />,
    children: [
      {
        id: 'activity',
        title: 'activity',
        icon: <Activity size={12} />,
        navLink: getPath('timeline'),
        userTypes: Object.values(UserTypes).filter(
          (a) => a !== UserTypes.admin || a !== UserTypes.adminEmployee
        ),
        ...Permissions.activitySelfBrowse
      },
      {
        id: 'trashed-activity',
        title: 'trashed-activity',
        icon: <LocalActivityOutlined size={12} />,
        navLink: getPath('trashed-activity'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.trashedActivityBrowse
      },
      {
        id: 'activity-stats',
        title: 'statistics',
        icon: <TrendingUp size={12} />,
        navLink: getPath('users.stats'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.activitySelfStats
      }
    ]
  },
  {
    id: 'ip-menu',
    title: 'ip-menu',
    icon: <Rotate90DegreesCcw size={12} />,
    children: [
      {
        id: 'implementations',
        title: 'ip-plans',
        icon: <Rotate90DegreesCcw size={12} />,
        navLink: getPath('implementations'),
        userTypes: Object.values(UserTypes).filter(
          (a) => a !== UserTypes.admin || a !== UserTypes.adminEmployee
        ),
        ...Permissions.ipSelfBrowse
      },
      {
        id: 'followup',
        title: 'followups',
        icon: <StopCircle size={12} />,
        navLink: getPath('followups'),
        userTypes: Object.values(UserTypes).filter(
          (a) => a !== UserTypes.admin || a !== UserTypes.adminEmployee
        ),
        ...Permissions.ipFollowUpsSelfBrowse
      }
    ]
  },
  {
    id: 'task-menu',
    title: 'task-menu',
    icon: <Target size={12} />,
    children: [
      {
        id: 'tasksdsd',
        title: 'tasks',
        icon: <Target size={12} />,
        navLink: getPath('master.tasks'),
        userTypes: [
          UserTypes.admin,
          UserTypes.adminEmployee,
          UserTypes.company,
          UserTypes.employee,
          UserTypes.branch
        ],
        ...Permissions.taskBrowse
      },
      {
        id: 'calendar',
        title: 'Calendar',
        icon: <Calendar size={12} />,
        exact: true,
        navLink: getPath('master.task.calendar'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.calendarBrowse
      }
    ]
  },

  {
    id: 'active',
    title: 'activity-classification',
    icon: <ClassOutlined size={12} />,
    navLink: getPath('master.activity-classification'),
    userTypes: [UserTypes.admin, UserTypes.adminEmployee],
    ...Permissions.activitiesClsBrowse
  },
  {
    id: 'journal-menu',
    title: 'journal-menu',
    icon: <File size={12} />,
    children: [
      {
        id: 'journal',
        title: 'journals',
        icon: <FileText size={12} />,
        navLink: getPath('journal'),
        userTypes: Object.values(UserTypes).filter(
          (a) => a !== UserTypes.admin || a !== UserTypes.adminEmployee
        ),
        ...Permissions.journalSelfBrowse
      },
      {
        id: 'stats',
        title: 'stats',
        icon: <TrendingUp size={12} />,
        navLink: getPath('stats'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.journalStatsView
      }
    ]
  },
  {
    id: 'deviation-menu',
    title: 'deviation-menu',
    icon: <Scissors size={12} />,
    children: [
      {
        id: 'deviation',
        title: 'deviation',
        icon: <FileText size={12} />,
        navLink: getPath('deviation'),
        userTypes: Object.values(UserTypes).filter(
          (a) => a !== UserTypes.admin || a !== UserTypes.adminEmployee
        ),
        ...Permissions.deviationSelfBrowse
      },
      {
        id: 'deviation-stats',
        title: 'deviation-stats',
        icon: <TrendingUp size={12} />,
        navLink: getPath('deviation-stats'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.deviationStatsView
      }
    ]
  },
  {
    id: 'user-management-menu',
    title: 'user-management-menu',
    icon: <GroupAddOutlined size={12} />,
    children: [
      {
        title: 'employees',
        icon: <Users size={12} />,
        navLink: getPath('users.employees'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.employeesBrowse
      },
      {
        title: 'employees',
        icon: <Users size={12} />,
        navLink: getPath('users.employees-admin'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.adminEmployeeBrowse
      },
      {
        title: 'patients',
        icon: <UserPlus size={12} />,
        navLink: getPath('users.patients'),
        userTypes: Object.values(UserTypes).filter(
          (a) => a !== UserTypes.admin || a !== UserTypes.adminEmployee
        ),
        ...Permissions.patientsBrowse
      },
      {
        id: 'patient-cashier',
        title: 'patient-cashier',
        icon: <Clipboard size={12} />,
        navLink: getPath('patient-cashier'),
        userTypes: Object.values(UserTypes).filter(
          (a) => a !== UserTypes.admin || a !== UserTypes.adminEmployee
        ),
        ...Permissions.patientCashiersBrowse
      },
      {
        id: 'branch',
        title: 'branch',
        icon: <Pocket size={12} />,
        navLink: getPath('branch'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.branchBrowse
      },
      {
        id: 'company-package',
        title: 'company-package',
        icon: <Package size={12} />,
        navLink: getPath('company-package'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.packagesBrowseCompany
      }
    ]
  },
  {
    id: 'companies',
    title: 'companies',
    icon: <BusinessOutlined size={12} />,
    navLink: getPath('companies'),
    userTypes: [UserTypes.admin, UserTypes.adminEmployee],
    ...Permissions.companiesBrowse
  },
  {
    id: 'menu-packages',
    title: 'packages',
    icon: <Package size={12} />,
    navLink: getPath('master.packages'),
    userTypes: [UserTypes.admin, UserTypes.adminEmployee],
    ...Permissions.packagesBrowse
  },
  {
    id: 'licences',
    title: 'licences',
    icon: <Key size={12} />,
    navLink: getPath('settings.licences'),
    userTypes: [UserTypes.admin, UserTypes.adminEmployee],
    ...Permissions.licencesBrowse
  },
  {
    id: 'master-menu',
    title: 'master-menu',
    icon: <Tool size={12} />,
    children: [
      {
        id: 'red-word',
        title: 'red-word',
        icon: <SignalCellular0Bar size={12} />,
        navLink: getPath('master.red-word'),
        userTypes: [
          UserTypes.admin,
          UserTypes.adminEmployee,
          UserTypes.company,
          UserTypes.employee,
          UserTypes.branch
        ],
        ...Permissions.wordsBrowse
      },
      {
        id: 'paragraphs',
        title: 'paragraphs',
        icon: <PartyMode size={12} />,
        navLink: getPath('master.paragraphs'),
        userTypes: [
          UserTypes.admin,
          UserTypes.adminEmployee,
          UserTypes.company,
          UserTypes.employee,
          UserTypes.branch
        ],
        ...Permissions.paragraphsBrowse
      },

      {
        id: 'modules',
        title: 'Modules',
        icon: <Bluetooth size={12} />,
        navLink: getPath('master.modules'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.modulesBrowse
      },
      {
        id: 'language-import1996',
        title: 'import-language',
        icon: <Language size={12} />,
        navLink: getPath('master.import_language'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.importLanguage
      },
      {
        id: 'questions',
        title: 'questions',
        icon: <QuestionAnswer size={12} />,
        navLink: getPath('questions'),
        userTypes: [
          UserTypes.admin,
          UserTypes.adminEmployee,
          UserTypes.company,
          UserTypes.employee,
          UserTypes.branch
        ],
        ...Permissions.questionsBrowse
      },

      {
        id: 'roles',
        title: 'roles',
        icon: <Layers size={12} />,
        navLink: getPath('master.roles'),
        userTypes: [
          UserTypes.admin,
          UserTypes.adminEmployee,
          UserTypes.company,
          UserTypes.employee,
          UserTypes.branch
        ],
        ...Permissions.rolesBrowse
      },
      {
        id: 'companyTypes',
        title: 'company-types',
        icon: <Briefcase size={12} />,
        navLink: getPath('master.companyTypes'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.companyTypeBrowse
      },
      {
        id: 'userTypes',
        title: 'user-types',
        icon: <Users size={12} />,
        navLink: getPath('master.userTypes'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.userTypeBrowse
      },
      {
        id: 'categoryTypes',
        title: 'category-type',
        icon: <Codesandbox size={12} />,
        navLink: getPath('master.categories.types'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.categoryTypesBrowse
      },
      {
        id: 'categories',
        title: 'categories',
        icon: <Cpu size={12} />,
        navLink: getPath('master.categories'),
        userTypes: [
          UserTypes.admin,
          UserTypes.adminEmployee,
          UserTypes.company,
          UserTypes.employee,
          UserTypes.branch
        ],
        ...Permissions.categoriesBrowse
      },
      {
        id: 'patients',
        title: 'patient-type',
        icon: <Circle size={12} />,
        navLink: getPath('master.patient.types'),
        userTypes: [UserTypes.admin, UserTypes.adminEmployee],
        ...Permissions.activitiesClsBrowse
      }
    ]
  },
  {
    id: 'schedule-menus',
    title: 'schedule-menu',
    icon: <Clock size={12} />,
    children: [
      {
        id: 'schedule_template',
        title: 'schedule-template',
        icon: <Anchor size={12} />,
        navLink: getPath('schedule.template'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.scheduleTemplateBrowse
      },
      {
        id: 'schedulesddf',
        title: 'schedule',
        icon: <Clock size={12} />,
        navLink: getPath('schedule.calendar'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.scheduleSelfBrowse
      },

      {
        id: 'shifts',
        title: 'work-shift',
        icon: <Slack size={12} />,
        navLink: getPath('schedule.shifts'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.workShiftBrowse
      },
      {
        id: 'ov',
        title: 'ov',
        icon: <Crosshair size={12} />,
        navLink: getPath('schedule.ov'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.workShiftBrowse
      },
      {
        id: 'leave',
        title: 'leave',
        icon: <Twitch size={12} />,
        navLink: getPath('schedule.leave.card_view'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.leaveSelfBrowse
      },
      {
        id: 'hours_approval',
        title: 'hours-approval',
        icon: <Columns size={12} />,
        navLink: getPath('employee.hoursApproval'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.hoursApprovalBrowse
      },
      {
        id: 'scReports',
        title: 'schedule-reports',
        icon: <Report size={12} />,
        children: [
          {
            id: 'reports',
            title: 'stats-report',
            icon: <TrendingUp size={12} />,
            navLink: getPath('schedule.reports.stats-report'),
            userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
            ...Permissions.scheduleSelfBrowse
          },
          {
            id: 'table-view',
            title: 'table-report',
            icon: <Table size={12} />,
            navLink: getPath('schedule.reports.table-report'),
            userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
            ...Permissions.scheduleSelfBrowse
          }
        ]
      }
    ]
  },

  // {
  //     id: 'stampling-menu',
  //     title: 'stampling-menu',
  //     icon: <Trello size={12} />,
  //     children: [
  //         {
  //             id: 'stampling',
  //             title: 'stampling',
  //             icon: <Trello size={12} />,
  //             navLink: getPath("stampling"),
  //             module: Modules.stampling,
  //             userTypes: [
  //                 UserTypes.company,
  //                 UserTypes.employee,
  //                 UserTypes.branch
  //             ],
  //             ...Permissions.stamplingBrowse
  //         },
  //         {
  //             id: 'stReports',
  //             title: 'stampling-reports',
  //             icon: <Report size={12} />,
  //             children: [
  //                 {
  //                     id: "stampling-stats",
  //                     title: "ShiftWise Report",
  //                     icon: <Table size={12} />,
  //                     navLink: getPath('stampling-report'),
  //                     userTypes: [
  //                         UserTypes.company,
  //                         UserTypes.employee,
  //                         UserTypes.branch
  //                     ],
  //                     ...Permissions.stamplingBrowse
  //                 },
  //                 {
  //                     id: "stampling-stats-daywise",
  //                     title: "DayWise Report",
  //                     icon: <TrendingUp size={12} />,
  //                     navLink: getPath('stampling-report-daywise'),
  //                     userTypes: [
  //                         UserTypes.company,
  //                         UserTypes.employee,
  //                         UserTypes.branch
  //                     ],
  //                     ...Permissions.stamplingBrowse
  //                 }

  //             ]
  //         }
  //     ]
  // },
  {
    id: 'setting-menu',
    title: 'setting-menu',
    icon: <Settings size={12} />,
    children: [
      {
        id: 'country-list',
        title: 'country-list',
        icon: <Flag size={12} />,
        navLink: getPath('country-list'),
        userTypes: [UserTypes.adminEmployee, UserTypes.admin],
        ...Permissions.countryBrowse
      },
      {
        id: 'settings',
        title: 'settings',
        icon: <Settings size={12} />,
        navLink: getPath('settings.general'),
        userTypes: [UserTypes.company, UserTypes.employee, UserTypes.branch],
        ...Permissions.settingsBrowse
      },
      {
        id: 'emailTemplate',
        title: 'email-notifications',
        icon: <Mail size={12} />,
        navLink: getPath('settings.emailTemplate'),
        userTypes: [UserTypes.adminEmployee, UserTypes.admin],
        ...Permissions.emailTemplateBrowse
      },
      {
        id: 'smsTemplate',
        title: 'sms-template',
        icon: <MessageSquare size={12} />,
        navLink: getPath('settings.smsTemplate'),
        userTypes: [UserTypes.adminEmployee, UserTypes.admin],
        ...Permissions.emailTemplateBrowse
      },
      // {
      //     id: 'bankDetail',
      //     title: 'Bank Detail',
      //     icon: <AccountBalance size={12} />,
      //     navLink: getPath("settings.bankDetail"),
      //     ...Permissions.bankBrowse

      // },
      {
        id: 'manageFiles',
        title: 'manage-files',
        icon: <StorageOutlined size={12} />,
        navLink: getPath('settings.manageFiles'),
        userTypes: [
          UserTypes.adminEmployee,
          UserTypes.admin,
          UserTypes.company,
          UserTypes.employee,
          UserTypes.branch
        ],
        ...Permissions.fileBrowse
      },
      {
        id: 'myFavorites',
        title: 'my-favorites',
        icon: <Star size={12} />,
        navLink: getPath('settings.myFavorites'),
        userTypes: [
          UserTypes.adminEmployee,
          UserTypes.admin,
          UserTypes.company,
          UserTypes.employee,
          UserTypes.branch
        ],
        ...Permissions.fileBrowse
      }
    ]
  },
  {
    id: 'message-menu',
    title: 'message-menu',
    icon: <Bell size={12} />,
    children: [
      {
        id: 'notifications',
        title: 'notifications',
        icon: <Bell size={12} />,
        action: 'view',
        resource: 'Notifications',
        navLink: getPath('notifications'),
        userTypes: Object.values(UserTypes),
        ...Permissions.notificationsBrowse
      },
      {
        id: 'chat-msg',
        title: 'message',
        icon: <MessageSquare size={12} />,
        navLink: getPath('messages'),
        userTypes: Object.values(UserTypes),
        ...Permissions.dashboardBrowse
      },
      {
        id: 'requests',
        title: 'requests',
        icon: <HelpCircle size={12} />,
        navLink: getPath('requests'),
        userTypes: [
          UserTypes.company,
          UserTypes.employee,
          UserTypes.branch,
          UserTypes.admin,
          UserTypes.adminEmployee
        ],
        ...Permissions.requestsBrowse
      }
    ]
  }
]
