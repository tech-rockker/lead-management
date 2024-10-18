import { useSkin } from '@hooks/useSkin'
import '@styles/react/pages/page-authentication.scss'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { CardText, CardTitle, Col, Form, Row } from 'reactstrap'
import themeConfig from '../../configs/themeConfig'
import { getPath } from '../../router/RouteHelper'
import { addCompLicense } from '../../utility/apis/licenseApis'
import { FM } from '../../utility/helpers/common'
import { isObjEmpty } from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'

const LicenseRenew = () => {
  const user = useSelector((state) => state.auth.userLicense)
  const form = useForm()
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue
  } = form
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      addCompLicense({
        token: user?.access_token,
        jsonData: {
          ...data,
          user_id: user?.top_most_parent_id
        },
        loading: setLoading,
        // dispatch,
        success: (data) => {
          history.push(getPath('authentication'))
        }
      })
    }
  }

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

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
              {FM('your-licence-had-expired')} 👋
            </CardTitle>
            <CardText className='mb-1'>
              {FM('to-renew-your-licence-please-fill-the-details-below')}
            </CardText>
            <Form className='form-control' onSubmit={handleSubmit(onSubmit)}>
              <FormGroupCustom
                label={FM('licence-key')}
                type='text'
                name='licence_key'
                feedback={FM('please-enter-valid-license')}
                className='mb-1'
                errors={errors}
                control={control}
                rules={{
                  required: true
                }}
              />
              <LoadingButton loading={loading} type='submit' color='primary' block>
                {FM('accept')}
              </LoadingButton>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LicenseRenew
