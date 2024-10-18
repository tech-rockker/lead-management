import React, { useState, useContext, useEffect } from 'react'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  BarChart2,
  Briefcase,
  CheckSquare,
  Cpu,
  List,
  Server,
  Slack,
  UserCheck,
  Users,
  XSquare
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Col, Label, Row } from 'reactstrap'
import { dashboardDetails } from '../../../utility/apis/dashboard'
import { ThemeColors } from '../../../utility/context/ThemeColors'
import { FM } from '../../../utility/helpers/common'
import useModules from '../../../utility/hooks/useModules'
import { useSkin } from '../../../utility/hooks/useSkin'
import TermsModal from '../../activity/modals/TermsModal'
import Header from '../../header'
import ApexDonutChart from './ApexDonutChart'
import Shimmer from '../../components/shimmers/Shimmer'
import Show from '../../../utility/Show'
import useUserType from '../../../utility/hooks/useUserType'
import { UserTypes } from '../../../utility/Const'
import { DashboardLocator } from '../../../utility/helpers/DashboardLocator'

const PatientHome = () => {
  const dispatch = useDispatch()
  const userType = useUserType()
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()
  const dashboard = useSelector((state) => state.dashboard)
  const [dashboards, setDashboards] = useState(null)
  const [loading, setLoading] = useState(false)
  const history = useHistory()

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
    loadDashboard()
  }, [])

  const handleRead = (e, status, type) => {
    e.preventDefault()
    // document.body.click()
    DashboardLocator(type, dashboard?.dashboards, history, status)
  }

  let name = ''
  if (userType === UserTypes.patient) {
    name = FM('patient-dashboard')
  } else if (userType === UserTypes.caretaker) {
    name = FM('caretaker-dashboard')
  } else if (userType === UserTypes.contactPerson) {
    name = FM('contactPerson-dashboard')
  } else if (userType === UserTypes.familyMember) {
    name = FM('familyMember-dashboard')
  } else if (userType === UserTypes.guardian) {
    name = FM('guardian-dashboard')
  } else if (userType === UserTypes.other) {
    name = FM('other-dashboard')
  }
  return (
    <>
      <Header title={FM('dashboard')} subHeading={name}></Header>

      {loading ? (
        <>
          {' '}
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5, marginTop: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />{' '}
        </>
      ) : (
        <Row>
          {/* Stats With Icons Horizontal */}
          {/* <Col lg='4' sm='6'>
                    <Link to="/users/employees"> <StatsHorizontal icon={<UserCheck size={21} />} color='primary' stats={dashboard?.dashboards?.employeeCount} statTitle={(FM("no.-of-employees"))} /> </Link>
                </Col>
                <Col lg='4' sm='6'>
                    <Link to="/users/patients"> <StatsHorizontal icon={<Users size={21} />} color='success' stats={dashboard?.dashboards?.patientCount} statTitle={(FM("no.-of-patients"))} /> </Link>
                </Col>
                <Col lg='4' sm='6'>
                    <Link to="/branch"> <StatsHorizontal icon={<List size={21} />} color='info' stats={dashboard?.dashboards?.branchCount} statTitle={(FM("no.-of-branches"))} /> </Link>
                </Col>
               
                <Show IF={ViewActivity}>
                    <Col lg='4' sm='6'>
                        <Link to="/timeline"> <StatsHorizontal icon={<Activity size={21} />} color='info' stats={dashboard?.dashboards?.activityCount} statTitle={(FM("no.-of-activity"))} /> </Link>
                    </Col>
                </Show>
                <Show IF={ViewActivity}>
                    <Col lg='4' sm='6'>
                        <Link to="/followups"> <StatsHorizontal icon={<Slack size={21} />} color='info' stats={dashboard?.dashboards?.followupCount} statTitle={(FM("no.-of-follow up"))} /> </Link>
                    </Col>
                </Show> */}
          <Show IF={ViewActivity}>
            <Col md='12'>
              <div className=' mt-2'>
                <Label className='divider-text pb-2' style={{ fontSize: '25px' }}>
                  {' '}
                  {FM('activity')}{' '}
                </Label>
              </div>
            </Col>
            <Col lg='4' sm='6'>
              <Link to='/timeline'>
                {' '}
                <StatsHorizontal
                  icon={<Activity size={21} />}
                  color='primary'
                  stats={dashboard?.dashboards?.activityCount ?? '0'}
                  statTitle={FM('activity')}
                />{' '}
              </Link>
            </Col>
            <Col lg='4' sm='6'>
              <Link to='/timeline'>
                {' '}
                <StatsHorizontal
                  icon={<AlertTriangle size={21} />}
                  color='warning'
                  stats={dashboard?.dashboards?.activityPendingCount ?? '0'}
                  statTitle={FM('no.-of-activity-pending')}
                />{' '}
              </Link>
            </Col>
            <Col lg='4' sm='6'>
              <Link to='/timeline'>
                {' '}
                <StatsHorizontal
                  icon={<CheckSquare size={21} />}
                  color='success'
                  stats={dashboard?.dashboards?.activityCompleteCount ?? '0'}
                  statTitle={FM('no.-of-activity-completed')}
                />{' '}
              </Link>
            </Col>
          </Show>
          <Col md='12'>
            {' '}
            <div className=' mt-2'>
              <Label className='divider-text pb-2' style={{ fontSize: '25px' }}>
                {' '}
                {FM('ip-plans')}{' '}
              </Label>
            </div>
          </Col>
          <Col lg='4' sm='6'>
            <Link to='/implementation-plans'>
              {' '}
              <StatsHorizontal
                icon={<CheckSquare size={21} />}
                color='success'
                stats={dashboard?.dashboards?.ipCount}
                statTitle={FM('no.-of-ip')}
              />{' '}
            </Link>
          </Col>
          <Col lg='4' sm='6'>
            <Link to='/implementation-plans' onClick={(e) => handleRead(e, 0, 'ip')}>
              {' '}
              <StatsHorizontal
                icon={<AlertTriangle size={21} />}
                color='warning'
                stats={dashboard?.dashboards?.ipPendingCount}
                statTitle={FM('ip-pending')}
              />{' '}
            </Link>
          </Col>
          <Col lg='4' sm='6'>
            <Link to='/implementation-plans' onClick={(e) => handleRead(e, 1, 'ip')}>
              {' '}
              <StatsHorizontal
                icon={<XSquare size={21} />}
                color='danger'
                stats={dashboard?.dashboards?.ipInCompleteCount}
                statTitle={FM('ip-not-completed')}
              />{' '}
            </Link>
          </Col>
          <Col lg='4' sm='6'>
            <Link to='/implementation-plans' onClick={(e) => handleRead(e, 2, 'ip')}>
              {' '}
              <StatsHorizontal
                icon={<CheckSquare size={21} />}
                color='success'
                stats={dashboard?.dashboards?.ipCompleteCount}
                statTitle={FM('ip-completed')}
              />{' '}
            </Link>
          </Col>
          <Col md='12'>
            {' '}
            <div className=' mt-2'>
              <Label className='divider-text pb-2' style={{ fontSize: '25px' }}>
                {' '}
                {FM('task')}{' '}
              </Label>
            </div>
          </Col>
          <Col lg='4' sm='6'>
            <Link to='/master/tasks'>
              {' '}
              <StatsHorizontal
                icon={<CheckSquare size={21} />}
                color='success'
                stats={dashboard?.dashboards?.taskCount}
                statTitle={FM('no-of-task')}
              />{' '}
            </Link>
          </Col>
          <Col lg='4' sm='6'>
            <Link to='/master/tasks' onClick={(e) => handleRead(e, 'no', 'task')}>
              {' '}
              <StatsHorizontal
                icon={<AlertTriangle size={21} />}
                color='warning'
                stats={dashboard?.dashboards?.taskPendingCount}
                statTitle={FM('pending-task')}
              />{' '}
            </Link>
          </Col>
          <Col lg='4' sm='6'>
            <Link to='/master/tasks' onClick={(e) => handleRead(e, 1, 'task')}>
              {' '}
              <StatsHorizontal
                icon={<CheckSquare size={21} />}
                color='success'
                stats={dashboard?.dashboards?.taskCompleteCount}
                statTitle={FM('completed-task')}
              />{' '}
            </Link>
          </Col>
        </Row>
      )}
    </>
  )
}

export default PatientHome
