import classNames from 'classnames'
import React from 'react'
import { Badge, CardBody, Col, Row } from 'reactstrap'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'

const InfoTab = ({ followup }) => {
  return (
    <div>
      <CardBody className=' border-top'>
        <Row className='align-items-start gy-2'>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('title')}</p>
            <p className='mb-0 fw-bold text-secondary'>{followup?.title}</p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('start-date')}</p>
            <p className='mb-0 fw-bold text-secondary'>{followup?.start_date}</p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('end-date')}</p>
            <p className='mb-0 fw-bold text-secondary'>{followup?.end_date}</p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('start-time')}</p>
            <p className='mb-0 fw-bold text-secondary'>{followup?.start_time}</p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('end-time')}</p>
            <p className='mb-0 fw-bold text-secondary'>{followup?.end_time}</p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('status')}</p>
            <p
              className={classNames('mb-0 fw-bold', {
                'text-success': followup?.is_completed === 1,
                'text-danger': followup?.status === 0
              })}
            >
              {followup?.is_completed === 1 ? FM('completed') : FM('incomplete')}
            </p>
          </Col>
        </Row>
        <Row className='mt-2 border-top gy-2'>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('description')}</p>
            <p className='mb-0 fw-bold text-secondary'>{followup?.description}</p>
          </Col>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('comment')}</p>
            <p className='mb-0 fw-bold text-secondary'>{followup?.remarks}</p>
          </Col>

          <Show IF={isValid(followup?.reason_for_editing)}>
            <Col md='6'>
              <p className='mb-0 text-dark fw-bolder'>{FM('reason-for-editing')}</p>
              <p className='mb-0 fw-bold text-secondary'>{followup?.reason_for_editing}</p>
            </Col>
          </Show>
        </Row>
        <Show IF={followup?.is_completed === 1}>
          <Row className='mt-2 border-top gy-2'>
            <Col md='4'>
              <p className='mb-0 text-dark fw-bolder'>{FM('completed-by')}</p>
              <p className='mb-0 fw-bold text-secondary'>{followup?.action_by_user?.name}</p>
            </Col>
            <Col md='4'>
              <p className='mb-0 text-dark fw-bolder'>{FM('completed-on')}</p>
              <p className='mb-0 fw-bold text-secondary'>{followup?.action_date}</p>
            </Col>

            <Col md='4'>
              <p className='mb-0 text-dark fw-bolder'>{FM('witnessed_by')}</p>
              <p className='mb-0 fw-bolder text-dark'>
                {isValidArray(followup?.witness_List)
                  ? followup?.witness_List?.map((d) => {
                      return (
                        <p color='primary' className='me-1 mb-25'>
                          - {d?.user?.name}
                        </p>
                      )
                    })
                  : null}
                {followup?.more_witness?.map((d) => {
                  if (isValid(d?.first_name)) {
                    return (
                      <p color='primary' className='me-1 mb-25'>
                        - {d?.first_name} {d?.last_name}
                      </p>
                    )
                  }
                })}
              </p>
            </Col>
            <Show IF={isValid(followup?.comment)}>
              <Col md='12'>
                <p className='mb-0 text-dark fw-bolder'>{FM('comment')}</p>
                <p className='mb-0 fw-bold text-secondary'>{followup?.comment}</p>
              </Col>
            </Show>
          </Row>
        </Show>
      </CardBody>
    </div>
  )
}

export default InfoTab
