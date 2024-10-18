import React, { Fragment, useEffect, useState } from 'react'
import { ArrowLeft, Edit, Plus } from 'react-feather'
import { Card, CardBody, CardHeader, Col, Form, InputGroupText, Label, Row } from 'reactstrap'
import { categoriesLoad, categoryChildList } from '../../utility/apis/categories'
//import { categoryChildList } from '../../utility/apis/commons'
import { loadPatientPlanList } from '../../utility/apis/ip'
import { loadUser, viewUser } from '../../utility/apis/userManagement'
import {
  CategoryType,
  forDecryption,
  incompletePatientFields,
  UserTypes
} from '../../utility/Const'
import { FM, isValid, log } from '../../utility/helpers/common'
import Hide from '../../utility/Hide'
import { Permissions } from '../../utility/Permissions'
import Show, { Can } from '../../utility/Show'
import {
  createAsyncSelectOptions,
  createSelectOptions,
  decryptObject,
  formatDate,
  getValidTime,
  incompletePatient,
  jsonDecodeAll
} from '../../utility/Utils'
import FormGroupCustom from '../components/formGroupCustom'
import Shimmer from '../components/shimmers/Shimmer'
import BsTooltip from '../components/tooltip'
import IpStepModal from '../masters/ip/fragment/IpStepModal'
import UserModal from '../userManagement/fragment/UserModal'

