import {
  companiesDelete,
  companiesLoad,
  companiesSave,
  companiesUpdate,
  companyStats,
  updateProfile
} from '../../redux/reducers/companies'
import authReducer from '../../redux/reducers/auth'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast } from '../Utils'
import { log } from '../helpers/common'

/**
 * Load from api
 */
export const loadComp = async ({
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
    path: ApiEndpoints.loadComp,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      log('uhsaudashdasu', data)
      dispatch(companiesLoad(data?.payload))
      success(data)
    },
    error: (e) => {
      log('awewa e wawa ', e) /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const viewComp = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.viewComp + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addComp = ({
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'post',
    path: ApiEndpoints.addComp,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(companiesSave([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}
export const updateUserProfile = ({
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'post',
    path: ApiEndpoints.update_profile,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editComp = async ({
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
    path: ApiEndpoints.editComp + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(companiesUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteComp = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.deleteComp + id,
    jsonData: { id },
    loading,
    SuccessToast: true,
    showErrorToast: true,
    success: () => {
      success(id)
      emitAlertStatus('success')
    },
    error: (e) => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}

export const compStats = async ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  log('id', id)
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.compStats + id,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(companyStats(data?.payload))
      success(data)
    },
    error: (e) => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadCompOnly = async ({
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
    path: ApiEndpoints.load_comp_only,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      log('uhsaudashdasu', data)
      dispatch(companiesLoad(data?.payload))
      success(data)
    },
    error: (e) => {
      log('awewa e wawa ', e) /** ErrorToast("data-fetch-failed") **/
    }
  })
}
