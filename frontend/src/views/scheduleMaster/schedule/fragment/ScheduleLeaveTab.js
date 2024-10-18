import classNames from 'classnames'
import React, { useContext } from 'react'
import { ExternalLink } from 'react-feather'
import { Badge, CardBody, Col, Row } from 'reactstrap'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { FM, isValid } from '../../../../utility/helpers/common'
import { formatDate } from '../../../../utility/Utils'

const LeaveTab = ({ followup }) => {
  const { colors } = useContext(ThemeColors)

  return (
    <div>
      {followup?.leave_assigned_to?.map((d, i) => {
        return (
          <>
            <CardBody className=' border-top'>
              <Row className='align-items-start gy-2'>
                <Col md='6'>
                  <div className='mb-2' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('name')}</div>
                    <p className=''> {d?.user?.name} </p>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='mb-2' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('assigned-at')}</div>
                    <p className=''> {formatDate(d?.user?.created_at, 'DD MMMM, YYYY')} </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </>
        )
      })}
    </div>
  )
}

export default LeaveTab
