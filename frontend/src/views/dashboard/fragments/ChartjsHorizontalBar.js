// ** Third Party Components
import { Bar } from 'react-chartjs-2'
import Flatpickr from 'react-flatpickr'
import { Calendar } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import { FM } from '../../../utility/helpers/common'

const ChartjsHorizontalBarChart = ({
  width = 30,
  danger,
  success,
  warning,
  gridLineColor,
  labelColor,
  info
}) => {
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

  // ** Chart Data
  const data = {
    labels: ['KUND 1', 'KUND 2', 'KUND 3', 'KUND 4', 'KUND 5', 'KUND 6', 'KUND 7'],
    datasets: [
      {
        maxBarThickness: width,
        label: FM('not-done'),
        backgroundColor: danger,
        borderColor: 'transparent',
        data: [400, 350, 580, 460, 120, 154, 147]
      },
      {
        maxBarThickness: width,
        backgroundColor: warning,
        label: FM('process'),
        borderColor: 'transparent',
        data: [430, 590, 510, 240, 360, 254, 214]
      },
      {
        maxBarThickness: width,
        backgroundColor: success,
        label: FM('completed'),
        borderColor: 'transparent',
        data: [430, 590, 510, 240, 360, 365, 254]
      }
    ]
  }

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <div>
          {/* <CardSubtitle className='text-muted mb-25'>Balance</CardSubtitle> */}
          {/* <CardTitle tag='h4'>$74,123</CardTitle> */}
        </div>
        {/* <div className='d-flex align-items-center'>
                    <Calendar size={14} />
                    <Flatpickr
                        className='form-control flat-picker bg-transparent border-0 shadow-none'
                        options={{
                            mode: 'range',
                            // eslint-disable-next-line no-mixed-operators
                            defaultDate: [new Date(), new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)]
                        }}
                    />
                </div> */}
      </CardHeader>
      <CardBody>
        <div style={{ height: '400px' }}>
          <Bar data={data} options={options} height={400} />
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartjsHorizontalBarChart
