import React from 'react'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'

const RelatedFactors = ({ ip }) => {
  return (
    <div className='p-1'>
      <Row className='border-top pt-2 align-items-start gy-2'>
        <Col md='6'>
          <p className='mb-0 text-dark fw-bolder'>{FM('body-functions')}</p>
          <p className='mb-0 fw-bold text-secondary mt-3px'>{ip?.body_functions ?? 'N/A'}</p>
        </Col>
        <Col md='6'>
          <p className='mb-0 text-dark fw-bolder'>{FM('personal-factors')}</p>
          <p className='mb-0 fw-bold text-secondary mt-3px'>{ip?.personal_factors ?? 'N/A'}</p>
        </Col>
        <Col md='6'>
          <p className='mb-0 text-dark fw-bolder'>{FM('health-conditions')}</p>
          <p className='mb-0 fw-bold text-secondary mt-3px'>{ip?.health_conditions ?? 'N/A'}</p>
        </Col>
        <Col md='6'>
          <p className='mb-0 text-dark fw-bolder'>{FM('other-factors')}</p>
          <p className='mb-0 fw-bold text-secondary mt-3px'>{ip?.other_factors ?? 'N/A'}</p>
        </Col>
      </Row>
    </div>
  )
}

export default RelatedFactors
