// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { log } from '../../../utility/helpers/common'
import { updateFileFolderBookmark } from '../../../utility/apis/commons'

//an async thunk for updating bookmarks
export const updateBookmarked = createAsyncThunk(
  'manageFile/updateBookmarked',
  async (jsonData) => {
    try {
      const response = await updateFileFolderBookmark({ async: true, jsonData })
      return response.data
    } catch (error) {
      throw error
    }
  }
)

export const fileSlice = createSlice({
  name: 'fileupload',
  initialState: {
    fileAdmin: {
      data: []
    },
    fileUser: {
      data: [],
      is_bookmark: false
    },
    fileUserBookmark: {
      data: []
    }
  },
  reducers: {
    uploadFile: (state, action) => {
      state.fileAdmin.data = [...action?.payload, ...state?.fileAdmin?.data]
    },
    uploadFileList: (state, action) => {
      state.fileAdmin = action?.payload
    },
    deleteFile: (state, action) => {
      const index = state.fileAdmin.data.findIndex((x) => x.id === action.payload)
      if (index >= 0) {
        state.fileAdmin.data.splice(index, 1)
      }
    },
    uploadFileListUser: (state, action) => {
      state.fileUser = action?.payload
    },
    updateFileListUser: (state, action) => {
      const { fileId, folderId } = action.payload
      const movedFile = state.fileUser.data.find((file) => file.id === fileId)

      if (movedFile) {
        movedFile.folder_id = folderId
      }

      const newState = {
        ...state,
        fileUser: {
          ...state.fileUser,
          data: [...state.fileUser.data]
        }
      }
      state.fileUser = newState
    },
    FileListUserBookmarks: (state, action) => {
      state.fileUserBookmark = action?.payload
    },
    updateFileUserIsBookmark: (state, action) => {
      const { id } = action.payload
      const index = state.fileUser.data.findIndex((x) => x.id === id)
      if (index !== -1) {
        state.fileUser.data[index].is_bookmark = !state.fileUser.data[index].is_bookmark
      }
      return state
    },
    deleteFileUser: (state, action) => {
      const index = state.fileUser.data.findIndex((x) => x.id === action.payload)
      if (index >= 0) {
        state.fileUser.data.splice(index, 1)
      }
    }
  }
})

export const {
  uploadFile,
  uploadFileList,
  deleteFile,
  uploadFileListUser,
  updateFileListUser,
  FileListUserBookmarks,
  updateFileUserIsBookmark,
  deleteFileUser,
  updateSigningFileData
} = fileSlice.actions

export default fileSlice.reducer
