// ** Third Party Components
import { Bar } from 'react-chartjs-2'

// ** Reactstrap Imports
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { termWiseActivityStats } from '../../../utility/apis/activity'
import { loadUser } from '../../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { createAsyncSelectOptions, decryptObject, requestedDays } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'

const ActivityChart = ({ success, gridLineColor, labelColor, stats, user }) => {
  // ** Chart Options
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

  const dispatch = useDispatch()
  const [patient, setPatient] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filterData, setFilterData] = useState({
    perPage: 25,
    page: '',
    request_for: '7',
    patient_id: ''
  })
  const loadJournalReport = () => {
    termWiseActivityStats({
      perPage: 100,
      jsonData: {
        ...filterData,
        patient_id: isValid(user) ? user : filterData?.patient_id,
        start_date: filterData?.start_date,
        end_date: filterData?.end_date
      },
      loading: setLoading,
      dispatch,
      success: (e) => {
        setReport(e?.payload)
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
    loadJournalReport()
  }, [filterData])

  {
    report?.labels?.map((item, index) => {
      return { item }
    })
  }

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

  // ** Chart Data
  const data = {
    labels: report?.labels,
    datasets: [
      {
        maxBarThickness: 40,
        label: FM('upcoming'),
        backgroundColor: ' #5058B8',
        borderColor: 'transparent',
        data: report?.dataset_total_pending
      },
      {
        maxBarThickness: 40,
        label: FM('done'),
        backgroundColor: '#28C76F',
        borderColor: 'transparent',
        data: report?.dataset_total_done
      },
      {
        maxBarThickness: 40,
        label: FM('not-applicable'),
        backgroundColor: '#82868B',
        borderColor: 'transparent',
        data: report?.dataset_total_not_applicable
      },
      {
        maxBarThickness: 40,
        label: FM('not-done'),
        backgroundColor: '#EA5455',
        borderColor: 'transparent',
        data: report?.dataset_total_not_done
      }
    ]
  }

  return (
    <Card className='white'>
      <div className='border-bottom p-1'>
        <Row>
          <Col md='4' className='d-flex align-items-center'>
            <div className='h4 fw-bolder mb-0'>{FM('activity-stats')}</div>
          </Col>
          <Col md='8'>
            <Row className='justify-content-end'>
              {!isValid(user) ? (
                <Col md='3'>
                  <FormGroupCustom
                    noGroup
                    noLabel
                    label={'patient'}
                    // placeholder = {FM("patient")}
                    type={'select'}
                    async
                    isClearable
                    matchWith={'id'}
                    // // defaultOptions
                    control={control}
                    onChangeValue={(v) => {
                      setFilterData({
                        ...filterData,
                        patient_id: v
                      })
                    }}
                    options={patient}
                    loadOptions={loadPatientOption}
                    name={'patient_id'}
                    className='mb-0'
                  />
                </Col>
              ) : null}
              {
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
                    placeholder={FM('today-week-month')}
                    className='mb-0 '
                    rules={{ required: false }}
                  />
                </Col>
              }

              <>
                <Col md='3'>
                  <FormGroupCustom
                    noLabel
                    name={'start_date'}
                    disabled={!!watch('request_for')}
                    type={'date'}
                    errors={errors}
                    isClearable
                    label={FM('start-date')}
                    dateFormat={'YYYY-MM-DD'}
                    onChangeValue={(v) => {
                      setFilterData({
                        ...filterData,
                        start_date: v
                        // patient_id: v?.id,
                        // patient_name: v?.name
                      })
                    }}
                    setValue={setValue}
                    className='mb-0 ms-1'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
                <Col md='3'>
                  <FormGroupCustom
                    noLabel
                    isClearable
                    disabled={!!watch('request_for')}
                    name={'end_date'}
                    type={'date'}
                    errors={errors}
                    options={{
                      minDate: watch('start_date') ?? null
                    }}
                    label={FM('end-date')}
                    dateFormat={'YYYY-MM-DD'}
                    onChangeValue={(v) => {
                      setFilterData({
                        ...filterData,
                        end_date: v
                        //  request_for: null
                        // patient_id: v?.id,
                        // patient_name: v?.name
                      })
                    }}
                    setValue={setValue}
                    className='mb-0'
                    control={control}
                    rules={{ required: false }}
                  />
                </Col>
              </>
            </Row>
          </Col>
        </Row>
      </div>
      <CardBody>
        <div style={{ height: '300px' }}>
          <Show IF={isValid(report)}>
            <Bar data={data} options={options} height={400} />
          </Show>
        </div>
      </CardBody>
    </Card>
  )
}

export default ActivityChart
