// ** Third Party Components
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
// ** Reactstrap Imports
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { loadMonthWiseDeviation, timeReportDeviation } from '../../../utility/apis/devitation'
import { loadUser } from '../../../utility/apis/userManagement'
import { UserTypes } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { createAsyncSelectOptions, requestedDays } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'

const MonthWiseChart = ({ user = null, success, gridLineColor, labelColor, stats }) => {
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
    loadMonthWiseDeviation({
      perPage: 100,
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
    return createAsyncSelectOptions(res, page, 'name', null, setPatient)
  }

  // useEffect(() => {
  //     loadDeviationReport()
  // }, [filterData])

  useEffect(() => {
    loadDeviationReport()
  }, [])

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
  log('month', report)
  // ** Chart data
  const data = {
    labels: report?.datalabels,
    datasets: [
      {
        maxBarThickness: 40,
        label: FM('total-deviation'),
        backgroundColor: colors?.primary?.main,
        borderColor: 'transparent',
        data: report?.data
      }
    ]
  }

  return (
    <Card className='white'>
      <CardHeader>
        <CardTitle>{FM('last-six-month-stats')}</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: '400px' }}>
          <Show IF={isValid(report)}>
            <Bar key={`repot${report?.data?.lenght}`} data={data} options={options} height={400} />
          </Show>
        </div>
      </CardBody>
    </Card>
  )
}

export default MonthWiseChart
