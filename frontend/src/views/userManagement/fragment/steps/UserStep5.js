import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, InputGroupText, Row, Button, ButtonGroup } from 'reactstrap'
import {
  monthDaysOptions,
  otherActivityTypes,
  Patterns,
  repetitionType,
  repetitionTypeForPatient,
  weekDays
} from '../../../../utility/Const'
import { FM, isValid, isValidArray } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import {
  addDay,
  calculateTime,
  createConstSelectOptions,
  enableFutureDates,
  formatDate,
  toggleArray
} from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'
import Shimmer from '../../../components/shimmers/Shimmer'

const UserStep5 = ({
  activeIndex = null,
  userType = null,
  createFor = null,
  setDisplay = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  const [time, setTime] = useState(null)
  const [end, setEnd] = useState(null)
  const [weekDaysSelected, setWeekDaysSelected] = useState([])

  //render weeks
  const renderWeeks = () => {
    const re = []
    for (const [key, value] of Object.entries(weekDays)) {
      re.push(
        <>
          <Button.Ripple
            active={weekDaysSelected?.includes(value)}
            className='btn-icon rounded-circle active-dark text-small-12 text-nowrap p-0'
            outline
            color={errors?.hasOwnProperty('week_days') ? 'danger' : 'primary'}
            onClick={(e) => {
              toggleArray(value, weekDaysSelected, setWeekDaysSelected)
            }}
            style={{ width: 40, height: 40, marginRight: 5 }}
          >
            {FM(key)}
          </Button.Ripple>
        </>
      )
    }
    return <ButtonGroup className='mb-1'>{re}</ButtonGroup>
  }

  useEffect(() => {
    const s = isValid(watch('start_date')) ? watch('start_date') : null
    if (s) {
      const e = isValid(watch('end_date')) ? watch('end_date') : addDay(watch('start_date'), 365)
      const getDiff = calculateTime(new Date(s), new Date(e))
      setEnd(e)
      if (getDiff) {
        setTime(getDiff)
      }
    }
  }, [watch('start_date')])

  useEffect(() => {
    const s = isValid(watch('start_date')) ? watch('start_date') : null
    if (s) {
      const e = isValid(watch('end_date')) ? watch('end_date') : addDay(watch('start_date'), 365)
      const getDiff = calculateTime(new Date(s), new Date(e))
      setEnd(e)
      if (getDiff) {
        setTime(getDiff)
      }
    }
  }, [watch('end_date')])

  useEffect(() => {
    if (isValidArray(edit?.week_days)) {
      setWeekDaysSelected(edit?.week_days)
    }
  }, [edit])

  useEffect(() => {
    if (isValidArray(weekDaysSelected)) {
      setValue('week_days', weekDaysSelected)
    }
  }, [weekDaysSelected])

  return (
    <div className='w-100 overflow-x-hidden p-2'>
      {loadingDetails ? (
        <Row>
          <Col md='12' className='d-flex align-items-stretch'>
            <Card>
              <CardBody className='p-0'>
                <Row>
                  <Col md='6'>
                    <Shimmer style={{ height: 40 }} />
                  </Col>
                  <Col md='6'>
                    <Shimmer style={{ height: 40 }} />
                  </Col>
                  <Col md='12' className='mt-2'>
                    <Shimmer style={{ height: 320 }} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            <Col md='12'>
              <FormGroupCustom
                label={'activity-type'}
                type={'select'}
                values={edit}
                defaultOptions
                isClearable
                control={control}
                rules={{ required: false }}
                errors={errors}
                options={createConstSelectOptions(otherActivityTypes, FM)}
                name={'another_activity'}
                className='mb-2'
              />
            </Col>

            <Col md='4'>
              <FormGroupCustom
                placeholder={FM('activity-name')}
                label={FM('name')}
                name={'another_activity_name'}
                type={'text'}
                key={`another_activity_name-${edit?.another_activity_name}`}
                errors={errors}
                values={edit}
                className='mb-2'
                control={control}
                rules={{ required: false }}
              />
            </Col>

            {/* <Col md="4">
                            <FormGroupCustom
                                placeholder={FM("contact-person")}
                                label={FM("contact-person")}
                                name={"another_activity_contact_person"}
                                type={"text"}
                                errors={errors}
                                key={`another_activity_contact_person-${edit?.another_activity_contact_person}`}
                                values={edit}
                                className="mb-2"
                                control={control}
                                rules={{ required: false }} />
                        </Col>
                        <Col md="4">
                            <FormGroupCustom
                                placeholder={FM("phone")}
                                label={FM("phone")}
                                name={"activitys_contact_number"}
                                type={"number"}
                                errors={errors}
                                key={`activitys_contact_number-${edit?.activitys_contact_number}`}
                                // values={edit}
                                value={edit?.activitys_contact_number ? String(edit?.activitys_contact_number).replaceAll(' ', '') : null}
                                className="mb-2"
                                control={control}
                                rules={{ required: false, maxLength: 12 }} />
                        </Col>
                        <Col md="12">
                            <FormGroupCustom
                                placeholder={FM("address")}
                                label={FM("address")}
                                name={"activitys_full_address"}
                                type={"textarea"}
                                errors={errors}
                                values={edit}
                                className="mb-2"
                                key={`activitys_full_address-${edit?.activitys_full_address}`}
                                control={control}
                                rules={{ required: false }} />
                        </Col> */}
            <div className='content-header'>
              <h5 className='mb-0'>{FM('select-days')}</h5>
            </div>
            <Col md='12' xs='12' key={`${weekDaysSelected?.length}-days`}>
              {renderWeeks()}
              <FormGroupCustom
                noGroup
                noLabel
                type={'hidden'}
                control={control}
                errors={errors}
                name={'week_days'}
                className='d-none'
                value={edit?.week_days}
                rules={{ required: false }}
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                // key={`another_activity_start_time`}
                placeholder={FM('start-time')}
                label={FM('start-time')}
                name={'another_activity_start_time'}
                type='date'
                defaultDate={watch('start_date')}
                disabled={isValid(edit?.another_activity_start_time)}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  time_24hr: true
                }}
                dateFormat={'YYYY-MM-DD HH:mm'}
                errors={errors}
                value={
                  isValid(edit?.another_activity_start_time)
                    ? new Date(edit?.another_activity_start_time)
                    : ''
                }
                className='mb-2'
                control={control}
                rules={{ required: false }}
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                placeholder={FM('end-time')}
                label={FM('end-time')}
                name={'another_activity_end_time'}
                type='date'
                defaultDate={new Date(watch(`another_activity_start_time`) || new Date())}
                disabled={isValid(edit?.another_activity_end_time)}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  time_24hr: true,
                  minDate: new Date(watch(`another_activity_start_time`))
                }}
                dateFormat={'YYYY-MM-DD HH:mm'}
                errors={errors}
                value={
                  isValid(edit?.another_activity_end_time)
                    ? new Date(edit?.another_activity_end_time)
                    : ''
                }
                className='mb-2'
                control={control}
                rules={{ required: false }}
              />
            </Col>
            <Col md='6'></Col>
          </Row>
        </>
      )}
    </div>
  )
}

export default UserStep5
