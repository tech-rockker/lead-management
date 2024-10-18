import { Badge } from '@material-ui/core'
import { School, SchoolOutlined, Timelapse } from '@material-ui/icons'
import React from 'react'
import { Activity, AtSign, Home } from 'react-feather'
import { Card, CardBody, CardHeader, Label, Row, Col } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import MiniTable from '../../../components/tableGrid/miniTable'

function WorkingDetails({ data = null }) {
  return (
    <>
      <Card>
        <CardHeader>
          <h4>{FM('patient-information')}</h4>
        </CardHeader>
        <CardBody>
          <Row>
            <Hide IF={data?.another_activity_name === null}>
              <Card>
                <CardHeader>
                  <h4 className='fw-bold'>
                    <Activity />:
                    <span className='fw-bold text-primary'> {FM('activity-information')}</span>
                  </h4>
                </CardHeader>
                <CardBody>
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'another-activity'}
                    value={data?.another_activity_name}
                  />
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'activity'}
                    value={data?.activitys_contact_number}
                  />

                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'another-activity'}
                    value={data?.another_activity_name}
                  />
                </CardBody>
              </Card>
            </Hide>

            <Hide IF={data?.company_name === null}>
              <Card>
                <CardHeader>
                  <h4 className='fw-bold'>
                    <Home />:<span className='fw-bold text-primary'> {FM('company')}</span>
                  </h4>
                </CardHeader>
                <CardBody>
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'company-name'}
                    value={data?.company_name}
                  />
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'company-contact-number'}
                    value={data?.company_contact_number}
                  />
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'company-addres'}
                    value={data?.company_full_address}
                  />
                </CardBody>
              </Card>
            </Hide>

            <Hide IF={data?.institute_name === null}>
              <Card>
                <CardHeader>
                  <h4 className='fw-bold'>
                    <SchoolOutlined />:
                    <span className='fw-bold text-primary'> {FM('institute')}</span>
                  </h4>
                </CardHeader>
                <CardBody>
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'institute-name'}
                    value={data?.institute_name}
                  />
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'institute-contact-number'}
                    value={data?.institute_contact_number}
                  />
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'institute-address'}
                    value={data?.institute_full_address}
                  />
                </CardBody>
              </Card>
            </Hide>
            <Hide IF={data?.from_timing === null}>
              <Card>
                <CardHeader>
                  <h4 className='fw-bold'>
                    <Timelapse />:<span className='fw-bold text-primary'> {FM('timing')}</span>
                  </h4>
                </CardHeader>
                <CardBody>
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'from'}
                    value={data?.from_timing}
                  />
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'to'}
                    value={data?.to_timing}
                  />
                </CardBody>
              </Card>
            </Hide>

            <Hide IF={data?.classes_from === null}>
              <Card>
                <CardHeader>
                  <h4 className='fw-bold'>
                    <Timelapse />:
                    <span className='fw-bold text-primary'> {FM('classes-timing')}</span>
                  </h4>
                </CardHeader>

                <CardBody>
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'from'}
                    value={data?.classes_from}
                  />
                  <MiniTable
                    labelProps={{ md: '4' }}
                    valueProps={{ md: 7 }}
                    label={'to'}
                    value={data?.classes_to}
                  />
                </CardBody>
              </Card>
            </Hide>
            <Card>
              <CardBody>
                <MiniTable
                  labelProps={{ md: '3' }}
                  valueProps={{ md: 7 }}
                  label={'special-information'}
                  value={data?.special_information}
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <MiniTable
                  labelProps={{ md: '3' }}
                  valueProps={{ md: 7 }}
                  label={'aids'}
                  value={data?.aids}
                />
              </CardBody>
            </Card>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}

export default WorkingDetails
