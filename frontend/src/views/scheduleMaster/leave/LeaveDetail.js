import React, { createRef, Fragment, useEffect, useRef, useState } from 'react'
import { Col, Form, Row } from 'reactstrap'
import { leaveType } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { createConstSelectOptions, enableFutureDates, formatDate } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'
import ShiftDays from './ShiftDays'

const LeaveDetail = ({
  loadScheduleArr = () => {},
  scArr = [],
  active = null,
  ips = null,
  leave = null,
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
  const [leaves, setLeaves] = useState([])
  const [ref, setRef] = useState(null)
  const [key, setKey] = useState('sdsadsad')
  const dateRef = useRef()
  const makeLeaveGroup = () => {}
  useEffect(() => {
    if (dateRef.current?.flatpickr?.currentMonth) {
      loadScheduleArr(dateRef.current?.flatpickr?.currentMonth)
    }
  }, [dateRef.current?.flatpickr?.currentMonth])
  return (
    <Show IF={active === '1'}>
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
              {/* <Col md='6'> */}
              <Col md='6'>
                <FormGroupCustom
                  // key={`start-date-${key}`}
                  value={edit?.date}
                  placeholder={FM('dates')}
                  noGroup
                  // noLabel
                  errors={errors}
                  type='date'
                  options={{
                    inline: true,
                    mode: 'multiple',
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
                  classNameInput='d-none'
                  name='dates'
                  label={FM('select-date')}
                  // className='mb-1'
                  control={control}
                  dateRef={dateRef}
                  onMonthChange={(e) => setKey(new Date())}
                  // rules={{
                  //     required: false
                  // }}
                  rules={{ required: active === '1' }}
                />
              </Col>
              {/* <Show IF={isValid(dateRef.current)}> */}
              {/* <ShiftDays currentMonth={dateRef?.current?.flatpickr?.currentMonth} getValues={getValues} setError={setError} loadingDetails={loadingDetails} requiredEnabled={requiredEnabled} watch={watch} setValue={setValue} control={control} errors={errors} /> */}
              {/* </Show> */}
              {/* </Col> */}
              {/* {isValidArray(watch("dates")) ?  */}
              <Col md='12' className='mt-1'>
                {isValidArray(watch('dates')) ? (
                  <Col md='12'>
                    <FormGroupCustom
                      type={'select'}
                      control={control}
                      name='leave_type'
                      isClearable
                      errors={errors}
                      label={FM('vacation-trip')}
                      options={createConstSelectOptions(leaveType, FM)}
                    />
                    {/* <button onClick={(e) => {
                                        e.preventDefault()
                                        dateRef.current.flatpickr.changeMonth(9, false)
                                    }}>te</button> */}
                  </Col>
                ) : (
                  ''
                )}

                {/* : ""}  */}

                {watch('leave_type') === 'leave' ? (
                  <Col md='12' className='mt-1'>
                    <FormGroupCustom
                      key={watch('leave_type')}
                      errors={errors}
                      placeholder='reason'
                      type='autocomplete'
                      rules={{ required: active === '1' }}
                      name='reason'
                      control={control}
                    />
                  </Col>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Fragment>
    </Show>
  )
}

export default LeaveDetail
