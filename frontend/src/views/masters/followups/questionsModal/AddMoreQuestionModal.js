import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Row } from 'reactstrap'
import {
  addActivityAction,
  approveActivity,
  assignActivity
} from '../../../../utility/apis/activity'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import FormGroupCustom from '../../../components/formGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../../router/RouteHelper'
import { loadUser } from '../../../../utility/apis/userManagement'
import { monthDaysOptions, UserTypes } from '../../../../utility/Const'
import { createAsyncSelectOptions, SpaceTrim } from '../../../../utility/Utils'
import { addComments } from '../../../../utility/apis/comment'
import { addQuestion } from '../../../../utility/apis/questions'
export default function CommentModal({
  responseData = () => {},
  edit = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) {
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState([])
  const dispatch = useDispatch()
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    if (edit === null) setEditData(null)
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    addQuestion({
      jsonData: {
        ...form
        // ...data,
        // is_visible: false,
        //
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
  return (
    <>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        loading={loading}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('more-question')}
      >
        <form>
          <CardBody>
            <FormGroupCustom
              value={edit?.group_name}
              placeholder={FM('group-name')}
              type='text'
              name='group_name'
              label={FM('group-name')}
              className='mb-1'
              // errors={errors}
              control={control}
              rules={{
                required: true,
                validate: (v) => {
                  return isValid(v) ? !SpaceTrim(v) : true
                }
              }}
            />
            <FormGroupCustom
              placeholder={FM('question')}
              type='text'
              name='question'
              label={FM('question')}
              className='mb-1'
              // errors={errors}
              control={control}
              value={edit?.question}
              rules={{
                required: true,
                validate: (v) => {
                  return isValid(v) ? !SpaceTrim(v) : true
                }
              }}
            />

            <FormGroupCustom
              value={edit?.is_visible}
              type={'checkbox'}
              name='is_visible'
              label={FM('enable')}
              // className='mb-1'
              errors={errors}
              control={control}
              rules={{ required: false }}
            />
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
