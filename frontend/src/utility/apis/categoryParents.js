import { parentCategoryLoad } from '../../redux/reducers/categoriesParent'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast } from '../Utils'
/**
 * Load from api
 */
export const loadCategoriesParent = async ({
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
    path: ApiEndpoints.loadCategoryParents,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(parentCategoryLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
