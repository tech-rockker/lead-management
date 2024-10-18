import React, { Fragment, useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Label, Row } from 'reactstrap'
import { getWeeksDiff, repetitionWeekDays, repetitionWeekend } from '../../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import Show from '../../../../../utility/Show'
import {
  addDay,
  calculateTime,
  enableFutureDates,
  SpaceTrim,
  toggleArray
} from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import Shimmer from '../../../../components/shimmers/Shimmer'

const OvHourRange = ({
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
  const [weekDaysSelected, setWeekDaysSelected] = useState(['1', '2', '3', '4', '5', '6', '0'])
  const [dates, setDates] = useState([])

  //render weeks
  const renderWeekend = () => {
    const re = []
    for (const [key, value] of Object.entries(repetitionWeekend)) {
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
          active={weekDaysSelected?.length === 2}
          className='btn-icon rounded-circle active-dark text-small-12 text-nowrap p-0'
          outline
          color={errors?.hasOwnProperty('week_days') ? 'danger' : 'primary'}
          onClick={(e) => {
            if (weekDaysSelected?.length === 2) {
              setWeekDaysSelected([])
            } else {
              setWeekDaysSelected(['6', '0'])
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
              setWeekDaysSelected(['1', '2', '3', '4', '5', '6', '0'])
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
    // if (isValidArray(weekDaysSelected)) {
    setValue('week_days', weekDaysSelected)
    // }
  }, [weekDaysSelected])

  const [weekCount, setWeekCount] = useState(0)

  useEffect(() => {
    const startDt = isValidArray(dates) ? new Date(dates[0]) : new Date()
    const endDt = isValidArray(dates) ? new Date(dates[1]) : new Date()
    setWeekCount(getWeeksDiff(startDt, endDt))
  }, [watch('dates'), weekCount, dates])

  useEffect(() => {
    if (isValid(edit)) {
      setValue('ob_type', edit?.ob_type)
    } else {
      setValue('ob_type', 'weekday')
    }
  }, [edit])
  log(dates?.length)
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
          <div className='p-1'>
            <div className='p-0 mb-1'>
              <Show IF={edit === null}>
                <div md='12' className='mb-1'>
                  {FM('obe-note')}
                </div>
              </Show>
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
                      value={watch('start_time')}
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
                      setValue={setValue}
                      type={'date'}
                      label={FM('end-time')}
                      // defaultDate={watch('start_date')}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        minDate: new Date(watch(`start_time`))
                      }}
                      dateFormat={'HH:mm'}
                      errors={errors}
                      className='mb-2'
                      value={watch('end_time')}
                      control={control}
                      rules={{ required: false }}
                      // value={edit?.how_many_time_array[i]?.end ? new Date(edit?.how_many_time_array[i]?.end) : ''}
                    />
                  </Col>
                </Hide>
                <Col md='12' className=''>
                  <FormGroupCustom
                    type={'date'}
                    key={`re-dates-${watch('ob_type')}`}
                    options={{
                      function(date) {
                        // return true to disable
                        return watch('ob_type') === 'weekend'
                          ? !(date.getDay() === 0 || date.getDay() === 6)
                          : false
                      },
                      //showMonths: time?.days < 30 ? 1 : time?.days < 60 ? 2 : 3,
                      mode: 'range',
                      enable: [
                        function (date) {
                          return enableFutureDates(date)
                        },
                        edit?.start_date,
                        new Date()
                      ],
                      minDate: watch('start_date') ?? new Date(),
                      maxDate: end ?? null
                    }}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    name={'dates'}
                    value={watch('dates')}
                    className='mb-2'
                    label={FM('select-date-range')}
                    rules={{ required: true }}
                  />
                </Col>
                {/* <Col md="6" >
                                    <FormGroupCustom
                                        values={weekCount}
                                        key={`every-${dates}`}
                                        type="number"
                                        name="every_week"
                                        //disabled={watch("every_week") > weekCount}
                                        // max={time?.days}
                                        label={FM("every-week")}
                                        placeholder={FM(`max-week-accept-${weekCount}`)}
                                        message={FM("how-many-week-repeat")}
                                        className='with-select'
                                        errors={errors}
                                        control={control}
                                        max={weekCount}
                                        rules={{ required: true, max: weekCount }}
                                    />
                                </Col> */}
                {/* </Show> */}
                <Col md='12' key={`${weekDaysSelected?.length}-days`} className='mt-0'>
                  <Label className='d-block'>{FM('select-week')}</Label>
                  {watch('ob_type') === 'weekend' ? renderWeekend() : renderWeeks()}
                  <FormGroupCustom
                    noGroup
                    noLabel
                    type={'hidden'}
                    control={control}
                    errors={errors}
                    name={'week_days'}
                    className='d-none '
                    value={edit?.week_days}
                    rules={{ required: true }}
                  />
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Fragment>
    </Show>
  )
}

export default OvHourRange
