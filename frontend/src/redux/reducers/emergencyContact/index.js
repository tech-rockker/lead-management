// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const emergencyContactSlice = createSlice({
  name: 'emergencyContact',
  initialState: {
    emergencyContact: {
      data: []
    },
    viewCompany: null
  },
  reducers: {
    // companyView: (state, action) => {
    //     state.emergencyContact = action?.payload
    // },
    emergencyContactLoad: (state, action) => {
      state.emergencyContact = action?.payload
    },
    emergencyContactUpdate: (state, action) => {
      const index = state.emergencyContact.data.findIndex((x) => x.id === action.payload.id)
      state.emergencyContact.data[index] = action.payload
    },
    emergencyContactSave: (state, action) => {
      state.emergencyContact.data = [...action?.payload, ...state?.emergencyContact?.data]
    },
    emergencyContactDelete: (state, action) => {
      log(action)
      const index = state.emergencyContact.data.findIndex((x) => x.id === action.payload)
      state.emergencyContact.data.splice(index, 1)
    }
  }
})

export const {
  emergencyContactDelete,
  emergencyContactLoad,
  emergencyContactSave,
  emergencyContactUpdate
} = emergencyContactSlice.actions

export default emergencyContactSlice.reducer
