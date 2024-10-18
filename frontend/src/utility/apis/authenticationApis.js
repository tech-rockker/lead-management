/* eslint-disable no-unused-vars */
import { handleLicense, handleLogin } from '../../redux/authentication'
import { createAbility, isValid, log } from '../helpers/common'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'
import { ErrorToast, SuccessToast } from '../Utils'

/**
 * Use this method for user login
 */
export const login = ({
  formData,
  loading = () => {},
  success = () => {},
  errorMessage = 'login-failed',
  successMessage = 'login-successful',
  dispatch = () => {},
  ability,
  redirect = true,
  history,
  error = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.login,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      // console.log(e)
      // ErrorToast(errorMessage)
    },
    success: (data) => {
      const m = {
        ...data.payload,
        branch_id: isValid(data.payload?.branch_id) ? data.payload?.branch_id : data.payload?.id,
        role: data.payload.roles,
        ability: createAbility(data?.payload?.permissions)
      }
      if (data?.payload?.licence_status === 0) {
        dispatch(handleLicense(m))
        if (redirect) history.push('/license-renew')
      } else {
        localStorage.removeItem('branch_id_aceuss')
        localStorage.removeItem('accept-terms')
        localStorage.setItem('dob', false)
        dispatch(handleLogin(m))
        // SuccessToast(successMessage)
        if (data?.payload?.permissions) ability.update(m?.ability)
        if (redirect) history.push('/')
        success(data)
      }
    }
  })
}

////////////////////forgot password ////////////////////
export const forgotPassword = ({
  formData,
  loading = () => {},
  successMessage = 'link send successfully',
  error = () => {},
  success = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.forgotPassword,
    loading,
    showErrorToast: true,
    showSuccessToast: true,
    error: (e) => {
      error(e)
    },
    success: (d) => {
      success(d)
      // SuccessToast(successMessage)
    }
  })
}

/////////////////////////////// change password ////////////////////
export const changePassword = ({
  formData,
  loading = () => {},
  successMessage = 'Password changed successfully',
  error = () => {},
  success = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.changePassword,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      console.log(e)
      // ErrorToast(errorMessage)
    },
    success: () => {
      success()
      SuccessToast(successMessage)
    }
  })
}
/////////////////////////Reset Password ////////////////////////////
export const resetPassword = ({
  formData,
  loading = () => {},
  successMessage = 'password-changed',
  history,
  error = () => {},
  success = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.resetPassword,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      console.log(e)
      // ErrorToast(errorMessage)
    },
    success: (d) => {
      SuccessToast(successMessage)
      // history.push('authentication')
      window.location.href = '/authentication'
      success(d)
    }
  })
}

/// Patient password
export const patientPassword = ({
  formData,
  loading = () => {},
  successMessage = 'Password changed successfully',
  error = () => {},
  success = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.patientPassword,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      console.log(e)
      // ErrorToast(errorMessage)
    },
    success: () => {
      success()
      SuccessToast(successMessage)
    }
  })
}

export const FakeEmailChange = ({
  formData,
  loading = () => {},
  successMessage = 'Email changed successfully',
  dispatch = () => {},
  error = () => {},
  success = () => {}
}) => {
  http.request({
    jsonData: formData,
    method: 'post',
    path: ApiEndpoints.userEmailChange,
    loading,
    showErrorToast: true,
    error: (e) => {
      error(e)
      console.log(e)
      // ErrorToast(errorMessage)
    },
    success: (d) => {
      success(d)
      SuccessToast(successMessage)
    }
  })
}
