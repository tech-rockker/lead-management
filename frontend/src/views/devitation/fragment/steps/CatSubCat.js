import React, { useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import { Button, Card, Col, Form, InputGroupText, Row } from 'reactstrap'
import { categoriesLoad, categoryChildList } from '../../../../utility/apis/categories'
//import { categoryChildList } from '../../../../utility/apis/commons'
import { loadUser } from '../../../../utility/apis/userManagement'
import { CategoryType, forDecryption, UserTypes } from '../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import { Permissions } from '../../../../utility/Permissions'
import Show, { Can } from '../../../../utility/Show'
import {
  createAsyncSelectOptions,
  createSelectOptions,
  decryptObject,
  formatDate,
  SpaceTrim
} from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'
import Shimmer from '../../../components/shimmers/Shimmer'
import BsTooltip from '../../../components/tooltip'
import UserModal from '../../../userManagement/fragment/UserModal'

const CatSubCat = ({
  clearError = () => {},
  dUser = false,
  open = false,
  setDisplay = () => {},
  user = null,
  currentIndex = null,
  loadingDetails = false,
  ipRes = null,
  resLabel = null,
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
  //subCategory
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
  const [empLoad, setEmpLoad] = useState(false)
  //branch
  const [branch, setBranch] = useState([])
  const [branchLoading, setBranchLoading] = useState(false)

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedIp, setSelectedIp] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCat, setSelectedSubCat] = useState(null)

  const [catImg, setCatImg] = useState(null)
  const [subCatImg, setSubCatImg] = useState(null)

  // category options
  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.deviation }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setCategory)
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
      return createAsyncSelectOptions(res, page, 'name', null, setSubCategory)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }
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
  }

  const handleNewSubCategory = (e) => {
    // loadCatOptions()
    setSelectedSubCat({
      label: e?.name,
      value: e?.id
    })
    setValue('subcategory_id', e?.id)
  }
  const getIpCategory = () => {
    const ipId = watch('ip_id')
    log('ipId', ipId)
    if (isValid(ipId)) {
      log('valid')
      const ipDetails = ip?.find((a) => a?.value?.id === ipId)
      log(ipDetails)

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
  const handleNewIp = (e, f = false) => {
    log('eeeee, e', e)
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
  const handleNewPatient = (e) => {
    log('eeeee, e', e)
    loadPatientOption()
    setSelectedPatient({
      label: e?.name,
      value: e?.id
    })
    setValue('patient_id', e?.id)
  }

  useEffect(() => {
    getIpCategory()
  }, [ip])

  useEffect(() => {
    if (isValidArray(ipRes)) {
      setIp(createSelectOptions(ipRes, 'title', null))
    }
  }, [ipRes])

  useEffect(() => {
    if (open) {
      if (isValid(ipRes) && isValidArray(ipRes)) {
        handleNewIp(ipRes[0])
        handleNewPatient(ipRes[0]?.patient)
        handleNewCategory(ipRes[0]?.category)
        handleNewSubCategory(ipRes[0].subcategory)
      }
    }
  }, [ipRes, open])

  //emp options
  const loadEmpOptions = async (search, loadedOptions, { page = 1 }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.employee }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setEmp, (x) => {
      return decryptObject(forDecryption, x)
    })
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

  useEffect(() => {
    setValue('remind_before_start', watch('is_compulsory'))
    setValue('in_time', watch('is_compulsory'))
  }, [watch('is_compulsory')])

  useEffect(() => {
    getIpCategory()
  }, [watch('ip_id')])

  useEffect(() => {
    if (edit !== null) {
      setValue('ip_id', edit?.ip_id)
      setValue('patient_id', edit?.patient_id)
      setValue('date_time', edit?.date_time)
    }
  }, [edit])

  useEffect(() => {
    getIpCategory()
  }, [ip])

  useEffect(() => {
    if (isValidArray(ipRes)) {
      setIp(createSelectOptions(ipRes, 'title', null))
    }
  }, [ipRes])

  useEffect(() => {
    if (open) {
      if (isValid(ipRes) && isValidArray(ipRes)) {
        handleNewIp(ipRes[0])
        handleNewPatient(ipRes[0]?.patient)
      }
    }
  }, [ipRes, open])

  useEffect(() => {
    getIpCategory()
  }, [watch('ip_id')])

  useEffect(() => {
    if (edit !== null) {
      const name = subCategory?.find((a) => a?.value?.id === edit?.subcategory_id)?.value?.name
      if (isValid(name)) {
        // setValue("subcategory_id", edit?.subcategory_id)
        clearError('subcategory_id')
        handleNewSubCategory({
          id: edit?.subcategory_id,
          name: subCategory?.find((a) => a?.value?.id === edit?.subcategory_id)?.value?.name
        })
      }
      setValue('ip_id', edit?.ip_id)
      setValue('patient_id', edit?.patient_id)
      setCatImg(category?.find((a) => a?.value?.id === edit?.category_id)?.value?.follow_up_image)
      setSubCatImg(
        subCategory?.find((a) => a?.value?.id === edit?.subcategory_id)?.value?.follow_up_image
      )
    }
  }, [edit, category, subCategory])

  useEffect(() => {
    setValue('cat_image', catImg)
    setValue('subcat_image', subCatImg)
  }, [catImg, subCatImg])

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
              <Card className='p-2 mb-2 shadow rounded'>
                <div className='content-header mb-2'>
                  <h5 className='mb-0'>{FM('patient-date')}</h5>
                  <small className='text-muted'>{FM('enter-details')}</small>
                </div>
                <Row>
                  <Col md='6'>
                    <FormGroupCustom
                      key={`pp-${selectedPatient?.value}`}
                      append={
                        ipRes === null && edit === null ? (
                          <Show IF={Can(Permissions.patientsAdd) && dUser === false}>
                            <BsTooltip title={FM('add-new')} Tag={InputGroupText}>
                              <UserModal
                                Component={Plus}
                                size={20}
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
                            </BsTooltip>
                          </Show>
                        ) : null
                      }
                      type={'select'}
                      control={control}
                      errors={errors}
                      name={'patient_id'}
                      defaultOptions
                      isDisabled={dUser === true}
                      async
                      cacheOptions
                      loadOptions={loadPatientOption}
                      value={selectedPatient?.value ?? edit?.patient_id ?? user}
                      options={patient}
                      label={FM('patient')}
                      rules={{ required: requiredEnabled }}
                      placeholder={edit !== null || ipRes !== null ? FM('loading') : FM('select')}
                      className='mb-1'
                    />
                  </Col>
                  <Col md='6'>
                    <FormGroupCustom
                      name={'date_time'}
                      type={'date'}
                      errors={errors}
                      label={FM('date-time')}
                      options={{
                        enableTime: true,
                        time_24hr: true,
                        maxDate: new Date(`${formatDate(new Date(), 'YYYY-MM-DD')} 23:59:59`)
                      }}
                      dateFormat={'YYYY-MM-DD HH:mm'}
                      setValue={setValue}
                      className='mb-2'
                      control={control}
                      rules={{ required: requiredEnabled ? currentIndex === 0 : false }}
                      values={edit}
                    />
                  </Col>
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
                      key={isValid(edit?.ip_id) ? watch('ip_id') : 'cat'}
                      defaultOptions
                      loadOptions={loadCategoryData}
                      control={control}
                      matchWith='id'
                      value={selectedCategory?.value ?? edit?.category_id}
                      options={category}
                      errors={errors}
                      rules={{ required: true }}
                      name='category_id'
                      className='mb-1'
                      onChangeValue={(e) => {
                        setSelectedSubCat(null)
                        setValue('subcategory_id', null)
                        setCatImg(category?.find((a) => a?.value?.id === e)?.value?.follow_up_image)
                      }}
                      placeholder={edit !== null || ipRes !== null ? FM('loading') : FM('select')}
                      label={FM('category')}
                    />
                  </Col>

                  <FormGroupCustom
                    key={catImg}
                    type={'hidden'}
                    control={control}
                    errors={errors}
                    name={'cat_image'}
                    noGroup
                    noLabel
                    value={catImg}
                  />
                  <FormGroupCustom
                    key={subCatImg}
                    type={'hidden'}
                    control={control}
                    errors={errors}
                    name={'subcat_image'}
                    noGroup
                    noLabel
                    value={subCatImg}
                  />
                  <Col md='6'>
                    <FormGroupCustom
                      type={'select'}
                      key={watch('category_id')}
                      async
                      defaultOptions
                      loadOptions={loadCatOptions}
                      control={control}
                      value={selectedSubCat && selectedSubCat?.value}
                      options={subCategory}
                      errors={errors}
                      matchWith='id'
                      rules={{ required: true }}
                      name='subcategory_id'
                      className='mb-1'
                      label={FM('sub-category')}
                      onChangeValue={(e) => {
                        setSubCatImg(
                          subCategory?.find((a) => a?.value?.id === e)?.value?.follow_up_image
                        )
                      }}
                      placeholder={FM('select')}
                    />
                  </Col>
                </Row>
              </Card>
              <Show IF={isValid(edit)}>
                <Card className='p-2 mb-1 shadow rounded'>
                  <Col md='12' xs='12'>
                    <FormGroupCustom
                      style={{ height: '116px' }}
                      // value={edit?.reason_for_editing}
                      placeholder={FM('reason-for-editing')}
                      type='autocomplete'
                      name='reason_for_editing'
                      label={FM('reason-for-editing')}
                      value={edit?.reason_for_editing}
                      className='mb-1'
                      errors={errors}
                      control={control}
                      rules={{
                        required: requiredEnabled,
                        validate: (v) => {
                          return isValid(v) ? !SpaceTrim(v) : true
                        }
                      }}
                    />
                  </Col>
                </Card>
              </Show>
            </Form>
          </>
        )}
      </div>
    </>
  )
}

export default CatSubCat
