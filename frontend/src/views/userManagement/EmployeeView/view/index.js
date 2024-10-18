// ** React Imports
// ** Styles
import '@styles/react/apps/app-users.scss'
import { useState } from 'react'
// ** Reactstrap Imports
import { Alert, Col, Row } from 'reactstrap'
import { isValid } from '../../../../utility/helpers/common'

// ** User View Components
import UserTabs from './Tabs'
import UserInfoCard from './UserInfoCard'

const FinalUserView = ({ user, cashier }) => {
  const [active, setActive] = useState('1')

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
          <UserInfoCard selectedUser={user} />
        </Col>
        <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
          <UserTabs user={user} cashier={cashier} active={active} toggleTab={toggleTab} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>User not found</h4>
      <div className='alert-body'>User doesn't exist.</div>
    </Alert>
  )
}
export default FinalUserView
