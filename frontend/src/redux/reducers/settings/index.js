// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    setting: {
      data: []
    },
    viewSetting: null
  },
  reducers: {
    settingUpdate: (state, action) => {
      state.setting.data = [...action?.payload, ...state?.setting?.data]
    },
    settingView: (state, action) => {
      state.viewSetting = action?.payload
    }
  }
})

export const { settingUpdate, settingView } = settingSlice.actions

export default settingSlice.reducer
