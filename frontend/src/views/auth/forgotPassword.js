import { Link } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
import { ChevronLeft } from 'react-feather'
import { Row, Col, CardTitle, CardText, Form, FormGroup, Label, Input, Button } from 'reactstrap'
// import '@styles/base/pages/page-auth.scss'
import themeConfig from '../../configs/themeConfig'
import { FM, log } from '../../utility/helpers/common'
import { useForm } from 'react-hook-form'
import { isObjEmpty } from '../../utility/Utils'
import { forgotPassword } from '../../utility/apis/authenticationApis'
import { useState } from 'react'
import LoadingButton from '../components/buttons/LoadingButton'
import classNames from 'classnames'
import '@styles/react/pages/page-authentication.scss'
import FormGroupCustom from '../components/formGroupCustom'
import { Patterns } from '../../utility/Const'
import { getPath } from '../../router/RouteHelper'

const ForgotPassword = () => {
  const { skin } = useSkin()
  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
    setValue
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [reset, setReset] = useState(null)

  const illustration = skin === 'dark' ? 'forgot-password-v2-dark.svg' : 'forgot-password-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = (data) => {
    log('formDat', data)
    if (isObjEmpty(errors)) {
      forgotPassword({
        formData: {
          ...data,
          device: 'web'
        },
        loading: setLoading,
        success: (d) => {
          // clear entered email
          setValue('email', '')
         setReset()

        },
        error: (e) => {
          setError('email', { message: e?.message ?? 'djkdsl' })
        }
      })
    }
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
          <img
            style={{ width: 30, height: 25 }}
            className='img-fluid'
            src={require('../../assets/images/logo/logo.png').default}
          />
          <h2 className='brand-text text-primary ms-1'>{themeConfig.app.appName}</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login V2' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='font-weight-bold mb-1'>
              {FM('forgot-password')} 🔒
            </CardTitle>
            <CardText className='mb-2'>{FM('forgot-password-message')}</CardText>
            <Form className='auth-forgot-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroupCustom
                type={'text'}
                key={reset}
                name='email'
                control={control}
                errors={errors}
                className='mb-1'
                rules={{ required: true, pattern: Patterns.EmailOnly }}
                feedback={FM('please-enter-valid-email')}
              />
              <LoadingButton loading={loading} color='primary' type='submit' block>
                {FM('send-reset-link')}
              </LoadingButton>
            </Form>
            <p className='text-center mt-2'>
              <Link to={getPath('authentication')}>
                <ChevronLeft className='mr-25' size={14} />
                <span className='align-middle'>{FM('back-to-login')}</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default ForgotPassword
