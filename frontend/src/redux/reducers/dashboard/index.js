import { createSlice } from '@reduxjs/toolkit'

export const dashboardSlice = createSlice({
  name: 'dashboards',
  initialState: {
    dashboards: {
      data: []
    }
  },
  reducers: {
    dashboardLoad: (state, action) => {
      state.dashboards = action?.payload
    }
  }
})

export const { dashboardLoad } = dashboardSlice.actions

export default dashboardSlice.reducer
