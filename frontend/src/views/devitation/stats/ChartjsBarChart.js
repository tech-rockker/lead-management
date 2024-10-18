// ** Third Party Components
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
// ** Reactstrap Imports
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { timeReportDeviation } from '../../../utility/apis/devitation'
import { loadUser } from '../../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { createAsyncSelectOptions, decryptObject, requestedDays } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'

const ChartjsBarCharts = ({ user = null, success, gridLineColor, labelColor, stats }) => {
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
  const devitations = useSelector((state) => state.statsDevitation)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [patient, setPatient] = useState(null)
  const [filterData, setFilterData] = useState({
    patient_id: '',
    request_for: '',
    start_date: '',
    end_date: ''
  })

  const loadDeviationReport = () => {
    timeReportDeviation({
      perPage: 100,
      jsonData: {
        ...filterData,
        patient_id: filterData?.patient_id ? filterData?.patient_id : user?.id,
        start_date: filterData?.start_date,
        end_date: filterData?.end_date,
        request_for: filterData?.request_for
      },
      loading: setLoading,
      dispatch,
      success: (e) => {
        setReport(e)
      }
    })
  }

  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  useEffect(() => {
    loadDeviationReport()
  }, [filterData])

  {
    report?.labels?.map((item, index) => {
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

  // ** Chart data
  const data = {
    labels: report?.labels,
    datasets: [
      {
        maxBarThickness: 40,
        label: FM('total-deviation'),
        backgroundColor: colors?.primary?.main,
        borderColor: 'transparent',
        data: report?.dataset_total_deviation
      },
      {
        maxBarThickness: 40,
        label: FM('total_completed'),
        backgroundColor: colors?.success?.main,
        borderColor: 'transparent',
        data: report?.dataset_total_completed
      },
      // {
      //     maxBarThickness: 40,
      //     label: FM("total_signed"),
      //     backgroundColor: colors?.primary?.main,
      //     borderColor: 'transparent',
      //     data: report?.dataset_total_signed
      // },
      {
        maxBarThickness: 40,
        label: FM('with_activity'),
        backgroundColor: colors?.info?.main,
        borderColor: 'transparent',
        data: report?.dataset_with_activity
      },
      {
        maxBarThickness: 40,
        label: FM('without_activity'),
        backgroundColor: colors?.secondary?.main,
        borderColor: 'transparent',
        data: report?.dataset_without_activity
      }
    ]
  }

  return (
    <Card className='white'>
      <div className='border-bottom p-2'>
        <Row>
          <Col md='4' className='d-flex align-items-center'>
            <div className='h4 fw-bolder mb-0'>{FM('deviation-stats')}</div>
          </Col>
          <Col md='8'>
            <Row className='justify-content-end'>
              <Col md='3'>
                <FormGroupCustom
                  noGroup
                  noLabel
                  label={FM('patient')}
                  type={'select'}
                  async
                  isClearable
                  // defaultOptions
                  control={control}
                  onChangeValue={(v) => {
                    setFilterData({
                      ...filterData,
                      patient_id: v?.id,
                      patient_name: v?.name
                    })
                  }}
                  options={patient}
                  placeholder={FM('patient')}
                  loadOptions={loadPatientOption}
                  name={'ip_id'}
                  className='d-flex'
                />
              </Col>

              <Col md='3'>
                <FormGroupCustom
                  noLabel
                  isDisabled={!!watch('end_date') || watch('start_date')}
                  type={'select'}
                  isClearable
                  // defaultOptions
                  control={control}
                  options={requestedDays()}
                  name={'request_for'}
                  onChangeValue={(d) => {
                    setFilterData({
                      ...filterData,
                      request_for: d
                    })
                  }}
                  className='mb-0'
                  placeholder={FM('today-week-month')}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='3'>
                <FormGroupCustom
                  noLabel
                  disabled={!!watch('request_for')}
                  name={'start_date'}
                  type={'date'}
                  errors={errors}
                  label={FM('start-date')}
                  dateFormat={'YYYY-MM-DD'}
                  isClearable
                  setValue={setValue}
                  onChangeValue={(d) => {
                    setFilterData({
                      ...filterData,
                      start_date: d
                    })
                  }}
                  className='mb-0 '
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='3'>
                <FormGroupCustom
                  noLabel
                  disabled={!!watch('request_for')}
                  name={'end_date'}
                  type={'date'}
                  errors={errors}
                  isClearable
                  onChangeValue={(e) => {
                    setFilterData({
                      ...filterData,
                      end_date: e
                    })
                  }}
                  options={{
                    minDate: watch('start_date') ?? null
                  }}
                  label={FM('end-date')}
                  dateFormat={'YYYY-MM-DD'}
                  setValue={setValue}
                  className='mb-0'
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <CardBody>
        <div style={{ height: '400px' }}>
          <Show IF={isValid(report)}>
            <Bar data={data} options={options} height={400} />
          </Show>
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartjsBarCharts
