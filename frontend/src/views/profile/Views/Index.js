// ** React Imports
// ** Styles
import '@styles/react/apps/app-users.scss'
import { useState } from 'react'
// ** Reactstrap Imports
import { Alert, Card, CardBody, Col, Row } from 'reactstrap'
import { FM, isValid, log } from '../../../utility/helpers/common'
// ** User View Components
import Tabs from './Tabs'
import UserInfoCard from './ProfileInfoCard'

const FinalProfileView = ({ user, cashier, step }) => {
  //log(user, "data")

  const [active, setActive] = useState(step)

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  const data = {
    doneActivity: 10,
    notDoneActivity: 1,
    notApplicableActivity: 4,
    upcomingActivity: 2,
    journalActivity: 2,
    deviationActivity: 3
  }

  return isValid(user) ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
          <Card>
            <CardBody className='p-0'>
              <UserInfoCard selectedUser={user} visible={true} />
            </CardBody>
          </Card>
        </Col>
        <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
          <Card>
            <CardBody className='p-0'>
              <Tabs user={user} cashier={cashier} active={active} toggleTab={toggleTab} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>{FM('user-not-found')}</h4>
      <div className='alert-body'>{FM('user-doesnot-exist')}</div>
    </Alert>
  )
}
export default FinalProfileView
