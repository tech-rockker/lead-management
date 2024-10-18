// ** Custom Components
import React, { useEffect, useState } from 'react'
import { Clock, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { addWorkShift, editWorkShift } from '../../../utility/apis/companyWorkShift'
import { ShiftType } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import {
  addDay,
  createConstSelectOptions,
  ErrorToast,
  formatDate,
  getExactTime,
  isObjEmpty,
  setValues,
  viewInHours
} from '../../../utility/Utils'
import StatsHorizontal from '../../components/cards/HoriStatCard'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const WorkShiftModal = ({
  shift_type = null,
  ips = null,
  responseData = () => {},
  edit = null,
  editIpRes = null,
  noView = false,
  ipRes = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  followId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  // Dispatch
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [open, setOpen] = useState(null)
  const [time, setTime] = useState(null)

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

  const fields = {
    rest_end_time: '',
    rest_start_time: '',
    shift_color: '',
    shift_end_time: '',
    shift_name: '',
    shift_start_time: '',
    shift_type: ''
  }

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
  }

  useEffect(() => {
    handleToggle(open)
  }, [open])

  useEffect(() => {
    if (isValid(edit)) {
      setValues(fields, edit, setValue)
    }
  }, [edit])

  useEffect(() => {
    let endRest = isValid(watch('rest_end_time'))
      ? `${formatDate(new Date(), 'YYYY-MM-DD')} ${watch('rest_end_time')}`
      : null
    const startRest = isValid(watch('rest_start_time'))
      ? `${formatDate(new Date(), 'YYYY-MM-DD')} ${watch('rest_start_time')}`
      : null

    let end = isValid(watch('shift_end_time'))
      ? `${formatDate(new Date(), 'YYYY-MM-DD')} ${watch('shift_end_time')}`
      : null
    const start = isValid(watch('shift_start_time'))
      ? `${formatDate(new Date(), 'YYYY-MM-DD')} ${watch('shift_start_time')}`
      : null
    if (new Date(end).getTime() <= new Date(start)) {
      end = isValid(watch('shift_end_time'))
        ? `${formatDate(addDay(new Date(), 1), 'YYYY-MM-DD')} ${watch('shift_end_time')}`
        : null
    }
    if (new Date(endRest).getTime() <= new Date(startRest)) {
      endRest = isValid(watch('rest_end_time'))
        ? `${formatDate(addDay(new Date(), 1), 'YYYY-MM-DD')} ${watch('rest_end_time')}`
        : null
    }
    const diff = getExactTime(start, end)
    const restdiff =
      isValid(watch('rest_start_time')) && isValid(watch('rest_end_time'))
        ? getExactTime(startRest ?? 0, endRest ?? 0)
        : { minutesTotal: 0 }

    const min = diff?.minutesTotal - restdiff?.minutesTotal
    log('durex', diff?.minutesTotal)
    setTime({
      diff,
      restdiff,
      min
    })
  }, [
    edit,
    watch('shift_start_time'),
    watch('shift_end_time'),
    watch('rest_end_time', watch('rest_start_time'))
  ])

  const handleSave = (data) => {
    if (edit && !isObjEmpty(edit)) {
      editWorkShift({
        jsonData: {
          ...edit,
          ...data
        },
        id: edit?.id,
        loading: setLoading,
        dispatch,
        success: (e) => {
          responseData(e?.payload)
          setOpen(false)
          handleModal(false)
          reset()
        },
        error: () => {
          ErrorToast('something-went-wrong')
        }
      })
    } else {
      log(data)
      addWorkShift({
        jsonData: {
          ...data,
          shift_type: shift_type ?? data?.shift_type,
          shift_color: !isValid(data?.shift_color) ? '#111111' : data?.shift_color,
          shift_end_time: data?.shift_end_time ?? null,
          shift_name: data?.shift_name ?? null,
          shift_start_time: data?.shift_start_time ?? null
        },
        loading: setLoading,
        dispatch,
        success: (e) => {
          responseData(e?.payload)
          setOpen(false)
          handleModal(false)
          reset()
        },
        error: () => {
          ErrorToast('something-went-wrong')
        }
      })
    }
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
    if (showModal) handleModal()
  }, [showModal])

  return (
    <>
      <CenteredModal
        scrollControl={false}
        title={edit ? FM('edit-work-shift') : FM('create-work-shift')}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-lg'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
        extraFooterComponent={
          <>
            <div className='flex-1 algin-items-center' key={watch('shift_start_time')}>
              <Row className='p-0 g-0'>
                <Col md='4'>
                  <StatsHorizontal
                    className={'white  small minus5 mb-0 me-2 border-end'}
                    icon={<Clock size={30} />}
                    color='primary'
                    stats={viewInHours(time?.diff?.minutesTotal)}
                    statTitle={FM('total-hours')}
                  />
                </Col>
                <Col md='4'>
                  <StatsHorizontal
                    className={'white small minus5 mb-0 me-2 border-end'}
                    icon={<Clock size={30} />}
                    color='primary'
                    stats={viewInHours(time?.restdiff?.minutesTotal)}
                    statTitle={FM('shift-rest')}
                  />
                </Col>
                <Col md='4'>
                  <StatsHorizontal
                    className={'white small minus5 mb-0  me-2 '}
                    icon={<Clock size={30} />}
                    color='primary'
                    stats={viewInHours(time?.min)}
                    statTitle={FM('shift-hours')}
                  />
                </Col>
              </Row>
            </div>
          </>
        }
      >
        <div className='p-1'>
          <Row>
            <Hide IF={isValid(shift_type)}>
              <Col md='6'>
                <FormGroupCustom
                  label={'shift-type'}
                  type={'select'}
                  value={edit?.shift_type}
                  control={control}
                  options={createConstSelectOptions(ShiftType, FM)}
                  name='shift_type'
                  className='mb-1'
                  rules={{ required: true }}
                />
              </Col>
            </Hide>
            <Col md='6'>
              <FormGroupCustom
                value={edit?.shift_name}
                placeholder={FM('shift-name')}
                type='text'
                name='shift_name'
                label={FM('title')}
                className='mb-1'
                control={control}
                rules={{ required: true }}
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                // key={watch("shift_start_time")}
                value={edit?.shift_start_time}
                type='date'
                name='shift_start_time'
                label={FM('start-time')}
                className='mb-1'
                isClearable
                options={{
                  enableTime: true,
                  noCalendar: true
                }}
                setValue={setValue}
                dateFormat={'HH:mm'}
                errors={errors}
                control={control}
                rules={{ required: true, minLength: 3 }}
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                // key={watch("shift_end_time")}
                value={edit?.shift_end_time}
                type='date'
                name='shift_end_time'
                label={FM('end-time')}
                className='mb-1'
                isClearable
                options={{
                  enableTime: true,
                  noCalendar: true
                }}
                setValue={setValue}
                dateFormat={'HH:mm'}
                errors={errors}
                control={control}
                message={'min length is 30 minute more to shift-start-time'}
                rules={{ required: true, minLength: 3 }}
              />
            </Col>

            <Col md='6'>
              <FormGroupCustom
                value={edit?.rest_start_time}
                type='date'
                name='rest_start_time'
                label={FM('rest-start-time')}
                className='mb-1'
                isClearable
                options={{
                  enableTime: true,
                  noCalendar: true
                }}
                setValue={setValue}
                dateFormat={'HH:mm'}
                errors={errors}
                control={control}
                rules={{ required: false, minLength: 3 }}
              />
            </Col>

            <Col md='6'>
              <FormGroupCustom
                value={edit?.rest_end_time}
                type='date'
                name='rest_end_time'
                label={FM('rest-end-time')}
                className='mb-1'
                isClearable
                options={{
                  enableTime: true,
                  noCalendar: true
                }}
                setValue={setValue}
                dateFormat={'HH:mm'}
                errors={errors}
                control={control}
                rules={{ required: false, minLength: 3 }}
              />
            </Col>

            <Col md='12'>
              <FormGroupCustom
                value={edit?.shift_color}
                type={'color'}
                name='shift_color'
                label={FM('shift-color')}
                errors={errors}
                control={control}
                rules={{ required: false }}
              />
            </Col>
          </Row>
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

export default WorkShiftModal
