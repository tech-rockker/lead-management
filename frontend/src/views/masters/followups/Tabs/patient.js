import classNames from 'classnames'
import React from 'react'
import { Eye } from 'react-feather'
import { Badge, CardBody, Col, Row } from 'reactstrap'
import { FM, isValid } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import BsTooltip from '../../../components/tooltip'

function Patient({ followup }) {
  return (
    <div>
      <CardBody className=' border-top'>
        <Row className='align-items-start gy-2'>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('name')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.name}
            </p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('patient-type')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.patient_types.map(
                (a) => a.designation
              )}
            </p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('personal-number')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.personal_number}
            </p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('contact-person-name')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.contact_person_name ?? 'N/A'}
            </p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('email')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.email ?? 'N/A'}
            </p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('contact-number')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.contact_number ?? 'N/A'}
            </p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('is-regular')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.is_regular === 1
                ? 'Yes'
                : 'No' ?? 'N/A'}
            </p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('is-seasonal')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.is_seasonal === 1
                ? 'Yes'
                : 'No' ?? 'N/A'}
            </p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('is-secret')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.is_secret === 1
                ? 'Yes'
                : 'No' ?? 'N/A'}
            </p>
          </Col>
        </Row>
        <Row className='mt-2 border-top gy-2'>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('disease-description')}</p>
            <p className='mb-0 fw-bold text-secondary'>
              {followup?.patient_implementation_plan?.patient?.disease_description}
            </p>
          </Col>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('document')}</p>
            {followup?.patient_implementation_plan?.patient?.documents ? (
              <BsTooltip
                className='d-flex justify-content-start mb-1'
                Tag={'a'}
                role={'button'}
                target={'_blank'}
                href={followup?.patient_implementation_plan?.patient?.documents}
                title={FM('document')}
              >
                <Eye size='35' />
              </BsTooltip>
            ) : null}
          </Col>
        </Row>
      </CardBody>
    </div>
  )
}

export default Patient
