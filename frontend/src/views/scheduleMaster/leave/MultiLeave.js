import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Button, ButtonGroup, Col, Form, Row } from 'reactstrap'
import {
  getWeeksDiff,
  leaveType,
  repetitionType,
  repetitionWeekDays,
  weekDays,
  weekRepetition
} from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import {
  addDay,
  calculateTime,
  createConstSelectOptions,
  enableFutureDates,
  formatDate,
  toggleArray
} from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'
import ShiftDays from './ShiftDays'

const MultiLeave = ({
  scArr = [],
  active = null,
  leave = null,
  ips = null,
  useFieldArray = () => {},
  editIpRes = null,
  ipRes = null,
  reLabel = null,
  getValues = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors,
  setError
}) => {
  const [time, setTime] = useState(null)
  const [end, setEnd] = useState(null)
  const [weekDaysSelected, setWeekDaysSelected] = useState([])
  const [dates, setDates] = useState([])
  const [key, setKey] = useState('sdsadsad')
  const dateRef = useRef()
  //render weeks

  const renderWeeks = () => {
    const re = []
    for (const [key, value] of Object.entries(repetitionWeekDays)) {
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

    return (
      <ButtonGroup className='mb-1'>
        <Button.Ripple
          active={weekDaysSelected?.length === 7}
          className='btn-icon rounded-circle active-dark text-small-12 text-nowrap p-0'
          outline
          color={errors?.hasOwnProperty('week_days') ? 'danger' : 'primary'}
          onClick={(e) => {
            if (weekDaysSelected?.length === 7) {
              setWeekDaysSelected([])
            } else {
              setWeekDaysSelected(['1', '2', '3', '4', '5', '6', '7'])
            }
          }}
          style={{ width: 40, height: 40, marginRight: 5 }}
        >
          {FM('all')}
        </Button.Ripple>
        {re}
      </ButtonGroup>
    )
  }
  useEffect(() => {
    if (watch('remind_before_start') === 0) {
      setValue('before_minutes', '')
    }
  }, [watch('remind_before_start')])

  const [count, setCount] = useState(1)

  const increaseCount = () => {
    if (count < 10) {
      setCount(count + 1)
    }
  }

  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1)
    }
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

  const [weekCount, setWeekCount] = useState(0)

  useEffect(() => {
    const startDt = isValid(watch('start_date')) ? new Date(watch('start_date')) : new Date()
    const endDt = isValid(watch('end_date')) ? new Date(watch('end_date')) : new Date()
    setWeekCount(getWeeksDiff(startDt, endDt))
  }, [watch('start_date'), watch('end_date')])

  log(weekCount)

  return (
    <Show IF={active === '2'}>
      <Fragment>
        {loadingDetails ? (
          <>
            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          </>
        ) : (
          <Form onSubmit={onSubmit}>
            <h6 className='text-primary glow'>{FM('red-dot denoted schedule in calendar')}</h6>
            <Row>
              <Col>
                <Col md='12'>
                  <FormGroupCustom
                    // key={`start-date-${edit?.repeat_datetime[i]?.start_date}`}
                    value={edit?.start_date}
                    placeholder={FM('start_date')}
                    type='date'
                    // options={{

                    //     enable: [function (date) { return enableFutureDates(date) }, edit?.start_date, new Date()]
                    // }}
                    options={{
                      // mode: "multiple",
                      minDate: 'today',
                      disable: isValidArray(leave) ? leave : [],
                      onDayCreate: (dObj, dStr, fp, dayElem) => {
                        const date = dayElem.dateObj
                        log(date)
                        // dummy logic
                        if (scArr?.includes(formatDate(date, 'YYYY-MM-DD'))) {
                          dayElem.innerHTML += "<span class='event busy'></span>"
                        }
                      }
                    }}
                    name='start_date'
                    label={FM('start-date')}
                    className='mb-1'
                    errors={errors}
                    dateRef={dateRef}
                    onMonthChange={(e) => setKey(new Date())}
                    control={control}
                    rules={{
                      required: false
                    }}
                    // rules={{ required: active === "2" }}
                  />
                </Col>
                {/* <ShiftDays getValues={getValues} setError = {setError} loadingDetails={loadingDetails} requiredEnabled={requiredEnabled}  watch={watch} setValue={setValue} control={control} errors={errors} /> */}
                <Col md='12'>
                  <FormGroupCustom
                    // key={`start-date-${edit?.repeat_datetime[i]?.start_date}`}
                    value={edit?.end_date}
                    placeholder={FM('end-date')}
                    type='date'
                    // options={{

                    //     enable: [function (date) { return enableFutureDates(date) }, edit?.start_date, new Date()]
                    // }}
                    options={{
                      // mode: "multiple",
                      // minDate: "today",
                      minDate: watch('start_date') ?? null,
                      disable: isValidArray(leave) ? leave : [],
                      onDayCreate: (dObj, dStr, fp, dayElem) => {
                        const date = dayElem.dateObj
                        log(date)
                        // dummy logic
                        if (scArr?.includes(formatDate(date, 'YYYY-MM-DD'))) {
                          dayElem.innerHTML += "<span class='event busy'></span>"
                        }
                      }
                    }}
                    name='end_date'
                    label={FM('end-date')}
                    // dateRef={dateRef}
                    // onMonthChange={e => setKey(new Date())}
                    errors={errors}
                    // className='mb-1'
                    control={control}
                    rules={{
                      required: false
                    }}
                    // rules={{ required: active === "2" }}
                  />
                </Col>

                <Col md='12' xs='12' key={`${weekDaysSelected?.length}-days`} className='mt-4'>
                  {renderWeeks()}
                  <FormGroupCustom
                    noGroup
                    noLabel
                    type={'hidden'}
                    control={control}
                    errors={errors}
                    name={'week_days'}
                    className='d-none mt-1'
                    value={edit?.week_days}
                    rules={{ required: false }}
                  />
                </Col>

                <Show IF={weekCount > 0}>
                  <Col md='12' className='mt-1'>
                    <FormGroupCustom
                      values={weekCount}
                      key={`every-${dates}`}
                      type={'select'}
                      control={control}
                      placeholder={FM(`max-week-accept-${weekCount}`)}
                      message={FM('how-many-week-repeat')}
                      name='every_week'
                      isClearable
                      errors={errors}
                      label={FM('every')}
                      max={weekCount}
                      isOptionDisabled={(op, val) => {
                        return weekCount + 1 <= op?.value
                      }}
                      rules={{ required: false, max: weekCount }}
                      options={createConstSelectOptions(weekRepetition, FM)}
                    />
                  </Col>
                </Show>

                <Col md='12' className='mt-2 mb-2'>
                  <FormGroupCustom
                    // values={weekCount}
                    // key={`every-${dates}`}
                    type={'select'}
                    control={control}
                    // placeholder={FM(`max-week-accept-${weekCount}`)}
                    // message={FM("choose-wether")}
                    name='leave_type'
                    isClearable
                    errors={errors}
                    label={FM('vacation-trip')}
                    options={createConstSelectOptions(leaveType, FM)}
                  />
                </Col>

                {watch('leave_type') === 'leave' ? (
                  <Col md='12'>
                    <FormGroupCustom
                      key={watch('leave_type')}
                      errors={errors}
                      placeholder='reason'
                      type='autocomplete'
                      rules={{ required: watch('leave_type') === 'leave' }}
                      name='reason'
                      control={control}
                    />
                  </Col>
                ) : (
                  ''
                )}

                {/* <Col md='6' className='mt-2'>
                                <FormGroupCustom
                                    placeholder="reason"
                                    type="textarea"
                                    name="reason"
                                    control={control}
                                    // rules={{ required: active === "2" }}
                                    rules={{ required: false }}
                                />
                            </Col> */}

                {/* <Col md="6">
                            <FormGroupCustom
                                label={FM("repetition-type")}
                                type={"select"}
                                control={control}
                                errors={errors}
                                name={"repetition_type"}
                                value={edit?.repetition_type}
                                day={time?.days}
                                isOptionDisabled={(op, val) => {
                                    // week
                                    if (op?.value === 2) {
                                        if (time?.days <= 7) {
                                            return true
                                        }
                                    }
                                    // month
                                    if (op?.value === 3) {
                                        if (time?.days <= 30) {
                                            return true
                                        }
                                    }
                                    // year
                                    if (op?.value === 4) {
                                        if (time?.days <= 365) {
                                            return true
                                        }
                                    }
                                    return false

                                }}
                                options={createConstSelectOptions(repetitionType, FM)}
                                rules={{ required: false }}
                            />
                        </Col>

                        <Col md="6" xs="12">
                            <FormGroupCustom
                                value={edit?.every}
                                key={`every-${watch("repetition_type")}`}
                                type="number"
                                name="every"
                                disabled={watch("repetition_type") === 3}
                                max={time?.days}
                                label={FM("every")}
                                placeholder={1}
                                message={FM("repetition-info", { day: time?.days })}
                                className='mb-2 with-select'
                                errors={errors}
                                control={control}
                                rules={{ required: true }}
                            />
                        </Col>
                         */}
              </Col>
              {/* <Col md="6">
                                <ShiftDays currentMonth={dateRef?.current?.flatpickr?.currentMonth} getValues={getValues} setError={setError} loadingDetails={loadingDetails} requiredEnabled={requiredEnabled} watch={watch} setValue={setValue} control={control} errors={errors} />
                            </Col> */}
            </Row>
          </Form>
        )}
      </Fragment>
    </Show>
  )
}

export default MultiLeave
