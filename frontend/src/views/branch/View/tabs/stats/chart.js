// ** React Imports
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Fragment, useContext } from 'react'
// ** Reactstrap Imports
import { Col, Row } from 'reactstrap'
// ** Deom Charts
import ChartjsBarCharts from './ChartjsBarChart'

const ChartJS = ({ edit }) => {
  // ** Context, Hooks & Vars
  const { colors } = useContext(ThemeColors),
    { skin } = useSkin(),
    labelColor = skin === 'dark' ? '#b4b7bd' : '#000000',
    tooltipShadow = 'rgba(0, 0, 0, 0.25)',
    gridLineColor = 'rgba(200, 200, 200, 0.2)',
    lineChartPrimary = '#666ee8',
    lineChartDanger = '#ff4961',
    warningColorShade = '#ffbd1f',
    warningLightColor = '#FDAC34',
    successColorShade = '#28dac6',
    primaryColorShade = '#836AF9',
    infoColorShade = '#299AFF',
    yellowColor = '#ffe800',
    greyColor = '#4F5D70',
    blueColor = '#2c9aff',
    blueLightColor = '#84D0FF',
    greyLightColor = '#EDF1F4'

  return (
    <Fragment>
      <Row className='match-height'>
        <Col xl='12' sm='12'>
          <ChartjsBarCharts
            success={successColorShade}
            labelColor={labelColor}
            gridLineColor={gridLineColor}
            edit={edit}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default ChartJS
