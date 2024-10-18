// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const commonSlice = createSlice({
  name: 'common',
  initialState: {
    common: {
      data: []
    }
  },
  reducers: {
    userTypeList: (state, action) => {
      state.common = action?.payload
    },
    patientTypeList: (state, action) => {
      state.common = action?.payload
    },
    agenciesListLoad: (state, action) => {
      state.common = action?.payload
    },
    userDetail: (state, action) => {
      state.common = action?.payload
    },
    countryList: (state, action) => {
      state.common = action?.payload
    },
    changePassword: (state, action) => {
      state.common.data = [...action?.payload, ...state?.common?.data]
    }
  }
})

export const {
  userTypeList,
  userDetail,
  countryList,
  agenciesListLoad,
  changePassword,
  patientTypeList,
  subCategoriesLoad
} = commonSlice.actions

export default commonSlice.reducer
