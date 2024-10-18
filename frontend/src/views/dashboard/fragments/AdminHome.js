import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { default as React, useEffect, useState } from 'react'
import { AlertOctagon, BarChart2, Briefcase, Cpu, Server, Users } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Col, Label, Row } from 'reactstrap'
import { dashboardDetails } from '../../../utility/apis/dashboard'
import { FM, log } from '../../../utility/helpers/common'
import Shimmer from '../../components/shimmers/Shimmer'
import Header from '../../header'
import AdminApex from './AdminApex'
import ApexDonutChart from './ApexDonutChart'
const AdminHome = () => {
  const dispatch = useDispatch()
  //  const selected = useSelector(s => s["dashboards"])
  const dashboard = useSelector((state) => state.dashboard)
  const [dashboards, setDashboards] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadDashboard = () => {
    dashboardDetails({
      perPage: 1000,
      loading: setLoading,
      dispatch,
      success: (e) => {
        //log(e)
        setDashboards(e?.payload)
      }
    })
  }
  useEffect(() => {
    loadDashboard()
  }, [])

  return (
    <>
      {loading ? (
        <>
          <Row>
            <Col lg='4' sm='6'>
              {' '}
              <Shimmer height='200px' />
            </Col>
            <Col lg='4' sm='6'>
              <Shimmer height='200px' />
            </Col>
            <Col lg='4' sm='6'>
              <Shimmer height='200px' />
            </Col>
            <Col lg='4' sm='6'></Col>
            <Col lg='4' sm='6'>
              <Shimmer height='200px' />
            </Col>
            <Col lg='4' sm='6'>
              <Shimmer height='200px' />
            </Col>
          </Row>{' '}
        </>
      ) : (
        <>
          {' '}
          <Header title={FM('dashboard')} subHeading={FM('admin-dashboard')}></Header>
          <Row>
            {/* Stats With Icons Horizontal */}
            <Col lg='4' sm='6'>
              <Link to='/companies'>
                {' '}
                <StatsHorizontal
                  icon={<Cpu size={21} />}
                  color='primary'
                  stats={dashboard?.dashboards?.companyCount}
                  statTitle={FM('companies')}
                />{' '}
              </Link>
            </Col>
            <Col lg='4' sm='6'>
              <Link to='/master/tasks'>
                {' '}
                <StatsHorizontal
                  icon={<Users size={21} />}
                  color='success'
                  stats={dashboard?.dashboards?.taskCount}
                  statTitle={FM('tasks')}
                />{' '}
              </Link>
            </Col>
            <Col lg='4' sm='6'>
              <Link to='/master/packages'>
                {' '}
                <StatsHorizontal
                  icon={<Server size={21} />}
                  color='info'
                  stats={dashboard?.dashboards?.packageCount}
                  statTitle={FM('packages')}
                />{' '}
              </Link>
            </Col>
            <Col lg='4' sm='6'>
              <Link to='/master/modules'>
                {' '}
                <StatsHorizontal
                  icon={<AlertOctagon size={21} />}
                  color='warning'
                  stats={dashboard?.dashboards?.moduelCount}
                  statTitle={FM('Modules')}
                />{' '}
              </Link>
            </Col>
            <Col lg='4' sm='6'>
              <Link to='/settings/licences'>
                {' '}
                <StatsHorizontal
                  icon={<AlertOctagon size={21} />}
                  color='danger'
                  stats={dashboard?.dashboards?.licenceCount}
                  statTitle={FM('licences')}
                />{' '}
              </Link>
            </Col>
            <Col lg='4' sm='6'>
              <Link to='/admin/employees'>
                {' '}
                <StatsHorizontal
                  icon={<Users size={21} />}
                  color='dark'
                  stats={dashboard?.dashboards?.employeeCount}
                  statTitle={FM('employees')}
                />{' '}
              </Link>
            </Col>
            <Col md='12'>
              {' '}
              <div className=' mt-2'>
                <Label className='divider-text pb-2' style={{ fontSize: '25px' }}>
                  {' '}
                  {FM('graphical-data')}{' '}
                </Label>
              </div>
            </Col>
            <Col xl='6' sm='12'>
              <AdminApex />
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default AdminHome
