import { dashboardLoad } from '../../redux/reducers/dashboard'
import { log } from '../helpers/common'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'

// export const dashboardDetails = ({ loading, dispatch = () => { },  success = () => { } }) => {
//     http.request({
//         method: "get",
//         path: ApiEndpoints.dashboardDetails,
//         loading,
//         success: (data) => { dispatch(dashboardLoad(data?.payload)); success(data) },
//         error: () => { /** ErrorToast("data-fetch-failed") **/ }
//     })
// }

export const dashboardDetails = async ({
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
    method: 'get',
    path: ApiEndpoints.dashboardDetails,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(dashboardLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const acceptTerms = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  success = () => {}
}) => {
  return http.request({
    async,
    method: 'Post',
    path: ApiEndpoints.acceptTerms,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      // dispatch(dashboardLoad(data?.payload))
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
