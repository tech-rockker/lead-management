//
import { bankDelete, bankLoad, bankSave, bankUpdate, bankView } from '../../redux/reducers/bank'

import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadBank = async ({
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
    path: ApiEndpoints.bank_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(bankLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewBank = async ({
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
    path: ApiEndpoints.view_bank + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      dispatch(bankView(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const addBank = async ({
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
    path: ApiEndpoints.add_bank,
    jsonData,
    loading,
    params: { page, perPage },
    showSuccessToast: true,
    showErrorToast: true,
    success: (data) => {
      dispatch(bankSave([(data = { ...data?.payload })]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editBank = async ({
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
    path: ApiEndpoints.edit_bank + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(bankUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteBank = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_bank + id,
    jsonData: { id },
    loading,
    showSuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(bankDelete(id))
      success(true)
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}
