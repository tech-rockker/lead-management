import Repeater from '@components/repeater'
import '@styles/react/apps/app-users.scss'
import React, { useEffect, useState } from 'react'
import { Plus, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Label, Row } from 'reactstrap'
import { categoriesLoad } from '../../utility/apis/categories'
import { agenciesList, countryListLoad, patientTypeListLoad } from '../../utility/apis/commons'
import { loadCompanyType } from '../../utility/apis/compTypeApis'
import { loadRole } from '../../utility/apis/roles'
import { UserTypes } from '../../utility/Const'
import { loadDep } from '../../utility/apis/departments'
import { loadPackages } from '../../utility/apis/packagesApis'
import { addUser, editUser, viewUser, loadUser } from '../../utility/apis/userManagement'
import { loadUserTypes } from '../../utility/apis/userTypes'
import { FM, isValid, log } from '../../utility/helpers/common'
import {
  createAsyncSelectOptions,
  createSelectOptions,
  formatDate,
  SuccessToast,
  updateRequiredOnly
} from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'
import Shimmer from '../components/shimmers/Shimmer'
import Header from '../header'
// import { types } from 'sass'

const UserForm = ({ route }) => {
  const dispatch = useDispatch()
  const meta = route?.meta
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues
  } = form
  const [loading, setLoading] = useState(false)
  const [load, setLoad] = useState(true)
  const [edit, setEdit] = useState(null)
  const params = useParams()
  const [companyData, setCompanyData] = useState(null)
  const id = params.id
  const [comp, setComp] = useState([])
  const [compLoad, setCompLoad] = useState(false)
  //form count
  const [count, setCount] = useState(1)
  //package
  const [packaged, setPackaged] = useState([])
  //userTypeList
  const [user, setUser] = useState([])
  const [userLoad, setUserLoad] = useState([])
  //country
  const [country, setCountry] = useState([])
  const [countryLoading, setCountryLoading] = useState(false)
  //categoriesType
  const [empType, setEmpType] = useState([])
  const [empTypeLoad, setEmpTypLoad] = useState(false)
  //category
  const [category, setCategory] = useState([])
  const [categoryLoad, setCategoryLoad] = useState(false)
  //department
  const [department, setDepartment] = useState([])
  const [depLoad, setDepLoad] = useState(false)
  //branch
  const [branch, setBranch] = useState([])
  const [branchLoad, setBranchLoad] = useState(false)
  //role
  const [roles, setRoles] = useState([])
  const [roleLoad, setRoleLoad] = useState(false)
  //patient type
  const [patientType, setPatientType] = useState([])
  const [loadPatientType, setPatientTypeLoad] = useState(false)

  //Agencies List
  const [agencies, setAgencies] = useState([])
  const [agencyLoad, setAgencyLoad] = useState(false)

  //Company Types
  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCompanyType({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setComp)
  }

  const [val, setVal] = useState([])

  // const loadUserTypeOptions = async (search, loadedOptions, { page }) => {
  //     const res = await loadUserTypes({
  //         async: true,
  //         page,
  //         perPage: 100,
  //         jsonData: { name: search }
  //     })
  //     return createAsyncSelectOptions(res, page, "name", "id", setUser)
  // }

  const typesDef = (key) => {
    let type = 'Employee'
    switch (key) {
      case 'employees':
        type = 'Employee'
        break
      case 'patients':
        type = 'Patient'
        break
      case 'nurses':
        type = 'Nurse'
        break
      default:
        type = 'Employee'
        break
    }
    return type
  }

  //User Types
  const loadUserTypesOptions = () => {
    loadUserTypes({
      loading: setLoad,
      success: (d) => {
        const type = d?.payload?.find((sd) => sd?.name === typesDef(meta?.resource))
        setEdit({
          ...edit,
          user_type: type?.id
        })
        // setValue("user_type", UserTypes[meta?.userType])
        setUser(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      setValue('user_type', meta?.userType)
    }, [])
  }, [meta?.userType])

  //Packages
  const loadPackageOptions = async (search, loadedOptions, { page }) => {
    const res = await loadPackages({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setPackaged)
  }

  //Countries
  const loadCountryTypes = () => {
    countryListLoad({
      loading: setCountryLoading,
      success: (d) => {
        setCountry(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }

  const loadPatientTypeOption = () => {
    patientTypeListLoad({
      loading: setPatientTypeLoad,
      success: (d) => {
        setPatientType(createSelectOptions(d?.payload, 'designation', 'id'))
      }
    })
  }

  const loadAgencyOption = () => {
    agenciesList({
      loading: setAgencyLoad,
      success: (d) => {
        setAgencies(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }
  log('hello', agencies)
  //Emp type
  const loadAllEmpType = () => {
    countryListLoad({
      loading: setCountryLoading,
      success: (d) => {
        setCountry(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }
  ////roles
  const loadAllRoles = () => {
    loadRole({
      loading: setRoleLoad,
      success: (d) => {
        setRoles(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }
  //Category
  const loadAllCategory = () => {
    categoriesLoad({
      loading: setCategoryLoad,
      success: (d) => {
        setCategory(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }

  //Department
  const loadAllDepartment = () => {
    loadDep({
      loading: setDepLoad,
      success: (d) => {
        setDepartment(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }

  // load branch
  const loadAllBranch = () => {
    loadUser({
      loading: setBranchLoad,
      jsonData: {
        user_type_id: 11
      },
      success: (d) => {
        setBranch(createSelectOptions(d?.payload, 'branch_name', 'id'))
      }
    })
  }

  useEffect(() => {
    loadPatientTypeOption()
    loadAllBranch()
    loadAllRoles()
    loadCountryTypes()
    loadUserTypesOptions()
    loadAllCategory()
    loadAllDepartment()
    loadAgencyOption()
  }, [])

  const genPassword = Math.random().toString(36).substring(2, 12)

  const onSubmit = (data) => {
    // eslint-disable-next-line prefer-template
    const tempCompanyTypeId = '' + data?.company_type_id
    if (isValid(id)) {
      if (watch('user_type') === UserTypes.employee) {
        const _data = {
          ...data,
          country_id: 209,
          user_type_id: UserTypes.employee,
          company_type_id: [tempCompanyTypeId]
        }
        editUser({
          id,
          jsonData: updateRequiredOnly(_data, companyData),
          dispatch,
          loading: setLoading,
          success: () => {
            // SuccessToast("Updated")
          }
        })
      } else {
        const _data = {
          ...data,
          country_id: 209,
          user_type_id: UserTypes.patient,
          company_type_id: [tempCompanyTypeId]
        }
        editUser({
          id,
          jsonData: {
            ..._data,
            companyData,
            user_type_id: UserTypes.patient
          },
          dispatch,
          loading: setLoading,
          success: () => {
            // SuccessToast("Updated")
          }
        })
      }
    } else {
      if (watch('user_type') === UserTypes.employee) {
        // eslint-disable-next-line prefer-template

        addUser({
          jsonData: {
            ...data,
            country_id: 209,
            role_id: 1,
            user_type_id: UserTypes.employee,
            password: genPassword,
            'confirm-password': genPassword,
            company_type_id: [tempCompanyTypeId]
          },
          loading: setLoading,
          dispatch,
          success: (data) => {
            // showForm()
            // setAdded(data?.payload?.id)
            // SuccessToast("done")
          }
        })
      } else {
        addUser({
          jsonData: {
            ...data,
            country_id: 209,
            user_type_id: UserTypes.patient,
            company_type_id: [tempCompanyTypeId],
            password: genPassword,
            'confirm-password': genPassword
          },
          loading: setLoading,
          dispatch,
          success: (data) => {
            // showForm()
            // setAdded(data?.payload?.id)
            SuccessToast('done')
          }
        })
      }
    }
  }

  const loadDetails = () => {
    if (isValid(id)) {
      viewUser({
        id,
        loading: setLoad,
        success: (d) => {
          setCompanyData(d)
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
      // setLoad(false)
      setCompanyData({})
    }
    return () => {}
  }, [])

  ////Delete form array
  const deleteForm = (e) => {
    e.preventDefault()
    e.target.closest('form').remove()
  }
  ///incenses count
  const increaseCount = () => {
    setCount(count + 1)
  }

  const multiSelectHandle = (e) => {
    // setVal(Array.isArray(e) ? e.map((x) => x.value) : [])
    setVal(e)
  }

  return (
    <>
      <Header subHeading={load ? FM('update-user') : <>{FM('create-user')}</>} />
      {load ? (
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
                          <h4 className='mb-2'>{FM('user-details')}</h4>

                          {watch('user_type') === UserTypes.employee ||
                          watch('user_type') === UserTypes.patient ? (
                            <>
                              {' '}
                              <Col md='6'>
                                {/* Patient ,Employee */}
                                <FormGroupCustom
                                  label={'name'}
                                  name={'name'}
                                  type={'text'}
                                  errors={errors}
                                  values={companyData}
                                  className='mb-2'
                                  control={control}
                                  rules={{ required: true }}
                                />
                              </Col>
                              <Col md='6'>
                                {/* Patient , Employee */}
                                <FormGroupCustom
                                  name={'personal_number'}
                                  type={'number'}
                                  errors={errors}
                                  values={companyData}
                                  className='mb-2'
                                  control={control}
                                  rules={{ required: false }}
                                />
                              </Col>
                              <Col md='6'>
                                {/* Patient , Employee */}
                                <FormGroupCustom
                                  name={'custom_unique_id'}
                                  type={'text'}
                                  errors={errors}
                                  values={companyData}
                                  className='mb-2'
                                  control={control}
                                  rules={{ required: true }}
                                />
                              </Col>{' '}
                            </>
                          ) : null}
                          {/* {watch("user_type") === UserTypes.patient ? <Col md="6" >
                                                  
                                                    <FormGroupCustom
                                                        label={"govt-id"}
                                                        name={"govt_id"}
                                                        type={"text"}
                                                        errors={errors}
                                                        values={companyData}
                                                        className="mb-2"
                                                        control={control}
                                                        rules={{ required: true, maxLength: 16 }} />
                                                </Col> : null} */}
                          {/* {watch("user_type") === UserTypes.employee || watch("user_type") === UserTypes.patient ? <Col md="6">
                                                   
                                                    <FormGroupCustom
                                                        name={"joining_date"}
                                                        type={"date"}
                                                        errors={errors}
                                                        className="mb-2"
                                                        control={control}
                                                       
                                                        rules={{ required: true }}
                                                        values={companyData} />
                                                </Col> : null} */}

                          {watch('user_type') === UserTypes.employee ||
                          watch('user_type') === UserTypes.patient ? (
                            <>
                              {' '}
                              <Col md='6'>
                                {/* Patient ,Employee */}
                                <FormGroupCustom
                                  name={'email'}
                                  type={'email'}
                                  errors={errors}
                                  values={companyData}
                                  className='mb-2'
                                  control={control}
                                  rules={{ required: true }}
                                />
                              </Col>
                              <Col md='6'>
                                {/* Patient ,Employee */}
                                <FormGroupCustom
                                  name={'contact_number'}
                                  type={'number'}
                                  errors={errors}
                                  values={companyData}
                                  className='mb-2'
                                  control={control}
                                  rules={{ required: true }}
                                />
                              </Col>
                            </>
                          ) : null}
                        </Row>

                        <h4 className='mb-2 mt-2'>{FM('full-address-details')}</h4>
                        <Row>
                          {watch('user_type') === UserTypes.employee ||
                          watch('user_type') === UserTypes.patient ? (
                            <>
                              {/* <Col md="6" >
                                                   
                                                    <FormGroupCustom
                                                        options={country}
                                                        label={FM("country")}
                                                        name={"country_id"}
                                                        type={"select"}
                                                        className="mb-2"
                                                        isDisabled={countryLoading}
                                                        isLoading={countryLoading}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        errors={errors}
                                                        values={companyData} />
                                                </Col> */}
                              <Col md='12'>
                                {/* Patient ,Employee */}
                                <FormGroupCustom
                                  name={'full_address'}
                                  label={FM('full-address')}
                                  type={'textarea'}
                                  errors={errors}
                                  className='mb-2'
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>

                              <Col md='4'>
                                {/* Patient ,Employee */}
                                <FormGroupCustom
                                  name={'postal_area'}
                                  label={FM('postal-area')}
                                  type={'text'}
                                  errors={errors}
                                  className='mb-2'
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                              <Col md='4'>
                                {/* Patient ,Employee */}
                                <FormGroupCustom
                                  name={'zipcode'}
                                  type={'number'}
                                  errors={errors}
                                  className='mb-2'
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                              <Col md='4'>
                                {/* Patient ,Employee */}
                                <FormGroupCustom
                                  name={'city'}
                                  type={'text'}
                                  errors={errors}
                                  className='mb-2'
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                            </>
                          ) : null}
                          {watch('user_type') === UserTypes.patient ? (
                            <Col md='12'>
                              {/* Patient */}
                              <FormGroupCustom
                                name={'disease_description'}
                                label={FM('disease-description')}
                                type={'textarea'}
                                errors={errors}
                                className=''
                                control={control}
                                rules={{ required: true }}
                                values={companyData}
                              />
                            </Col>
                          ) : null}
                          {watch('user_type') === UserTypes.patient && isValid(val[0]) ? (
                            <>
                              <div className='divider divider-success'>
                                <div className='divider-text'>
                                  {' '}
                                  <span className='devider-text'>
                                    {FM('selected-agencies-hours')}
                                  </span>
                                </div>
                              </div>

                              {val.map((d, i) => {
                                return (
                                  <>
                                    <Col md='4'>
                                      <div>
                                        <div className='divider-text'>
                                          {' '}
                                          <span>
                                            {' '}
                                            <FormGroupCustom
                                              label={d.label}
                                              readOnly
                                              noGroup
                                              noLabel
                                              name={`agency_hours.${i}.name`}
                                              type={'hidden'}
                                              value={`${d.label}`}
                                              values={companyData}
                                              className='mb-2'
                                              control={control}
                                            />
                                          </span>{' '}
                                        </div>
                                        <FormGroupCustom
                                          label={FM('hours-allocation')}
                                          noLabel
                                          name={`agency_hours.${i}.assigned_hours`}
                                          type={'number'}
                                          errors={errors}
                                          className=''
                                          control={control}
                                          // max={formatDate(new Date(), "YYYY-MM-DD")}
                                          rules={{ required: true, minLength: 1, maxLength: 24 }}
                                          values={companyData}
                                        />
                                      </div>
                                    </Col>
                                  </>
                                )
                              })}
                            </>
                          ) : null}
                          {watch('patientType_id') === 3 ? (
                            <>
                              <div className='divider divider-success'>
                                <div className='divider-text'>
                                  {' '}
                                  <span className='devider-text'>{FM('add-working-details')}</span>
                                </div>
                              </div>

                              <Row>
                                {' '}
                                <Col md='4'>
                                  {' '}
                                  <FormGroupCustom
                                    noLabel
                                    placeholder={FM('company-name')}
                                    name={'place_name'}
                                    type={'text'}
                                    errors={errors}
                                    values={companyData}
                                    // className="mb-2"
                                    control={control}
                                    rules={{ required: true }}
                                  />
                                </Col>
                                <Col md='4'>
                                  {' '}
                                  <FormGroupCustom
                                    noLabel
                                    placeholder={FM('working-from')}
                                    name={'working_from'}
                                    type={'number'}
                                    errors={errors}
                                    values={companyData}
                                    // className="mb-2"
                                    control={control}
                                    rules={{ required: true }}
                                  />
                                </Col>
                                <Col md='4'>
                                  <FormGroupCustom
                                    noLabel
                                    placeholder={FM('work-to')}
                                    name={'working_to'}
                                    type={'number'}
                                    errors={errors}
                                    values={companyData}
                                    // className="mb-2"
                                    control={control}
                                    rules={{ required: true }}
                                  />
                                </Col>
                              </Row>
                            </>
                          ) : null}

                          {watch('patientType_id') === 2 ? (
                            <>
                              <div className='divider divider-success'>
                                <div className='divider-text'>
                                  {' '}
                                  <span className='devider-text'>{FM('add-students-details')}</span>
                                </div>
                              </div>
                              <Row>
                                <Col md='4'>
                                  {' '}
                                  <FormGroupCustom
                                    noLabel
                                    placeholder={FM('institute-name')}
                                    name={'place_name'}
                                    type={'text'}
                                    errors={errors}
                                    values={companyData}
                                    // className="mb-2"
                                    control={control}
                                    rules={{ required: true }}
                                  />
                                </Col>
                                <Col md='4'>
                                  {' '}
                                  <FormGroupCustom
                                    noLabel
                                    placeholder={FM('time-from')}
                                    name={'working_from'}
                                    type={'number'}
                                    errors={errors}
                                    values={companyData}
                                    // className="mb-2"
                                    control={control}
                                    rules={{ required: true }}
                                  />
                                </Col>
                                <Col md='4'>
                                  <FormGroupCustom
                                    noLabel
                                    placeholder={FM('time-to')}
                                    name={'working_to'}
                                    type={'number'}
                                    errors={errors}
                                    values={companyData}
                                    // className="mb-2"
                                    control={control}
                                    rules={{ required: true }}
                                  />
                                </Col>
                              </Row>
                            </>
                          ) : null}
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
                        <Col md='12'>
                          <FormGroupCustom
                            noLabel
                            noGroup
                            label={'user-types'}
                            type={'hidden'}
                            defaultOptions
                            isDisabled={edit}
                            value={companyData?.user_type_id}
                            control={control}
                            rules={{ required: true }}
                            errors={errors}
                            name={'user_type'}
                            className='mb-2'
                          />
                        </Col>
                        {/* <Col md="12" >
                                                <FormGroupCustom
                                                    label={"user-types"}
                                                    type={"select"}
                                                    defaultOptions
                                                    // isDisabled={edit}
                                                    values={edit}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    errors={errors}
                                                    options={user}
                                                    name={"user_type_id"}
                                                    className="mb-2"
                                                />
                                            </Col> */}

                        {watch('user_type') === UserTypes.employee ||
                        watch('user_type') === UserTypes.patient ? (
                          <>
                            <Col md='12'>
                              <FormGroupCustom
                                label={'branch'}
                                type={'select'}
                                defaultOptions
                                values={companyData}
                                control={control}
                                // rules={{ required: true }}
                                // errors={errors}
                                options={branch}
                                name={'branch_id'}
                                className='mb-2'
                              />
                            </Col>
                            {/* <Col md="12" >
                                                 
                                                    <FormGroupCustom
                                                        label={"department"}
                                                        type={"select"}
                                                        values={companyData}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        errors={errors}
                                                        options={department}

                                                        name={"dept_id"}
                                                        className="mb-2"
                                                    />
                                                </Col> */}
                          </>
                        ) : null}
                        {/* <Col md="12" >
                                              
                                                <FormGroupCustom
                                                    label={"employee_type"}
                                                    type={"select"}
                                                    async
                                                    defaultOptions
                                                    values={companyData}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    errors={errors}
                                                    options={comp}
                                                    loadOptions={loadTypeOptions}
                                                    name={"employee_type"}
                                                    className="mb-2"
                                                />
                                            </Col>  */}
                        {/* {watch("user_type") === UserTypes.employee || watch("user_type") === UserTypes.patient ? <Col md="12" >
                                                <FormGroupCustom
                                                    label={"company-types"}
                                                    type={"select"}
                                                    async
                                                    defaultOptions
                                                    isClearable
                                                    values={companyData}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    errors={errors}
                                                    options={comp}
                                                    loadOptions={loadTypeOptions}
                                                    name={"company_type_id"}
                                                    className="mb-2"
                                                />
                                            </Col> : null} */}
                        {/* {watch("user_type") === 3 || watch("user_type") === 6 ? <Col md="12">

                                                <FormGroupCustom
                                                    name={"role_id"}
                                                    errors={errors}
                                                    type={"select"}
                                                    label={FM("role-id")}
                                                    className="mb-2"
                                                    defaultOptions
                                                    values={companyData}
                                                    control={control}
                                                    rules={{ required: false }}

                                                    options={roles}
                                                    loadOptions={loadAllRoles}
                                                />
                                            </Col> : null} */}

                        {/* {watch("user_type") === UserTypes.employee ? <Col md="12" >

                                                <FormGroupCustom
                                                    label={"category"}
                                                    type={"select"}

                                                    isClearable
                                                    values={companyData}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    errors={errors}
                                                    options={category}
                                                    name={"category_id"}
                                                    className="mb-2"
                                                />

                                            </Col> : null} */}

                        {watch('user_type') === UserTypes.patient ? (
                          <FormGroupCustom
                            label={'agencies'}
                            isMulti
                            type={'select'}
                            values={companyData}
                            control={control}
                            // rules={{ required: true }}
                            // errors={errors}
                            options={patientType}
                            onChange={multiSelectHandle}
                            name={'agencies_id'}
                            className='mb-2'
                          />
                        ) : null}
                        {watch('user_type') === UserTypes.patient ? (
                          <Col md='12'>
                            {' '}
                            <FormGroupCustom
                              label={'patient-type'}
                              type={'select'}
                              values={companyData}
                              defaultOptions
                              isClearable
                              control={control}
                              rules={{ required: true }}
                              errors={errors}
                              options={patientType}
                              name={'patientType_id'}
                              className='mb-2'
                            />{' '}
                          </Col>
                        ) : null}
                        <Col md='12' className='mb-2'>
                          <h5>{FM('gender')}</h5>
                          {companyData.gender === 'male' && id ? (
                            <Col md='4'>
                              <FormGroupCustom
                                id={'gender'}
                                defaultChecked
                                name={'gender'}
                                type={'radio'}
                                values={companyData}
                                label={'male'}
                                value={'male'}
                                errors={errors}
                                // className="mb-2"
                                control={control}
                              />
                            </Col>
                          ) : (
                            <Col md='4'>
                              <FormGroupCustom
                                id={'gender'}
                                name={'gender'}
                                type={'radio'}
                                // values={companyData}
                                label={'male'}
                                value={'male'}
                                errors={errors}
                                // className="mb-2"
                                control={control}
                              />
                            </Col>
                          )}
                          {companyData.gender === 'Female' && id ? (
                            <Col md='4'>
                              <FormGroupCustom
                                id={'gender'}
                                defaultChecked
                                name={'gender'}
                                type={'radio'}
                                value={'Female'}
                                values={companyData}
                                label={'female'}
                                errors={errors}
                                // className="mb-2"
                                control={control}
                              />
                            </Col>
                          ) : (
                            <Col md='4'>
                              <FormGroupCustom
                                id={'gender'}
                                name={'gender'}
                                type={'radio'}
                                value={'Female'}
                                // values={companyData}
                                label={'female'}
                                errors={errors}
                                // className="mb-2"
                                control={control}
                              />
                            </Col>
                          )}
                        </Col>

                        {/* <Col md="12">
                                                <FormGroupCustom
                                                    name={"package_id"}
                                                    errors={errors}
                                                    type={"select"}
                                                    async
                                                    className="mb-2"
                                                    defaultOptions
                                                    values={companyData}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    errors={errors}
                                                    options={packaged}
                                                    loadOptions={loadPackageOptions}
                                                />
                                            </Col> */}

                        {watch('user_type') === UserTypes.patient ? (
                          <Col md='12'>
                            {/* Patients */}
                            <FormGroupCustom
                              name={'add_persons'}
                              type={'checkbox'}
                              label={FM('persons-assign')}
                              value={companyData?.persons?.length > 0 ? 1 : 0}
                              errors={errors}
                              className='mb-2'
                              control={control}
                            />
                          </Col>
                        ) : null}
                        {/* Patients, Employee */}
                        {/* {watch("user_type") === 3 || watch("user_type") === 6 ? <>  <Col md="6">

                                                {
                                                    watch("is_file_required") || companyData?.is_file_required ? <FormGroupCustom
                                                        values={companyData}
                                                        type={"file"}
                                                        name={"file"}
                                                        errors={errors}
                                                        message={FM("please upload files")}

                                                        control={control}
                                                        rules={{ required: true }}
                                                    /> : null}

                                            </Col><Col md="12" >
                                                    <Label>{FM("file")}</Label>
                                                    <FormGroupCustom
                                                        name={"is_file_required"}
                                                        control={control}
                                                        type={"checkbox"}
                                                        value={false}
                                                        errors={errors}
                                                        className="mb-2 mt-1"

                                                        rules={{ required: false }}
                                                        values={companyData} />
                                                </Col>

                                            </> : null} */}

                        {watch('user_type') === UserTypes.employee ||
                        watch('user_type') === UserTypes.patient ? (
                          <Col md='12'>
                            {/*Employee */}
                            <FormGroupCustom
                              name={'user_color'}
                              type={'color'}
                              errors={errors}
                              className='mb-2'
                              control={control}
                              rules={{ required: true }}
                              values={companyData}
                            />
                          </Col>
                        ) : null}

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
                        </Col>

                        {/* Employee */}
                      </Row>
                    ) : null}
                  </CardBody>
                </Card>
              </Col>
              {watch('add_persons') ? (
                <Col md='8'>
                  <Card>
                    <CardHeader className='fw-bold text-uppercase'>{FM('persons')}</CardHeader>
                    <CardBody>
                      <Repeater count={count}>
                        {(i) => (
                          <Form key={i}>
                            <div className='divider divider-success'>
                              <div className='divider-text'>
                                {' '}
                                <span className='devider-text'>{FM('personal-details')}</span>
                              </div>
                            </div>
                            <Row>
                              <Col md={3} className='mb-md-0 mb-1'>
                                <FormGroupCustom
                                  name={`persons.${i}.name`}
                                  label={FM('name')}
                                  value={id ? companyData?.persons[i]?.name : ''}
                                  type={'text'}
                                  errors={errors}
                                  className=''
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                              <Col md={3} className='mb-md-0 mb-1'>
                                <FormGroupCustom
                                  label={FM('email')}
                                  name={`persons.${i}.email`}
                                  value={id ? companyData?.persons[i]?.email : ''}
                                  type={'email'}
                                  errors={errors}
                                  className=''
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                              <Col md={3} className='mb-md-0 mb-1'>
                                <FormGroupCustom
                                  label={FM('contact_number')}
                                  name={`persons.${i}.contact_number    `}
                                  value={id ? companyData?.persons[i]?.contact_number : ''}
                                  type={'number'}
                                  errors={errors}
                                  className=''
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                              <Col md={3} className='mb-md-0 mb-1'>
                                <FormGroupCustom
                                  label={FM('country')}
                                  options={country}
                                  name={`persons.${i}.country_id`}
                                  value={id ? companyData?.persons[i]?.country_id : ''}
                                  type={'select'}
                                  className='mb-2'
                                  isDisabled={countryLoading}
                                  isLoading={countryLoading}
                                  control={control}
                                  rules={{ required: true }}
                                  errors={errors}
                                  values={companyData}
                                />
                              </Col>

                              {/* <Col sm={12}>
                                                        <hr />
                                                    </Col> */}
                            </Row>
                            <div className='divider divider-success'>
                              <div className='divider-text'>
                                {' '}
                                <span className='devider-text'>{FM('address-details')}</span>
                              </div>
                            </div>
                            <Row>
                              <Col md={4} className='mb-md-0 mb-1'>
                                <FormGroupCustom
                                  label={FM('full-address')}
                                  name={`persons.${i}.full_address`}
                                  value={id ? companyData?.persons[i]?.full_address : ''}
                                  type={'text'}
                                  errors={errors}
                                  className=''
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                              <Col md={3} className='mb-md-0 mb-1'>
                                <FormGroupCustom
                                  label={FM('city')}
                                  name={`persons.${i}.city`}
                                  value={id ? companyData?.persons[i]?.city : ''}
                                  type={'text'}
                                  errors={errors}
                                  className=''
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                              <Col md={3} className='mb-md-0 mb-1'>
                                <FormGroupCustom
                                  label={FM('postal-area')}
                                  name={`persons.${i}.postal_area`}
                                  value={id ? companyData?.persons[i]?.postal_area : ''}
                                  type={'text'}
                                  errors={errors}
                                  className=''
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                              <Col md={2} className='mb-md-0 mb-1'>
                                <FormGroupCustom
                                  label={FM('zipcode')}
                                  name={`persons.${i}.zipcode`}
                                  value={id ? companyData?.persons[i]?.zipcode : ''}
                                  type={'number'}
                                  errors={errors}
                                  className=''
                                  control={control}
                                  rules={{ required: true }}
                                  values={companyData}
                                />
                              </Col>
                            </Row>
                            <div className='divider divider-success'>
                              <div className='divider-text'>
                                {' '}
                                <span className='devider-text'>{FM('assignment-type')}</span>
                              </div>
                            </div>
                            <Row>
                              <Col md={3} className='mb-md-0'>
                                {/* Patients */}

                                <FormGroupCustom
                                  name={`persons.${i}.is_family_member`}
                                  value={id ? companyData?.persons[i]?.is_family_member : ''}
                                  type={'checkbox'}
                                  label={FM('is-family-member')}
                                  errors={errors}
                                  className=''
                                  control={control}
                                />
                              </Col>
                              <Col md={3} className='mb-md-0'>
                                {/* Patients */}
                                <FormGroupCustom
                                  name={`persons.${i}.is_contact_person`}
                                  value={id ? companyData?.persons[i]?.is_contact_person : ''}
                                  type={'checkbox'}
                                  label={FM('is-contact-person')}
                                  errors={errors}
                                  className=''
                                  control={control}
                                />
                              </Col>
                              <Col md={2} className='mb-md-0'>
                                {/* Patients */}
                                <FormGroupCustom
                                  name={`persons.${i}.is_caretaker`}
                                  value={id ? companyData?.persons[i]?.is_caretaker : ''}
                                  type={'checkbox'}
                                  label={'is-caretaker'}
                                  errors={errors}
                                  className=''
                                  control={control}
                                />
                              </Col>
                              {watch('patientType_id') === 1 ? (
                                <Col md={2} className='mb-md-0'>
                                  {/* Patients */}
                                  <FormGroupCustom
                                    name={`persons.${i}.is_gaurdian`}
                                    value={id ? companyData?.persons[i]?.is_gaurdian : ''}
                                    type={'checkbox'}
                                    label={'is-gaurdian'}
                                    errors={errors}
                                    className=''
                                    control={control}
                                  />
                                </Col>
                              ) : null}

                              <Col md={2} className='mb-md-0 mb-4'>
                                <Button
                                  color='danger'
                                  className='text-nowrap px-1'
                                  onClick={deleteForm}
                                  outline
                                >
                                  <X size={14} className='me-50' />
                                  <span>Delete</span>
                                </Button>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Repeater>
                      {/* <FormGroupCustom
                                        noLabel
                                        noGroup
                                        name={"user_type_id"}
                                        type={"hidden"}
                                        errors={errors}
                                        values={companyData}
                                        className="mb-2"
                                        control={control}
                                        rules={{ required: true }}
                                    />
                                    <FormGroupCustom
                                        noLabel
                                        noGroup
                                        name={"role_id"}
                                        type={"hidden"}
                                        errors={errors}
                                        values={companyData}
                                        className="mb-2"
                                        control={control}
                                        rules={{ required: true }} /> */}
                      <Button className='btn-icon' color='primary' onClick={increaseCount}>
                        <Plus size={14} />
                        <span className='align-middle ms-25'>Add New</span>
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ) : null}
            </Row>
          </Form>
        </>
      )}
    </>
  )
}
export default UserForm
