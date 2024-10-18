import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form, FormGroup, Input, Label } from 'reactstrap'

import { addFollowUp, editFollowUp } from '../../../utility/apis/followup'
import { FM, isValid, log } from '../../../utility/helpers/common'
import {
  createAsyncSelectOptions,
  createSelectOptions,
  isObjEmpty,
  SuccessToast
} from '../../../utility/Utils'
import ColorPicker from '../../components/colorPicker/indx'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

import { loadPatientPlanList } from '../../../utility/apis/ip'
// import { currencyFormat, formatDate, numberFormat } from '../../../utility/Utils'
import { getPath } from '../../../router/RouteHelper'
import { categoriesLoad } from '../../../utility/apis/categories'
import { addWorkShift, editWorkShift } from '../../../utility/apis/companyWorkShift'
import { addQuestion, editQuestion } from '../../../utility/apis/questions'
const AddFolloUps = ({ responseData = () => {}, show, handleModal, edit = null }) => {
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
  const [types, setTypes] = useState([])
  const [cats, setCats] = useState([])
  const [catLoad, setCatLoad] = useState(false)
  const [loading, setLoading] = useState(false)

  // Show/Hide Modal
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  // Edit
  // useEffect(() => {

  //     if (edit && !isObjEmpty(edit)) {
  //         if (edit?.category_type) setTypes(createSelectOptions([edit?.category_type], "name", "id"))
  //         if (edit?.parent) setCats(createSelectOptions([edit?.parent], "name", "id"))
  //     }
  // }, [edit])

  // Save Category
  const handleSave = (data) => {
    if (edit && !isObjEmpty(edit)) {
      editQuestion({
        jsonData: {
          ...edit,
          ...data,
          is_visible: false
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
      log(data)
      addQuestion({
        jsonData: {
          ...data,
          is_visible: false
        },
        loading: setLoading,
        dispatch,
        success: (d) => {
          responseData(d?.payload)
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
      title={edit ? FM('edit-question') : FM('create-question')}
      done='save'
    >
      <Form>
        {!isValid(edit?.id) ? (
          <FormGroupCustom
            value={edit?.group_name}
            placeholder={FM('group-name')}
            type='text'
            name='group_name'
            label={FM('group-name')}
            className='mb-1'
            // errors={errors}
            control={control}
            rules={{ required: true }}
          />
        ) : (
          <FormGroupCustom
            readOnly
            value={edit?.group_name}
            placeholder={FM('group-name')}
            type='text'
            name='group_name'
            label={FM('group-name')}
            className='mb-1'
            // errors={errors}
            control={control}
            rules={{ required: true }}
          />
        )}

        <FormGroupCustom
          placeholder={FM('question')}
          type='text'
          name='question'
          label={FM('question')}
          className='mb-1'
          // errors={errors}
          control={control}
          value={edit?.question}
          rules={{ required: true }}
        />

        {/* <FormGroupCustom
                    value={edit?.is_visible}
                    type={"checkbox"}
                    name="is_visible"
                    label={FM("enable")}
                    // className='mb-1'
                    errors={errors}
                    control={control}
                    rules={{ required: true }}
                /> */}
      </Form>
    </SideModal>
  )
}

export default AddFolloUps
