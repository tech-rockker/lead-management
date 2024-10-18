import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isValid, log } from '../../../utility/helpers/common'
import { listJournal } from '../../../utility/apis/journal'
import { createBlankArray, getStartEndDate } from '../../../utility/Utils'

/**
 *
 * @param page
 * @param perPage
 * @param jsonData
 * @param loadMore
 */

export const fetchJournal = createAsyncThunk(
  'journal/fetchJournal',
  async ({ page = 1, perPage, jsonData, loadMore = false }, { rejectWithValue }) => {
    const response = await listJournal({
      async: true,
      page,
      perPage,
      jsonData
    })
    return {
      ...response.data?.payload,
      loadMore,
      page
    }
  }
)
export const journalSlice = createSlice({
  name: 'journals',
  initialState: {
    loading: false,
    loadMore: false,
    end: false,
    journals: {
      data: []
    },
    viewJournals: null
  },
  reducers: {
    journalLoad: (state, action) => {
      state.journals = action?.payload
    },
    journalView: (state, action) => {
      state.viewJournals = action?.payload
    },
    journalSave: (state, action) => {
      state.journals.data = [...action?.payload, ...state?.journals?.data]
    },
    journalUpdate: (state, action) => {
      const index = state.journals.data.findIndex((x) => x.id === action.payload.id)
      state.journals.data[index] = {
        ...state.journals.data[index],
        ...action.payload
      }
    },
    journalLoadAction: (state, action) => {
      state.journals = action?.payload
    },
    journalViewAction: (state, action) => {
      state.viewJournals = action?.payload
    },
    journalSaveAction: (state, action) => {
      state.journals.data = [...action?.payload, ...state?.journals?.data]
    },
    journalUpdateAction: (state, action) => {
      const index = state.journals.data.findIndex((x) => x.id === action.payload.id)
      state.journals.data[index] = action.payload
    },
    actionJournalReducer: (state, action) => {
      state.journals.data = [...action?.payload, ...state?.journals?.data]
    },
    actionOfJournal: (state, action) => {
      state.journals.data = [...action?.payload, ...state?.journals?.data]
    },
    statsOfJournal: (state, action) => {
      state.journals = action?.payload
    }
  },
  extraReducers: {
    // load journal
    [fetchJournal.pending]: (state, { meta }) => {
      state.loading = !meta?.arg?.loadMore
      state.loadMore = meta?.arg?.loadMore
      if (meta?.arg?.loadMore) {
        const old = state.journals?.data ?? []
        const all = old.concat(createBlankArray(meta?.arg?.perPage))
        state.journals = {
          ...state.journals,
          data: all
        }
      } else {
        state.journals = {
          ...state.journals,
          data: createBlankArray(meta?.arg?.perPage)
        }
      }
    },
    [fetchJournal.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.end = payload?.last_page !== 0 ? payload?.page === payload?.last_page : true

      if (state?.loadMore) {
        const old = state.journals?.data ?? []
        const o = old.filter((a) => isValid(a.id))
        const all = o.concat(payload.data)
        state.loadMore = false
        state.journals = {
          ...state.journals,
          ...payload,
          loadMore: false,
          endDate: getStartEndDate(payload?.data)?.endDate,
          data: all
        }
      } else {
        state.journals = {
          ...payload,
          ...getStartEndDate(payload?.data)
        }
      }
    },
    [fetchJournal.rejected]: (state) => {
      state.loading = false
      state.loadingMore = false
      state.end = true
      state.journals.data = []
    }
  }
})

export const {
  journalLoad,
  journalView,
  journalSave,
  journalUpdate,
  journalLoadAction,
  journalViewAction,
  journalSaveAction,
  journalUpdateAction,
  actionJournalReducer,
  actionOfJournal,
  statsOfJournal
} = journalSlice.actions

export default journalSlice.reducer
