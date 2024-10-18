import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Form, Row } from 'reactstrap'
import { FM, isValid } from '../../../src/utility/helpers/common'
import {
  createAsyncSelectOptions,
  decryptObject,
  enableFutureDates,
  Status,
  WithActivity
} from '../../../src/utility/Utils'
import { categoriesLoad, categoryChildList } from '../../utility/apis/categories'
//import { categoryChildList } from '../../utility/apis/commons'
import { loadPatientPlanList } from '../../utility/apis/ip'
import { loadUser } from '../../utility/apis/userManagement'
import { CategoryType, forDecryption, UserTypes } from '../../utility/Const'
import Hide from '../../utility/Hide'
import useModules from '../../utility/hooks/useModules'
import useUserType from '../../utility/hooks/useUserType'
import Show from '../../utility/Show'
import FormGroupCustom from '../../views/components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../views/components/sideModal/sideModal'

const DeviationFilter = ({ user = null, show, handleFilterModal, setFilterData, filterData }) => {
  const dispatch = useDispatch()
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(show)
  const [companyData, setCompanyData] = useState(null)
  //activity cls
  const [_class, setClass] = useState([])
  /////ip
  const [ip, setIp] = useState([])
  //category
  const [category, setCategory] = useState([])
  //Branch
  const [branch, setBranch] = useState([])
  //patient
  const [patient, setPatient] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const usertype = useUserType()
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()

  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, category_type_id: CategoryType.deviation }
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

  const loadIpOption = async (search, loadedOptions, { page }) => {
    const res = await loadPatientPlanList({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setIp)
  }

  const loadBranchOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: 11 }
    })
    return createAsyncSelectOptions(res, page, 'branch_name', 'id', setBranch)
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

  const submitFilter = (d) => {
    setFilterData({
      ...filterData,
      ...d,
      is_completed: d?.is_completed === 1 ? 'yes' : null,
      // is_signed: d?.is_signed === 1 ? 'yes' : null,
      is_secret: d?.is_secret === 1 ? 'yes' : null
    })
    console.log(d)
  }

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={'deviation-filter'}
      done='filter'
    >
      <Form>
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
        <FormGroupCustom
          label={'branch'}
          type={'select'}
          async
          isClearable
          // defaultOptions
          control={control}
          options={branch}
          loadOptions={loadBranchOptions}
          name={'branch_id'}
          noLabel={branch.length === 0}
          className={classNames('mb-1 ', {
            'd-block': branch.length > 0,
            'd-none': branch.length === 0
          })}
        />

        <Show IF={!isValid(user)}>
          <FormGroupCustom
            label={'patient'}
            type={'select'}
            async
            isClearable
            // defaultOptions
            control={control}
            options={patient}
            loadOptions={loadPatientOption}
            name={'patient_id'}
            className='mb-2'
          />
        </Show>
        <FormGroupCustom
          name={'from_date'}
          type={'date'}
          errors={errors}
          label={FM('from-date')}
          dateFormat={'YYYY-MM-DD'}
          setValue={setValue}
          className='mb-2'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          name={'end_date'}
          type={'date'}
          errors={errors}
          label={FM('to-date')}
          dateFormat={'YYYY-MM-DD'}
          setValue={setValue}
          className='mb-2'
          options={{
            minDate: new Date(watch('from_date'))
          }}
          control={control}
          rules={{ required: false }}
        />

        <Show IF={ViewActivity}>
          <FormGroupCustom
            label={'with_or_without_activity'}
            type={'select'}
            isClearable
            // defaultOptions
            control={control}
            options={WithActivity()}
            name={'with_or_without_activity'}
            className='mb-2'
            rules={{ required: false }}
          />
        </Show>
        {/* <FormGroupCustom
                    label={"is-signed"}
                    name={"is_signed"}
                    type={"checkbox"}
                    errors={errors}
                    control={control}
                /> */}

        <FormGroupCustom
          label={'is-secret'}
          name={'is_secret'}
          type={'checkbox'}
          errors={errors}
          control={control}
        />

        <FormGroupCustom
          label={'is-completed'}
          name={'is_completed'}
          type={'checkbox'}
          errors={errors}
          control={control}
        />
      </Form>
    </SideModal>
  )
}

export default DeviationFilter
