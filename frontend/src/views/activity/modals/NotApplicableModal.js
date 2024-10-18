import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Row } from 'reactstrap'
import {
  activityNotApplicable,
  addActivityAction,
  approveActivity,
  assignActivity
} from '../../../utility/apis/activity'
import { FM, isValid, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../router/RouteHelper'
import { loadUser } from '../../../utility/apis/userManagement'
import { monthDaysOptions, UserTypes } from '../../../utility/Const'
import {
  addDay,
  calculateTime,
  createAsyncSelectOptions,
  enableFutureDates,
  formatDate,
  SpaceTrim,
  SuccessToast
} from '../../../utility/Utils'
import { activityDelete } from '../../../redux/reducers/activity'
import { useLocation } from 'react-router-dom'

export default function NotApplicable({
  edit = null,
  setEdit = () => {},
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
  const form = useForm()
  const [time, setTime] = useState(null)
  const [end, setEnd] = useState(null)

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form
  const location = useLocation()
  const notification = location?.state?.notification

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    if (edit === null) setEditData(null)
  }

  const handleClose = (from = null) => {
    handleModal()
    reset()
  }

  const handleSave = (form) => {
    activityNotApplicable({
      jsonData: {
        ...form,
        activity_id: edit?.id,
        status: 3
        // option: 1
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        handleClose()
        // setTimeout(() => {
        setReload(true)
        SuccessToast('activity-moved-to-not-applicable')
        // }, 1000)
      }
    })
  }

  useEffect(() => {
    if (notification?.data_id) {
      setShowModal(true)
      setEdit({
        id: notification?.data_id
      })
    }
  }, [notification])

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
        scrollControl={false}
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('not-applicable')}
      >
        <form>
          <CardBody>
            <Row>
              <Col md='6'>
                <FormGroupCustom
                  name={'from_date'}
                  type={'date'}
                  errors={errors}
                  label={FM('start-date')}
                  options={{
                    enable: [
                      function (date) {
                        return enableFutureDates(date)
                      },
                      new Date()
                    ]
                  }}
                  setValue={setValue}
                  className='mb-2'
                  control={control}
                  // max={formatDate(new Date(), "YYYY-MM-DD")}
                  rules={{ required: true }}
                />
              </Col>
              <Col md='6'>
                <FormGroupCustom
                  name={'end_date'}
                  type={'date'}
                  errors={errors}
                  options={{
                    enable: [
                      function (date) {
                        return enableFutureDates(date)
                      },
                      new Date()
                    ],
                    minDate: watch('from_date') ?? null
                  }}
                  label={FM('end-date')}
                  className='mb-2'
                  control={control}
                  setValue={setValue}
                  // max={formatDate(new Date(), "YYYY-MM-DD")}
                  rules={{ required: true }}
                />
              </Col>
              <Col md='12'>
                <FormGroupCustom
                  label={'comment'}
                  name={'action_comment'}
                  type={'autocomplete'}
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
            </Row>
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
