//
import {
  activityDelete,
  activityLoad,
  activitySave,
  activityUpdate,
  activityView
} from '../../redux/reducers/activity'
import {
  permissionDelete,
  permissionLoad,
  permissionSave,
  permissionUpdate,
  permissionView
} from '../../redux/reducers/Permissions'
import { roleDelete, roleLoad, roleSave, roleUpdate, roleView } from '../../redux/reducers/roles'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadRole = async ({
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
    path: ApiEndpoints.role_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(roleLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewRole = async ({
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
    path: ApiEndpoints.view_role + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      dispatch(roleView(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const addRole = async ({
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
    path: ApiEndpoints.add_role,
    jsonData,
    loading,
    params: { page, perPage },
    showSuccessToast: true,
    showErrorToast: true,
    success: (data) => {
      dispatch(roleSave([{ ...data?.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editRole = async ({
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
    path: ApiEndpoints.edit_role + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(roleUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteRole = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_role + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(roleDelete(id))
      success(true)
    },
    error: () => {
      error(true)
    }
  })
}
