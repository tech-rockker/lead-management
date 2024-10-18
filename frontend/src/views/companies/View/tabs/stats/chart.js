// ** React Imports
// ** Custom Hooks
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Fragment } from 'react'
// ** Reactstrap Imports
import { Col, Row } from 'reactstrap'
// ** Deom Charts
import ChartjsBarCharts from './ChartjsBarChart'
const ChartJS = ({ edit }) => {
  return (
    <Fragment>
      {/* <Show IF={ViewDeviation}> */}
      <Row>
        <Col md='12'>
          {/* <ChartjsBarCharts stats={stats} /> */}
          <ChartjsBarCharts edit={edit} />
        </Col>
      </Row>
      {/* </Show> */}
      {/* <Hide IF={ViewDeviation}>
                <NoActiveModule module="deviation" />
            </Hide> */}
    </Fragment>
  )
}

export default ChartJS
