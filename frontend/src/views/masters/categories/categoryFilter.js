import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { loadCategoriesTypes } from '../../../utility/apis/categoriesTypes'
import { loadCategoriesParent } from '../../../utility/apis/categoryParents'
import { CreateCatType } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  createSelectOptions
} from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

const CategoryFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
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
  const [types, setTypes] = useState([])

  const submitFilter = (d) => {
    setFilterData(d)
    log(d)
  }

  // Type Options
  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCategoriesTypes({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setTypes)
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
      title={'category-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          type={'select'}
          control={control}
          errors={errors}
          name={'category_type_id'}
          options={createConstSelectOptions(CreateCatType, FM)}
          label={FM('category-type')}
          rules={{ required: false }}
          className='mb-1'
        />

        <FormGroupCustom
          placeholder={FM('enter-category-name')}
          type='text'
          name='name'
          label={FM('enter-category-name')}
          className='mb-1'
          errors={errors}
          control={control}
        />

        <FormGroupCustom
          type='checkbox'
          name='status'
          value={1}
          label={FM('category-status')}
          className='mb-1'
          errors={errors}
          control={control}
        />
      </Form>
    </SideModal>
  )
}

export default CategoryFilter
