import React from 'react'
import { CardBody, Card, Form } from 'reactstrap'
import FormGroupCustom from '../../../components/formGroupCustom'
function DigitalSignature({
  data,
  control,
  handleSubmit = () => {},
  errors,
  reset,
  setValue,
  watch,
  getValues,
  setError
}) {
  return (
    <Card>
      <CardBody>
        <Form>
          <FormGroupCustom
            label={'bank-id'}
            name={'bank_id'}
            type={'autocomplete'}
            errors={errors}
            className=''
            control={control}
            rules={{ required: false }}
          />
        </Form>
      </CardBody>
    </Card>
  )
}

export default DigitalSignature
