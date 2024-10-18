import {
  packagesDelete,
  packagesLoad,
  packagesSave,
  packagesUpdate
} from '../../redux/reducers/packages'
import {
  questionDelete,
  questionLoad,
  questionSave,
  questionUpdate
} from '../../redux/reducers/questions'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast } from '../Utils'

// load
export const loadQuestion = async ({
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
    path: ApiEndpoints.load_question,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(questionLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

/**
 * Save
 */
export const addQuestion = ({ jsonData, loading, dispatch = () => {}, success = () => {} }) => {
  http.request({
    method: 'post',
    path: ApiEndpoints.add_question,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(questionSave([{ ...data.payload }]))
      success(data)
    }
  })
}

/**
 * Edit
 */
export const editQuestion = ({ jsonData, loading, dispatch = () => {}, success = () => {} }) => {
  http.request({
    method: 'put',
    path: ApiEndpoints.edit_question + jsonData?.id,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(questionUpdate(data.payload))
      success(data)
    }
  })
}

/**
 * Delete
 */
export const deleteQuestion = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_Question + id,
    loading,
    showErrorToast: true,
    success: () => {
      dispatch(questionDelete(id))
      success(true)
    }
  })
}
