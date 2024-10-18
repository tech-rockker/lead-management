//
import {
  folloupSave,
  followupComplete,
  followupDelete,
  followupEditHistory,
  followupLoad,
  followupUpdate,
  followupView
} from '../../redux/reducers/followups'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast } from '../Utils'
/**
 * Load from api
 */
export const loadFollowUp = async ({
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
    path: ApiEndpoints.follow_up_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(followupLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadFollowUpEditHistory = async ({
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
    path: ApiEndpoints.followup_edit_history,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(followupEditHistory(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadActivityEditHistory = async ({
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
    path: ApiEndpoints.activity_edit_history,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(followupEditHistory(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewFollowUp = async ({
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
    method: 'get',
    path: ApiEndpoints.view_follow_up + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      dispatch(followupView(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const addFollowUp = async ({
  error = () => {},
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
    path: ApiEndpoints.add_follow_up,
    jsonData,
    loading,
    showSuccessToast: true,
    showErrorToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(folloupSave(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const addFollowupComplete = async ({
  error = () => {},
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
    path: ApiEndpoints.follow_up_complete,
    jsonData,
    loading,
    showSuccessToast: true,
    showErrorToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(followupComplete(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editFollowUp = async ({
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
    path: ApiEndpoints.edit_follow_up + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(followupUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteFollowUp = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_follow_up + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      success(id)
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}

export const completeFollowUp = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  error = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.completeFollowUp,
    jsonData,
    showSuccessToast: true,
    showErrorToast: true,
    loading,
    params: { page, perPage },
    success: (data) => {
      success(data?.payload)
    },
    error: (e) => {
      error(e)
    }
  })
}
