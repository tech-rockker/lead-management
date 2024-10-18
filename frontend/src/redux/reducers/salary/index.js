// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const salarySlice = createSlice({
  name: 'salary',
  initialState: {
    salary: {
      data: []
    }
  },
  reducers: {
    salaryLoad: (state, action) => {
      state.salary = action?.payload
    },
    salarySave: (state, action) => {
      state.salary.data = [...action?.payload, ...state?.salary?.data]
    }
  }
})

export const { salaryLoad, salarySave } = salarySlice.actions

export default salarySlice.reducer
