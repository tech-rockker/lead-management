// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const packagesSlice = createSlice({
  name: 'packages',
  initialState: {
    packages: {
      data: []
    }
  },
  reducers: {
    packagesLoad: (state, action) => {
      state.packages = action?.payload
    },
    packagesUpdate: (state, action) => {
      const index = state.packages.data.findIndex((x) => x.id === action.payload.id)
      state.packages.data[index] = action.payload
    },
    packagesSave: (state, action) => {
      state.packages.data = [...action?.payload, ...state?.packages?.data]
    },
    packagesDelete: (state, action) => {
      log(action)
      const index = state.packages.data.findIndex((x) => x.id === action.payload)
      state.packages.data.splice(index, 1)
    },
    userPackagesLoad: (state, action) => {
      state.packages = action?.payload
    }
  }
})

export const { packagesDelete, packagesLoad, packagesSave, packagesUpdate, userPackagesLoad } =
  packagesSlice.actions

export default packagesSlice.reducer
