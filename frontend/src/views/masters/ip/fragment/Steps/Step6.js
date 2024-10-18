import React from 'react'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'
import FormGroupCustom from '../../../../components/formGroupCustom'

const Step6 = ({
  path = 4,
  handleStepBg = () => {},
  createFor = null,
  setDisplay = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  return (
    <div className='p-2 w-100'>
      <Row>
        <Col md='6'>
          <FormGroupCustom
            style={{ minHeight: 100 }}
            label={FM('body-functions')}
            name={`body_functions`}
            value={edit?.body_functions}
            type={'autocomplete'}
            errors={errors}
            className='mb-2'
            control={control}
            rules={{ required: false }}
          />
        </Col>
        <Col md='6'>
          <FormGroupCustom
            style={{ minHeight: 100 }}
            label={FM('personal-factors')}
            name={`personal_factors`}
            value={edit?.personal_factors}
            type={'autocomplete'}
            errors={errors}
            className='mb-2'
            control={control}
            rules={{ required: false }}
          />
        </Col>
        <Col md='6'>
          <FormGroupCustom
            style={{ minHeight: 100 }}
            label={FM('health-conditions')}
            name={`health_conditions`}
            value={edit?.health_conditions}
            type={'autocomplete'}
            errors={errors}
            className='mb-2'
            control={control}
            rules={{ required: false }}
          />
        </Col>
        <Col md='6'>
          <FormGroupCustom
            style={{ minHeight: 100 }}
            label={FM('other-factors')}
            name={`other_factors`}
            value={edit?.other_factors}
            type={'autocomplete'}
            errors={errors}
            className='mb-2'
            control={control}
            rules={{ required: false }}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Step6
