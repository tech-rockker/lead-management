import '@styles/react/apps/app-users.scss'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Settings } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Card, CardBody, Col, Form, InputGroupText, Row } from 'reactstrap'
import { countryListLoad } from '../../utility/apis/commons'
import { updateSetting, viewSetting } from '../../utility/apis/setting'
import { forDecryption, UserTypes } from '../../utility/Const'
import { FM, isValid, isValidArray } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import Show from '../../utility/Show'
import {
  createSelectOptions,
  decryptObject,
  isObjEmpty,
  setValues,
  SpaceTrim,
  timeConvert
} from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'
import DropZoneImage from '../components/imageFileUploader'
import Shimmer from '../components/shimmers/Shimmer'
import Header from '../header'

const Setting = () => {
  const dispatch = useDispatch()
  const form = useForm()
  const user = useUser()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch
  } = form
  const [loading, setLoading] = useState(false)
  const [load, setLoad] = useState(true)
  const [companyData, setCompanyData] = useState(null)
  const [country, setCountry] = useState([])
  const [country_id, setCountryId] = useState(null)
  const [countryLoading, setCountryLoading] = useState(false)
  const id = user?.id

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      updateSetting({
        jsonData: {
          ...data,
          ...UserTypes.company
        },
        loading: setLoading,
        dispatch,
        success: (data) => {
          console.log(data)
        }
      })
    }
  }

  const fields = {
    company_name: '',
    company_logo: '',
    company_email: '',
    company_contact: '',
    company_website: '',
    company_address: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    follow_up_reminder: '',
    before_minute: '',
    relaxation_time: '',
    country_id: '',
    city: '',
    postal_area: '',
    zipcode: '',
    organization_number: '',
    establishment_year: ''
  }

  const loadDetails = () => {
    if (isValid(user?.id)) {
      viewSetting({
        id: user?.id,
        loading: setLoad,
        success: (e) => {
          const d = decryptObject(forDecryption, e)
          setCompanyData(d)
          setValues(fields, d, setValue)
          setValue('city', d?.company_info?.city)
          setValue('zipcode', d?.company_info?.zipcode)
          setValue('postal_area', d?.company_info?.postal_area)
          // setValue('company_address', d?.company_address)
        }
      })
    }
  }

  const loadCountryTypes = () => {
    countryListLoad({
      loading: setCountryLoading,
      success: (d) => {
        setCountry(createSelectOptions(d?.payload, 'name', 'id'))

        setCountryId(d?.payload?.find((a) => a.name === 'Sweden')?.id)
        setValue('country_id', d?.payload?.find((a) => a.name === 'Sweden')?.id)
      }
    })
  }

  useEffect(() => {
    loadCountryTypes()
  }, [])

  useEffect(() => {
    if (!isValid(id)) {
      reset()
    }
    if (!isValid(companyData)) {
      loadDetails()
    }
  }, [companyData, id])

  useEffect(() => {
    if (watch('follow_up_reminder') === 0) {
      setValue('before_minute', '')
    }
  }, [watch('follow_up_reminder')])

  return (
    <>
      <Header icon={<Settings size='25' />} />
      {load ? (
        <>
          <Row>
            <Col md='8' className='d-flex align-items-stretch'>
              <Card>
                <CardBody>
                  <Row>
                    <Col md='6'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='6'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='12' className='mt-2'>
                      <Shimmer style={{ height: 320 }} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md='4' className='d-flex align-items-stretch'>
              <Card>
                <CardBody>
                  <Row>
                    <Col md='12'>
                      <Shimmer style={{ height: 40 }} />
                    </Col>
                    <Col md='12' className='mt-2'>
                      <Shimmer style={{ height: 320 }} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col
                md='8'
                className='d-flex align-items-stretch animate__animated animate__fadeInUp'
              >
                <Card>
                  <CardBody>
                    <Row>
                      <Col md='6'>
                        <FormGroupCustom
                          key={`NAME${companyData?.company_name}`}
                          label={'company-name'}
                          name={'company_name'}
                          type={'text'}
                          errors={errors}
                          values={companyData}
                          className={classNames('mb-2', {
                            'pointer-events-none': isValid(companyData)
                          })}
                          control={control}
                          rules={{ required: true }}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          key={`NAME${companyData?.email}`}
                          label={'company-email'}
                          name={'company_email'}
                          type={'email'}
                          errors={errors}
                          values={companyData}
                          className={classNames('mb-2', {
                            'pointer-events-none': isValid(companyData)
                          })}
                          control={control}
                          rules={{ required: true }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <FormGroupCustom
                          key={`NAME${companyData?.company_contact}`}
                          name={'company_contact'}
                          type={'number'}
                          errors={errors}
                          label={FM('company-contact')}
                          className='mb-2'
                          control={control}
                          rules={{ required: true, maxLength: 12 }}
                          values={companyData}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          key={`NAME${companyData?.company_website}`}
                          name={'company_website'}
                          type={'text'}
                          errors={errors}
                          label={FM('company-website')}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
                          values={companyData}
                        />
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          key={`NAME${companyData?.organization_number}`}
                          name={'organization_number'}
                          type={'text'}
                          errors={errors}
                          label={FM('organization-number')}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
                          values={companyData}
                        />
                      </Col>
                     
                      <Col md='12'>
                        <FormGroupCustom
                          key={`NAME${companyData?.company_address}`}
                          name={'company_address'}
                          type={'textarea'}
                          errors={errors}
                          label={FM('company-address')}
                          className='mb-2'
                          control={control}
                          rules={{ required: true }}
                          values={companyData}
                        />
                      </Col>

                      <Col md='6'>
                        <FormGroupCustom
                          key={`NAME${companyData?.company_info?.postal_area}`}
                          name={'postal_area'}
                          label={FM('postal-area')}
                          type={'text'}
                          errors={errors}
                          className=''
                          control={control}
                          rules={{
                            required: false,
                            validate: (v) => {
                              return isValid(v) ? !SpaceTrim(v) : true
                            }
                          }}
                          value={companyData?.company_info?.postal_area}
                        />
                      </Col>

                      <Col md='6'>
                        <FormGroupCustom
                          key={`NAME${companyData?.company_info?.zipcode}`}
                          name={'zipcode'}
                          label={FM('postal-code')}
                          type={'text'}
                          errors={errors}
                          className='mb-2'
                          control={control}
                          rules={{
                            required: false,
                            minLength: '5',
                            maxLength: '5',
                            validate: (v) => {
                              return isValid(v) ? !SpaceTrim(v) : true
                            }
                          }}
                          value={companyData?.company_info?.zipcode}
                        />
                      </Col>

                      <Col md='6'>
                        <FormGroupCustom
                          key={`NAME${companyData?.company_info?.city}`}
                          name={'city'}
                          type={'text'}
                          errors={errors}
                          className='mb-2'
                          control={control}
                          rules={{
                            required: false,
                            validate: (v) => {
                              return isValid(v) ? !SpaceTrim(v) : true
                            }
                          }}
                          value={companyData?.company_info?.city}
                        />
                      </Col>

                      <Col md='6'>
                        <FormGroupCustom
                          key={`NAME${companyData?.country_id}`}
                          options={country}
                          label={FM('country')}
                          name={'country_id'}
                          type={'select'}
                          className='mb-2'
                          isClearable
                          isDisabled={countryLoading}
                          isLoading={countryLoading}
                          control={control}
                          rules={{ required: false }}
                          errors={errors}
                          value={companyData?.country_id ?? watch('country_id')}
                        />
                      </Col>

                      <Col md='6' className='mt-1'>
                        <FormGroupCustom
                          prepend={
                            <InputGroupText>
                              <FormGroupCustom
                                key={`NAME${companyData?.follow_up_reminder}`}
                                noGroup
                                noLabel
                                tooltip={FM('enable')}
                                values={companyData}
                                type='checkbox'
                                name='follow_up_reminder'
                                label={FM('follow-up-reminder')}
                                className='mb-1'
                                errors={errors}
                                control={control}
                                rules={{ required: false }}
                              />
                            </InputGroupText>
                          }
                          values={companyData}
                          key={`NAME${companyData?.before_minute}`}
                          placeholder={FM('time-in-minute')}
                          type='number'
                          refreshInput={watch('follow_up_reminder') === 0}
                          message={FM('time-limit-reminder')}
                          name='before_minute'
                          label={FM('follow-up-reminder')}
                          className='mb-1'
                          disabled={!watch('follow_up_reminder')}
                          errors={errors}
                          control={control}
                          rules={{ required: watch('follow_up_reminder'), min: 1, max: 240 }}
                        />
                        <Show IF={isValid(watch('before_minute'))}>
                          <p className='mb-1 text-primary fw-bold'>
                            {FM('you-will-be-reminded-before')}{' '}
                            {timeConvert(watch('before_minute'), FM)}
                          </p>
                        </Show>
                      </Col>
                      <Col md='6' className='mt-1'>
                        <FormGroupCustom
                          values={companyData}
                          key={`NAME${companyData?.relaxation_time}`}
                          placeholder={FM('time-in-minute')}
                          type='number'
                          message={FM('time-limit-reminder')}
                          name='relaxation_time'
                          label={FM('relaxation-time')}
                          className='mb-1'
                          errors={errors}
                          control={control}
                          rules={{ required: true, min: 1, max: 240 }}
                        />
                        <Show IF={isValid(watch('relaxation_time'))}>
                          <p className='mb-1 text-primary fw-bold'>
                            {FM('you-will-be-relaxed')} {timeConvert(watch('relaxation_time'), FM)}
                          </p>
                        </Show>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col
                md='4'
                className='d-flex align-items-stretch animate__animated animate__fadeInUp'
              >
                <Card>
                  <CardBody>
                    <Row>
                      <Col md='12' className='mb-2'>
                        <FormGroupCustom
                          noLabel
                          name={'company_logo'}
                          type={'hidden'}
                          errors={errors}
                          control={control}
                          rules={{ required: false }}
                          values={companyData}
                        />
                        <DropZoneImage
                          maxSize={2}
                          accept={'image/*'}
                          value={companyData?.company_logo}
                          onSuccess={(e) => {
                            if (isValidArray(e)) {
                              setValue('company_logo', e[0]?.file_name)
                            } else {
                              setValue('company_logo', null)
                            }
                          }}
                        />
                      </Col>
                      <Col sm='12'>
                        <LoadingButton block loading={loading} color='primary' type='submit'>
                          {FM('save')}
                        </LoadingButton>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  )
}
export default Setting
