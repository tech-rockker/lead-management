import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { SliderPicker } from 'react-color'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Form, FormGroup, Input, Label } from 'reactstrap'
import {
  editCategory,
  loadCategories,
  loadCategoryParents,
  loadCatTypes,
  saveCategory
} from '../../utility/apis/masterApis'
import { editPermission, addPermission } from '../../utility/apis/permissions'
import { Patterns } from '../../utility/Const'
import { FM, isValid, log } from '../../utility/helpers/common'
import { createAsyncSelectOptions, createSelectOptions, isObjEmpty } from '../../utility/Utils'
import FormGroupCustom from '../components/formGroupCustom'

import SideModal from '../components/sideModal/sideModal'

const AddPermission = ({ show, handleModal, edit = null }) => {
  const dispatch = useDispatch()
  // Form Validation
  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch
  } = useForm()

  // States
  const [open, setOpen] = useState(show)
  const [loading, setLoading] = useState(false)

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
  }, [show])

  useEffect(() => {
    if (edit && !isObjEmpty(edit)) {
    }
  }, [edit])

  // Save
  const handleSave = (jsonData) => {
    if (edit && !isObjEmpty(edit)) {
      editPermission({
        jsonData: {
          ...edit,
          ...jsonData
        },
        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
        }
      })
    } else {
      addPermission({
        jsonData: {
          ...jsonData,
          entry_mode: 0
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

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(handleSave)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleModal(false)
      }}
      title={edit ? 'edit-permission' : 'create-new-permission'}
      done='save'
    >
      <Form>
        <FormGroupCustom
          values={edit}
          label={'enter-name'}
          type={'text'}
          className='mb-1'
          name={'name'}
          errors={errors}
          control={control}
          rules={{ required: true }}
        />
        <FormGroupCustom
          values={edit}
          type={'text'}
          name={'se_name'}
          errors={errors}
          className='mb-1'
          label={FM('se-name')}
          message={'se_name'}
          feedback={FM('enter-valid-number')}
          control={control}
          rules={{ required: true }}
        />
        <FormGroupCustom
          values={edit}
          type={'text'}
          name={'group_name'}
          errors={errors}
          className='mb-1'
          label={FM('group-name')}
          message={'group_name'}
          feedback={FM('enter-valid-number')}
          control={control}
          rules={{ required: true }}
        />
      </Form>
    </SideModal>
  )
}

export default AddPermission
