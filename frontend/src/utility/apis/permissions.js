//
import {
  permissionDelete,
  permissionLoad,
  permissionSave,
  permissionUpdate,
  permissionView
} from '../../redux/reducers/Permissions'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadPermissions = async ({
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
    path: ApiEndpoints.permissionsByType,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(permissionLoad(data.payload))
      success(data)
    },
    error: (e) => {
      /** ErrorToast("data-fetch-failed") **/ error(e)
    }
  })
}
export const loadAllPermissions = async ({
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
    path: ApiEndpoints.permissionsAll,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      success(data)
    },
    error: (e) => {
      /** ErrorToast("data-fetch-failed") **/ error(e)
    }
  })
}
export const viewPermission = async ({
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
    path: ApiEndpoints.view_permissions + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      dispatch(permissionView(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const addPermission = async ({
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
    path: ApiEndpoints.add_permissions,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(permissionSave([{ ...data?.payload, status: 1 }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}
export const addAllPermission = async ({
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
    path: ApiEndpoints.permissionsAllUpdate,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(permissionSave([{ ...data?.payload, status: 1 }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}
export const editPermission = async ({
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
    path: ApiEndpoints.edit_permissions + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(permissionUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deletePermission = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_permissions + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(permissionDelete(id))
      success(true)
    },
    error: () => {
      error(true)
    }
  })
}
