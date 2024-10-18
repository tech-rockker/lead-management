import React, { useDebugValue, useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Col, Row } from 'reactstrap'
import { loadWorkShift, workShiftView } from '../../../../../utility/apis/companyWorkShift'
import { loadUser } from '../../../../../utility/apis/userManagement'
import { getWeeksDiff, UserTypes, weekDays } from '../../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import useUser from '../../../../../utility/hooks/useUser'
import Show from '../../../../../utility/Show'
import {
  addDay,
  calculateTime,
  createAsyncSelectOptions,
  createSelectOptions,
  enableFutureDates,
  jsonDecodeAll,
  toggleArray
} from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import Shimmer from '../../../../components/shimmers/Shimmer'
import Header from '../../../../header'
import CompanyTypeForm from './CompanyTypesForm'

const ScheduleDetail = ({
  active,
  watch,
  setValue,
  getValue,
  edit,
  onSubmit,
  control,
  errors,
  loadingDetails
}) => {
  const user = useUser()
  const [weekDaysSelected, setWeekDaysSelected] = useState([])
  const [time, setTime] = useState(null)
  const [loading, setLoading] = useState(false)
  const [end, setEnd] = useState(null)
  const [dates, setDates] = useState([])

  const [patient, setPatient] = useState([])

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
  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setPatient)
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

  return (
    <>
      {loadingDetails ? (
        <>
          {' '}
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5, marginTop: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
        </>
      ) : (
        <>
          <Show IF={active === '1' || isValid(edit?.id)}>
            <div className='p-1'>
              <Row>
                <Show IF={isValid(edit?.id)}>
                  <Col md='6' className='mb-2'>
                    <FormGroupCustom
                      type={'date'}
                      key={`re-dates`}
                      noGroup
                      options={
                        {
                          // showMonths: time?.days < 30 ? 1 : time?.days < 60 ? 2 : 2,
                          // mode: "multiple",
                          // inline: true,
                          // enable: [function (date) { return enableFutureDates(date) }, edit?.start_date, new Date()],
                          // minDate: watch("start_date") ?? null,
                          // maxDate: end ?? null
                        }
                      }
                      control={control}
                      errors={errors}
                      setValue={setValue}
                      name={'shift_date'}
                      value={edit?.shift_date}
                      label={FM('select-dates')}
                      rules={{ required: false }}
                    />
                  </Col>
                </Show>
                {/* <Col md="6">
                            <FormGroupCustom
                                key={`${edit?.shift_id}-company_id`}
                                type={"select"}
                                control={control}
                                errors={errors}
                                name={"company_type"}
                                defaultOptions
                              //  matchWith="id"
                                // async
                                cacheOptions
                              //  loadOptions={createSelectOptions(user?.company_types, "name", "id")}
                                value={edit?.patient_id}
                                options={createSelectOptions(user?.company_types, "name", "id")}
                                label={FM("company-type")}
                                rules={{ required: false }}
                                className='mb-1'
                            />
                        </Col> */}

                {/* <Col md={6} className=''>
                                <FormGroupCustom

                                    key={`start-time-gf${shiftView?.shift_start_time}`}
                                    name={`shift_start_time`}
                                    type={"date"}
                                    label={FM(`start-time`)}
                                    // defaultDate={dates[0]}
                                    options={{
                                        enableTime: true,
                                        noCalendar: true
                                    }}
                                    value={shiftView?.shift_start_time}

                                    dateFormat={"HH:mm"}
                                    errors={errors}
                                    className="mb-2"
                                    //setValue={setValue}
                                    control={control}
                                    rules={{ required: false }}
                                />
                            </Col> */}
              </Row>

              <Row>
                {/* <Col md="4" xs="12" className="">
                                <FormGroupCustom
                                    type={"date"}
                                    key={`re-dates`}
                                    options={{
                                        //showMonths: time?.days < 30 ? 1 : time?.days < 60 ? 2 : 3,
                                        mode: "range",
                                        enable: [function (date) { return enableFutureDates(date) }, edit?.start_date, new Date()]
                                        //   minDate: watch("start_date") ?? null,
                                        // maxDate: end ?? null
                                    }}

                                    control={control}
                                    errors={errors}
                                    setValue={setValue}
                                    name={"dates"}
                                    value={edit?.date}
                                    label={FM("select-date-range")}
                                    rules={{ required: true }}
                                />
                            </Col> */}
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
                {/* <Col md="2" xs="12">
                                <FormGroupCustom
                                    values={weekCount}
                                    key={`every-${dates}`}
                                    type="number"
                                    name="every_week"
                                    //disabled={watch("every_week") > weekCount}
                                    // max={time?.days}
                                    label={FM("every-week")}
                                    placeholder={`max-week-accept-${weekCount}`}
                                    message={FM("how-many-week-repeat")}
                                    className='with-select'
                                    errors={errors}
                                    control={control}
                                    max={weekCount}
                                    rules={{ required: true, max: weekCount }}
                                />
                            </Col> */}
                {/* </Show> */}
                {/* <Col md="6" key={`${weekDaysSelected?.length}-days`} className="mt-2">
                                {renderWeeks()}
                                <FormGroupCustom
                                    noGroup
                                    noLabel
                                    type={"hidden"}
                                    control={control}
                                    errors={errors}
                                    name={"week_days"}
                                    className="d-none "
                                    value={edit?.week_days}
                                    rules={{ required: false }}
                                />
                            </Col> */}
                <Hide IF={isValid(edit?.id)}></Hide>

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
            </div>
          </Show>
        </>
      )}
    </>
  )
}

export default ScheduleDetail
