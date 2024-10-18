/* eslint-disable no-var */
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import MonthPicker from 'simple-react-month-picker'
import moment from 'moment'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { Bar } from 'react-chartjs-2'
import { CardBody, Card, Row, Col, ButtonGroup, Button } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { loadUser } from '../../../../utility/apis/userManagement'
import {
  getWeekLables,
  getWeeksDiff,
  UserTypes,
  presets,
  forDecryption
} from '../../../../utility/Const'
import {
  addDaysArray,
  createAsyncSelectOptions,
  createConstSelectOptions,
  createSelectOptions,
  decryptObject,
  endOfMonth,
  fastLoop,
  formatDate,
  getDates,
  getYear
} from '../../../../utility/Utils'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import Header from '../../../header'
//import Picker from 'react-month-picker'
import FormGroupCustom from '../../../components/formGroupCustom'
import { loadScheduleStats } from '../../../../utility/apis/schedule'
import classNames from 'classnames'
import BsTooltip from '../../../components/tooltip'
import { Download } from 'react-feather'
import { employeeHoursExport } from '../../../../utility/apis/employeeApproval'
import useUser from '../../../../utility/hooks/useUser'
import Hide from '../../../../utility/Hide'
import Scrollbars from 'react-custom-scrollbars'

const ScheduleStats = () => {
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
  const [weekCount, setWeekCount] = useState(null)
  const [emp, setEmp] = useState([])
  const [selected, setSelected] = useState(null)
  const user = useUser()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState([])
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
  const { colors } = useContext(ThemeColors)

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
      } else if (preset === presets.nextMonth) {
        const startOfMonth = moment().add(1, 'months').startOf('month').toDate()
        const endOfMonth = moment().add(1, 'months').endOf('month').toDate()
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

  const loadEMpOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 5,
      jsonData: { name: search, user_type_id: UserTypes.employee }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setEmp, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  log(state)
  const loadScheduleStatsLoad = () => {
    loadScheduleStats({
      jsonData: {
        user_id: watch('user_id')
          ? watch('user_id')
          : user?.user_type_id === UserTypes.employee
          ? user?.id
          : '',
        start_date: formatDate(new Date(`${watch('year')}-${rSelected}-01`)) ?? null,
        end_date: formatDate(endOfMonth(new Date(`${watch('year')}-${rSelected}-01`))) ?? null
      },
      loading: setLoading,
      success: (e) => {
        setStats(e)
      }
    })
  }
  const exportData = () => {
    employeeHoursExport({
      jsonData: {
        user_id: watch('user_id')
          ? watch('user_id')
          : user?.user_type_id === UserTypes.employee
          ? user?.id
          : '',
        start_date: formatDate(new Date(`${watch('year')}-${rSelected}-01`)) ?? null,
        end_date: formatDate(endOfMonth(new Date(`${watch('year')}-${rSelected}-01`))) ?? null,
        export: true
      }
    })
  }
  useEffect(() => {
    loadScheduleStatsLoad()
  }, [watch('user_id'), state.startOfMonth, state.endOfMonth])

  useEffect(() => {
    loadScheduleStatsLoad()
  }, [])

  useEffect(() => {
    loadScheduleStatsLoad()
  }, [rSelected, watch('year')])

  const data = {
    labels: isValidArray(stats?.labels) ? stats?.labels : [],
    datasets: [
      {
        label: FM('obe-hours'),
        data: stats?.obe_hours,
        backgroundColor: colors.secondary.main,
        stack: 'Stack 0'
      },
      {
        label: FM('vocation-hours'),
        data: stats?.vacation_hours,
        backgroundColor: colors.success.main,
        stack: 'Stack 0'
      },
      {
        label: FM('regular-hour'),
        data: stats?.regular_hours,
        backgroundColor: colors.primary.main,
        stack: 'Stack 0'
      },

      // {
      //     label: FM('total-hours'),
      //     data: stats?.total_hours,
      //     backgroundColor: colors.info.main,
      //     stack: 'Stack 0'
      // },
      {
        label: FM('emergency-hours'),
        data: stats?.emergency_hours,
        backgroundColor: colors.warning.main,
        stack: 'Stack 0'
      },
      {
        label: FM('extra-hours'),
        data: stats?.extra_hours,
        backgroundColor: colors.danger.main,
        stack: 'Stack 0'
      }
    ]
  }

  const config = {
    type: 'bar',
    data,
    options: {
      plugins: {
        title: {
          display: false,
          text: FM('reports-with-dates')
        }
      },
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    }
  }

  return (
    <>
      <div>
        <Card className=''>
          <CardBody>
            <Header title={FM('reports')}>
              <ButtonGroup className='p-0'>
                <Hide IF={user?.user_type_id === UserTypes.employee}>
                  <FormGroupCustom
                    async
                    key={`fjdfd`}
                    noLabel
                    noGroup
                    label={FM('employees')}
                    type={'select'}
                    placeholder={FM('select-employee')}
                    isClearable
                    control={control}
                    loadOptions={loadEMpOptions}
                    rules={{ required: false }}
                    errors={errors}
                    options={emp}
                    name={'user_id'}
                    className='mb-0'
                  />
                </Hide>
              </ButtonGroup>
            </Header>
            {/* <Row>

                            <Col md="3">
                                <FormGroupCustom
                                    key={`start-${state.startOfMonth}-${watch("user_id")}`}
                                    noGroup
                                    noLabel
                                    name="from"
                                    value={state.startOfMonth}
                                    onChangeValue={(startOfMonth) => { setValue("preset", null); setState({ startOfMonth }) }}
                                    control={control}
                                    label={"from-date"}
                                    type={"date"}
                                    className={classNames('mb-0')}
                                />
                            </Col>
                            <Col md="3">
                                <FormGroupCustom
                                    key={`end-${state.endOfMonth}-${watch("user_id")}`}
                                    noGroup
                                    noLabel
                                    name="to"
                                    value={state.endOfMonth}
                                    onChangeValue={(endOfMonth) => { setValue("preset", null); setState({ endOfMonth }) }}
                                    control={control}
                                    label={"to-date"}
                                    type={"date"}
                                    className={classNames('mb-0')}
                                />
                            </Col>

                            <Col md={12} className="m-2"  >
                                <Bar data={data} {...config} />
                            </Col>
                        </Row> */}
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
              <Col md={12} className='m-2'>
                <Bar data={data} {...config} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default ScheduleStats
