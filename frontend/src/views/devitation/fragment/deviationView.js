import React, { useState } from 'react'
import { Col, Row } from 'reactstrap'
import Shimmer from '../../components/shimmers/Shimmer'
import Tabs from '../deviationView/views/Tabs'
import UserInfoCards from '../deviationView/views/UserInfoCard'

const DeviationView = ({ edit, comments, loadingDetails }) => {
  const [active, setActive] = useState('1')

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <>
      {loadingDetails ? (
        <>
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
        </>
      ) : (
        <>
          <div className='app-edit-view'>
            <Row>
              <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                <UserInfoCards edit={edit} />
              </Col>
              <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
                <Tabs edit={edit} active={active} toggleTab={toggleTab} />
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  )
}

export default DeviationView
