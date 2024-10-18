// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { viewUser, loadBranchesUsers } from '../../../utility/apis/userManagement'
import { forDecryption, userFields, UserTypes } from '../../../utility/Const'
import { log } from '../../../utility/helpers/common'
import { createAsyncSelectOptions, decryptObject, jsonDecodeAll } from '../../../utility/Utils'

export const loadUserDetails = createAsyncThunk(
  'users/fetchUser',
  async ({ userType, id }, { rejectWithValue }) => {
    const response = await viewUser({
      async: true,
      id
    })
    let res = {
      ...response.data?.payload,
      country_id: response.data?.payload?.country?.id ?? '',
      agencies_id: response.data?.payload?.agency_hours?.map((d, i) => d?.name)
    }
    if (userType === UserTypes.patient) {
      res = {
        ...res,
        ...response.data?.payload?.patient_information,
        id: response.data?.payload?.patient_information?.patient_id
      }
    }
    const valuesTemp = jsonDecodeAll(userFields, res)
    const values = { ...valuesTemp, ...decryptObject(forDecryption, valuesTemp) }
    return values
  }
)

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    loadingDetails: false,
    selectedUser: null,
    branchesUsers: {
      data: []
    },
    users: {
      data: []
    },
    userDropdown: {
      options: [],
      hasMore: false,
      additional: {
        page: 1
      }
    }
  },
  reducers: {
    branchesUsersLoad: (state, action) => {
      state.branchesUsers.data = action.payload
      log('alll users: ', state.branchesUsers.data)
    },
    userLoad: (state, action) => {
      state.users = action?.payload
    },
    userLoadDropdown: (state, action) => {
      state.userDropdown = createAsyncSelectOptions(
        action?.payload?.data,
        action?.payload.current_page,
        'name',
        null,
        () => {}
      )
    },
    userView: (state, action) => {
      const index = state.users.data.findIndex((x) => x.id === action.payload.id)
      state.users.data[index] = action.payload
    },
    userUpdate: (state, action) => {
      const index = state.users.data.findIndex((x) => x.id === action.payload.id)
      state.users.data[index] = action.payload
    },
    updateAssign: (state, action) => {
      const index = state.users.data.findIndex((x) => x.id === action.payload.emp_id)
      state.users.data[index] = {
        ...state.users.data[index],
        assigned_work: action.payload
      }
    },
    addAssignWork: (state, action) => {
      const index = state.users.data.findIndex((x) => x.id === action.payload.emp_id)
      state.users.data[index] = {
        ...state.users.data[index],
        assigned_work: action.payload
      }
    },
    userSave: (state, action) => {
      state.users.data = [...action?.payload, ...state?.users?.data]
    },
    personApproval: (state, action) => {
      state.users.data = [...action?.payload, ...state?.users?.data]
    },
    userDelete: (state, action) => {
      log(action)
      const index = state.users.data.findIndex((x) => x.id === action.payload)
      state.users.data.splice(index, 1)
    }
  },
  extraReducers: {
    // load
    [loadUserDetails.pending]: (state, { meta }) => {
      state.loadingDetails = true
      state.selectedUser = null
    },
    [loadUserDetails.fulfilled]: (state, { payload }) => {
      state.loadingDetails = false
      state.selectedUser = payload
    },
    [loadUserDetails.rejected]: (state) => {
      state.loadingDetails = false
      state.selectedUser = null
    }
    // end load
  }
})

export const {
  branchesUsersLoad,
  userDelete,
  userLoadDropdown,
  userLoad,
  userSave,
  userUpdate,
  userView,
  personApproval,
  updateAssign,
  addAssignWork
} = usersSlice.actions

export default usersSlice.reducer
