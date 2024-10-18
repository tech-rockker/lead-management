import classNames from 'classnames'
import React from 'react'
import { Badge, CardBody, Col, Row } from 'reactstrap'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'

const Info = ({ leaveItem }) => {
  return (
    <div>
      <CardBody className=' border-top'>
        <Row className='align-items-start gy-2'>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('date')}</p>
            <p className='mb-0 fw-bold text-secondary'>{leaveItem?.date ?? 'N/A'}</p>
          </Col>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('reason')}</p>
            <p className='mb-0 fw-bold text-secondary'>{leaveItem?.reason ?? 'N/A'}</p>
          </Col>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('status')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {leaveItem?.is_approved === 1 ? FM('approved') : FM('not-approved')}
            </p>
          </Col>

          {/* <Col md="4">
                        <p className='mb-0 text-dark fw-bolder'>
                            {FM("shift-start-time")}
                        </p>
                        <p className='mb-0 fw-bold text-secondary'>
                            {followup?.shift_start_time}
                        </p>
                    </Col>

                    <Col md="4">
                        <p className='mb-0 text-dark fw-bolder'>
                            {FM("shift-end-time")}
                        </p>
                        <p className='mb-0 fw-bold text-secondary'>
                            {followup?.shift_end_time}
                        </p>
                    </Col> */}

          {/* <Col md="4">
                        <p className='mb-0 text-dark fw-bolder'>
                            {FM("end-time")}
                        </p>
                        <p className='mb-0 fw-bold text-secondary'>
                            {followup?.end_time}
                        </p>
                    </Col> */}

          {/* <Col md="4">
                        <p className='mb-0 text-dark fw-bolder'>
                            {FM("leave-applied")}
                        </p>
                        <p className={classNames('mb-0 fw-bold', { "text-success": followup?.leave_applied === 1, "text-danger": followup?.leave_applied === 0 })}>
                            {followup?.leave_applied === 1 ? FM("applied") : FM("no-applied-leave")}
                        </p>
                    </Col>
                    <Col md="4">
                        <p className='mb-0 text-dark fw-bolder'>
                            {FM("leave-approval")}
                        </p>
                        <p className={classNames('mb-0 fw-bold', { "text-success": followup?.leave_approval === 1, "text-danger": followup?.leave_approval === 0 })}>
                            {followup?.leave_applied === 1 ? FM("leave-approved") : FM("no-approved-leave")}
                        </p>
                    </Col> */}
        </Row>
        {/* <Row className='mt-2 border-top gy-2'>
                    <Col md="12">
                        <p className='mb-0 text-dark fw-bolder'>
                            {FM("description")}
                        </p>
                        <p className='mb-0 fw-bold text-secondary'>
                            {followup?.description}
                        </p>
                    </Col>
                    <Col md="12">
                        <p className='mb-0 text-dark fw-bolder'>
                            {FM("remarks")}
                        </p>
                        <p className='mb-0 fw-bold text-secondary'>
                            {followup?.remarks}
                        </p>
                    </Col>
                    <Show IF={isValid(followup?.comment)}>
                        <Col md="6">
                            <p className='mb-0 text-dark fw-bolder'>
                                {FM("comment")}
                            </p>
                            <p className='mb-0 fw-bold text-secondary'>
                                {followup?.comment}
                            </p>
                        </Col>
                    </Show>
                    <Show IF={isValid(followup?.reason_for_editing)}>
                        <Col md="6">
                            <p className='mb-0 text-dark fw-bolder'>
                                {FM("reason-for-editing")}
                            </p>
                            <p className='mb-0 fw-bold text-secondary'>
                                {followup?.reason_for_editing}
                            </p>
                        </Col>
                    </Show>
                </Row> */}
        {/* <Show IF={followup?.is_completed === 1}>
                    <Row className='mt-2 border-top gy-2'>
                        <Col md="4">
                            <p className='mb-0 text-dark fw-bolder'>
                                {FM("completed-by")}
                            </p>
                            <p className='mb-0 fw-bold text-secondary'>
                                {followup?.action_by_user?.name}
                            </p>
                        </Col>
                        <Col md="4">
                            <p className='mb-0 text-dark fw-bolder'>
                                {FM("completed-on")}
                            </p>
                            <p className='mb-0 fw-bold text-secondary'>
                                {followup?.action_date}
                            </p>
                        </Col>
                        <Col md="4">
                            <p className='mb-0 text-dark fw-bolder'>
                                {FM("witnessed_by")}
                            </p>
                            <p className='mb-0 fw-bold text-secondary'>
                                {isValidArray(followup?.witness_List) ? followup?.witness_List?.map((d) => {
                                    return (
                                        <Badge color='primary' className='me-1 mb-3px'>
                                            {d?.name}
                                        </Badge>
                                    )
                                }) : null}
                                {followup?.more_witness?.map((d) => {
                                    if (isValid(d?.first_name)) {
                                        return (
                                            <Badge color='primary' className='me-1 mb-3px'>
                                                {d?.first_name} {d?.last_name}
                                            </Badge>
                                        )
                                    }
                                })}
                            </p>
                        </Col>

                    </Row>
                </Show> */}
      </CardBody>
    </div>
  )
}

export default Info
