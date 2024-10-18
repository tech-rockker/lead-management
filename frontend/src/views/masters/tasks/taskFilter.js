import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { loadFollowUp } from '../../../utility/apis/followup'
import { FM, isValid } from '../../../utility/helpers/common'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  decryptObject,
  taskStatus
} from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

import { loadPatientPlanList } from '../../../utility/apis/ip'

import { loadActivity } from '../../../utility/apis/activity'
import { categoriesLoad } from '../../../utility/apis/categories'
import { loadUser } from '../../../utility/apis/userManagement'
import { CategoryType, forDecryption, SourceTypes, UserTypes } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import useUserType from '../../../utility/hooks/useUserType'
import Show from '../../../utility/Show'
import { listJournal } from '../../../utility/apis/journal'
import { loadDevitation } from '../../../utility/apis/devitation'

const TaskFilter = ({
  hideDates = false,
  show,
  handleFilterModal,
  setFilterData,
  filterData,
  userData = null,
  users = null
}) => {
  // Dispatch
  const dispatch = useDispatch()
  // Form Validation
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch,
    reset
  } = useForm()
  const history = useHistory()
  // States
  const [open, setOpen] = useState(show)
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(false)
  const [activity, setActivity] = useState([])
  const [user, setUser] = useState([])
  const [emp, setEmp] = useState([])
  const [ip, setIp] = useState([])
  const [follow, setFollow] = useState([])
  const [journal, setJournal] = useState([])
  const [deviation, setDeviation] = useState([])
  const userType = useUserType()

  const submitFilter = (d) => {
    setFilterData({ ...d, resource_id: isValid(userData?.id) ? userData?.id : d?.resource_id })
    // setFilterData(d)
    setOpen(false)
    handleFilterModal(false)
  }

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  const loadActOption = async (search, loadedOptions, { page }) => {
    const res = await loadActivity({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, type_id: CategoryType.activity }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setActivity)
  }

  const loadJournalOption = async (search, loadedOptions, { page }) => {
    const res = await listJournal({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, type_id: CategoryType.jaurnal }
    })
    return createAsyncSelectOptions(res, page, 'description', 'id', setJournal, (e) => ({
      ...e,
      description: `${e?.patient?.name}: ${e?.description ?? FM('no-description')}`
    }))
  }

  const loadDeviationOption = async (search, loadedOptions, { page }) => {
    const res = await loadDevitation({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, type_id: CategoryType.deviation }
    })
    return createAsyncSelectOptions(res, page, 'description', 'id', setDeviation, (e) => ({
      ...e,
      description: `${e?.patient?.name}: ${e?.description ?? FM('no-description')}`
    }))
  }

  const loadCatOptions = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setCats)
  }

  const loadEmpOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { user_type_id: UserTypes.employee }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setEmp, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  const loadUserTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setUser, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  const loadImplementationsOptions = async (search, loadedOptions, { page }) => {
    const res = await loadPatientPlanList({
      async: true,
      page,
      perPage: 100
      //  jsonData: { user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setIp)
  }

  const loadFollowupsOptions = async (search, loadedOptions, { page }) => {
    const res = await loadFollowUp({
      async: true,
      page,
      perPage: 100
      //jsonData: { user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setFollow)
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
      title={'task-filter'}
      done='filter'
    >
      <Form>
        <Show
          IF={
            userType === UserTypes.company ||
            userType === UserTypes.employee ||
            userType === UserTypes.branch
          }
        >
          <FormGroupCustom
            label={'source-type'}
            type={'select'}
            control={control}
            options={createConstSelectOptions(SourceTypes, FM)}
            name={'type_id'}
            className='mb-2'
          />
          <Show IF={watch('type_id') === CategoryType.user}>
            <FormGroupCustom
              label={'employee'}
              type={'select'}
              async
              // defaultOptions
              cacheOptions
              control={control}
              options={emp}
              loadOptions={loadEmpOption}
              name={'emp_id'}
              className='mb-2'
            />
          </Show>
          <Show IF={watch('type_id') === CategoryType.activity}>
            <FormGroupCustom
              label={'activity'}
              type={'select'}
              async
              // defaultOptions
              cacheOptions
              control={control}
              options={activity}
              loadOptions={loadActOption}
              name={'resource_id'}
              className='mb-2'
            />
          </Show>
          <Show IF={watch('type_id') === CategoryType.implementation}>
            <FormGroupCustom
              label={'implementations'}
              type={'select'}
              async
              // defaultOptions
              cacheOptions
              control={control}
              options={ip}
              loadOptions={loadImplementationsOptions}
              name={'resource_id'}
              className='mb-2'
            />
          </Show>
          <Show IF={watch('type_id') === CategoryType.jaurnal}>
            <FormGroupCustom
              label={'journal'}
              type={'select'}
              async
              // defaultOptions
              cacheOptions
              control={control}
              options={journal}
              loadOptions={loadJournalOption}
              name={'resource_id'}
              className='mb-2'
            />
          </Show>
          <Show IF={watch('type_id') === CategoryType.deviation}>
            <FormGroupCustom
              label={'deviation'}
              type={'select'}
              async
              // defaultOptions
              cacheOptions
              control={control}
              options={deviation}
              loadOptions={loadDeviationOption}
              name={'resource_id'}
              className='mb-2'
            />
          </Show>
          <Show IF={watch('type_id') === CategoryType.followups}>
            <FormGroupCustom
              label={'followups'}
              type={'select'}
              async
              // defaultOptions
              cacheOptions
              control={control}
              options={follow}
              loadOptions={loadFollowupsOptions}
              name={'resource_id'}
              className='mb-2'
            />
          </Show>
          <Show IF={!isValid(users) && watch('type_id') === CategoryType.patient}>
            <FormGroupCustom
              label={'patient'}
              type={'select'}
              async
              // defaultOptions
              cacheOptions
              control={control}
              options={user}
              loadOptions={loadUserTypeOptions}
              name={'source_id'}
              className='mb-2'
            />
          </Show>
        </Show>
        <FormGroupCustom
          placeholder={FM('title')}
          type='text'
          name='title'
          label={FM('title')}
          className='mb-1'
          // errors={errors}
          control={control}
          rules={{ required: false }}
        />
        <Hide IF={hideDates === true}>
          <FormGroupCustom
            type='date'
            name='start_date'
            label={FM('start-date')}
            className='mb-1'
            dateFormat='YYYY-MM-DD'
            options={{
              noCalendar: false
            }}
            errors={errors}
            control={control}
            rules={{ required: false, minLength: 3 }}
          />
          <FormGroupCustom
            type='date'
            name='end_date'
            label={FM('end-date')}
            className='mb-1'
            dateFormat='YYYY-MM-DD'
            options={{
              noCalendar: false
            }}
            errors={errors}
            control={control}
            rules={{ required: false, minLength: 3 }}
          />
        </Hide>
        <FormGroupCustom
          label={FM('status')}
          type={'select'}
          isClearable
          // defaultOptions
          control={control}
          options={taskStatus()}
          name={'status'}
          className='mb-2'
        />
      </Form>
    </SideModal>
  )
}

export default TaskFilter
