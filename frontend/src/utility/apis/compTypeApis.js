import {
  companyTypeDelete,
  companyTypeSave,
  companyTypesLoad,
  companyTypeUpdate
} from '../../redux/reducers/companiesTypes'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast, SuccessToast } from '../Utils'

/////////////////// Company Types //////////////////////////
/**
 * Load company types from api
 */
export const loadCompanyType = async ({
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
    path: ApiEndpoints.loadCompTypes,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(companyTypesLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

/**
 * Save new company type to DB.
 */
export const saveNewComp = ({ jsonData, loading, dispatch = () => {}, success = () => {} }) => {
  http.request({
    method: 'post',
    path: ApiEndpoints.saveNewCompType,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      {
        dispatch(companyTypeSave([{ ...data.payload }]))
        success(data)
      }
      SuccessToast('data-saved')
      success(data)
    }
  })
}
/**
 * Edit company type.
 */
export const editCompType = ({
  id,
  jsonData,
  loading,
  dispatch = () => {},
  success = () => {}
}) => {
  http.request({
    method: 'put',
    path: ApiEndpoints.updateCompType + id,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(companyTypeUpdate(data.payload))
      success(data)
    }
  })
}
/**
 * Delete Comp Type By Id
 * @param {*} param0
 */
export const deleteCompTypeId = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.deleteCompType + id,
    loading,
    showErrorToast: true,
    success: () => {
      dispatch(companyTypeDelete(id))
      success(true)
    }
  })
}
