import {
  leaveApproved,
  leaveCompany,
  leaveDelete,
  leaveLoad,
  leaveSave,
  leaveScheduleSlotRedux,
  leaveUpdate
} from '../../redux/reducers/leave'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus } from '../Utils'

export const addLeave = async ({
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
    noEntryMode: true,
    path: ApiEndpoints.add_leave,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      if (jsonData?.group_by) {
        dispatch(
          leaveSave([
            {
              ...data?.payload[0],
              leaves: data?.payload
            }
          ])
        )
      } else {
        dispatch(leaveSave(data?.payload))
      }
      success(data)
    }
    // error: () => { /** ErrorToast("data-fetch-failed") **/; error(true) }
  })
}

export const loadLeave = async ({
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
    path: ApiEndpoints.leave_load,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(leaveLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const allLeaveDates = ({ loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.company_leaves,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const getAllCompanyLeaves = ({ loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.get_company_leave,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const editLeave = async ({
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
    path: ApiEndpoints.edit_leave + id,
    jsonData,
    noEntryMode: true,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(
        leaveUpdate({
          ...data?.payload,
          id
        })
      )
      success(data)
    },
    error: () => {}
  })
}

export const deleteLeave = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_leave + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      success(id)
    },
    error: () => {
      error(true)
    }
  })
}

export const approveLeaveWithoutStampling = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.without_stamp + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: (e) => {
      success(e)
      emitAlertStatus('success', e?.payload)
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}

// export const leaveView = async ({ id, async = false, jsonData, loading, page, perPage, dispatch = () => { }, success = () => { } }) => {
//     return http.request({
//         async,
//         method: "get",
//         path: ApiEndpoints.view_leave + id,
//         jsonData,
//         loading,
//         params: { page, perPage },
//         showErrorToast: true,
//         success: (data) => { dispatch(leaveView(data = data?.payload)); success(data) },
//         error: () => { }
//     })
// }

export const leaveView = async ({ async = false, id, loading, success = () => {} }) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.view_leave + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const allLeaves = async ({ async = false, id, loading, success = () => {} }) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.all_leaves + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const approveLeave = async ({
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
    noEntryMode: true,
    path: ApiEndpoints.approve_leave,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(leaveApproved(data?.payload))
      success(data)
    }
    // error: () => { /** ErrorToast("data-fetch-failed") **/; error(true) }
  })
}

export const leaveScheduleSlot = async ({
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
    noEntryMode: true,
    path: ApiEndpoints.leave_schedule,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(leaveScheduleSlotRedux(data?.payload))
      success(data)
    }
    // error: () => { /** ErrorToast("data-fetch-failed") **/; error(true) }
  })
}

export const leaveScheduleSelectedSlot = async ({
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
    noEntryMode: true,
    path: ApiEndpoints.leave_schedule_slot_selected,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
    }
    // error: () => { /** ErrorToast("data-fetch-failed") **/; error(true) }
  })
}

export const companyLeave = async ({
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
    noEntryMode: true,
    path: ApiEndpoints.company_leave,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      if (jsonData?.group_by) {
        dispatch(
          leaveSave([
            {
              ...data?.payload[0],
              leaves: data?.payload
            }
          ])
        )
      } else {
        dispatch(leaveSave(data?.payload))
      }
      success(data)
    }
    // error: () => { /** ErrorToast("data-fetch-failed") **/; error(true) }
  })
}

export const leaveScheduleFilter = async ({
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
    noEntryMode: true,
    path: ApiEndpoints.leave_schedule_filter,
    jsonData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => { dispatch(leaveScheduleSlotRedux(data?.payload)); success(data) }
    success: (data) => {
      success(data?.payload)
    }
    // error: () => { /** ErrorToast("data-fetch-failed") **/; error(true) }
  })
}
