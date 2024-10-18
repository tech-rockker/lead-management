// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const patientCashierSlice = createSlice({
  name: 'patientCashiers',
  initialState: {
    patientCashier: {
      data: []
    }
  },
  reducers: {
    patientCashierLoad: (state, action) => {
      state.patientCashier = action?.payload
    },
    patientCashierSave: (state, action) => {
      state.patientCashier.data = [...action?.payload, ...state?.patientCashier?.data]
    }
  }
})

export const { patientCashierLoad, patientCashierSave } = patientCashierSlice.actions

export default patientCashierSlice.reducer
