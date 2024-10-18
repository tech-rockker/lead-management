import {
  scheduleTempChangeStatus,
  scheduleTempCopy,
  scheduleTempLoad,
  scheduleTempSave,
  scheduleTempUpdate
} from '../../redux/reducers/scheduleTemplate'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus } from '../Utils'

/**
 * Load from api
 */
export const loadScTemplate = async ({
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
    path: ApiEndpoints.schedule_template_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(scheduleTempLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewScTemplate = async ({ async = false, id, loading, success = () => {} }) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.schedule_template_view + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const addScTemplate = async ({
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
    path: ApiEndpoints.schedule_template_add,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(scheduleTempSave(data?.payload))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const copyScTemplate = async ({
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
    path: ApiEndpoints.schedule_template_clone,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(scheduleTempCopy(data?.payload))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const editScTemplate = async ({
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
    path: ApiEndpoints.schedule_template_update + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(scheduleTempUpdate(data?.payload))
      success(data)
    },
    error: () => {}
  })
}

export const changeStatusScTemplate = async ({
  id,
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
    path: ApiEndpoints.schedule_change_status + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    // showSuccessToast: true,
    success: (data) => {
      dispatch(scheduleTempChangeStatus(data?.payload))
      success(data)
    },
    error: (e) => {
      error(e)
    }
  })
}
export const deleteScTemplate = ({
  id,
  loading,
  dispatch = () => {},
  jsonData,
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.schedule_template_delete + id,
    jsonData,
    loading,
    SuccessToast: true,
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
