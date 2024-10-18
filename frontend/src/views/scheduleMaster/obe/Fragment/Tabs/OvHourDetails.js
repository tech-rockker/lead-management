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
import { getWeeksDiff, Patterns, repetitionType, weekDays } from '../../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'

import {
  addDay,
  calculateTime,
  createConstSelectOptions,
  enableFutureDates,
  SpaceTrim,
  toggleArray
} from '../../../../../utility/Utils'
import Show from '../../../../../utility/Show'
import Hide from '../../../../../utility/Hide'

const OvHourDetail = ({
  currentIndex = null,
  loadingDetails = false,
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

  //render weeks
  // const renderWeeks = () => {
  //     const re = []
  //     for (const [key, value] of Object.entries(weekDays)) {
  //         re.push(<>
  //             <Button.Ripple
  //                 active={weekDaysSelected?.includes(value)}
  //                 className='btn-icon rounded-circle active-dark text-small-12 text-nowrap p-0'
  //                 outline color={errors?.hasOwnProperty("week_days") ? 'danger' : 'primary'}
  //                 onClick={e => {
  //                     toggleArray(value, weekDaysSelected, setWeekDaysSelected)
  //                 }}
  //                 style={{ width: 40, height: 40, marginRight: 5 }}>
  //                 {FM(key)}
  //             </Button.Ripple>
  //         </>)
  //     }
  //     return <ButtonGroup className='mb-1'>
  //         {re}
  //     </ButtonGroup>
  // }

  useEffect(() => {
    if (isValid(edit)) {
      setValue('ob_type', edit?.ob_type)
    } else {
      setValue('ob_type', 'weekday')
    }
  }, [edit])

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
    setDates(watch('dates'))
    // if (watch("is_range")) {
    //     setWeekCount(getWeeksDiff(new Date(dates[0]), new Date(dates[1])))
    // }
  }, [watch('dates')])

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

  const findErrors = (name, index) => {
    let x = false
    if (errors && errors?.how_many_time_array && errors?.how_many_time_array[index]) {
      const a = errors?.how_many_time_array[index]
      x = a?.hasOwnProperty(name)
    }
    return x
  }
  // const startDt = isValidArray(dates) ? new Date(dates[0]) : new Date()
  // const endDt = isValidArray(dates) ? new Date(dates[1]) : new Date()
  const [weekCount, setWeekCount] = useState(0)
  useEffect(() => {
    const startDt = isValidArray(dates) ? new Date(dates[0]) : new Date()
    const endDt = isValidArray(dates) ? new Date(dates[1]) : new Date()
    setWeekCount(getWeeksDiff(startDt, endDt))
  }, [watch('dates'), weekCount, dates])

  log(weekCount)
  return (
    <>
      <div className='p-1'>
        <div className='p-0 mb-0 rounded'>
          <Hide IF={edit !== null}>
            <div md='12' className='mb-1'>
              {FM('obe-note')}
            </div>
          </Hide>
          <Row>
            <Col md='12'>
              <FormGroupCustom
                name={'ob_type'}
                type={'select'}
                errors={errors}
                label={FM('type')}
                className='mb-2'
                control={control}
                setValue={setValue}
                options={[
                  {
                    label: FM('weekday'),
                    value: 'weekday'
                  },
                  {
                    label: FM('weekend'),
                    value: 'weekend'
                  },
                  {
                    label: FM('red-day'),
                    value: 'red'
                  }
                ]}
                rules={{ required: true }}
                onChangeValue={(e) => {
                  setValue('dates', null)
                }}
                value={watch('ob_type')}
              />
            </Col>
            <Col md='12'>
              <FormGroupCustom
                name={'title'}
                type={'text'}
                errors={errors}
                label={FM('title')}
                className='mb-2'
                control={control}
                setValue={setValue}
                rules={{
                  required: true,
                  validate: (v) => {
                    return isValid(v) ? !SpaceTrim(v) : true
                  }
                }}
                value={edit?.title}
              />
            </Col>
            <Hide IF={watch('ob_type') === 'red'}>
              <Col md={6} className=''>
                <FormGroupCustom
                  key={`start-time`}
                  name={`start_time`}
                  type={'date'}
                  label={FM(`start-time`)}
                  options={{
                    enableTime: true,
                    noCalendar: true
                  }}
                  value={edit?.start_time}
                  dateFormat={'HH:mm'}
                  errors={errors}
                  className='mb-2'
                  setValue={setValue}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md={6} className=''>
                <FormGroupCustom
                  name={`end_time`}
                  type={'date'}
                  label={FM('end-time')}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    minDate: new Date(watch(`start_time`))
                  }}
                  dateFormat={'HH:mm'}
                  errors={errors}
                  className='mb-2'
                  setValue={setValue}
                  value={edit?.end_time}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
            </Hide>

            <Show IF={isValid(edit?.id) && !isValid(edit?.end_date)}>
              <Col md='6' className=''>
                <FormGroupCustom
                  type={'date'}
                  key={`re-dates`}
                  noGroup
                  options={{
                    enable: [
                      function (date) {
                        return enableFutureDates(date)
                      },
                      edit?.date,
                      new Date()
                    ]
                  }}
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  name={'date'}
                  value={edit?.date}
                  label={FM('select-date')}
                  rules={{ required: true }}
                />
              </Col>
            </Show>
          </Row>

          <Row>
            <Hide IF={isValid(edit?.id)}>
              <Col md='12' className=''>
                <FormGroupCustom
                  type={'date'}
                  key={`re-dates-${watch('ob_type')}`}
                  noGroup
                  options={{
                    disable: [
                      function (date) {
                        // return true to disable
                        return watch('ob_type') === 'weekend'
                          ? !(date.getDay() === 0 || date.getDay() === 6)
                          : false
                      }
                    ],

                    // showMonths: time?.days < 30 ? 1 : time?.days < 60 ? 1 : 1,
                    mode: 'multiple',
                    // inline: true,
                    // enable: [function (date) { return enableFutureDates(date) }, edit?.start_date, new Date()],
                    minDate: watch('start_date') ?? new Date(),
                    maxDate: end ?? null
                  }}
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  name={'dates'}
                  label={FM('select-dates')}
                  rules={{ required: true }}
                />
              </Col>
            </Hide>
          </Row>
        </div>
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
    </>
  )
}

export default OvHourDetail
