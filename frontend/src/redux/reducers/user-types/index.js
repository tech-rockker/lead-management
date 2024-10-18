// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const userTypesSlice = createSlice({
  name: 'userType',
  initialState: {
    userType: {
      data: []
    }
  },
  reducers: {
    userTypesLoad: (state, action) => {
      state.userType = action?.payload
    },
    userTypesUpdate: (state, action) => {
      const index = state.userType.data.findIndex((x) => x.id === action.payload.id)
      state.userType.data[index] = action.payload
    },
    userTypesSave: (state, action) => {
      state.userType.data = [...action?.payload, ...state?.userType?.data]
    },
    userTypesDelete: (state, action) => {
      log(action)
      const index = state.userType.data.findIndex((x) => x.id === action.payload)
      state.userType.data.splice(index, 1)
    }
  }
})

export const { userTypesDelete, userTypesLoad, userTypesSave, userTypesUpdate } =
  userTypesSlice.actions

export default userTypesSlice.reducer
