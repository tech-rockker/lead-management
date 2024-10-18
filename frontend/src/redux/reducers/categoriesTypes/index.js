import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'
////categoryTypes
export const catTypesSlice = createSlice({
  name: 'categoryTypes',
  initialState: {
    categoryTypes: {
      data: []
    }
  },
  reducers: {
    loadCatTypes: (state, action) => {
      state.categoryTypes = action?.payload
    },
    updateCatTypes: (state, action) => {
      const index = state.categoryTypes.data.findIndex((x) => x.id === action.payload.id)
      state.categoryTypes.data[index] = action.payload
    },
    saveCatTypes: (state, action) => {
      state.categoryTypes.data = [...action?.payload, ...state?.categoryTypes?.data]
    },
    delCatTypes: (state, action) => {
      log(action)
      const index = state.categoryTypes.data.findIndex((x) => x.id === action.payload)
      state.categoryTypes.data.splice(index, 1)
    }
  }
})

export const { delCatTypes, saveCatTypes, updateCatTypes, loadCatTypes } = catTypesSlice.actions

export default catTypesSlice.reducer
