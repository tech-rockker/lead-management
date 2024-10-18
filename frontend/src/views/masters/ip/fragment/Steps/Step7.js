import React from 'react'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'
import FormGroupCustom from '../../../../components/formGroupCustom'

const Step7 = ({
  path = 5,
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
            label={FM('treatment')}
            name={`treatment`}
            value={edit?.treatment}
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
            label={FM('working_method')}
            name={`working_method`}
            value={edit?.working_method}
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

export default Step7
