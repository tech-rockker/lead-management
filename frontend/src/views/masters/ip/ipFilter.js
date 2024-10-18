import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import { addFollowUp, editFollowUp, loadFollowUp } from '../../../utility/apis/followup'
import { FM, isValid, log } from '../../../utility/helpers/common'
import {
  createAsyncSelectOptions,
  createSelectOptions,
  isObjEmpty,
  SuccessToast,
  formatTime,
  formatDateTimeByFormat,
  ipStatus,
  ipWithActivity,
  ipWithFollowup,
  decryptObject
} from '../../../utility/Utils'
import ColorPicker from '../../components/colorPicker/indx'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

import { loadPatientPlanList } from '../../../utility/apis/ip'

import { getPath } from '../../../router/RouteHelper'
import { categoriesLoad, categoryChildList } from '../../../utility/apis/categories'
import { loadCategoriesTypes } from '../../../utility/apis/categoriesTypes'
import { loadUser } from '../../../utility/apis/userManagement'
//import { categoryChildList } from '../../../utility/apis/commons'
import Show from '../../../utility/Show'
import useModules from '../../../utility/hooks/useModules'
import { forDecryption, UserTypes } from '../../../utility/Const'
import useUserType from '../../../utility/hooks/useUserType'
import Hide from '../../../utility/Hide'

