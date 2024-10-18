import Repeater from '@components/repeater'
import React, { useEffect, useState } from 'react'
import { Minus, Plus } from 'react-feather'
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row
} from 'reactstrap'
import FormGroupCustom from '../../../../components/formGroupCustom'
import {
  getWeeksDiff,
  Patterns,
  repetitionType,
  repetitionWeekDays,
  UserTypes,
  weekDays
} from '../../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'

import {
  addDay,
  calculateTime,
  createAsyncSelectOptions,
  createConstSelectOptions,
  enableFutureDates,
  toggleArray
} from '../../../../../utility/Utils'
import { loadWorkShift, workShiftView } from '../../../../../utility/apis/companyWorkShift'
import { loadUser } from '../../../../../utility/apis/userManagement'
import CompanyTypeForm from './CompanyTypesForm'
import Show from '../../../../../utility/Show'
import Hide from '../../../../../utility/Hide'
const ScheduleRangeSelect = ({
  active,
  currentIndex = null,
  loadingDetails,
  ipData = null,
  requiredEnabled,
  watch,
  setValue,
  getValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  const [weekDaysSelected, setWeekDaysSelected] = useState([])
  const [time, setTime] = useState(null)
  const [end, setEnd] = useState(null)
  const [dates, setDates] = useState([])
  const [shift, setShift] = useState([])

  const [loading, setLoading] = useState(false)

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
    if (watch('repetition_type') === 1 || watch('repetition_type') === 4) {
      setValue('week_days', null)
      setValue('month_day', null)
    }
    if (watch('repetition_type') === 2) {
      setValue('month_day', null)
    }
    if (watch('repetition_type') === 3) {
      setValue('week_days', null)
    }
  }, [watch('repetition_type')])

  useEffect(() => {
    setValue('week_days', weekDaysSelected)
  }, [weekDaysSelected])

  useEffect(() => {
    setDates(watch('shift_dates'))
    // if (watch("is_range")) {
    //     setWeekCount(getWeeksDiff(new Date(dates[0]), new Date(dates[1])))
    // }
  }, [watch('shift_dates')])

  useEffect(() => {
    if (watch('remind_before_start') === 0) {
      setValue('before_minutes', '')
    }
  }, [watch('remind_before_start')])

  useEffect(() => {
    if (watch('remind_after_end') === 0) {
      setValue('after_minutes', '')
    }
  }, [watch('remind_after_end')])

  useEffect(() => {
    log('employees', watch('employees'))
  }, [watch('employees')])

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
  // useEffect(() => {
  //     log(watch('how_many_time_array'))
  // }, [watch("how_many_time_array")])

  //  const [count, setCount] = useState(1)

  // const increaseCount = () => {
  //     if (edit === null) {
  //         if (count < 10) {
  //             setCount(count + 1)
  //         }
  //     }
  // }

  // const decreaseCount = () => {
  //     if (count > 1) {
  //         setCount(count - 1)
  //     }
  // }

  // useEffect(() => {
  //     setValue("how_many_time", count)
  // }, [count])

  // const startDt = isValidArray(dates) ? new Date(dates[0]) : new Date()
  // const endDt = isValidArray(dates) ? new Date(dates[1]) : new Date()

  const [weekCount, setWeekCount] = useState(0)
  useEffect(() => {
    const startDt = isValidArray(dates) ? new Date(dates[0]) : new Date()
    const endDt = isValidArray(dates) ? new Date(dates[1]) : new Date()
    setWeekCount(getWeeksDiff(startDt, endDt))
  }, [watch('shift_dates'), weekCount, dates])

  return (
    <>
      <Show IF={active === '2'}>
        <div className='p-2'>
          <Row>
            {/* <Col md="12" xs="12">
                            <FormGroupCustom
                                key={`is_repeat-${edit?.is_repeat}`}
                                value={edit?.is_repeat}
                                placeholder={FM("enable-repetition")}
                                type="checkbox"
                                name="is_repeat"
                                label={FM("enable-repetition")}
                                className='mb-1'
                                errors={errors}
                                control={control}
                                rules={{ required: false }}
                            />
                        </Col> */}
            <Col md='6' className=''>
              <FormGroupCustom
                type={'date'}
                key={`re-dates`}
                options={{
                  //showMonths: time?.days < 30 ? 1 : time?.days < 60 ? 2 : 3,
                  mode: 'range',
                  enable: [
                    function (date) {
                      return enableFutureDates(date)
                    },
                    edit?.start_date,
                    new Date()
                  ]
                  //   minDate: watch("start_date") ?? null,
                  // maxDate: end ?? null
                }}
                control={control}
                errors={errors}
                setValue={setValue}
                name={'shift_dates'}
                value={edit?.date}
                label={FM('select-date-range')}
                rules={{ required: true }}
              />
            </Col>
            {/* <Col md="3">
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
                            </Col> */}
            {/* <Show IF={watch("repetition_type") === 2}> */}
            <Col md='6'>
              <FormGroupCustom
                values={weekCount}
                key={`every-${dates}`}
                type='number'
                name='every_week'
                //disabled={watch("every_week") > weekCount}
                // max={time?.days}
                label={FM('every-week')}
                placeholder={FM(`max-week-accept-${weekCount}`)}
                message={FM('how-many-week-repeat')}
                className='with-select'
                errors={errors}
                control={control}
                max={weekCount}
                rules={{ required: false, max: weekCount }}
              />
            </Col>
            {/* </Show> */}
            <Col md='12' key={`${weekDaysSelected?.length}-days`} className='mt-2'>
              {renderWeeks()}
              <FormGroupCustom
                noGroup
                noLabel
                type={'hidden'}
                control={control}
                errors={errors}
                name={'week_days'}
                className='d-none '
                value={edit?.week_days}
                rules={{ required: false }}
              />
            </Col>
            {/* <Col md="12" xs="12" >
                        <FormGroupCustom
                            key={`is_range-${edit?.is_range}`}
                            value={edit?.is_range}
                            placeholder={FM("sleep-emergency")}
                            type="checkbox"
                            name="is_range"
                            label={FM("sleep-emergency")}
                            className='mb-2'
                            errors={errors}
                            control={control}
                            rules={{ required: false }}
                        />
                    </Col> */}
          </Row>

          {/* <Card className='p-2 shadow rounded'>
                   
                </Card> */}
          {/* {JSON.stringify(watch('how_many_time_array'))} */}

          {/* <Card>
                    <div className='shadow p-2'>
                        <Row>
                            <Col md="12" className=''>
                               
                                <div className='content-header mb-2'>
                                    <h5 className='mb-0'>{FM("start-time-and-end-time")}</h5>
                                    <small className='text-muted'>{FM("enter-time")}</small>
                                </div>
                            </Col>
                          
                        </Row>
                    </div>
                </Card> */}
        </div>
      </Show>
    </>
  )
}

export default ScheduleRangeSelect
