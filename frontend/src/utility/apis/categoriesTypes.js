import {
  delCatTypes,
  loadCatTypes,
  saveCatTypes,
  updateCatTypes
} from '../../redux/reducers/categoriesTypes'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast } from '../Utils'
/**
 * Load from api
 */
export const loadCategoriesTypes = async ({
  async = false,
  jsonData,
  formData,
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
    path: ApiEndpoints.loadCatTypes,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(loadCatTypes(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addCategoriesTypes = async ({
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
    path: ApiEndpoints.addCatType,
    jsonData,
    showErrorToast: true,
    showSuccessToast: true,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(saveCatTypes([{ ...data.payload, status: 1 }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editCategoriesTypes = async ({
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
    path: ApiEndpoints.editCatType + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(updateCatTypes(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteCategoriesTypes = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.deleteCatType + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(delCatTypes(id))
      success(true)
    },
    error: () => {
      error(true)
    }
  })
}
