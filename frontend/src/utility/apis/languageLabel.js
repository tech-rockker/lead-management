import {
  deleteLangLabel,
  deleteLanguage,
  getLanguage,
  getLanguages,
  importLanguage,
  loadLangLabel,
  saveLangLabel,
  updateLangLabel,
  updateLanguage
} from '../../redux/reducers/languageLabel'

import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, SuccessToast } from '../Utils'
/**
 * Load from api
 */
export const languageLabelLoad = async ({
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
    path: ApiEndpoints?.lang_label_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(loadLangLabel(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const languageListGet = async ({
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
    path: ApiEndpoints?.get_language,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(getLanguage(data?.payload))
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

export const languageLabelSave = async ({
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
    path: ApiEndpoints?.lang_label_add,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(saveLangLabel([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const language_Import = async ({
  id,
  async = false,
  formData,
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
    path: ApiEndpoints?.import_language,
    formData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(importLanguage([{ ...data.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const languageLabelEdit = async ({
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
    path: ApiEndpoints.lang_label_edit + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(updateLangLabel(data.payload))
      success(data)
    },
    error: () => {}
  })
}

export const languageEdit = async ({
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
    path: ApiEndpoints.edit_language + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(updateLanguage(data.payload))
      success(data)
    },
    error: () => {}
  })
}
export const languageLabelDelete = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.lang_label_delete + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      dispatch(deleteLangLabel(id))
      success(true)
    },
    error: () => {
      error(true)
    }
  })
}

export const languageDelete = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'delete',
    path: ApiEndpoints.delete_language + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      // dispatch(deleteLanguage(id));
      success(true)
      emitAlertStatus('success')
    },
    error: () => {
      error(true)
      emitAlertStatus('failed')
    }
  })
}

export const getSamplelanguage = ({ loading, success = () => {} }) => {
  http.request({
    method: 'post',
    path: ApiEndpoints.language_sample_export,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const getAllLanguage = async ({
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
    path: ApiEndpoints?.getAllLanguage,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(getLanguages(data?.payload))
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
