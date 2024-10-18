import {
  activitiesDelete,
  activitiesLoad,
  activitiesSave,
  activitiesUpdate
} from '../../redux/reducers/activityClassification'
import {
  paragraphLoad,
  paragraphSave,
  paragraphUpdate,
  pargraphDelete
} from '../../redux/reducers/paragraph'
import { wordLoad, wordDelete, wordSave, wordUpdate } from '../../redux/reducers/redWord'
//
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadParagraph = async ({
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
    path: ApiEndpoints.load_paragraph,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(paragraphLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addParagraph = async ({
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
    path: ApiEndpoints.add_paragraph,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(paragraphSave([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editParagraph = async ({
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
    path: ApiEndpoints.edit_paragraph + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(paragraphUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteParagraph = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_paragraph + id,
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
