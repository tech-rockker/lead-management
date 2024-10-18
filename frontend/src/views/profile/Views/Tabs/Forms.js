// ** React Imports
import { Fragment } from 'react'
// ** Reactstrap Imports
import { Col, Form, Input, Row } from 'reactstrap'
import { UserTypes, forDecryption } from '../../../../utility/Const'
import Show from '../../../../utility/Show'
import { decryptObject, getAge } from '../../../../utility/Utils'
import { FM, isValidArray } from '../../../../utility/helpers/common'
import FormGroupCustom from '../../../components/formGroupCustom'
import Shimmer from '../../../components/shimmers/Shimmer'

// ** Styles
import 'react-slidedown/lib/slidedown.css'
import Hide from '../../../../utility/Hide'
import DropZoneImage from '../../../components/imageFileUploader'

const Forms = ({
  ips = null,
  useFieldArray = () => {},
  editIpRes = null,
  ipRes = null,
  reLabel = null,
  getValues = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors,
  setError
}) => {
  const editProfile = decryptObject(forDecryption, edit)

  const imgAvatar = editProfile?.avatar
  const options = { delimiters: ['-'], blocks: [8, 4] }
  return (
    <Fragment>
      {loadingDetails ? (
        <>
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
        </>
      ) : (
        <Form onSubmit={onSubmit}>
          <Row>
            <Show IF={editProfile?.user_type_id === UserTypes.company}>
              <FormGroupCustom
                noGroup
                noLabel
                value={editProfile?.name}
                placeholder={FM('name')}
                type='text'
                name='company_name'
                hidden
                className='mb-1'
                errors={errors}
                control={control}
                rules={{ required: false }}
              />
              <FormGroupCustom
                noGroup
                noLabel
                value={editProfile?.email}
                placeholder={FM('email')}
                type='text'
                name='email'
                hidden
                className='mb-1'
                errors={errors}
                control={control}
                rules={{ required: false }}
              />
              <FormGroupCustom
                noGroup
                noLabel
                hidden
                value={editProfile?.contact_number}
                placeholder={FM('contact_number')}
                type='number'
                name='contact_number'
                label={FM('contact_number')}
                className='mb-1'
                errors={errors}
                control={control}
                rules={{ required: false, minLength: 10, maxLength: 12 }}
              />
              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={editProfile?.name}
                  placeholder={FM('contact-person-name')}
                  type='text'
                  name='name'
                  label={FM('contact-person-name')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>

              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={editProfile?.email}
                  placeholder={FM('contact_person_email')}
                  type='email'
                  name='contact_person_email'
                  label={FM('contact_person_email')}
                  disabled
                  className=' mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>

              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={String(editProfile?.contact_person_number).replaceAll(' ', '')}
                  placeholder={FM('cp_contact_number')}
                  type='number'
                  name='contact_person_number'
                  label={FM('cp_contact_number')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false, minLength: 10, maxLength: 12 }}
                />
              </Col>
            </Show>

            <Hide IF={editProfile?.user_type_id === UserTypes.company}>
              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={editProfile?.name}
                  placeholder={FM('name')}
                  type='text'
                  name='name'
                  label={FM('name')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>

              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={editProfile?.email}
                  placeholder={FM('email')}
                  type='email'
                  name='email'
                  label={FM('email')}
                  disabled
                  className=' mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>

              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={editProfile?.contact_number}
                  placeholder={FM('contact_number')}
                  type='number'
                  name='contact_number'
                  label={FM('contact_number')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false, minLength: 10, maxLength: 12 }}
                />
              </Col>
            </Hide>
            <Hide IF={editProfile?.user_type_id === UserTypes.admin}>
              <Col md='6' xs='12'>
                <FormGroupCustom
                  name={'personal_number'}
                  value={editProfile?.personal_number}
                  type={'mask'}
                  errors={errors}
                  maskOptions={options}
                  feedback={FM('invalid-personal-number')}
                  className='mb-2'
                  placeholder='YYYYMMDD-XXXX'
                  control={control}
                  rules={{
                    required: false,
                    // minLength: "13",
                    validate: (v) => {
                      if (!v) {
                        return true // Allow empty value
                      }
                      return getAge(v, FM, true) && String(v).replaceAll('-', '').length === 12
                    }
                  }}
                />
              </Col>
            </Hide>
            <Hide
              IF={
                editProfile?.user_type_id === UserTypes.company ||
                editProfile?.user_type_id === UserTypes.branch
              }
            >
              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={editProfile?.full_address}
                  placeholder={FM('full-address')}
                  type='text'
                  name='full_address'
                  label={FM('full-address')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              {/* <Hide IF={editProfile?.user_type_id === UserTypes.patient}> */}
              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={editProfile?.city}
                  placeholder={FM('city')}
                  type='text'
                  name='city'
                  label={FM('city')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              {/* </Hide> */}
              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={editProfile?.postal_area}
                  placeholder={FM('postal-area')}
                  type='text'
                  name='postal_area'
                  label={FM('postal-area')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false }}
                />
              </Col>
              <Col md='6' xs='12'>
                <FormGroupCustom
                  value={editProfile?.zipcode}
                  placeholder={FM('postal-code')}
                  type='text'
                  name='zipcode'
                  label={FM('postal-code')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: false, maxLength: 5 }}
                />
              </Col>
            </Hide>
            <Col md='6' xs='12'>
              <FormGroupCustom
                noLabel
                name={'avatar'}
                type={'hidden'}
                errors={errors}
                control={control}
                rules={{ required: false }}
                values={imgAvatar}
              />
              <DropZoneImage
                maxSize={2}
                value={editProfile?.avatar}
                accept={'image/*'}
                name={editProfile?.avatar}
                onSuccess={(e) => {
                  if (isValidArray(e)) {
                    setValue('avatar', [
                      { file_url: e[0]?.file_name, file_name: e[0]?.uploading_file_name }
                    ])
                  } else {
                    setValue('avatar', [])
                  }
                }}
              />
            </Col>
          </Row>
          <Input type='submit' value={'test'} className='d-none' />
        </Form>
      )}
    </Fragment>
  )
}

export default Forms
