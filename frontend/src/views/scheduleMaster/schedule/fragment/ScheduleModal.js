// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Button, ButtonGroup, Card, CardBody, Col, Row } from 'reactstrap'
import { workShiftView } from '../../../../utility/apis/companyWorkShift'
import { addSchedule, editSchedule, viewSchedule } from '../../../../utility/apis/schedule'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import {
  fastLoop,
  isObjEmpty,
  jsonDecodeAll,
  setValues,
  SuccessToast,
  viewInHours
} from '../../../../utility/Utils'
import LoadingButton from '../../../components/buttons/LoadingButton'
import CenteredModal from '../../../components/modal/CenteredModal'
import ScheduleDetail from './Tabs/ScheduleDetail'
import ScheduleFormTab from './Tabs/ScheduleFormTab'
import { Calendar, Clock, Percent } from 'react-feather'
import { HourglassEmptyOutlined, ViewWeek } from '@material-ui/icons'
import StatsHorizontal from '../../../components/cards/HoriStatCard'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const ScheduleModal = ({
  templateId = null,
  noView = false,
  showModal = false,
  responseData = () => {},
  handleToggle = () => {},
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) => {
  // Dispatch
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [id, setId] = useState(null)
  const [empView, setEmployeeView] = useState(null)
  const [patient, setPatientView] = useState(null)
  const [patientHours, setPatientHours] = useState(null)

  // form data
  const formFields = {
    user_id: '',
    shift_id: '',
    shift_date: '',
    shift_dates: '',
    shift_start_time: '',
    shift_end_time: '',
    title: '',
    date: '',
    start_date: '',
    start_time: '',
    is_repeat: '',
    is_range: '',
    every_week: '',
    repetition_type: '',
    week_days: 'json',
    end_time: ''
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
  }

  const loadDetails = () => {
    if (id) {
      viewSchedule({
        id,
        loading: setLoadingDetails,
        success: (d) => {
          const values = jsonDecodeAll(formFields, {
            ...d
          })
          setEditData(values)
          setValues(formFields, values, setValue)
        }
      })
    }
  }
  useEffect(() => {
    handleToggle(open)
  }, [open])

  const clearExtraParams = (dates) => {
    const re = []
    if (isValidArray(dates)) {
      fastLoop(dates, (shifts, index) => {
        const se = []
        fastLoop(shifts.shifts, (shift, i) => {
          delete shift.shift
          delete shift.employee
          delete shift.patient
          delete shift?.rest_between_next_shift2
          // delete shift?.remaining_minutes_till_date_employee
          se[i] = {
            ...shift,
            rest_between_next_shift: shift?.rest_between_next_shift?.minutesTotal
          }
        })
        re[index] = {
          // type: shifts?.type ?? null,
          date: shifts?.date,
          shifts: se
        }
      })
    }
    return re
  }

  const handleSave = (data) => {
    log(data)
    addSchedule({
      jsonData: {
        schedules: clearExtraParams(data?.dates),
        schedule_template_id: data?.schedule_template_id ?? ''
      },
      loading: setLoading,
      success: (d) => {
        responseData(d?.payload)
        handleModal()
      }
    })
  }

  const onSubmit = (d) => {
    if (isObjEmpty(errors)) {
      handleSave(d)
    }
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (open === true && id) loadDetails()
  }, [open, id])

  useEffect(() => {
    if (showModal) {
      handleModal()
    }
  }, [showModal])

  return (
    <>
      <CenteredModal
        id={'schedule-modal'}
        scrollControl={false}
        title={`${FM(`create-schedule`)}`}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-fullscreen'}
        open={open}
        handleModal={handleClose}
        footerComponent={
          <>
            <div className='flex-1 d-none d-xl-block'>
              <Row className='p-0 g-0'>
                <Show IF={isValid(empView?.id)}>
                  <Col md='2'>
                    <div className='text-small-12 text-dark text-capitalize pb-25 fw-bold mb-0'>
                      {empView?.name} -
                    </div>
                    <StatsHorizontal
                      className={'white no-shadow small mb-0'}
                      icon={<Clock size={30} />}
                      color='primary'
                      stats={
                        isValid(empView?.assigned_work?.assigned_working_hour_per_week)
                          ? empView?.assigned_work?.assigned_working_hour_per_week
                          : 0
                      }
                      statTitle={FM('work-hours')}
                    />
                  </Col>
                  <Col md='2'>
                    <div className='text-small-12 text-dark text-capitalize pb-25 fw-bold mb-0'>
                      {empView?.name} -
                    </div>
                    <StatsHorizontal
                      className={'white small mb-0'}
                      icon={<Percent size={30} />}
                      color='info'
                      stats={`${
                        isValid(empView?.assigned_work?.working_percent)
                          ? empView?.assigned_work?.working_percent
                          : 0
                      }%`}
                      statTitle={FM('work-grade')}
                    />
                  </Col>
                  <Col md='2' className='' style={{ borderRight: '2px solid', marginRight: 15 }}>
                    <div className='text-small-12 text-dark text-capitalize pb-25 fw-bold mb-0'>
                      {empView?.name} -
                    </div>
                    <StatsHorizontal
                      className={'white small mb-0'}
                      icon={<Clock size={30} />}
                      color='success'
                      stats={
                        isValid(empView?.assigned_work?.actual_working_hours_per_week_in_min)
                          ? viewInHours(
                              Math.floor(
                                empView?.assigned_work?.assigned_working_hour_per_week *
                                  (empView?.assigned_work?.working_percent / 100) *
                                  60
                              )
                            )
                          : '0'
                      }
                      statTitle={FM('actual-hours')}
                    />
                  </Col>
                </Show>
                <Show IF={isValid(patient?.id)}>
                  <Col>
                    <div className='text-small-12 text-dark text-capitalize pb-25 fw-bold mb-0'>
                      {patient?.name} -
                    </div>
                    <StatsHorizontal
                      className={'white small mb-0'}
                      icon={<HourglassEmptyOutlined size={30} />}
                      color='primary'
                      stats={
                        patientHours?.assigned_hours_per_day
                          ? viewInHours(patientHours?.assigned_hours_per_day)
                          : '0'
                      }
                      statTitle={FM('daily')}
                    />
                  </Col>
                  <Col>
                    <div className='text-small-12 text-dark text-capitalize pb-25 fw-bold mb-0'>
                      {patient?.name} -
                    </div>
                    <StatsHorizontal
                      className={'white small mb-0'}
                      icon={<ViewWeek size={30} />}
                      color='info'
                      stats={
                        patientHours?.assigned_hours_per_week
                          ? viewInHours(patientHours?.assigned_hours_per_week)
                          : '0'
                      }
                      statTitle={FM('weekly')}
                    />
                  </Col>
                  <Col>
                    <div className='text-small-12 text-dark text-capitalize pb-25 fw-bold mb-0'>
                      {patient?.name} -
                    </div>
                    <StatsHorizontal
                      className={'white small mb-0'}
                      icon={<Calendar size={30} />}
                      color='success'
                      stats={
                        patientHours?.assigned_hours_per_month
                          ? viewInHours(patientHours?.assigned_hours_per_month)
                          : '0'
                      }
                      statTitle={FM('monthly')}
                    />
                  </Col>
                  <Col>
                    <div className='text-small-12 text-dark text-capitalize pb-25 fw-bold mb-0'>
                      {patient?.name} -
                    </div>
                    <StatsHorizontal
                      className={'white small mb-0'}
                      icon={<HourglassEmptyOutlined size={30} />}
                      color='primary'
                      stats={
                        patientHours?.assigned_hours
                          ? viewInHours(patientHours?.assigned_hours)
                          : '0'
                      }
                      statTitle={FM('total')}
                    />
                  </Col>
                </Show>
              </Row>
            </div>
            <div className=''>
              <ButtonGroup className='btn-block'>
                <Button.Ripple
                  color='secondary'
                  onClick={(e) => handleClose('from-button')}
                  outline
                >
                  {FM('close')}
                </Button.Ripple>
                <LoadingButton loading={loading} color='primary' onClick={handleSubmit(onSubmit)}>
                  {FM('done')}
                </LoadingButton>
              </ButtonGroup>
            </div>
          </>
        }
      >
        <div className=''>
          <ScheduleFormTab
            templateId={templateId}
            setEmployeeView={setEmployeeView}
            setPatientView={setPatientView}
            setPatientHour={setPatientHours}
            getValues={getValues}
            setError={setError}
            loadingDetails={loadingDetails}
            watch={watch}
            setValue={setValue}
            edit={editData}
            control={control}
            errors={errors}
          />
        </div>
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default ScheduleModal
