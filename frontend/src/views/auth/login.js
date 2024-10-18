import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'
import { useSkin } from '@hooks/useSkin'
import { AbilityContext } from '@src/utility/context/Can'
// import '@styles/base/pages/page-auth.scss'
import { isObjEmpty } from '@utils'
import classnames from 'classnames'
import { Fragment, useContext, useState } from 'react'
import { Coffee } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { CardText, CardTitle, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import themeConfig from '../../configs/themeConfig'
import { getPath } from '../../router/RouteHelper'
import { login } from '../../utility/apis/authenticationApis'
import { FM } from '../../utility/helpers/common'
import LoadingButton from '../components/buttons/LoadingButton'
import '@styles/react/pages/page-authentication.scss'
import FormGroupCustom from '../components/formGroupCustom'
import { Patterns } from '../../utility/Const'
import useUserType from '../../utility/hooks/useUserType'

const Login = () => {
  const { skin } = useSkin()
  const userType = useUserType()
  const [openTermsModal, setTermsModal] = useState(false)
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setError
  } = useForm()

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = (formData) => {
    if (isObjEmpty(errors)) {
      login({
        formData,
        error: (e) => {},
        loading: setLoading,
        dispatch,
        ability,
        history
      })
    }
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>
          <h2 className='brand-text text-primary ms-1'>
            <img
              style={{ width: 30, height: 25 }}
              className='img-fluid'
              src={require('../../assets/images/logo/logo.png').default}
            />
            {themeConfig.app.appName}
          </h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              {FM('welcome')} 👋
            </CardTitle>
            <CardText className='mb-1'>{FM('please_sign_in')}</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroupCustom
                autoFocus
                type='email'
                name='email'
                feedback={FM('please-enter-valid-email')}
                className='mb-1'
                errors={errors}
                control={control}
                rules={{
                  required: true,
                  pattern: Patterns.EmailOnly
                }}
              />
              <div className='d-flex justify-content-between'>
                <Label className='form-label' for='login-password'>
                  {FM('password')}
                </Label>
                <Link to={getPath('authentication.forgotPassword')}>
                  <small>{FM('forgot-password')}</small>
                </Link>
              </div>
              {/* <div className='mb-1'>
                                <InputPasswordToggle
                                    id='login-password'
                                    name='password'
                                    className='input-group-merge'
                                    className={classnames({ 'is-invalid': errors && errors && errors['password'] })}
                                    innerRefs={register("password", { required: true })}
                                />
                            </div> */}
              <FormGroupCustom
                noLabel
                type='password'
                name='password'
                className='mb-1'
                errors={errors}
                control={control}
                rules={{ required: true }}
              />
              <LoadingButton loading={loading} type='submit' color='primary' block>
                {FM('sign-in')}
              </LoadingButton>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
