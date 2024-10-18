import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Col, Form } from 'reactstrap'

import { FM } from '../../../utility/helpers/common'
import { createAsyncSelectOptions, decryptObject, Status } from '../../../utility/Utils'

import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

import { loadPatientPlanList } from '../../../utility/apis/ip'
import { categoriesLoad } from '../../../utility/apis/categories'
import { loadUser } from '../../../utility/apis/userManagement'
import { loadWorkShift } from '../../../utility/apis/companyWorkShift'
import { forDecryption, UserTypes } from '../../../utility/Const'

const ScheduleFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
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
  const [emp, setEmp] = useState([])
  const [user, setUser] = useState([])
  const [shift, setShift] = useState([])
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

  const loadEmployeeOptions = async (search, loadedOptions, { page }) => {
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
  const loadShiftOption = async (search, loadedOptions, { page }) => {
    const res = await loadWorkShift({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'shift_name', 'id', setShift)
  }

  const submitFilter = (d) => {
    setFilterData(d)
    setOpen(false)
    handleFilterModal(false)
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
      title={FM('schedule-filter')}
      done='filter'
    >
      <FormGroupCustom
        key={`fcdbdsfgsgfs`}
        type={'select'}
        control={control}
        errors={errors}
        name={'shift_id'}
        defaultOptions
        isClearable
        //  matchWith="id"
        async
        cacheOptions
        loadOptions={loadShiftOption}
        options={shift}
        label={FM('shift')}
        rules={{ required: false }}
        className='mb-1'
      />
      <FormGroupCustom
        key={`fcdbdsfgsgfs`}
        type={'select'}
        control={control}
        errors={errors}
        name={'user_id'}
        defaultOptions
        isClearable
        //  matchWith="id"
        async
        cacheOptions
        loadOptions={loadEmployeeOptions}
        options={emp}
        label={FM('employees')}
        rules={{ required: false }}
        className='mb-1'
      />

      <Form>
        <FormGroupCustom
          label={'patient'}
          type={'select'}
          async
          isClearable
          // defaultOptions
          cacheOptions
          control={control}
          options={user}
          loadOptions={loadUserTypeOptions}
          name={'patient_id'}
          className='mb-2'
        />
        {/* <FormGroupCustom
                    type="date"
                    name="shift_start_time"
                    label={FM("start-time")}
                    className='mb-1'
                    dateFormat='HH:mm:ss'
                    options={{
                        noCalendar: true,
                        enableTime: true,
                        enableSeconds: true
                    }}
                    errors={errors}
                    control={control}
                    rules={{ required: false, minLength: 3 }}
                />
                <FormGroupCustom
                    type="date"
                    name="shift_end_time"
                    label={FM("end-time")}
                    className='mb-1'
                    dateFormat='HH:mm:ss'
                    options={{
                        noCalendar: true,
                        enableTime: true,
                        enableSeconds: true
                    }}
                    errors={errors}
                    control={control}
                    rules={{ required: false, minLength: 3 }}
                /> */}
        {/* <FormGroupCustom
                    type="date"
                    name="shift_date"
                    label={FM("shift-date")}
                    className='mb-1'
                    // dateFormat='HH:mm:ss'
                    // options={{
                    //     noCalendar: true,
                    //     enableTime: true,
                    //     enableSeconds: true
                    // }}
                    errors={errors}
                    control={control}
                    rules={{ required: false }}
                /> */}
        {/* <FormGroupCustom
                    type="date"
                    name="shift_start_date"
                    label={FM("shift-start-date")}
                    className='mb-1'
                    // dateFormat='HH:mm:ss'
                    // options={{
                    //     noCalendar: true,
                    //     enableTime: true,
                    //     enableSeconds: true
                    // }}
                    errors={errors}
                    control={control}
                    rules={{ required: false }}
                /> */}
        {/* <FormGroupCustom
                    type="date"
                    name="shift_end_date"
                    label={FM("shift-end-date")}
                    className='mb-1'
                    // dateFormat='HH:mm:ss'
                    // options={{
                    //     noCalendar: true,
                    //     enableTime: true,
                    //     enableSeconds: true
                    // }}
                    errors={errors}
                    control={control}
                    rules={{ required: false }}
                /> */}
        {/* <FormGroupCustom
                    type="checkbox"
                    name="status"
                    value={1}
                    label={FM("workshift-status")}
                    className='mb-1'
                    errors={errors}
                    control={control}
                /> */}
      </Form>
    </SideModal>
  )
}

export default ScheduleFilter
