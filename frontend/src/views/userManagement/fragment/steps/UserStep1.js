import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { HourglassEmptyOutlined, LiveHelp, ViewWeek } from '@material-ui/icons'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Calendar, Info } from 'react-feather'
import { Col, Form, Label, Row } from 'reactstrap'
import {
  ContractType,
  Patterns,
  UserTypes,
  VerifiedMethod,
  VerifiedType,
  forDecryption,
  gender
} from '../../../../utility/Const'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import {
  SpaceTrim,
  createAsyncSelectOptions,
  createConstSelectOptions,
  createSelectOptions,
  decryptObject,
  viewInHours,
  getAge
} from '../../../../utility/Utils'
import { countryListLoad } from '../../../../utility/apis/commons'
import { loadCompanyType } from '../../../../utility/apis/compTypeApis'
import { loadRole } from '../../../../utility/apis/roles'
import { loadUser } from '../../../../utility/apis/userManagement'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import FormGroupCustom from '../../../components/formGroupCustom'
import DropZoneImage from '../../../components/imageFileUploader'
import Shimmer from '../../../components/shimmers/Shimmer'
import BsTooltip from '../../../components/tooltip'

const UserStep1 = ({
  isEdit = false,
  clearErrors = () => {},
  setError = () => {},
  activeIndex = null,
  userType = null,
  createFor = null,
  setDisplay = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  //country
  const [country, setCountry] = useState([])
  const [countryLoading, setCountryLoading] = useState(false)

  //branch
  const [branch, setBranch] = useState([])
  const [branchWE, setBranchWE] = useState([])
  const [branchLoad, setBranchLoad] = useState(false)
  const [branchLoadWE, setBranchLoadWE] = useState(false)
  const [updated, setUpdated] = useState(null)
  const [comp, setComp] = useState(null)
  const [employees, setEmployees] = useState(null)
  const [employeesWE, setEmployeesWE] = useState(null)
  const [patients, setPatients] = useState(null)
  const [patientsWE, setPatientsWE] = useState(null)

  //role
  const [roles, setRoles] = useState([])
  const [roleLoad, setRoleLoad] = useState(false)

  const [country_id, setCountryId] = useState(null)
  const user = useUser()

  //fake email
  const [fakeEmail, setFakeEmail] = useState(null)
  const [uId, setUId] = useState(null)
  const [branchId, setBranchId] = useState(null)
  const [isChanged, setIsChanged] = useState(null)

  const isSu = user?.top_most_parent?.user_type_id === 1

  const makeFakeEmail = () => {
    const str = 'abcdefghijklmnopqrstuvwxyz123456789'
    let string = ''
    for (let i = 0; i < 8; i++) {
      string += str[Math.floor(Math.random() * str.length)]
    }
    // if (uId) {
    //     setFakeEmail(`${uId}@aceuss.com`)
    //     setValue("email", `${uId}@aceuss.com`)
    //     clearErrors("email")
    // } else {
    setFakeEmail(`${string}@aceuss.com`)
    setValue('email', `${string}@aceuss.com`)
    clearErrors('email')
    // }
  }

  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCompanyType({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setComp)
  }

  const loadEmployees = async (search, loadedOptions, { page }) => {
    // if (isValid(watch('branch_id')) || isValid(user?.branch_id) || isValid(user?.id)) {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: {
        name: search,
        branch_id: isValid(watch('branch_id'))
          ? watch('branch_id')
          : user?.user_type_id === UserTypes.branch || user?.user_type_id === UserTypes.company
          ? user?.id
          : user?.branch_id,
        user_type_id: UserTypes.employee
      }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setEmployees, (x) => {
      return decryptObject(forDecryption, x)
    })
    // } else {
    //     return {
    //         options: [],
    //         hasMore: false
    //     }
    // }
  }

  const loadEmployeesWithoutEdit = async (search, loadedOptions, { page }) => {
    // if (isValid(watch('branch_id')) || isValid(user?.branch_id) || isValid(user?.id)) {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: {
        name: search,
        branch_id: isValid(watch('branch_id'))
          ? watch('branch_id')
          : user?.user_type_id === UserTypes.branch || user?.user_type_id === UserTypes.company
          ? user?.id
          : user?.branch_id,
        user_type_id: UserTypes.employee
      }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setEmployeesWE, (x) => {
      return decryptObject(forDecryption, x)
    })
    // } else {
    //     return {
    //         options: [],
    //         hasMore: false
    //     }
    // }
  }

  const loadPatients = async (search, loadedOptions, { page }) => {
    if (isValid(watch('branch_id')) ?? user?.branch_id ?? user?.id) {
      const res = await loadUser({
        async: true,
        page,
        perPage: 100,
        jsonData: {
          name: search,
          branch_id: isValid(watch('branch_id'))
            ? watch('branch_id')
            : user?.user_type_id === UserTypes.branch || user?.user_type_id === UserTypes.company
            ? user?.id
            : user?.branch_id,
          user_type_id: UserTypes.patient
        }
      })

      return createAsyncSelectOptions(res, page, 'name', 'id', setPatients, (x) => {
        return decryptObject(forDecryption, x)
      })
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  const loadPatientsWithoutEdit = async (search, loadedOptions, { page }) => {
    if (isValid(watch('branch_id')) || isValid(user?.branch_id) || isValid(user?.id)) {
      const res = await loadUser({
        async: true,
        page,
        perPage: 100,
        jsonData: {
          name: search,
          branch_id: isValid(watch('branch_id'))
            ? watch('branch_id')
            : user?.user_type_id === UserTypes.branch || user?.user_type_id === UserTypes.company
            ? user?.id
            : user?.branch_id,
          user_type_id: UserTypes.patient
        }
      })
      return createAsyncSelectOptions(res, page, 'name', 'id', setPatientsWE, (x) => {
        return decryptObject(forDecryption, x)
      })
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }
  // useEffect(() => {

  //     if (isValid(watch('branch_id'))) {
  //         setBranchId(watch('branch_id'))
  //     } else {
  //         if (isValid(user?.branch_id)) {
  //             setBranchId(user?.branch_id)
  //         } else {
  //             setBranchId(user?.id)
  //         }
  //     }
  // }, [user, watch('branch_id'), edit])

  const makeUid = () => {
    const string = String(new Date().getTime())
    const final = `${string.slice(0, 5)}-${string.slice(5, 8)}-${string.slice(8)}`
    const str = 'abcdefghijklmnopqrstuvwxyz123456789'

    setUId(`${final}`)
    setValue('custom_unique_id', `${final}`)
    clearErrors('custom_unique_id')
    setIsChanged(new Date().getTime())
  }
  //Countries
  const loadCountry = () => {
    countryListLoad({
      loading: setCountryLoading,
      success: (d) => {
        setCountry(createSelectOptions(d?.payload, 'name', 'id'))
        if (edit === null) {
          setCountryId(d?.payload?.find((a) => a.name === 'Sweden')?.id)
          setValue('country_id', d?.payload?.find((a) => a.name === 'Sweden')?.id)
        }
      }
    })
  }

  ////roles
  const loadAllRoles = () => {
    if (isValid(user?.top_most_parent?.id)) {
      loadRole({
        loading: setRoleLoad,
        jsonData: {
          user_type_id:
            user?.top_most_parent?.user_type_id === 1 ? UserTypes.adminEmployee : userType,
          top_most_parent_id: user?.top_most_parent?.id
        },
        success: (d) => {
          setRoles(createSelectOptions(d?.payload, 'se_name', 'id'))
        }
      })
    }
  }

  // load branch
  const loadAllBranch = () => {
    if (edit !== null) {
      loadUser({
        loading: setBranchLoad,
        jsonData: {
          user_type_id: 11
        },
        success: (d) => {
          setBranch(
            createSelectOptions(d?.payload, 'branch_name', null, (x) => {
              return decryptObject(forDecryption, x)
            })
          )
        }
      })
    }
  }

  const loadAllBranchWE = () => {
    if (edit === null) {
      loadUser({
        loading: setBranchLoadWE,
        jsonData: {
          user_type_id: 11
        },
        success: (d) => {
          setBranchWE(
            createSelectOptions(d?.payload, 'branch_name', null, (x) => {
              return decryptObject(forDecryption, x)
            })
          )
        }
      })
    }
  }

  const loadAllData = () => {
    loadAllBranch()
    loadAllBranchWE()
    if (userType === UserTypes.employee) {
      loadAllRoles()
      loadCountry()
    }
  }

  useEffect(() => {
    if (activeIndex === 0) {
      if (isEdit) {
        if (isValid(edit)) {
          setValue('verified', edit?.verification_method === 1 ? '1' : '0')
          loadAllData()
        }
      } else {
        loadAllData()
      }
    }
  }, [activeIndex, edit, isEdit, user])

  useEffect(() => {
    if (isValid(watch('branch_id'))) {
      const b = branch?.find((a) => a.value?.id === watch('branch_id'))?.value
      if (isValidArray(b?.company_types)) {
        log(b)
        setValue('company_type_id', b?.company_types[0]?.id)
      }
    } else {
      if (comp?.length === 1) {
        setValue('company_type_id', comp[0]?.value)
      } else {
        setValue('company_type_id', null)
      }
    }
  }, [watch('branch_id')])

  useEffect(() => {
    if (comp?.length === 1) {
      setValue('company_type_id', comp[0]?.value)
    }
  }, [comp])

  // useEffect(() => {
  //     setValue("assigned_patiens", edit?.assigned_patiens)
  // }, [edit?.assigned_patiens])

  const options = { delimiters: ['-'], blocks: [8, 4] }
  const imgAvatar = edit?.avatar
  const calculation = Math.floor(
    watch('assigned_working_hour_per_week') * (watch('working_percent') / 100) * 60
  )

  return (
    <div className='w-100 overflow-x-hidden p-2'>
      {loadingDetails ? (
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
      ) : (
        <>
          <Form onSubmit={onSubmit}>
            <Row>
              <Col md='4'>
                <FormGroupCustom
                  label={FM('Avatar')}
                  name={'avatar'}
                  type={'hidden'}
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                  values={imgAvatar}
                />
                <DropZoneImage
                  maxSize={2}
                  className='min-height-120'
                  accept={'image/*'}
                  value={edit?.avatar}
                  onSuccess={(e) => {
                    if (isValidArray(e)) {
                      setValue('avatar', e[0]?.file_name)
                    } else {
                      setValue('avatar', [])
                    }
                  }}
                />
              </Col>
              <Col md='8'>
                <Row>
                  <Col md='6'>
                    <FormGroupCustom
                      label={'name'}
                      name={'name'}
                      type={'text'}
                      errors={errors}
                      values={edit}
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
                      name={'personal_number'}
                      type={'mask'}
                      errors={errors}
                      values={edit}
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
                          return getAge(v, FM, true) && String(v).replaceAll('-', '').length === 12
                        }
                      }}
                    />
                  </Col>
                  <Col md='6'>
                    <Show IF={!isValid(edit?.id) && userType === UserTypes.patient}>
                      <Label>
                        {FM('email')} <span className='text-danger'>*</span>{' '}
                        <Show IF={watch('is_fake') === 1}>
                          <span
                            onClick={makeFakeEmail}
                            className='text-small-12 text-primary mb-0'
                            role={'button'}
                          >
                            ({FM('fake-email')})
                          </span>
                        </Show>
                      </Label>
                    </Show>

                    <FormGroupCustom
                      key={`email-p-${fakeEmail}`}
                      name={'email'}
                      type={'email'}
                      disabled={
                        (isValid(edit?.id) && userType === UserTypes.patient) ||
                        (isValid(edit?.id) && userType === UserTypes.employee)
                      }
                      noLabel={!isValid(edit?.id) && userType === UserTypes.patient}
                      errors={errors}
                      value={fakeEmail ?? edit?.email}
                      className='mb-5px'
                      control={control}
                      rules={{
                        required: true,
                        pattern: Patterns.EmailOnly,
                        validate: (v) => {
                          return isValid(v) ? !SpaceTrim(v) : true
                        }
                      }}
                    />

                    <Show IF={!isValid(edit?.id) && userType === UserTypes.patient}>
                      <FormGroupCustom
                        name={'is_fake'}
                        label={FM('is-fake-email')}
                        type={'checkbox'}
                        errors={errors}
                        className='mb-1'
                        control={control}
                        rules={{ required: false }}
                        values={edit}
                      />
                    </Show>
                  </Col>
                  <Col md='6'>
                    <FormGroupCustom
                      name={'contact_number'}
                      type={'number'}
                      errors={errors}
                      values={edit}
                      className='mb-2'
                      control={control}
                      rules={{
                        required: false,
                        pattern: Patterns.NumberOnly,
                        validate: (v) => {
                          return isValid(v) ? !SpaceTrim(v) : true
                        }
                        // validate: (v) => {
                        //     return isValid(v) ? !SpaceTrim(v) : true
                        // }
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className=''>
              <Col md='4'>
                <FormGroupCustom
                  label={'gender'}
                  type={'select'}
                  value={watch('gender')}
                  control={control}
                  rules={{ required: false }}
                  errors={errors}
                  options={createConstSelectOptions(gender, FM)}
                  name={'gender'}
                  className='mb-2'
                />
              </Col>
              <Show IF={userType === UserTypes.employee}>
                <Col md='4'>
                  <FormGroupCustom
                    name={'role_id'}
                    errors={errors}
                    type={'select'}
                    label={FM('role-id')}
                    className='mb-2'
                    defaultOptions
                    isClearable
                    values={edit}
                    control={control}
                    rules={{ required: true }}
                    options={roles}
                    loadOptions={loadAllRoles}
                  />
                </Col>
              </Show>

              <Show
                IF={userType === UserTypes.patient && (branch?.length > 0 || branchWE?.length > 0)}
              >
                <Show IF={edit !== null}>
                  <Col md='4'>
                    <FormGroupCustom
                      label={'branch'}
                      type={'select'}
                      defaultOptions
                      isClearable
                      isDisabled={isValid(edit)}
                      matchWith={'id'}
                      value={watch('branch_id')}
                      control={control}
                      rules={{ required: false }}
                      errors={errors}
                      onChangeValue={(e) => {
                        if (isValid(e)) {
                          clearErrors('company_type_id')
                        }
                      }}
                      options={branch}
                      name={'branch_id'}
                      className='mb-2'
                    />
                  </Col>
                </Show>
                <Show IF={edit === null}>
                  <Col md='4'>
                    <FormGroupCustom
                      label={'branch'}
                      type={'select'}
                      defaultOptions
                      isClearable
                      // isDisabled={isValid(edit)}
                      matchWith={'id'}
                      // value={watch('branch_id')}
                      control={control}
                      rules={{ required: false }}
                      errors={errors}
                      onChangeValue={(e) => {
                        if (isValid(e)) {
                          clearErrors('company_type_id')
                        }
                      }}
                      options={branchWE}
                      name={'branch_id'}
                      className='mb-2'
                    />
                  </Col>
                </Show>
              </Show>
              <Show IF={userType === UserTypes.patient}>
                <Show IF={edit !== null}>
                  <Col md='4'>
                    <FormGroupCustom
                      key={`change-${watch('branch_id')}`}
                      label={FM('assign-employee')}
                      type={'select'}
                      async
                      isMulti
                      value={isValidArray(edit?.assigned_employee) ? edit?.assigned_employee : null}
                      defaultOptions
                      control={control}
                      options={employees}
                      loadOptions={loadEmployees}
                      name={'assigned_employee'}
                      rules={{ required: false }}
                      className={classNames('mb-2')}
                    />
                  </Col>
                </Show>
                <Show IF={edit === null}>
                  <Col md='4'>
                    <FormGroupCustom
                      key={`change-${watch('branch_id')}`}
                      label={FM('assign-employee')}
                      type={'select'}
                      async
                      isMulti
                      // value={isValidArray(edit?.assigned_employee) ? edit?.assigned_employee : null}
                      defaultOptions
                      control={control}
                      options={employeesWE}
                      loadOptions={loadEmployeesWithoutEdit}
                      name={'assigned_employee'}
                      rules={{ required: false }}
                      className={classNames('mb-2')}
                    />
                  </Col>
                </Show>
              </Show>
              <Show IF={userType === UserTypes.patient}>
                <Col md='4'>
                  <FormGroupCustom
                    key={`living-${watch('branch_id')}`}
                    label={FM('living-type')}
                    type={'select'}
                    async
                    value={
                      isValidArray(edit?.company_type_id)
                        ? edit?.company_type_id[0]
                        : comp?.length === 1
                        ? comp[0]?.value
                        : ''
                    }
                    noLabel={
                      isValid(watch('branch_id'))
                        ? watch('branch_id') !== user?.top_most_parent?.id
                        : false
                    }
                    defaultOptions
                    control={control}
                    options={comp}
                    errors={errors}
                    loadOptions={loadTypeOptions}
                    name={'company_type_id'}
                    rules={{
                      required: !(isValid(watch('branch_id'))
                        ? watch('branch_id') !== user?.top_most_parent?.id
                        : false)
                    }}
                    className={classNames('mb-2', {
                      'd-none': isValid(watch('branch_id'))
                        ? watch('branch_id') !== user?.top_most_parent?.id
                        : false
                    })}
                  />
                </Col>
              </Show>
              <Show IF={userType === UserTypes.patient}>
                <hr />

                <Col md='4'>
                  <Show IF={!isValid(edit?.id)}>
                    <Label>
                      {FM('custom-unique-id')} <span className='text-danger'>*</span>{' '}
                      <span
                        onClick={makeUid}
                        className='text-small-12 text-primary mb-0'
                        role={'button'}
                      >
                        ({FM('create-custom-unique-id')})
                      </span>
                    </Label>
                  </Show>

                  <FormGroupCustom
                    // disabled={isValid(edit?.id)}
                    noLabel={!isValid(edit?.id)}
                    key={`uid-${isChanged ?? edit?.custom_unique_id}`}
                    name={`custom_unique_id`}
                    label={FM('custom-unique-id')}
                    type={'text'}
                    errors={errors}
                    onChangeValue={(e) => {
                      setUId(e)
                    }}
                    className='mb-2'
                    control={control}
                    rules={{
                      required: true,
                      validate: (v) => {
                        return isValid(v) ? !SpaceTrim(v) : true
                      }
                    }}
                    value={uId ?? edit?.custom_unique_id}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    name={'user_color'}
                    type={'color'}
                    errors={errors}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>

                <Col md='4'>
                  <Label className='mb-1'>{FM('hidden-patient')}</Label>
                  <FormGroupCustom
                    name={'is_secret'}
                    label={FM('yes')}
                    type={'checkbox'}
                    errors={errors}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
              </Show>
              <hr />

              <Col md={userType === UserTypes.patient ? '12' : '8'}>
                <FormGroupCustom
                  name={'full_address'}
                  label={FM('full-address')}
                  type={'text'}
                  errors={errors}
                  className='mb-2'
                  control={control}
                  rules={{ required: false }}
                  values={edit}
                />
              </Col>
              <Show IF={userType === UserTypes.employee}>
                <Col md='4'>
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
                    value={country_id ?? edit?.country_id}
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
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    name={'postal_area'}
                    label={FM('postal-area')}
                    type={'text'}
                    errors={errors}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    label={FM('postal-code')}
                    name={'zipcode'}
                    type={'number'}
                    errors={errors}
                    className='mb-2'
                    control={control}
                    rules={{ required: false, minLength: 5, maxLength: 5 }}
                    max='6'
                    values={edit}
                  />
                </Col>
              </Show>
            </Row>
            <Hide IF={userType === UserTypes.patient}>
              <hr />
            </Hide>
            <Row>
              <Show IF={userType === UserTypes.employee && edit === null && !isSu}>
                <Col md='4'>
                  <FormGroupCustom
                    label={FM('total-hour-per-week')}
                    type={'number'}
                    value={edit?.assigned_work?.assigned_working_hour_per_week}
                    control={control}
                    // rules={{ required: isValid(watch("contract_type")), pattern: Patterns.NumberOnly, min: 0 }}
                    // onChangeValue={e => setUpdated(e)}
                    errors={errors}
                    name={'assigned_working_hour_per_week'}
                    className='mb-2'
                    rules={{ required: false, min: 0, max: 40, pattern: Patterns.NumberOnly }}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    label={FM('work-grade(%)')}
                    type={'number'}
                    value={edit?.assigned_work?.working_percent}
                    control={control}
                    // rules={{ required: isValid(watch("contract_type")), pattern: Patterns.NumberOnly, min: 0 }}
                    errors={errors}
                    // onChangeValue={e => setUpdated(e)}
                    name={'working_percent'}
                    className='mb-2'
                    rules={{ required: false, min: 0, max: 100, pattern: Patterns.NumberOnly }}
                  />
                </Col>
                <Col md='12' className=''>
                  <Row>
                    <Col md='4'>
                      <StatsHorizontal
                        className={'white'}
                        icon={<ViewWeek size={30} />}
                        color='info'
                        stats={calculation ? viewInHours(calculation) : 0}
                        statTitle={
                          <>
                            {FM('hours-per-week')}
                            <BsTooltip
                              className='ms-25'
                              title={
                                <>
                                  {`((${watch('assigned_working_hour_per_week')} x (${watch(
                                    'working_percent'
                                  )} / 100)) x 60) = ${calculation} minutes`}
                                </>
                              }
                            >
                              <Info className='text-primary' size={14} />
                            </BsTooltip>
                          </>
                        }
                      />
                    </Col>
                    <Col md='4'>
                      <StatsHorizontal
                        className={'white'}
                        icon={<HourglassEmptyOutlined size={30} />}
                        color='primary'
                        key={
                          (watch('assigned_working_hour_per_week') *
                            (watch('working_percent') / 100)) /
                          5
                            ? viewInHours(
                                ((watch('assigned_working_hour_per_week') *
                                  (watch('working_percent') / 100)) /
                                  5) *
                                  60
                              )
                            : '0'
                        }
                        stats={calculation ? viewInHours(Math.floor(calculation / 5)) : 0}
                        statTitle={
                          <>
                            {FM('hours-per-day')}
                            <BsTooltip
                              className='ms-25'
                              title={<>{`${calculation} / 5 = ${calculation / 5} minutes`}</>}
                            >
                              <Info className='text-primary' size={14} />
                            </BsTooltip>
                          </>
                        }
                      />
                    </Col>

                    <Col md='4'>
                      <StatsHorizontal
                        className={'white'}
                        icon={<Calendar size={30} />}
                        color='success'
                        stats={calculation ? viewInHours((calculation / 5) * 20) : 0}
                        statTitle={
                          <>
                            {FM('hours-per-month')}
                            <BsTooltip
                              className='ms-25'
                              title={
                                <>
                                  {`${calculation / 5} x 20 = ${
                                    Math.floor(calculation / 7) * 20
                                  } minutes`}
                                </>
                              }
                            >
                              <Info className='text-primary' size={14} />
                            </BsTooltip>
                          </>
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Show>
              <Show IF={userType === UserTypes.employee && !isSu}>
                <Col md='4'>
                  <FormGroupCustom
                    key={`gyuui-${edit?.verification_method}`}
                    label={'verify-schedule-hours'}
                    type={'select'}
                    value={isValid(edit?.verification_method) ? '1' : '0'}
                    control={control}
                    rules={{ required: false }}
                    errors={errors}
                    // isClearable
                    options={createConstSelectOptions(VerifiedType, FM)}
                    name={'verified'}
                    className='mb-2'
                  />
                </Col>

                {watch('verified') === '1' ? (
                  <Col md='4'>
                    <FormGroupCustom
                      label={'verification-method-type'}
                      type={'select'}
                      values={edit}
                      control={control}
                      rules={{ required: watch('verified') === '1' }}
                      errors={errors}
                      isClearable
                      options={createConstSelectOptions(VerifiedMethod, FM)}
                      name={'verification_method'}
                      className='mb-2'
                    />
                  </Col>
                ) : (
                  ''
                )}
              </Show>
            </Row>
            <Row>
              <Hide IF={userType === UserTypes.patient}>
                <hr />
              </Hide>
              <Show IF={userType === UserTypes.employee && !isSu}>
                <Hide IF={branch.length === 0}>
                  <Show IF={edit !== null}>
                    <Col md='4'>
                      <FormGroupCustom
                        isDisabled={isValid(edit)}
                        label={'branch'}
                        type={'select'}
                        // defaultOptions
                        value={watch('branch_id')}
                        isClearable
                        matchWith={'id'}
                        control={control}
                        rules={{ required: false }}
                        errors={errors}
                        options={branch}
                        name={'branch_id'}
                        className='mb-2'
                      />
                    </Col>
                  </Show>
                </Hide>
                <Show IF={edit === null}>
                  <Col md='4'>
                    <FormGroupCustom
                      // isDisabled={isValid(edit)}
                      label={'branch'}
                      type={'select'}
                      // defaultOptions
                      // value={watch('branch_id')}
                      isClearable
                      matchWith={'id'}
                      control={control}
                      rules={{ required: false }}
                      errors={errors}
                      options={branchWE}
                      name={'branch_id'}
                      className='mb-2'
                    />
                  </Col>
                </Show>

                <Show IF={userType === UserTypes.employee}>
                  <Show IF={edit !== null}>
                    <Col md='4'>
                      <FormGroupCustom
                        label={'assign-patient'}
                        key={`change-${branch}`}
                        type={'select'}
                        async
                        isMulti
                        value={
                          isValidArray(edit?.assigned_patiens)
                            ? edit?.assigned_patiens
                            : isValidArray(watch('assigned_patiens'))
                            ? watch('assigned_patiens')
                            : ''
                        }
                        defaultOptions
                        control={control}
                        options={patients}
                        loadOptions={loadPatients}
                        name={'assigned_patiens'}
                        onChangeValue={(e) => {
                          log(e)
                        }}
                        rules={{ required: false }}
                        className={classNames('mb-2')}
                      />
                    </Col>
                  </Show>
                  <Show IF={edit === null}>
                    <Col md='4'>
                      <FormGroupCustom
                        label={'assign-patient'}
                        key={`change-${watch('branch_id')}`}
                        type={'select'}
                        async
                        isMulti
                        // value={isValidArray(edit?.assigned_patiens) ? edit?.assigned_patiens : isValidArray(watch('assigned_patiens')) ? watch('assigned_patiens') : ''}
                        defaultOptions
                        control={control}
                        options={patientsWE}
                        loadOptions={loadPatientsWithoutEdit}
                        name={'assigned_patiens'}
                        onChangeValue={(e) => {
                          log(e)
                        }}
                        rules={{ required: false }}
                        className={classNames('mb-2')}
                      />
                    </Col>
                  </Show>
                </Show>

                <Col md='4'>
                  <Show IF={isValid(edit?.joining_date)}>
                    <BsTooltip title={FM('joining-note')}>
                      <LiveHelp style={{ width: 20, height: 20 }} className={'text-danger'} />
                    </BsTooltip>
                  </Show>
                  <FormGroupCustom
                    name={'joining_date'}
                    setValue={setValue}
                    type={'date'}
                    errors={errors}
                    // className="mb-2"
                    control={control}
                    className={classNames({ 'pe-none': isValid(edit?.joining_date) })}
                    disabled={isValid(edit?.joining_date)}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    label={FM('contract-type')}
                    type={'select'}
                    values={edit}
                    control={control}
                    rules={{ required: false }}
                    errors={errors}
                    isClearable
                    options={createConstSelectOptions(ContractType, FM)}
                    name={'contract_type'}
                    className='mb-2'
                  />
                </Col>

                <Col md='4'>
                  <FormGroupCustom
                    label={'salary'}
                    type={'number'}
                    values={edit}
                    control={control}
                    rules={{ required: false, pattern: Patterns.NumberOnly, min: 0 }}
                    errors={errors}
                    name={'contract_value'}
                    className='mb-2'
                  />
                </Col>

                <Col md='8'>
                  <Label className='mb-12px'>{FM('employee-type')}</Label>

                  <div className='d-flex'>
                    <FormGroupCustom
                      name={'employee_type'}
                      type={'radio'}
                      defaultChecked={watch('employee_type') === '3'}
                      value='3'
                      setValue={setValue}
                      errors={errors}
                      label={FM('seasonal')}
                      className='mb-2 me-2'
                      control={control}
                      rules={{ required: false }}
                      values={edit}
                    />

                    <FormGroupCustom
                      name={'employee_type'}
                      type={'radio'}
                      defaultChecked={watch('employee_type') === '1'}
                      value='1'
                      label={FM('regular')}
                      errors={errors}
                      className='mb-2 me-2'
                      setValue={setValue}
                      control={control}
                      rules={{ required: false }}
                      values={edit}
                    />

                    <FormGroupCustom
                      name={'employee_type'}
                      type={'radio'}
                      defaultChecked={watch('employee_type') === '2'}
                      value='2'
                      label={FM('substitute')}
                      errors={errors}
                      className='mb-2 me-2'
                      setValue={setValue}
                      control={control}
                      rules={{ required: false }}
                      values={edit}
                    />

                    <FormGroupCustom
                      name={'employee_type'}
                      type={'radio'}
                      defaultChecked={watch('employee_type') === '4'}
                      value='4'
                      label={FM('other')}
                      errors={errors}
                      className='mb-2 me-2'
                      setValue={setValue}
                      control={control}
                      rules={{ required: false }}
                      values={edit}
                    />
                  </div>
                </Col>
              </Show>
            </Row>
          </Form>
        </>
      )}
    </div>
  )
}

export default UserStep1
