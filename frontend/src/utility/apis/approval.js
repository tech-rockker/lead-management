//
import {
  activityAction,
  activityApprove,
  activityAssignment,
  activityDelete,
  activityLoad,
  activitySave,
  activityUpdate,
  activityView
} from '../../redux/reducers/activity'
import { approvalList, approvalRequest } from '../../redux/reducers/approval'
import {
  permissionDelete,
  permissionLoad,
  permissionSave,
  permissionUpdate,
  permissionView
} from '../../redux/reducers/Permissions'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const loadApprovalList = async ({
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
    path: ApiEndpoints.approval_request_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(approvalList(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const requestApprove = async ({
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
    path: ApiEndpoints.request_for_approval,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data)
      dispatch(approvalRequest(data?.payload))
    },
    error: () => {
      error(true)
    }
  })
}
