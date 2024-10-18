import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Col, Form, FormGroup, Input, Label } from 'reactstrap'
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
  Status,
  createConstSelectOptions,
  decryptObject
} from '../../../utility/Utils'
import ColorPicker from '../../components/colorPicker/indx'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

import { loadPatientPlanList } from '../../../utility/apis/ip'

import { getPath } from '../../../router/RouteHelper'
import { categoriesLoad } from '../../../utility/apis/categories'
import { loadUser } from '../../../utility/apis/userManagement'
import { approveStatus, forDecryption, UserTypes } from '../../../utility/Const'
import Show from '../../../utility/Show'
import Hide from '../../../utility/Hide'

const LeaveFilter = ({ hideDates = false, show, handleFilterModal, setFilterData, filterData }) => {
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
  // States
  const [open, setOpen] = useState(show)
  const user = useSelector((a) => a.auth.userData)

  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(false)
  const [emp, setEmp] = useState(null)
  const [ip, setIp] = useState([])

  const submitFilter = (d) => {
    console.log(d)

    setFilterData({
      ...d,
      filterData
    })
    setOpen(false)
    handleFilterModal(false)
  }

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

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

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={FM('leave-filter')}
      done='filter'
    >
      <Form>
        <Hide IF={hideDates === true}>
          <FormGroupCustom
            name={'start_date'}
            type={'date'}
            errors={errors}
            label={FM('start-date')}
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
            label={FM('end-date')}
            dateFormat={'YYYY-MM-DD'}
            setValue={setValue}
            className='mb-2'
            options={{
              minDate: new Date(watch('from_date'))
            }}
            control={control}
            rules={{ required: false }}
          />
        </Hide>
        <Show
          IF={user?.user_type_id === UserTypes.company || user?.user_type_id === UserTypes.branch}
        >
          <FormGroupCustom
            label={FM('employees')}
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

        <FormGroupCustom
          label={FM('status')}
          type={'select'}
          isClearable
          // defaultOptions
          control={control}
          options={createConstSelectOptions(approveStatus, FM)}
          name='leave_approved'
          className='mb-1'
          rules={{ required: false }}
        />
      </Form>
    </SideModal>
  )
}

export default LeaveFilter
