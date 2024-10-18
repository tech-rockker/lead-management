//
import {
  activityAction,
  activityApprove,
  activityAssignment,
  activityDelete,
  activityLoad,
  activitySave,
  activityTrmWiseChart,
  activityUpdate,
  activityView,
  goalSubGoalReport,
  notApplicable
} from '../../redux/reducers/activity'
import {
  permissionDelete,
  permissionLoad,
  permissionSave,
  permissionUpdate,
  permissionView
} from '../../redux/reducers/Permissions'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadActivity = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.activity_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(activityLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewActivity = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.view_activity + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const addActivity = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: `${ApiEndpoints.add_activity}`,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
      dispatch(activitySave(data?.payload))
    },
    error: () => {
      error(true)
    }
  })
}

export const termWiseActivityStats = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'Post',
    path: ApiEndpoints.get_tmw_wise_activity_report,
    jsonData,
    loading,
    // showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => {

    //     success((data?.payload))
    // },
    success: (data) => {
      success(data)
      dispatch(activityTrmWiseChart([{ ...data?.payload }]))
    },

    error: () => {
      error(true)
    }
  })
}
export const activityGoalSubGoalReport = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'Post',
    path: ApiEndpoints.get_ip_goal_subgoal_report,
    jsonData,
    loading,
    // showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => {

    //     success((data?.payload))
    // },
    success: (data) => {
      success(data)
      dispatch(goalSubGoalReport([{ ...data?.payload }]))
    },

    error: () => {
      error(true)
    }
  })
}
export const assignActivity = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.assign_activity,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
      dispatch(
        activityUpdate({
          ...data?.payload?.activity,
          assign_employee: [
            {
              ...data?.payload
            }
          ]
        })
      )
    },
    error: () => {
      error(true)
    }
  })
}

export const assignActivityRemove = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.assigned_employee_removed,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
      // dispatch(activityUpdate({
      //     ...data?.payload?.activity,
      //     assign_employee: [
      //         {
      //             ...data?.payload
      //         }
      //     ]
      // }))
    },
    error: () => {
      error(true)
    }
  })
}

export const tagActivity = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.tag_activity,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(
        activityUpdate({
          id: jsonData?.activity_id,
          activity_tag: jsonData?.activity_tag
        })
      )
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const addActivityAction = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.activity_action,
    jsonData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
      // setTimeout(() => {
      dispatch(activityAction(jsonData))
      // }, 500)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const approveActivity = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.approve_activity,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
      dispatch(activityApprove([{ ...data?.payload }]))
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editActivity = async ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'put',
    path: ApiEndpoints.edit_activity + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      success(data)
      dispatch(activityUpdate(data?.payload))
    },
    error: () => {}
  })
}
export const deleteActivity = ({
  id,
  loading,
  dispatch = () => {},
  jsonData,
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_activity + id,
    jsonData,
    loading,
    SuccessToast: true,
    showErrorToast: true,
    success: () => {
      emitAlertStatus('success')
    },
    error: () => {
      emitAlertStatus('failed')
    }
  })
}

export const activityNotApplicable = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.activityNotApplicable,
    jsonData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => { success(data?.payload) },
    success: (data) => {
      success(data?.payload)
      dispatch(notApplicable(jsonData?.activity_id))
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}
