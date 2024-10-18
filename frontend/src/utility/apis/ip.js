//
import {
  ipAssigneToEmpSave,
  ipAssignLoad,
  ipEditHistory,
  patientPersonsLoad,
  patientPlanDelete,
  patientPlanLoad,
  patientPlanSave,
  patientPlanUpdate,
  patientPlanView
} from '../../redux/reducers/ip'
import { ipTemplateLoad } from '../../redux/reducers/ipTemplates'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus } from '../Utils'
/**
 * Load from api
 */
export const loadPatientPlanList = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.patient_plan_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(patientPlanLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadPersonList = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.patient_person_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(patientPersonsLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadIpTemplates = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.ip_templates,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(ipTemplateLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const ipHistoryEdit = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.ip_edit_history,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(ipEditHistory(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const ipFollowupsPrint = async ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    method: 'post',
    path: ApiEndpoints.ip_followups_print + id,
    loading,
    success: (data) => {
      window.open(data?.payload?.url, '_blank')
      emitAlertStatus('success')
    },
    error: () => {
      emitAlertStatus('failed')
    }
  })
}
export const ipPrint = async ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    method: 'post',
    path: ApiEndpoints.ip_print + id,
    loading,
    success: (data) => {
      emitAlertStatus('success')
      window.open(data?.payload?.url, '_blank')
    },
    error: () => {
      emitAlertStatus('failed')
    }
  })
}
export const loadIpAssign = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.view_ip_assign,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(ipAssignLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const loadApprovedPatientPlan = async ({
  error = () => { },
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.approved_patient_plan,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(
        patientPlanUpdate({
          ...data?.payload
        })
      )
      success(data)
      emitAlertStatus('success', data?.payload)
    },
    error: (e) => {
      error(e)
      emitAlertStatus('failed')
    }
  })
}

export const viewPatientPlan = async ({
  params = {},
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.view_patient_plan + id,
    jsonData,
    loading,
    params: { page, perPage, ...params },
    showErrorToast: true,
    success: (data) => {
      dispatch(patientPlanView((data = data?.payload)))
      success(data)
    },
    error: () => { }
  })
}
export const addPatientPlan = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { },
  error = () => { }
}) => {
  return http.request({
    async,
    method: 'post',
    noEntryMode: true,
    path: `${ApiEndpoints.add_patient_plan}`,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(patientPlanSave(data?.payload))
      success(data)
    }
    // error: () => { /** ErrorToast("data-fetch-failed") **/; error(true) }
  })
}

export const addIpAssignToEmp = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { },
  error = () => { }
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.ip_assign_to_employee,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(ipAssigneToEmpSave([{ ...data?.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editPatientPlan = async ({
  id,
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => { },
  success = () => { }
}) => {
  return http.request({
    async,
    method: 'put',
    path: ApiEndpoints.edit_patient_plan + id,
    jsonData,
    noEntryMode: true,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(
        patientPlanUpdate({
          ...data?.payload,
          id
        })
      )
      success(data)
    },
    error: () => { }
  })
}
export const deletePatientPlan = ({
  id,
  loading,
  dispatch = () => { },
  success = () => { },
  error = () => { }
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_patient_plan + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(patientPlanDelete(id))
      success(true)
      emitAlertStatus('success', null, `delete-${id}`)
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}

export const completeIp = async ({
  async = false,
  dispatch = () => { },
  jsonData,
  loading,
  page,
  perPage,
  error = () => { },
  success = () => { }
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.completeIp,
    jsonData,
    showSuccessToast: true,
    showErrorToast: true,
    loading,
    params: { page, perPage },
    // success: (data) => { success(data?.payload) },
    success: (data) => {
      dispatch(
        patientPlanUpdate({
          ...data?.payload,
          status: parseInt(data?.payload?.status)
        })
      )
      success(data?.payload)
    },
    error: (e) => {
      error(e)
    }
  })
}
