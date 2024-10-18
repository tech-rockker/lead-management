//
import {
  addAssignWork,
  personApproval,
  updateAssign,
  userDelete,
  userLoad,
  userSave,
  userUpdate,
  branchesUsersLoad
} from '../../redux/reducers/userManagement'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast } from '../Utils'
/**
 * Load from api
 */
export const loadUser = async ({
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
    path: ApiEndpoints.user_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(userLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const loadBranchesUsers = async ({
  async = false,
  loading,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.all_branches_users,
    loading,
    success: (data) => {
      dispatch(branchesUsersLoad(data?.payload))
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const getUsersDropdown = async ({
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
    path: ApiEndpoints.user_list,
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

export const getUsersMessages = async ({
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
    path: ApiEndpoints.get_user_message,
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

export const getUserMessages = async ({
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
    path: ApiEndpoints.get_messages,
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

export const viewUser = async ({ async = false, id, loading, success = () => {} }) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.view_user + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const addUser = async ({
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
    path: ApiEndpoints.add_user,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(userSave([{ ...data?.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const personApprovalAdd = async ({
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
    path: ApiEndpoints.person_approval,
    jsonData,
    loading,
    // showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(personApproval([{ ...data?.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const editUser = async ({
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
    path: ApiEndpoints.edit_user + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(userUpdate(data.payload))
      success(data)
    },
    error: () => {}
  })
}

export const deleteUser = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_user + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
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

export const deletePersonApi = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.person + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      success(true)
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}

export const importPatient = async ({
  async = false,
  formData,
  loading,
  page,
  perPage,
  error = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.importPatient,
    formData,
    showErrorToast: true,
    loading,
    params: { page, perPage },
    success: (data) => {
      success(data?.message)
    },
    error: (e) => {
      error(e)
    }
  })
}

export const getSampleFile = ({ loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.getSampleFile,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const assignWorking = async ({
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
    path: ApiEndpoints.assign_working + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(updateAssign(data.payload))
      success(data)
    },
    error: () => {}
  })
}

export const addAssignWorking = async ({
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
    path: ApiEndpoints.add_assign_work,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(addAssignWork(data.payload))
      success(data)
    },
    error: () => {}
  })
}

export const assignEmpToBranch = async ({
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
    path: ApiEndpoints.assign_emp_to_branch,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {}
  })
}

export const assignedEmpToBranchs = async ({
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
    path: ApiEndpoints.assigned_emp_to_branch,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    // showSuccessToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {}
  })
}

export const switchBranch = async ({
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
    path: ApiEndpoints.switch_branch,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {}
  })
}

export const assignedBranchToEmp = async ({
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
    path: ApiEndpoints.assigned_branch_to_emp,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    // showSuccessToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {}
  })
}
