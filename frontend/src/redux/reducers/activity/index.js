// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loadActivity } from '../../../utility/apis/activity'
import { isValid, log } from '../../../utility/helpers/common'
import { createBlankArray, getStartEndDate } from '../../../utility/Utils'

/**
 *
 * @param page
 * @param perPage
 * @param jsonData
 * @param loadMore
 */
export const fetchActivity = createAsyncThunk(
  'timeline/fetchActivity',
  async ({ page = 1, perPage, jsonData, loadMore = false }, { rejectWithValue }) => {
    const response = await loadActivity({
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
export const activitySlice = createSlice({
  name: 'activities',
  initialState: {
    loading: false,
    loadMore: false,
    end: false,
    goalStats: {},
    stats: {},
    activities: {
      startDate: null,
      endDate: null,
      page: 0,
      today_created_deviation: 0,
      today_created_journal: 0,
      total: 0,
      total_done: 0,
      total_not_applicable: 0,
      total_not_done: 0,
      total_pending: 0,
      data: []
    },
    viewActivity: null
  },
  reducers: {
    activityLoad: (state, action) => {
      state.activities = action?.payload
    },
    activityView: (state, action) => {
      state.viewActivity = action?.payload
    },
    activityUpdate: (state, action) => {
      const index = state.activities.data.findIndex((x) => x.id === action.payload.id)
      state.activities.data[index] = {
        ...state.activities.data[index],
        ...action.payload
      }
    },
    activitySave: (state, action) => {
      state.activities.data = [...action?.payload, ...state?.activities?.data]
    },
    activityApprove: (state, action) => {
      state.activities.data = [...action?.payload, ...state?.activities?.data]
    },
    activityTrmWiseChart: (state, action) => {
      state.stats = action?.payload
    },
    goalSubGoalReport: (state, action) => {
      state.goalStats = action?.payload
    },
    activityAssignment: (state, action) => {
      state.activities.data = [...action?.payload, ...state?.activities?.data]
    },
    activityDelete: (state, action) => {
      // log(action)
      const index = state.activities.data.findIndex((x) => x.id === action.payload)
      state.activities.data.splice(index, 1)
    },
    notApplicable: (state, action) => {
      const index = state.activities.data.findIndex((x) => x.id === action.payload)
      state.activities.data.splice(index, 1)
      state.activities.total_not_applicable++
    },
    activityAction: (state, action) => {
      const index = state.activities.data.findIndex((x) => x.id === action.payload?.activity_id)
      state.activities.data.splice(index, 1)

      if (action?.payload?.status === 1) {
        state.activities.total_done++
      } else if (action?.payload?.status === 2) {
        state.activities.total_not_done++
      }
      if (action?.payload?.option !== '1') {
        state.activities.today_created_journal++
      }
      if (action?.payload?.option === '5') {
        state.activities.today_created_deviation++
      }
    }
  },
  extraReducers: {
    // load activity
    [fetchActivity.pending]: (state, { meta }) => {
      state.loading = !meta?.arg?.loadMore
      state.loadMore = meta?.arg?.loadMore
      if (meta?.arg?.loadMore) {
        const old = state.activities?.data ?? []
        const all = old.concat(createBlankArray(meta?.arg?.perPage))
        state.activities = {
          ...state.activities,
          data: all
        }
      } else {
        state.activities = {
          ...state.activities,
          data: createBlankArray(meta?.arg?.perPage),
          startDate: null,
          endDate: null
        }
      }
    },
    [fetchActivity.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.end = payload?.last_page !== 0 ? payload?.page === payload?.last_page : true

      if (state?.loadMore) {
        const old = state.activities?.data ?? []
        const o = old.filter((a) => isValid(a.id))
        const all = o.concat(payload.data)
        state.loadMore = false
        state.activities = {
          ...state.activities,
          ...payload,
          loadMore: false,
          endDate: getStartEndDate(payload?.data)?.endDate,
          data: all
        }
      } else {
        state.activities = {
          ...payload,
          ...getStartEndDate(payload?.data)
        }
      }
    },
    [fetchActivity.rejected]: (state) => {
      state.loading = false
      state.loadingMore = false
      state.end = true
      state.activities.data = []
      state.activities.startDate = null
      state.activities.endDate = null
    }
    // end load activity
  }
})

export const {
  activityDelete,
  notApplicable,
  activitySave,
  goalSubGoalReport,
  activityTrmWiseChart,
  activityLoad,
  activityUpdate,
  activityView,
  activityApprove,
  activityAction,
  activityAssignment
} = activitySlice.actions

export default activitySlice.reducer
