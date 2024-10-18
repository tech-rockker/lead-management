import React from 'react'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'
import { formatDate } from '../../../../../utility/Utils'

function LinkedActivity({ edit }) {
  return (
    <>
      <Row className='p-2'>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('title')}</div>
            <p className=''> {edit?.resource_data?.activity?.title} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('with-deviation')}</div>
            <p className=''> {edit?.resource_data?.activity?.withDeviation} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('with-journal')}</div>
            <p className=''> {edit?.resource_data?.activity?.withJournal} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('start-date')}</div>
            <p className=''> {edit?.resource_data?.activity?.start_date} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('end-date')}</div>
            <p className=''> {edit?.resource_data?.activity?.end_date} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('start-time')}</div>
            <p className=''> {edit?.resource_data?.activity?.start_time} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className=''>
            <div className='h5 text-dark fw-bolder'>{FM('end-time')}</div>
            <p className=''> {edit?.resource_data?.activity?.end_time} </p>
          </div>
        </Col>
      </Row>
      <Row className='p-2'>
        <div className='h5 text-dark fw-bolder'>{FM('description')}</div>
        <p className=''> {edit?.resource_data?.activity?.description} </p>
      </Row>
    </>
  )
}

export default LinkedActivity
