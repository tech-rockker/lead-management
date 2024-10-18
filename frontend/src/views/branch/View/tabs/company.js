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
import { FM } from '../../../../utility/helpers/common'

const Company = ({ edit }) => {
  return (
    <>
      <Row className='p-2'>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('package-name')}</div>
            <p className=''> {edit?.subscription?.package_details?.name} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('validity')}</div>
            <p className=''> {edit?.subscription?.package_details?.validity_in_days} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('price')}</div>
            <p className=''> {edit?.subscription?.package_details?.price} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('discount')}</div>
            <p className=''> {edit?.subscription?.package_details?.discounted_price} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('employee')}</div>
            <p className=''> {edit?.subscription?.package_details?.number_of_employees} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('patient')}</div>
            <p className=''> {edit?.subscription?.package_details?.number_of_patients} </p>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Company
