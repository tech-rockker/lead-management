import '@styles/react/apps/app-users.scss'
import { useState } from 'react'
import { Alert, Col, Row } from 'reactstrap'
import { FM, isValid } from '../../../../utility/helpers/common'
import DeviationTab from './Tabs'
import UserInfoCard from './UserInfoCard'

const FinalUserView = ({ edit }) => {
  const [active, setActive] = useState('1')

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return isValid(edit) ? (
    <div className='app-edit-view'>
      <Row>
        <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
          <UserInfoCard edit={edit} visible={true} />
        </Col>
        <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
          <DeviationTab edit={edit} active={active} toggleTab={toggleTab} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'> {FM('no-deviation-found')} </h4>
    </Alert>
  )
}
export default FinalUserView
