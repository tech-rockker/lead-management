import React from 'react'
import { Col, Row, Card, CardBody } from 'reactstrap'
import { UserTypes } from '../../../../utility/Const'
import { FM } from '../../../../utility/helpers/common'
import FormGroupCustom from '../../../components/formGroupCustom'
import Shimmer from '../../../components/shimmers/Shimmer'

const UserStep3 = ({
  activeIndex = null,
  userType = null,
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
    <div className='w-100 overflow-x-hidden p-2'>
      {loadingDetails ? (
        <Row>
          <Col md='12' className='d-flex align-items-stretch'>
            <Card className='p-0'>
              <CardBody className='p-0'>
                <Row>
                  <Col md='6'>
                    <Shimmer style={{ height: 40 }} />
                  </Col>
                  <Col md='6'>
                    <Shimmer style={{ height: 40 }} />
                  </Col>
                  <Col md='12' className='mt-2'>
                    <Shimmer style={{ height: 320 }} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            {userType === UserTypes.patient ? (
              <>
                <Col md='12'>
                  {/* Patient */}
                  <FormGroupCustom
                    name={'disease_description'}
                    label={FM('description')}
                    type={'autocomplete'}
                    errors={errors}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
                <Col md='12'>
                  {/* Patient */}
                  <FormGroupCustom
                    name={'aids'}
                    label={FM('aids')}
                    type={'autocomplete'}
                    errors={errors}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
                <Col md='12'>
                  {/* Patient */}
                  <FormGroupCustom
                    name={'special_information'}
                    label={FM('spacial-information')}
                    type={'autocomplete'}
                    errors={errors}
                    className='mb-2'
                    control={control}
                    rules={{ required: false }}
                    values={edit}
                  />
                </Col>
              </>
            ) : null}
          </Row>
        </>
      )}
    </div>
  )
}

export default UserStep3
