import { useSkin } from '@hooks/useSkin'
import { Link, useParams, useHistory } from 'react-router-dom'
import { ChevronLeft } from 'react-feather'
import InputPassword from '@components/input-password-toggle'
import { Row, Col, CardTitle, CardText, Form, FormGroup, Label, Button, Input } from 'reactstrap'
// import '@styles/base/pages/page-auth.scss'
import themeConfig from '../../configs/themeConfig'
import { FM } from '../../utility/helpers/common'
import { useForm } from 'react-hook-form'
import { isObjEmpty } from '../../utility/Utils'
import { resetPassword } from '../../utility/apis/authenticationApis'
import { useState } from 'react'
import classnames from 'classnames'
import LoadingButton from '../components/buttons/LoadingButton'
import '@styles/react/pages/page-authentication.scss'
import FormGroupCustom from '../components/formGroupCustom'
import { Patterns } from '../../utility/Const'
import { getPath } from '../../router/RouteHelper'

const ResetPassword = () => {
  const token = useParams()
  const {
    formState: { errors },
    handleSubmit,
    control,
    watch
  } = useForm()
  const { skin } = useSkin()
  const [loading, setLoading] = useState(false)
  const history = useHistory()


  const illustration = skin === 'dark' ? 'reset-password-v2-dark.svg' : 'reset-password-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = (formData) => {
    if (isObjEmpty(errors)) {
      resetPassword({
        formData: { ...formData, ...token },
        loading: setLoading,
        success: (data) => {
          const timer = setTimeout(() => {
            window.location.href = '/authentication'
          }, 1000)
          return () => clearTimeout(timer)
          
          
        }
      })
    }
  }

  return (
    <div className='auth-wrapper auth-v2'>
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
              {FM('reset-password')} 🔒
            </CardTitle>
            <CardText className='mb-2'>{FM('reset-password-message')}</CardText>
            <Form className='auth-reset-password-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              {/* <FormGroupCustom
                type={'email'}
                name={'email'}
                errors={errors}
                control={control}
                feedback={FM('please-enter-valid-email')}
                className='mb-1'
                rules={{ required: true, pattern: Patterns.EmailOnly }}
              /> */}
              <FormGroupCustom
                type={'password'}
                name={'password'}
                errors={errors}
                control={control}
                message={FM('valid-password')}
                className='mb-1'
                rules={{ required: true, pattern: Patterns.Password }}
              />
              <FormGroupCustom
                type={'password'}
                name={'password_confirmation'}
                errors={errors}
                control={control}
                label={FM('confirm-password')}
                message={FM('valid-password')}
                className='mb-2'
                rules={{
                  required: true,
                  pattern: Patterns.Password,
                  validate: (value) => value === watch('password')
                }}
              />
              <LoadingButton loading={loading} color='primary' type='submit' block>
                {FM('set-new-password')}
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

export default ResetPassword
