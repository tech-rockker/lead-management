import {
  stamplingLoad,
  stamplingSave,
  stamplingUpdate,
  stamplingView,
  stamplingGet
} from '../../redux/reducers/stampling'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadStamp = async ({
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
    path: ApiEndpoints.stampling_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(stamplingLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewStamp = async ({ async = false, id, loading, success = () => {} }) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.stampling_view + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const getStamp = async ({ async = false, loading, success = () => {} }) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.stampling_get,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addStamp = async ({
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
    path: ApiEndpoints.stampling_add,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(stamplingSave(data?.payload))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const editStamp = async ({
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
    path: ApiEndpoints.stampling_edit + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(stamplingUpdate(data?.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteStamp = ({
  id,
  loading,
  dispatch = () => {},
  jsonData,
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.stampling_delete + id,
    jsonData,
    loading,
    SuccessToast: true,
    showErrorToast: true,
    success: () => {
      success(id)
    },
    error: () => {
      error(true)
    }
  })
}
