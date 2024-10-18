import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

/////////categories///////////
export const languageLabelSlice = createSlice({
  name: 'label',

  initialState: {
    label: {
      data: []
    },
    language: {
      data: []
    }

    // subCategores: {
    //     data: []
    // }
  },
  reducers: {
    /// Categories
    loadLangLabel: (state, action) => {
      state.label = action?.payload
    },

    getLanguage: (state, action) => {
      state.language = action?.payload
    },
    getLanguages: (state, action) => {
      state.language = action?.payload
    },
    updateLangLabel: (state, action) => {
      const index = state.label.data.findIndex((x) => x.id === action.payload.id)
      state.label.data[index] = action.payload
    },
    updateLanguage: (state, action) => {
      const index = state.language.data.findIndex((x) => x.id === action.payload.id)
      state.language.data[index] = action.payload
    },
    saveLangLabel: (state, action) => {
      state.label.data = [...action?.payload, ...state?.label?.data]
    },
    deleteLangLabel: (state, action) => {
      const index = state.label.data.findIndex((x) => x.id === action.payload)
      state.label.data.splice(index, 1)
    },
    deleteLanguage: (state, action) => {
      const index = state.language.data.findIndex((x) => x.id === action.payload)
      state.language.data.splice(index, 1)
    },
    importLanguage: (state, action) => {
      state.label.data = [...action?.payload, ...state?.label?.data]
    }

    /// Sub categories
    // loadSubCategories: (state, action) => {
    //     state.subCategories = action?.payload
    // },
    // updateSubCategories: (state, action) => {
    //     const index = state.subCategories.data.findIndex(x => x.id === action.payload.id)
    //     state.subCategories.data[index] = action.payload
    // },
    // saveSubCategories: (state, action) => {
    //     state.subCategories.data = [
    //         ...action?.payload,
    //         ...state?.subCategories?.data
    //     ]
    // },
    // delSubCategories: (state, action) => {
    //     const index = state.subCategories.data.findIndex(x => x.id === action.payload)
    //     state.subCategories.data.splice(index, 1)
    // }
  }
})

export const {
  loadLangLabel,
  updateLangLabel,
  saveLangLabel,
  deleteLangLabel,
  getLanguage,
  importLanguage,
  deleteLanguage,
  updateLanguage,
  getLanguages
} = languageLabelSlice.actions

export default languageLabelSlice.reducer
/////////////////categories///////////////
