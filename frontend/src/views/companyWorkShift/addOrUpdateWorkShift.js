import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { SliderPicker } from 'react-color'
import { HelpCircle } from 'react-feather'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Form, FormGroup, Input, Label } from 'reactstrap'
import { loadCategoriesTypes } from '../../utility/apis/categoriesTypes'
import { loadCategoriesParent } from '../../utility/apis/categoryParents'
import { addWorkShift, editWorkShift, deleteWorkShift } from '../../utility/apis/companyWorkShift'

// import { editCategory, loadCategories, loadCatTypes, saveCategory } from '../../../utility/apis/masterApis'
import { FM, isValid, log } from '../../utility/helpers/common'
import { createAsyncSelectOptions, createSelectOptions, isObjEmpty } from '../../utility/Utils'
import ColorPicker from '../components/colorPicker/indx'
import FormGroupCustom from '../components/formGroupCustom'
import Select from '../components/select'
import SideModal from '../components/sideModal/sideModal'

const AddWorkShift = ({ show, handleModal, edit = null }) => {
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

  // States
  const [open, setOpen] = useState(show)
  const [types, setTypes] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(false)

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  // Edit
  useEffect(() => {
    if (edit && !isObjEmpty(edit)) {
      if (edit?.category_type) setTypes(createSelectOptions([edit?.category_type], 'name', 'id'))
      if (edit?.parent) setCats(createSelectOptions([edit?.parent], 'name', 'id'))
    }
  }, [edit])

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

  // Category Options
  const loadCatOptions = async (search, loadedOptions, { page }) => {
    if (isValid(getValues('category_type_id'))) {
      const res = await loadCategoriesParent({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, category_type_id: getValues('category_type_id') }
      })
      return createAsyncSelectOptions(res, page, 'name', 'id', setCats)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  // Save Category
  const handleSave = (jsonData) => {
    if (edit && !isObjEmpty(edit)) {
      editWorkShift({
        jsonData: {
          ...edit,
          ...jsonData
        },
        id: edit?.id,
        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
        }
      })
    } else {
      addWorkShift({
        ...jsonData,

        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
        }
      })
    }
  }

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(handleSave)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleModal(false)
      }}
      // title={edit ? "edit-shift" : "create-new-shift"}
      title={FM('work-shift')}
      done='save'
    >
      <Form>
        <FormGroupCustom
          value={edit?.shift_name}
          placeholder={FM('enter-shift-name')}
          type='text'
          name='shift_name'
          label={FM('enter-shift-name')}
          className='mb-1'
          errors={errors}
          control={control}
        />
        <FormGroupCustom
          value={edit?.shift_start_time}
          placeholder={FM('enter-shift-start-time')}
          type='time'
          name='shift_start_time'
          label={FM('enter-shift-start-time')}
          className='mb-1'
          errors={errors}
          control={control}
        />
        <FormGroupCustom
          value={edit?.shift_end_time}
          placeholder={FM('enter-shift-end-time')}
          type='time'
          name='shift_end_time'
          label={FM('enter-shift-end-time')}
          className='mb-1'
          errors={errors}
          control={control}
        />
        <FormGroup>
          <Label>{FM('shift-color')}</Label>
          <Controller
            control={control}
            defaultValue={edit?.shift_color ?? ''}
            name={'shift_color'}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <ColorPicker
                color={value ?? ''}
                onChange={(d) => {
                  log(d)
                  d?.hex !== '#000000' ? onChange(d?.hex) : onChange('')
                }}
              />
            )}
          />
          {errors && errors['shift_color'] ? (
            <p className='text-danger mt-1'>{FM('please-select-valid-color')}</p>
          ) : (
            ''
          )}
        </FormGroup>
      </Form>
    </SideModal>
  )
}

export default AddWorkShift
