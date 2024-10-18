import Repeater from '@components/repeater'
import React, { useEffect, useState } from 'react'
import { Minus, Plus } from 'react-feather'
import { Button, Card, Col, Input, InputGroup, InputGroupText, Label, Row } from 'reactstrap'
import { repetitionType } from '../../../../../utility/Const'
import Show from '../../../../../utility/Show'
import {
  addDay,
  calculateTime,
  createConstSelectOptions,
  enableFutureDates,
  timeConvert
} from '../../../../../utility/Utils'
import { FM, isValid } from '../../../../../utility/helpers/common'
import FormGroupCustom from '../../../../components/formGroupCustom'

const DateTime = ({
  clearErrors = () => {},
  currentIndex = null,
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

  return (
    <>
      <div className='p-2'>
        <Card className='p-2 mb-1 shadow rounded'>
          <div className='content-header mb-2'>
            <h5 className='mb-0'>{FM('date-time')}</h5>
            <small className='text-muted'>{FM('add-date-time')}</small>
          </div>
          <Row>
            <Col md='4'>
              <FormGroupCustom
                name={'start_date'}
                setValue={setValue}
                type={'date'}
                errors={errors}
                label={FM('start-date')}
                options={{
                  enable: [
                    function (date) {
                      return enableFutureDates(date)
                    },
                    new Date(edit?.start_date),
                    new Date()
                  ]
                }}
                className='mb-2'
                control={control}
                rules={{ required: true }}
                // rules={{ required: requiredEnabled ? currentIndex === 1 : false }}
                value={watch('start_date')}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                name={'end_date'}
                setValue={setValue}
                type={'date'}
                errors={errors}
                options={{
                  enable: [
                    function (date) {
                      return enableFutureDates(date)
                    },
                    edit?.end_date ? new Date(edit?.end_date) : new Date(),
                    new Date()
                  ],
                  minDate: watch('start_date') ?? null
                }}
                label={FM('end-date')}
                className='mb-2'
                control={control}
                rules={{ required: true }}
                value={watch('end_date')}
              />
            </Col>

            <Col md='4' className='mb-2'>
              <Label className='form-label' for='basic-number-input'>
                {FM('how-many-days')}
              </Label>
              <InputGroup>
                <FormGroupCustom
                  control={control}
                  noGroup
                  noLabel
                  type={'hidden'}
                  value={count}
                  name='how_many_time'
                />
                <Button.Ripple
                  color={count === 1 ? 'secondary' : 'primary'}
                  className={count === 1 ? 'pointer-events-none' : ''}
                  outline
                  size='sm'
                  onClick={decreaseCount}
                >
                  <Minus size={16} />
                </Button.Ripple>
                <Input className='text-center pointer-events-none border-primary' value={count} />
                <Button.Ripple color='primary' size='sm' outline onClick={increaseCount}>
                  <Plus size={16} />
                </Button.Ripple>
              </InputGroup>
            </Col>
          </Row>
        </Card>
        <Repeater count={count} className='row'>
          {(i) => (
            <Col md={count === 1 ? '12' : '6'} key={i} className='mb-1'>
              <div className='shadow p-2'>
                <Row>
                  <Col md='12' className=''>
                    <div className='content-header mb-1'>
                      <h5 className='mb-0'>
                        {FM('task-time')} {i + 1}
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
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        time_24hr: true
                      }}
                      dateFormat={'YYYY-MM-DD HH:mm'}
                      errors={errors}
                      className='mb-2'
                      setValue={setValue}
                      control={control}
                      rules={{ required: true }}
                      value={
                        isValid(edit?.how_many_time_array[i]?.start)
                          ? new Date(edit?.how_many_time_array[i]?.start)
                          : null
                      }
                    />
                  </Col>
                  <Col md={6} className=''>
                    <FormGroupCustom
                      name={`how_many_time_array.${i}.end`}
                      setValue={setValue}
                      type={'date'}
                      label={FM('end-time')}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        time_24hr: true,
                        minDate: isValid(watch(`how_many_time_array.${i}.start`))
                          ? new Date(watch(`how_many_time_array.${i}.start`))
                          : null
                      }}
                      m={watch(`how_many_time_array.${i}.start`)}
                      dateFormat={'YYYY-MM-DD HH:mm'}
                      errors={errors}
                      className='mb-2'
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
              </div>
            </Col>
          )}
        </Repeater>
        <Card className='p-2 mb-1 shadow rounded'>
          <div className='content-header mb-1'>
            <h5 className='mb-0'>{FM('add-reminder')}</h5>
            <small className='text-muted'>{FM('add-reminder-details')}</small>
          </div>
          <Row>
            <Col md='6' xs='12'>
              <FormGroupCustom
                prepend={
                  <InputGroupText>
                    <FormGroupCustom
                      noGroup
                      noLabel
                      tooltip={FM('enable')}
                      value={edit?.remind_before_start}
                      type='checkbox'
                      name='remind_before_start'
                      label={FM('before-start')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                      rules={{ required: false }}
                    />
                  </InputGroupText>
                }
                value={edit?.before_minutes}
                placeholder={FM('time-in-minute')}
                type='number'
                refreshInput={watch('remind_before_start') === 0}
                message={FM('time-limit-reminder')}
                name='before_minutes'
                label={FM('before-start')}
                className='mb-1'
                disabled={!watch('remind_before_start')}
                errors={errors}
                control={control}
                rules={{ required: watch('remind_before_start'), min: 1, max: 240 }}
              />
              <Show IF={isValid(watch('before_minutes'))}>
                <p className='mb-1 text-primary fw-bold'>
                  {FM('you-will-be-reminded-before')} {timeConvert(watch('before_minutes'), FM)}
                </p>
              </Show>
              <Show IF={watch('remind_before_start') === 1}>
                <Row className='mt-1'>
                  <Col md='12'>
                    <FormGroupCustom
                      tooltip={FM('enable')}
                      value={edit?.before_is_push_notify}
                      type='checkbox'
                      name='before_is_push_notify'
                      label={FM('remind-on-device')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                      rules={{
                        validate: (d) => {
                          if (
                            (d === 0 || d === '') &&
                            watch('remind_before_start') === 1 &&
                            (watch('before_is_text_notify') === 0 ||
                              watch('before_is_text_notify') === '')
                          ) {
                            return false
                          } else {
                            return true
                          }
                        }
                      }}
                    />
                  </Col>
                  <Col md='12'>
                    <FormGroupCustom
                      tooltip={FM('enable')}
                      value={edit?.before_is_text_notify}
                      type='checkbox'
                      name='before_is_text_notify'
                      label={FM('remind-on-text')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                      rules={{
                        validate: (d) => {
                          if (
                            (d === 0 || d === '') &&
                            watch('remind_before_start') === 1 &&
                            (watch('before_is_push_notify') === 0 ||
                              watch('before_is_push_notify') === '')
                          ) {
                            return false
                          } else {
                            return true
                          }
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Show>
            </Col>
          </Row>
        </Card>

        <Show IF={!isValid(edit)}>
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
                  label={FM('enable-repetition')}
                  className='mb-1'
                  errors={errors}
                  onChangeValue={(e) => {
                    if (e === false) {
                      clearErrors('every')
                      clearErrors('repeat_dates')
                    }
                  }}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>

              <Show IF={watch('is_repeat') === 1}>
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
                    options={createConstSelectOptions(repetitionType, FM)}
                    rules={{ required: false }}
                  />
                </Col>
                <Show IF={watch('repetition_type') === 1}>
                  <Col md='3' xs='12'>
                    <FormGroupCustom
                      value={edit?.every}
                      key={`every-${watch('repetition_type')}`}
                      type='number'
                      name='every'
                      disabled={watch('repetition_type') !== 1}
                      max={time?.days}
                      label={FM('every')}
                      placeholder={1}
                      message={FM('repetition-info', { day: time?.days })}
                      className='mb-2 with-select'
                      errors={errors}
                      control={control}
                      rules={{ required: watch('is_repeat') === 1 }}
                    />
                  </Col>
                </Show>
                <Show IF={isValid(watch('repetition_type')) && watch('repetition_type') !== 1}>
                  <Col md='6' xs='12' className=''>
                    <FormGroupCustom
                      setValue={setValue}
                      type={'date'}
                      key={`re-dates-${end}`}
                      options={{
                        showMonths: time?.days < 30 ? 1 : time?.days < 60 ? 2 : 3,
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
                      name={'repeat_dates'}
                      value={edit?.repeat_dates}
                      label={FM('select-day')}
                      rules={{ required: watch('is_repeat') === 1 }}
                    />
                  </Col>
                </Show>
              </Show>
            </Row>
          </Card>
        </Show>
        {/* 
            <Card className='p-2 shadow rounded'>
                <div className='content-header mb-1'>
                    <h5 className='mb-0'>{FM("add-repetition")}</h5>
                    <small className='text-muted'>{FM("add-repetition-details")}</small>
                </div>
                <Row>
                    <Col md="12" xs="12">
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
                    </Col>

                    <Show IF={watch("is_repeat") === 1}>
                        <Col md="6" xs="12">
                            <FormGroupCustom
                                value={edit?.every}
                                prepend={<InputGroupText>
                                    {FM("every")}
                                </InputGroupText>}
                                append={<FormGroupCustom
                                    noGroup
                                    noLabel
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
                                    label={FM("select-branch")}
                                    rules={{ required: false }}
                                />}
                                type="number"
                                name="every"
                                min="1"
                                disabled={watch("repetition_type") !== 1}
                                max={time?.days}
                                label={FM("repetition-type")}
                                placeholder={1}
                                message={FM("repetition-info", { day: time?.days })}
                                className='mb-2 with-select'
                                errors={errors}
                                control={control}
                                rules={{ required: (watch("is_repeat") === 1), min: 1, max: 99, pattern: Patterns.NumberOnlyNoDot }}
                            />
                        </Col>
                        <Show IF={watch("repetition_type") !== 1}>
                            <Col md="6" xs="12" className="">
                                <FormGroupCustom
                                    type={"date"}
                                    key={`re-dates-${end}`}
                                    options={{
                                        showMonths: time?.days < 30 ? 1 : time?.days < 60 ? 2 : 3,
                                        mode: "multiple",
                                        enable: [function (date) { return enableFutureDates(date) }, edit?.start_date, new Date()],
                                        minDate: watch("start_date") ?? null,
                                        maxDate: end ?? null
                                    }}
                                    control={control}
                                    errors={errors}
                                    setValue={setValue}
                                    name={"repeat_dates"}
                                    value={edit?.repeat_dates}
                                    label={FM("select-day")}
                                    rules={{ required: false }}
                                />
                            </Col>
                        </Show>
                    </Show>
                </Row>
            </Card> */}
      </div>
    </>
  )
}

export default DateTime
