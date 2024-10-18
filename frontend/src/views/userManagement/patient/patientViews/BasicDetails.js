import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext } from 'react'
import { Card, CardBody, CardText } from 'reactstrap'
import { FM, isValid } from '../../../../utility/helpers/common'

function BasicDetails({ data = null }) {
  const { colors } = useContext(ThemeColors)
  return (
    <>
      <Card>
        <h4 className='mt-2 ms-2  text-primary'>{FM('about')}</h4>
        <CardBody>
          <div className='mt-0'>
            <h5 className='mb-75'>{FM('custom-unique-id')}:</h5>
            <CardText>{data.custom_unique_id}</CardText>
          </div>
          <div className='mt-1'>
            <h5 className='mb-75'>{FM('name')}:</h5>
            <CardText>{data?.name}</CardText>
          </div>

          <div className='mt-1'>
            <h5 className='mb-75'>{FM('email')}:</h5>
            <CardText>{data?.email}</CardText>
          </div>
          <div className='mt-1'>
            <h5 className='mb-75'>{FM('personal-number')}:</h5>
            <CardText>{data?.personal_number}</CardText>
          </div>
          {isValid(data?.contact_number) ? (
            <div className='mt-2'>
              <h5 className='mb-75'>{FM('contact-number')}:</h5>
              <CardText>{data?.contact_number}</CardText>
            </div>
          ) : null}
          <div className='mt-1'>
            <h5 className='mb-75'>{FM('gender')}:</h5>
            <CardText>{data?.gender}</CardText>
          </div>
          <div className='mt-1'>
            <h5 className='mb-75'>{FM('postal-area')}:</h5>
            <CardText>{data?.postal_area}</CardText>
          </div>
          <div className='mt-1'>
            <h5 className='mb-75'>{FM('unique-id')}:</h5>
            <CardText>{data?.unique_id}</CardText>
          </div>
          <div className='mt-1'>
            <h5 className='mb-75'>{FM('full-address')}:</h5>
            <CardText>{data?.country?.name}</CardText>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default BasicDetails
