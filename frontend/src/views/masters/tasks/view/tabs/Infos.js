import classNames from 'classnames'
import React, { useState } from 'react'
import { File, FileText } from 'react-feather'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  CardBody,
  Col,
  Row,
  UncontrolledAccordion
} from 'reactstrap'
import { FM, isValid, log } from '../../../../../utility/helpers/common'
import Show from '../../../../../utility/Show'
import { decrypt, formatDate } from '../../../../../utility/Utils'
import BsTooltip from '../../../../components/tooltip'

const Infos = ({ edit }) => {
  const [activeTab, setActiveTab] = useState(false)
  const toggleTab = () => {
    setActiveTab(!activeTab)
  }
  return (
    <>
      <Row className='p-2 pb-0 border-top border-bottom'>
        <Col md='3'>
          <div className='mb-0'>
            <div className='h5 text-dark fw-bolder'>{FM('title')}</div>
            <p className=''> {edit?.title} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
            <p className=''> {formatDate(edit?.created_at, 'DD MMMM YYYY')} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('created-by')}</div>
            <p className=''> {edit?.created_by?.name} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-0'>
            <div className='h5 text-dark fw-bolder'>{FM('status')}</div>
            <p
              className={classNames({
                'text-success': edit?.status === 1,
                'text-danger': edit?.status === 0
              })}
            >
              {edit?.status === 1 ? (
                <>
                  {FM('completed')} {FM('by')}{' '}
                  <span className='fw-bolder'>{decrypt(edit?.action_by?.name)}</span> {FM('on')}{' '}
                  <span className='fw-bolder'>
                    {formatDate(edit?.action_date, 'DD MMMM, YYYY')}
                  </span>
                </>
              ) : (
                FM('incomplete')
              )}
            </p>
          </div>
        </Col>
      </Row>

      {/* <Row className='p-2 pb-0 border-top border-bottom'>


                <Col md="3">
                    <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>
                            {FM("category")}
                        </div>
                        <p className=''> {edit?.category?.name ?? 'N/A'} </p>
                    </div>
                </Col>
                <Col md="3">
                    <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>
                            {FM("sub-category")}
                        </div>
                        <p className=''> {edit?.subcategory?.name ?? 'N/A'} </p>
                    </div>
                </Col>
            </Row> */}
      <Row className='p-2 pb-0 border-top border-bottom'>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('start-date')}</div>
            <p className=''> {edit?.start_date} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('end-date')}</div>
            <p className=''> {edit?.end_date} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('start-time')}</div>
            <p className=''> {edit?.start_time} </p>
          </div>
        </Col>
        <Col md='3'>
          <div className=''>
            <div className='h5 text-dark fw-bolder'>{FM('end-time')}</div>
            <p className=''> {edit?.end_time} </p>
          </div>
        </Col>
      </Row>
      <Row className='p-2'>
        <Col md='6'>
          <div className='h5 text-dark fw-bolder'>{FM('description')}</div>
          <p className=''> {edit?.description} </p>
        </Col>
        <Show IF={isValid(edit?.admin_file)}>
          {console.log(edit)}
          <Col md='6'>
            <div className='h5 text-dark fw-bolder'>{FM('document')}</div>
            <BsTooltip role='button' title={''}>
              <a target={'_blank'} href={edit?.admin_file?.file_path}>
                <File className='text-primary' />
              </a>
            </BsTooltip>
          </Col>
        </Show>
      </Row>
      <Show IF={edit?.status === 1}>
        <Row className='mt-2 border-top gy-2'>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('completed-by')}</p>
            <p className='mb-0 fw-bold text-secondary'>{decrypt(edit?.action_by?.name)}</p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('completed-on')}</p>
            <p className='mb-0 fw-bolder text-success'>{edit?.action_date}</p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('comment')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              <p className='mb-0 fw-bold text-secondary'>{edit?.comment}</p>
            </p>
          </Col>
        </Row>
      </Show>
    </>
  )
}

export default Infos
