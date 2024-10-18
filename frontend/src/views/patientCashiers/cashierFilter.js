import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
// import Select from '../components/select'

import { FM } from '../../utility/helpers/common'
import { Type } from '../../utility/Utils'
import FormGroupCustom from '../components/formGroupCustom'
import SideModal from '../components/sideModal/sideModal'

const CashierFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
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
      title={'cashier-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          type='text'
          name='receipt_no'
          label={FM('receipt-no')}
          className='mb-1'
          errors={errors}
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          type='text'
          name='amount_from'
          label={FM('from-amount')}
          className='mb-1'
          errors={errors}
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          type='text'
          name='amount_to'
          label={FM('to-amount')}
          className='mb-1'
          errors={errors}
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          type='select'
          name='type'
          label={FM('type')}
          isClearable
          options={Type()}
          className='mb-1'
          errors={errors}
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          type='date'
          name='from_date'
          label={FM('from-date')}
          className='mb-1'
          dateFormat='YYYY-MM-DD'
          options={{
            maxDate: 'today'
          }}
          errors={errors}
          control={control}
          rules={{ required: false }}
        />
        <FormGroupCustom
          type='date'
          name='end_date'
          label={FM('end-date')}
          className='mb-1'
          dateFormat='YYYY-MM-DD'
          options={{
            minDate: watch('from_date') ?? null
          }}
          errors={errors}
          control={control}
          rules={{ required: false }}
        />
      </Form>
    </SideModal>
  )
}

export default CashierFilter
