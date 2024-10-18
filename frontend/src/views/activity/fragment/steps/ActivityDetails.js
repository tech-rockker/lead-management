import classNames from 'classnames'
import React, { useEffect, useReducer, useState } from 'react'
import { Plus } from 'react-feather'
import { Alert, Card, CardBody, Col, Form, InputGroupText, Label, Row } from 'reactstrap'
import { categoriesLoad, categoryChildList } from '../../../../utility/apis/categories'
//import { categoryChildList } from '../../../../utility/apis/commons'
import { loadPatientPlanList } from '../../../../utility/apis/ip'
import { loadUser } from '../../../../utility/apis/userManagement'
import { CategoryType, forDecryption, UserTypes } from '../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import { Permissions } from '../../../../utility/Permissions'
import Show, { Can } from '../../../../utility/Show'
import {
  createAsyncSelectOptions,
  createSelectOptions,
  decryptObject,
  SpaceTrim
} from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'
import Shimmer from '../../../components/shimmers/Shimmer'
import BsTooltip from '../../../components/tooltip'
import IpStepModal from '../../../masters/ip/fragment/IpStepModal'
import UserModal from '../../../userManagement/fragment/UserModal'

const ActivityDetails = ({
  clearErrors = () => {},
  open = false,
  user = null,
  setDisplay = () => {},
  setIpData = () => {},
  loadingDetails = false,
  ipRes = null,
  resLabel = null,
  requiredEnabled,
  watch,
  setValue,
  getValues,
  edit,
  onSubmit,
  control,
  errors
}) => {
  //category
  const [category, setCategory] = useState([])

  //subCategory
  const [subCategory, setSubCategory] = useState([])
  /////ip
  const [ip, setIp] = useState([])
  //patient
  const [patient, setPatient] = useState([])
  //emp_id
  const [emp, setEmp] = useState([])
  const [assignedEmp, setAssignedEmp] = useState([])
  //branch
  const [branch, setBranch] = useState([])

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedIp, setSelectedIp] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCat, setSelectedSubCat] = useState(null)
  const [branchId, setBranchId] = useState(null)

  // ip id
  // const [ipData, setIpData] = useState(null)

  // Reducer State
  const disabledInit = {
    category: false,
    subcategory: false,
    ip: false,
    patient: false
  }

  /** @returns {disabledInit} */
  const stateReducer = (o, n) => ({ ...o, ...n })
  const [disabled, setDisabled] = useReducer(stateReducer, disabledInit)

  // End Reducer State

  // category options
  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.implementation }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setCategory)
  }

  // sub  Category Options
  const loadCatOptions = async (search, loadedOptions, { page }) => {
    if (watch('category_id')) {
      const res = await categoryChildList({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, parent_id: watch('category_id') }
      })
      return createAsyncSelectOptions(res, page, 'name', 'id', setSubCategory)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  //load ip options
  // const loadIpOption = async (search, loadedOptions, { page }) => {

  //     const res = await loadPatientPlanList({
  //         async: true,
  //         page,
  //         perPage: 100,
  //         jsonData: { name: search, category_type_id: CategoryType.activity }
  //     })
  //     return createAsyncSelectOptions(res, page, "title", "id", setIp)

  // }

  //patient options
  const loadPatientOption = async (search, loadedOptions, { page }) => {
    // return await UserDropdown({ search, page, user_type_id: UserTypes.patient })
    const res = await loadUser({
      async: true,
      page,
      perPage: 500,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  // IP according to Patient
  const loadIpOption = async (search, loadedOptions, { page }) => {
    if (watch('patient_id')) {
      const res = await loadPatientPlanList({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, user_id: watch('patient_id') }
      })
      return createAsyncSelectOptions(res, page, 'title', null, setIp)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  const handleNewPatient = (e, disabled = false) => {
    log('handleNewPatient', e)
    loadPatientOption()
    setSelectedPatient({
      label: e?.name,
      value: e?.id
    })
    setValue('patient_id', e?.id)
    setDisabled({
      patient: disabled
    })
  }

  const handleNewCategory = (e) => {
    // loadCategoryData()
    setSelectedCategory({
      label: e?.name,
      value: e?.id
    })
    if (isValid(e)) {
      setValue('category_id', e?.id)
    }
    log('category_id', e)
    setDisabled({
      category: true
    })
  }
  useEffect(() => {
    log('new selectedIp', selectedIp)
  }, [selectedIp])

  const handleNewSubCategory = (e) => {
    // loadCatOptions()
    setSelectedSubCat({
      label: e?.name,
      value: e?.id
    })
    setValue('subcategory_id', e?.id)
    setDisabled({
      subcategory: true
    })
  }
  const getIpCategory = () => {
    const ipId = isValid('ip_id') ? watch('ip_id') : ''
    log('ipId', ipId)
    if (isValid(ipId)) {
      log('valid')
      const ipDetails = ip?.find((a) => a?.value?.id === ipId)
      log(ipDetails, 'ipdetals')

      if (typeof ipDetails === 'object') {
        log(ipDetails)
        if (isValid(ipDetails?.value?.category)) {
          handleNewCategory(ipDetails?.value?.category)
        }
        if (isValid(ipDetails?.value?.subcategory)) {
          handleNewSubCategory(ipDetails?.value?.subcategory)
        }
      }
    }
  }

  const getIpValue = () => {
    const ipId = isValid('ip_id') ? watch('ip_id') : ''
    if (isValid(ipId)) {
      const ipDetails = ip?.find((a) => a?.value?.id === ipId)
      return ipDetails?.value
    }
  }
  const handleNewIp = (e, f = false, disabled = false) => {
    log('eeeee, e', e)
    // loadIpOption()
    if (f) {
      setSelectedIp({
        label: e[0]?.title,
        value: e[0]?.id
      })
      setValue('ip_id', e[0]?.id)
    } else {
      setSelectedIp({
        label: e?.title,
        value: e?.id
      })
      setValue('ip_id', e?.id)
    }
    setDisabled({
      ip: disabled
    })
  }

  useEffect(() => {
    getIpCategory()
  }, [ip])

  useEffect(() => {
    setValue('branch_id', branchId)
  }, [branchId])

  useEffect(() => {
    if (open) {
      if (isValidArray(ipRes)) {
        setIp(createSelectOptions(ipRes, 'title', null))

        handleNewIp(ipRes[0], false, true)
        handleNewPatient(ipRes[0]?.patient, true)

        handleNewCategory(ipRes[0]?.category)
        handleNewSubCategory(ipRes[0].subcategory)
      }
    }
  }, [ipRes, open])

  //emp options
  // const loadEmpOptions = async (search, loadedOptions, { page = 1 }) => {
  //   if (isValid(branchId)) {
  //     const res = await loadUser({
  //       async: true,
  //       page,
  //       perPage: 100,
  //       jsonData: { name: search, branch_id: branchId, user_type_id: UserTypes.employee }
  //     })
  //     return createAsyncSelectOptions(res, page, 'name', 'id', setEmp, (x) => {
  //       return decryptObject(forDecryption, x)
  //     })
  //   } else {
  //     return {
  //       options: [],
  //       hasMore: false
  //     }
  //   }
  // }

  const loadEmpOptions = async (search, loadedOptions, { page = 1 }) => {
    if (isValid(branchId)) {
      const res = await loadUser({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, branch_id: branchId, user_type_id: UserTypes.employee }
      })
      const patientId = watch('patient_id')
      const empData = res?.data?.payload?.data

      // Decrypt employee data
      const decryptedEmpData = empData.map((emp) => decryptObject(forDecryption, emp))

      // Filter to get employees assigned to the selected patient
      const assignedEmpData = decryptedEmpData.filter((emp) =>
        emp.employee_patients.some((ep) => ep.patient_id === patientId)
      )

      setAssignedEmp(assignedEmpData.map((emp) => emp.id))

      if (isValid(edit)) {
        setValue('employees', getValues('employees'))
      } else {
        setValue(
          'employees',
          assignedEmpData.map((emp) => emp.id)
        )
      }

      return createAsyncSelectOptions(res, page, 'name', 'id', setEmp, (x) => {
        return decryptObject(forDecryption, x)
      })
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  //branch options
  const loadBranchOptions = async (search = null, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { user_type_id: UserTypes.branch }
    })
    return createAsyncSelectOptions(res, page, 'branch_name', 'id', setBranch, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  // useEffect(() => {
  //     setValue("remind_before_start", watch('is_compulsory'))
  //     setValue("in_time", watch('is_compulsory'))
  // }, [watch('is_compulsory')])

  useEffect(() => {
    if (edit !== null) {
      // loadIpOption()
    }
  }, [watch('patient_id')])

  useEffect(() => {
    if (isValid(watch('ip_id'))) {
      getIpCategory()
      if (!isValid(edit)) {
        setValue('start_date', '')
        setValue('end_date', '')
      }
    }
  }, [watch('ip_id'), edit])

  useEffect(() => {
    if (isValid(edit)) {
      // setValue("ip_id", edit?.ip_id)
      setValue('patient_id', edit?.patient_id)
      setBranchId(edit?.branch_id)

      setSelectedIp({
        label: '',
        value: edit?.ip_id
      })
      // setIp(createSelectOptions([edit?.implementation_plan], "title", null))
    }
  }, [edit])

  //Changing comment some bug resolve if you change the activate again  the Bug: (f you create an IP with one category and then change the category while creating it then activity is keeping same category.)
  useEffect(() => {
    if (edit !== null) {
      const name = subCategory?.find((a) => a?.value?.id === edit?.subcategory_id)?.value?.name
      if (isValid(name)) {
        // setValue("subcategory_id", edit?.subcategory_id)
        clearErrors('subcategory_id')
        // handleNewSubCategory({ id: edit?.subcategory_id, name: subCategory?.find(a => a?.value?.id === edit?.subcategory_id)?.value?.name })
      }
      // setValue("ip_id", edit?.ip_id)
      clearErrors('subcategory_id')
      clearErrors('category_id')
      setDisabled({
        subcategory: true,
        category: true
      })
      setValue('patient_id', edit?.patient_id)
    }
  }, [edit, category, subCategory])

  useEffect(() => {
    if (user) {
      setValue('patient_id', user)
    }
  }, [user])

  useEffect(() => {
    if (edit === null) {
      // setValue("ip_id", null)
      // setValue("category_id", null)
      // setValue("subcategory_id", null)
    }
  }, [patient])

  useEffect(() => {
    if (!isValid(watch('ip_id')) && !isValid(edit)) {
      setSelectedCategory(null)
      setSelectedSubCat(null)
      setValue('category_id', null)
      setValue('subcategory_id', null)
    }
  }, [watch('ip_id'), edit])

  // log('editData', edit)
  // log('selectedIp', ip)

  return (
    <>
      <div className='overflow-x-hidden p-2'>
        {loadingDetails ? (
          <>
            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          </>
        ) : (
          <>
            <Form onSubmit={onSubmit}>
              <Card className='p-2 mb-1 shadow rounded'>
                <Row>
                  <div className='content-header mb-1'>
                    <h5 className='mb-0'>{FM('ip-patient')}</h5>
                    <small className='text-muted'>{FM('select-ip-patient')}</small>
                  </div>

                  <Col md='6'>
                    <FormGroupCustom
                      key={`pp-${selectedPatient?.value}`}
                      append={
                        ipRes === null && edit === null ? (
                          <Show IF={Can(Permissions.patientsAdd) && user === null}>
                            {' '}
                            <BsTooltip title={FM('add-new')} Tag={InputGroupText}>
                              <UserModal
                                Component={Plus}
                                size={18}
                                enableSaveIp={false}
                                onSuccess={handleNewPatient}
                                userType={UserTypes.patient}
                                scrollControl={false}
                                handleToggle={(e) => {
                                  if (e) {
                                    setDisplay(false)
                                  } else {
                                    setValue('patient_id', null)
                                    setSelectedPatient(null)
                                    setDisplay(true)
                                  }
                                }}
                              />
                            </BsTooltip>{' '}
                          </Show>
                        ) : null
                      }
                      type={'select'}
                      control={control}
                      errors={errors}
                      name={'patient_id'}
                      defaultOptions
                      matchWith={'id'}
                      async
                      isDisabled={edit?.patient_id || user !== null}
                      cacheOptions
                      loadOptions={loadPatientOption}
                      onChangeValue={(e) => {
                        setSelectedIp(null)
                        setValue('ip_id', null)
                        setBranchId(patient?.find((p) => p.value?.id === e)?.value?.branch_id)
                      }}
                      value={selectedPatient?.value ?? edit?.patient_id ?? user}
                      options={patient}
                      label={FM('patient')}
                      rules={{ required: requiredEnabled }}
                      placeholder={edit !== null || ipRes !== null ? FM('loading') : FM('select')}
                      // placeholder={"sdsddfd"}
                      className='mb-1'
                    />
                  </Col>

                  <Col md='6'>
                    <FormGroupCustom
                      type={'select'}
                      key={`test-${watch('patient_id')}-${selectedIp?.value}`}
                      control={control}
                      append={
                        ipRes === null && edit === null ? (
                          <Show IF={Permissions.ipSelfBrowse}>
                            {' '}
                            <BsTooltip title={FM('add-new')} Tag={InputGroupText}>
                              <IpStepModal
                                createFor={
                                  patient?.find((a) => a.value === watch('patient_id')) ?? null
                                }
                                Component={Plus}
                                size={18}
                                enableNext={false}
                                enableSaveIp={false}
                                onSuccess={(e) => handleNewIp(e, true)}
                                userType={UserTypes.patient}
                                scrollControl={false}
                                handleToggle={(e) => {
                                  if (e) {
                                    setDisplay(false)
                                  } else {
                                    setDisplay(true)
                                  }
                                }}
                              />
                            </BsTooltip>{' '}
                          </Show>
                        ) : null
                      }
                      errors={errors}
                      name={'ip_id'}
                      matchWith='id'
                      defaultOptions
                      async={ipRes === null}
                      cacheOptions
                      isClearable={!isValid(edit)}
                      placeholder={FM('select')}
                      isDisabled={disabled?.ip}
                      loadOptions={loadIpOption}
                      value={selectedIp?.value ?? edit?.ip_id}
                      values={selectedIp}
                      options={isValidArray(ipRes) ? createSelectOptions(ipRes, 'title', 'id') : ip}
                      label={FM('implementations')}
                      rules={{ required: false }}
                      className={classNames('mb-1')}
                      onChangeValue={(e) => {
                        if (!isValid(e)) {
                          setSelectedCategory(null)
                          setSelectedSubCat(null)
                          //setSelectedIp(null)
                        }
                        setDisabled({
                          category: isValid(e),
                          subcategory: isValid(e)
                        })
                        setIpData(ip?.find((p) => p.value?.id === e)?.value)
                        // log(ip, e, 'implementation')
                      }}
                    />
                  </Col>
                  <Show IF={isValid(edit?.id)}>
                    <Show IF={isValid(watch('ip_id'))}>
                      <Alert color='danger' className='mb-0'>
                        <p className='p-1 m-0'>
                          {FM('ip-change-warning', {
                            start_date: getIpValue()?.start_date,
                            end_date: getIpValue()?.end_date
                          })}
                        </p>
                      </Alert>
                    </Show>
                  </Show>
                </Row>
              </Card>
              <Card className='p-2 mb-1 shadow rounded'>
                <Row>
                  <div className='content-header mb-1 mt-1'>
                    <h5 className='mb-0'>{FM('cat-sbcat')}</h5>
                    <small className='text-muted'>{FM('select-cat-subcat')}</small>
                  </div>
                  <Col md='6'>
                    <FormGroupCustom
                      type={'select'}
                      async
                      key={isValid(edit?.ip_id) ? watch('ip_id') : watch('ip_id')}
                      defaultOptions
                      loadOptions={loadCategoryData}
                      control={control}
                      value={selectedCategory?.value ?? edit?.category_id}
                      options={category}
                      errors={errors}
                      isDisabled={watch('ip_id') === null ? null : disabled?.category}
                      rules={{
                        required: true
                      }}
                      name='category_id'
                      className='mb-1'
                      onChangeValue={(e) => {
                        setSelectedSubCat(null)
                        setValue('subcategory_id', null)
                      }}
                      placeholder={edit !== null || ipRes !== null ? FM('loading') : FM('select')}
                      label={FM('category')}
                    />
                  </Col>
                  <Col md='6'>
                    <FormGroupCustom
                      type={'select'}
                      key={`${watch('category_id')}-${watch('ip_id')}`}
                      async
                      defaultOptions
                      loadOptions={loadCatOptions}
                      control={control}
                      value={selectedSubCat?.value ?? edit?.subcategory_id}
                      options={subCategory}
                      errors={errors}
                      rules={{ required: true }}
                      name='subcategory_id'
                      className='mb-1'
                      label={FM('sub-category')}
                      placeholder={FM('select')}
                      isDisabled={
                        watch('ip_id') === null || watch('category_id') === null
                          ? null
                          : disabled?.subcategory
                      }
                    />
                  </Col>
                </Row>
              </Card>

              {/* <Card className='p-2 mb-1 shadow rounded'>
                            <Row>
                                <div className='content-header mb-1 mt-1'>
                                    <h5 className='mb-0'>{FM("emp-branch")}</h5>
                                    <small className='text-muted'>{FM("select-emp-branch")}</small>
                                </div>
                         
                                <Col md="6">
                                    <FormGroupCustom
                                        type={"select"}
                                        control={control}
                                        errors={errors}
                                        name={"branch_id"}
                                        defaultOptions
                                        isClearable
                                        async
                                        cacheOptions
                                        loadOptions={loadBranchOptions}
                                        value={watch('branch_id')}
                                        options={branch}
                                        label={FM("branch")}
                                        rules={{ required: false }}
                                        noLabel={branch.length === 0}
                                        className={classNames('mb-1 ', { 'd-block': branch.length > 0, 'd-none': branch.length === 0 })}
                                    />
                                </Col>
                            </Row>
                        </Card> */}
              <Card className='p-2 mb-1 shadow rounded'>
                <Row>
                  <div className='content-header mb-1 mt-1'>
                    <h5 className='mb-0'>{FM('title-disc')}</h5>
                    <small className='text-muted'>{FM('fill-title-disc')}</small>
                  </div>
                  <Col md='12'>
                    <Row>
                      <Col md='6' className='mb-2'>
                        <FormGroupCustom
                          label={'title'}
                          name={'title'}
                          type={'text'}
                          errors={errors}
                          values={edit}
                          className='mb-3px'
                          control={control}
                          rules={{
                            required: true
                            // validate: (v) => {
                            //     return isValid(v) ? !SpaceTrim(v) : true
                            // }
                          }}
                        />
                        <Show IF={isValid(edit)}>
                          <Row>
                            <Col md='12' xs='12'>
                              <FormGroupCustom
                                key={`title_update_series-${edit?.title_update_series}`}
                                value={edit?.title_update_series}
                                placeholder={FM('change-series-title')}
                                type='checkbox'
                                name='title_update_series'
                                label={FM('change-series-title')}
                                className='mb-0'
                                errors={errors}
                                control={control}
                                rules={{ required: false }}
                              />
                            </Col>
                          </Row>
                        </Show>
                      </Col>
                      <Col md='6'>
                        <FormGroupCustom
                          key={`emp-${isValid(branchId)}-${watch('patient_id')}`}
                          type={'select'}
                          control={control}
                          errors={errors}
                          name={'employees'}
                          async
                          defaultOptions
                          cacheOptions
                          isMulti
                          loadOptions={loadEmpOptions}
                          value={!edit ? assignedEmp : edit?.assign_employee?.map((d) => d.user_id)}
                          options={emp}
                          label={FM('employee')}
                          rules={{ required: false }}
                          noLabel={!isValid(branchId)}
                          className={classNames('mb-1 ', {
                            'd-block': isValid(branchId),
                            'd-none': !isValid(branchId)
                          })}
                        />
                      </Col>
                      <Col md='4'>
                        <FormGroupCustom
                          label={'description'}
                          name={'description'}
                          type={'autocomplete'}
                          id={'desc-with-d'}
                          errors={errors}
                          style={{ minHeight: 125 }}
                          values={edit}
                          className='mb-2'
                          control={control}
                          rules={{
                            required: requiredEnabled,
                            validate: (v) => {
                              return isValid(v) ? !SpaceTrim(v) : true
                            }
                          }}
                        />
                      </Col>
                      <Col md='4'>
                        <FormGroupCustom
                          label={'external-comment'}
                          name={'external_comment'}
                          type={'autocomplete'}
                          id={'desc-with-d1'}
                          errors={errors}
                          style={{ minHeight: 125 }}
                          values={edit}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='4'>
                        <FormGroupCustom
                          label={'internal-comment'}
                          name={'internal_comment'}
                          type={'autocomplete'}
                          errors={errors}
                          id={'desc-with-d1w'}
                          style={{ minHeight: 125 }}
                          values={edit}
                          className='mb-2'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
              {/* {isValid(edit?.id) ? <Card>
                            <CardBody> <Col md="12" >
                                <FormGroupCustom
                                    name={"reason_for_editing"}
                                    label={FM("reason-for-editing")}
                                    type={"textarea"}
                                    errors={errors}
                                    className="mb-2"
                                    control={control}
                                    rules={{ required: requiredEnabled }}
                                    values={edit} />
                            </Col>
                            </CardBody>
                        </Card> : null} */}

              <Card>
                <CardBody>
                  <Row>
                    <Col md='4'>
                      <FormGroupCustom
                        name={'is_compulsory'}
                        label={FM('priority')}
                        type={'checkbox'}
                        errors={errors}
                        className='mb-2'
                        control={control}
                        rules={{ required: false }}
                        values={edit}
                      />
                    </Col>{' '}
                    <Col md='4'>
                      <FormGroupCustom
                        noLabel
                        noGroup
                        name={'is_risk'}
                        label={FM('r')}
                        type={'checkbox'}
                        errors={errors}
                        onChangeValue={(e) => {
                          if (e === false) {
                            clearErrors('message')
                          }
                        }}
                        className='mb-2 form-check-danger'
                        control={control}
                        rules={{ required: false }}
                        values={edit}
                      />
                      <Label className='text-danger ms-1'>{FM('r')}</Label>
                    </Col>
                  </Row>

                  {watch('is_risk') ? (
                    <Col md='12'>
                      <FormGroupCustom
                        name={'message'}
                        label={FM('r-description')}
                        type={'autocomplete'}
                        errors={errors}
                        className='mb-2 '
                        control={control}
                        rules={{
                          required: watch('is_risk') === 1,
                          validate: (v) => {
                            return isValid(v) ? !SpaceTrim(v) : true
                          }
                        }}
                        values={edit}
                      />
                    </Col>
                  ) : null}
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </div>
    </>
  )
}

export default ActivityDetails
