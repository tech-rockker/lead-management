//
import {
  trashedActivityDeleteX,
  trashedActivityLoad,
  trashedActivityRestore
} from '../../redux/reducers/activitytrashed'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadTrashedActivity = async ({
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
    path: ApiEndpoints.trashed_activity_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(trashedActivityLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const activityRestore = ({ id, loading, dispatch = () => {}, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.restore_trashed + id,
    loading,
    success: (data) => {
      // dispatch(trashedActivityDelete(data?.payload))
      success(data?.payload)
      emitAlertStatus('success')
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
      emitAlertStatus('failed')
    }
  })
}

export const deleteTrashedActivity = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.trashed_activity_delete + id,
    jsonData: { id },
    loading,
    SuccessToast: true,
    showErrorToast: true,
    success: () => {
      success(true)
      emitAlertStatus('success', null, `${id}-trashed`)
    },
    error: () => {
      error(true)
      emitAlertStatus('failed', null, `${id}-trashed`)
    }
  })
}
