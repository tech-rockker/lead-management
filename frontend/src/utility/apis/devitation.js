//
import {
  devitationAssignment,
  devitationDelete,
  devitationLoad,
  devitationSave,
  devitationStatss,
  devitationUpdate
} from '../../redux/reducers/devitation'
import Emitter from '../Emitter'
import { isValidArray, log } from '../helpers/common'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, handleBankIdRedirect } from '../Utils'
/**
 * Load from api
 */
export const loadDevitation = async ({
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
    path: ApiEndpoints.devitation_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(devitationLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadMonthWiseDeviation = async ({
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
    path: ApiEndpoints.get_month_wise_deviation,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewDevitation = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.view_devitation + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const addDevitation = async ({
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
    path: ApiEndpoints.add_devitation,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(devitationSave([data?.payload]))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const assignDevitation = async ({
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
    path: ApiEndpoints.assign_devitation,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(devitationAssignment([{ ...data?.payload?.activity }]))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}
export const tagDevitation = async ({
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
    path: ApiEndpoints.tag_devitation,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(devitationAssignment([{ ...data?.payload?.activity }]))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const addDevitationAction = async ({
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
    path: ApiEndpoints.devitation_action,
    jsonData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      if (jsonData?.signed_method !== 'bankid') {
        emitAlertStatus('success', null, `deviation-event-${jsonData?.id}`)
      } else {
        if (isValidArray(data?.payload)) {
          let timeout = true
          handleBankIdRedirect(data?.payload)

          // echoEventDeviationApproval(() => {
          //     emitAlertStatus("success")
          //     timeout = false
          // }, { id: data?.payload[0].person_id, unique_id: data?.payload[0]?.uniqueId })
          Emitter.on('deviation-approval', () => {
            timeout = false
            emitAlertStatus('success', null, `deviation-event-${jsonData?.id}`)
            log(timeout)
          })

          if (timeout) {
            setTimeout(() => {
              emitAlertStatus('failed', null, `deviation-event-${jsonData?.id}`)
            }, 60000 * 4)
          }
        }
      }
    },
    error: (e) => {
      ErrorToast(e?.data?.message?.errorObject?.message)
      emitAlertStatus('failed', null, `deviation-event-${jsonData?.id}`)
      error(true)
    }
  })
}

export const printDevitation = async ({ id, loading, success = () => {} }) => {
  http.request({
    id,
    method: 'get',
    path: ApiEndpoints.print_devitation + id,
    loading,
    success: (data) => {
      window.open(data?.payload, '_blank')
      emitAlertStatus('success')
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const editDevitation = async ({
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
    path: ApiEndpoints.edit_devitation + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(devitationUpdate(data?.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteDevitation = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'DELETE',
    path: ApiEndpoints.delete_devitation + id,
    jsonData: { id },
    loading,
    SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(devitationDelete(id))
      success(true)
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}

export const devitationStats = async ({
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
    path: ApiEndpoints.devitation_stats,
    jsonData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(devitationStatss(data?.payload))
      success(data)
    },
    // success: (data) => { dispatch(activityAction([{ ...data?.payload }])); success(data) },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const timeReportDeviation = async ({
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
    method: 'Post',
    path: ApiEndpoints.timeReportdeviation,
    jsonData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      error(true)
    }
  })
}

export const printDeviation = async ({
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
    method: 'Post',
    path: ApiEndpoints.print_devitation,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      window.open(data?.payload, '_blank')
      emitAlertStatus('success')
    },

    error: () => {
      error(true)
    }
  })
}
