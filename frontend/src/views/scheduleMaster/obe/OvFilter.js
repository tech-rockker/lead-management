import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
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
  Status
} from '../../../utility/Utils'
import ColorPicker from '../../components/colorPicker/indx'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

import { loadPatientPlanList } from '../../../utility/apis/ip'

import { getPath } from '../../../router/RouteHelper'
import { categoriesLoad } from '../../../utility/apis/categories'
import Hide from '../../../utility/Hide'

const OvFilter = ({ id = null, show, handleFilterModal, setFilterData, filterData }) => {
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
  const [ip, setIp] = useState([])

  const submitFilter = (d) => {
    setFilterData(d)
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
    return createAsyncSelectOptions(res, page, 'what_happened', 'id', setIp)
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

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={'obe-filter'}
      done='filter'
    >
      <Form>
        <Hide IF={isValid(id)}>
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
          <FormGroupCustom
            type='date'
            name='start_time'
            label={FM('start-time')}
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
            type='date'
            name='end_time'
            label={FM('end-time')}
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
        </Hide>
        {/* <FormGroupCustom
                    type="checkbox"
                    name="status"
                    value={1}
                    label={FM("workshift-status")}
                    className='mb-1'
                    errors={errors}
                    control={control}
                /> */}

        <FormGroupCustom
          type='date'
          name='date'
          label={FM('start-date')}
          className='mb-1'
          errors={errors}
          control={control}
        />
        <FormGroupCustom
          type='date'
          name='end_date'
          label={FM('end-date')}
          className='mb-1'
          errors={errors}
          control={control}
        />
      </Form>
    </SideModal>
  )
}

export default OvFilter
