import {
  packagesDelete,
  packagesLoad,
  packagesSave,
  packagesUpdate,
  userPackagesLoad
} from '../../redux/reducers/packages'
import { log } from '../helpers/common'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast } from '../Utils'

// load
export const loadPackages = async ({
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
    path: ApiEndpoints.loadPackage,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(packagesLoad(data?.payload))
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
export const addPackage = ({ jsonData, loading, dispatch = () => {}, success = () => {} }) => {
  http.request({
    method: 'post',
    path: ApiEndpoints.addPackage,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(packagesSave([{ ...data.payload, status: 1 }]))
      success(data)
    }
  })
}

/**
 * Edit
 */
export const editPackage = ({ jsonData, loading, dispatch = () => {}, success = () => {} }) => {
  http.request({
    method: 'put',
    path: ApiEndpoints.editPackage + jsonData?.id,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(packagesUpdate(data.payload))
      success(data)
    }
  })
}

/**
 * Delete
 */
export const deletePackage = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.deletePackage + id,
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

export const loadPackagesUser = async ({
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
    path: ApiEndpoints.loadPackage_user,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(userPackagesLoad(data?.payload))
      log(data)
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
