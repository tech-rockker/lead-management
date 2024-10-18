import '@styles/react/apps/app-users.scss'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'
import { saveBranch, updateBranch } from '../../utility/apis/branch'
import { countryListLoad } from '../../utility/apis/commons'
import { loadCompanyType } from '../../utility/apis/compTypeApis'
import { loadPackages } from '../../utility/apis/packagesApis'
import { loadRole } from '../../utility/apis/roles'
import { viewUser } from '../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../utility/Const'
import { FM, isValid, isValidArray } from '../../utility/helpers/common'
// import { FM, isValid, log } from "../"
import useUser from '../../utility/hooks/useUser'
import {
  createAsyncSelectOptions,
  createSelectOptions,
  decryptObject,
  getKeyByValue,
  jsonDecodeAll,
  setValues,
  SpaceTrim,
  SuccessToast,
  updateRequiredOnly,
  getAge
} from '../../utility/Utils'
import DropZone from '../components/buttons/fileUploader'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'
import Shimmer from '../components/shimmers/Shimmer'
import Header from '../header'

const BranchForm = () => {
  const dispatch = useDispatch()
  const form = useForm()
  const users = useUser()
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
  const params = useParams()
  const history = useHistory()
  const [companyData, setCompanyData] = useState(null)
  const id = params.id
  const [comp, setComp] = useState([])
  const [val, setVal] = useState([])
  const [packaged, setPackaged] = useState([])
  const [user, setUser] = useState([])
  const [userLaod, setUserLoad] = useState(false)
  const [country, setCountry] = useState([])
  const [country_id, setCountryId] = useState(null)
  const [countryLoading, setCountryLoading] = useState(false)

  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCompanyType({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setComp)
  }

  // const loadUserTypeOptions = async (search, loadedOptions, { page }) => {
  //     const res = await loadRole({
  //         async: true,
  //         page,
  //         perPage: 100,
  //         jsonData: { name: search, user_type_id: 11 }
  //     })
  //     return createAsyncSelectOptions(res, page, "name", "id", setUser)
  // }
  const loadPackageOptions = async (search, loadedOptions, { page }) => {
    const res = await loadPackages({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setPackaged)
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

  const loadUserTypeOptions = () => {
    loadRole({
      loading: setUserLoad,

      jsonData: { user_type_id: 11 },
      success: (d) => {
        setUser(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }
  useEffect(() => {
    if (user?.id) {
    }
  }, [])

  useEffect(() => {
    loadUserTypeOptions()
    loadCountryTypes()
  }, [])

  const genPassword = Math.random().toString(36).substring(2, 12)
  const onSubmit = (data) => {
    // eslint-disable-next-line prefer-template
    // const tempCompanyTypeId = '' + data?.company_type_id
    if (isValid(id)) {
      const _data = {
        ...data,
        //company_type_id: val !== null ? val : JSON?.parse(companyData?.company_type_id),
        company_type_id: isValid(data?.company_type_id) ? [data?.company_type_id] : null,
        personal_number: String(data?.personal_number).replaceAll('-', ''),
        user_type_id: 11,
        password: genPassword,
        country_id: 209,
        confirm_password: genPassword
      }
      updateBranch({
        id,
        jsonData: updateRequiredOnly(_data, companyData),
        dispatch,
        loading: setLoading,
        success: (e) => {
          SuccessToast('updated')
          history.push('/branch')

          // history.push(getPath("branch"))
        }
      })
    } else {
      saveBranch({
        jsonData: {
          ...data,
          company_type_id: isValid(data?.company_type_id) ? [data?.company_type_id] : null,
          user_type_id: 11,
          documents: data?.documents,
          country_id: 209,
          password: genPassword,
          'confirm-password': genPassword,
          personal_number: String(data?.personal_number).replaceAll('-', '')
          // gender: "male"
        },
        loading: setLoading,
        dispatch,
        success: (data) => {
          // showForm()
          // setAdded(data?.payload?.id)
          // SuccessToast("done")
          // history.push(getPath("branch"))
          history.push('/branch')
        }
      })
    }
  }

  const f = {
    company_type_id: 'json',
    documents: 'json',
    role_id: '',
    name: '',
    email: '',
    branch_id: '',
    contact_number: '',
    contact_person_name: '',
    contact_person_number: '',
    personal_number: '',
    organization_number: '',
    country_id: '',
    city: '',
    postal_code: '',
    zipcode: '',
    full_address: '',
    license_key: '',
    license_end_date: '',
    is_substitute: '',
    is_regular: '',
    is_seasonal: '',
    joining_date: '',
    establishment_date: '',
    user_color: '',
    is_file_required: '',
    entry_mode: '',
    postal_area: '',
    branch_name: '',
    branch_email: ''
  }

  const modifyField = (key, value) => {
    return value
  }
  const loadDetails = () => {
    if (isValid(id)) {
      viewUser({
        id,
        jsonData: {
          user_type_id: UserTypes.branch
        },
        loading: setLoad,
        success: (d) => {
          const valuesT = jsonDecodeAll(f, d)
          const values = decryptObject(forDecryption, valuesT)

          setCompanyData(values)
          setValues(f, { values, company_type_id: d?.company_types[0]?.id }, setValue, modifyField)
          setValue('company_type_id', d?.company_types[0]?.id)
        }
      })
    }
  }

  useEffect(() => {
    if (!isValid(id)) {
      reset()
    }
    if (!isValid(companyData)) {
      loadDetails()
    }
  }, [companyData])

  useEffect(() => {
    if (!id) {
      setLoad(false)
      setCompanyData({})
    }
    return () => {}
  }, [])

  const multiSelectHandle = (e) => {
    // eslint-disable-next-line prefer-template
    setVal(Array.isArray(e) ? e.map((x) => '' + x.value) : [])
  }
  const options = { delimiters: ['-'], blocks: [8, 4] }

  useEffect(() => {
    if (!isValid(id)) {
      if (isValidArray(users?.company_types)) {
        setValue('company_type_id', users?.company_types[0]?.id)
      }
    }
  }, [users, id])

  return (
    <>
      <Header subHeading={companyData?.branch_name ? FM('update-branch') : FM('create-branch')} />
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
              <Col md='8' className='d-flex align-items-stretch'>
                <Card>
                  <CardBody>
                    {companyData ? (
                      <>
                        <Row>
                          <h4 className='mb-2'>{FM('branch-details')}</h4>
                          <Col md='6'>
                            <FormGroupCustom
                              label={'branch-name'}
                              name={'branch_name'}
                              type={'text'}
                              errors={errors}
                              values={companyData}
                              className='mb-2'
                              control={control}
                              rules={{
                                required: true,
                                validate: (v) => {
                                  return isValid(v) ? !SpaceTrim(v) : true
                                }
                              }}
                            />
                          </Col>

                          <Col md='6'>
                            <FormGroupCustom
                              label={'branch-email'}
                              name={'branch_email'}
                              type={'email'}
                              disabled={companyData?.branch_email}
                              errors={errors}
                              values={companyData}
                              className='mb-2'
                              control={control}
                              rules={{ required: true }}
                            />
                          </Col>

                          <hr />

                          <Col md='6'>
                            <FormGroupCustom
                              label={'contact-person-name'}
                              name={'name'}
                              type={'text'}
                              errors={errors}
                              values={companyData}
                              className='mb-2'
                              control={control}
                              rules={{
                                required: true,
                                validate: (v) => {
                                  return isValid(v) ? !SpaceTrim(v) : true
                                }
                              }}
                            />
                          </Col>

                          <Col md='6'>
                            <FormGroupCustom
                              label={'contact_person_email'}
                              name={'email'}
                              type={'email'}
                              disabled={companyData?.email}
                              errors={errors}
                              values={companyData}
                              className='mb-2'
                              control={control}
                              rules={{ required: true }}
                            />
                          </Col>

                          <Col md='6'>
                            <FormGroupCustom
                              label={'contact-person-number'}
                              name={'contact_number'}
                              type={'number'}
                              errors={errors}
                              values={companyData}
                              className='mb-2'
                              control={control}
                              rules={{
                                required: false,
                                maxLength: '12',
                                minLength: '9',
                                validate: (v) => {
                                  return isValid(v) ? !SpaceTrim(v) : true
                                }
                              }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              name={'personal_number'}
                              type={'mask'}
                              errors={errors}
                              value={companyData?.personal_number}
                              maskOptions={options}
                              feedback={FM('invalid-personal-number')}
                              className='mb-2'
                              placeholder='YYYYMMDD-XXXX'
                              control={control}
                              rules={{
                                required: false,
                                // minLength: "13",
                                validate: (v) => {
                                  if (!v) {
                                    return true // Allow empty value
                                  }
                                  return (
                                    getAge(v, FM, true) &&
                                    String(v).replaceAll('-', '').length === 12
                                  )
                                }
                              }}
                            />
                          </Col>
                        </Row>
                        <h4 className='mb-2 mt-2'>{FM('full-address-details')}</h4>
                        <Row>
                          <Col md='12'>
                            <FormGroupCustom
                              name={'full_address'}
                              type={'textarea'}
                              label={'full-address'}
                              errors={errors}
                              className='mb-2'
                              control={control}
                              rules={{
                                required: false,
                                validate: (v) => {
                                  return isValid(v) ? !SpaceTrim(v) : true
                                }
                              }}
                              values={companyData}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
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
                          <Col md='6'>
                            <FormGroupCustom
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
                              values={companyData}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
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
                              values={companyData}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              name={'zipcode'}
                              label={FM('postal-code')}
                              type={'number'}
                              errors={errors}
                              className=''
                              control={control}
                              rules={{
                                required: false,
                                minLength: 5,
                                maxLength: 5,
                                validate: (v) => {
                                  return isValid(v) ? !SpaceTrim(v) : true
                                }
                              }}
                              values={companyData}
                            />
                          </Col>
                          <h4 className='mb-3 mt-2'>{FM('upload-document')}</h4>
                          {/* <DropZone multiple maxFiles={5} onSuccess={e => {
                                                    setValue("documents", e?.map((d, i) => {
                                                        return {
                                                            file_name: d?.uploading_file_name,
                                                            file_url: d?.file_name
                                                        }
                                                    }))
                                                }
                                                } /> */}
                          <Col md='12'>
                            <FormGroupCustom
                              noLabel
                              name={'documents'}
                              type={'hidden'}
                              errors={errors}
                              control={control}
                              rules={{ required: false }}
                              values={companyData}
                            />
                            <DropZone
                              value={
                                isValidArray(companyData?.documents)
                                  ? companyData?.documents[0]?.file_url
                                  : null
                              }
                              name={
                                isValidArray(companyData?.documents)
                                  ? companyData?.documents[0]?.file_name
                                  : null
                              }
                              onSuccess={(e) => {
                                if (isValidArray(e)) {
                                  setValue('documents', [
                                    {
                                      file_url: e[0]?.file_name,
                                      file_name: e[0]?.uploading_file_name
                                    }
                                  ])
                                } else {
                                  setValue('documents', [])
                                }
                              }}
                            />
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </CardBody>
                </Card>
              </Col>
              <Col md='4' className='d-flex align-items-stretch'>
                <Card>
                  <CardBody>
                    {companyData ? (
                      <Row>
                        <Col md='12'>
                          <FormGroupCustom
                            key={companyData?.id}
                            label={'branch-types'}
                            type={'select'}
                            async
                            defaultOptions
                            value={watch('company_type_id')}
                            control={control}
                            options={comp}
                            loadOptions={loadTypeOptions}
                            name={'company_type_id'}
                            className='mb-2'
                            rules={{ required: true }}
                          />
                        </Col>

                        <Col md='12'>
                          <FormGroupCustom
                            value={companyData?.user_color}
                            type='color'
                            name='user_color'
                            label={FM('user_color')}
                            className='mb-1'
                            errors={errors}
                            control={control}
                          />
                        </Col>
                        <Col sm='12'>
                          <LoadingButton
                            block
                            loading={loading}
                            className='mt-2'
                            color='primary'
                            type='submit'
                          >
                            {FM('save')}
                          </LoadingButton>
                        </Col>
                      </Row>
                    ) : null}
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

export default BranchForm
