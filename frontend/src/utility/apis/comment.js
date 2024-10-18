import { activitySave, activityUpdate } from '../../redux/reducers/activity'
import {
  delCatTypes,
  loadCatTypes,
  saveCatTypes,
  updateCatTypes
} from '../../redux/reducers/categoriesTypes'
import {
  deleteComment,
  loadComment,
  saveComment,
  updateComment
} from '../../redux/reducers/comment'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast } from '../Utils'
/**
 * Load from api
 */
export const loadComments = async ({
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
    path: ApiEndpoints.load_comment,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(loadComment(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addComments = async ({
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
    path: ApiEndpoints.add_comment,
    jsonData,
    showErrorToast: true,
    showSuccessToast: true,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(saveComment([{ ...data.payload }]))
      dispatch(
        activityUpdate({
          id: jsonData?.source_id,
          comments_count: data?.payload?.total_comment
        })
      )
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editComments = async ({
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
    path: ApiEndpoints.edit_comment + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(updateComment(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteComments = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_comment + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(deleteComment(id))
      success(true)
    },
    error: () => {
      error(true)
    }
  })
}
