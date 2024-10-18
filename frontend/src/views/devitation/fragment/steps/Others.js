import React from 'react'
import { Card, Col, Row } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import { copySentTo } from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'

const Others = ({ edit, control, errors }) => {
  return (
    <>
      <div className='p-2'>
        <Card className='p-2 mb-2 shadow rounded'>
          <div className='content-header  mb-1'>
            <h5 className='mb-0'>{FM('investigation')}</h5>
            <small className='text-muted'>{FM('add-investigation-details')}</small>
          </div>
          <Row>
            <Col md='12'>
              <FormGroupCustom
                name={'follow_up'}
                label={FM('followups')}
                type={'autocomplete'}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                values={edit}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                key={`further_investigation`}
                name={'further_investigation'}
                label={FM('further-investigation')}
                type={'select'}
                isMulti
                errors={errors}
                className='mb-2'
                options={copySentTo()}
                control={control}
                rules={{ required: false }}
                values={edit}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </>
  )
}

export default Others
