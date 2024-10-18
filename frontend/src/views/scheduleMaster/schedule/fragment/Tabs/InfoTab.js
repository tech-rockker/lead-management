import classNames from 'classnames'
import React, { useContext } from 'react'
import { ExternalLink } from 'react-feather'
import { Badge, CardBody, Col, Row } from 'reactstrap'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'
import Show from '../../../../../utility/Show'
import BsTooltip from '../../../../components/tooltip'
import ApproveScheduleModal from '../ApproveScheduleModal'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { formatDate } from '../../../../../utility/Utils'
const InfoTab = ({ followup }) => {
  const { colors } = useContext(ThemeColors)
  return (
    <div>
      <CardBody className=' border-top'>
        <Row className='align-items-start gy-2'>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('shift-name')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {isValid(followup?.shift_name) ? followup?.shift_name : 'N/A'}
            </p>
          </Col>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('shift-date')}</p>
            <p className='mb-0 fw-bold text-secondary'>{formatDate(followup?.shift_date)}</p>
          </Col>

          {/* <Col md="4">
                        <p className='mb-0 text-dark fw-bolder'>
                            {FM("end-time")}
                        </p>
                        <p className='mb-0 fw-bold text-secondary'>
                            {followup?.end_time}
                        </p>
                    </Col> */}
        </Row>
        <Row className='mt-2 border-top gy-2'>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('shift-start-time')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {formatDate(followup?.shift_start_time, 'HH:mm')}
            </p>
          </Col>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('shift-end-time')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {formatDate(followup?.shift_end_time, 'HH:mm')}
            </p>
          </Col>
        </Row>
        <Row className='mt-2 border-top gy-2'>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('rest-start-time')}</p>
            <p className='mb-0 fw-bold text-secondary'>{followup?.rest_start_time ?? 'N/A'}</p>
          </Col>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('rest-end-time')}</p>
            <p className='mb-0 fw-bold text-secondary'>{followup?.rest_end_time ?? 'N/A'}</p>
          </Col>
        </Row>
        <Show IF={followup?.leave_applied === 1}>
          <Row className='mt-2 border-top gy-1'>
            <Col md='6'>
              <p className='mb-0 text-dark fw-bolder'>{FM('leave-applied')}</p>
              <p
                className={classNames('mb-0 fw-bold', {
                  'text-success': followup?.leave_applied === 1,
                  'text-danger': followup?.leave_applied === 0
                })}
              >
                {followup?.leave_applied === 1 ? FM('applied') : FM('not-applied')}
              </p>
            </Col>
            <Col md='6'>
              <p className='mb-0 text-dark fw-bolder'>{FM('leave-approval')}</p>
              <p
                className={classNames('mb-0 fw-bold', {
                  'text-success': followup?.leave_approved === 1,
                  'text-danger': followup?.leave_approved === 0
                })}
              >
                {followup?.leave_approved === 1 ? FM('approved') : FM('not-approved')}
              </p>
            </Col>
            <Show IF={isValid(followup?.leave_applied_date)}>
              <Col md='6'>
                <p className='mb-0 text-dark fw-bolder'>{FM('leave-applied-date')}</p>
                <p
                  className={classNames('mb-0 fw-bold', {
                    'text-success': followup?.leave_applied === 1,
                    'text-danger': followup?.leave_applied === 0
                  })}
                >
                  {formatDate(followup?.leave_applied_date, 'DD MMMM, YYYY')}
                </p>
              </Col>
            </Show>
            <Show IF={isValid(followup?.leave_approved_date_time)}>
              <Col md='6'>
                <p className='mb-0 text-dark fw-bolder'>{FM('leave-approval-date')}</p>
                <p
                  className={classNames('mb-0 fw-bold', {
                    'text-success': followup?.leave_approved === 1,
                    'text-danger': followup?.leave_approved === 0
                  })}
                >
                  {formatDate(followup?.leave_approved_date_time, 'DD MMMM, YYYY')}
                </p>
              </Col>
            </Show>
          </Row>
        </Show>
      </CardBody>
    </div>
  )
}

export default InfoTab
