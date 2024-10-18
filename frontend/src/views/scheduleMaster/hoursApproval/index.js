import '@styles/react/apps/app-users.scss'
import classNames from 'classnames'
import moment from 'moment'
import React, { useEffect, useReducer, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { Columns, Download } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Spinner,
  Table
} from 'reactstrap'
import { scheduleApprove, scheduleVerify } from '../../../utility/apis/employeeApproval'
import {
  loadSchedule,
  loadScheduleList,
  printScheduleEmpBased
} from '../../../utility/apis/schedule'
import { loadUser } from '../../../utility/apis/userManagement'
import { forDecryption, presets, UserTypes } from '../../../utility/Const'
import { FM, isValid, isValidArray } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import usePackage from '../../../utility/hooks/usePackage'
import useUser from '../../../utility/hooks/useUser'
import Show from '../../../utility/Show'
import {
  createSelectOptions,
  decryptObject,
  endOfMonth,
  fastLoop,
  formatDate,
  getDates,
  getYear,
  hrsStatus,
  JsonParseValidate,
  toggleArray,
  viewInHours,
  WarningToast
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'

export const data = {
  approved_by_company: 0,
  end_time: '12:00',
  id: 44,
  leave_applied: 0,
  leave_approved: 0,
  patient: null,
  patient_id: null,
  rest_end_time: '2022-09-03 08:30:00',
  rest_start_time: '2022-09-03 08:00:00',
  schedule_template_id: 6,
  schedule_type: 'basic',
  shift_color: '#111111',
  shift_date: '2022-09-03',
  shift_end_time: '2022-09-03 12:00:00',
  shift_id: 8,
  shift_name: 'Morning',
  shift_start_time: '2022-09-03 04:00:00',
  shift_type: 'normal',
  start_time: '04:00',
  total_hours: 0, //(in minute)
  user: {},
  user_id: 30,
  verified_by_employee: 0,
  ///Changes
  emergency_work_duration: 30, //(in minute)
  extra_work_duration: 50, //(in minute)
  obe_work_duration: 40, //(in minute)
  schedule_work_duration: 10 //(in minute)
}

const HoursApproval = () => {
  const pack = usePackage()
  const initState = {
    page: 1,
    perPage: 50,
    loading: false,
    employees: [],
    templates: [],
    dates: [],
    branches: [],
    startOfMonth: moment().startOf('month').toDate(),
    endOfMonth: moment().endOf('month').toDate()
  }
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

  /** @returns {initState} */
  const stateReducer = (o, n) => ({ ...o, ...n })
  const [state, setState] = useReducer(stateReducer, initState)
  const location = useLocation()
  const user = useUser()
  const notification = location?.state?.notification
  const [notData, setNotData] = useState(null)
  const [datas, setDatas] = useState([])
  const [verified, setVerified] = useState(null)
  const [failed, setFailed] = useState(null)
  const [loading, setLoading] = useState(false)
  const [listLoad, setListLoad] = useState(false)
  const [emp, setEmp] = useState([])
  const [Emploading, setEmpLoading] = useState(false)
  const [schedule, setSchedule] = useState([])
  const [scheduleLoad, setScheduleLoad] = useState(false)
  const [ids, setIds] = useState([])
  const month = moment().month() + 1 < 10 ? `0${moment().month() + 1}` : moment().month() + 1
  const [rSelected, setRSelected] = useState(String(month))

  const handlePresets = (preset) => {
    if (isValid(preset)) {
      if (preset === presets.thisMonth) {
        const startOfMonth = moment().startOf('month').toDate()
        const endOfMonth = moment().endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.thisWeek) {
        const startOfMonth = moment().startOf('week').toDate()
        const endOfMonth = moment().endOf('week').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.prevMonth) {
        const startOfMonth = moment().subtract(1, 'months').startOf('month').toDate()
        const endOfMonth = moment().subtract(1, 'months').endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === 'custom') {
        if (isValid(state.startOfMonth) && isValid(state.endOfMonth)) {
          const dates = getDates(state.startOfMonth, state.endOfMonth)
          setState({ dates })
        }
      }
    }
  }

  useEffect(() => {
    handlePresets('custom')
  }, [state?.startOfMonth, state?.endOfMonth])

  // ** Function to handle filter
  const loadEmployeeOptions = () => {
    loadUser({
      loading: setEmpLoading,
      jsonData: {
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
  const loadScheduleOptions = () => {
    loadSchedule({
      loading: setScheduleLoad,
      success: (e) => {
        setSchedule(createSelectOptions(e?.payload, 'shift_date', 'id'))
      }
    })
  }

  useEffect(() => {
    loadEmployeeOptions()
    //   loadScheduleOptions()
  }, [])

  useEffect(() => {
    if (notification?.data_id) {
      setNotData({
        preset: 'this-month',
        id: notification?.data_id,
        user_id: JsonParseValidate(notification?.extra_param)?.employee_id
      })
      setValue('user_id', JsonParseValidate(notification?.extra_param)?.employee_id)
      window.history.replaceState({ fffff: 'kj' }, document.title)
    }
  }, [notification])

  const loadWorkWiseDetails = () => {
    if (watch('user_id') || (user?.id && user?.user_type_id === UserTypes.employee)) {
      loadScheduleList({
        loading: setListLoad,
        jsonData: {
          user_id: user?.user_type_id === UserTypes.employee ? user?.id : watch('user_id'),
          // shift_start_date: formatDate(state.startOfMonth),
          // shift_end_date: formatDate(state.endOfMonth),
          shift_start_date: formatDate(new Date(`${watch('year')}-${rSelected}-01`)) ?? null,
          shift_end_date:
            formatDate(endOfMonth(new Date(`${watch('year')}-${rSelected}-01`))) ?? null
          // leave_applied: watch("leave_applied")
        },
        success: (e) => {
          setDatas(e?.payload)
        }
      })
    }
  }

  useEffect(() => {
    loadWorkWiseDetails()
  }, [watch('user_id'), state?.startOfMonth, state.endOfMonth, user])

  useEffect(() => {
    loadWorkWiseDetails()
  }, [rSelected, watch('year')])

  const onSubmit = (d) => {
    if (isValidArray(ids)) {
      if (user?.user_type_id === UserTypes?.employee) {
        scheduleVerify({
          loading: setLoading,
          jsonData: {
            schedule_ids: ids
          },
          success: () => {
            // SuccessToast("verify")
            setIds([])
            loadWorkWiseDetails()
            //setListLoad(e)
          }
        })
      } else if (user?.user_type_id === UserTypes?.company) {
        scheduleApprove({
          loading: setLoading,
          jsonData: {
            schedule_ids: ids
          },
          success: (e) => {
            // SuccessToast("approved")
            setIds([])
            loadWorkWiseDetails()
            //setListLoad(e)
          }
        })
      }
    } else {
      WarningToast(FM('please-check-dates'))
    }
  }

  const selectedArr = datas?.sort((a, b) => {
    return new Date(a?.shift_date) - new Date(b.shift_date)
  })

  const selectAll = (selectArr) => {
    //(new Date(formatDate(new Date(), "YYYY-MM-DD 00:00:00")).getTime() < new Date(d?.shift_date).getTime())
    // return isValidArray(selectArr) ? selectArr?.filter((d) => d?.approved_by_company === 0).map(item => toggleArray(item?.id, ids, setIds)) : []
    const re = []
    if (isValidArray(selectArr)) {
      fastLoop(selectArr, (d, i) => {
        if (
          (user?.user_type_id === UserTypes.employee && d?.verified_by_employee === 1) ||
          (user?.user_type_id === UserTypes.company && d?.approved_by_company === 1) ||
          new Date(formatDate(new Date(), 'YYYY-MM-DD 00:00:00')).getTime() <=
            new Date(d?.shift_date).getTime()
        ) {
        } else {
          re.push(d?.id)
        }
      })
    }
    if (watch('select_all') === 1) {
      setIds(re)
    } else {
      setIds([])
    }
  }

  useEffect(() => {
    selectAll(selectedArr)
  }, [watch('select_all')])

  const printEmpData = () => {
    printScheduleEmpBased({
      jsonData: {
        user_id: user?.user_type_id !== UserTypes.employee ? watch('user_id') : user?.id,
        start_date: formatDate(state.startOfMonth) ?? '',
        end_date: formatDate(state?.endOfMonth) ?? '',
        // with_planning: (datas?.is_active === 1 && datas?.status === 1) ? "1" : "2",
        is_active: datas?.is_active === 1 ? 1 : 0,
        status: datas?.status === 1 ? 1 : 0
      }
    })
  }

  const hoursArr = isValidArray(selectedArr)
    ? selectedArr?.filter(
        (f) =>
          Number(f?.emergency_work_duration) > 0 ||
          Number(f?.extra_work_duration) > 0 ||
          Number(f?.ob_work_duration) > 0 ||
          Number(f?.scheduled_work_duration) > 0 ||
          Number(f?.vacation_duration) > 0 ||
          Number(f?.ob_red_work_duration) > 0 ||
          Number(f?.ob_weekday_work_duration) > 0 ||
          Number(f?.ob_weekend_work_duration) > 0 ||
          Number(f?.total_hour) > 0
      )
    : []

  const totalSum = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + Number(object?.total_hours)
      }, 0)
    : 0

  const totalObeHours = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + Number(object?.ob_work_duration)
      }, 0)
    : 0

  const totalExtraHours = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + Number(object?.extra_work_duration)
      }, 0)
    : 0
  const totalEmergencyHours = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + Number(object?.emergency_work_duration)
      }, 0)
    : 0
  const totalScheduleHours = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + Number(object?.scheduled_work_duration)
      }, 0)
    : 0
  const totalObeRed = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + Number(object?.ob_red_work_duration)
      }, 0)
    : 0
  const totalObeWeekDays = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + Number(object?.ob_weekday_work_duration)
      }, 0)
    : 0
  const totalObeWeekend = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + Number(object?.ob_weekend_work_duration)
      }, 0)
    : 0
  const totalVacationHours = isValidArray(hoursArr)
    ? hoursArr?.reduce((accumulator, object) => {
        return accumulator + Number(object?.vacation_duration)
      }, 0)
    : 0

  return (
    <div>
      <Header titleCol='6' childCol='6' icon={<Columns size={25} />}>
        <ButtonGroup className='p-0'>
          <Hide IF={user?.user_type_id === UserTypes.employee}>
            <FormGroupCustom
              placeholder={FM('select-employee')}
              label={FM('employees')}
              type={'select'}
              //async
              noLabel
              noGroup
              cacheOptions
              control={control}
              value={notData?.user_id ?? null}
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
            onClick={printEmpData}
          >
            <Download size={15} />
          </BsTooltip>
        </ButtonGroup>
      </Header>
      <Form setNotData={setNotData} onSubmit={handleSubmit(onSubmit)}>
        <Row className='mt-0'>
          <Col md='12'>
            <Card className='white'>
              <CardBody className='p-0'>
                {/* <Row className='mb-1 mt-1 p-1'>
                                    <Col md="4">
                                        <FormGroupCustom
                                            key={`start-${state.startOfMonth}-${watch("user_id")}`}
                                            noGroup
                                            noLabel
                                            name="from"
                                            value={state.startOfMonth}
                                            onChangeValue={(startOfMonth) => { setValue("preset", null); setState({ startOfMonth }) }}
                                            control={control}
                                            label={"from-date"}
                                            setValue={setValue}
                                            type={"date"}
                                            className={classNames('mb-1')}

                                        />
                                    </Col>
                                    <Col md="4" >
                                        <FormGroupCustom
                                            key={`end-${state.endOfMonth}-${watch("user_id")}`}
                                            noGroup
                                            noLabel
                                            name="to"

                                            options={{
                                                minDate: state.startOfMonth
                                            }}
                                            onChangeValue={(endOfMonth) => { setValue("preset", null); setState({ endOfMonth }) }}
                                            value={state.endOfMonth}
                                            control={control}
                                            label={"to-date"}
                                            setValue={setValue}
                                            type={"date"}
                                            className={classNames('mb-1')}

                                        />
                                    </Col>
                                </Row> */}
                <Row className='d-flex justify-content-between g-1 p-1'>
                  {/* <FormGroupCustom
                                        type={"select"}
                                        noLabel
                                        noGroup
                                        isClearable
                                        forceValue
                                        value={watch('leave_applied') ?? null}
                                        control={control}
                                        options={hrsStatus()}
                                        name={"leave_applied"}
                                        className="mb-1"
                                        rules={{ required: false }}
                                    /> */}
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
                {listLoad ? (
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
                    </Row>
                  </div>
                ) : (
                  <Table className='fixed-table' responsive striped bordered size='md'>
                    <thead>
                      <tr>
                        <th scope='col'>
                          {' '}
                          {isValidArray(selectedArr) ? (
                            isValid(
                              selectedArr?.find(
                                (f) =>
                                  (user?.user_type_id === UserTypes.employee &&
                                    f?.verified_by_employee === 0) ||
                                  (user?.user_type_id === UserTypes.company &&
                                    f?.approved_by_company === 0) ||
                                  new Date(
                                    formatDate(new Date(), 'YYYY-MM-DD 00:00:00')
                                  ).getTime() > new Date(f?.shift_date).getTime()
                              )
                            ) ? (
                              <BsTooltip title={FM('check-all')}>
                                <FormGroupCustom
                                  noLabel
                                  noGroup
                                  name={`select_all`}
                                  type={'checkbox'}
                                  errors={errors}
                                  className={'ms-1 p-1'}
                                  // value={ids?.includes(d?.id)}
                                  control={control}
                                  rules={{ required: false }}
                                />
                              </BsTooltip>
                            ) : null
                          ) : null}
                        </th>
                        <th scope='col'>{FM('status')}</th>
                        <th scope='col'>{FM('dates')}</th>

                        <th scope='col'>{FM('start-time')}</th>
                        <th scope='col'>{FM('end-time')}</th>
                        <th scope='col'>{FM('emergency-work-duration')}</th>
                        <th scope='col'>{FM('extra-work-duration')}</th>
                        <th scope='col'>{FM('ob-red-start-time')}</th>
                        <th scope='col'>{FM('ob-red-end-time')}</th>
                        <th scope='col'>{FM('ob-red-hours')}</th>
                        <th scope='col'>{FM('ob-weekday-start-time')}</th>
                        <th scope='col'>{FM('ob-weekday-end-time')}</th>
                        <th scope='col'>{FM('ob-weekday-hours')}</th>
                        <th scope='col'>{FM('ob-weekend-start-time')}</th>
                        <th scope='col'>{FM('ob-weekend-end-time')}</th>
                        <th scope='col'>{FM('ob-weekend-hours')}</th>
                        <th scope='col'>{FM('ob-work-duration')}</th>
                        <th scope='col'>{FM('vacation-hours')}</th>

                        <th scope='col'>{FM('basic-work-duration')}</th>
                        <th scope='col'>{FM('schedule-work-duration')}</th>
                      </tr>
                    </thead>
                    {listLoad ? (
                      <>
                        <tr>
                          <td>
                            <div className='loader-top me-2'>
                              <span className='spinner'>
                                <Spinner color='primary' animation='border' size={'xl'}>
                                  <span className='visually-hidden'>Loading...</span>
                                </Spinner>
                              </span>
                            </div>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <>
                        {' '}
                        <tbody>
                          {isValidArray(selectedArr) ? (
                            selectedArr?.map((d, i) => {
                              return (
                                <>
                                  <tr>
                                    <td key={i} colspan='1'>
                                      <Hide
                                        IF={
                                          new Date(
                                            formatDate(new Date(), 'YYYY-MM-DD 00:00:00')
                                          ).getTime() <= new Date(d?.shift_date).getTime() ||
                                          (d?.approved_by_company === 1 &&
                                            user?.user_type_id === UserTypes.company) ||
                                          (d?.verified_by_employee === 1 &&
                                            user?.user_type_id === UserTypes.employee)
                                        }
                                      >
                                        <FormGroupCustom
                                          key={i}
                                          noLabel
                                          noGroup
                                          name={`ids.${i}`}
                                          type={'checkbox'}
                                          errors={errors}
                                          onChangeValue={() => {
                                            {
                                              toggleArray(d?.id, ids, setIds)
                                            }
                                          }}
                                          className={'ms-1'}
                                          // value={watch("select_all") ? 1 : 0}
                                          value={ids?.includes(d?.id) ? 1 : 0}
                                          control={control}
                                          rules={{ required: false }}
                                        />
                                      </Hide>
                                    </td>
                                    <td>
                                      {d?.approved_by_company === 0 &&
                                      d?.verified_by_employee === 0 ? (
                                        <>
                                          <Badge color='light-danger'>{FM('no-action')}</Badge>
                                        </>
                                      ) : (
                                        <>
                                          {d?.approved_by_company === 1 ? (
                                            <Badge className='me-1' color='light-success'>
                                              {FM('approved')}
                                            </Badge>
                                          ) : null}
                                          {d?.verified_by_employee === 1 ? (
                                            <Badge color='light-primary'>{FM('verified')}</Badge>
                                          ) : null}
                                        </>
                                      )}
                                      {/* {
                                                                    (d?.approved_by_company === 1) ? <><Badge className='me-1' color='light-success'>{FM("approved")}</Badge>
                                                                    </> : d?.verified_by_employee === 1 ? <Badge color='light-primary'>{FM("verified")}</Badge> : <Badge color='light-danger'>{FM("no-action")}</Badge>
                                                                } */}
                                    </td>
                                    <td key={i}>{formatDate(d?.shift_date)}</td>
                                    <td key={i}>{d?.start_time}</td>
                                    <td key={i}>{d?.end_time}</td>
                                    <td>
                                      <span
                                        className={
                                          d?.emergency_work_duration > 0
                                            ? 'text-primary'
                                            : 'text-secondary'
                                        }
                                      >
                                        {viewInHours(Math.round(d?.emergency_work_duration))}
                                      </span>
                                    </td>
                                    <td>
                                      <span
                                        className={
                                          d?.extra_work_duration > 0
                                            ? 'text-primary'
                                            : 'text-secondary'
                                        }
                                      >
                                        {viewInHours(Math.round(d?.extra_work_duration))}
                                      </span>
                                    </td>
                                    <td key={i}>{d?.ob_red_start_time}</td>
                                    <td key={i}>{d?.ob_red_end_time}</td>
                                    <td>
                                      <span
                                        className={
                                          d?.ob_red_work_duration > 0
                                            ? 'text-primary'
                                            : 'text-secondary'
                                        }
                                      >
                                        {viewInHours(Math.round(d?.ob_red_work_duration))}
                                      </span>
                                    </td>
                                    <td key={i}>{d?.ob_weekday_start_time}</td>
                                    <td key={i}>{d?.ob_weekday_end_time}</td>
                                    <td>
                                      <span
                                        className={
                                          d?.ob_weekday_work_duration > 0
                                            ? 'text-primary'
                                            : 'text-secondary'
                                        }
                                      >
                                        {viewInHours(Math.round(d?.ob_weekday_work_duration))}
                                      </span>
                                    </td>
                                    <td key={i}>{d?.ob_weekend_start_time}</td>
                                    <td key={i}>{d?.ob_weekend_end_time}</td>
                                    <td>
                                      <span
                                        className={
                                          d?.ob_weekend_work_duration > 0
                                            ? 'text-primary'
                                            : 'text-secondary'
                                        }
                                      >
                                        {viewInHours(Math.round(d?.ob_weekend_work_duration))}
                                      </span>
                                    </td>
                                    <td>
                                      <span
                                        className={
                                          d?.ob_work_duration > 0
                                            ? 'text-primary'
                                            : 'text-secondary'
                                        }
                                      >
                                        {viewInHours(Math.round(d?.ob_work_duration))}
                                      </span>
                                    </td>
                                    <td>
                                      <span
                                        className={
                                          d?.vacation_duration > 0
                                            ? 'text-primary'
                                            : 'text-secondary'
                                        }
                                      >
                                        {viewInHours(Math.round(d?.vacation_duration))}
                                      </span>
                                    </td>
                                    <td>
                                      <span
                                        className={
                                          d?.scheduled_work_duration > 0
                                            ? 'text-primary'
                                            : 'text-secondary'
                                        }
                                      >
                                        {viewInHours(Math.round(d?.scheduled_work_duration))}
                                      </span>
                                    </td>
                                    <td key={i}>
                                      <span
                                        className={
                                          d?.total_hours > 0 ? 'text-primary' : 'text-secondary'
                                        }
                                      >
                                        {viewInHours(Math.round(d?.total_hours))}
                                      </span>
                                    </td>
                                  </tr>
                                </>
                              )
                            })
                          ) : (
                            <tr>
                              <td scope='col' colspan='19' className='text-center'>
                                <div className='text-center'>
                                  <p className='mb-0 text-danger text-small-12 fw-bolder'>
                                    {' '}
                                    {watch('user_id')
                                      ? FM('no-dates-available')
                                      : user?.user_type_id === UserTypes.employee
                                      ? FM('no-dates-available')
                                      : FM('please-select-employee')}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
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
                                {viewInHours(Math.round(totalEmergencyHours))}
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
                                {viewInHours(Math.round(totalExtraHours))}
                              </span>
                            </th>
                            <th></th>
                            <th></th>
                            <th>
                              <span
                                className={
                                  totalObeRed > 0
                                    ? 'text-primary  fw-bolder h6'
                                    : 'text-secondary h6'
                                }
                              >
                                {viewInHours(Math.round(totalObeRed))}
                              </span>
                            </th>
                            <th></th>
                            <th></th>
                            <th>
                              <span
                                className={
                                  totalObeWeekDays > 0
                                    ? 'text-primary  fw-bolder h6'
                                    : 'text-secondary h6'
                                }
                              >
                                {viewInHours(Math.round(totalObeWeekDays))}
                              </span>
                            </th>
                            <th></th>
                            <th></th>
                            <th>
                              <span
                                className={
                                  totalObeWeekend > 0
                                    ? 'text-primary  fw-bolder h6'
                                    : 'text-secondary h6'
                                }
                              >
                                {viewInHours(Math.round(totalObeWeekend))}
                              </span>
                            </th>
                            <th>
                              <span
                                className={
                                  totalObeHours > 0
                                    ? 'text-primary  fw-bolder h6'
                                    : 'text-secondary h6'
                                }
                              >
                                {viewInHours(Math.round(totalObeHours))}
                              </span>
                            </th>
                            <th>
                              <span
                                className={
                                  totalVacationHours > 0
                                    ? 'text-primary  fw-bolder h6'
                                    : 'text-secondary h6'
                                }
                              >
                                {viewInHours(Math.round(totalVacationHours))}
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
                                {viewInHours(Math.round(totalScheduleHours))}
                              </span>
                            </th>
                            <th>
                              <span
                                className={
                                  totalSum > 0 ? 'text-primary fw-bolder h6' : 'text-secondary h6'
                                }
                              >
                                {viewInHours(Math.round(totalSum))}
                              </span>
                            </th>
                          </tr>
                        </tfoot>
                      </>
                    )}
                  </Table>
                )}
              </CardBody>
              <Hide IF={!isValidArray(ids)}>
                <div>
                  <Row className='m-1'>
                    <Col md='2'>
                      <Show IF={pack?.is_enable_bankid_charges === 0}>
                        <LoadingButton
                          disabled={!isValidArray(ids)}
                          block
                          loading={loading}
                          className='mt-0'
                          color='primary'
                          type='submit'
                        >
                          {user?.user_type_id === UserTypes.employee ? FM('verify') : FM('approve')}
                        </LoadingButton>
                      </Show>
                      <Show IF={pack?.is_enable_bankid_charges === 1}>
                        <Hide IF={user?.verification_method === 'bank_id'}>
                          <ConfirmAlert
                            enableNo
                            confirmButtonText={'via-bank-id'}
                            disableConfirm={!isValid(user?.personal_number)}
                            textClass='text-danger fw-bold text-small-12'
                            text={
                              !isValid(user?.personal_number)
                                ? 'please-add-your-personal-number'
                                : 'how-would-you-like-to-sign'
                            }
                            title={FM('approve-hours')}
                            denyButtonText={'normal'}
                            color='text-warning'
                            successTitle={FM('approved')}
                            successText={FM('hours-is-approved-successfully')}
                            onClickYes={() => {
                              scheduleApprove({
                                jsonData: {
                                  signed_method: 'bankid',
                                  schedule_ids: ids
                                }
                              })
                            }}
                            onClickNo={() => {
                              scheduleApprove({
                                jsonData: {
                                  signed_method: 'normal',
                                  schedule_ids: ids
                                }
                              })
                            }}
                            className={`btn btn-block d-block ${
                              !isValidArray(ids) ? 'pe-none btn-secondary' : 'btn-primary '
                            }`}
                            onSuccessEvent={() => {
                              setIds([])
                              loadWorkWiseDetails()
                            }}
                            id={`grid-verify}`}
                          >
                            {FM('approve')}
                          </ConfirmAlert>
                        </Hide>
                        <Show IF={user?.user_type_id === UserTypes.employee}>
                          <ConfirmAlert
                            confirmButtonText={'via-bank-id'}
                            disableConfirm={
                              user?.verification_method !== 'bank_id' ||
                              !isValid(user?.personal_number)
                            }
                            textClass='text-danger fw-bold text-small-12'
                            text={
                              !isValid(user?.personal_number)
                                ? 'please-add-your-personal-number'
                                : 'please-verify-vai-bank-id'
                            }
                            title={FM('verify-hours')}
                            color='text-warning'
                            successTitle={FM('verified')}
                            successText={FM('hours-is-verified-successfully')}
                            onClickYes={() => {
                              scheduleVerify({
                                jsonData: {
                                  signed_method: 'bankid',
                                  schedule_ids: ids
                                }
                              })
                            }}
                            onClickNo={() => {
                              scheduleVerify({
                                jsonData: {
                                  signed_method: 'normal',
                                  schedule_ids: ids
                                }
                              })
                            }}
                            className={`btn btn-block d-block ${
                              !isValidArray(ids) ? 'pe-none btn-secondary' : 'btn-primary '
                            }`}
                            onSuccessEvent={() => {
                              setIds([])
                              loadWorkWiseDetails()
                            }}
                            id={`grid-verify}`}
                          >
                            {FM('verify')}
                          </ConfirmAlert>
                        </Show>
                      </Show>
                    </Col>
                  </Row>
                </div>
              </Hide>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default HoursApproval
