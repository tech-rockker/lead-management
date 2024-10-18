// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const approvalSlice = createSlice({
  name: 'approval',
  initialState: {
    approval: {
      data: []
    }
  },
  reducers: {
    approvalList: (state, action) => {
      state.approval = action?.payload
    },
    approvalUpdate: (state, action) => {
      const index = state.approval.data.findIndex((x) => x.id === action.payload.rid)
      state.approval.data[index] = {
        ...state.approval.data[index],
        type_id_Data: {
          ip: action.payload.ip
        }
      }
    },
    approvalRequest: (state, action) => {
      state.approval.data = [...action?.payload, ...state?.approval?.data]
    }
  }
})

export const { approvalList, approvalRequest, approvalUpdate } = approvalSlice.actions

export default approvalSlice.reducer
