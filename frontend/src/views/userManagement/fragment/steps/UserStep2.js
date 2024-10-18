import React from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
import Shimmer from '../../../components/shimmers/Shimmer'

import { UserTypes } from '../../../../utility/Const'
import { FM } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import FormGroupCustom from '../../../components/formGroupCustom'
import PersonModal from '../PersonModal'

const UserStep2 = ({
  fromIp = false,
  incomplete = null,
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
            <Card>
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
          <Show IF={userType === UserTypes.patient}>
            <FormGroupCustom
              noGroup
              noLabel
              type={'hidden'}
              control={control}
              errors={errors}
              name={'persons'}
              className='d-none'
              value={edit?.persons ?? []}
              rules={{ required: false }}
            />
            <PersonModal
              control={control}
              incomplete={incomplete}
              edit={edit}
              onSuccess={(e) => setValue('persons', e)}
            />
          </Show>
        </>
      )}
    </div>
  )
}

export default UserStep2
