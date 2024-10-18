//
import {
  shiftAssignToEmployee,
  workshiftDelete,
  workShiftSave,
  workShiftUpdate,
  viewEmployeeList,
  viewWorkShift,
  workShiftLoad,
  viewAssignShift
} from '../../redux/reducers/companyWorkShift'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadWorkShift = async ({
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
    path: ApiEndpoints.work_shift_list,
    jsonData,
    loading,

    params: { page, perPage },
    success: (data) => {
      dispatch(workShiftLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadAssignShift = async ({
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
    path: ApiEndpoints.view_assign_shift,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(viewAssignShift(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
// export const workShiftView = async ({ id, async = false, jsonData, loading, page, perPage, dispatch = () => { }, success = () => { } }) => {
//     return http.request({
//         async,
//         method: "get",
//         path: ApiEndpoints.view_work_shift + id,
//         jsonData,
//         loading,
//         params: { page, perPage },
//         showErrorToast: true,
//         success: (data) => { dispatch(viewWorkShift(data.payload)); success(data) },
//         error: () => { }
//     })
// }

export const workShiftView = async ({ async = false, id, loading, success = () => {} }) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.view_work_shift + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const employeeListView = async ({
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
    path: ApiEndpoints.employee_list + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      dispatch(viewEmployeeList(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const addWorkShift = async ({
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
    path: ApiEndpoints.add_work_shift,
    jsonData,
    loading,
    showErrorToast: false,
    showSuccessToast: false,
    params: { page, perPage },
    success: (data) => {
      dispatch(workShiftSave([{ ...data?.payload }]))
      success(data)
    },

    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}
export const addshiftAssignToEmployee = async ({
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
    path: ApiEndpoints.shift_assign_to_employee,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(shiftAssignToEmployee([{ ...data?.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editWorkShift = async ({
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
    path: ApiEndpoints.edit_work_shift + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    // showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(workShiftUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteWorkShift = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_work_shift + id,
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
