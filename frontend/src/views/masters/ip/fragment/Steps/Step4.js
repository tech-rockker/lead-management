import React from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap'
//import { categoryChildList } from '../../../../../utility/apis/commons'
import { FM } from '../../../../../utility/helpers/common'
import Shimmer from '../../../../components/shimmers/Shimmer'
import IpApproval from '../IpApproval'

const Step4 = ({
  path = 7,
  setTriggerApprove = () => {},
  triggerApprove = null,
  handleSaveForce = () => {},
  setSaveLoading = () => {},
  ip = null,
  isSaved = false,
  action = null,
  setActiveIndex = () => {},
  setAction = () => {},
  setAddPatients = () => {},
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
    <div className='overflow-x-hidden p-2'>
      {loadingDetails ? (
        <Row>
          <Col md='12' className='d-flex align-items-stretch'>
            <Card>
              <CardBody>
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
            <Col md='12'>
              <div className='content-header'>
                <h5 className='mb-0'>{FM('persons-approval')}</h5>
              </div>
              <IpApproval
                isSaved={isSaved}
                ip={ip}
                setTriggerApprove={setTriggerApprove}
                triggerApprove={triggerApprove}
                handleSaveForce={handleSaveForce}
                setValue={setValue}
                ipId={edit?.id}
                watch={watch}
                edit={watch('persons')}
                control={control}
                errors={errors}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}

export default Step4
