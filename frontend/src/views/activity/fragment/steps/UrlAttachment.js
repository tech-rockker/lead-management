import React from 'react'
import { Card, Col, Row } from 'reactstrap'
import { FM, isValidArray } from '../../../../utility/helpers/common'
import DropZone from '../../../components/buttons/fileUploader'
import FormGroupCustom from '../../../components/formGroupCustom'

const UrlAttachment = ({
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
    <>
      <div className='p-2'>
        <Card className='p-2 mb-2 shadow rounded'>
          <div className='content-header  mb-1'>
            <h5 className='mb-0'>{FM('add-urls')}</h5>
            <small className='text-muted'>{FM('add-urls-details')}</small>
          </div>
          <Row>
            <Col md='4'>
              <FormGroupCustom
                name={'video_url'}
                label={FM('video-link')}
                type={'text'}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                values={edit}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                name={'information_url'}
                label={FM('information-link')}
                type={'text'}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                values={edit}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                name={'address_url'}
                label={FM('address-link')}
                type={'text'}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{ required: false }}
                values={edit}
              />
            </Col>
          </Row>
        </Card>

        <Card className='p-2 shadow rounded'>
          <div className='content-header mt-3 mb-1'>
            <h5 className='mb-0'>{FM('add-attachment')}</h5>
            <small className='text-muted'>{FM('add-attachment-details')}</small>
          </div>
          <Row>
            <Col md='12'>
              <FormGroupCustom
                noLabel
                name={'file'}
                type={'hidden'}
                errors={errors}
                control={control}
                rules={{ required: false }}
                values={edit}
              />
              <DropZone
                value={edit?.admin_file}
                onSuccess={(e) => {
                  if (isValidArray(e)) {
                    setValue('file', {
                      file_name: e[0]?.uploading_file_name,
                      file_url: e[0]?.file_name
                    })
                  } else {
                    setValue('file', '')
                  }
                }}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </>
  )
}

export default UrlAttachment
