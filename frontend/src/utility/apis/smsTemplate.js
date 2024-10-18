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
  emailTemplateDelete,
  emailTemplateLoad,
  emailTemplateSave,
  emailTemplateUpdate
} from '../../redux/reducers/emailTemplate'
import {
  emergencyContactDelete,
  emergencyContactLoad,
  emergencyContactSave,
  emergencyContactUpdate
} from '../../redux/reducers/emergencyContact'
import {
  smsTemplateDelete,
  smsTemplateLoad,
  smsTemplateSave,
  smsTemplateUpdate
} from '../../redux/reducers/smsTemplate'

import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadSmsTemplate = async ({
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
    path: ApiEndpoints.load_sms_template,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(smsTemplateLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewSmsTemplate = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.view_sms_template + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const addSmsTemplate = async ({
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
    path: ApiEndpoints.add_sms_template,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(smsTemplateSave([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editSmsTemplate = async ({
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
    path: ApiEndpoints.edit_sms_template + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(smsTemplateUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteSmsTemplate = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_sms_template + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(smsTemplateDelete(id))
      success(true)
    },
    error: () => {
      error(true)
    }
  })
}
