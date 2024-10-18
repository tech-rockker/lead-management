import React from 'react'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'

const OverallGoal = ({ ip }) => {
  return (
    <div className='p-1'>
      <Row className='border-top pt-2'>
        <Col md='12'>
          <p className='mb-0 text-dark fw-bolder'>{FM('overall-goal')}</p>
          <p className='mb-0 fw-bold text-secondary'>{FM(ip?.overall_goal)}</p>
          <p className='mb-0 fw-bold text-secondary mt-1'>{ip?.overall_goal_details}</p>
        </Col>
      </Row>
    </div>
  )
}

export default OverallGoal
