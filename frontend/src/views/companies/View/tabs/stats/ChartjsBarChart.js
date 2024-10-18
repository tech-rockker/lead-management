// ** Third Party Components
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
// ** Reactstrap Imports
import { Info, Mail } from 'react-feather'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { loadBankidMessageCount } from '../../../../../utility/apis/commons'
import { compStats } from '../../../../../utility/apis/companyApis'
import { FM, isValid, log } from '../../../../../utility/helpers/common'
import { requestedDays } from '../../../../../utility/Utils'
import StatsHorizontal from '../../../../components/cards/HoriStatCard'
import FormGroupCustom from '../../../../components/formGroupCustom'

//TODO krna h
const ChartjsBarCharts = ({ user = null, success, gridLineColor, labelColor, edit }) => {
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    control,
    getValues,
    watch,
    reset
  } = useForm()

  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [patient, setPatient] = useState(null)
  const [stats, setStats] = useState(null)

  const [filterData, setFilterData] = useState({
    data_of: '',
    from_date: '',
    end_date: ''
  })
  const [filterData2, setFilterData2] = useState({
    from_date: '',
    end_date: ''
  })
  const [bank, setBank] = useState(null)

  const loadBank = () => {
    if (edit?.id) {
      loadBankidMessageCount({
        jsonData: {
          from_date: filterData2?.from_date,
          end_date: filterData2?.end_date
        },
        id: edit?.id,
        success: (data) => {
          setBank(data?.payload)
        }
      })
    }
  }
  const loadCompStats = () => {
    if (isValid(edit?.id)) {
      compStats({
        perPage: 100,
        jsonData: {
          // ...filterData,
          data_of: filterData?.data_of
        },
        id: edit?.id,
        perPage: 1000,
        loading: setLoading,
        dispatch,
        success: (e) => {
          setStats(e?.payload)
        }
      })
    }
  }

  useEffect(() => {
    loadCompStats()
    loadBank()
  }, [filterData, edit])

  useEffect(() => {
    loadBank()
  }, [filterData2, edit])

  {
    stats?.date_labels?.map((item, index) => {
      return { item }
    })
  }

  // ** Chart Options
  const options = {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    elements: {
      bar: {
        borderRadius: {
          topRight: 0,
          topLeft: 0
        }
      }
    },
    layout: {
      padding: { top: -4 }
    },
    scales: {
      y: {
        min: 0,
        grid: {
          drawTicks: false,
          color: gridLineColor,
          borderColor: 'transparent'
        },
        ticks: { color: labelColor }
      },
      x: {
        grid: {
          display: false,
          borderColor: gridLineColor
        },
        ticks: { color: labelColor }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: { color: labelColor }
      }
    }
  }
  log(stats)
  // ** Chart data
  const data = {
    labels: stats?.date_labels,
    datasets: [
      {
        maxBarThickness: 40,
        label: FM('total-activity'),
        backgroundColor: colors?.primary?.main,
        borderColor: 'transparent',
        data: stats?.company_activities_count
      },
      // {
      //     maxBarThickness: 40,
      //     label: FM("total_module"),
      //     backgroundColor: colors?.success?.main,
      //     borderColor: 'transparent',
      //     data: stats?.company_assignedModule_count
      // },
      // {
      //     maxBarThickness: 40,
      //     label: FM("total_branch"),
      //     backgroundColor: colors?.dark?.main,
      //     borderColor: 'transparent',
      //     data: stats?.company_branchs_count
      // },
      {
        maxBarThickness: 40,
        label: FM('total_followups'),
        backgroundColor: colors?.info?.main,
        borderColor: 'transparent',
        data: stats?.company_follow_ups_count
      },
      {
        maxBarThickness: 40,
        label: FM('total_ips'),
        backgroundColor: colors?.warning?.main,
        borderColor: 'transparent',
        data: stats?.company_ips_count
      },
      {
        maxBarThickness: 40,
        label: FM('total_task'),
        backgroundColor: colors?.danger?.main,
        borderColor: 'transparent',
        data: stats?.company_tasks_count
      }
      // {
      //     maxBarThickness: 40,
      //     label: FM("total_patient"),
      //     backgroundColor: colors?.purple?.main,
      //     borderColor: 'transparent',
      //     data: stats?.company_patients_count
      // },
      // {
      //     maxBarThickness: 40,
      //     label: FM("total_employee"),
      //     backgroundColor: colors?.brown?.main,
      //     borderColor: 'transparent',
      //     data: stats?.company_employees_count
      // }
    ]
  }

  const allOptions = {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    elements: {
      bar: {
        borderRadius: {
          topRight: 0,
          topLeft: 0
        }
      }
    },
    layout: {
      padding: { top: -4 }
    },
    scales: {
      y: {
        min: 0,
        grid: {
          drawTicks: false,
          color: gridLineColor,
          borderColor: 'transparent'
        },
        ticks: { color: labelColor }
      },
      x: {
        grid: {
          display: false,
          borderColor: gridLineColor
        },
        ticks: { color: labelColor }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: { color: labelColor }
      }
    }
  }
  log(stats)
  // ** Chart data
  const datas = {
    labels: stats?.date_labels,
    datasets: [
      // {
      //     maxBarThickness: 40,
      //     label: FM("total-activity"),
      //     backgroundColor: colors?.primary?.main,
      //     borderColor: 'transparent',
      //     data: stats?.company_activities_count
      // },
      // {
      //     maxBarThickness: 40,
      //     label: FM("total_module"),
      //     backgroundColor: colors?.success?.main,
      //     borderColor: 'transparent',
      //     data: stats?.company_assignedModule_count
      // },
      {
        maxBarThickness: 40,
        label: FM('total_branch'),
        backgroundColor: colors?.dark?.main,
        borderColor: 'transparent',
        data: stats?.company_branchs_count
      },
      // {
      //     maxBarThickness: 40,
      //     label: FM("total_followups"),
      //     backgroundColor: colors?.info?.main,
      //     borderColor: 'transparent',
      //     data: stats?.company_follow_ups_count
      // },
      // {
      //     maxBarThickness: 40,
      //     label: FM("total_ips"),
      //     backgroundColor: colors?.warning?.main,
      //     borderColor: 'transparent',
      //     data: stats?.company_ips_count
      // },
      // {
      //     maxBarThickness: 40,
      //     label: FM("total_task"),
      //     backgroundColor: colors?.danger?.main,
      //     borderColor: 'transparent',
      //     data: stats?.company_tasks_count
      // },
      {
        maxBarThickness: 40,
        label: FM('total_patient'),
        backgroundColor: colors?.purple?.main,
        borderColor: 'transparent',
        data: stats?.company_patients_count
      },
      {
        maxBarThickness: 40,
        label: FM('total_employee'),
        backgroundColor: colors?.brown?.main,
        borderColor: 'transparent',
        data: stats?.company_employees_count
      }
    ]
  }

  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col md='12'>
              <Row>
                <Col md='4'>
                  <FormGroupCustom
                    type='date'
                    name='start_date'
                    label={FM('start-date')}
                    className='mb-1'
                    onChangeValue={(e) => {
                      setFilterData2({ ...filterData2, from_date: e })
                    }}
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
                <Col md='4'>
                  <FormGroupCustom
                    type='date'
                    name='end_date'
                    label={FM('end-date')}
                    className='mb-1'
                    options={{
                      minDate: new Date(watch('start_date'))
                    }}
                    onChangeValue={(e) => {
                      setFilterData2({ ...filterData2, end_date: e })
                    }}
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
              </Row>
            </Col>
            <Col md='6'>
              <StatsHorizontal
                className={'border mb-0'}
                statTitle={FM('bank-id-usage')}
                stats={bank?.bank_id_usage}
                color='primary'
                icon={<Info />}
              />
            </Col>
            <Col md='6'>
              <StatsHorizontal
                className={'border mb-0'}
                statTitle={FM('sms-usage')}
                stats={bank?.sms_usage}
                color='primary'
                icon={<Mail />}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card className='white'>
        <div className='border-bottom p-2'>
          <Row>
            <Col md='4' className='d-flex align-items-center'>
              <div className='h4 fw-bolder mb-0'>{FM('company-stats')}</div>
            </Col>

            <Col md='8'>
              <Row className='justify-content-end'>
                {/* <Col md="3">
                                <FormGroupCustom
                                    noGroup
                                    noLabel
                                    label={"patient"}
                                    type={"select"}
                                    async
                                    isClearable
                                    defaultOptions
                                    control={control}
                                    onChangeValue={(v) => {
                                        setFilterData({
                                            ...filterData,
                                            patient_id: v?.id,
                                            patient_name: v?.name
                                        })
                                    }}
                                    options={patient}
                                    placeholder="Patient"
                                    loadOptions={loadPatientOption}
                                    name={"ip_id"}
                                    className="d-flex"
                                />
                            </Col> */}
                <Col md='6'>
                  <FormGroupCustom
                    noLabel
                    // label={FM("date-of")}
                    // isDisabled={!!watch("end_date") || watch("start_date")}
                    type={'select'}
                    isClearable
                    defaultOptions
                    control={control}
                    options={requestedDays()}
                    name={'data_of'}
                    onChangeValue={(d) => {
                      setFilterData({
                        ...filterData,
                        data_of: d
                      })
                    }}
                    className='mb-0'
                    placeholder={FM('today-week-month')}
                    rules={{ required: false }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <CardBody>
          <div style={{ height: '400px' }}>
            <Bar data={datas} options={options} height={400} />
          </div>
        </CardBody>
        <CardBody>
          <div style={{ height: '400px' }}>
            <Bar data={data} options={options} height={400} />
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default ChartjsBarCharts
