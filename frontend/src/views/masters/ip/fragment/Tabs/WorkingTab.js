import React from 'react'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'

const WorkingTab = ({ ip }) => {
  return (
    <div className='p-1'>
      <Row className='border-top pt-2 align-items-start gy-2'>
        <Col md='6'>
          <p className='mb-0 text-dark fw-bolder'>{FM('treatment')}</p>
          <p className='mb-0 fw-bold text-secondary mt-3px'>{ip?.treatment ?? 'N/A'}</p>
        </Col>
        <Col md='6'>
          <p className='mb-0 text-dark fw-bolder'>{FM('working_method')}</p>
          <p className='mb-0 fw-bold text-secondary mt-3px'>{ip?.working_method ?? 'N/A'}</p>
        </Col>
      </Row>
    </div>
  )
}

export default WorkingTab
