//

import {
  taskActionUpdate,
  taskDelete,
  taskLoad,
  taskSave,
  taskUpdate
} from '../../redux/reducers/task'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadTask = async ({
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
    path: ApiEndpoints.load_task,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(taskLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewTask = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.view_task + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const addTask = async ({
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
    path: ApiEndpoints.add_task,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(taskSave([{ ...data?.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editTask = async ({
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
    path: ApiEndpoints.edit_task + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(taskUpdate({ ...data.payload[0], orgId: id }))
      success(data)
    },
    error: () => {}
  })
}
export const deleteTask = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_task + id,
    jsonData: { id },
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

export const actionTask = async ({
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
    path: ApiEndpoints.action_task,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(taskActionUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
