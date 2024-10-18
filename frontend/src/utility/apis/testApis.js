import { FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify'
import ApiEndpoints from '../http/ApiEndpoints'
import http from '../http/useHttp'

export const testApi = ({
  formData,
  success = () => {},
  loading = () => {},
  errorMessage = 'loading-error'
}) => {
  http.request({
    method: 'post',
    auth: false,
    path: ApiEndpoints.test,
    formData,
    loading,
    success,
    error: () => {
      toast(<FormattedMessage id={errorMessage} />, { type: toast.TYPE.ERROR })
    }
  })
}
