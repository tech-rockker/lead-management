// ** Third Party Components
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import { dashboardDetails } from '../../../utility/apis/dashboard'
import { FM, isValid, log } from '../../../utility/helpers/common'

const AdminApex = () => {
  const dispatch = useDispatch()
  const dashboard = useSelector((state) => state.dashboard)
  const [dashboards, setDashboards] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadDashboard = () => {
    dashboardDetails({
      perPage: 1000,
      loading: setLoading,
      dispatch,
      success: (e) => {
        setDashboards(e?.payload)
      }
    })
  }
  useEffect(() => {
    if (!isValid(dashboard)) {
      loadDashboard()
    }
  }, [dashboard])

  const donutColors = {
    series1: '#5058b8',
    series2: '#28c76f',
    series3: '#00cfe8',
    series4: '#ff9f43',
    series5: '#ea5455',
    series6: '#6c757d'
  }
  // eslint-disable-next-line no-var

  const series = [
    Number(parseInt(dashboard?.dashboards?.companyCount)),
    Number(parseInt(dashboard?.dashboards?.taskCount)),
    Number(parseInt(dashboard?.dashboards?.packageCount)),
    Number(parseInt(dashboard?.dashboards?.moduelCount)),
    Number(parseInt(dashboard?.dashboards?.licenceCount)),
    Number(parseInt(dashboard?.dashboards?.employeeCount))
  ]
  // ** Chart Options

  const options = {
    legend: {
      show: true,
      position: 'bottom'
    },
    labels: [
      FM('companies'),
      FM('tasks'),
      FM('packages'),
      FM('Modules'),
      FM('licences'),
      FM('employees')
    ],

    colors: [
      donutColors.series1,
      donutColors.series2,
      donutColors.series3,
      donutColors.series4,
      donutColors.series5,
      donutColors.series6
    ],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${Math.round(val)}%`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '2rem',
              fontFamily: 'Montserrat'
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'Montserrat',
              formatter(val) {
                return `${Math.round(val)}`
              }
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              label: FM('total')
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.5rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1.5rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  // ** Chart Series

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className='mb-75' tag='h4'>
            {FM('overall-chart')}
          </CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type='donut' height={350} />
      </CardBody>
    </Card>
  )
}

export default AdminApex
