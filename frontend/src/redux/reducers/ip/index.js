// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const ipSlice = createSlice({
  name: 'ip',
  initialState: {
    ip: {
      data: []
    }
  },
  reducers: {
    patientPlanLoad: (state, action) => {
      state.ip = action?.payload
    },
    patientPersonsLoad: (state, action) => {
      state.ip = action?.payload
    },
    ipAssignLoad: (state, action) => {
      state.ip = action?.payload
    },
    ipEditHistory: (state, action) => {
      state.ip = action?.payload
    },
    approvedPatientPlanLoad: (state, action) => {
      state.ip = action?.payload
    },
    patientPlanView: (state, action) => {
      const index = state.ip.data.findIndex((x) => x.id === action.payload.id)
      state.ip.data[index] = action.payload
    },
    patientPlanUpdate: (state, action) => {
      const index = state.ip.data.findIndex((x) => x.id === action.payload.id)
      state.ip.data[index] = {
        ...state.ip.data[index],
        ...action.payload
      }
    },
    patientPlanSave: (state, action) => {
      state.ip.data = [...action?.payload, ...state?.ip?.data]
    },
    ipAssigneToEmpSave: (state, action) => {
      state.ip.data = [...action?.payload, ...state?.ip?.data]
    },
    patientPlanDelete: (state, action) => {
      log(action)
      const index = state.ip.data.findIndex((x) => x.id === action.payload)
      state.ip.data.splice(index, 1)
    },
    ipCompete: (state, action) => {
      state.ip.data = [...action?.payload, ...state?.ip?.data]
    }
  }
})

export const {
  patientPlanDelete,
  patientPlanSave,
  patientPersonsLoad,
  ipEditHistory,
  patientPlanLoad,
  patientPlanUpdate,
  patientPlanView,
  ipAssignLoad,
  ipAssigneToEmpSave,
  approvedPatientPlanLoad,
  ipCompete
} = ipSlice.actions

export default ipSlice.reducer
