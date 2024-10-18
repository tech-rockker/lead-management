// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const branchSlice = createSlice({
  name: 'branch',
  initialState: {
    branch: {
      data: []
    },
    viewbranch: null
  },
  reducers: {
    branchView: (state, action) => {
      state.viewbranch = action?.payload
    },
    branchUpdate: (state, action) => {
      const index = state.branch.data.findIndex((x) => x.id === action.payload.id)
      state.branch.data[index] = action.payload
    },
    branchSave: (state, action) => {
      state.branch.data = [...action?.payload, ...state?.branch?.data]
    }
  }
})

export const { branchSave, branchUpdate, branchView } = branchSlice.actions

export default branchSlice.reducer
