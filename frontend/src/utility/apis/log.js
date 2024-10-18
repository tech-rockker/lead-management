import { bankLoad } from '../../redux/reducers/bank'
import {
  activityLogLoad,
  activityLogView,
  fileAccessLoad,
  smsLoad
} from '../../redux/reducers/logs'
import { log } from '../helpers/common'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'

export const activityLog = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  success = () => {},
  dispatch = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.activityLog,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(activityLogLoad(data?.payload))
      log(data)
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const bankIDLog = async ({
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
    path: ApiEndpoints.bankIDLog,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(bankLoad(data?.payload))
      log(data)
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const smsLog = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  success = () => {},
  dispatch = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.smsLog,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(smsLoad(data?.payload))
      log(data)
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const getActivityLog = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.getActivityLog + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const fetchOnlyActivityLog = ({ id, dispatch = () => {}, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.fetchOnlyActivityLog + id, //unique activity id log details
    loading,
    success: (data) => {
      dispatch(activityLogLoad((data = data?.payload)))
      success(data)
    },
    error: () => {
      // ErrorToast('data-fetch-failed')
    }
  })
}

export const fileLog = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  success = () => {},
  dispatch = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.fileLog,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(fileAccessLoad(data?.payload))
      log(data)
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const fileLogHistory = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  success = () => {},
  dispatch = () => {}
}) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.fileLogList,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(fileAccessLoad(data?.payload))
      log(data)
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
