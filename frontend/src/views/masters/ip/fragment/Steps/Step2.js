import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { useFieldArray } from 'react-hook-form'
import SlideDown from 'react-slidedown'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  InputGroupText,
  Label,
  Row
} from 'reactstrap'
import { categoriesLoad, categoryChildList } from '../../../../../utility/apis/categories'
import { loadIpTemplates, viewPatientPlan } from '../../../../../utility/apis/ip'
import { loadUser } from '../../../../../utility/apis/userManagement'
import {
  CategoryType,
  goals,
  goalTypes,
  ipFields,
  IpTemplatesFiled,
  subGoalTypes,
  UserTypes,
  weekDays,
  whoGiveSupport
} from '../../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import useUserType from '../../../../../utility/hooks/useUserType'
import Show from '../../../../../utility/Show'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  enableFutureDates,
  fastLoop,
  jsonDecodeAll,
  setValues,
  toggleArray
} from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import Shimmer from '../../../../components/shimmers/Shimmer'
import BsTooltip from '../../../../components/tooltip'
import UserModal from '../../../../userManagement/fragment/UserModal'

const Step2 = ({
  path = 2,
  formFields = null,
  getValues = () => {},
  handleStepBg = () => {},
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
  const [patient, setPatient] = useState([])
  const userType = useUserType()
  const [category, setCategory] = useState([])
  const [templates, setTemplates] = useState([])
  const [patientSelected, setPatientSelected] = useState(null)
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [template, setTemplate] = useState(null)
  const [subCategory, setSubCategory] = useState([])
  const [totalSteps, setTotalSteps] = useState({
    category_id: null,
    subcategory_id: null,
    user_id: null
  })

  const { fields, append, prepend, remove, swap, move, insert, update, replace } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'plans' // unique name for your Field Array
  })

  // [
  //     {
  //         user_id: 227,
  //         persons: [
  //             {
  //                 id: 152,
  //                 patient_id: 227,
  //                 ip_id: null,
  //                 follow_up_id: null,
  //                 name: "Test",
  //                 email: "Test11111-perosn@email.com",
  //                 contact_number: "0999 999 992",
  //                 country_id: 94,
  //                 city: "Stockholm1",
  //                 postal_area: "2323",
  //                 zipcode: "11152",
  //                 full_address: "Address1",
  //                 is_family_member: 0,
  //                 is_caretaker: 1,
  //                 is_contact_person: 0,
  //                 is_guardian: 0,
  //                 is_other: 1,
  //                 is_presented: 1,
  //                 is_participated: 1,
  //                 how_helped: "I helped",
  //                 is_other_name: "Manager"
  //             }
  //         ],
  //         category_id: 39,
  //         subcategory_id: 40,
  //         title: "t",
  //         save_as_template: 1,
  //         goal_id: "other",
  //         limitations: [
  //             "other",
  //             "no-restriction"
  //         ],
  //         limitation_details: "test",
  //         how_support_should_be_given: "test",
  //         week_days: [1, 6],
  //         how_many_time: "3",
  //         when_during_the_day: "m",
  //         who_give_support: [
  //             "caretaker",
  //             "staff"
  //         ],
  //         sub_goal_id: "other",
  //         sub_goal_details: "3w",
  //         overall_goal_id: "good-living-conditions",
  //         overall_goal_details: "Yes good!!!",
  //         body_functions: "body",
  //         personal_factors: "personal",
  //         health_conditions: "health",
  //         other_factors: "Factors",
  //         treatment: "treatment",
  //         working_method: "working",
  //         documents: [
  //             {
  //                 file_name: "doctor report",
  //                 file_url: "https//www.example.pdf"
  //             }
  //         ]
  //     }
  // ]
  const [weekDaysSelected, setWeekDaysSelected] = useState([])

  //render weeks
  const renderWeeks = (index) => {
    const re = []
    for (const [key, value] of Object.entries(weekDays)) {
      re.push(
        <>
          <Button.Ripple
            active={weekDaysSelected?.includes(value)}
            className='btn-icon rounded-circle active-dark text-small-12 text-nowrap p-0'
            outline
            color={errors?.hasOwnProperty('week_days') ? 'danger' : 'primary'}
            onClick={(e) => {
              toggleArray(value, weekDaysSelected, setWeekDaysSelected)
            }}
            style={{ width: 40, height: 40, marginRight: 5 }}
          >
            {FM(key)}
          </Button.Ripple>
        </>
      )
    }
    return <ButtonGroup className='mb-1'>{re}</ButtonGroup>
  }

  //patient
  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setPatient)
  }

  // Templates
  const loadTemplates = async (search, loadedOptions, { page }) => {
    const res = await loadIpTemplates({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.implementation }
    })
    return createAsyncSelectOptions(res, page, 'template_title', 'ip_id', setTemplates)
  }

  //Category
  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.implementation }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setCategory)
  }

  //subategory
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
  const tempFields = {}
  const modifyField = (key, value) => {
    return value
  }

  const handleSteps = (name, value) => {
    setTotalSteps({
      ...totalSteps,
      [name]: value
    })
  }

  const checkIfNull = () => {
    Object.values(totalSteps).every((value) => {
      if (value === null || value === undefined || value === '') {
        handleStepBg(0, 'bg-danger')
        return true
      }
      if (value !== null || value !== undefined || value !== '') {
        handleStepBg(0, 'bg-success')
        return true
      } else {
        handleStepBg(0, 'bg-warning')
        return false
      }
    })
  }

  useEffect(() => {
    handleSteps('user_id', watch('user_id'))
  }, [watch('user_id')])

  useEffect(() => {
    remove()
  }, [watch('category_id')])

  useEffect(() => {}, [watch('subcategory_id')])

  const updateEachField = (name, reset = false) => {
    const re = []
    fields?.forEach((filed, i) => {
      re.push({
        ...filed,
        [name]: reset ? null : watch(name)
      })
    })
    setValue('plans', re)
  }
  const resetPlans = () => {
    setTemplate(null)
    fastLoop(fields, (d, index) => {
      setValue(`plans.${index}.title`, null)
      setValue(`plans.${index}.goal`, null)

      setValue(`plans.${index}.limitations`, null)
      setValue(`plans.${index}.limitation_details`, null)

      setValue(`plans.${index}.how_support_should_be_given`, null)
      setValue(`plans.${index}.who_give_support`, null)

      setValue(`plans.${index}.sub_goal`, null)
      setValue(`plans.${index}.sub_goal_selected`, null)
      setValue(`plans.${index}.sub_goal_details`, null)

      setValue(`plans.${index}.start_date`, null)
      setValue(`plans.${index}.end_date`, null)
      setValue(`plans.${index}.date_comment`, null)
    })
  }

  /// watch changes from other steps
  useEffect(() => {
    updateEachField('overall_goal')
  }, [watch('overall_goal')])

  useEffect(() => {
    updateEachField('overall_goal_details')
  }, [watch('overall_goal_details')])

  useEffect(() => {
    updateEachField('date_comment')
  }, [watch('date_comment')])

  useEffect(() => {
    updateEachField('persons')
  }, [watch('persons')])

  useEffect(() => {
    updateEachField('user_id')
  }, [watch('user_id')])

  useEffect(() => {
    updateEachField('body_functions')
  }, [watch('body_functions')])

  useEffect(() => {
    updateEachField('personal_factors')
  }, [watch('personal_factors')])

  useEffect(() => {
    updateEachField('health_conditions')
  }, [watch('health_conditions')])

  useEffect(() => {
    updateEachField('other_factors')
  }, [watch('other_factors')])

  useEffect(() => {
    updateEachField('treatment')
  }, [watch('treatment')])

  useEffect(() => {
    updateEachField('working_method')
  }, [watch('working_method')])

  useEffect(() => {
    updateEachField('documents')
  }, [watch('documents')])

  // End watching

  useEffect(() => {
    checkIfNull()
  }, [totalSteps])

  const findErrors = (name, index) => {
    let x = false
    if (errors && errors?.plans && errors?.plans[index]) {
      const a = errors?.plans[index]
      x = a?.hasOwnProperty(name)
    }
    return x
  }
  const loadDetails = (id, index) => {
    if (id) {
      viewPatientPlan({
        id,
        loading: setLoadingTemplate,
        success: (e) => {
          const values = jsonDecodeAll(ipFields, e)
          setTemplate({
            [index]: values
          })
          setValues(IpTemplatesFiled, values, setValue)

          setValue(`plans.${index}.title`, values?.title)
          setValue(`plans.${index}.goal`, values?.goal)

          setValue(`plans.${index}.limitations`, values?.limitations)
          setValue(`plans.${index}.limitation_details`, values?.limitation_details)

          setValue(
            `plans.${index}.how_support_should_be_given`,
            values?.how_support_should_be_given
          )
          setValue(`plans.${index}.who_give_support`, values?.who_give_support)

          setValue(`plans.${index}.sub_goal`, values?.sub_goal)
          setValue(`plans.${index}.sub_goal_selected`, values?.sub_goal_selected)
          setValue(`plans.${index}.sub_goal_details`, values?.sub_goal_details)

          setValue(`plans.${index}.start_date`, values?.start_date)
          setValue(`plans.${index}.end_date`, values?.end_date)
          setValue(`plans.${index}.date_comment`, values?.date_comment)
        }
      })
    }
  }
  const setInitialData = (d, update = false) => {
    let a = {
      // Step 1
      user_id: watch('user_id') ?? '',
      persons: watch('persons') ?? [],
      // personCount: isValidArray(watch('persons')) ? watch('persons')?.length : 0,

      // Step 2
      category_id: watch('category_id') ?? '',
      subcategory_id: d ?? '',
      title: '',
      save_as_template: false,

      goal: '',
      limitations: '',
      limitation_details: '',
      branch_id: null,

      how_support_should_be_given: '',
      week_days: [],
      how_many_time: '',
      // when_during_the_day: "",
      who_give_support: [],

      sub_goal: '',
      sub_goal_selected: '',
      sub_goal_details: '',

      start_date: '',
      end_date: '',
      date_comment: '',

      // Step 3
      overall_goal: watch('overall_goal') ?? '',
      overall_goal_details: watch('overall_goal_details') ?? '',

      // step 4
      body_functions: watch('body_functions') ?? '',
      personal_factors: watch('personal_factors') ?? '',
      health_conditions: watch('health_conditions') ?? '',
      other_factors: watch('other_factors'),

      // Step 5
      treatment: watch('treatment'),
      working_method: watch('working_method'),

      //step 6
      documents: [],

      //steps
      step_five: 0,
      step_four: 0,
      step_one: 0,
      step_seven: 0,
      step_six: 0,
      step_three: 0,
      step_two: 0
    }
    if (edit !== null) {
      const e = edit
      a = {
        ...a,
        ...e,
        category_id: update ? watch('category_id') : e?.category_id,
        subcategory_id: update ? watch('subcategory_id') : e?.subcategory_id
      }
    }
    log('48498498', a, edit)
    append(a)
  }
  useEffect(() => {
    if (watch('subcategory_id')?.length > 0) {
      remove()
      watch('subcategory_id')?.map((d, i) => {
        setInitialData(d)
      })
    } else {
      if (edit !== null) {
        const c = edit?.subcategory_id
        remove()
        setInitialData(c, true)
      } else {
        remove(0)
      }
    }
  }, [watch('subcategory_id')])

  const fromTemplate = (name, index) => {
    return template?.hasOwnProperty(index) ? template[index][name] : ''
  }

  return (
    <div className='p-2 w-100'>
      {loadingDetails ? (
        <Row>
          <Col md='12' className='d-flex align-items-stretch'>
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
        </Row>
      ) : (
        <>
          {/* {createFor !== null ? <div className="alert alert-success p-1">
                        {FM("creating-plan-for", { name: createFor?.label ?? '' })}
                    </div> : null} */}
          <div className='content-header mb-1'>
            <h5 className='mb-0'>{FM('select-category-and-subcategory')}</h5>
            <small className='text-muted'>{FM('select-category-and-subcategory-details')}</small>
          </div>
          <Form onSubmit={onSubmit}>
            <Row>
              <Col md='6'>
                <FormGroupCustom
                  type={'select'}
                  isDisabled={
                    userType !== UserTypes?.company || userType !== UserTypes?.branch
                      ? isValid(edit?.category_id)
                      : false
                  }
                  async
                  defaultOptions
                  loadOptions={loadCategoryData}
                  control={control}
                  value={edit?.category_id}
                  options={category}
                  errors={errors}
                  rules={{ required: true }}
                  name='category_id'
                  className='mb-1'
                  label={FM('category')}
                />
              </Col>
              <Col md='6'>
                <FormGroupCustom
                  type={'select'}
                  isDisabled={
                    userType !== UserTypes?.company || userType !== UserTypes?.branch
                      ? isValid(edit?.subcategory_id)
                      : false
                  }
                  key={watch('category_id')}
                  isMulti={edit === null}
                  async
                  defaultOptions
                  loadOptions={loadCatOptions}
                  control={control}
                  value={edit?.subcategory_id}
                  options={subCategory}
                  errors={errors}
                  rules={{ required: true }}
                  name='subcategory_id'
                  className='mb-1'
                  label={FM('sub-category')}
                />
              </Col>
              {/* {
                                isValid(edit?.id) && userType !== UserTypes.company ? <>
                                    <Col md="12">
                                        <FormGroupCustom
                                            key={`request_for_subcategory_edit`}
                                            label={FM("request-subcategory-edit")}
                                            name={`request_for_subcategory_edit`}
                                            type={"checkbox"}
                                            // defaultChecked={edit?.save_as_template}
                                            //value={edit?.save_as_template}
                                            className="mb-2"
                                            errors={errors}
                                            control={control}
                                            rules={{ required: false }}
                                            values={edit} />
                                    </Col>
                                    {watch("request_for_subcategory_edit") ? <Col md="12">
                                        <FormGroupCustom

                                            key={`request-edit`}
                                            label={FM("request-edit")}
                                            name={`edit-request`}
                                            // value={edit?.title}
                                            type={"textarea"}
                                            //  error={findErrors('title', i)}
                                            className="mb-2"
                                            control={control}
                                            rules={{ required: false }}
                                        />
                                    </Col> : null}
                                </> : null
                            } */}
            </Row>

            <Row>
              {fields.map((field, i) => (
                <>
                  <SlideDown key={field?.id} className='mb-2'>
                    <div className='border p-1'>
                      <Row className=''>
                        <Col md='12' className='border-bottom pb-1 mb-1'>
                          <h4 className='mb-0 ms-1'>
                            <span className='text-primary fw-bold text-uppercase'>
                              {watch('subcategory_id')
                                ? subCategory?.find(
                                    (a) => a.value === parseInt(field?.subcategory_id)
                                  )?.label
                                : 'test'}
                            </span>{' '}
                            : {FM('ip-for')}
                          </h4>
                        </Col>

                        <Col md='12' xs='12'>
                          <Card className='mb-1'>
                            <CardHeader className='border-bottom'>
                              <div className='content-header p-0 mb-0'>
                                <h5 className='mb-0'>{FM('enter-title')}</h5>
                                <small className='text-muted'>
                                  {FM('select-template-or-write-title')}
                                </small>
                              </div>
                            </CardHeader>
                            <CardBody className='pt-1'>
                              <Row>
                                <Hide IF={isValid(edit?.id)}>
                                  <Col md='12'>
                                    <FormGroupCustom
                                      type={'select'}
                                      async
                                      isClearable
                                      defaultOptions
                                      loadOptions={loadTemplates}
                                      control={control}
                                      options={templates}
                                      errors={errors}
                                      onChangeValue={(e) => {
                                        loadDetails(e, i)
                                        if (!isValid(e)) {
                                          resetPlans()
                                        }
                                      }}
                                      rules={{ required: false }}
                                      name='templates'
                                      className='mb-2'
                                      label={FM('select-template')}
                                    />
                                  </Col>
                                </Hide>
                                <Col md='12'>
                                  <FormGroupCustom
                                    key={`title-${edit?.title}-${fromTemplate('title', i)}`}
                                    label={FM('title')}
                                    name={`plans.${i}.title`}
                                    value={edit?.title ?? fromTemplate('title', i)}
                                    type={'text'}
                                    error={findErrors('title', i)}
                                    className='mb-2'
                                    control={control}
                                    rules={{ required: true }}
                                  />
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>

                          <Card className='mb-1'>
                            <CardHeader className='border-bottom'>
                              <div className='content-header p-0 mb-0'>
                                <h5 className='mb-0'>{FM('goals')}</h5>
                                <small className='text-muted'>{FM('write-goal-or-choose')}</small>
                              </div>
                            </CardHeader>
                            <CardBody className='pt-1'>
                              <Label className='mb-2'>{FM('limitations')}</Label>
                              <Row
                                className=''
                                key={`limitations-${fromTemplate('limitations', i)}`}
                              >
                                {createConstSelectOptions(goalTypes, FM)?.map((d, x) => {
                                  return (
                                    <Col md='4'>
                                      <FormGroupCustom
                                        type={'radio'}
                                        control={control}
                                        errors={errors}
                                        defaultChecked={
                                          watch(`plans.${i}.limitations`) === d?.value ||
                                          fromTemplate('limitations', i) === d?.value
                                        }
                                        setValue={setValue}
                                        rules={{ required: false }}
                                        value={d?.value}
                                        name={`plans.${i}.limitations`}
                                        className='mb-2'
                                        label={d?.label}
                                      />
                                    </Col>
                                  )
                                })}
                                <Col
                                  md='12'
                                  className={classNames({
                                    'd-none': !isValid(watch(`plans.${i}.limitations`))
                                  })}
                                >
                                  <FormGroupCustom
                                    style={{ minHeight: 100 }}
                                    label={`${FM(watch(`plans.${i}.limitations`))}: ${FM(
                                      'more-about-limitation'
                                    )}`}
                                    name={`plans.${i}.limitation_details`}
                                    value={
                                      edit?.limitation_details ??
                                      fromTemplate('limitation_details', i)
                                    }
                                    key={`title-${edit?.limitation_details}-${fromTemplate(
                                      'limitation_details',
                                      i
                                    )}`}
                                    type={'autocomplete'}
                                    error={findErrors('limitation_details', i)}
                                    className={'mb-2'}
                                    control={control}
                                    rules={{ required: false }}
                                  />
                                </Col>
                                <Col md='12'>
                                  <FormGroupCustom
                                    type={'autocomplete'}
                                    control={control}
                                    errors={errors}
                                    rules={{ required: false }}
                                    error={findErrors('goal', i)}
                                    value={edit?.goal ?? fromTemplate('goal', i)}
                                    name={`plans.${i}.goal`}
                                    className='mb-2'
                                    label={FM('write-patient-goal')}
                                  />
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                          <Card className='mb-1'>
                            <CardHeader className='border-bottom'>
                              <div className='content-header mb-0 pb-0'>
                                <h5 className='mb-0'>{FM('when-the-support-is-to-be-given')}</h5>
                                <small className='text-muted'>
                                  {FM('specify-when-the-support-is-to-be-given')}
                                </small>
                              </div>
                            </CardHeader>
                            <CardBody className='pt-1'>
                              <Row>
                                {/* <Col md="6" key={`${weekDaysSelected?.length}-days`} className="mb-1">
                                                                    <Label className='d-block mb-1'>{FM("select-days")}</Label>
                                                                    {renderWeeks(i)}
                                                                    <FormGroupCustom
                                                                        noGroup
                                                                        noLabel
                                                                        type={"hidden"}
                                                                        control={control}
                                                                        error={findErrors('week_days', i)}
                                                                        value={edit?.week_days}
                                                                        name={`plans.${i}.week_days`}
                                                                        className="d-none"
                                                                        rules={{ required: false }}
                                                                    />
                                                                </Col> */}
                                <Col md='12'>
                                  <Row>
                                    <Col md='6'>
                                      <FormGroupCustom
                                        key={`title-${edit?.start_date}`}
                                        label={FM('start-date')}
                                        name={`plans.${i}.start_date`}
                                        type={'date'}
                                        options={{
                                          enableTime: false
                                          // enable: [function (date) { return enableFutureDates(date) }, edit?.start_date, new Date()]
                                        }}
                                        setValue={setValue}
                                        value={watch(`plans.${i}.start_date`)}
                                        dateFormat='YYYY-MM-DD'
                                        error={findErrors('start_date', i)}
                                        className='mb-2'
                                        control={control}
                                        rules={{
                                          required: true
                                        }}
                                      />
                                    </Col>
                                    <Col md='6'>
                                      <FormGroupCustom
                                        key={`title-${edit?.end_date}`}
                                        label={FM('end-date')}
                                        // options={{
                                        //     enableTime: false

                                        // }}
                                        options={{
                                          // enable: [function (date) { return enableFutureDates(date) }, edit?.end_date, new Date()],
                                          minDate: watch(`plans.${i}.start_date`) ?? null
                                        }}
                                        setValue={setValue}
                                        name={`plans.${i}.end_date`}
                                        value={watch(`plans.${i}.end_date`)}
                                        type={'date'}
                                        dateFormat='YYYY-MM-DD'
                                        error={findErrors('end_date', i)}
                                        className='mb-2'
                                        control={control}
                                        rules={{ required: true }}
                                      />
                                    </Col>
                                    {/* adding comment box */}
                                    <Col md='12'>
                                      <FormGroupCustom
                                        key={`title-${edit?.date_comment}`}
                                        type={'autocomplete'}
                                        control={control}
                                        errors={errors}
                                        rules={{ required: false }}
                                        error={findErrors('date_comment', i)}
                                        value={edit?.date_comment}
                                        name={`plans.${i}.date_comment`}
                                        className='mb-2'
                                        label={FM('date-comment')}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                {/* <Col md="6">
                                                                    <FormGroupCustom
                                                                        key={`title-${edit?.how_many_time}`}
                                                                        label={FM("how-many-times-a-day")}
                                                                        name={`plans.${i}.how_many_time`}
                                                                        value={edit?.how_many_time}
                                                                        type={"text"}
                                                                        error={findErrors('how_many_time', i)}
                                                                        className="mb-2"
                                                                        control={control}
                                                                        rules={{ required: false }}
                                                                    />
                                                                </Col>
                                                                <Col md="6">
                                                                    <FormGroupCustom
                                                                        key={`title-${edit?.when_during_the_day}`}
                                                                        label={FM("when-during-the-day-the-support-is-to-be-given")}
                                                                        name={`plans.${i}.when_during_the_day`}
                                                                        value={edit?.when_during_the_day}
                                                                        type={"text"}
                                                                        error={findErrors('when_during_the_day', i)}
                                                                        className="mb-2"
                                                                        control={control}
                                                                        rules={{ required: false }}
                                                                    />
                                                                </Col> */}
                                <Col md='12'>
                                  <FormGroupCustom
                                    type={'select'}
                                    isMulti
                                    control={control}
                                    options={createConstSelectOptions(whoGiveSupport, FM)}
                                    rules={{ required: false }}
                                    error={findErrors('who_give_support', i)}
                                    value={
                                      edit?.who_give_support ?? fromTemplate('who_give_support', i)
                                    }
                                    name={`plans.${i}.who_give_support`}
                                    className='mb-2'
                                    label={FM('who-should-give-the-support')}
                                  />
                                </Col>
                                <Col md='12'>
                                  <FormGroupCustom
                                    style={{ minHeight: 100 }}
                                    key={`title-${edit?.how_support_should_be_given}`}
                                    label={FM('how-support-should-be-given')}
                                    name={`plans.${i}.how_support_should_be_given`}
                                    value={
                                      edit?.how_support_should_be_given ??
                                      fromTemplate('how_support_should_be_given', i)
                                    }
                                    type={'autocomplete'}
                                    error={findErrors('how_support_should_be_given', i)}
                                    className='mb-2'
                                    control={control}
                                    rules={{ required: false }}
                                  />
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                          <Card className='mb-1'>
                            <CardHeader className='border-bottom'>
                              <div className='content-header mb-0 pb-0'>
                                <h5 className='mb-0'>{FM('sub-goal')}</h5>
                                <small className='text-muted'>{FM('write-goal-or-choose')}</small>
                              </div>
                            </CardHeader>
                            <CardBody className='pt-1'>
                              <Row key={`gs-${fromTemplate('sub_goal_selected', i)}`}>
                                {createConstSelectOptions(subGoalTypes, FM)?.map((d, x) => {
                                  return (
                                    <Col md='4'>
                                      <FormGroupCustom
                                        type={'radio'}
                                        control={control}
                                        errors={errors}
                                        defaultChecked={
                                          watch(`plans.${i}.sub_goal_selected`) === d?.value ||
                                          fromTemplate('sub_goal_selected', i) === d?.value
                                        }
                                        setValue={setValue}
                                        rules={{ required: false }}
                                        value={d?.value}
                                        name={`plans.${i}.sub_goal_selected`}
                                        className='mb-2'
                                        label={d?.label}
                                      />
                                    </Col>
                                  )
                                })}

                                <Col
                                  md='12'
                                  className={classNames({
                                    'd-none': !isValid(watch(`plans.${i}.sub_goal_selected`))
                                  })}
                                >
                                  <FormGroupCustom
                                    style={{ minHeight: 100 }}
                                    key={`title-${edit?.sub_goal_details}`}
                                    label={`${FM(watch(`plans.${i}.sub_goal_selected`))}: ${FM(
                                      'more-about-sub-goal'
                                    )} `}
                                    name={`plans.${i}.sub_goal_details`}
                                    value={
                                      edit?.sub_goal_details ?? fromTemplate('sub_goal_details', i)
                                    }
                                    type={'autocomplete'}
                                    className='mb-2'
                                    control={control}
                                    rules={{ required: false }}
                                  />
                                </Col>
                                <Col md='12'>
                                  <FormGroupCustom
                                    type={'autocomplete'}
                                    control={control}
                                    errors={errors}
                                    rules={{ required: false }}
                                    value={edit?.sub_goal ?? fromTemplate('sub_goal', i)}
                                    name={`plans.${i}.sub_goal`}
                                    className='mb-2'
                                    label={FM('write-patient-sub-goal')}
                                  />
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md='12' xs='12'>
                          <Card className='mb-1'>
                            <CardBody className=''>
                              <Row>
                                <Show IF={edit !== null}>
                                  <Col md='12'>
                                    <FormGroupCustom
                                      label={'reason-for-editing'}
                                      name={`plans.${i}.reason_for_editing`}
                                      type={'autocomplete'}
                                      value={edit?.reason_for_editing}
                                      className='mb-2'
                                      errors={errors}
                                      control={control}
                                      rules={{ required: true }}
                                    />
                                  </Col>
                                </Show>
                                <Col md='4'>
                                  <FormGroupCustom
                                    key={`save-as-template-${edit?.save_as_template}`}
                                    label={FM('save-as-template')}
                                    name={`plans.${i}.save_as_template`}
                                    type={'checkbox'}
                                    defaultChecked={edit?.save_as_template}
                                    value={edit?.save_as_template}
                                    className=''
                                    errors={errors}
                                    control={control}
                                    values={edit}
                                  />
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </SlideDown>
                </>
              ))}
            </Row>
          </Form>
        </>
      )}
    </div>
  )
}

export default Step2
