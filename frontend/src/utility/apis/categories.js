import {
  delCategories,
  delCatTypes,
  loadCategories,
  loadCatTypes,
  loadChildList,
  loadSubCategories,
  saveCategories,
  saveCatTypes,
  updateCategories,
  updateCatTypes
} from '../../redux/reducers/categories'

import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const categoriesLoad = async ({
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
      dispatch(loadCategories(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

// export const subCategoriesList = async ({ async = false, jsonData, loading, page, perPage, dispatch = () => { }, success = () => { } }) => {
//     return http.request({
//         async,
//         method: "post",
//         path: ApiEndpoints.categories_child,
//         jsonData,
//         loading,
//         params: { page, perPage },
//         success: (data) => {
//             dispatch(loadSubCategories(data?.payload))
//             success(data)
//         },
//         error: () => { /** ErrorToast("data-fetch-failed") **/ }
//     })
// }

export const categoryChildList = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {}
}) => {
  // console.log('hola-----------------', {
  //     async,
  //     method: "post",
  //     path: ApiEndpoints.categories_child,
  //     jsonData,
  //     loading,
  //     params: { page, perPage },
  //     success: (data) => { dispatch(subCategoriesLoad(data?.payload)); success(data) },
  //     error: () => { /** ErrorToast("data-fetch-failed") **/ }
  // })
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.categories_child,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(loadSubCategories(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const categoriesSave = async ({
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
    path: ApiEndpoints.saveCategory,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(saveCategories([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const categoriesEdit = async ({
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
    path: ApiEndpoints.editCategory + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(updateCategories(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const categoriesDelete = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.deleteCategoryById + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      success(id)
      emitAlertStatus('success', null, `cate-${id}`)
    },
    error: () => {
      error(true)
      emitAlertStatus('failed', null, `cate-${id}`)
    }
  })
}
