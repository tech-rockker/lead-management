// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const companiesSlice = createSlice({
  name: 'companies',
  initialState: {
    companies: {
      data: []
    },
    viewCompany: null,
    statsComp: null,
    updateProfile: null,
    viewCompany: null
  },
  reducers: {
    companyView: (state, action) => {
      state.viewCompany = action?.payload
    },
    companiesLoad: (state, action) => {
      state.companies = action?.payload
    },
    companiesUpdate: (state, action) => {
      const index = state.companies.data.findIndex((x) => x.id === action.payload.id)
      state.companies.data[index] = action.payload
    },
    companiesSave: (state, action) => {
      state.companies.data = [...action?.payload, ...state?.companies?.data]
    },
    updateProfile: (state, action) => {
      state.updateProfile.data = [...action?.payload, ...state?.updateProfile?.data]
    },
    companiesDelete: (state, action) => {
      log(action)
      const index = state.companies.data.findIndex((x) => x.id === action.payload)
      state.companies.data.splice(index, 1)
    },
    companyStats: (state, action) => {
      state.statsComp = action?.payload
    }
  }
})

export const {
  companiesDelete,
  companiesLoad,
  companiesSave,
  companiesUpdate,
  companyView,
  companyStats,
  updateProfile
} = companiesSlice.actions

export default companiesSlice.reducer
