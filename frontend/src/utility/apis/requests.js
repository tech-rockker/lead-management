import {
  reqStatus,
  requestDelete,
  requestLoad,
  requestSave,
  requestUpdate
} from '../../redux/reducers/requests'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast } from '../Utils'

/**
 * Load from api
 */
export const LoadRequest = async ({
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
    path: ApiEndpoints.LoadRequest,
    jsonData,
    loading,
    params: { page, perPage },
    success: (e) => {
      dispatch(requestLoad(e?.payload))
      success(e)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addRequest = async ({
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
    path: ApiEndpoints.addRequest,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(requestSave([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const updateRequest = async ({
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
    path: ApiEndpoints.updateRequest + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      dispatch(requestUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}

export const approveRequest = async ({
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
    method: 'post',
    path: ApiEndpoints.requestApprove + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      dispatch(reqStatus(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteRequest = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.deleteRequest + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(requestDelete(id))
      success(true)
    },
    error: (e) => {
      error(true)
    }
  })
}
