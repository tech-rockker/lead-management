import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { FM } from '../../../src/utility/helpers/common'
import FormGroupCustom from '../../views/components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../views/components/sideModal/sideModal'

const PermissionFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
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
      title={'permission-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          placeholder={FM('Ex. permission-name')}
          type='text'
          name='name'
          label={FM('enter-name')}
          className='mb-1'
          errors={errors}
          control={control}
        />

        <FormGroupCustom
          placeholder={FM('group-name')}
          type='text'
          name='group_name'
          label={FM('group-name')}
          className='mb-1'
          errors={errors}
          control={control}
        />
      </Form>
    </SideModal>
  )
}

export default PermissionFilter
