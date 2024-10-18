import {
  activitiesDelete,
  activitiesLoad,
  activitiesSave,
  activitiesUpdate
} from '../../redux/reducers/activityClassification'
//
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadActivityCls = async ({
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
    path: ApiEndpoints.loadActivityCls,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      success(data)
      dispatch(activitiesLoad(data?.payload))
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addActivityCls = async ({
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
    path: ApiEndpoints.addActivityCls,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
      dispatch(activitiesSave([{ ...data.payload, status: 1 }]))
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editActivityCls = async ({
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
    path: ApiEndpoints.editActivityCls + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      success(data)
      dispatch(activitiesUpdate(data.payload))
    },
    error: () => {}
  })
}
export const deleteActivityCls = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.deleteActivityCls + id,
    jsonData: { id },
    loading,
    SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(activitiesDelete(id))
      success(true)
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}
