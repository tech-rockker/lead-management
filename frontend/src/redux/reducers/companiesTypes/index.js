// import { log } from "../../../utility/helpers/common"
// import types from "../../types"

// // **  Initial State
// const initialState = {
//     companyTypes: {
//         data: []
//     },
//     companies: {
//         data: []
//     }
// }

// const companies = (state = initialState, action) => {
//     const companyTypes = state.companyTypes
//     const companies = state.companies

//     switch (action.type) {
//         // Category Types
//         case 'SaveNewCompType':
//             companyTypes.data = [
//                 ...action.data,
//                 ...companyTypes.data
//             ]
//             return {
//                 ...state,
//                 companyTypes
//             }
//         case types.UpdateCatType:
//             const indexCompTypeUpdate = companyTypes.data.findIndex(x => x.id === action.data.id)
//             companyTypes.data[indexCompTypeUpdate] = action.data
//             return {
//                 ...state,
//                 companyTypes
//             }
//         case types.deleteCompTypeId:
//             const indexCompTypeDelete = companyTypes.data.findIndex(x => x.id === action.data)
//             companyTypes.data.splice(indexCompTypeDelete, 1)
//             return {
//                 ...state,
//                 companyTypes
//             }
//         case 'LoadCompType':
//             return { ...state, companyTypes: action.data }

//         // Companies
//         case 'SaveNewCompany':
//             companies.data = [
//                 ...action.data,
//                 ...companies.data
//             ]
//             return {
//                 ...state,
//                 companies
//             }
//         case 'UpdateCompany':
//             const indexCompUpdate = companies.data.findIndex(x => x.id === action.data.id)
//             companies.data[indexCompUpdate] = action.data
//             return {
//                 ...state,
//                 companies
//             }
//         case 'DeleteCompany':
//             const indexCompDelete = companies.data.findIndex(x => x.id === action.data)
//             companies.data.splice(indexCompDelete, 1)
//             return {
//                 ...state,
//                 companies
//             }
//         case 'LoadCompany':
//             return { ...state, companies: action.data }

//         // Default
//         default:
//             return state
//     }
// }
// export default companies
// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const companyTypesSlice = createSlice({
  name: 'companyTypes',
  initialState: {
    companyTypes: {
      data: []
    }
  },
  reducers: {
    companyTypesLoad: (state, action) => {
      state.companyTypes = action?.payload
    },
    companyTypeUpdate: (state, action) => {
      const index = state.companyTypes.data.findIndex((x) => x.id === action.payload.id)
      state.companyTypes.data[index] = action.payload
    },
    companyTypeSave: (state, action) => {
      state.companyTypes.data = [...action?.payload, ...state?.companyTypes?.data]
    },
    companyTypeDelete: (state, action) => {
      log(action)
      const index = state.companyTypes.data.findIndex((x) => x.id === action.payload)
      state.companyTypes.data.splice(index, 1)
    }
  }
})

export const { companyTypeDelete, companyTypeSave, companyTypesLoad, companyTypeUpdate } =
  companyTypesSlice.actions

export default companyTypesSlice.reducer
