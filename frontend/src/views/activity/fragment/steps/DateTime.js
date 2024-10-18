import Repeater from '@components/repeater'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Minus, Plus } from 'react-feather'
import { Button, ButtonGroup, Card, Col, Input, InputGroup, Label, Row } from 'reactstrap'
import { repetitionType, weekDays, weekDays2 } from '../../../../utility/Const'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import {
  addDay,
  calculateTime,
  createConstSelectOptions,
  enableFutureDates,
  formatDate,
  toggleArray
} from '../../../../utility/Utils'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import FormGroupCustom from '../../../components/formGroupCustom'

const DateTime = ({
  clearErrors = () => {},
  user = null,
  currentIndex = null,
  loadingDetails = false,
  ipData = null,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  const [weekDaysSelected, setWeekDaysSelected] = useState([])
  const [time, setTime] = useState(null)
  const [end, setEnd] = useState(null)
  const [id, setId] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [editData, setEditData] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patient, setPatient] = useState([])

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
  // log(ipData, 'ipData')
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
      if (isValid(watch('end_date')) && isValid(watch('start_date'))) {
        // check if start date is greater than end date
        if (
          new Date(`${watch('start_date')} 00:00:00`) > new Date(`${watch('end_date')} 00:00:00`)
        ) {
          setValue('end_date', '')
        }
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
    log(watch('how_many_time_array'))
  }, [watch('how_many_time_array')])

  const [count, setCount] = useState(1)

  const increaseCount = () => {
    if (edit === null) {
      if (count < 10) {
        setCount(count + 1)
      }
    }
  }

  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1)
      const prev = watch('how_many_time_array') ?? []
      prev?.pop()
      log(prev)
      setValue('how_many_time_array', [...prev])
    }
  }

  useEffect(() => {
    setValue('how_many_time', count)
  }, [count])

  const findErrors = (name, index) => {
    let x = false
    if (errors && errors?.how_many_time_array && errors?.how_many_time_array[index]) {
      const a = errors?.how_many_time_array[index]
      x = a?.hasOwnProperty(name)
    }
    return x
  }

  useEffect(() => {
    if (isValid(edit)) {
      setValue('date_update_series', 0)
    }
  }, edit)
  useEffect(() => {
    if (isValid(ipData)) {
      if (!isValid(edit)) {
        setValue('start_date', ipData?.start_date)
        setValue('end_date', ipData?.end_date)
      }
    }
  }, [ipData, edit])

  return (
    <>
      <div className='p-2'>
        <Hide
          IF={
            !isValid(edit?.patient?.patient_information?.institute_name) ||
            !isValid(edit?.patient?.patient_information?.company_name)
          }
        >
          <Card className='p-2 mb-2 shadow rounded'>
            <div className='content-header mb-2'>
              <h5 className='mb-0'>{FM('patient-info')}</h5>
              <small className='text-muted'>{FM('other-act')}</small>
            </div>
            <div className=''>
              <Row>
                <Hide IF={!isValid(edit?.patient?.patient_information?.institute_name)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('institute-name')}</div>
                      <p className=''> {edit?.patient?.patient_information?.institute_name} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.institute_contact_person)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('contact-person')}</div>
                      <p className=''>
                        {' '}
                        {edit?.patient?.patient_information?.institute_contact_person}{' '}
                      </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.institute_contact_number)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('institute-phone')}</div>
                      <p className=''>
                        {' '}
                        {edit?.patient?.patient_information?.institute_contact_number}{' '}
                      </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.institute_full_address)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('institute-address')}</div>
                      <p className=''>
                        {' '}
                        {edit?.patient?.patient_information?.institute_full_address}{' '}
                      </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.classes_from)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('time-from')}</div>
                      <p className=''> {edit?.patient?.patient_information?.classes_from} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.classes_to)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('time-to')}</div>
                      <p className=''> {edit?.patient?.patient_information?.classes_to} </p>
                    </div>
                  </Col>
                </Hide>
              </Row>
              <hr className='mt-0 mb-2' />
              <Row className=''>
                <Hide IF={!isValid(edit?.patient?.patient_information?.company_name)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('company-name')}</div>
                      <p className=''> {edit?.patient?.patient_information?.company_name} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.company_contact_person)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('contact-person')}</div>
                      <p className=''>
                        {' '}
                        {edit?.patient?.patient_information?.company_contact_person}{' '}
                      </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.company_contact_number)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('company-phone')}</div>
                      <p className=''>
                        {' '}
                        {edit?.patient?.patient_information?.company_contact_number}{' '}
                      </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.company_full_address)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('company-address')}</div>
                      <p className=''>
                        {' '}
                        {edit?.patient?.patient_information?.company_full_address}{' '}
                      </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.from_timing)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('working-from')}</div>
                      <p className=''> {edit?.patient?.patient_information?.from_timing} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(edit?.patient?.patient_information?.to_timing)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('work-to')}</div>
                      <p className=''> {edit?.patient?.patient_information?.to_timing} </p>
                    </div>
                  </Col>
                </Hide>
              </Row>
            </div>
          </Card>
        </Hide>
        <Card className='p-2 mb-2 shadow rounded'>
          <div className='content-header mb-2'>
            <h5 className='mb-0'>{FM('date-&-time')}</h5>
            <small className='text-muted'>{FM('add-date-&-time')}</small>
          </div>
          {/* <Col md="4" > */}

          <Row>
            <Col md='4'>
              <FormGroupCustom
                name={'start_date'}
                type={'date'}
                errors={errors}
                options={{
                  minDate: !isValid(edit)
                    ? isValid(ipData)
                      ? new Date(formatDate(ipData?.start_date, 'YYYY-MM-DD 00:00:00'))
                      : formatDate(new Date(), 'YYYY-MM-DD 00:00:00')
                    : formatDate(new Date(), 'YYYY-MM-DD 00:00:00'),
                  maxDate: !isValid(edit)
                    ? isValid(ipData?.end_date)
                      ? new Date(ipData?.end_date)
                      : null
                    : null
                }}
                label={FM('start-date')}
                className={classNames('mb-2', { 'pe-noned': isValid(edit) })}
                control={control}
                setValue={setValue}
                disabled={watch('date_update_series') === 0}
                // rules={{ required: requiredEnabled ? currentIndex === 1 : false }}
                rules={{ required: requiredEnabled }}
                value={watch('start_date')}
              />
            </Col>

            <Col md='4'>
              <FormGroupCustom
                name={'end_date'}
                type={'date'}
                errors={errors}
                options={{
                  // enable: [function (date) { return enableFutureDates(date) }, (edit?.end_date ? new Date(edit?.end_date) : new Date()), new Date()],
                  minDate: watch('start_date') ?? null,
                  maxDate: !isValid(edit)
                    ? isValid(ipData?.end_date)
                      ? new Date(ipData?.end_date)
                      : null
                    : null
                }}
                label={FM('end-date')}
                className={classNames('mb-2', { 'pe-noned': isValid(edit) })}
                control={control}
                setValue={setValue}
                disabled={watch('date_update_series') === 0}
                // max={formatDate(new Date(), "YYYY-MM-DD")}
                rules={{ required: false }}
                value={watch('end_date')}
              />
            </Col>

            <Col md='4' className='mb-2'>
              <Label className='form-label' for='basic-number-input'>
                {FM('how-many-days')}
              </Label>
              <FormGroupCustom
                control={control}
                noGroup
                noLabel
                type={'hidden'}
                value={count}
                name='how_many_time'
              />
              <InputGroup>
                <Hide IF={isValid(edit?.id)}>
                  <Button.Ripple
                    color={count === 1 ? 'secondary' : 'primary'}
                    className={count === 1 ? 'pointer-events-none' : ''}
                    outline
                    size='sm'
                    onClick={decreaseCount}
                  >
                    <Minus size={16} />
                  </Button.Ripple>
                </Hide>
                <Input
                  disabled={isValid(edit?.id)}
                  className={`${isValid(edit?.id) ? '' : 'text-center'}  pointer-events-none ${
                    edit === null ? 'border-primary' : 'border-secondarys'
                  } `}
                  value={count}
                />
                <Hide IF={isValid(edit?.id)}>
                  <Button.Ripple
                    color={edit === null ? 'primary' : 'secondary'}
                    className={edit !== null ? 'pointer-events-none' : ''}
                    size='sm'
                    outline
                    onClick={increaseCount}
                  >
                    <Plus size={16} />
                  </Button.Ripple>
                </Hide>
              </InputGroup>
            </Col>
            <Show IF={isValid(edit)}>
              <Row>
                <Col md='12' xs='12'>
                  <FormGroupCustom
                    key={`date_update_series-${edit?.date_update_series}`}
                    value={edit?.date_update_series}
                    placeholder={FM('change-series-date')}
                    type='checkbox'
                    name='date_update_series'
                    label={FM('change-series-date')}
                    className='mb-1'
                    errors={errors}
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
              </Row>
            </Show>
          </Row>
        </Card>
        {/* {JSON.stringify(watch('how_many_time_array'))} */}

        <Repeater count={count} className='row'>
          {(i) => (
            <Col md={count === 1 ? '12' : '6'} key={i} className='mb-2'>
              <div className='shadow p-2'>
                <Row>
                  <Col md='12' className=''>
                    {/* <Label>{FM("activity-time")} {(i + 1)}</Label> */}
                    <div className='content-header mb-2'>
                      <h5 className='mb-0'>
                        {FM('activity-time')} {i + 1}
                      </h5>
                      <small className='text-muted'>{FM('enter-time')}</small>
                    </div>
                  </Col>
                  <Col md={6} className=''>
                    <FormGroupCustom
                      key={`start-time-${i}`}
                      name={`how_many_time_array.${i}.start`}
                      type={'date'}
                      label={FM(`start-time`)}
                      defaultDate={watch('start_date')}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        time_24hr: true
                      }}
                      dateFormat={'YYYY-MM-DD HH:mm'}
                      error={findErrors('start', i)}
                      className='mb-2'
                      setValue={setValue}
                      control={control}
                      rules={{ required: requiredEnabled }}
                      value={
                        edit?.how_many_time_array[i]?.start
                          ? new Date(edit?.how_many_time_array[i]?.start)
                          : ''
                      }
                    />
                  </Col>
                  <Col md={6} className=''>
                    <FormGroupCustom
                      name={`how_many_time_array.${i}.end`}
                      type={'date'}
                      setValue={setValue}
                      label={FM('end-time')}
                      defaultDate={watch('start_date')}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        time_24hr: true,
                        minDate: new Date(watch(`how_many_time_array.${i}.start`))
                      }}
                      dateFormat={'YYYY-MM-DD HH:mm'}
                      errors={errors}
                      className='mb-2'
                      error={findErrors('end', i)}
                      control={control}
                      rules={{ required: false }}
                      value={
                        edit?.how_many_time_array[i]?.end
                          ? new Date(edit?.how_many_time_array[i]?.end)
                          : ''
                      }
                    />
                  </Col>
                </Row>
                <Show IF={isValid(edit)}>
                  <Row>
                    <Col md='12' xs='12'>
                      <FormGroupCustom
                        key={`time_update_series-${edit?.time_update_series}`}
                        value={edit?.time_update_series}
                        placeholder={FM('change-series-time')}
                        type='checkbox'
                        name='time_update_series'
                        label={FM('change-series-time')}
                        className='mb-1'
                        errors={errors}
                        control={control}
                        rules={{ required: false }}
                      />
                    </Col>
                  </Row>
                </Show>
              </div>
            </Col>
          )}
        </Repeater>

        <Hide IF={isValid(edit)}>
          <Card className='p-2 shadow rounded'>
            <div className='content-header mb-1'>
              <h5 className='mb-0'>{FM('add-repetition')}</h5>
              <small className='text-muted'>{FM('add-repetition-details')}</small>
            </div>
            <Row>
              <Col md='12' xs='12'>
                <FormGroupCustom
                  key={`is_repeat-${edit?.is_repeat}`}
                  value={edit?.is_repeat}
                  placeholder={FM('enable-repetition')}
                  type='checkbox'
                  name='is_repeat'
                  onChangeValue={(e) => {
                    if (e === false) {
                      clearErrors('repetition_type')
                      clearErrors('every')
                      clearErrors('repeat_dates')
                      setValue('repetition_type', null)
                      setValue('every', null)
                      setValue('repeat_dates', null)
                    }
                  }}
                  label={FM('enable-repetition')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>

              <Show IF={watch('is_repeat') === 1}>
                {/* <Col md='12' xs='12'>
                  <FormGroupCustom
                    value={edit?.time_update_series}
                    placeholder={FM('comment')}
                    type='autocomplete'
                    name='repetition_comment'
                    label={FM('comment')}
                    className='mb-2'
                    errors={errors}
                    control={control}
                    rules={{ required: false }}
                  />
                </Col> */}
                <Col md='3'>
                  <FormGroupCustom
                    label={FM('repetition-type')}
                    type={'select'}
                    control={control}
                    errors={errors}
                    name={'repetition_type'}
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
                    onChangeValue={() => {
                      clearErrors('every')
                      clearErrors('repeat_dates')
                    }}
                    options={createConstSelectOptions(repetitionType, FM)}
                    rules={{ required: requiredEnabled }}
                  />
                </Col>
                <Show IF={watch('repetition_type') === 1 || watch('repetition_type') === 2}>
                  <Col md='3' xs='12'>
                    <FormGroupCustom
                      value={edit?.every}
                      key={`every-${watch('repetition_type')}`}
                      type='number'
                      name='every'
                      // disabled={watch('repetition_type') !== 1}
                      max={time?.days}
                      label={FM('every')}
                      placeholder={1}
                      message={FM('repetition-info', {
                        day:
                          watch('repetition_type') === 2 ? Math.round(time?.days / 7) : time?.days
                      })}
                      className='mb-2 with-select'
                      errors={errors}
                      control={control}
                      rules={{ required: watch('repetition_type') === 1 }}
                    />
                  </Col>
                </Show>
                <Show IF={watch('repetition_type') === 2}>
                  <Col md='3' xs='12' className=''>
                    <Label>{FM('week')}</Label>
                    {renderWeeks()}
                  </Col>
                </Show>
                <Show IF={watch('repetition_type') !== 1 && watch('repetition_type') !== 2}>
                  <Col md='9' xs='12' className=''>
                    <FormGroupCustom
                      type={'date'}
                      key={`re-dates-${end}`}
                      options={{
                        showMonths: time?.days < 30 ? 1 : time?.days < 60 ? 2 : 2,
                        mode: 'multiple',
                        enable: [
                          function (date) {
                            return enableFutureDates(date)
                          },
                          edit?.start_date,
                          new Date()
                        ],
                        minDate: watch('start_date') ?? null,
                        maxDate: end ?? null
                      }}
                      control={control}
                      errors={errors}
                      setValue={setValue}
                      name={'repeat_dates'}
                      value={edit?.repeat_dates}
                      label={FM('select-day')}
                      rules={{ required: watch('repetition_type') !== 1 }}
                    />
                  </Col>
                </Show>
              </Show>
            </Row>
          </Card>
        </Hide>
      </div>
    </>
  )
}

export default DateTime
