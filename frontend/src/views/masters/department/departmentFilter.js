import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form, FormGroup, Input, Label } from 'reactstrap'

import { FM, isValid, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'
import { loadDep } from '../../../utility/apis/departments'

const DepartmentFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
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
  const [loading, setLoading] = useState(false)

  const submitFilter = (d) => {
    setFilterData(d)
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
      title={'dept-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          placeholder={FM('name')}
          type='text'
          name='name'
          label={FM('name')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          type='checkbox'
          name='status'
          value={1}
          label={FM('department-status')}
          className='mb-1'
          errors={errors}
          control={control}
        />
      </Form>
    </SideModal>
  )
}

export default DepartmentFilter
