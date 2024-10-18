import React, { useState } from 'react'
import StatsWithEmployee from './stats/StatsWithEmployee'
import { CardBody, Card, Row, Col, ButtonGroup } from 'reactstrap'
import ScheduleStats from './stats/ScheduleStats'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import { UserTypes } from '../../../utility/Const'
function ScReport() {
  const user = useUser()
  return (
    <div>
      <Row>
        <Hide IF={user?.user_type_id === UserTypes.employee}>
          <Col md={12}>
            <StatsWithEmployee />
          </Col>
        </Hide>

        <Col md={12}>
          <ScheduleStats />
        </Col>
      </Row>
    </div>
  )
}

export default ScReport
