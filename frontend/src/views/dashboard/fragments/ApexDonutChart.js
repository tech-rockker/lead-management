// ** Third Party Components
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import { dashboardDetails } from '../../../utility/apis/dashboard'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'

const ApexDonutChart = () => {
  const dispatch = useDispatch()
  const dashboard = useSelector((state) => state.dashboard.dashboards)
  const [dashboards, setDashboards] = useState(null)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState(null)

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
    series2: '#ff9f43',
    series3: '#28c76f'
  }
  useEffect(() => {
    if (isValid(dashboard)) {
      setOptions({
        legend: {
          show: true,
          position: 'bottom'
        },
        labels: [FM('pending'), FM('completed')],

        colors: [donutColors.series2, donutColors.series3],
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
      })
    }
  }, [dashboard])

  // ** Chart Series
  const series = [Number(dashboard?.activityPendingCount), Number(dashboard?.activityCompleteCount)]

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className='mb-75' tag='h4'>
            {FM('activity')}
          </CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        <Show IF={isValid(options)}>
          <Chart
            key={isValid(dashboard?.dashboard)}
            options={options}
            series={series}
            type='donut'
            height={350}
          />
        </Show>
      </CardBody>
    </Card>
  )
}

export default ApexDonutChart
