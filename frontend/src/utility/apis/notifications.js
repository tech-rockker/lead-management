import {
  notificationDelete,
  notificationSave,
  notificationLoad,
  notificationUpdate,
  latestNotificationLoad,
  notificationUpdateLatest,
  setUnreadNotification
} from '../../redux/reducers/notifications'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast } from '../Utils'
/**
 * Load from api
 */

export const loadNotifications = async ({
  async = false,
  jsonData,
  params,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.notification_list,
    jsonData,
    loading,
    params: { page, perPage, ...params },
    success: (data) => {
      dispatch(notificationLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const loadUnreadCount = async ({
  async = false,
  jsonData,
  params,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'get',
    path: ApiEndpoints.unread_count,
    jsonData,
    loading,
    params: { page, perPage, ...params },
    success: (data) => {
      dispatch(setUnreadNotification(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const loadLatestNotifications = async ({
  async = false,
  jsonData,
  params,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.notification_list,
    jsonData,
    loading,
    params: { page, perPage, ...params },
    success: (data) => {
      dispatch(latestNotificationLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const addNotificationCls = async ({
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
    path: ApiEndpoints.create_notification,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(notificationSave([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const deleteNotificationCls = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.deleteNotificationCls + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(notificationDelete(id))
      success(true)
    },
    error: (e) => {
      error(true)
    }
  })
}

export const readNotification = ({ id, loading, dispatch = () => {}, success = () => {} }) => {
  http.request({
    method: 'get',
    path: `${ApiEndpoints.notification_show}${id}/read`,
    loading,
    success: (data) => {
      dispatch(notificationUpdate(data?.payload))
      dispatch(notificationUpdateLatest(data?.payload))
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const readNotificationAll = ({ loading, dispatch = () => {}, success = () => {} }) => {
  http.request({
    method: 'get',
    path: `${ApiEndpoints.user_notification_read_all}`,
    loading,
    success: (data) => {
      dispatch(setUnreadNotification(0))
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

// export const notificationList = ({ id, loading, success = () => { } }) => {
//     http.request({
//         method: "get",
//         path: ApiEndpoints.notification_list,
//         loading,
//         success: (data) => { success(data?.payload) },
//         error: () => { /** ErrorToast("data-fetch-failed") **/ }
//     })
// }

export const notificationShow = ({ id, loading, dispatch = () => {}, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.notification_show + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const notificationUserDelete = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.user_notification_delete,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
