import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, FormFeedback, Label, Row } from 'reactstrap'
import { addActivityAction, approveActivity, assignActivity } from '../../../utility/apis/activity'
import { FM, isValid, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../router/RouteHelper'
import { loadUser } from '../../../utility/apis/userManagement'
import { markAsComplete, monthDaysOptions, UserTypes } from '../../../utility/Const'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  SuccessToast
} from '../../../utility/Utils'

export default function ActionModal({
  responseData = () => {},
  edit = null,
  noView = false,
  showModal = false,
  setReload,
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
  const form = useForm({
    option: null
  })
  const [response, setResponse] = useState(null)
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
    reset()
    setOpen(!open)
    setShowModal(!open)
    if (edit === null) setEditData(null)
  }
  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    addActivityAction({
      jsonData: {
        ...form,
        activity_id: edit?.id,
        status: form?.option === '1' || form?.option === '2' || form?.option === '3' ? 1 : 2,
        question: null
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        // setReload(true)
        if (
          form?.option === '1' ||
          form?.option === '2' ||
          form?.option === '3' ||
          form?.option === '4'
        ) {
          SuccessToast('activity-moved-to-done-and-journal-created')
        } else if (form?.option === '5') {
          SuccessToast('activity-moved-to-done-and-journal-and-deviation-created')
        } else {
          SuccessToast('activity-moved-to-done')
        }
        responseData(data?.payload)
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
        scrollControl={false}
        disableSave={!isValid(watch('option'))}
        loading={loading}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('mark-as-complete')}
      >
        <CardBody>
          <Col md='12'>
            <FormGroupCustom
              label={'completed-by-staff-on-time'}
              name={'option'}
              type={'radio'}
              errors={errors}
              value={'1'}
              setValue={setValue}
              defaultChecked={'1'}
              options={createConstSelectOptions(markAsComplete, FM)}
              className='mb-2'
              control={control}
            />
          </Col>
          <Col md='12'>
            <FormGroupCustom
              label={'completed-by-staff-not-on-time'}
              name={'option'}
              type={'radio'}
              errors={errors}
              value={'2'}
              setValue={setValue}
              control={control}
            />
            <div className='text-small-12 fw-bold ms-2-1 mb-2 text-warning'>
              {FM('This-option-will-create-Journal')}
            </div>
          </Col>
          <Col md='12'>
            <FormGroupCustom
              label={'completed-by-patient-itself'}
              name={'option'}
              type={'radio'}
              errors={errors}
              value={'3'}
              setValue={setValue}
              control={control}
            />
            <div className='text-small-12 fw-bold ms-2-1 mb-2 text-warning'>
              {FM('This-option-will-create-Journal')}
            </div>
          </Col>
          <Col md='12'>
            <FormGroupCustom
              label={'patient-did-not-want'}
              name={'option'}
              type={'radio'}
              errors={errors}
              value={'4'}
              setValue={setValue}
              control={control}
            />
            <div className='text-small-12 fw-bold ms-2-1 mb-2 text-warning'>
              {FM('This-option-will-create-Journal')}
            </div>
          </Col>
          <Col md='12'>
            <FormGroupCustom
              label={'not-done-by-employee'}
              name={'option'}
              type={'radio'}
              errors={errors}
              value={'5'}
              setValue={setValue}
              control={control}
            />
            <div className='text-small-12 fw-bold ms-2-1 text-warning'>
              {FM('This-option-will-create-Deviation-&-Journal')}
            </div>
          </Col>
          <Col md='12' className='mt-2'>
            <FormGroupCustom
              label={'comment'}
              name={'comment'}
              type={'autocomplete'}
              errors={errors}
              className='mt-0'
              control={control}
              rules={{ required: watch('option') === '4' || watch('option') === '5' }}
            />
          </Col>
        </CardBody>
      </CenteredModal>
    </>
  )
}
