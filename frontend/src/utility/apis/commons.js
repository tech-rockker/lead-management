//
import {
  agenciesListLoad,
  changePassword,
  patientTypeList,
  userDetail,
  userTypeList
} from '../../redux/reducers/common'
import {
  uploadFile,
  uploadFileList,
  uploadFileListUser,
  updateFileListUser,
  FileListUserBookmarks,
  signingFileData
} from '../../redux/reducers/fileupload'
import { viewFolder, uploadFolder, folderUpdate } from '../../redux/reducers/folderUpload'
import { packageUpdate } from '../../redux/reducers/package'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, handleBankIdRedirect } from '../Utils'
import { isValidArray, log } from '../helpers/common'
import Emitter from '../Emitter'
/**
 * Load from api
 */
export const userTypeListLoad = async ({
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
    path: ApiEndpoints.user_type_list,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(userTypeList(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const patientTypeListLoad = async ({
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
    path: ApiEndpoints.patient_types,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(patientTypeList(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const patientApprovalHours = async ({
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
    path: ApiEndpoints.patient_completed_hours,
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

export const agenciesList = async ({
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
    path: ApiEndpoints.agency_list,
    jsonData,
    loading,
    showErrorToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(agenciesListLoad(data?.payload))
      success(data)
    }
    // error: () => { /** ErrorToast("data-fetch-failed") **/ }
  })
}

export const userDetailsLoad = async ({
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
    path: ApiEndpoints.user_detail,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(userDetail(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}
export const countryListLoad = async ({
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
    path: ApiEndpoints.country_list,
    loading,
    jsonData,
    params: { page, perPage },
    success: (data) => {
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const changePasswordSave = async ({
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
    path: ApiEndpoints.change_password,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      dispatch(changePassword([{ ...data?.payload }]))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/ error(true)
    }
  })
}

export const loadGroupQuestions = async ({
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
    method: 'POST',
    path: ApiEndpoints.questions,
    jsonData,
    loading,
    // params: { page, perPage },
    success: (data) => {
      success(data)
    },
    error: (e) => {
      /** ErrorToast("data-fetch-failed") **/ error(e)
    }
  })
}

export const uploadFiles = async ({
  controller = new AbortController(),
  progress = () => {},
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
    method: 'POST',
    path: ApiEndpoints.uploadFiles,
    formData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    success: (data) => {
      dispatch(uploadFile([{ ...data?.payload }]))
      success(data)
    },
    error: () => {
      error(true)
    },
    onUploadProgress: (progressEvent) => {
      progress((progressEvent.loaded / progressEvent.total) * 100)
    },
    signal: controller.signal
  })
}

export const createFolder = async ({
  async = false,
  folderName,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'POST',
    path: ApiEndpoints.createFolder,
    params: { name: folderName },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(uploadFolder([{ ...data?.payload }]))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const loadFolders = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  search_key,
  dispatch = () => {},
  success = () => {},
  is_bookmark
}) => {
  return http.request({
    async,
    method: 'POST',
    path: ApiEndpoints.loadFolders,
    jsonData,
    loading,
    params: { page, perPage, search_key, is_bookmark },
    success: (data) => {
      dispatch(viewFolder(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const editFolder = async ({
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
    method: 'PUT',
    path: ApiEndpoints.updateFolder + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(folderUpdate(data?.payload))
      success(data)
    },
    error: () => {}
  })
}

export const deleteFolder = ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  http.request({
    method: 'DELETE',
    id,
    path: ApiEndpoints.deleteFolder + id,
    jsonData: { id },
    loading,
    // SuccessToast: true,
    showErrorToast: true,
    success: () => {
      success(true)
      emitAlertStatus('success', null, `${id}-folders`)
    },
    error: () => {
      error(true)
      emitAlertStatus('failed', null, `${id}-folders`)
    }
  })
}

export const uploadFilesList = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {},
  folder_id = null,
  is_bookmark
}) => {
  return http.request({
    async,
    method: 'POST',
    path: ApiEndpoints.uploadFilesList,
    jsonData,
    loading,
    params: { page, perPage, folder_id, is_bookmark },
    showErrorToast: true,
    success: (data) => {
      dispatch(uploadFileList(data?.payload))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const deleteFiles = async ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    method: 'DELETE',
    path: ApiEndpoints.deleteFiles + id,
    jsonData: { id },
    loading,
    showErrorToast: true,
    success: () => {
      // dispatch(deleteFile(id));
      success(true)
      emitAlertStatus('success', null, `${id}-files`)
    },
    error: () => {
      error(true)
      emitAlertStatus('failed', null, `${id}-files`)
    }
  })
}

export const uploadFilesListUser = async ({
  async = false,
  jsonData,
  loading,
  page,
  perPage,
  dispatch = () => {},
  success = () => {},
  error = () => {},
  folder_id,
  is_bookmark,
  search_key
}) => {
  return http.request({
    async,
    method: 'POST',
    path: ApiEndpoints.uploadFilesListUser,
    jsonData,
    loading,
    params: { page, perPage, folder_id, is_bookmark, search_key },
    showErrorToast: true,
    success: (data) => {
      dispatch(uploadFileListUser(data?.payload))
      dispatch(FileListUserBookmarks(data?.payload))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const deleteFilesUser = async ({
  id,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    method: 'DELETE',
    id,
    path: ApiEndpoints.deleteFilesUser + id,
    jsonData: { id },
    loading,
    showErrorToast: true,
    success: () => {
      // dispatch(deleteFileUser(id));
      success(true)
      emitAlertStatus('success', null, `${id}-files`)
    },
    error: () => {
      error(true)
      emitAlertStatus('failed', null, `${id}-files`)
    }
  })
}

export const moveFilesUserToFolder = async ({
  async = false,
  jsonData,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {},
  file_id,
  folder_id
}) => {
  return http.request({
    async,
    method: 'POST',
    path: ApiEndpoints.moveFilesUserToFolder,
    jsonData,
    loading,
    params: { file_id, folder_id },
    showErrorToast: true,
    success: (data) => {
      // dispatch(updateFileListUser({ file_id, folder_id }))
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const updateFileFolderBookmark = async ({
  async = false,
  jsonData,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.update_file_folder_bookmark,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      success(data)
    },
    error: (err) => {
      error(err)
    }
  })
}

export const getBookMarks = async ({
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
    method: 'POST',
    path: ApiEndpoints.bookmarks,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}
export const updateBookMark = async ({
  async = false,
  id,
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
    path: ApiEndpoints.bookmark,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}
export const setViewDone = async ({
  async = false,
  jsonData,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.viewOnlyFile,
    jsonData,
    loading,
    showErrorToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const setSignDone = async ({
  async = false,
  jsonData,
  loading,
  dispatch = () => {},
  success = () => {},
  error = () => {}
}) => {
  return http.request({
    async,
    method: 'post',
    path: ApiEndpoints.doneFileSign,
    jsonData,
    loading,
    showErrorToast: true,
    success: (data) => {
      if (jsonData?.signed_method !== 'bankid') {
        emitAlertStatus('success', null, `${jsonData?.file_id}-file-sign`)
      } else {
        if (isValidArray(data?.payload)) {
          let timeout = true
          handleBankIdRedirect(data?.payload)
          Emitter.on('file-sign-approval', () => {
            timeout = false
            emitAlertStatus('success', null, `${jsonData?.file_id}-file-sign`)
            log(timeout)
          })

          if (timeout) {
            setTimeout(() => {
              emitAlertStatus('failed', null, `${jsonData?.file_id}-file-sign`)
            }, 60000 * 4)
          }
        }
      }
    },
    error: (e) => {
      ErrorToast(e?.data?.message?.errorObject?.message)
      emitAlertStatus('failed', null, `${jsonData?.file_id}-file-sign`)
      error(true)
    }
  })
}

export const createBookmarkLink = async ({
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
    path: ApiEndpoints.bookmarkAdd,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const loadPackageDetails = async ({
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
    method: 'get',
    path: ApiEndpoints.package_details,
    // jsonData,
    loading,
    // params: { page, perPage },
    // showErrorToast: true,
    success: (data) => {
      success(data)
      dispatch(packageUpdate(data?.payload))
    },
    error: () => {
      error(true)
    }
  })
}

export const loadBankidMessageCount = async ({
  id = null,
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
    path: ApiEndpoints.bankidmessage + id,
    jsonData,
    loading,
    // params: { page, perPage },
    // showErrorToast: true,
    success: (data) => {
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}

export const storageUsageDetails = async ({
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
    method: 'get',
    path: ApiEndpoints.getStorageUsage,
    loading,
    success: (data) => {
      success(data)
    },
    error: () => {
      error(true)
    }
  })
}
