import React from 'react'
import { Badge, CardBody, Col, Row } from 'reactstrap'
import { FM, isValidArray } from '../../../../../utility/helpers/common'
import Show from '../../../../../utility/Show'
import { JsonParseValidate, truncateText } from '../../../../../utility/Utils'
import BsPopover from '../../../../components/popover'

const DetailsTab = ({ ip }) => {
  return (
    <div>
      <CardBody className='border-top'>
        <Row className='align-items-start gy-2'>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('title')}</p>
            <p className='mb-0 fw-bold text-secondary'>{ip?.title}</p>
          </Col>
          <Col md='5'>
            <p className='mb-0 text-dark fw-bolder'>{FM('category')}</p>
            <p className='mb-0 fw-bold text-secondary'>{ip?.category?.name}</p>
          </Col>
          <Col md='5'>
            <p className='mb-0 text-dark fw-bolder'>{FM('sub-category')}</p>
            <p className='mb-0 fw-bold text-secondary'>{ip?.subcategory?.name}</p>
          </Col>
          <Col md='5'>
            <p className='mb-0 text-dark fw-bolder'>{FM('start-date')}</p>
            <p className='mb-0 fw-bold text-secondary'>{ip?.start_date ?? 'N/A'}</p>
          </Col>
          <Col md='4'>
            <p className='mb-0 text-dark fw-bolder'>{FM('end-date')}</p>
            <p className='mb-0 fw-bold text-secondary'>{ip?.end_date ?? 'N/A'}</p>
          </Col>
          <Col md='2'>
            <p className='mb-0 text-dark fw-bolder'>{FM('date-comment')}</p>
            <p className='mb-0 fw-bold text-secondary'>{ip?.date_comment ?? 'N/A'}</p>
          </Col>
        </Row>
        <Row className='border-top pt-2 mt-2 gy-2'>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('limitation')}</p>
            <p className='mb-0 fw-bold text-secondary'>{FM(ip?.limitations)}</p>
            <p className='mb-0 fw-bold text-secondary mt-1'>{ip?.limitation_details}</p>
          </Col>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('goal')}</p>
            <p className='mb-0 fw-bold text-secondary'>{ip?.goal}</p>
          </Col>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('sub-goal')}</p>
            <p className='mb-0 fw-bold text-secondary'>{FM(ip?.sub_goal_selected)}</p>
            <p className='mb-0 fw-bold text-secondary mt-1'>{ip?.sub_goal}</p>
          </Col>
        </Row>
        <Row className='border-top pt-2 mt-2'>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('how-will-support')}</p>
            <p
              title={FM('how-will-support')}
              role='button'
              Tag={'p'}
              content={truncateText(ip?.how_support_should_be_given, 200)}
              className='mb-0 fw-bold text-secondary mt-3px'
            >
              {ip?.how_support_should_be_given ? ip?.how_support_should_be_given : 'N/A'}
            </p>
          </Col>
          <Col md='6'>
            <p className='mb-0 text-dark fw-bolder'>{FM('who-will-give-support')}</p>
            <BsPopover
              title={FM('who-will-give-support')}
              role='button'
              Tag={'p'}
              className='mb-0 fw-bold text-secondary text-truncate mt-3px'
            >
              {isValidArray(ip?.who_give_support)
                ? ip?.who_give_support?.map((d, i) => {
                    return (
                      <>
                        <Badge className='text-capitalize me-1' color='light-primary'>
                          {d}
                        </Badge>
                      </>
                    )
                  })
                : 'N/A'}
            </BsPopover>
          </Col>
        </Row>
        <Show IF={ip?.reason_for_editing !== null}>
          <Row className='border-top pt-2 mt-2'>
            <Col md='12'>
              <p className='mb-0 text-dark fw-bolder'>{FM('edit-reason')}</p>
              <p className='mb-0 fw-bold text-secondary mt-1'>{ip?.reason_for_editing}</p>
            </Col>
          </Row>
        </Show>
      </CardBody>
    </div>
  )
}

export default DetailsTab
