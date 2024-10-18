// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const bankSlice = createSlice({
  name: 'bank',
  initialState: {
    bank: {
      data: []
    }
  },
  reducers: {
    bankLoad: (state, action) => {
      state.bank = action?.payload
    },
    bankView: (state, action) => {
      const index = state.bank.data.findIndex((x) => x.id === action.payload.id)
      state.bank.data[index] = action.payload
    },
    bankUpdate: (state, action) => {
      const index = state.bank.data.findIndex((x) => x.id === action.payload.id)
      state.bank.data[index] = action.payload
    },
    bankSave: (state, action) => {
      state.bank.data = [...action?.payload, ...state?.bank?.data]
    },
    bankDelete: (state, action) => {
      log(action)
      const index = state.bank.data.findIndex((x) => x.id === action.payload)
      state.bank.data.splice(index, 1)
    }
  }
})

export const { bankDelete, bankLoad, bankSave, bankUpdate, bankView } = bankSlice.actions

export default bankSlice.reducer
