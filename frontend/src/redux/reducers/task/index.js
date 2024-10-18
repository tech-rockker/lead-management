// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: {
      data: [],
      completed_tasks: 0,
      not_completed_tasks: 0
    },
    viewTasks: null
  },
  reducers: {
    taskLoad: (state, action) => {
      state.tasks = action?.payload
    },
    taskView: (state, action) => {
      state.viewTasks = action?.payload
    },
    taskUpdate: (state, action) => {
      const index = state.tasks.data.findIndex((x) => x.id === action.payload.orgId)
      state.tasks.data[index] = action.payload
    },
    taskActionUpdate: (state, action) => {
      const index = state.tasks.data.findIndex((x) => x.id === action.payload.id)
      state.tasks.data[index] = action.payload
      state.tasks.data.splice(index, 1)
      if (action?.payload?.status === 1) {
        state.tasks.completed_tasks++
        state.tasks.not_completed_tasks--
      }
    },
    taskSave: (state, action) => {
      state.tasks.data = [...action?.payload, ...state?.tasks?.data]
    },
    taskDelete: (state, action) => {
      log(action)
      const index = state.tasks.data.findIndex((x) => x.id === action.payload)
      state.tasks.data.splice(index, 1)
    }
  }
})

export const { taskDelete, taskLoad, taskSave, taskUpdate, taskView, taskActionUpdate } =
  tasksSlice.actions

export default tasksSlice.reducer
