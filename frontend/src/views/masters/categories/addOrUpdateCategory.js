import { valid } from 'chroma-js'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Form, FormGroup, Label } from 'reactstrap'
import { categoriesEdit, categoriesSave } from '../../../utility/apis/categories'
import { loadCategoriesTypes } from '../../../utility/apis/categoriesTypes'
import { loadCategoriesParent } from '../../../utility/apis/categoryParents'
import { CategoryType, CreateCatType } from '../../../utility/Const'
// import { editCategory, loadCategories, loadCatTypes, saveCategory } from '../../../utility/apis/masterApis'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  createSelectOptions,
  hexToRgbA,
  isObjEmpty,
  SpaceTrim
} from '../../../utility/Utils'
import DropZone from '../../components/buttons/fileUploader'
import ColorPicker from '../../components/colorPicker/indx'
import FormGroupCustom from '../../components/formGroupCustom'
import SideModal from '../../components/sideModal/sideModal'

const AddCategory = ({ show, handleModal, edit = null, parentId = null, typeId = null }) => {
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
    reset,
    setValue
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
    if (isValid(watch('category_type_id'))) {
      const res = await loadCategoriesParent({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, category_type_id: watch('category_type_id') }
      })
      return createAsyncSelectOptions(res, page, 'name', 'id', setCats)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }
  log('TypeID', typeId)
  // Save Category
  const handleSave = (jsonData) => {
    if (edit && !isObjEmpty(edit)) {
      categoriesEdit({
        jsonData: {
          ...edit,
          ...jsonData,
          parent_id: isValid(parentId) ? parentId : null,
          category_type_id: isValid(typeId) ? typeId : jsonData?.category_type_id
        },
        id: parseInt(edit?.id),
        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
        }
      })
    } else {
      categoriesSave({
        jsonData: {
          ...jsonData,
          parent_id: isValid(parentId) ? parseInt(parentId) : null,
          category_type_id: isValid(typeId)
            ? parseInt(typeId)
            : parseInt(jsonData?.category_type_id)
        },
        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
        }
      })
    }
  }
  log('cat', watch('category_type_id'))
  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(handleSave)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleModal(false)
      }}
      title={
        isValid(edit?.id) && !isValid(parentId)
          ? 'edit-category'
          : !isValid(edit?.id) && !isValid(parentId)
          ? 'create-new-category'
          : isValid(parentId) && isValid(edit?.id)
          ? 'edit-subcategory'
          : 'create-subcategory'
      }
      done='save'
    >
      <Form>
        <Show IF={!isValid(typeId)}>
          <FormGroupCustom
            type={'select'}
            control={control}
            errors={errors}
            isDisabled={edit?.category_type_id}
            name={'category_type_id'}
            value={edit?.category_type_id}
            options={createConstSelectOptions(CreateCatType, FM)}
            label={FM('category-type')}
            rules={{ required: true }}
            // className='mb-1'
            className={classNames('mb-1', { 'pe-none': edit?.category_type_id })}
          />
        </Show>

        {/* <Show IF={!isValid(parentId)}>
                    <FormGroupCustom
                        type={"select"}
                        key={watch("category_type_id")}
                        isClearable
                        async
                        defaultOptions
                        loadOptions={loadCatOptions}
                        control={control}
                        value={parentId}
                        options={cats}
                        errors={errors}
                        rules={{ required: false }}
                        name="parent_id"
                        placeholder={FM("parent-category")}
                        className='mb-1'
                        label={FM("parent-category")}
                        isDisabled={!watch("category_type_id")}
                    />
                </Show> */}
        <FormGroupCustom
          value={edit?.name}
          placeholder={FM('enter-category-name')}
          type='text'
          name='name'
          label={FM('enter-category-name')}
          className='mb-1'
          errors={errors}
          control={control}
          rules={{
            required: true,
            validate: (v) => {
              return isValid(v) ? !SpaceTrim(v) : true
            }
          }}
        />
        <FormGroupCustom
          value={edit?.category_color}
          placeholder={FM('category-color')}
          type='color'
          name='category_color'
          label={FM('category-color')}
          className='mb-1'
          errors={errors}
          control={control}
          rules={{ required: false }}
        />
        {/* <FormGroup>
                    <Label>{FM("category-color")}</Label>
                    <Controller
                        control={control}
                        defaultValue={edit?.category_color ?? ''}
                        name={"category_color"}
                        rules={{ required: false }}
                        className='mb-1'
                        render={({ field: { onChange, value } }) => (
                            <ColorPicker
                                color={hexToRgbA(value) ?? ""}
                                onChange={(d) => { log(d); d?.hex !== "#000000" ? onChange(d?.hex) : onChange("") }}
                            />
                        )}
                    />
                    {errors && errors['category_color'] ? <p className='text-danger mt-1 mb-0'>{FM("please-select-valid-color")}</p> : ''}
                </FormGroup> */}
        <Show
          IF={
            watch('category_type_id') === CategoryType.deviation ||
            edit?.category_type_id === CategoryType.deviation ||
            typeId === '4'
          }
        >
          <FormGroupCustom
            key={watch('category_type_id')}
            label={FM('upload-file')}
            name={'follow_up_image'}
            type={'hidden'}
            errors={errors}
            control={control}
            rules={{ required: false }}
            values={edit}
          />
          <DropZone
            maxSize={2}
            accept={'image/*'}
            value={edit?.follow_up_image}
            onSuccess={(e) => {
              if (isValidArray(e)) {
                setValue('follow_up_image', e[0]?.file_name)
              } else {
                setValue('follow_up_image', null)
              }
            }}
          />
        </Show>
      </Form>
    </SideModal>
  )
}

export default AddCategory
