import {
  userTypesDelete,
  userTypesLoad,
  userTypesSave,
  userTypesUpdate
} from '../../redux/reducers/user-types'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast } from '../Utils'

/**
 * Load from api
 */
export const loadUserTypes = async ({
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
    path: ApiEndpoints.loadUserTypes,
    jsonData,
    loading,
    params: { page, perPage, ...jsonData },
    success: (data) => {
      dispatch(userTypesLoad({ data: data?.payload }))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addUserTypes = async ({
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
    path: ApiEndpoints.addUserTypes,
    jsonData,
    loading,
    showSuccessToast: true,
    showErrorToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(userTypesSave([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editUserTypes = async ({
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
    path: ApiEndpoints.updateUserTypes + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showErrorToast: true,
    success: (data) => {
      dispatch(userTypesUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteUserTypes = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.deleteUserTypes + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(userTypesDelete(id))
      success(true)
    },
    error: (e) => {
      error(true)
    }
  })
}
