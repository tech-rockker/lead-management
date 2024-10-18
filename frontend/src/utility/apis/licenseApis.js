import {
  licencesDelete,
  licensesLoad,
  licensesSave,
  licensesUpdate
} from '../../redux/reducers/license'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast } from '../Utils'

/**
 * Load from api
 */
export const loadLicense = async ({
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
    method: 'POST',
    path: ApiEndpoints.loadLicense,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(licensesLoad(data?.payload))
      success(data)
    },
    error: () => {}
  })
}

export const addLicense = async ({
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
    method: 'POST',
    path: ApiEndpoints.addLicense,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(licensesSave([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const viewLicense = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'GET',
    path: ApiEndpoints.viewLicense + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {}
  })
}

export const addCompLicense = async ({
  token,
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
    method: 'POST',
    path: ApiEndpoints.addCompLicense,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(licensesUpdate(data.payload))
      success(data)
    },
    error: () => {
      error(true)
    },
    transformRequest: [
      function (data, headers) {
        // delete auth header
        headers.Authorization = `Bearer ${token}`
        // change content type
        if (jsonData) {
          data = JSON.stringify(data)
          headers['Content-Type'] = 'application/json'
          headers['Accept'] = '*/*'
        }
        // add cors headers
        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'

        return data
      }
    ]
  })
}

export const editLicense = async ({
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
    path: ApiEndpoints.updateLicense + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(licensesUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}

export const assignLicense = async ({
  id,
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
    method: 'POST',
    path: ApiEndpoints.assignLicense + id,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(id)
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}

export const licenseStatus = ({ loading, success = () => {}, error = () => {} }) => {
  http.request({
    method: 'GET',
    path: ApiEndpoints.statusLicense,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      error(true)
    }
  })
}

export const expireLicense = async ({
  id,
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
    method: 'POST',
    path: ApiEndpoints.expireLicense + id,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(id)
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}
