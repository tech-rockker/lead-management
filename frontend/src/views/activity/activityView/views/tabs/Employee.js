import React from 'react'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  CardBody,
  Col,
  Row,
  UncontrolledAccordion
} from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'

const Employee = ({ edit }) => {
  return (
    <>
      {/* {
                edit?.assign_employee?.map((d, i) => {
                    return (<>
                        <CardBody>
                            <Row>
                                <Col md="6">
                                    <div className='mb-2' key={i}>
                                        <div className='h6 '>
                                            {FM("name")}
                                        </div>
                                        <p className=''> {d?.employee?.name} </p>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className='mb-2' key={i}>
                                        <div className='h6 '>
                                            {FM("email")}
                                        </div>
                                        <p className=''> {d?.employee?.email} </p>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className='mb-2' key={i}>
                                        <div className='h6 '>
                                            {FM("assignment_date")}
                                        </div>
                                        <p className=''> {d?.assignment_date} </p>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className='mb-2' key={i}>
                                        <div className='h6 '>
                                            {FM("assignment_day")}
                                        </div>
                                        <p className=''> {d?.assignment_day} </p>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className='mb-2' key={i}>
                                        <div className='h6 '>
                                            {FM("reason")}
                                        </div>
                                        <p className=''> {d?.reason} </p>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </>
                    )
                })
            } */}

      <div className='bottom-border'>
        {/* <UncontrolledAccordion defaultOpen={"2"} className='accordion-margin mt-2'> */}
        {/* <AccordionItem >
                        <AccordionHeader tag='h2' targetId={'1'}>
                            {FM(`created-by`)}
                        </AccordionHeader>
                        <AccordionBody accordionId={'1'}>
                            {<CardBody>
                                <Row>
                                    <Col md="6">
                                        <div className='mb-2'>
                                            <div className='h5 text-dark fw-bolder '>
                                                {FM("name")}
                                            </div>
                                            <p className=''> {edit?.action_by_user?.name} </p>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className='mb-2'>
                                            <div className='h5 text-dark fw-bolder '>
                                                {FM("email")}
                                            </div>
                                            <p className=''> {edit?.action_by_user?.email} </p>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>}
                        </AccordionBody>
                    </AccordionItem> */}
        {/* <AccordionItem >
                        <AccordionHeader tag='h2' targetId={'2'} className='text-dark fw-bolder'>
                            {FM(`assigned-employee`)}
                        </AccordionHeader>
                        <AccordionBody accordionId={'2'}> */}
        {edit?.assign_employee?.map((d, i) => {
          return (
            <>
              <CardBody>
                <Row>
                  <Col md='4'>
                    <div className='mb-2' key={i}>
                      <div className='h5 text-dark fw-bolder '>{FM('name')}</div>
                      <p className=''> {d?.employee?.name} </p>
                    </div>
                  </Col>
                  <Col md='4'>
                    <div className='mb-2' key={i}>
                      <div className='h5 text-dark fw-bolder '>{FM('email')}</div>
                      <p className=''> {d?.employee?.email} </p>
                    </div>
                  </Col>
                  <Col md='4'>
                    <div className='mb-2' key={i}>
                      <div className='h5 text-dark fw-bolder '>{FM('assignment_date')}</div>
                      <p className=''> {d?.assignment_date} </p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </>
          )
        })}
        {/* </AccordionBody>
                    </AccordionItem>
                </UncontrolledAccordion> */}
      </div>
    </>
  )
}

export default Employee
