// ** React Imports
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// ** Reactstrap Imports
import { Col, Row } from 'reactstrap'
import { devitationStats } from '../../../utility/apis/devitation'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import NoActiveModule from '../../components/NoModule'
// ** Deom Charts
import ChartjsBarCharts from './ChartjsBarChart'
import useModules from '../../../utility/hooks/useModules'
import MonthWiseChart from './MonthWiseChart'
const ChartJS = ({ edit }) => {
  const [reload, setReload] = useState(false)
  const dispatch = useDispatch()
  const { ViewDeviation } = useModules()
  const devitations = useSelector((state) => state.statsDevitation)
  const [filterData, setFilterData] = useState({
    perPage: 25,
    page: '',
    status: ''
  })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadDeviationStats = () => {
    devitationStats({
      perPage: 1000,
      loading: setLoading,
      dispatch,
      success: (e) => {
        setStats(e)
      }
    })
  }

  useEffect(() => {
    loadDeviationStats()
  }, [filterData])

  useEffect(() => {
    if (reload) {
      loadDeviationStats()
    }
  }, [reload])
  console.log(stats)

  return (
    <Fragment>
      <Show IF={ViewDeviation}>
        <Row>
          <Col md='12'>
            <ChartjsBarCharts stats={stats} />
          </Col>
        </Row>
      </Show>
      <Show IF={ViewDeviation}>
        <Row>
          <Col md='12'>
            <MonthWiseChart stats={stats} />
          </Col>
        </Row>
      </Show>
      <Hide IF={ViewDeviation}>
        <NoActiveModule module='deviation' />
      </Hide>
    </Fragment>
  )
}

export default ChartJS
