import {
  actionJournalReducer,
  journalLoad,
  journalLoadAction,
  journalSave,
  journalUpdate,
  journalUpdateAction,
  statsOfJournal
} from '../../redux/reducers/journal'
import Emitter from '../Emitter'
import { isValidArray, log } from '../helpers/common'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { emitAlertStatus, ErrorToast, handleBankIdRedirect } from '../Utils'

export const createJournal = async ({
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
    method: 'Post',
    path: ApiEndpoints.createJournal,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => {

    //     success((data?.payload))
    // },
    success: (data) => {
      dispatch(journalSave([{ ...data?.payload }]))
      success(data)
    },

    error: () => {
      error(true)
    }
  })
}

export const listJournal = async ({
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
    path: ApiEndpoints.listJournal,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(journalLoad(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const editJournal = async ({
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
    path: ApiEndpoints.editJournal + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(journalUpdate(data.payload))
      success(data)
    },
    //    success: (data) => {
    //         dispatch(journalUpdate({
    //             id: jsonData?.id,
    //             journal: [data?.payload]
    //         }))
    //         success(data)
    //     },
    error: () => {}
  })
}

export const listJournalAction = async ({
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
    path: ApiEndpoints.listJournalAction,
    jsonData,
    loading,
    params: { page, perPage },
    success: (data) => {
      dispatch(journalLoadAction(data?.payload))
      success(data)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const createJournalAction = async ({
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
    method: 'Post',
    path: ApiEndpoints.createJournalAction,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => {

    //     success((data?.payload))
    // },
    success: (data) => {
      dispatch(
        journalUpdate({
          id: jsonData?.journal_id,
          journal_actions: [data?.payload]
        })
      )
      success(data)
    },

    error: () => {
      error(true)
    }
  })
}

export const editJournalAction = async ({
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
    path: ApiEndpoints.editJournalAction + id,
    jsonData,
    loading,
    params: { page, perPage },
    showErrorToast: true,
    showSuccessToast: true,
    success: (data) => {
      dispatch(journalUpdateAction(data.payload))
      success(data)
    },
    error: () => {}
  })
}

export const viewJournal = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.viewJournal + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const actionJournal = async ({
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
    method: 'Post',
    path: ApiEndpoints.actionJournal,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => {

    //     success((data?.payload))
    // },
    success: (data) => {
      dispatch(actionJournalReducer([{ ...data?.payload }]))
      success(data)
    },

    error: () => {
      error(true)
    }
  })
}

export const viewJournalAction = ({ id, loading, success = () => {} }) => {
  http.request({
    method: 'get',
    path: ApiEndpoints.viewJournalAction + id,
    loading,
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      /** ErrorToast("data-fetch-failed") **/
    }
  })
}

export const actionJournalAction = async ({
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
    method: 'Post',
    path: ApiEndpoints.actionJournalAction,
    jsonData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      if (jsonData?.signed_method !== 'bankid') {
        log('noraml')
        emitAlertStatus('success', null, `journal-action-event-${jsonData?.id}`)
      } else {
        if (isValidArray(data?.payload)) {
          let timeout = true
          handleBankIdRedirect(data?.payload)

          // echoEventJournalActionApproval(() => {
          //     emitAlertStatus("success")
          //     timeout = false
          // }, { id: data?.payload[0].person_id, unique_id: data?.payload[0]?.uniqueId })
          Emitter.on('journal-action-approval', () => {
            timeout = false
            emitAlertStatus('success', null, `journal-action-event-${jsonData?.id}`)
          })

          if (timeout) {
            setTimeout(() => {
              emitAlertStatus('failed', null`journal-action-event-${jsonData?.id}`)
            }, 60000 * 4)
          }
        }
      }
      success(data)
    },

    error: (e) => {
      ErrorToast(e?.data?.message?.errorObject?.message)
      error(true)
      emitAlertStatus('failed', null, `journal-action-event-${jsonData?.id}`)
    }
  })
}
export const actionJournalSign = async ({
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
    method: 'Post',
    path: ApiEndpoints.actionJournalSign,
    jsonData,
    loading,
    showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      if (jsonData?.signed_method !== 'bankid') {
        console.log('json.id journal', jsonData?.id)
        emitAlertStatus('success', null, `journal-event-${jsonData?.id}`)
      } else {
        if (isValidArray(data?.payload)) {
          let timeout = true
          handleBankIdRedirect(data?.payload)

          // echoEventJournalApproval(() => {
          //     emitAlertStatus("success")
          //     timeout = false
          // }, { id: data?.payload[0].person_id, unique_id: data?.payload[0]?.uniqueId })
          Emitter.on('journal-approval', () => {
            timeout = false
            emitAlertStatus('success', null, `journal-event-${jsonData?.id}`)
          })
          if (timeout) {
            setTimeout(() => {
              emitAlertStatus('failed', null, `journal-event-${jsonData?.id}`)
            }, 60000 * 4)
          }
        }
      }
      success(data)
    },
    error: (e) => {
      ErrorToast(e?.data?.message?.errorObject?.message)
      error(true)
      emitAlertStatus('failed', null, `journal-event-${jsonData?.id}`)
    }
  })
}

export const journalStats = async ({
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
    method: 'Post',
    path: ApiEndpoints.journalStats,
    jsonData,
    loading,
    // showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => {

    //     success((data?.payload))
    // },
    success: (data) => {
      dispatch(statsOfJournal([{ ...data?.payload }]))
      success(data)
    },

    error: () => {
      error(true)
    }
  })
}

export const timeReportJournal = async ({
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
    method: 'Post',
    path: ApiEndpoints.timeReportJournal,
    jsonData,
    loading,
    // showErrorToast: true,
    // showSuccessToast: true,
    params: { page, perPage },
    success: (data) => {
      success(data?.payload)
    },
    error: () => {
      error(true)
    }
  })
}

// export const printJournal = async ({ async = false, jsonData, loading, page, perPage, dispatch = () => { }, success = () => { } }) => {
//     return http.request({
//         async,
//         method: "post",
//         path: ApiEndpoints.printJournal,
//         jsonData,
//         loading,
//         params: { page, perPage },
//         success: (data) => { success(data?.payload) },
//         error: () => { /** ErrorToast("data-fetch-failed") **/ }
//     })
// }

export const printJournal = async ({
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
    method: 'Post',
    path: ApiEndpoints.printJournal,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => {

    //     success((data?.payload))
    // },
    success: (data) => {
      window.open(data?.payload, '_blank')
      emitAlertStatus('success')
    },

    error: () => {
      error(true)
    }
  })
}

export const activeJournal = async ({
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
    method: 'Post',
    path: ApiEndpoints.activeJournal,
    jsonData,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    params: { page, perPage },
    // success: (data) => {

    //     success((data?.payload))
    // },
    // success: (data) => { success(data?.payload) },
    success: (data) => {
      // dispatch(journalUpdate(
      //     {
      //         id: jsonData?.journal_id,
      //         is_active: jsonData?.is_active
      //     }
      // ))
      success(data)
    },

    error: () => {
      error(true)
    }
  })
}
