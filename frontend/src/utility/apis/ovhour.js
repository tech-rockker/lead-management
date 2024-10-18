import { ovDelete, ovLoad, ovSave, ovUpdate, ovView } from '../../redux/reducers/ovhour'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadOv = async ({
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
    path: ApiEndpoints.ovhour_list,
    jsonData,

    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(ovLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewOv = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.ovhour_view + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const addOv = async ({
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
    path: ApiEndpoints.ovhour_add,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(ovSave(data?.payload))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const editOv = async ({
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
    path: ApiEndpoints.ovhour_edit + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(ovUpdate(data?.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteOv = ({ id, loading, jsonData, success = () => {}, error = () => {} }) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.ovhour_delete + id,
    jsonData,
    loading,
    SuccessToast: true,
    showErrorToast: true,
    success: (e) => {
      emitAlertStatus('success', e)
    },
    error: () => {
      emitAlertStatus('failed')
    }
  })
}

export const importOv = async ({
  async = false,
  formData,
  loading,
  page,
  perPage,
  error = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.ov_import,
    formData,
    showErrorToast: true,
    loading,
    params: { page, perPage },
    success: (data) => {
      success(data?.message)
    },
    error: (e) => {
      error(e)
    }
  })
}
