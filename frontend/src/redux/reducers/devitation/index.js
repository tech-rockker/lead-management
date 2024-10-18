// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loadDevitation } from '../../../utility/apis/devitation'
import { isValid, log } from '../../../utility/helpers/common'
import { createBlankArray, getStartEndDate } from '../../../utility/Utils'

/**
 *
 * @param page
 * @param perPage
 * @param jsonData
 * @param loadMore
 */
export const fetchDeviation = createAsyncThunk(
  'deviation/fetchDeviation',
  async ({ page = 1, perPage, jsonData, loadMore = false }, { rejectWithValue }) => {
    const response = await loadDevitation({
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

export const devitationSlice = createSlice({
  name: 'devitations',
  initialState: {
    loading: false,
    loadMore: false,
    end: false,
    devitations: {
      data: []
    },
    viewDevitation: null,
    statsDevitation: null,
    printDevitation: null
  },
  reducers: {
    devitationLoad: (state, action) => {
      state.devitations = action?.payload
    },
    devitationView: (state, action) => {
      state.viewDevitation = action?.payload
    },
    devitationUpdate: (state, action) => {
      const index = state.devitations.data.findIndex((x) => x.id === action.payload.id)
      state.devitations.data[index] = {
        ...state.devitations.data[index],
        ...action.payload
      }
    },
    devitationSave: (state, action) => {
      state.devitations.data = [...action?.payload, ...state?.devitations?.data]
    },
    devitationPrint: (state, action) => {
      state.printDevitation = action?.payload
    },
    devitationAction: (state, action) => {
      state.devitations.data = [...action?.payload, ...state?.devitations?.data]
    },
    devitationAssignment: (state, action) => {
      state.devitations.data = [...action?.payload, ...state?.devitations?.data]
    },
    devitationDelete: (state, action) => {
      log(action)
      const index = state.devitations.data.findIndex((x) => x.id === action.payload)
      state.devitations.data.splice(index, 1)
    },
    devitationStatss: (state, action) => {
      state.statsDevitation = action?.payload
    }
  },

  extraReducers: {
    // load deviation
    [fetchDeviation.pending]: (state, { meta }) => {
      state.loading = !meta?.arg?.loadMore
      state.loadMore = meta?.arg?.loadMore
      if (meta?.arg?.loadMore) {
        const old = state.devitations?.data ?? []
        const all = old.concat(createBlankArray(meta?.arg?.perPage))
        state.devitations = {
          ...state.devitations,
          data: all
        }
      } else {
        state.devitations = {
          ...state.devitations,
          data: createBlankArray(meta?.arg?.perPage)
        }
      }
    },
    [fetchDeviation.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.end = payload?.last_page !== 0 ? payload?.page === payload?.last_page : true

      if (state?.loadMore) {
        const old = state.devitations?.data ?? []
        const o = old.filter((a) => isValid(a.id))
        const all = o.concat(payload.data)
        state.loadMore = false
        state.devitations = {
          ...state.devitations,
          ...payload,
          loadMore: false,
          endDate: getStartEndDate(payload?.data)?.endDate,
          data: all
        }
      } else {
        state.devitations = {
          ...payload,
          ...getStartEndDate(payload?.data)
        }
      }
    },
    [fetchDeviation.rejected]: (state) => {
      state.loading = false
      state.loadingMore = false
      state.end = true
      state.devitations.data = []
    }
    // end load activity
  }
})

export const {
  devitationDelete,
  devitationSave,
  devitationLoad,
  devitationUpdate,
  devitationView,
  devitationPrint,
  devitationAction,
  devitationAssignment,
  devitationStatss
} = devitationSlice.actions

export default devitationSlice.reducer
