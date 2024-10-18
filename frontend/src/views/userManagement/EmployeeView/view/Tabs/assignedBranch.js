import React, { useState } from 'react'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  CardBody,
  Col,
  Row,
  UncontrolledAccordion
} from 'reactstrap'
import { FM, isValidArray } from '../../../../../utility/helpers/common'

const AssignedBranch = ({ user }) => {
  const [open, setOpen] = useState('1')

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id)
  }
  return (
    <div className='bottom-border'>
      {user?.employee_branches?.map((d, i) => {
        return (
          <>
            <CardBody>
              <Row>
                <Col md='6'>
                  <div className='mb-2' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('name')}</div>
                    <p className=''> {d?.branch?.branch_name ?? 'N/A'} </p>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='mb-2' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('email')}</div>
                    <p className=''> {d?.branch?.branch_email ?? 'N/A'} </p>
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

export default AssignedBranch
