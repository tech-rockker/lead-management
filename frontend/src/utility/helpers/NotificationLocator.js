import { getPath } from '../../router/RouteHelper'
import { UserTypes } from '../Const'
import { log } from './common'

export const NotificationLocator = (notification, history) => {
  const item = notification?.module
  const userType = notification?.user_type
  log(item)
  switch (item) {
    case 'journal':
      if (notification?.type === 'journal') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('journal'),
            state: {
              notification
            }
          })
        }
      }
      break
    case 'schedule':
      if (notification?.type === 'leave') {
        if (notification?.event === 'schedule-assigned') {
          history.push({
            pathname: getPath('schedule.calendar'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'requested') {
          history.push({
            pathname: getPath('schedule.leave.card_view'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'scheduleSlotSelected') {
          history.push({
            pathname: getPath('schedule.calendar'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'leave-applied') {
          history.push({
            pathname: getPath('schedule.leave.card_view'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'leave-approved') {
          history.push({
            pathname: getPath('schedule.leave.card_view'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'leave-applied-approved') {
          history.push({
            pathname: getPath('schedule.leave.card_view'),
            state: {
              notification
            }
          })
        }
      }
      if (notification?.type === 'ov') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('schedule.ov'),
            state: {
              notification
            }
          })
        }
      }
      if (notification?.type === 'workshift') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('schedule.shifts'),
            state: {
              notification
            }
          })
        }
      }
      if (notification?.type === 'schedule') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('schedule.calendar'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'schedule-verified') {
          history.push({
            pathname: getPath('employee.hoursApproval'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'leave-applied-approved') {
          history.push({
            pathname: getPath('schedule.leave.card_view'),
            state: {
              notification
            }
          })
        }
      }
      break
    case 'deviation':
      if (notification?.type === 'deviation') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('deviation'),
            state: {
              notification
            }
          })
        }
      }
      break
    case 'activity':
      if (notification?.type === 'activity') {
        if (notification?.event === 'assigned') {
          history.push({
            pathname: getPath('timeline'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'created') {
          history.push({
            pathname: getPath('timeline'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'activity-marked-done') {
          history.push({
            pathname: getPath('timeline'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'activity-marked-not-done') {
          history.push({
            pathname: getPath('timeline'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'activity-marked-not-applicable') {
          history.push({
            pathname: getPath('timeline'),
            state: {
              notification
            }
          })
        }
      }
      if (notification?.type === 'comment') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('timeline'),
            state: {
              notification
            }
          })
        }
      }
      if (notification?.type === 'trashed-activity') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('trashed-activity'),
            state: {
              notification
            }
          })
        }
      }
      break
    case 'stampling':
      if (notification?.event === 'created') {
        history.push({
          pathname: getPath('deviation'),
          state: {
            notification
          }
        })
      }
      break
    case 'task':
      if (notification?.type === 'task') {
        if (notification?.event === 'created-assigned') {
          history.push({
            pathname: getPath('master.tasks'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'assigned') {
          history.push({
            pathname: getPath('master.tasks'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'marked-done') {
          history.push({
            pathname: getPath('master.tasks'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'marked-not-done') {
          history.push({
            pathname: getPath('master.tasks'),
            state: {
              notification
            }
          })
        }
      }
      if (notification?.type === 'calendar') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('calendar'),
            state: {
              notification
            }
          })
        }
      }
      break
    case 'plan':
      if (notification?.type === 'ip') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('implementations'),
            state: {
              notification
            }
          })
        }
      }
      if (notification?.type === 'followup') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('followups'),
            state: {
              notification
            }
          })
        }
      }
      break
    case 'user':
      if (notification?.type === 'branch') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('branch'),
            state: {
              notification
            }
          })
        }
      }
      if (notification?.type === 'patient') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('users.patients'),
            state: {
              notification
            }
          })
        }
      }
      if (notification?.type === 'employee') {
        if (notification?.event === 'created') {
          history.push({
            pathname:
              userType === UserTypes.adminEmployee || userType === UserTypes.admin
                ? getPath('users.employees-admin')
                : getPath('users.employees'),
            state: {
              notification
            }
          })
        }
      }
      break
    case 'setting':
      if (notification?.type === 'manage-file') {
        if (notification?.event === 'created') {
          history.push({
            pathname: getPath('branch'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'request-sign') {
          history.push({
            pathname: getPath('settings.manageFiles.files'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'signed-done-by-employee') {
          history.push({
            pathname: getPath('settings.manageFiles.files'),
            state: {
              notification
            }
          })
        } else if (notification?.event === 'view-admin-file-done') {
          history.push({
            pathname: getPath('settings.manageFiles.files'),
            state: {
              notification
            }
          })
        }
      }
      break
    case 'request-approval':
      if (notification?.type === 'request-approval') {
        if (notification?.event === 'request-approval') {
          history.push({
            pathname: getPath('branch'),
            state: {
              notification
            }
          })
        }
      }
      break
    case 'Module':
      if (notification?.type === 'module-request') {
        if (notification?.event === 'module-request') {
          history.push({
            pathname: getPath('requests'),
            state: {
              notification
            }
          })
        }
      }
      break
    default:
      break
  }
}
