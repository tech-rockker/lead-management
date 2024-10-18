import classNames from 'classnames'
import React, { useState } from 'react'
import {
  Activity,
  CheckSquare,
  ChevronsRight,
  FileText,
  GitMerge,
  Package,
  UserPlus,
  Users
} from 'react-feather'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Badge,
  CardBody,
  Col,
  Row,
  UncontrolledAccordion
} from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import { countPlus, formatDate } from '../../../../utility/Utils'
import BsTooltip from '../../../components/tooltip'

const Info = ({ edit }) => {
  const [activeTab, setActiveTab] = useState(false)
  const toggleTab = () => {
    setActiveTab(!activeTab)
  }
  return (
    <>
      <Row className='p-2'>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('contact-person-name')}</div>
            <p className=''> {edit?.name ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('contact_person_email')}</div>
            <p className=''> {edit?.email} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('contact-person-number')}</div>
            <p className=''> {edit?.contact_number ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('personal-number')}</div>
            <p className=''> {edit?.personal_number ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('verification-method')}</div>
            <p className='text-capitalize'> {edit?.verification_method ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('status')}</div>
            <p
              className={classNames({
                'text-success': edit?.status === 1,
                'text-danger': edit?.status === 0
              })}
            >
              {' '}
              {edit?.status === 1 ? 'Active' : 'Inactive' ?? 'N/A'}{' '}
            </p>
          </div>
        </Col>
      </Row>
      <CardBody className='border-top'>
        <Row>
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
              <p className=''> {formatDate(edit?.created_at, 'DD MMMM YYYY')} </p>
            </div>
          </Col>
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('city')}</div>
              <p className=''> {edit?.city} </p>
            </div>
          </Col>
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('country')}</div>
              <p className=''> {edit?.country?.name} </p>
            </div>
          </Col>
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('postal-area')}</div>
              <p className=''> {edit?.postal_area} </p>
            </div>
          </Col>
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('postal-code')}</div>
              <p className=''> {edit?.zipcode} </p>
            </div>
          </Col>
          {/* <Col md="4">
                    <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>
                            {FM("license-status")}
                        </div>
                        <p className=''> {edit?.license_status === 1 ? 'Active' : 'Inactive'} </p>
                    </div>
                </Col> */}
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('address')}</div>
              <p className=''> {edit?.full_address} </p>
            </div>
          </Col>
        </Row>
      </CardBody>

      <CardBody className='animate__animated animate__flipInX p-0 pt-1 pb-1 border-top'>
        <Row noGutters className='d-flex align-items-start justify-content-between'>
          <Col md='2' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.branchActivityCount)}
                    </Badge>
                    <Activity className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('activity')}</span>
              </div>
            </BsTooltip>
          </Col>
          <Col md='2' xs='2' className=''>
            <div role='' className='text-center'>
              <div className='d-flex justify-content-center mt-1'>
                <div className='position-relative'>
                  <Badge pill color='primary' className='badge-up'>
                    {countPlus(edit?.branchTaskCount)}
                  </Badge>
                  <CheckSquare className='text-secondary' style={{ width: 25, height: 25 }} />
                </div>
              </div>
              <span className='text-dark   fw-bold text-step-title'>{FM('task')}</span>
            </div>
          </Col>

          <Col md='2' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.branchIpCount)}
                    </Badge>
                    <FileText className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark   fw-bold text-step-title'>{FM('iP')}</span>
              </div>
            </BsTooltip>
          </Col>
          <Col md='2' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.branchFollowupCount)}
                    </Badge>
                    <ChevronsRight className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('followups')}</span>
              </div>
            </BsTooltip>
          </Col>
          <Col md='2' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.branch_employee_number)}
                    </Badge>
                    <Users className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('employees')}</span>
              </div>
            </BsTooltip>
          </Col>
          <Col md='2' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.branch_patient_number)}
                    </Badge>
                    <UserPlus className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('patient')}</span>
              </div>
            </BsTooltip>
          </Col>
        </Row>
      </CardBody>
    </>
  )
}

export default Info
