// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { JsonParseValidate } from '../../../utility/Utils'

export const packageSlice = createSlice({
  name: 'package',
  initialState: { pack: null },
  reducers: {
    packageUpdate: (state, action) => {
      state.pack = action.payload?.package_details
    }
  }
})

export const { packageUpdate } = packageSlice.actions

export default packageSlice.reducer
