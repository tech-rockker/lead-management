import React, { useState } from 'react'
import {
  Activity,
  CheckSquare,
  ChevronsRight,
  Eye,
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
  Button,
  CardBody,
  Col,
  ListGroupItem,
  Row,
  UncontrolledAccordion
} from 'reactstrap'
import { FM, isValidArray } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import { countPlus, formatDate } from '../../../../utility/Utils'
import BsTooltip from '../../../components/tooltip'

const Info = ({ edit }) => {
  const oldFiles = isValidArray(edit?.documents) ? edit?.documents : []

  function checkURL(url) {
    return String(url).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  const renderOldFilePreview = (file) => {
    if (checkURL(file?.file_url)) {
      return <img className='rounded' alt={file.name} src={file?.file_url} height='28' width='28' />
    } else {
      return <FileText url={file?.file_url} size='28' />
    }
  }

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
            <div className='h5 text-dark fw-bolder'>{FM('contact-number')}</div>
            <p className=''> {edit?.contact_number} </p>
          </div>
        </Col>

        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
            <p className=''> {formatDate(edit?.created_at, 'DD MMMM YYYY')} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('city')}</div>
            <p className=''> {edit?.city ?? 'N/A'} </p>
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
            <p className=''> {edit?.postal_area ?? 'N/A'} </p>
          </div>
        </Col>
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('postal-code')}</div>
            <p className=''> {edit?.zipcode ?? 'N/A'} </p>
          </div>
        </Col>
        {/* <Col md="4">
                    <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>
                            {FM("licence-status")}
                        </div>
                        <p className=''> {edit?.licence_status === 1 ? 'Active' : 'Inactive'} </p>
                    </div>
                </Col> */}
        <Col md='4'>
          <div className='mb-2'>
            <div className='h5 text-dark fw-bolder'>{FM('address')}</div>
            <p className=''> {edit?.full_address ?? 'N/A'} </p>
          </div>
        </Col>
      </Row>
      <CardBody className='animate__animated animate__flipInX p-0 pt-1 pb-1 border-top'>
        <Row noGutters className='d-flex align-items-start justify-content-between'>
          <Col md='3' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.employees_count)}
                    </Badge>
                    <Users className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('employee')}</span>
              </div>
            </BsTooltip>
          </Col>
          <Col md='3' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.patients_count)}
                    </Badge>
                    <UserPlus className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('patient')}</span>
              </div>
            </BsTooltip>
          </Col>
          <Col md='3' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.assigned_module_count)}
                    </Badge>
                    <Package className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('Modules')}</span>
              </div>
            </BsTooltip>
          </Col>
          <Col md='3' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.branchs_count)}
                    </Badge>
                    <GitMerge className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('branch')}</span>
              </div>
            </BsTooltip>
          </Col>

          <hr className='mt-1' />

          <Col md='3' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.activities_count)}
                    </Badge>
                    <Activity className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('activity')}</span>
              </div>
            </BsTooltip>
          </Col>
          <Col md='3' xs='2' className=''>
            <div role='' className='text-center'>
              <div className='d-flex justify-content-center mt-1'>
                <div className='position-relative'>
                  <Badge pill color='primary' className='badge-up'>
                    {countPlus(edit?.tasks_count)}
                  </Badge>
                  <CheckSquare className='text-secondary' style={{ width: 25, height: 25 }} />
                </div>
              </div>
              <span className='text-dark   fw-bold text-step-title'>{FM('task')}</span>
            </div>
          </Col>

          <Col md='3' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.ips_count)}
                    </Badge>
                    <FileText className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark   fw-bold text-step-title'>{FM('iP')}</span>
              </div>
            </BsTooltip>
          </Col>
          <Col md='3' xs='2' className=''>
            <BsTooltip title={''}>
              <div role='' className='text-center'>
                <div className='d-flex justify-content-center mt-1'>
                  <div className='position-relative'>
                    <Badge pill color='primary' className='badge-up'>
                      {countPlus(edit?.follow_ups_count)}
                    </Badge>
                    <ChevronsRight className='text-secondary' style={{ width: 25, height: 25 }} />
                  </div>
                </div>
                <span className='text-dark fw-bold text-step-title'>{FM('followup')}</span>
              </div>
            </BsTooltip>
          </Col>
        </Row>
      </CardBody>
      <CardBody>
        <Hide IF={isValidArray(oldFiles)}>
          <div className='p-2 text-center'>{FM('no-documents')}</div>
        </Hide>
        {oldFiles?.map((file, index) => (
          <ListGroupItem
            key={`${file.name}-${index}`}
            className='d-flex align-items-center justify-content-between'
          >
            <div className='file-details d-flex align-items-center'>
              <div className='file-preview me-1'>{renderOldFilePreview(file)}</div>
              <div>
                <p className='file-name mb-0'>{file?.file_name}</p>
              </div>
            </div>
            <div>
              <BsTooltip
                Tag={Button}
                title={FM('view')}
                color='primary'
                outline
                size='sm'
                className='btn-icon'
                onClick={() => {
                  window.open(file?.file_url, '_blank')
                }}
              >
                <Eye size={14} />
              </BsTooltip>
            </div>
          </ListGroupItem>
        ))}
      </CardBody>
    </>
  )
}

export default Info
