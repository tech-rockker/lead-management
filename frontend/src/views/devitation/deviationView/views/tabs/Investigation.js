import React from 'react'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'

const Investigation = ({ edit }) => {
  const cleanString = (str) => {
    if (!str) return '' // Return an empty string for null or undefined

    // Parse JSON string to array
    return Object.entries(JSON.parse(str)).map(([key, value]) => (
      <ul>
        <li key={key}>{FM(value)}</li>
      </ul>
    ))
  }

  return (
    <>
      <Row className='p-2'>
        <Col md='12'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('followups')}</div>
            <p className=''> {edit?.follow_up} </p>
          </div>
        </Col>
        <Col md='6'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('further-investigation')}</div>
            <p className=''>
              {edit?.further_investigation && cleanString(edit?.further_investigation)}
            </p>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Investigation
