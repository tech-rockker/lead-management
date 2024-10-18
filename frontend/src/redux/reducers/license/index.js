// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const licencesSlice = createSlice({
  name: 'licenses',
  initialState: {
    licenses: {
      data: []
    },
    licenseViews: null,
    licenseStatus: null
  },
  reducers: {
    licensesLoad: (state, action) => {
      state.licenses = action?.payload
    },
    licenseView: (state, action) => {
      state.licenseViews = action?.payload
    },
    licensesUpdate: (state, action) => {
      const index = state.licenses.data.findIndex((x) => x.id === action.payload.id)
      state.licenses.data[index] = action.payload
    },
    licensesSave: (state, action) => {
      state.licenses.data = [...action?.payload, ...state?.licenses?.data]
    },
    licencesDelete: (state, action) => {
      log(action)
      const index = state.licenses.data.findIndex((x) => x.id === action.payload)
      state.licenses.data.splice(index, 1)
    },
    statusLicense: (state, action) => {
      state.licenseStatus = action?.payload
    }
  }
})

export const { licencesDelete, licensesLoad, licensesSave, licensesUpdate } = licencesSlice.actions

export default licencesSlice.reducer
