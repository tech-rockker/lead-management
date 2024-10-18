//
import { patientCashierLoad, patientCashierSave } from '../../redux/reducers/patientCashiers.js'
import { log } from '../helpers/common.js'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadPatientCashier = async ({
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
    path: ApiEndpoints.load_patient_cashier,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(patientCashierLoad(data?.payload))
      log(data)
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addPatientCashier = async ({
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
    path: ApiEndpoints.add_patient_cashier,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
      dispatch(patientCashierSave([{ ...data.payload }]))
    },
    error: () => {
      error(true)
    }
  })
}

export const printCashierData = async ({
  loading,
  jsonData,
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'post',
    path: ApiEndpoints.patient_cashiers_export,
    jsonData,
    showErrorToast: true,
    showSuccessToast: true,
    showErrorToast: true,
    loading,
    success: (data) => {
      window.open(data?.payload?.url, '_blank')
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
    }
  })
}
