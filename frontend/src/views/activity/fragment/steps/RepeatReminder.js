import React, { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, ButtonGroup, Card, Col, InputGroupText, Row } from 'reactstrap'
import { monthDaysOptions, Patterns, repetitionType, weekDays } from '../../../../utility/Const'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import { createConstSelectOptions, timeConvert, toggleArray } from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'

const RepeatReminder = ({
  clearErrors = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors,
  setError = () => {}
}) => {
  useEffect(() => {
    if (watch('is_compulsory')) {
      setValue('remind_before_start', 1)
      setValue('before_is_push_notify', 1)
      setValue('before_is_text_notify', 1)
      setValue('after_is_text_notify', 1)
      setValue('after_is_push_notify', 1)
      setValue('emergency_is_text_notify', 1)
      setValue('emergency_is_push_notify', 1)
      setValue('before_minutes', 10)

      setValue('in_time_is_push_notify', 1)
      setValue('in_time_is_text_notify', 1)
      setValue('in_time', 1)
    } else {
      setValue('remind_before_start', edit?.remind_before_start ?? 0)
      setValue('before_is_push_notify', edit?.before_is_push_notify ?? 0)
      setValue('before_is_text_notify', edit?.before_is_text_notify ?? 0)
      setValue('before_minutes', edit?.before_minutes ?? '')

      setValue('in_time_is_push_notify', edit?.in_time_is_push_notify ?? 0)
      setValue('in_time_is_text_notify', edit?.in_time_is_text_notify ?? 0)
      setValue('in_time', edit?.in_time ?? 0)

      setValue('after_is_text_notify', edit?.after_is_text_notify ?? 0)
      setValue('after_is_push_notify', edit?.after_is_push_notify ?? 0)

      setValue('emergency_is_text_notify', edit?.emergency_is_text_notify ?? 0)
      setValue('emergency_is_push_notify', edit?.emergency_is_push_notify ?? 0)
    }
  }, [watch('is_compulsory')])

  useEffect(() => {
    if (isValid(watch('remind_before_start'))) {
      if (watch('remind_before_start') === 1) {
        setValue('before_is_push_notify', 1)
        if (isValid(watch('before_minutes'))) {
          clearErrors('before_minutes')
        } else {
          setError('before_minutes', { type: 'required' })
        }
        if (watch('before_is_push_notify') === 1) {
          clearErrors('before_is_text_notify')
        } else if (watch('before_is_text_notify') === 1) {
          clearErrors('before_is_push_notify')
        } else {
          setError('before_is_text_notify', { type: 'required' })
          setError('before_is_push_notify', { type: 'required' })
        }
      } else {
        setValue('before_is_push_notify', 0)
        setValue('before_minutes', '')
        clearErrors('before_minutes')
      }
    }
  }, [
    watch('remind_before_start'),
    watch('before_minutes'),
    watch('before_is_push_notify'),
    watch('before_is_text_notify')
  ])

  useEffect(() => {
    if (isValid(watch('in_time'))) {
      if (watch('in_time') === 1) {
        setValue('in_time_is_push_notify', 1)
        if (watch('in_time_is_push_notify') === 1) {
          clearErrors('in_time_is_text_notify')
        } else if (watch('in_time_is_text_notify') === 1) {
          clearErrors('in_time_is_push_notify')
        } else {
          setError('in_time_is_text_notify', { type: 'required' })
          setError('in_time_is_push_notify', { type: 'required' })
        }
      } else {
        setValue('in_time_is_push_notify', 0)
        setValue('before_minutes', '')
        clearErrors('before_minutes')
      }
    }
  }, [watch('in_time'), watch('in_time_is_push_notify'), watch('in_time_is_text_notify')])

  useEffect(() => {
    if (isValid(watch('remind_after_end'))) {
      if (watch('remind_after_end') === 1) {
        setValue('after_is_push_notify', 1)

        if (isValid(watch('after_minutes'))) {
          clearErrors('after_minutes')
        } else {
          setError('after_minutes', { type: 'required' })
        }
        if (watch('after_is_push_notify') === 1) {
          clearErrors('after_is_text_notify')
        } else if (watch('after_is_text_notify') === 1) {
          clearErrors('after_is_push_notify')
        } else {
          setError('after_is_text_notify', { type: 'required' })
          setError('after_is_push_notify', { type: 'required' })
        }
      } else {
        setValue('after_is_push_notify', 0)
        setValue('after_minutes', '')
        clearErrors('after_minutes')
      }
    }
  }, [
    watch('remind_after_end'),
    watch('after_minutes'),
    watch('after_is_push_notify'),
    watch('after_is_text_notify')
  ])

  useEffect(() => {
    if (isValid(watch('is_emergency'))) {
      if (watch('is_emergency') === 1) {
        setValue('emergency_is_push_notify', 1)
        if (isValid(watch('emergency_minutes'))) {
          clearErrors('emergency_minutes')
        } else {
          setError('emergency_minutes', { type: 'required' })
        }
        if (watch('emergency_is_push_notify') === 1) {
          clearErrors('emergency_is_text_notify')
        } else if (watch('emergency_is_text_notify') === 1) {
          clearErrors('emergency_is_push_notify')
        } else {
          setError('emergency_is_text_notify', { type: 'required' })
          setError('emergency_is_push_notify', { type: 'required' })
        }
      } else {
        setValue('emergency_is_push_notify', 0)
        setValue('emergency_minutes', '')
        clearErrors('emergency_minutes')
      }
    }
  }, [
    watch('is_emergency'),
    watch('emergency_minutes'),
    watch('emergency_is_push_notify'),
    watch('emergency_is_text_notify')
  ])

  const remind_before_start =
    watch('is_compulsory') === true ? 1 : watch('remind_before_start') ?? edit?.remind_before_start
  return (
    <>
      <div className='p-2' key={`loaded-${loadingDetails}`}>
        <Card className='p-2 shadow rounded'>
          <div className='content-header mb-1'>
            <h5 className='mb-0'>{FM('add-reminder')}</h5>
            <small className='text-muted'>{FM('add-reminder-details')}</small>
          </div>

          <Row key={`loaded-${loadingDetails}`}>
            <Col md='6' xs='12'>
              <FormGroupCustom
                key={`before-${edit?.remind_before_start}-${watch('remind_before_start')}`}
                prepend={
                  <InputGroupText>
                    <FormGroupCustom
                      noGroup
                      noLabel
                      tooltip={FM('enable')}
                      value={remind_before_start ?? ''}
                      type='checkbox'
                      disabled={watch('is_compulsory')}
                      name='remind_before_start'
                      label={FM('before-start')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                      rules={{ required: false }}
                    />
                  </InputGroupText>
                }
                value={watch('before_minutes') ?? edit?.remind_before_start}
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
                rules={{
                  required: false,
                  min: 1,
                  max: 240
                }}
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
                      // value={edit?.emergency_is_push_notify}
                      value={
                        watch('is_compulsory')
                          ? 1
                          : watch('before_is_push_notify') ?? edit?.before_is_push_notify
                      }
                      type='checkbox'
                      name='before_is_push_notify'
                      label={FM('remind-on-device')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                      disabled={watch('is_compulsory')}
                    />
                  </Col>
                  <Col md='12'>
                    <FormGroupCustom
                      tooltip={FM('enable')}
                      value={
                        watch('is_compulsory')
                          ? 1
                          : watch('before_is_text_notify') ?? edit?.before_is_text_notify
                      }
                      type='checkbox'
                      name='before_is_text_notify'
                      label={FM('remind-on-text')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                    />
                  </Col>
                </Row>
              </Show>
            </Col>
            <Col md='6' xs='12'>
              <FormGroupCustom
                prepend={
                  <InputGroupText>
                    <FormGroupCustom
                      noGroup
                      noLabel
                      disabled={watch('is_compulsory')}
                      tooltip={FM('enable')}
                      value={watch('is_compulsory') ? 1 : watch('in_time') ?? edit?.in_time}
                      //  value={edit?.in_time}
                      type='checkbox'
                      name='in_time'
                      errors={errors}
                      control={control}
                      rules={{ required: false }}
                    />
                  </InputGroupText>
                }
                type='number'
                label={'on-start'}
                className='mb-1'
                disabled={true}
                errors={errors}
                control={control}
              />
              <Show IF={watch('in_time')}>
                <p className='mb-1 text-primary fw-bold'>
                  {FM('you-will-be-reminded-immediately')}
                </p>
              </Show>
              <Show IF={watch('in_time') === 1}>
                <Row className='mt-1'>
                  <Col md='12'>
                    <FormGroupCustom
                      tooltip={FM('enable')}
                      value={
                        watch('is_compulsory')
                          ? 1
                          : watch('in_time_is_push_notify') ?? edit?.in_time_is_push_notify
                      }
                      type='checkbox'
                      name='in_time_is_push_notify'
                      label={FM('remind-on-device')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                      disabled={watch('is_compulsory')}
                    />
                  </Col>
                  <Col md='12'>
                    <FormGroupCustom
                      tooltip={FM('enable')}
                      value={
                        watch('is_compulsory')
                          ? 1
                          : watch('in_time_is_text_notify') ?? edit?.in_time_is_text_notify
                      }
                      type='checkbox'
                      name='in_time_is_text_notify'
                      label={FM('remind-on-text')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                    />
                  </Col>
                </Row>
              </Show>
            </Col>
            <Col md='6' xs='12'>
              <FormGroupCustom
                prepend={
                  <InputGroupText>
                    <FormGroupCustom
                      noGroup
                      noLabel
                      tooltip={FM('enable')}
                      value={watch('remind_after_end') ?? edit?.remind_after_end}
                      type='checkbox'
                      name='remind_after_end'
                      errors={errors}
                      control={control}
                    />
                  </InputGroupText>
                }
                value={watch('after_minutes') ?? edit?.after_minutes}
                placeholder={FM('time-in-minute')}
                type='number'
                message={FM('time-limit-reminder')}
                name='after_minutes'
                label={FM('after-end')}
                refreshInput={watch('remind_after_end') === 0}
                className='mb-1'
                disabled={!watch('remind_after_end')}
                errors={errors}
                control={control}
                rules={{ required: false, min: 1, max: 240 }}
              />
              <Show IF={isValid(watch('after_minutes'))}>
                <p className='mb-1 text-primary fw-bold text-small'>
                  {FM('you-will-be-reminded-after')} {timeConvert(watch('after_minutes'), FM)}
                </p>
              </Show>
              <Show IF={watch('remind_after_end') === 1}>
                <Row className='mt-1'>
                  <Col md='12'>
                    <FormGroupCustom
                      tooltip={FM('enable')}
                      value={watch('after_is_push_notify') ?? edit?.after_is_push_notify}
                      type='checkbox'
                      name='after_is_push_notify'
                      label={FM('remind-on-device')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                    />
                  </Col>
                  <Col md='12'>
                    <FormGroupCustom
                      tooltip={FM('enable')}
                      value={watch('after_is_text_notify') ?? edit?.after_is_text_notify}
                      type='checkbox'
                      name='after_is_text_notify'
                      label={FM('remind-on-text')}
                      className='mb-1'
                      errors={errors}
                      control={control}
                    />
                  </Col>
                </Row>
              </Show>
            </Col>
            <Show
              IF={
                watch('remind_before_start') === 1 ||
                watch('remind_after_end') === 1 ||
                watch('in_time') === 1
              }
            >
              <Col md='6'>
                <FormGroupCustom
                  prepend={
                    <InputGroupText>
                      <FormGroupCustom
                        noLabel
                        noGroup
                        tooltip={FM('enable')}
                        value={watch('is_emergency') ?? edit?.is_emergency}
                        type='checkbox'
                        name='is_emergency'
                        className='mb-1'
                        errors={errors}
                        control={control}
                      />
                    </InputGroupText>
                  }
                  value={watch('emergency_minutes') ?? edit?.emergency_minutes}
                  placeholder={FM('time-in-minute')}
                  type='number'
                  message={FM('time-limit-reminder')}
                  name='emergency_minutes'
                  label={FM('remind-on-emergency')}
                  refreshInput={watch('is_emergency') === 0}
                  className='mb-1'
                  disabled={!watch('is_emergency')}
                  errors={errors}
                  control={control}
                />
                <Show IF={isValid(watch('emergency_minutes'))}>
                  <p className='mb-1 text-primary fw-bold text-small'>
                    {FM('you-will-be-reminded-emergency')}{' '}
                    {timeConvert(watch('emergency_minutes'), FM)}
                  </p>
                </Show>
                <Show IF={watch('is_emergency') === 1}>
                  <Row>
                    <Col md='12'>
                      <FormGroupCustom
                        tooltip={FM('enable')}
                        value={watch('emergency_is_push_notify') ?? edit?.emergency_is_push_notify}
                        type='checkbox'
                        name='emergency_is_push_notify'
                        label={FM('on-device')}
                        className='mb-1'
                        errors={errors}
                        control={control}
                      />
                    </Col>
                    <Col md='12'>
                      <FormGroupCustom
                        tooltip={FM('enable')}
                        value={watch('emergency_is_text_notify') ?? edit?.emergency_is_text_notify}
                        type='checkbox'
                        name='emergency_is_text_notify'
                        label={FM('on-text')}
                        className='mb-1'
                        errors={errors}
                        control={control}
                      />
                    </Col>
                  </Row>
                </Show>
              </Col>
            </Show>
          </Row>
        </Card>
      </div>
    </>
  )
}

export default RepeatReminder
