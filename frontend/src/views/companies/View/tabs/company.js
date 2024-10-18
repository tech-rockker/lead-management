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
import { currencyFormat, currencySign } from '../../../../utility/Utils'

const Company = ({ edit }) => {
  return (
    <>
      <Row className='p-2'>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('package-name')}</div>
            <p className=''> {edit?.subscription?.package_details?.name ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('validity')}</div>
            <p className=''> {edit?.subscription?.package_details?.validity_in_days ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('price')}</div>
            <p className=''>
              {' '}
              {currencyFormat(edit?.subscription?.package_details?.price) ?? 'N/A'}{' '}
            </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('discount')}</div>
            <p className=''>
              {' '}
              {currencyFormat(edit?.subscription?.package_details?.discounted_price) ?? 'N/A'}{' '}
            </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('employee')}</div>
            <p className=''>
              {' '}
              {edit?.subscription?.package_details?.number_of_employees ?? 'N/A'}{' '}
            </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('patient')}</div>
            <p className=''> {edit?.subscription?.package_details?.number_of_patients ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder '>{FM('Storage')}</div>
            <p className=''>
              {' '}
              {`${(edit?.used_storage / 1024).toFixed(2)} GB used out of ${
                edit?.total_storage / 1024
              } GB` ?? 'N/A'}{' '}
            </p>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Company
