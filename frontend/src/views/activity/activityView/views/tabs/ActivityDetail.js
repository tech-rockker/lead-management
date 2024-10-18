import classNames from 'classnames'
import React, { useState } from 'react'
import { File, Send } from 'react-feather'
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
import MiniTable from '../../../../components/tableGrid/miniTable'
import BsTooltip from '../../../../components/tooltip'
import ReplyModal from '../../../modals/ReplyModal'
import useUser from '../../../../../utility/hooks/useUser'
import useUserType from '../../../../../utility/hooks/useUserType'
import { UserTypes } from '../../../../../utility/Const'

const ActivityDetail = ({ edit, comments }) => {
  const [activeTab, setActiveTab] = useState(false)
  const userType = useUserType()
  const toggleTab = () => {
    setActiveTab(!activeTab)
  }
  return (
    <>
      <Row className='p-2 pb-0 border-top border-bottom'>
        <Col md='2'>
          <div className='mb-0'>
            <div className='h5 text-dark fw-bolder'>{FM('title')}</div>
            <p className=''> {edit?.title} </p>
          </div>
        </Col>
        <Col md='2'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
            <p className=''> {formatDate(edit?.created_at, 'DD MMMM YYYY')} </p>
          </div>
        </Col>
        <Col md='2'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('created-by')}</div>
            <p className=''>{decrypt(edit?.created_by?.name)}</p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('series')}</div>
            <p className=''>
              {' '}
              {formatDate(edit?.series_start_date, 'DD MMMM YYYY')} -{' '}
              {formatDate(edit?.series_end_date, 'DD MMMM YYYY')}{' '}
            </p>
          </div>
        </Col>
        <Col md='2'>
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
                  <span className='fw-bolder'>{decrypt(edit?.action_by_user?.name)}</span>{' '}
                  {FM('on')}{' '}
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
      <Row className='p-2 pb-0 border-bottom'>
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
        <Show IF={isValid(edit?.admin_file?.file_path)}>
          <Col md='4'>
            <div className='h5 text-dark fw-bolder'>{FM('document')}</div>
            <BsTooltip role='button' title={''}>
              <a target={'_blank'} href={edit?.admin_file?.file_path}>
                <File className='text-primary' />
              </a>
            </BsTooltip>
          </Col>
        </Show>
      </Row>
      <Row className='p-2 pb-0'>
        {/* <Col md="3">
                    <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>
                            {FM("created-by")}
                        </div>
                        <p className=''> {formatDate(edit?.created_at, "DD MMMM YYYY")} </p>
                    </div>
                </Col> */}
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
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('end-time')}</div>
            <p className=''> {edit?.end_time} </p>
          </div>
        </Col>
      </Row>
      <div className='bottom-border'>
        <UncontrolledAccordion className='accordion-margin mt-2'>
          <AccordionItem>
            <AccordionHeader tag='h2' targetId={'1'}>
              {FM(`description`)}
            </AccordionHeader>
            <AccordionBody accordionId={'1'}>
              {
                <CardBody>
                  <p className=''> {edit?.description} </p>
                </CardBody>
              }
            </AccordionBody>
          </AccordionItem>
          <Show IF={userType !== UserTypes.patient}>
            <AccordionItem>
              <AccordionHeader tag='h2' targetId={'2'}>
                {FM(`external-comment`)}
              </AccordionHeader>
              <AccordionBody accordionId={'2'}>
                {
                  <CardBody>
                    <p className=''> {edit?.external_comment} </p>
                  </CardBody>
                }
              </AccordionBody>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader tag='h2' targetId={'3'}>
                {FM(`internal-comment`)}
              </AccordionHeader>
              <AccordionBody accordionId={'3'}>
                {
                  <CardBody>
                    <p className=''> {edit?.internal_comment} </p>
                  </CardBody>
                }
              </AccordionBody>
            </AccordionItem>
            <AccordionItem onClick={() => toggleTab()}>
              <AccordionHeader tag='h2' targetId={'4'}>
                {FM(`comments-and-replies`)}
              </AccordionHeader>
              <AccordionBody accordionId={'4'}>
                {edit?.comments?.map((d, i) => {
                  return (
                    <div className='mb-0 mt-1' key={i}>
                      <Row>
                        <Col md='6'>
                          <div>
                            <div className='h5 text-dark fw-bolder'>{FM('comment')}</div>
                            <p className=''> {d?.comment ?? 'N/A'} </p>
                          </div>
                        </Col>
                        <Col md='6'>
                          <div>
                            <div className='h5 text-dark fw-bolder'>{FM('comment-by')}</div>
                            <p className=''> {decrypt(d?.comment_by?.name) ?? 'N/A'} </p>
                          </div>
                        </Col>
                      </Row>
                      {/* <MiniTable
                                                labelProps={{ md: "10" }}
                                                valueProps={{ md: 1 }}
                                                label={String(d?.comment).substring(1, 150)}
                                                value={<BsTooltip title={FM("tap-to-reply")}><ReplyModal edit={d} source={comments?.source_id} Component={Send} /></BsTooltip>}
                                            /> */}
                    </div>
                  )
                })}
              </AccordionBody>
            </AccordionItem>
          </Show>
        </UncontrolledAccordion>
      </div>
    </>
  )
}

export default ActivityDetail
