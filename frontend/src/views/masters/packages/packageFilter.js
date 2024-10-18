import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { FM } from '../../../utility/helpers/common'
import { accountStatus } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

const PackagesFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
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
      title={'package-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          placeholder={FM('title')}
          type='text'
          name={'name'}
          label={FM('title')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          placeholder={FM('number_of_employees')}
          type='text'
          name={'number_of_employees'}
          label={FM('number_of_employees')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          placeholder={FM('number_of_patients')}
          type='text'
          name={'number_of_patients'}
          label={FM('number_of_patients')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          placeholder={FM('price')}
          type='text'
          name={'price'}
          label={FM('price')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          label={'status'}
          type={'select'}
          isClearable
          // defaultOptions
          control={control}
          options={accountStatus()}
          name={'status'}
          className='mb-2'
        />

        <FormGroupCustom
          label={'is-sms-enable'}
          type={'checkbox'}
          name={'is_sms_enable'}
          errors={errors}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          label={'is-enable-bankid'}
          type={'checkbox'}
          name={'is_enable_bankid_charges'}
          errors={errors}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />
      </Form>
    </SideModal>
  )
}

export default PackagesFilter
