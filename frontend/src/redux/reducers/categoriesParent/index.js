import { createSlice } from '@reduxjs/toolkit'

export const category_parentsSlice = createSlice({
  name: 'categories_parent',
  initialState: {
    categories_parent: {
      data: []
    }
  },
  reducers: {
    parentCategoryLoad: (state, action) => {
      state.categories = action?.payload
    }
  }
})

export const { parentCategoryLoad } = category_parentsSlice.actions

export default category_parentsSlice.reducer
