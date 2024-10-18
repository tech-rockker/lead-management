import classNames from 'classnames'
import moment from 'moment'
import React, { useEffect, useReducer, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { Download, Tablet } from 'react-feather'
import { useForm } from 'react-hook-form'

import { Button, ButtonGroup, Card, CardBody, Col, Row, Table } from 'reactstrap'
import { empDateWiseWork, employeeHoursExport } from '../../../../utility/apis/employeeApproval'
import { loadUser } from '../../../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../../../utility/Const'
import { FM, isValid, isValidArray } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import useUser from '../../../../utility/hooks/useUser'
import Show from '../../../../utility/Show'
import {
  createSelectOptions,
  decryptObject,
  endOfMonth,
  fastLoop,
  formatDate,
  getYear,
  viewInHours
} from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'
import Shimmer from '../../../components/shimmers/Shimmer'
import BsTooltip from '../../../components/tooltip'
import Header from '../../../header'

const DeductionHours = () => {
  const initState = {
    page: 1,
    perPage: 50,
    loading: false,
    employees: [],
    templates: [],
    dates: [],
    branches: [],
    startOfMonth: moment().startOf('week').toDate(),
    endOfMonth: moment().endOf('week').toDate()
  }
  /** @returns {initState} */
  const stateReducer = (o, n) => ({ ...o, ...n })
  const [state, setState] = useReducer(stateReducer, initState)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()

  const [patientHours, setPatientHours] = useState(null)
  const [loading, setLoading] = useState(false)
  const [emp, setEmp] = useState([])
  const [empLoading, setEmpLoading] = useState(false)
  const [id, setId] = useState(null)
  const [list, setList] = useState([])
  const user = useUser()
  const month = moment().month() + 1 < 10 ? `0${moment().month() + 1}` : moment().month() + 1
  const [rSelected, setRSelected] = useState(String(month))

  useEffect(() => {
    if (isValid(user?.id)) {
      setId(user?.id)
    }
  }, [user?.id])

  useEffect(() => {
    if (isValid(user)) {
      let assigned_hours_per_month = 0
      let assigned_hours_per_week = 0
      let assigned_hours_per_day = 0
      let assigned_hours = 0

      fastLoop(user?.agency_hours, (h, i) => {
        assigned_hours_per_month += Number(h?.assigned_hours_per_month)
        assigned_hours_per_week += Number(h?.assigned_hours_per_week)
        assigned_hours_per_day += Number(h?.assigned_hours_per_day)
        assigned_hours += Number(h?.assigned_hours)
      })
      setPatientHours({
        assigned_hours_per_month: assigned_hours_per_month * 60,
        assigned_hours_per_week: assigned_hours_per_week * 60,
        assigned_hours_per_day: assigned_hours_per_day * 60,
        assigned_hours: assigned_hours * 60
      })
      // setValue("branch_id", patient?.branch_id)
    }
  }, [user])

  const loadEmployeeOptions = () => {
    loadUser({
      loading: setEmpLoading,
      jsonData: {
        user_type_id: 3,
        branch_id: user?.user_type_id === UserTypes?.company ? user?.id : null,
        user_type_id: UserTypes.employee
      },
      success: (e) => {
        setEmp(
          createSelectOptions(e?.payload, 'name', 'id', (x) => {
            return decryptObject(forDecryption, x)
          })
        )
      }
    })
  }

  useEffect(() => {
    loadEmployeeOptions()
  }, [!isValid(user?.user_type_id === UserTypes.employee)])

  const loadApprovalHours = () => {
    if (
      isValid(watch('user_id')) ||
      (user?.user_type_id === UserTypes.employee ? isValid(user?.id) : isValid(watch('user_id')))
    ) {
      empDateWiseWork({
        jsonData: {
          user_id: isValid(watch('user_id'))
            ? watch('user_id')
            : user?.user_type_id === UserTypes.employee
            ? user?.id
            : watch('user_id'),
          start_date: formatDate(new Date(`${watch('year')}-${rSelected}-01`)) ?? null,
          end_date: formatDate(endOfMonth(new Date(`${watch('year')}-${rSelected}-01`))) ?? null
        },
        loading: setLoading,
        success: (e) => {
          setList(e?.payload)
        }
      })
    }
  }
  const exportData = () => {
    employeeHoursExport({
      jsonData: {
        user_id: isValid(watch('user_id'))
          ? watch('user_id')
          : user?.user_type_id === UserTypes.employee
          ? user?.id
          : watch('user_id'),
        start_date: formatDate(new Date(`${watch('year')}-${rSelected}-01`)) ?? null,
        end_date: formatDate(endOfMonth(new Date(`${watch('year')}-${rSelected}-01`))) ?? null,
        export: true
      }
    })
  }

  useEffect(() => {
    loadApprovalHours()
  }, [rSelected, watch('year')])
  // useEffect(() => {
  //     loadApprovalHours()
  // }, [])

  useEffect(() => {
    loadApprovalHours()
  }, [
    state.startOfMonth,
    state.endOfMonth,
    user?.user_type_id === UserTypes.employee,
    watch('user_id')
  ])

  const hoursArr = isValidArray(list)
    ? list?.filter(
        (f) =>
          f?.emergency_work_duration > 0 ||
          f?.extra_work_duration > 0 ||
          f?.ob_work_duration > 0 ||
          f?.scheduled_work_duration > 0 ||
          f?.vacation_duration > 0 ||
          f?.ob_red_total_hours > 0 ||
          f?.ob_weekend_total_hours > 0 ||
          f?.ob_weekday_total_hours > 0 ||
          f?.sleeping_emergency_total_hours > 0 ||
          f?.total_hour > 0
      )
    : []

  const totalSum = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + object?.total_hour
      }, 0)
    : 0

  const totalObeHours = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + object?.ob_work_duration
      }, 0)
    : 0

  const ObeRedTotal = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + object?.ob_red_total_hours
      }, 0)
    : 0

  const ObeWeekendTotal = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + object?.ob_weekend_total_hours
      }, 0)
    : 0

  const ObeWeekDayTotal = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + object?.ob_weekday_total_hours
      }, 0)
    : 0

  const SleepingEmergency = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + object?.sleeping_emergency_total_hours
      }, 0)
    : 0

  const totalExtraHours = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + object?.extra_work_duration
      }, 0)
    : 0
  const totalEmergencyHours = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + object?.emergency_work_duration
      }, 0)
    : 0
  const totalScheduleHours = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + object?.scheduled_work_duration
      }, 0)
    : 0

  const chunkSize = 7
  const chunk = []
  for (let i = 0; i < hoursArr.length; i += chunkSize) {
    chunk.push(hoursArr.slice(i, i + chunkSize))
    // do whatever
  }

  return (
    <div>
      <Header titleCol='6' childCol='6' icon={<Tablet size={25} />}>
        <ButtonGroup className='p-0'>
          <Hide IF={user?.user_type_id === UserTypes.employee}>
            <FormGroupCustom
              noGroup
              noLabel
              placeholder={FM('select-employee')}
              label={FM('employee')}
              type={'select'}
              cacheOptions
              control={control}
              options={emp}
              loadOptions={loadEmployeeOptions}
              name={'user_id'}
              className={classNames('mb-1')}
            />
          </Hide>
          <BsTooltip
            size='sm'
            color='primary'
            title={FM('export')}
            Tag={Button}
            role={'button'}
            onClick={exportData}
          >
            <Download size={15} />
          </BsTooltip>
        </ButtonGroup>
      </Header>

      <Row className='mt-0'>
        <Col md={12}>
          <Card className='white'>
            <CardBody className='p-0 '>
              <Row className='d-flex justify-content-between g-1 p-1'>
                <Col md='2'>
                  <FormGroupCustom
                    noGroup
                    noLabel
                    value={isValid(watch('year')) ? watch('year') : moment().year()}
                    placeholder={FM('year')}
                    type={'select'}
                    cacheOptions
                    control={control}
                    options={createSelectOptions(getYear())}
                    name={'year'}
                    className={classNames('mb-1')}
                  />
                </Col>
                <Col md='10' style={{ minHeight: 50 }}>
                  <Scrollbars>
                    <ButtonGroup className='mb-0'>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('01')}
                        outline={!(rSelected === '01')}
                      >
                        {FM('jan')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('02')}
                        outline={!(rSelected === '02')}
                      >
                        {FM('feb')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('03')}
                        outline={!(rSelected === '03')}
                      >
                        {FM('mar')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('04')}
                        outline={!(rSelected === '04')}
                      >
                        {FM('apr')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('05')}
                        outline={!(rSelected === '05')}
                      >
                        {FM('may')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('06')}
                        outline={!(rSelected === '06')}
                      >
                        {FM('jun')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('07')}
                        outline={!(rSelected === '07')}
                      >
                        {FM('jul')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('08')}
                        outline={!(rSelected === '08')}
                      >
                        {FM('aug')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('09')}
                        outline={!(rSelected === '09')}
                      >
                        {FM('sept')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('10')}
                        outline={!(rSelected === '10')}
                      >
                        {FM('oct')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('11')}
                        outline={!(rSelected === '11')}
                      >
                        {FM('nov')}
                      </Button>
                      <Button
                        color='primary'
                        onClick={() => setRSelected('12')}
                        outline={!(rSelected === '12')}
                      >
                        {FM('dec')}
                      </Button>
                    </ButtonGroup>
                  </Scrollbars>
                </Col>
              </Row>
              {loading ? (
                <>
                  <div>
                    <Row className='p-25'>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                    </Row>
                    <Row className='p-25'>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                    </Row>
                    <Row className='p-25'>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                    </Row>
                  </div>
                </>
              ) : (
                <div>
                  {chunk?.map((c, x) => (
                    <>
                      <Table className='fixed-table' responsive striped bordered size='md'>
                        <thead>
                          <Hide IF={x === 0}>
                            <tr style={{ display: 'block', height: 50 }}></tr>
                          </Hide>
                          <tr>
                            <th scope='col'>{FM('dates')}</th>
                            <th scope='col'>{FM('emergency-work-duration')}</th>
                            <th scope='col'>{FM('sleeping-emergency-total')}</th>
                            <th scope='col'>{FM('extra-work-duration')}</th>
                            <th scope='col'>{FM('obe-red-total')}</th>
                            <th scope='col'>{FM('obe-weekdays-total')}</th>
                            <th scope='col'>{FM('obe-weekend-total')}</th>
                            <th scope='col'>{FM('basic-work-duration')}</th>
                            <th scope='col'>{FM('schedule-work-duration')}</th>
                          </tr>
                        </thead>

                        <tbody>
                          {isValidArray(c) ? (
                            c?.map((d, i) => {
                              return (
                                <tr>
                                  <td>{formatDate(d?.date)}</td>
                                  <td>
                                    <span
                                      className={
                                        d?.emergency_work_duration > 0
                                          ? 'text-primary badge'
                                          : 'text-secondary'
                                      }
                                    >
                                      {viewInHours(Math.floor(d?.emergency_work_duration))}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        d?.sleeping_emergency_total_hours > 0
                                          ? 'text-primary badge'
                                          : 'text-secondary'
                                      }
                                    >
                                      {viewInHours(Math.floor(d?.sleeping_emergency_total_hours))}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        d?.extra_work_duration > 0
                                          ? 'text-primary badge'
                                          : 'text-secondary'
                                      }
                                    >
                                      {viewInHours(Math.floor(d?.extra_work_duration))}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        d?.ob_red_total_hours > 0
                                          ? 'text-primary badge'
                                          : 'text-secondary'
                                      }
                                    >
                                      {viewInHours(Math.floor(d?.ob_red_total_hours))}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        d?.ob_weekday_total_hours > 0
                                          ? 'text-primary badge'
                                          : 'text-secondary'
                                      }
                                    >
                                      {viewInHours(Math.floor(d?.ob_weekday_total_hours))}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        d?.ob_weekend_total_hours > 0
                                          ? 'text-primary badge'
                                          : 'text-secondary'
                                      }
                                    >
                                      {viewInHours(Math.floor(d?.ob_weekend_total_hours))}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        d?.scheduled_work_duration > 0
                                          ? 'text-primary badge'
                                          : 'text-secondary'
                                      }
                                    >
                                      {viewInHours(Math.floor(d?.scheduled_work_duration))}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        d?.total_hour > 0 ? 'text-primary badge' : 'text-secondary'
                                      }
                                    >
                                      {viewInHours(Math.floor(d?.total_hour))}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })
                          ) : (
                            <tr>
                              <td scope='col' colSpan='9' className='text-center'>
                                <div className='text-center'>
                                  <Show IF={user?.user_type_id === UserTypes.company}>
                                    <Show IF={!watch('user_id')}>
                                      <h4>{FM('please-select-employee')}</h4>
                                    </Show>
                                  </Show>
                                  <Show
                                    IF={
                                      (user?.user_type_id === UserTypes.company &&
                                        watch('user_id')) ||
                                      user?.user_type_id === UserTypes.employee
                                    }
                                  >
                                    <h4>{FM('no-data-available')}</h4>
                                  </Show>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <Show IF={x === chunk?.length - 1}>
                          <tfoot>
                            <tr style={{ display: 'block', height: 50 }}></tr>
                            <tr>
                              <th>
                                <span>{FM('total-hours')} :</span>
                              </th>
                              <th>
                                <span
                                  className={
                                    totalEmergencyHours > 0
                                      ? 'text-primary fw-bolder h6'
                                      : 'text-secondary h6'
                                  }
                                >
                                  {viewInHours(Number(totalEmergencyHours))}
                                </span>
                              </th>
                              <th>
                                <span
                                  className={
                                    SleepingEmergency > 0
                                      ? 'text-primary fw-bolder h6'
                                      : 'text-secondary h6'
                                  }
                                >
                                  {viewInHours(Number(SleepingEmergency))}
                                </span>
                              </th>
                              <th>
                                <span
                                  className={
                                    totalExtraHours > 0
                                      ? 'text-primary  fw-bolder h6'
                                      : 'text-secondary h6'
                                  }
                                >
                                  {viewInHours(Number(totalExtraHours))}
                                </span>
                              </th>
                              <th>
                                <span
                                  className={
                                    ObeRedTotal > 0
                                      ? 'text-primary fw-bolder h6'
                                      : 'text-secondary h6'
                                  }
                                >
                                  {viewInHours(Number(ObeRedTotal))}
                                </span>
                              </th>
                              <th>
                                <span
                                  className={
                                    ObeWeekDayTotal > 0
                                      ? 'text-primary fw-bolder h6'
                                      : 'text-secondary h6'
                                  }
                                >
                                  {viewInHours(Number(ObeWeekDayTotal))}
                                </span>
                              </th>
                              <th>
                                <span
                                  className={
                                    ObeWeekendTotal > 0
                                      ? 'text-primary fw-bolder h6'
                                      : 'text-secondary h6'
                                  }
                                >
                                  {viewInHours(Number(ObeWeekendTotal))}
                                </span>
                              </th>
                              <th>
                                <span
                                  className={
                                    totalScheduleHours > 0
                                      ? 'text-primary  fw-bolder h6'
                                      : 'text-secondary h6'
                                  }
                                >
                                  {viewInHours(Number(totalScheduleHours))}
                                </span>
                              </th>
                              <th>
                                <span
                                  className={
                                    totalSum > 0 ? 'text-primary fw-bolder h6' : 'text-secondary h6'
                                  }
                                >
                                  {viewInHours(Number(totalSum))}
                                </span>
                              </th>
                            </tr>
                          </tfoot>
                        </Show>
                      </Table>
                    </>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DeductionHours
