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
import { FM } from '../../../../../../utility/helpers/common'
import { decrypt } from '../../../../../../utility/Utils'

const AssignedEmployee = ({ user }) => {
  const [open, setOpen] = useState('1')

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id)
  }
  return (
    <div className='bottom-border'>
      {user?.patient_employees?.map((d, i) => {
        return (
          <>
            <CardBody>
              <Row>
                <Col md='6'>
                  <div className='mb-2' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('name')}</div>
                    <p className=''> {decrypt(d?.employee?.name) ?? 'N/A'} </p>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='mb-2' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('email')}</div>
                    <p className=''> {decrypt(d?.employee?.email) ?? 'N/A'} </p>
                  </div>
                </Col>
                <hr />
                {/* <Col md="6">
                                    <div className='mb-2' key={i}>
                                        <div className='h5 text-dark fw-bolder '>
                                            {FM("assignment_date")}
                                        </div>
                                        <p className=''> {d?.assignment_date ?? 'N/A'} </p>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className='mb-2' key={i}>
                                        <div className='h5 text-dark fw-bolder '>
                                            {FM("assignment_day")}
                                        </div>
                                        <p className=''> {d?.assignment_day ?? 'N/A'} </p>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className='mb-2' key={i}>
                                        <div className='h5 text-dark fw-bolder '>
                                            {FM("reason")}
                                        </div>
                                        <p className=''> {d?.reason ?? 'N/A'} </p>
                                    </div>
                                </Col> */}
              </Row>
            </CardBody>
          </>
        )
      })}
    </div>
  )
}

export default AssignedEmployee
