import '@styles/react/apps/app-users.scss'
import classNames from 'classnames'
import { use } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { Card, CardBody, Col, Form, Input, Label, Row } from 'reactstrap'
import { getPath } from '../../router/RouteHelper'
import { countryListLoad } from '../../utility/apis/commons'
import { addComp, editComp, viewComp } from '../../utility/apis/companyApis'
import { loadCompanyType } from '../../utility/apis/compTypeApis'
import { loadModule } from '../../utility/apis/moduleApis'
import { loadPackages } from '../../utility/apis/packagesApis'
import { loadRole } from '../../utility/apis/roles'
import { loadUserTypes } from '../../utility/apis/userTypes'
import { forDecryption, InputMask } from '../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../utility/helpers/common'
import Show from '../../utility/Show'
import {
  addDay,
  CheckIfCheckZero,
  compStatus,
  createAsyncSelectOptions,
  createSelectOptions,
  decryptObject,
  enableFutureDates,
  formatDate,
  getAge,
  jsonDecodeAll,
  setValues,
  SpaceTrim,
  SuccessToast,
  updateRequiredOnly
} from '../../utility/Utils'
import DropZone from '../components/buttons/fileUploader'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'
import Shimmer from '../components/shimmers/Shimmer'
import Header from '../header'

const CompanyForm = () => {
  const dispatch = useDispatch()
  const form = useForm({
    defaultValues: {
      status: 1
    }
  })
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
  const [packaged, setPackaged] = useState([])
  const [user, setUser] = useState([])
  const [country, setCountry] = useState([])
  const [country_id, setCountryId] = useState(null)
  const [countryLoading, setCountryLoading] = useState(false)
  const ref = useRef()
  const [val, setVal] = useState([])
  const [licenseKey, setLicenseKey] = useState(null)
  const [module, setModule] = useState([])
  const [modules, setModules] = useState([])
  const [moduleReload, setModuleReload] = useState(false)
  const [compType, setCompType] = useState([])
  const [compTypeReload, setCompTypeReload] = useState(false)

  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCompanyType({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setComp)
  }

  const loadUserTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadRole({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setUser)
  }
  const loadPackageOptions = async (search, loadedOptions, { page }) => {
    const res = await loadPackages({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPackaged)
  }
  // const loadCountryTypes = () => {
  //     countryListLoad({
  //         loading: setCountryLoading,
  //         success: d => {
  //             setCountry(createSelectOptions(d?.payload, "name", "id"))
  //         }
  //     })
  // }

  const storage = [
    {
      value: 1024,
      label: '1 GB'
    },
    {
      value: 5120,
      label: '5 GB'
    },
    {
      value: 10240,
      label: '10 GB'
    },
    {
      value: -1,
      label: 'Unlimited'
    }
  ]

  const loadModules = () => {
    loadModule({
      loading: setModuleReload,
      success: (d) => {
        setModules(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }

  const loadCompType = () => {
    loadCompanyType({
      loading: setCompTypeReload,
      success: (d) => {
        setCompType(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
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

  const loadModulesOptions = async (search, loadedOptions, { page }) => {
    const res = await loadModule({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setModule)
  }

  useEffect(() => {
    loadCountryTypes()
    log(ref)
    loadModules()
    loadCompType()
  }, [])

  // form data
  const formFields = {
    avatar: '',
    user_type_id: '',
    role_id: '',
    company_type_id: 'json',
    name: '',
    email: '',
    contact_number: '',
    gender: '',
    personal_number: '',
    organization_number: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    contact_person_number: '',
    country_id: '',
    zipcode: '',
    city: '',
    postal_code: '',
    full_address: '',
    licence_key: '',
    licence_end_date: '',
    is_substitute: '',
    is_regular: '',
    is_seasonal: '',
    joining_date: '',
    establishment_date: '',
    user_color: '',
    is_file_required: '',
    package_id: '',
    modules: 'json',
    documents: 'json',
    total_storage: '',
    postal_area: '',
    status: '',
    company_name: '',
    company_email: ''
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  function generateString(length) {
    let result = ' '
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
  }

  const genPassword = Math.random().toString(36).substring(2, 12)
  // console.log(genPassword)

  const onSubmit = (data) => {
    if (isValid(id)) {
      const _data = {
        ...data,
        user_type_id: 2,
        avatar: data?.avatar
      }
      editComp({
        id,
        jsonData: updateRequiredOnly(_data, companyData),
        dispatch,
        loading: setLoading,
        success: (e) => {
          history.push(getPath('companies'))
        }
      })
    } else {
      addComp({
        jsonData: {
          ...data,
          documents: data?.documents,
          password: genPassword,
          user_type_id: 2,
          'confirm-password': genPassword
        },
        loading: setLoading,
        dispatch,
        success: (data) => {
          // showForm()
          // setAdded(data?.payload?.id)
          // SuccessToast("done")
          history.push(getPath('companies'))
        }
      })
    }
  }
  const modifyField = (key, value) => {
    return value
  }

  const loadDetails = () => {
    if (isValid(id)) {
      viewComp({
        id,
        loading: setLoad,
        success: (d) => {
          const valuesTemp = jsonDecodeAll(formFields, d)
          const values = { ...valuesTemp, ...decryptObject(forDecryption, valuesTemp) }
          log('sda', values)
          setCompanyData(values)
          setValues(formFields, values, setValue, modifyField)
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
      // setValue('status', 1)
    }
    return () => {}
  }, [id])

  const multiSelectHandle = (e) => {
    // eslint-disable-next-line prefer-template
    setVal(Array.isArray(e) ? e.map((x) => '' + x.value) : [])
  }
  log(val)

  const clearErrors = () => {}

  const makeUid = () => {
    const str = 'abcdefghijklmnopqrstuvwxyz123456789'

    let string = ''
    for (let i = 0; i < 20; i++) {
      string += str[Math.floor(Math.random() * str.length)]
    }
    const final = `${string.slice(0, 5)}-${string.slice(5, 10)}-${string.slice(
      10,
      15
    )}-${string.slice(15, 20)}`

    setLicenseKey(`${final.toUpperCase()}`)
    setValue('licence_key', `${final.toUpperCase()}`)
    clearErrors('licence_key')
  }
  useEffect(() => {}, [])
  const options = { delimiters: ['-'], blocks: [8, 4] }

  return (
    <>
      <Header subHeading={id ? FM('update-company') : <>{FM('create-company')}</>} />
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
                  {/* <CardHeader className="fw-bold text-uppercase mb-2">
                                {FM("company-details")}
                            </CardHeader> */}
                  <CardBody>
                    {companyData ? (
                      <>
                        <Row>
                          <h4 className='mb-2'>{FM('company-details')}</h4>
                          <Col md='6'>
                            <FormGroupCustom
                              label={'company-name'}
                              name={'company_name'}
                              type={'text'}
                              errors={errors}
                              value={companyData?.company_setting?.company_name}
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
                              label={'company_email'}
                              name={'company_email'}
                              type={'email'}
                              errors={errors}
                              value={companyData?.company_setting?.company_email}
                              // className={classNames("mb-2", { "pointer-events-none": isValid(companyData) })}
                              disabled={isValid(companyData?.company_setting?.company_email)}
                              control={control}
                              rules={{ required: true }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              name={'contact_number'}
                              type={'number'}
                              errors={errors}
                              values={companyData}
                              className='mb-2'
                              control={control}
                              rules={{
                                required: true,
                                minLength: '9',
                                maxLength: '12',
                                validate: (v) => {
                                  return isValid(v) ? !SpaceTrim(v) : true
                                }
                              }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              name={'organization_number'}
                              type={'number'}
                              errors={errors}
                              values={companyData}
                              className='mb-2'
                              control={control}
                              rules={{
                                required: true,
                                minLength: '10',
                                maxLength: '12',
                                validate: (v) => {
                                  return isValid(v) ? !SpaceTrim(v) : true
                                }
                              }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              name={'establishment_year'}
                              type={'number'}
                              errors={errors}
                              className='mb-2'
                              control={control}
                              rules={{ required: false }}
                              values={companyData}
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
                              errors={errors}
                              values={companyData}
                              // className={classNames("mb-2", { "pointer-events-none": isValid(companyData) })}
                              disabled={isValid(companyData?.email)}
                              control={control}
                              rules={{ required: true }}
                            />
                          </Col>
                          <Col md='6'>
                            <FormGroupCustom
                              label={'cp_contact_number'}
                              name={'contact_person_number'}
                              type={'number'}
                              errors={errors}
                              values={companyData}
                              className='mb-2'
                              control={control}
                              rules={{
                                required: false,
                                minLength: '9',
                                maxLength: '12',
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
                              values={companyData}
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
                              className=''
                              control={control}
                              rules={{
                                required: true,
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
                                required: true,
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
                              type={'text'}
                              errors={errors}
                              className=''
                              control={control}
                              rules={{
                                required: true,
                                minLength: '5',
                                maxLength: '5',
                                validate: (v) => {
                                  return isValid(v) ? !SpaceTrim(v) : true
                                }
                              }}
                              values={companyData}
                            />
                          </Col>

                          {/* <Col md="6" >
                                                    <FormGroupCustom
                                                        name={"zipcode"}
                                                        type={"number"}
                                                        errors={errors}
                                                        className="mb-2"
                                                        control={control}
                                                        rules={{ required: true, maxLength: 5 }}
                                                        values={companyData} />
                                                </Col> */}

                          <h4 className='mb-3 mt-2'>{FM('upload-document')}</h4>
                          {/* <Col md="12" >
                                                    <FormGroupCustom
                                                        noLabel
                                                        name={"documents"}
                                                        type={"hidden"}
                                                        errors={errors}
                                                        control={control}
                                                        rules={{ required: false }}
                                                        values={companyData} />
                                                    <DropZone value={companyData?.documents?.file_url} name={companyData?.documents?.file_name} onSuccess={e => {
                                                        if (isValidArray(e)) {
                                                            setValue("documents", [{ file_url: e[0]?.file_name, file_name: e[0]?.uploading_file_name }])
                                                        } else {
                                                            setValue("documents", [])
                                                        }
                                                    }} />

                                                </Col> */}
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
                  {/* <CardHeader className="fw-bold text-uppercase mb-2">
                                {FM("company-details")}
                            </CardHeader> */}
                  <CardBody>
                    {companyData ? (
                      <Row>
                        <Col md='12' className='d-flex justify-content-between'>
                          <label className='fw-bolder mb-1'>{FM('status')}</label>
                          <div className='form-switch form-check-primary mb-2'>
                            <FormGroupCustom
                              noLabel
                              noGroup
                              name={'status'}
                              type={'switch'}
                              errors={errors}
                              className=''
                              control={control}
                              onChangeValue={(e) => {
                                log(e)
                                setValue('status', e === true ? 1 : 3)
                              }}
                              // options={compStatus()}
                              // onChange={CheckIfCheckZero()}
                              // rules={{
                              //     required: true,
                              //     maxLength: "5",
                              //     validate: (v) => {
                              //         return isValid(v) ? !SpaceTrim(v) : true
                              //     }
                              // }}
                              // values={companyData}
                              checked={watch('status') === 1}
                              // value={1}
                            />
                          </div>
                        </Col>

                        <Col md='12'>
                          {/* <FormGroupCustom
                            label={'company-types'}
                            type={'select'}
                            async
                            isMulti
                            key={`companyType-${comp.length}`}
                            value={companyData?.company_type_id}
                            defaultOptions
                            control={control}
                            options={comp}
                            loadOptions={loadTypeOptions}
                            name={'company_type_id'}
                            rules={{ required: true }}
                            className='mb-2'
                          /> */}
                          <FormGroupCustom
                            label={'company-types'}
                            key={`companyType-${comp.length}`}
                            type={'select'}
                            isClearable
                            isMulti
                            defaultOptions
                            control={control}
                            options={compType}
                            value={companyData?.company_type_id}
                            name={'company_type_id'}
                            rules={{ required: true }}
                            className='mb-2'
                          />
                        </Col>
                        <Col md='12'>
                          {/* <FormGroupCustom
                              label={FM('Modules')}
                              key={`module-${module.length}`}
                              name={'modules'}
                              errors={errors}
                              type={'select'}
                              async
                              isMulti
                              className='mb-2'
                              defaultOptions
                              // matchWith={"id"}
                              blurInputOnSelect={false}
                              value={companyData?.assigned_module?.map((a) => a?.module_id)}
                              control={control}
                              rules={{ required: true }}
                              options={module}
                              loadOptions={loadModulesOptions}
                            /> */}

                          <FormGroupCustom
                            label={FM('Modules')}
                            key={`module-${module.length}`}
                            type={'select'}
                            isClearable
                            isMulti
                            defaultOptions
                            control={control}
                            options={modules}
                            value={companyData?.assigned_module?.map((a) => a?.module_id)}
                            name={'modules'}
                            rules={{ required: true }}
                            className='mb-2'
                          />
                          <Show
                            IF={
                              isValid(
                                companyData?.assigned_module?.find((a) => a.module.id === 5)
                              ) ||
                              isValid(watch('modules') && watch('modules').find((a) => a === 5))
                            }
                          >
                            <FormGroupCustom
                              label={FM('Storage')}
                              key={`storage-${storage.length}`}
                              type={'select'}
                              defaultOptions
                              control={control}
                              options={storage}
                              value={companyData?.total_storage}
                              name={'total_storage'}
                              rules={{ required: true }}
                              className='mb-2'
                            />
                          </Show>
                        </Col>
                        <Col md='12'>
                          <FormGroupCustom
                            name={'package_id'}
                            errors={errors}
                            type={'select'}
                            async
                            className='mb-2'
                            defaultOptions
                            matchWith={'id'}
                            value={companyData?.subscription?.package_details?.id}
                            control={control}
                            rules={{ required: true }}
                            options={packaged}
                            loadOptions={loadPackageOptions}
                          />
                        </Col>

                        <Col md='12'>
                          <Show
                            IF={isValid(companyData?.package_id) || isValid(watch('package_id'))}
                          >
                            <Label>
                              {FM('licence-key')} <span className='text-danger'>*</span>{' '}
                              <span
                                onClick={makeUid}
                                className='text-small-12 text-primary mb-0'
                                role={'button'}
                              >
                                ({FM('create-licence-key')})
                              </span>
                            </Label>

                            <FormGroupCustom
                              disabled={isValid(companyData?.package_id)}
                              noLabel={!isValid(companyData?.package_id)}
                              key={`licenceKey-${licenseKey}-${companyData?.licence_key}`}
                              name={`licence_key`}
                              label={FM('licence-key')}
                              type={'text'}
                              errors={errors}
                              className='mb-2'
                              control={control}
                              rules={{ required: true }}
                              value={licenseKey ?? companyData?.licence_key}
                            />
                          </Show>
                        </Col>
                        <Col md='12'>
                          <Show
                            IF={isValid(companyData?.package_id) || isValid(watch('package_id'))}
                          >
                            <FormGroupCustom
                              name={'license_end_date'}
                              key={formatDate(
                                new Date(
                                  addDay(
                                    new Date(),
                                    packaged?.find((a) => a.value.id === watch('package_id'))?.value
                                      ?.validity_in_days
                                  )
                                ),
                                'YYYY-MM-DD'
                              )}
                              type={'text'}
                              errors={errors}
                              className='mb-2'
                              disabled
                              control={control}
                              rules={{ required: false }}
                              value={formatDate(
                                new Date(
                                  addDay(
                                    new Date(),
                                    packaged?.find((a) => a.value.id === watch('package_id'))?.value
                                      ?.validity_in_days
                                  )
                                ),
                                'YYYY-MM-DD'
                              )}
                            />
                          </Show>
                        </Col>
                        <Col sm='12'>
                          <LoadingButton
                            block
                            loading={loading}
                            className='mb-2'
                            color='primary'
                            type='submit'
                          >
                            {FM('save')}
                          </LoadingButton>
                          <Show IF={loading}>
                            <span className='d-block text-danger fw-bold text-center'>
                              {' '}
                              {FM('please-wait-setting-company')}
                            </span>
                          </Show>
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
export default CompanyForm
