// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'

const config = useJwt.jwtConfig

const initialUser = () => {
  const item = window.localStorage.getItem('AcceussUserData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser(),
    userLicense: null,
    userLicenseStatus: null,
    access_token: initialUser()?.access_token
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      state[config.storageTokenKeyName] = action.payload[config.storageTokenKeyName]
      state[config.storageRefreshTokenKeyName] = action.payload[config.storageRefreshTokenKeyName]
      localStorage.setItem('AcceussUserData', JSON.stringify(action.payload))
      localStorage.setItem(config.storageTokenKeyName, JSON.stringify(action.payload.access_token))
      localStorage.setItem(
        config.storageRefreshTokenKeyName,
        JSON.stringify(action.payload.access_token)
      )
    },
    handleLogout: (state, action) => {
      // action.payload.push("/authentication")
      state.userData = {}
      state[config.storageTokenKeyName] = null
      state[config.storageRefreshTokenKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem('AcceussUserData')
      localStorage.removeItem('branch_id_aceuss')
      localStorage.removeItem(config.storageTokenKeyName)
      localStorage.removeItem(config.storageRefreshTokenKeyName)
      action.payload.go('/authentication')
    },
    handleLicense: (state, action) => {
      state.userLicense = action.payload
    },
    handleLicenseStatus: (state, action) => {
      state.userLicenseStatus = action.payload
    }
  }
})

export const { handleLogin, handleLogout, handleLicense } = authSlice.actions

export default authSlice.reducer
