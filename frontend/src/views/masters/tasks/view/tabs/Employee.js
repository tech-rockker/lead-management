import React, { useState } from 'react'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledAccordion
} from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'

const Employee = ({ edit }) => {
  const [open, setOpen] = useState('1')

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id)
  }
  return (
    <div className='bottom-border'>
      {edit?.assign_employee?.map((d, i) => {
        return (
          <Card className='mb-1'>
            <CardBody>
              <Row>
                <Col md='4'>
                  <div className='' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('name')}</div>
                    <p className='mb-0'> {d?.employee?.name ?? 'N/A'} </p>
                  </div>
                </Col>
                <Col md='4'>
                  <div className='' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('email')}</div>
                    <p className='mb-0'> {d?.employee?.email ?? 'N/A'} </p>
                  </div>
                </Col>
                <Col md='4'>
                  <div className='' key={i}>
                    <div className='h5 text-dark fw-bolder '>{FM('assignment_date')}</div>
                    <p className='mb-0'> {d?.assignment_date ?? 'N/A'} </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}

export default Employee
