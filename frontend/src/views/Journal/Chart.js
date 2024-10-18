// ** Third Party Components
import { Bar } from 'react-chartjs-2'
import Flatpickr from 'react-flatpickr'
import { Calendar } from 'react-feather'
import { ThemeColors } from '@src/utility/context/ThemeColors'
// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Col, Row } from 'reactstrap'
import { FM, isValid } from '../../utility/helpers/common'
import { timeReportJournal } from '../../utility/apis/journal'
import { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Show from '../../utility/Show'
import { useForm } from 'react-hook-form'
import FormGroupCustom from '../components/formGroupCustom'
import { createAsyncSelectOptions, decryptObject, requestedDays } from '../../utility/Utils'
import { loadUser } from '../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../utility/Const'
import classNames from 'classnames'

const Chart = ({ user = null, success, gridLineColor, labelColor, stats }) => {
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
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [patient, setPatient] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filterData, setFilterData] = useState({
    patient_id: '',
    request_for: '',
    start_date: '',
    end_date: ''
  })
  const loadJournalReport = () => {
    timeReportJournal({
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
    loadJournalReport()
  }, [filterData])
  console.log(report)

  // {
  //     report?.labels?.map((item, index) => {
  //         return (

  //             { item }
  //         )
  //     })
  // }

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
        label: FM('total-journal'),
        backgroundColor: colors.info.main,
        borderColor: 'transparent',
        data: report?.dataset_total_journal
      },
      {
        maxBarThickness: 40,
        label: FM('total-signed'),
        backgroundColor: colors.success.main,
        borderColor: 'transparent',
        data: report?.dataset_total_signed
      },
      {
        maxBarThickness: 40,
        label: FM('with-activity'),
        backgroundColor: colors.primary.main,
        borderColor: 'transparent',
        data: report?.dataset_with_activity
      },
      {
        maxBarThickness: 40,
        label: FM('without-activity'),
        backgroundColor: colors.secondary.main,
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
            <div className='h4 fw-bolder mb-0'>{FM('journal-stats')}</div>
          </Col>
          <Col md='8'>
            <Row className='justify-content-end'>
              <Col md='3'>
                <FormGroupCustom
                  noGroup
                  noLabel
                  label={'patient'}
                  type={'select'}
                  async
                  isClearable
                  // // defaultOptions
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
                  isDisabled={isValid(watch('start_date')) || isValid(watch('end_date'))}
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
                  name={'start_date'}
                  type={'date'}
                  disabled={isValid(watch('request_for'))}
                  errors={errors}
                  // disabled={!!watch("request_for")}
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
                  className={classNames('mb-0', { 'pe-none': isValid(watch('request_for')) })}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='3'>
                <FormGroupCustom
                  noLabel
                  name={'end_date'}
                  type={'date'}
                  errors={errors}
                  // disabled={!!watch("request_for")}
                  options={{
                    minDate: watch('start_date') ?? null
                  }}
                  isClearable
                  disabled={isValid(watch('request_for'))}
                  onChangeValue={(e) => {
                    setFilterData({
                      ...filterData,
                      end_date: e
                    })
                  }}
                  label={FM('end-date')}
                  dateFormat={'YYYY-MM-DD'}
                  setValue={setValue}
                  className={classNames('mb-0', { 'pe-none': isValid(watch('request_for')) })}
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

export default Chart
