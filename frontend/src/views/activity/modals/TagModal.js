import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col } from 'reactstrap'
import { tagActivity } from '../../../utility/apis/activity'
import { FM, isValid } from '../../../utility/helpers/common'
import { SpaceTrim } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

export default function TagModal({
  scrollControl = true,
  edit = null,
  noView = false,
  setReload,
  showModal = false,
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) {
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
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
    reset()
    setShowModal(!open)
    if (edit === null) setEditData(null)
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    tagActivity({
      jsonData: {
        ...form,
        activity_id: edit?.id
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        // setReload(true)
        handleModal()
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
        modalClass={'modal-sm'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('tag')}
      >
        <CardBody>
          <Col md='12'>
            <FormGroupCustom
              label={'tag-input'}
              name={'activity_tag'}
              type={'text'}
              errors={errors}
              className='mb-2'
              control={control}
              rules={{
                required: true,
                validate: (v) => {
                  return isValid(v) ? !SpaceTrim(v) : true
                }
              }}
            />
          </Col>
        </CardBody>
      </CenteredModal>
    </>
  )
}