const IPFilter = ({ show, handleFilterModal, setFilterData, filterData, users }) => {
  // Dispatch
  const dispatch = useDispatch()
  // Form Validation
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    control,
    getValues,
    watch,
    reset
  } = useForm()
  const history = useHistory()
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()

  // States
  const [open, setOpen] = useState(show)
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(false)
  const [ip, setIp] = useState([])
  const [user, setUser] = useState([])
  const [types, setTypes] = useState([])
  const [branch, setBranch] = useState([])
  const [emp, setEmp] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [patient, setPatient] = useState([])

  const usertype = useUserType()

  const submitFilter = (d) => {
    setFilterData({
      ...d,
      fromFilter: d?.status >= 0
    })
    //  log(d)
  }

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  const loadIpOption = async (search, loadedOptions, { page }) => {
    const res = await loadPatientPlanList({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setIp)
  }

  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCategoriesTypes({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setTypes)
  }

  // const loadCategoryData = async (search, loadedOptions, { page }) => {
  //     if (isValid(getValues("category_type_id"))) {
  //         const res = await categoriesLoad({
  //             async: true,
  //             page,
  //             perPage: 100,
  //             jsonData: { name: search, category_id: getValues("category_id") }
  //         })
  //         return createAsyncSelectOptions(res, page, "name", "id", setCategory)
  //     } else {
  //         return {
  //             options: [],
  //             hasMore: false
  //         }
  //     }
  // }
  // // sub  Category Options
  // const loadCatOptions = async (search, loadedOptions, { page }) => {
  //     if (isValid(getValues("category_id"))) {
  //         const res = await categoryChildList({
  //             async: true,
  //             page,
  //             perPage: 100,
  //             jsonData: { name: search, parent_id: getValues("category_id"), category_type_id: getValues("category_type_id") }
  //         })
  //         return createAsyncSelectOptions(res, page, "name", "id", setSubCategory)
  //     } else {
  //         return {
  //             options: [],
  //             hasMore: false
  //         }
  //     }
  // }
  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setCategory)
  }

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
  const loadUserTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { user_type_id: 6 }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  const loadBranchOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { user_type_id: 11 }
    })
    return createAsyncSelectOptions(res, page, 'branch_name', 'id', setBranch, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  const loadEmpOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { user_type_id: 3 }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setEmp, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={FM('ip-filter')}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          placeholder={FM('title')}
          type='text'
          name='title'
          label={FM('title')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <Show IF={!isValid(users)}>
          <FormGroupCustom
            label={'patient'}
            type={'select'}
            async
            isClearable
            // // defaultOptions
            control={control}
            options={patient}
            loadOptions={loadUserTypeOptions}
            name={'patient_id'}
            className='mb-1'
          />
        </Show>
        <FormGroupCustom
          type={'select'}
          control={control}
          errors={errors}
          name={'branch'}
          // // defaultOptions
          cacheOptions
          isClearable
          async
          loadOptions={loadBranchOption}
          options={types}
          label={FM('branch')}
          rules={{ required: false }}
          noLabel={branch.length === 0}
          className={classNames('mb-1', {
            'd-block': branch.length > 0,
            'd-none': branch.length === 0
          })}
        />

        {/* <FormGroupCustom
                    type={"select"}
                    control={control}
                    errors={errors}
                    name={"category_type_id"}
                    // defaultOptions
                    cacheOptions
                    isClearable
                    async
                    loadOptions={loadTypeOptions}
                    options={types}
                    label={FM("category-type")}
                    rules={{ required: false }}
                    className='mb-1'
                />

                <Col md="12">
                    <FormGroupCustom
                        type={"select"}
                        key={watch("category_type_id")}
                        isClearable
                        async
                        // defaultOptions
                        loadOptions={loadCategoryData}
                        control={control}
                        options={category}
                        errors={errors}
                        rules={{ required: false }}
                        name="category_id"
                        className='mb-1'
                        label={FM("category")}
                        // isDisabled={!watch("category_type_id")}
                    />
                </Col>

                <FormGroupCustom
                    type={"select"}
                    key={watch("category_id")}
                    isClearable
                    async
                    // defaultOptions
                    loadOptions={loadCatOptions}
                    control={control}
                    options={subCategory}
                    errors={errors}
                    rules={{ required: false }}
                    name="subcategory_id"
                    className='mb-1'
                    label={FM("sub-category")}
                    isDisabled={!watch("category_id")}
                /> */}
        <Hide IF={usertype === UserTypes.patient}>
          <FormGroupCustom
            type={'select'}
            isClearable
            async
            // defaultOptions
            loadOptions={loadCategoryData}
            control={control}
            options={category}
            errors={errors}
            rules={{ required: false }}
            name='category_id'
            className='mb-1'
            label={FM('category')}
          />

          <FormGroupCustom
            type={'select'}
            key={watch('category_id')}
            async
            // defaultOptions
            loadOptions={loadCatOptions}
            control={control}
            options={subCategory}
            errors={errors}
            rules={{ required: false }}
            name='subcategory_id'
            className='mb-1'
            label={FM('sub-category')}
          />
        </Hide>
        {/* 
                <FormGroupCustom
                    label={"activity"}
                    type={"select"}
                    isClearable
                    // defaultOptions
                    control={control}
                    options={ipWithActivity()}
                    name={"with_activity"}
                    className="mb-1"
                    rules={{ required: false }}
                />
                <FormGroupCustom
                    label={"followup"}
                    type={"select"}
                    isClearable
                    // defaultOptions
                    control={control}
                    options={ipWithFollowup()}
                    name={"with_followup"}
                    className="mb-1"
                    rules={{ required: false }}
                /> */}

        <FormGroupCustom
          label={FM('status')}
          type={'select'}
          isClearable
          // defaultOptions
          // forceValue
          value={filterData?.status}
          control={control}
          options={ipStatus()}
          name={'status'}
          className='mb-1'
          rules={{ required: false }}
        />

        <FormGroupCustom
          name={'start_date'}
          type={'date'}
          errors={errors}
          label={FM('start-date')}
          dateFormat={'YYYY-MM-DD'}
          setValue={setValue}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          name={'end_date'}
          type={'date'}
          errors={errors}
          options={{
            minDate: new Date(watch('start_date'))
          }}
          label={FM('end-date')}
          dateFormat={'YYYY-MM-DD'}
          setValue={setValue}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <Show IF={ViewActivity}>
          <Row>
            <Col md='12' className='mb-3px'>
              <Label>{FM('ip-with')}</Label>
            </Col>
            <Col md='6'>
              <FormGroupCustom
                label={'followups'}
                name={'with_followup'}
                type={'checkbox'}
                errors={errors}
                control={control}
                className='mb-1'
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                label={'activity'}
                name={'with_activity'}
                type={'checkbox'}
                errors={errors}
                control={control}
                className='mb-1'
              />
            </Col>
          </Row>
        </Show>

        {/* <FormGroupCustom
                    type="checkbox"
                    name="status"
                    value={1}
                    label={FM("ip-status")}
                    className='mb-1'
                    errors={errors}
                    control={control}
                /> */}
      </Form>
    </SideModal>
  )
}

export default IPFilter