const CreateJournal = ({
  clearError = () => {},
  dUser = false,
  patientId = null,
  open = false,
  setDisplay = () => {},
  setSaveLoading = () => {},
  setActiveIndex = () => {},
  action = null,
  setAction = () => {},
  createFor = null,
  ips = null,
  useFieldArray = () => {},
  editIpRes = null,
  ipRes = null,
  reLabel = null,
  getValues = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors,
  setError
}) => {
  //category
  const [category, setCategory] = useState([])
  const [categoryLoad, setCategoryLoad] = useState(false)
  const [incompleteField, setIncompleteField] = useState(null)

  //subCategory
  const [loadingUser, setLoadingUser] = useState(false)
  const [user, setUser] = useState(false)
  const [patientSelected, setPatientSelected] = useState(null)
  const [addPatient, setAddPatient] = useState(false)
  const [step, setStep] = useState(0)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedIp, setSelectedIp] = useState(null)
  const [ip, setIp] = useState([])

  const [subCategory, setSubCategory] = useState([])
  const [subLoad, setSubLoad] = useState(false)
  const [journal, setJournal] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCat, setSelectedSubCat] = useState(null)
  const [checked, setCheck] = useState(false)
  const [patient, setPatient] = useState([])
  const [checkEdit, setCheckEdit] = useState(true)

  const checkboxDropForTen = () => {
    setCheck(!checked)
  }
  const checkboxEdit = () => {
    setCheckEdit(!checkEdit)
  }
  const formFields = {}

  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.implementation }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setCategory)
  }

  //patient
  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
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
  const loadDetails = (id) => {
    if (isValid(id)) {
      viewUser({
        id,
        loading: setLoadingUser,
        success: (d) => {
          const s = {
            ...d,
            country_id: d?.country?.id ?? '',
            patient_type_id: typeof d?.patient_type_id === 'object' ? d?.patient_type_id : [],
            ...d?.patient_information,
            id: d?.patient_information?.patient_id
          }
          const values = jsonDecodeAll(formFields, s)
          setUser(values)
          setValue('persons', values?.persons)
          setIncompleteField(incompletePatient(incompletePatientFields, values))
        }
      })
    }
  }
  const handleNewIp = (e, f = false) => {
    log('eeeee, e', e)
    // loadIpOption()
    if (f) {
      setSelectedIp({
        label: e?.payload[0]?.title,
        value: e?.payload[0]?.id
      })
      setValue('ip_id', e?.payload[0]?.id)
    } else {
      setSelectedIp({
        label: e?.title,
        value: e?.id
      })
      setValue('ip_id', e?.id)
    }
  }
  useEffect(() => {
    loadDetails(watch('user_id'))
  }, [watch('user_id')])

  const handleNewPatient = (e) => {
    loadPatientOption()
    setSelectedPatient({
      label: e?.name,
      value: e?.id
    })
    setValue('user_id', e?.id)
    loadDetails(e?.id)
    setAddPatient(false)
  }
  // const handleNewPatient = (e) => {
  //     log("eeettee, e", e)
  //     loadPatientOption()
  //     setSelectedPatient({
  //         label: e?.name,
  //         value: e?.id
  //     })
  //     setValue("patient_id", e?.id)
  // }
  const handleNewCategory = (e) => {
    loadCategoryData()
    setSelectedCategory({
      label: e?.name,
      value: e?.id
    })
    if (isValid(e)) {
      setValue('category_id', e?.id)
    }
    log('category_id', e)
  }

  const handleNewSubCategory = (e) => {
    loadCatOptions()
    setSelectedSubCat({
      label: e?.name,
      value: e?.id
    })
    setValue('subcategory_id', e?.id)
  }
  // useEffect(() => {
  //     if (edit !== null) {
  //         loadIpOption()
  //     }

  // }, [watch('patient_id')])

  useEffect(() => {
    if (edit !== null) {
      // setValue("ip_id", edit?.ip_id)
      setValue('patient_id', edit?.patient_id)
    }
  }, [edit])

  useEffect(() => {
    if (edit !== null) {
      const name = subCategory?.find((a) => a?.value === edit?.subcategory_id)?.label
      if (isValid(name)) {
        // setValue("subcategory_id", edit?.subcategory_id)
        clearError('subcategory_id')
        handleNewSubCategory({
          id: edit?.subcategory_id,
          name: subCategory?.find((a) => a?.value?.id === edit?.subcategory_id)?.value?.name
        })
      }
      // handleNewSubCategory({ id: edit?.subcategory_id, name: subCategory?.find(a => a?.value?.id === edit?.subcategory_id)?.value?.name })
      setValue('ip_id', edit?.ip_id)
      // setValue("patient_id", edit?.patient_id)
    }
  }, [edit, category, subCategory])

  return (
    <Fragment>
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
        <Form onSubmit={onSubmit}>
          <Row>
            <Col md='4'>
              <FormGroupCustom
                key={`pwp-${selectedPatient?.value}`}
                append={
                  edit === null ? (
                    <Show IF={Can(Permissions.patientsAdd) && dUser === false}>
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
                // isDisabled={ipRes !== null || edit !== null}
                cacheOptions
                loadOptions={loadPatientOption}
                // values={selectedPatient?.value ?? edit?.patient_id}
                value={patientId ?? edit?.patient_id}
                options={patient}
                isDisabled={edit?.is_signed === 1 || dUser === true}
                label={FM('patient')}
                rules={{ required: requiredEnabled }}
                placeholder={FM('select')}
                className='mb-1'
              />
            </Col>

            <Col md='4'>
              <FormGroupCustom
                type={'select'}
                async
                key={isValid(edit?.ip_id) ? watch('ip_id') : 'cat'}
                defaultOptions
                loadOptions={loadCategoryData}
                control={control}
                value={selectedCategory?.value ?? edit?.category_id}
                options={category}
                isDisabled={edit?.is_signed === 1}
                errors={errors}
                rules={{ required: true }}
                name='category_id'
                onChangeValue={(e) => {
                  setSelectedSubCat(null)
                  setValue('subcategory_id', null)
                }}
                className='mb-1'
                placeholder={edit !== null || ipRes !== null ? FM('loading') : FM('select')}
                label={FM('category')}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                type={'select'}
                key={watch('category_id')}
                async
                defaultOptions
                loadOptions={loadCatOptions}
                control={control}
                value={selectedSubCat && selectedSubCat?.value}
                options={subCategory}
                isDisabled={edit?.is_signed === 1}
                errors={errors}
                rules={{ required: true }}
                name='subcategory_id'
                className='mb-1'
                label={FM('sub-category')}
                placeholder={FM('select')}
              />
            </Col>
            <Hide IF={edit?.is_signed === 0}>
              <Hide IF={edit === null}>
                <Col md='3'>
                  <Label> {FM('date')} </Label>
                  <p> {formatDate(edit?.date, 'DD MMMM, YYYY')}</p>
                </Col>
                <Col md='3'>
                  <Label> {FM('time')} </Label>
                  <p> {getValidTime(edit?.time, 'h:mm A')}</p>
                </Col>
              </Hide>
            </Hide>
            <Hide IF={edit?.is_signed === 1}>
              <Col md='6' xs='12'>
                <FormGroupCustom
                  type='checkbox'
                  name='dates'
                  label={FM('change-event-date')}
                  className='mb-1'
                  errors={errors}
                  // value={0}
                  control={control}
                  onChangeValue={(e) => {
                    checkboxDropForTen()
                  }}
                />
              </Col>

              {checked ? (
                <>
                  <Row>
                    <Col md='3'>
                      <FormGroupCustom
                        name={'date'}
                        setValue={setValue}
                        type={'date'}
                        errors={errors}
                        // isDisabled={edit?.is_signed === 1}
                        className='mb-2'
                        control={control}
                        options={{
                          maxDate: formatDate(new Date(), 'YYYY-MM-DD')
                        }}
                        //  max={formatDate(new Date(), "YYYY-MM-DD")}
                        // rules={{ required: true, max: formatDate(new Date(), "YYYY-MM-DD") }}
                        rules={{ required: false, max: formatDate(new Date(), 'YYYY-MM-DD') }}
                        values={edit}
                      />
                    </Col>
                    <Col md='3'>
                      <FormGroupCustom
                        // key={`time`}
                        name={'time'}
                        type={'date'}
                        setValue={setValue}
                        label={FM(`time`)}
                        // defaultDate={watch('start_date')}
                        options={{
                          enableTime: true,
                          noCalendar: true,
                          allowInput: false,
                          time_24hr: true
                        }}
                        dateFormat={'HH:mm'}
                        // error={findErrors("start", i)}
                        className='mb-2'
                        // className="mb-2 pe-none"
                        isDisabled={true}
                        control={control}
                        rules={{ required: false }}
                        values={edit}
                      />
                    </Col>
                  </Row>
                </>
              ) : null}
            </Hide>
            {/*                         
                        <Show IF = {edit?.date !== null || edit?.time !== null}>
                        <Col md="6" xs="12">
                            <FormGroupCustom

                                type="checkbox"
                                name="date-time"
                                label={FM("change-event-date")}
                                className='mb-1'
                                errors={errors}
                                value={1}
                                control={control}
                                onChangeValue={e => {
                                    checkboxEdit()
                                }}
                            />
                        </Col>


                        {checkEdit ? <>
                            <Row>
                                <Col md="3">
                                    <FormGroupCustom
                                        name={"date"}
                                        type={"date"}
                                        errors={errors}
                                        // isDisabled={edit?.is_signed === 1}
                                        className="mb-2"
                                        control={control}
                                        //  max={formatDate(new Date(), "YYYY-MM-DD")}
                                        // rules={{ required: true, max: formatDate(new Date(), "YYYY-MM-DD") }}
                                        rules={{ required: false, max: formatDate(new Date(), "YYYY-MM-DD") }}
                                        values={edit} />
                                </Col>
                                <Col md="3" >
                                    <FormGroupCustom
                                        // key={`time`}
                                        name={"time"}
                                        type={"date"}
                                        label={FM(`time`)}
                                        // defaultDate={watch('start_date')}
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            allowInput: false
                                        }}
                                        dateFormat={"hh:mm"}
                                        // error={findErrors("start", i)}
                                        className="mb-2"
                                        // className="mb-2 pe-none"
                                        isDisabled={true}
                                        setValue={setValue}
                                        control={control}
                                        rules={{ required: false }}
                                        values={edit}
                                    />
                                </Col>
                            </Row>
                        </> : null}

                        </Show> */}
          </Row>

          <Row>
            <Col md='6'>
              <FormGroupCustom
                // label={"description"}
                name={'description'}
                type={'autocomplete'}
                errors={errors}
                values={edit === null || edit?.is_signed === 0 ? edit : null}
                className='mb-2'
                control={control}
                rules={{ required: false }}
              />
            </Col>
            <Hide IF={edit === null || edit?.is_signed === 0}>
              <Col md='6'>
                <Label>{FM('description')} </Label>
                <p style={{ textDecoration: 'line-through' }}> {edit?.description} </p>
              </Col>
            </Hide>
          </Row>
          <Row>
            <Col md='6' xs='12'>
              {/* <Label className='mb-1'>{FM("hidden-patient")}</Label> */}
              <FormGroupCustom
                name={'is_secret'}
                label={FM('secret-journal')}
                type={'checkbox'}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                values={edit}
              />
            </Col>
            <Show IF={edit !== null && edit?.is_signed === 1}>
              <Col md='6' xs='12'>
                {/* <Label className='mb-1'>{FM("hidden-patient")}</Label> */}
                <FormGroupCustom
                  name={'is_active'}
                  label={FM('active')}
                  type={'checkbox'}
                  errors={errors}
                  className='mb-2'
                  control={control}
                  rules={{ required: false }}
                  values={edit}
                />
              </Col>
            </Show>
          </Row>

          <Show IF={edit !== null && edit?.is_signed === 0}>
            <Row>
              <Col md='6'>
                <FormGroupCustom
                  label={'reason'}
                  name={'reason_for_editing'}
                  type={'autocomplete'}
                  errors={errors}
                  value={edit?.reason_for_editing}
                  className='mb-2'
                  control={control}
                  rules={{
                    required: requiredEnabled,
                    validate: (e) => {
                      return String(e).trim()?.length !== 0
                    }
                  }}
                />
              </Col>
            </Row>
          </Show>
        </Form>
      )}
    </Fragment>
  )
}

export default CreateJournal
