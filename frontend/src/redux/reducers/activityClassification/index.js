// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const activitiesSlice = createSlice({
  name: 'activitiesCls',
  initialState: {
    activitiesCls: {
      data: []
    }
  },
  reducers: {
    activitiesLoad: (state, action) => {
      state.activitiesCls = action?.payload
    },
    activitiesUpdate: (state, action) => {
      const index = state.activitiesCls.data.findIndex((x) => x.id === action.payload.id)
      state.activitiesCls.data[index] = action.payload
    },
    activitiesSave: (state, action) => {
      state.activitiesCls.data = [...action?.payload, ...state?.activitiesCls?.data]
    },
    activitiesDelete: (state, action) => {
      log(action)
      const index = state.activitiesCls.data.findIndex((x) => x.id === action.payload)
      state.activitiesCls.data.splice(index, 1)
    }
  }
})

export const { activitiesDelete, activitiesLoad, activitiesSave, activitiesUpdate } =
  activitiesSlice.actions

export default activitiesSlice.reducer
