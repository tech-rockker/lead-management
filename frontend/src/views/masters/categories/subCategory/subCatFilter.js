import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import FormGroupCustom from '../../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../../components/sideModal/sideModal'

const SubCategoryFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
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
      title={'subcategory-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          placeholder={FM('enter-name')}
          type='text'
          name='name'
          label={FM('subcategory')}
          className='mb-1'
          errors={errors}
          control={control}
        />

        <FormGroupCustom
          type='checkbox'
          name='status'
          value={1}
          label={FM('subcategory-status')}
          className='mb-1'
          errors={errors}
          control={control}
        />
      </Form>
    </SideModal>
  )
}

export default SubCategoryFilter
