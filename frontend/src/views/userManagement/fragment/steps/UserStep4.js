import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, CardBody, Col, Row } from 'reactstrap'
import { patientTypeListLoad } from '../../../../utility/apis/commons'
import { UserTypes, weekDays } from '../../../../utility/Const'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import {
  addDay,
  calculateTime,
  createSelectOptions,
  formatDate,
  toggleArray
} from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'
import Shimmer from '../../../components/shimmers/Shimmer'
import { isValidArray } from './../../../../utility/helpers/common'

const UserStep4 = ({
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
  //patient type
  const [patientType, setPatientType] = useState([])
  const [loadPatientType, setPatientTypeLoad] = useState(false)
  const [time, setTime] = useState(null)
  const [end, setEnd] = useState(null)

  const [weekDaysSelected, setWeekDaysSelected] = useState([])
  const [weekDaysSelectedCompany, setWeekDaysSelectedCompany] = useState([])

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
  //render weeks
  const renderWeeksCompany = () => {
    const re = []
    for (const [key, value] of Object.entries(weekDays)) {
      re.push(
        <>
          <Button.Ripple
            active={weekDaysSelectedCompany?.includes(value)}
            className='btn-icon rounded-circle active-dark text-small-12 text-nowrap p-0'
            outline
            color={errors?.hasOwnProperty('week_days') ? 'danger' : 'primary'}
            onClick={(e) => {
              toggleArray(value, weekDaysSelectedCompany, setWeekDaysSelectedCompany)
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
  const loadPatientTypeOption = () => {
    if (patientType.length <= 0) {
      patientTypeListLoad({
        loading: setPatientTypeLoad,
        success: (d) => {
          setPatientType(createSelectOptions(d?.payload, 'designation', 'id'))
        }
      })
    }
  }

  useEffect(() => {
    if (activeIndex === 3) {
      loadPatientTypeOption()
    }
  }, [activeIndex])

  useEffect(() => {
    if (isValidArray(edit?.company_week_days)) {
      setWeekDaysSelectedCompany(edit?.company_week_days)
    }
    if (isValidArray(edit?.institute_week_days)) {
      setWeekDaysSelected(edit?.institute_week_days)
    }
  }, [edit])

  useEffect(() => {
    if (isValidArray(weekDaysSelected)) {
      setValue('company_week_days', weekDaysSelected)
    }
    if (isValidArray(weekDaysSelectedCompany)) {
      setValue('institute_week_days', weekDaysSelectedCompany)
    }
  }, [weekDaysSelected, weekDaysSelectedCompany])
  

  // useEffect(() => {
  //     if (isValid(edit?.patient_information)) {
  //         setValue("from_timing", edit?.patient_information?.from_timing)
  //         setValue("to_timing", edit?.patient_information?.to_timing)
  //     }
  // }, [edit])
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
            <Show IF={userType === UserTypes.patient}>
              <Col md='12' className=''>
                <FormGroupCustom
                  label={'patient-type'}
                  type={'select'}
                  isMulti
                  // controlShouldRenderValue={false}
                  // hideSelectedOptions={false}
                  isOptionDisabled={(op, val) => {
                    // log(op, val)
                    //Hide Minor  if working || old
                    if (op?.value === 1) {
                      if (val?.find((a) => a.value === 4) || val?.find((a) => a.value === 3)) {
                        return true
                      }
                    }
                    // if (op?.value === 1) {
                    //     if (val?.find(a => a.value === 4)) {
                    //         return true
                    //     }
                    // }

                    //Hide OLd if Minor
                    if (op?.value === 4) {
                      if (val?.find((a) => a.value === 1)) {
                        return true
                      }
                    }
                    // if (op?.value === 2) {
                    //     if (val?.find(a => a.value === 4)) {
                    //         return true
                    //     }
                    // }
                    //Hide working If Minor
                    if (op?.value === 3) {
                      if (val?.find((a) => a.value === 1)) {
                        return true
                      }
                    }
                    //Hide minor if working
                    if (op?.value === 1) {
                      if (val?.find((a) => a.value === 3)) {
                        return true
                      }
                    }
                    //Hide working If not working
                    if (op?.value === 5) {
                      if (val?.find((a) => a.value === 3)) {
                        return true
                      }
                    }
                    //Hide not working if working
                    if (op?.value === 3) {
                      if (val?.find((a) => a.value === 5)) {
                        return true
                      }
                    }
                    // if (op?.value === 4) {
                    //     if (val?.find(a => a.value === 3)) {
                    //         return true
                    //     } if (val?.find(a => a.value === 3)) {
                    //         return true
                    //     }
                    // }
                    return false
                  }}
                  onChangeValue={(e) => {
                    log(e)
                    if (!e.includes(3)) {
                      setValue('company_name', null)
                      setValue('company_contact_person', null)
                      setValue('company_contact_number', null)
                      setValue('company_week_days', null)
                      setValue('from_timing', null)
                      setValue('to_timing', null)
                      setValue('company_full_address', null)
                    }
                    if (!e.includes(2)) {
                      setValue('institute_name', null)
                      setValue('institute_contact_person', null)
                      setValue('institute_contact_number', null)
                      setValue('institute_week_days', null)
                      setValue('classes_from', null)
                      setValue('classes_to', null)
                      setValue('institute_full_address', null)
                    }
                    // if (!e.includes(3) && !e.includes(2)) {
                    //     setValue('company_name', null)
                    //     setValue('company_contact_person', null)
                    //     setValue('company_contact_number', null)
                    //     setValue('company_week_days', null)
                    //     setValue('from_timing', null)
                    //     setValue('to_timing', null)
                    //     setValue('company_full_address', null)
                    //     setValue('institute_name', null)
                    //     setValue('institute_contact_person', null)
                    //     setValue('institute_contact_number', null)
                    //     setValue('institute_week_days', null)
                    //     setValue('classes_from', null)
                    //     setValue('classes_to', null)
                    //     setValue('institute_full_address', null)
                    // }
                  }}
                  values={edit}
                  defaultOptions
                  isClearable
                  control={control}
                  rules={{ required: false }}
                  errors={errors}
                  options={patientType}
                  name={'patient_type_id'}
                  className='mb-2'
                />
              </Col>
            </Show>
          </Row>
          {watch('patient_type_id') &&
          (watch('patient_type_id')?.includes(3) || watch('patient_type_id')?.includes('3')) ? (
            <>
              <div className='content-header mb-1'>
                <h5 className='mb-0'>{FM('company-details')}</h5>
                <small className='text-muted'>{FM('enter-company-details')}</small>
              </div>
              <Row>
                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('company-name')}
                    label={FM('company-name')}
                    name={'company_name'}
                    type={'text'}
                    errors={errors}
                    values={edit}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('contact-person')}
                    label={FM('contact-person')}
                    name={'company_contact_person'}
                    type={'text'}
                    errors={errors}
                    values={edit}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('company-phone')}
                    label={FM('company-phone')}
                    name={'company_contact_number'}
                    type={'number'}
                    errors={errors}
                    // values={edit}
                    value={String(edit?.company_contact_number).replaceAll(' ', '')}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
                <div className='content-header'>
                  <h5 className='mb-0'>{FM('weekdays')}</h5>
                </div>
                <Col md='12' xs='12' key={`${weekDaysSelected?.length}-days`}>
                  {renderWeeksCompany()}
                  <FormGroupCustom
                    noGroup
                    noLabel
                    type={'hidden'}
                    control={control}
                    errors={errors}
                    name={'company_week_days'}
                    className='d-none'
                    value={edit?.company_week_days}
                    rules={{ required: false }}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('working-from')}
                    label={FM('working-from')}
                    name={'from_timing'}
                    type='date'
                    defaultDate={new Date()}
                    disabled={isValid(edit?.from_timing)}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      time_24hr: true
                    }}
                    dateFormat={'YYYY-MM-DD HH:mm'}
                    errors={errors}
                    value={isValid(edit?.from_timing) ? new Date(edit?.from_timing) : ''}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('work-to')}
                    label={FM('work-to')}
                    name={'to_timing'}
                    type='date'
                    defaultDate={new Date(watch(`from_timing`) || new Date())}
                    disabled={isValid(edit?.to_timing)}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      time_24hr: true,
                      minDate: new Date(watch(`from_timing`))
                    }}
                    dateFormat={'YYYY-MM-DD HH:mm'}
                    errors={errors}
                    value={isValid(edit?.to_timing) ? new Date(edit?.to_timing) : ''}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>

                <Col md='12'>
                  <FormGroupCustom
                    placeholder={FM('company-address-other')}
                    label={FM('company-address-other')}
                    name={'company_full_address'}
                    type={'textarea'}
                    errors={errors}
                    values={edit}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
              </Row>
            </>
          ) : null}
          {watch('patient_type_id') &&
          (watch('patient_type_id')?.includes(2) || watch('patient_type_id')?.includes('2')) ? (
            <>
              <div className='content-header mb-1'>
                <h5 className='mb-0'>{FM('institute-details')}</h5>
                <small className='text-muted'>{FM('enter-institute-details')}</small>
              </div>
              <Row>
                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('institute-name')}
                    label={FM('institute-name')}
                    name={'institute_name'}
                    type={'text'}
                    errors={errors}
                    values={edit}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('contact-person')}
                    label={FM('contact-person')}
                    name={'institute_contact_person'}
                    type={'text'}
                    errors={errors}
                    values={edit}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>

                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('institute-phone')}
                    label={FM('institute-phone')}
                    name={'institute_contact_number'}
                    type={'number'}
                    errors={errors}
                    value={String(edit?.institute_contact_number).replaceAll(' ', '')}
                    className='mb-2'
                    control={control}
                    rules={{ required: false, maxLength: 12 }}
                  />
                </Col>
                <div className='content-header'>
                  <h5 className='mb-0'>{FM('weekdays')}</h5>
                </div>
                <Col md='12' xs='12' key={`${weekDaysSelected?.length}-days`}>
                  {renderWeeks()}
                  <FormGroupCustom
                    noGroup
                    noLabel
                    type={'hidden'}
                    control={control}
                    errors={errors}
                    name={'institute_week_days'}
                    className='d-none'
                    value={edit?.institute_week_days}
                    rules={{ required: false }}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('time-from')}
                    label={FM('time-from')}
                    name={'classes_from'}
                    type='date'
                    defaultDate={new Date()}
                    disabled={isValid(edit?.classes_from)}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      time_24hr: true
                    }}
                    dateFormat={'YYYY-MM-DD HH:MM'}
                    errors={errors}
                    value={isValid(edit?.classes_from) ? new Date(edit?.classes_from) : ''}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    placeholder={FM('time-to')}
                    label={FM('time-to')}
                    name={'classes_to'}
                    type='date'
                    defaultDate={new Date(watch(`classes_from`) || new Date())}
                    disabled={isValid(edit?.classes_to)}
                    options={{
                      enableTime: true,
                      noCalendar: true,
                      time_24hr: true,
                      minDate: new Date(watch(`classes_from`))
                    }}
                    dateFormat={'YYYY-MM-DD HH:mm'}
                    errors={errors}
                    value={isValid(edit?.classes_to) ? new Date(edit?.classes_to) : ''}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>

                <Col md='12'>
                  <FormGroupCustom
                    placeholder={FM('institute-address')}
                    label={FM('institute-address')}
                    name={'institute_full_address'}
                    type={'textarea'}
                    errors={errors}
                    values={edit}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
              </Row>
            </>
          ) : null}
        </>
      )}
    </div>
  )
}

export default UserStep4
