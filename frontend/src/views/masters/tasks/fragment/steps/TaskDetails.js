import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row } from 'reactstrap'
import { loadActivity, viewActivity } from '../../../../../utility/apis/activity'
import { categoriesLoad, categoryChildList } from '../../../../../utility/apis/categories'
//import { categoryChildList } from '../../../../../utility/apis/commons'
import { loadFollowUp } from '../../../../../utility/apis/followup'
import { loadPatientPlanList } from '../../../../../utility/apis/ip'
import { loadUser } from '../../../../../utility/apis/userManagement'
import {
  CategoryType,
  forDecryption,
  selectCategoryType,
  UserTypes
} from '../../../../../utility/Const'
import { FM, isValid, log } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import useModules from '../../../../../utility/hooks/useModules'
import useTopMostParent from '../../../../../utility/hooks/useTopMostParent'
import Show from '../../../../../utility/Show'
import { createAsyncSelectOptions, decryptObject, SpaceTrim } from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import Shimmer from '../../../../components/shimmers/Shimmer'
import useUserType from './../../../../../utility/hooks/useUserType'

const TaskDetails = ({
  dUser = false,
  sourceId = null,
  user = null,
  resourceType = null,
  activity = null,
  activityForEmp = null,
  setDisplay = () => {},
  loadingDetails = false,
  resLabel = null,
  ipRes = null,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  //category
  const [category, setCategory] = useState([])
  const [categoryLoad, setCategoryLoad] = useState(false)
  //subCategory O
  const [subCategory, setSubCategory] = useState([])
  const [subLoad, setSubLoad] = useState(false)
  /////ip

  const [ip, setIp] = useState([])
  const [ipLoad, setIpLoad] = useState(false)
  //patient
  const [patient, setPatient] = useState([])
  const [paientLoad, setPatientLoad] = useState(false)
  //emp_id
  const [emp, setEmp] = useState([])
  const [empSel, setEmpSel] = useState(null)
  const [empLoad, setEmpLoad] = useState(false)
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()

  //branch
  const [branch, setBranch] = useState([])
  const [branchLoading, setBranchLoading] = useState(false)

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedIp, setSelectedIp] = useState(null)
  // activity
  const [activities, setActivities] = useState(null)
  // followup
  const [followup, setFollowup] = useState(null)

  const [type, setType] = useState(null)

  const userType = useUserType()
  const topMostParent = useTopMostParent()

  // category options
  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.activity }
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
  useEffect(() => {
    if (userType) {
      setType(userType)
    }
  }, [userType])

  //patient options
  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  // load activity option
  const loadActivityData = async (search, loadedOptions, { page }) => {
    if (watch('resource_id')) {
      const res = await loadActivity({
        async: true,
        page,
        perPage: 100,
        jsonData: {
          name: search,
          category_type_id: CategoryType.activity,
          patient_id: watch('resource_id')
        }
      })
      return createAsyncSelectOptions(res, page, 'title', 'id', setActivities)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  // load followup option
  const loadFollowupData = async (search, loadedOptions, { page }) => {
    const res = await loadFollowUp({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.followups }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setFollowup)
  }

  //load ip options
  const loadIpOption = async (search, loadedOptions, { page }) => {
    const res = await loadPatientPlanList({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.implementation }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setIp)
  }

  //Branch option
  const loadBranchOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.branch }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setBranch)
  }

  const handleNewPatient = (e) => {
    log('eeeee, e', e)
    loadPatientOption()
    setSelectedPatient({
      label: e?.name,
      value: e?.id
    })
    setValue('type_id', e?.id)
  }
  const handleNewEmployee = (e) => {
    setEmpSel({
      label: '',
      value: e?.assign_employee?.map((a) => a.employee?.id)
    })
    setValue(
      'employees',
      e?.assign_employee?.map((a) => a.employee?.id)
    )
  }
  const loadDetails = (id) => {
    if (isValid(id)) {
      viewActivity({
        id,
        success: (a) => {
          log(a)
          handleNewEmployee(a)
        }
      })
    }
  }

  useEffect(() => {
    if (isValid(activity)) {
      handleNewPatient({
        name: '',
        id: activity?.patient_id
      })
      if (resourceType !== CategoryType.jaurnal) {
        loadDetails(activity?.id)
      }
      //
    }
  }, [activity, sourceId])

  useEffect(() => {
    if (isValid(edit)) {
      setSelectedPatient(edit?.resource_id)
    }
  }, [edit])

  const handleNewIp = (e) => {
    log('eeeee, e', e)
    loadIpOption()
    setSelectedIp({
      label: e?.name,
      value: e?.id
    })
    setValue('ip_id', e?.id)
  }

  //emp options
  const loadEmpOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: {
        name: search,
        user_type_id:
          userType === UserTypes.admin || userType === UserTypes.adminEmployee
            ? UserTypes.adminEmployee
            : UserTypes.employee
      }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setEmp, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  //branch options
  const loadBranchOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.branch }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setBranch)
  }

  return (
    <>
      <div className='p-2'>
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
                <div className='content-header mb-1'>
                  <h5 className='mb-0'>{FM('add-task')}</h5>
                  <small className='text-muted'>{FM('add-task-details')}</small>
                </div>
                <Row>
                  <Col md='8'>
                    <FormGroupCustom
                      label={'title'}
                      name={'title'}
                      type={'text'}
                      errors={errors}
                      values={edit}
                      className='mb-2'
                      control={control}
                      rules={{ required: requiredEnabled }}
                    />
                  </Col>
                  <Show
                    IF={
                      userType === UserTypes.admin ||
                      userType === UserTypes.company ||
                      userType === UserTypes.branch ||
                      userType === UserTypes.employee ||
                      userType === UserTypes.adminEmployee
                    }
                  >
                    <Col md='4'>
                      <FormGroupCustom
                        type={'select'}
                        control={control}
                        errors={errors}
                        name={'employees'}
                        async
                        defaultOptions
                        cacheOptions
                        isMulti
                        loadOptions={loadEmpOptions}
                        value={empSel?.value ?? edit?.assign_employee?.map((d) => d.user_id)}
                        // isDisabled={edit !== null}
                        onChangeValue={(e) => {
                          if (isValid(e)) {
                            if (topMostParent?.user_type_id === UserTypes.admin) {
                              setType(UserTypes?.adminEmployee)
                              setValue('type_id', UserTypes?.adminEmployee)
                              log('admEmp', setValue)
                            } else {
                              setType(UserTypes?.employee)
                              setValue('type_id', UserTypes?.employee)
                              // log("Emp", setValue)
                            }
                          } else {
                            setType(userType)
                            setValue('type_id', userType)
                            // log("usertype", userType)
                          }
                        }}
                        options={emp}
                        label={FM('employees')}
                        rules={{ required: false }}
                        noLabel={emp.length === 0}
                        className={classNames('mb-1', {
                          'd-block': emp.length > 0,
                          'd-none': emp.length === 0
                        })}
                      />
                    </Col>
                  </Show>
                  {/* </Show> */}
                  <Col md='8'>
                    <FormGroupCustom
                      label={'description'}
                      name={'description'}
                      type={'autocomplete'}
                      errors={errors}
                      values={edit}
                      isDisabled={edit !== null}
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
                  <Hide IF={sourceId}>
                    <Col md='4'>
                      <FormGroupCustom
                        key={`type-${type}`}
                        type={'hidden'}
                        control={control}
                        errors={errors}
                        name={'type_id'}
                        value={type}
                        label={FM('task-for')}
                        rules={{ required: false }}
                        noGroup
                        noLabel
                      />
                      <Show
                        IF={
                          isValid(edit)
                            ? edit?.type_id === selectCategoryType.activity ||
                              edit?.type_id === selectCategoryType.patient ||
                              edit?.type_id === null ||
                              edit?.type_id === userType
                            : true
                        }
                      >
                        <Show
                          IF={
                            (edit?.type_id === selectCategoryType.patient ||
                              type === UserTypes.employee ||
                              type === selectCategoryType?.patient ||
                              type === UserTypes.company ||
                              userType === UserTypes.branch ||
                              isValid(watch('resource_id'))) &&
                            topMostParent?.user_type_id !== UserTypes.admin &&
                            edit?.type_id !== selectCategoryType.activity
                          }
                        >
                          <Hide IF={edit?.type_id === selectCategoryType.implementation}>
                            <Row>
                              <FormGroupCustom
                                key={`pp-${patient?.value}`}
                                type={'select'}
                                control={control}
                                errors={errors}
                                name={'resource_id'}
                                defaultOptions
                                async
                                isDisabled={dUser === true}
                                cacheOptions
                                isClearable
                                loadOptions={loadPatientOption}
                                onChangeValue={(e) => {
                                  if (isValid(e)) {
                                    setType(CategoryType?.patient)
                                    setValue('type_id', CategoryType?.patient)
                                    setSelectedPatient(e)
                                    setActivities(
                                      patient?.find((p) => p.value?.id === e)?.value?.resource_id
                                    )
                                  } else {
                                    const t = isValid(watch('employees'))
                                      ? UserTypes.employee
                                      : userType
                                    setType(t)
                                    setValue('type_id', t)

                                  }
                                }}
                                value={selectedPatient ?? edit?.resource_id ?? user}
                                options={patient}
                                label={FM('patient')}
                                rules={{ required: false }}
                                className='mb-1'
                              />
                            </Row>
                          </Hide>
                        </Show>
                        <Show IF={ViewActivity}>
                          <Show
                            IF={
                              type === selectCategoryType?.patient ||
                              type === selectCategoryType?.activity
                              // || edit?.type_id === selectCategoryType?.activity || edit?.type_id === selectCategoryType?.implementation || edit?.type_id === selectCategoryType?.followups
                              // || edit?.type_id === selectCategoryType?.jaurnal || edit?.type_id === selectCategoryType?.deviation
                            }
                          >
                            <Row>
                              <FormGroupCustom
                                key={`watch-${selectedPatient}-${edit?.resource_id}`}
                                type={'select'}
                                control={control}
                                errors={errors}
                                name={'resource_id'}
                                async={edit?.type_id !== selectCategoryType?.activity}
                                defaultOptions
                                cacheOptions
                                isClearable
                                loadOptions={loadActivityData}
                                onChangeValue={(e) => {
                                  if (isValid(e)) {
                                    setType(CategoryType?.activity)
                                    setValue('type_id', CategoryType?.activity)
                                  } else {
                                    setType(selectCategoryType?.patient)
                                    setValue('type_id', CategoryType?.patient)
                                  }
                                }}
                                value={edit?.resource_id}
                                options={
                                  edit?.type_id === selectCategoryType?.activity
                                    ? [
                                        {
                                          label: edit?.resource_data?.activity?.title,
                                          value: edit?.resource_id
                                        }
                                      ]
                                    : activities
                                }
                                label={FM('activity')}
                                rules={{ required: false }}
                                className='mb-1'
                              />
                            </Row>
                          </Show>
                        </Show>
                      </Show>
                      {/* {edit && edit?.resource_id === null ? <> <Row>
                                        <FormGroupCustom
                                            key={`pp-${patient?.value}`}
                                            type={"select"}
                                            control={control}
                                            errors={errors}
                                            name={"patient"}
                                            defaultOptions
                                            async
                                            cacheOptions
                                            loadOptions={loadPatientOption}
                                            onChangeValue={(e) => {
                                                setActivities(patient?.find(p => p.value?.id === e)?.value?.resource_id)
                                            }}
                                            value={patient?.value ?? edit?.resource_id}
                                            options={patient}
                                            label={FM("patient")}
                                            rules={{ required: false }}
                                            className='mb-1'
                                        />
                                    </Row>
                                        <Row>
                                            <FormGroupCustom
                                                key={watch("patient") === selectCategoryType.activity}
                                                type={"select"}
                                                control={control}
                                                errors={errors}
                                                name={"activity_id"}
                                                async
                                                defaultOptions
                                                cacheOptions
                                                loadOptions={loadActivityData}
                                                value={edit?.resource_id}
                                                options={activities}
                                                label={FM("activity")}
                                                rules={{ required: false }}
                                                className='mb-1'
                                                isDisabled={!watch("patient")}
                                            />
                                        </Row> </> : null} */}

                      {/* {watch("type_id") === selectCategoryType.patient ? <Row>
                                            <FormGroupCustom
                                                key={`pp-${patient?.value}`}
                                                type={"select"}
                                                control={control}
                                                errors={errors}
                                                name={"patient"}
                                                defaultOptions
                                                async
                                                cacheOptions
                                                loadOptions={loadPatientOption}
                                                value={patient?.value ?? edit?.resource_id}
                                                options={patient}
                                                label={FM("patient")}
                                                rules={{ required: false }}
                                                className='mb-1'
                                            />
                                        </Row> : null} */}
                      {/* {edit?.type_id === selectCategoryType.implementation ? <Row>
                                            <FormGroupCustom
                                                type={"select"}
                                                control={control}
                                                errors={errors}
                                                name={"ip_id"}
                                                async
                                                defaultOptions
                                                cacheOptions
                                                loadOptions={loadIpOption}
                                                value={ip?.value ?? edit?.resource_id}
                                                options={ip}
                                                label={FM("ip-plans")}
                                                rules={{ required: false }}
                                                className='mb-1'
                                            />
                                        </Row> : null} */}

                      {/* {watch("type_id") === selectCategoryType.activity ? <Row>
                                            <FormGroupCustom
                                                key={`${watch("patient_id")}-${selectedPatient?.value}`}
                                                type={"select"}
                                                control={control}
                                                errors={errors}
                                                name={"activity_id"}
                                                async
                                                defaultOptions
                                                cacheOptions
                                                loadOptions={loadActivityData}
                                                value={edit?.resource_id}
                                                options={activities}
                                                label={FM("activity")}
                                                rules={{ required: false }}
                                                className='mb-1'
                                                isDisabled={!watch("patient")}
                                            />
                                        </Row> : null} */}

                      {/* {edit?.type_id === selectCategoryType.followups ? <Row>
                                            <FormGroupCustom
                                                type={"select"}
                                                control={control}
                                                errors={errors}
                                                name={"follow_up"}
                                                async
                                                defaultOptions
                                                cacheOptions
                                                loadOptions={loadFollowupData}
                                                value={edit?.resource_id}
                                                options={followup}
                                                label={FM("followups")}
                                                rules={{ required: false }}
                                                className='mb-1'
                                            />
                                        </Row> : null} */}
                      {/* {watch("type_id") === selectCategoryType.branch ? <Row>
                                            <FormGroupCustom
                                                type={"select"}
                                                control={control}
                                                errors={errors}
                                                name={"branch"}
                                                async
                                                defaultOptions
                                                cacheOptions
                                                loadOptions={loadBranchOptions}
                                                values={branch?.value ?? edit?.resource_id}
                                                options={branch}
                                                label={FM("branch")}
                                                rules={{ required: false }}
                                                className='mb-1'
                                            />
                                        </Row> : null} */}
                    </Col>
                  </Hide>
                  {/* {isValid(edit?.id) ? <Col md="8" >
                                    <FormGroupCustom
                                        name={"reason_for_editing"}
                                        label={FM("reason-for-editing")}
                                        type={"autocomplete"}
                                        errors={errors}
                                        className="mb-2"
                                        control={control}
                                        rules={{ required: requiredEnabled }}
                                        values={edit} />
                                </Col> : null} */}
                </Row>
              </Card>
            </Form>
          </>
        )}
      </div>
    </>
  )
}

export default TaskDetails
