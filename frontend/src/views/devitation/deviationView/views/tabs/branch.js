import React from 'react'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'
import { formatDate } from '../../../../../utility/Utils'

const Branch = ({ edit }) => {
  return (
    <>
      <Row className='p-2'>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('name')}</div>
            <p className=''> {edit?.branch?.branch_name ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('contact-person-name')}</div>
            <p className=''> {edit?.branch?.contact_person_name ?? 'N/A'} </p>
          </div>
        </Col>
        {edit?.branch?.company_types ? (
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('branch-type')}</div>
              <p className=''>
                {' '}
                {edit?.branch?.company_types?.map((d, i) => {
                  return <>{d?.name ?? 'N/A'}</>
                })}{' '}
              </p>
            </div>
          </Col>
        ) : null}
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('contact-number')}</div>
            <p className=''>{edit?.branch?.contact_number ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('email')}</div>
            <p className=''>{edit?.branch?.email ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
            <p className=''>{formatDate(edit?.branch?.created_at, 'DD MMMM YYYY')} </p>
          </div>
        </Col>
        <Col md='12'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('address')}</div>
            <p className=''>{edit?.branch?.full_address ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('postal-area')}</div>
            <p className=''>{edit?.branch?.postal_area ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('city')}</div>
            <p className=''>{edit?.branch?.city ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('zipcode')}</div>
            <p className=''>{edit?.branch?.zipcode ?? 'N/A'}</p>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Branch
