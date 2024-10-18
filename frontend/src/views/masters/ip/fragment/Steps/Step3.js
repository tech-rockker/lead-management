import React from 'react'
import { Col, Row } from 'reactstrap'
import { isValidArray } from '../../../../../utility/helpers/common'
import DropZone from '../../../../components/buttons/fileUploader'
import FormGroupCustom from '../../../../components/formGroupCustom'

const Step3 = ({
  path = 6,
  getValues = () => {},
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
  console.log(edit)
  return (
    <div className='p-2 w-100'>
      <Row>
        <Col md='12'>
          <FormGroupCustom
            noLabel
            name={'documents'}
            type={'hidden'}
            errors={errors}
            control={control}
            rules={{ required: false }}
            values={edit}
          />
          <DropZone
            multiple
            maxFiles={5}
            value={edit?.admin_files?.map((d, i) => ({
              file_path: d?.file_path,
              file_name: d?.file_name
            }))}
            onSuccess={(e) => {
              if (isValidArray(e)) {
                setValue(
                  'documents',
                  e?.map((d, i) => {
                    return {
                      file_name: d?.uploading_file_name,
                      file_url: d?.file_name
                    }
                  })
                )
              } else {
                setValue('documents', [])
              }
            }}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Step3
