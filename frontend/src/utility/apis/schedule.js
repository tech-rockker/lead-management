import {
  scheduleDelete,
  scheduleLoad,
  scheduleReports,
  scheduleSave,
  scheduleUpdate
} from '../../redux/reducers/schedule'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadSchedule = async ({
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
    path: ApiEndpoints.schedule_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(scheduleLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const loadScheduleList = async ({
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
    path: ApiEndpoints.schedule_list_2,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(scheduleLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const loadScheduleData = async ({
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
    path: ApiEndpoints.get_schedules_data,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      success(data?.payload)
    },
    error: (e) => {
      error(e)
    }
  })
}
export const loadScheduleDataPatient = async ({
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
    path: ApiEndpoints.get_schedules_data_patient,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      success(data?.payload)
    },
    error: (e) => {
      error(e)
    }
  })
}

export const loadScReports = async ({
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
    path: ApiEndpoints.schedule_reports,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      //dispatch(scheduleReports(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const loadScheduleStats = async ({
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
    path: ApiEndpoints.schedule_stats,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const loadScheduleFilter = async ({
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
    path: ApiEndpoints.schedule_filter,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      // dispatch(scheduleLoad(data?.payload))
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const viewSchedule = async ({ async = false, id, loading, success = () => {} }) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.schedule_view + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const addSchedule = async ({
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
    path: ApiEndpoints.schedule_add,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(scheduleSave(data?.payload))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const editSchedule = async ({
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
    path: ApiEndpoints.schedule_edit + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(scheduleUpdate(data?.payload))
      success(data)
    },
    error: () => {}
  })
}
export const deleteSchedule = ({
  id,
  loading,
  dispatch = () => {},
  jsonData,
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.schedule_delete + id,
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

export const printScheduleEmpBased = async ({ loading, success = () => {}, jsonData }) => {
  http.request({
    jsonData,
    method: 'post',
    path: ApiEndpoints.schedule_export_emp_based,
    loading,
    success: (data) => {
      window.open(data?.payload?.url, '_blank')
      emitAlertStatus('success')
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const printSchedulePatientBased = async ({ loading, success = () => {}, jsonData }) => {
  http.request({
    jsonData,
    method: 'post',
    path: ApiEndpoints.schedule_export_patient_based,
    loading,
    success: (data) => {
      window.open(data?.payload?.url, '_blank')
      emitAlertStatus('success')
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
