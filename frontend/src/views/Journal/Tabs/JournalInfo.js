import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  CardBody,
  Col,
  Row,
  UncontrolledAccordion
} from 'reactstrap'
import { listJournalAction, viewJournalAction } from '../../../utility/apis/journal'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import { decrypt, formatDate, getValidTime, jsonDecodeAll, setValues } from '../../../utility/Utils'

const JournalInfo = ({ data, edit, loadingDetails }) => {
  const [activeTab, setActiveTab] = useState(false)
  const [id, setId] = useState(null)
  const [actionData, setActionData] = useState(null)

  const toggleTab = () => {
    setActiveTab(!activeTab)
  }
  log(edit)

  return (
    <>
      <Row className='p-2'>
        <Col md='6'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('category')}</div>
            <p className=''> {data?.category?.name} </p>
          </div>
        </Col>
        <Col md='6'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('sub-category')}</div>
            <p className=''> {data?.subcategory?.name} </p>
          </div>
        </Col>

        <Col md='6'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('incident-date')}</div>
            <p className=''>
              {' '}
              {formatDate(data?.date, 'DD MMMM YYYY')} {getValidTime(data?.time, 'h:mm A')}{' '}
            </p>
          </div>
        </Col>

        {/* <Col md="4">
                    <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>
                            {FM("time")}
                        </div>
                        <p className=''> {data?.time} </p>
                    </div>
                </Col> */}

        <Col md='6'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
            <p className=''> {formatDate(data?.created_at, 'DD MMMM YYYY hh : mm A')} </p>
          </div>
        </Col>
        <Col md='6'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('sign')}</div>
            <p className=''> {data?.is_signed === 1 ? FM('yes') : FM('no')} </p>
          </div>
        </Col>
        <Show IF={isValid(data?.signed_by_user)}>
          <Col md='6'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('signed-by')}</div>
              <p className=''>
                {' '}
                <span className='fw-bolder text-success'>
                  {decrypt(data?.signed_by_user?.name)} {FM('at')} {data?.signed_date}
                </span>{' '}
              </p>
            </div>
          </Col>
        </Show>
        {/* <Col md="3">
                    <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>
                            {FM("start-time")}
                        </div>
                        <p className=''> {edit?.start_time} </p>
                    </div>
                </Col>
                <Col md="3">
                    <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>
                            {FM("end-time")}
                        </div>
                        <p className=''> {edit?.end_time} </p>
                    </div>
                </Col> */}
      </Row>
      <div className='bottom-border'>
        <UncontrolledAccordion stayOpen defaultOpen='1' className='accordion-margin mt-2'>
          <AccordionItem>
            <AccordionHeader tag='h2' targetId={'1'}>
              {FM('description')}
            </AccordionHeader>
            <AccordionBody accordionId={'1'}>
              {
                <CardBody>
                  <Show IF={data?.description !== null}>
                    <p className='fw-bolder'> {data?.description} </p>
                  </Show>
                  <Show IF={data?.description === null}>
                    <div className='h5 text-dark fw-bolder'>{FM('reason')} :- </div>{' '}
                    <p className='fw-bold'> {data?.reason_for_editing} </p>
                  </Show>

                  <Row>
                    <Col md='4'>
                      <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
                        <p className=''>
                          {formatDate(data?.created_at, 'DD MMMM YYYY hh : mm A')}{' '}
                        </p>
                      </div>
                    </Col>
                    <Show IF={isValid(data?.edit_date)}>
                      <Col md='4'>
                        <div className='mb-2'>
                          <div className='h5 text-dark fw-bolder'>{FM('edited-at')}</div>
                          <p className=''> {data?.edit_date} </p>
                        </div>
                      </Col>
                    </Show>
                  </Row>
                  <hr />
                  {data?.journal_logs?.map((item, index) => {
                    return (
                      <Row className='border-bottom mb-2'>
                        <Col md='12'>
                          <div className='mb-2'>
                            <div className='h5 text-dark fw-bolder'>{FM('description')}</div>
                            <p className='' style={{ textDecoration: 'line-through' }}>
                              {' '}
                              {item?.description}{' '}
                            </p>
                          </div>
                        </Col>
                        <Col md='12'>
                          <div className='mb-2'>
                            <div className='h5 text-dark fw-bolder'>{FM('reason')}</div>
                            <p className='' style={{ textDecoration: 'line-through' }}>
                              {' '}
                              {item?.reason_for_editing}{' '}
                            </p>
                          </div>
                        </Col>
                        <Col md='4'>
                          <div className='mb-2'>
                            <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
                            <p className=''>
                              {formatDate(item?.created_at, 'DD MMMM YYYY hh : mm A')}{' '}
                            </p>
                          </div>
                        </Col>
                        <Col md='4'>
                          <div className='mb-2'>
                            <div className='h5 text-dark fw-bolder'>{FM('edited-at')}</div>
                            <p className=''>
                              {' '}
                              {formatDate(
                                item?.description_created_at,
                                'DD MMMM YYYY hh : mm A'
                              )}{' '}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    )
                  })}
                </CardBody>
              }
            </AccordionBody>
          </AccordionItem>
          <AccordionItem stayOpen>
            <AccordionHeader tag='h2' targetId={'2'}>
              {FM(`created-by`)}
            </AccordionHeader>
            <AccordionBody accordionId={'2'}>
              {
                <CardBody>
                  <Row>
                    <Col md='6'>
                      <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder '>{FM('name')}</div>
                        <p className=''> {data?.employee?.name} </p>
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder '>{FM('created-at')}</div>
                        <p className=''> {formatDate(data?.created_at, 'DD MMMM YYYY')} </p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              }
            </AccordionBody>
          </AccordionItem>
          <Show IF={isValid(data?.reason_for_editing)}>
            <AccordionItem stayOpen>
              <AccordionHeader tag='h2' targetId={'3'}>
                {FM(`edit-reason`)}
              </AccordionHeader>
              <AccordionBody accordionId={'3'}>
                {
                  <CardBody>
                    <Row>
                      <Col md='12'>
                        <div className='mb-2'>
                          <p className=''> {data?.reason_for_editing} </p>
                        </div>
                      </Col>
                    </Row>
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

export default JournalInfo
