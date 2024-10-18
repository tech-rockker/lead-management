// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const TrashedActivitySlice = createSlice({
  name: 'trashedActivities',
  initialState: {
    trashedActivities: {
      data: []
    },
    restoreActivity: null
  },
  reducers: {
    trashedActivityLoad: (state, action) => {
      state.trashedActivities = action?.payload
    },
    trashedActivityRestore: (state, action) => {
      state.restoreActivity = action?.payload
    },
    trashedActivityDeleteX: (state, action) => {
      log(action)
      const index = state.trashedActivities.data.findIndex((x) => x.id === action.payload)
      if (index >= 0) {
        state.trashedActivities.data.splice(index, 1)
      }
    }
  }
})

export const { trashedActivityDeleteX, trashedActivityLoad, trashedActivityRestore } =
  TrashedActivitySlice.actions

export default TrashedActivitySlice.reducer
