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
import { decrypt } from '../../../../../utility/Utils'

const AssignedPatient = ({ user }) => {
  const [open, setOpen] = useState('1')

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id)
  }
  return (
    <div className='bottom-border'>
      {user?.employee_patients?.map((d, i) => {
        return (
          <>
            <CardBody>
              <Row>
                <Col md='6'>
                  <div className='mb-2' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('name')}</div>
                    <p className=''> {decrypt(d?.patient?.name) ?? 'N/A'} </p>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='mb-2' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('email')}</div>
                    <p className=''> {decrypt(d?.patient?.email) ?? 'N/A'} </p>
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

export default AssignedPatient
