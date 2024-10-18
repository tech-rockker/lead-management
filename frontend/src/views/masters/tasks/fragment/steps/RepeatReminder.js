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
import { monthDaysOptions, Patterns, repetitionType, weekDays } from '../../../../../utility/Const'
import { FM, isValid, log } from '../../../../../utility/helpers/common'
import Show from '../../../../../utility/Show'
import {
  createConstSelectOptions,
  enableFutureDates,
  timeConvert,
  toggleArray
} from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import Repeater from '@components/repeater'

const RepeatReminder = ({
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
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

  return (
    <>
      <div className='p-2'>
        {/* <Card className='p-2 mb-1 shadow rounded'>
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
                                    options={createConstSelectOptions(repetitionType, FM)}
                                    label={FM("select-branch")}
                                    rules={{ required: false }}
                                />}
                                type="number"
                                name="every"
                                min="1"
                                max="99"
                                label={FM("repetition-type")}
                                placeholder={FM("1-99")}
                                message={FM("repetition-info")}
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
                                    options={
                                        {
                                            mode: "multiple"
                                        }
                                    }
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
                      value={edit?.emergency_is_push_notify}
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
                      value={edit?.emergency_is_text_notify}
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
            {/* <Col md="6" xs="12">
                        <FormGroupCustom
                            prepend={
                                <InputGroupText>
                                    <FormGroupCustom
                                        noGroup
                                        noLabel
                                        tooltip={FM("enable")}
                                        value={edit?.in_time}
                                        type="checkbox"
                                        name="in_time"
                                        errors={errors}
                                        control={control}
                                        rules={{ required: false }}
                                    />
                                </InputGroupText>}
                            type="number"
                            label={"on-start"}
                            className='mb-1'
                            disabled={true}
                            errors={errors}
                            control={control}
                            rules={{ required: false, min: 1, max: 240 }}
                        />
                        <Show IF={watch("in_time")}>
                            <p className='mb-1 text-primary fw-bold'>
                                {FM("you-will-be-reminded-immediately")}
                            </p>
                        </Show>
                        <Show IF={watch("in_time") === 1}>
                            <Row className='mt-1'>

                                <Col md="12">
                                    <FormGroupCustom
                                        tooltip={FM("enable")}
                                        value={edit?.emergency_is_push_notify}
                                        type="checkbox"
                                        name="in_time_is_push_notify"
                                        label={FM("remind-on-device")}
                                        className='mb-1'
                                        errors={errors}
                                        control={control}
                                        rules={{
                                            // required: watch("is_emergency"),
                                            validate: (d) => {
                                                if ((d === 0 || d === "") && (watch("in_time") === 1) && (watch("in_time_is_text_notify") === 0 || watch("in_time_is_text_notify") === "")) {
                                                    return false
                                                } else {
                                                    return true
                                                }
                                            }
                                        }}
                                    />
                                </Col>
                                <Col md="12">
                                    <FormGroupCustom
                                        tooltip={FM("enable")}
                                        value={edit?.emergency_is_text_notify}
                                        type="checkbox"
                                        name="in_time_is_text_notify"
                                        label={FM("remind-on-text")}
                                        className='mb-1'
                                        errors={errors}
                                        control={control}
                                        rules={{
                                            validate: (d) => {
                                                if ((d === 0 || d === "") && (watch("in_time") === 1) && (watch("in_time_is_push_notify") === 0 || watch("in_time_is_push_notify") === "")) {
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
                    <Col md="6" xs="12">
                        <FormGroupCustom
                            prepend={
                                <InputGroupText>
                                    <FormGroupCustom
                                        noGroup
                                        noLabel
                                        tooltip={FM("enable")}
                                        value={edit?.remind_after_end}
                                        type="checkbox"
                                        name="remind_after_end"
                                        errors={errors}
                                        control={control}
                                        rules={{ required: false }}
                                    />
                                </InputGroupText>}
                            value={edit?.after_minutes}
                            placeholder={FM("time-in-minute")}
                            type="number"
                            message={FM("time-limit-reminder")}
                            name="after_minutes"
                            label={FM("after-end")}
                            refreshInput={watch("remind_after_end") === 0}
                            className='mb-1'
                            disabled={!watch("remind_after_end")}
                            errors={errors}
                            control={control}
                            rules={{ required: watch("remind_after_end"), min: 1, max: 240 }}
                        />
                        <Show IF={isValid(watch("after_minutes"))}>
                            <p className='mb-1 text-primary fw-bold text-small'>
                                {FM("you-will-be-reminded-after")} {timeConvert(watch("after_minutes"), FM)}
                            </p>
                        </Show>
                        <Show IF={watch("remind_after_end") === 1}>
                            <Row className='mt-1'>

                                <Col md="12">
                                    <FormGroupCustom
                                        tooltip={FM("enable")}
                                        value={edit?.emergency_is_push_notify}
                                        type="checkbox"
                                        name="after_is_push_notify"
                                        label={FM("remind-on-device")}
                                        className='mb-1'
                                        errors={errors}
                                        control={control}
                                        rules={{
                                            // required: watch("is_emergency"),
                                            validate: (d) => {
                                                if ((d === 0 || d === "") && (watch("remind_after_end") === 1) && (watch("after_is_text_notify") === 0 || watch("after_is_text_notify") === "")) {
                                                    return false
                                                } else {
                                                    return true
                                                }
                                            }
                                        }}
                                    />
                                </Col>
                                <Col md="12">
                                    <FormGroupCustom
                                        tooltip={FM("enable")}
                                        value={edit?.emergency_is_text_notify}
                                        type="checkbox"
                                        name="after_is_text_notify"
                                        label={FM("remind-on-text")}
                                        className='mb-1'
                                        errors={errors}
                                        control={control}
                                        rules={{
                                            validate: (d) => {
                                                if ((d === 0 || d === "") && (watch("remind_after_end") === 1) && (watch("after_is_push_notify") === 0 || watch("after_is_push_notify") === "")) {
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
                    <Show IF={watch("remind_before_start") === 1 || watch("remind_after_end") === 1 || watch("in_time") === 1}>
                        <Col md="6">
                            <FormGroupCustom
                                prepend={
                                    <InputGroupText>
                                        <FormGroupCustom
                                            noLabel
                                            noGroup
                                            tooltip={FM("enable")}
                                            value={edit?.is_emergency}
                                            type="checkbox"
                                            name="is_emergency"
                                            className='mb-1'
                                            errors={errors}
                                            control={control}
                                            rules={{ required: false }}
                                        />
                                    </InputGroupText>}
                                value={edit?.after_minutes}
                                placeholder={FM("time-in-minute")}
                                type="number"
                                message={FM("time-limit-reminder")}
                                name="emergency_minutes"
                                label={FM("remind-on-emergency")}
                                refreshInput={watch("is_emergency") === 0}
                                className='mb-1'
                                disabled={!watch("is_emergency")}
                                errors={errors}
                                control={control}
                                rules={{ required: watch("is_emergency"), min: 1, max: 240 }}
                            />
                            <Show IF={isValid(watch("emergency_minutes"))}>
                                <p className='mb-1 text-primary fw-bold text-small'>
                                    {FM("you-will-be-reminded-emergency")} {timeConvert(watch("emergency_minutes"), FM)}
                                </p>
                            </Show>
                            <Show IF={watch("is_emergency") === 1}>
                                <Row>
                                    <Col md="12">
                                        <FormGroupCustom
                                            tooltip={FM("enable")}
                                            value={edit?.emergency_is_push_notify}
                                            type="checkbox"
                                            name="emergency_is_push_notify"
                                            label={FM("on-device")}
                                            className='mb-1'
                                            errors={errors}
                                            control={control}
                                            rules={{
                                                // required: watch("is_emergency"),
                                                validate: (d) => {
                                                    if ((d === 0 || d === "") && watch("is_emergency") === 1 && (watch("emergency_is_text_notify") === 0 || watch("emergency_is_text_notify") === "")) {
                                                        return false
                                                    } else {
                                                        return true
                                                    }
                                                }
                                            }}
                                        />
                                    </Col>
                                    <Col md="12">
                                        <FormGroupCustom
                                            tooltip={FM("enable")}
                                            value={edit?.emergency_is_text_notify}
                                            type="checkbox"
                                            name="emergency_is_text_notify"
                                            label={FM("on-text")}
                                            className='mb-1'
                                            errors={errors}
                                            control={control}
                                            rules={{
                                                validate: (d) => {
                                                    if ((d === 0 || d === "") && watch("is_emergency") === 1 && (watch("emergency_is_push_notify") === 0 || watch("emergency_is_push_notify") === "")) {
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
                    </Show> */}
          </Row>
        </Card>
      </div>
    </>
  )
}

export default RepeatReminder
