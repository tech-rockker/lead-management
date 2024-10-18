import Emitter from '../Emitter'
import { isValidArray, log } from '../helpers/common'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, handleBankIdRedirect } from '../Utils'

/**
 * Load from api
 */
export const empDateWiseWork = async ({
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
    path: ApiEndpoints.employee_dateWise_work,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      // dispatch(activityLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const employeeHoursExport = ({
  loading,
  jsonData,
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'post',
    path: ApiEndpoints.employee_hours_export,
    jsonData,
    showErrorToast: true,
    showSuccessToast: true,
    showErrorToast: true,
    loading,
    success: (data) => {
      window.open(data?.payload?.url, '_blank')
    },
    error: () => {}
  })
}

export const scheduleApprove = async ({
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
    path: ApiEndpoints.schedule_approve,
    jsonData,
    loading,
    // showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      if (jsonData?.signed_method !== 'bankid') {
        emitAlertStatus('success')
      } else {
        if (isValidArray(data?.payload)) {
          let timeout = true
          handleBankIdRedirect(data?.payload)

          // echoEventScheduleCompanyApproval(() => {
          //     emitAlertStatus("success")
          //     timeout = false
          // }, { id: data?.payload[0].person_id, unique_id: data?.payload[0]?.uniqueId })
          Emitter.on('schedule-company-approval', () => {
            timeout = false
            emitAlertStatus('success')
          })

          if (timeout) {
            setTimeout(() => {
              emitAlertStatus('failed')
            }, 60000 * 4)
          }
        }
      }
      success(data)
    },
    error: (e) => {
      ErrorToast(e?.data?.message?.errorObject?.message)
      error(true)
      emitAlertStatus('failed')
    }
  })
}

export const scheduleVerify = async ({
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
    path: ApiEndpoints.schedule_verify,
    jsonData,
    loading,
    // showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      if (jsonData?.signed_method !== 'bankid') {
        emitAlertStatus('success')
      } else {
        if (isValidArray(data?.payload)) {
          let timeout = true
          handleBankIdRedirect(data?.payload)

          // echoEventScheduleEmployeeApproval(() => {
          //     emitAlertStatus("success")
          //     timeout = false
          // }, { id: data?.payload[0].person_id, unique_id: data?.payload[0]?.uniqueId })
          Emitter.on('schedule-employee-approval', () => {
            timeout = false
            emitAlertStatus('success')
          })

          if (timeout) {
            setTimeout(() => {
              emitAlertStatus('failed')
            }, 60000 * 4)
          }
        }
      }
      success(data)
    },
    error: (e) => {
      log(e)
      error(true)
      ErrorToast(e?.data?.message?.errorObject?.message)
      emitAlertStatus('failed')
    }
  })
}
