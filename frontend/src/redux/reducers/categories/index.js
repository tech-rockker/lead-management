import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

/////////categories///////////
export const categoriesSlice = createSlice({
  name: 'categories',

  initialState: {
    categories: {
      data: []
    }
    // subCategores: {
    //     data: []
    // }
  },
  reducers: {
    /// Categories
    loadCategories: (state, action) => {
      state.categories = action?.payload
    },

    loadSubCategories: (state, action) => {
      state.categories = action?.payload
    },
    updateCategories: (state, action) => {
      const index = state.categories.data.findIndex((x) => x.id === action.payload.id)
      state.categories.data[index] = action.payload
    },
    saveCategories: (state, action) => {
      state.categories.data = [...action?.payload, ...state?.categories?.data]
    },
    delCategories: (state, action) => {
      const index = state.categories.data.findIndex((x) => x.id === action.payload)
      state.categories.data.splice(index, 1)
    },

    /// Sub categories
    // loadSubCategories: (state, action) => {
    //     state.subCategories = action?.payload
    // },
    updateSubCategories: (state, action) => {
      const index = state.subCategories.data.findIndex((x) => x.id === action.payload.id)
      state.subCategories.data[index] = action.payload
    },
    saveSubCategories: (state, action) => {
      state.subCategories.data = [...action?.payload, ...state?.subCategories?.data]
    },
    delSubCategories: (state, action) => {
      const index = state.subCategories.data.findIndex((x) => x.id === action.payload)
      state.subCategories.data.splice(index, 1)
    }
  }
})

export const {
  loadSubCategories,
  updateSubCategories,
  saveSubCategories,
  delSubCategories,
  delCategories,
  saveCategories,
  updateCategories,
  loadCategories
} = categoriesSlice.actions

export default categoriesSlice.reducer
/////////////////categories///////////////
