import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  CardBody,
  Col,
  Row,
  UncontrolledAccordion
} from 'reactstrap'
import { FM, isValid } from '../../../../../utility/helpers/common'
import Show from '../../../../../utility/Show'
import { decrypt, formatDate } from '../../../../../utility/Utils'

const DevDetail = ({ edit }) => {
  const [activeTab, setActiveTab] = useState(false)
  const toggleTab = () => {
    setActiveTab(!activeTab)
  }
  return (
    <>
      <Row className='p-2'>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('category')}</div>
            <p className=''> {edit?.category?.name} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('sub-category')}</div>
            <p className=''> {edit?.subcategory?.name} </p>
          </div>
        </Col>
        {/* <Col md="4">
                    <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>
                            {FM("branch")}
                        </div>
                        <p className=''> {edit?.branch?.branch_name} </p>
                    </div>
                </Col> */}
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('date-time')}</div>
            <p className=''> {formatDate(edit?.date_time, 'DD MMMM YYYY  HH:mm')} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
            <p className=''> {formatDate(edit?.created_at, 'DD MMMM YYYY')} </p>
          </div>
        </Col>
        {edit?.edited_date ? (
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('edited-date')}</div>
              <p className=''> {formatDate(edit?.edited_date, 'DD MMMM YYYY')} </p>
            </div>
          </Col>
        ) : null}
        {isValid(edit?.employee) ? (
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('created_by')}</div>
              <p className=''> {edit?.employee?.name} </p>
            </div>
          </Col>
        ) : null}
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-danger fw-bolder'>{FM('severity-level')}</div>
            <p className=''> {edit?.critical_range} </p>
          </div>
        </Col>
        <Show IF={isValid(edit?.completed_by)}>
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('signed-by')}</div>
              <p className=''>
                {' '}
                <span className='fw-bolder text-success'>
                  {decrypt(edit?.completed_by?.name)} {FM('at')} {edit?.completed_date}
                </span>{' '}
              </p>
            </div>
          </Col>
        </Show>
      </Row>
      <div className='bottom-border'>
        <UncontrolledAccordion className='accordion-margin mt-2'>
          <AccordionItem>
            <AccordionHeader tag='h2' targetId={'1'}>
              {FM(`related-factor`)}
            </AccordionHeader>
            <AccordionBody accordionId={'1'}>
              {
                <CardBody>
                  {/* <p className=''> {edit?.related_factor} </p> */}
                  <Zoom>
                    <img src={edit?.related_factor} className='img-fluid' />
                  </Zoom>
                </CardBody>
              }
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader tag='h2' targetId={'2'}>
              {FM(`description`)}
            </AccordionHeader>
            <AccordionBody accordionId={'2'}>
              {
                <CardBody>
                  <p className=''> {edit?.description} </p>
                </CardBody>
              }
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader tag='h2' targetId={'3'}>
              {FM(`immediate-action`)}
            </AccordionHeader>
            <AccordionBody accordionId={'3'}>
              {
                <CardBody>
                  <p className=''> {edit?.immediate_action} </p>
                </CardBody>
              }
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader tag='h2' targetId={'4'}>
              {FM(`probable-cause-of-the-incident`)}
            </AccordionHeader>
            <AccordionBody accordionId={'4'}>
              {
                <CardBody>
                  <p className=''> {edit?.probable_cause_of_the_incident} </p>
                </CardBody>
              }
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader tag='h2' targetId={'5'}>
              {FM(`suggestions`)}
            </AccordionHeader>
            <AccordionBody accordionId={'5'}>
              {
                <CardBody>
                  <p className=''> {edit?.suggestion_to_prevent_event_again} </p>
                </CardBody>
              }
            </AccordionBody>
          </AccordionItem>
          <Show IF={edit?.reason_for_editing !== null}>
            <AccordionItem>
              <AccordionHeader tag='h2' targetId={'6'}>
                {FM('edit-reason')}
              </AccordionHeader>
              <AccordionBody accordionId={'6'}>
                {
                  <CardBody>
                    <p className=''> {edit?.reason_for_editing} </p>
                  </CardBody>
                }
              </AccordionBody>
            </AccordionItem>
          </Show>
        </UncontrolledAccordion>
      </div>
    </>
  )
}

export default DevDetail
