import {
  delCategories,
  delCatTypes,
  loadCategories,
  loadCatTypes,
  loadChildList,
  loadSubCategories,
  saveCategories,
  saveCatTypes,
  updateCategories,
  updateCatTypes
} from '../../redux/reducers/categories'
import {
  emergencyContactDelete,
  emergencyContactLoad,
  emergencyContactSave,
  emergencyContactUpdate
} from '../../redux/reducers/emergencyContact'

import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadEmergencyContact = async ({
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
    path: ApiEndpoints.load_emergency_contact,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(emergencyContactLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addEmergencyContact = async ({
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
    path: ApiEndpoints.add_emergency_contact,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(emergencyContactSave([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editEmergencyContact = async ({
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
    path: ApiEndpoints.update_emergency_contact + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(emergencyContactUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteEmergencyContact = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_emergency_contact + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(emergencyContactDelete(id))
      success(true)
    },
    error: () => {
      error(true)
    }
  })
}
