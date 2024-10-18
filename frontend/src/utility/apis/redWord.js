import {
  activitiesDelete,
  activitiesLoad,
  activitiesSave,
  activitiesUpdate
} from '../../redux/reducers/activityClassification'
import {
  wordLoad,
  wordDelete,
  wordSave,
  wordUpdate,
  wordLoadAll
} from '../../redux/reducers/redWord'
//
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadWord = async ({
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
    path: ApiEndpoints.load_redWord,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(wordLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const loadWordAll = async ({
  async = false,
  jsonData,
  loading,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.load_redWord,
    loading,
    success: (data) => {
      dispatch(wordLoadAll(data?.payload?.map((a) => a.name)))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const addWord = async ({
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
    path: ApiEndpoints.add_redWord,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(wordSave([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editWord = async ({
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
    path: ApiEndpoints.edit_redWord + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(wordUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteWord = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_redWOrd + id,
    jsonData: { id },
    loading,
    SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(wordDelete(id))
      success(true)
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}
