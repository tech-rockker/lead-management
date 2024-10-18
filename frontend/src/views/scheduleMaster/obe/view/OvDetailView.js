import '@styles/react/apps/app-users.scss'
import React from 'react'
import { Calendar, Clock, User } from 'react-feather'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import { formatDate } from '../../../../utility/Utils'
import Shimmer from '../../../components/shimmers/Shimmer'

const OvDetailView = ({ edit, loadingDetails }) => {
  console.log(edit)

  return (
    <>
      {loadingDetails ? (
        <>
          <Row>
            <Col md='12'>
              <Shimmer style={{ height: 40 }} />
            </Col>
            <Col md='12'>
              <Shimmer style={{ height: 40 }} />
            </Col>
            <Col md='12' className='mt-2'>
              <Shimmer style={{ height: 320 }} />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <CardBody className=''>
            <Row className='align-items-center'>
              <Col md='6'>
                <p className='mb-0 text-dark fw-bolder'>{FM('title')}</p>
                <p className='mb-0 fw-bold text-secondary text-truncate'>
                  <User size={14} /> {edit?.title}
                </p>
              </Col>
              <Col md='6'>
                <p className='mb-0 text-dark fw-bolder'>{FM('date')}</p>
                <p className='mb-0 fw-bold text-secondary text-truncate'>
                  <Calendar size={14} /> {formatDate(edit?.date, 'DD MMMM, YYYY')}
                </p>
              </Col>
              <Col md='6' className='mt-1'>
                <p className='mb-0 text-dark fw-bolder'>{FM('start-time')}</p>
                <p className='mb-0 fw-bold text-truncate'>
                  <Clock size={14} /> {edit?.start_time}
                </p>
              </Col>
              <Col md='6' className='mt-1'>
                <p className='mb-0 text-dark fw-bolder'>{FM('end-time')}</p>
                <p className='mb-0 fw-bold text-secondary text-truncate'>
                  <Clock size={14} /> {edit?.end_time}
                </p>
              </Col>
            </Row>
          </CardBody>
          <CardBody className=' border-top'>
            <Row className='align-items-center'>
              <Col md='6'>
                <p className='mb-0 text-dark fw-bolder'>{FM('updated-at')}</p>
                <p className='mb-0 fw-bold text-truncate'>
                  <a className='text-secondary'>
                    <Calendar size={14} /> {formatDate(edit?.updated_at, 'DD MMMM, YYYY')}
                  </a>
                </p>
              </Col>
              <Show IF={edit?.deleted_at !== null}>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('deleted-at')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Calendar size={14} /> {formatDate(edit?.deleted_at, 'DD MMMM, YYYY')}
                    </a>
                  </p>
                </Col>
              </Show>
            </Row>
          </CardBody>
        </>
      )}
    </>
  )
}
export default OvDetailView
