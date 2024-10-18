import classNames from 'classnames'
import React, { useState } from 'react'
import { Badge, Col, Container, Row } from 'reactstrap'
import { ContractType, UserTypes } from '../../../../utility/Const'
import Show from '../../../../utility/Show'
import { decrypt, formatDate } from '../../../../utility/Utils'
import { FM } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'

const Info = ({ edit }) => {
  const user = useUser()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)

  const [activeTab, setActiveTab] = useState(false)
  const toggleTab = () => {
    setActiveTab(!activeTab)
  }

  const currentDate = new Date()

  // const loadDetails = () => {
  //     if (isValid(id)) {
  //         viewUser({
  //             id,
  //             loading: setLoading,
  //             success: (e) => {
  //                 const d = decryptObject(forDecryption, e)
  //                 const s = {
  //                     ...d,
  //                     country_id: d?.country?.id ?? '',
  //                     patient_type_id: (typeof d?.patient_type_id === "object" ? d?.patient_type_id : []),
  //                     ...d?.patient_information,
  //                     id: d?.patient_information?.patient_id
  //                 }
  //                 const values = jsonDecodeAll(userFields, s)
  //                 setDetails(values)
  //                 log("values", values)
  //             }
  //         })
  //     }
  // }
  // log("values", params)
  // useEffect(() => {
  //     if (isValid(id)) {
  //         loadDetails()
  //     }

  // }, [id])
  const employeeType = () => {
    if (edit?.employee_type === '1') {
      return FM('regular')
    }
    if (edit?.employee_type === '2') {
      return FM('seasonal')
    }
    if (edit?.employee_type === '3') {
      return FM('substitute')
    } else {
      return FM('other')
    }
  }

  return (
    <>
      <Container className='p-2 pt-0'>
        <Row className='p-2 pb-0 border-top border-bottom'>
          <Col md='4'>
            <div className='mb-0'>
              <div className='h5 text-dark fw-bolder'>
                {user?.user_type_id === 2 ? FM('company-name') : FM('name')}
              </div>
              <p className='text-capitalize'>
                {' '}
                {user?.user_type_id === 2
                  ? edit?.company_setting?.company_name ?? FM('N/A')
                  : decrypt(user?.name) ?? FM('N/A')}
              </p>
            </div>
          </Col>
          <Col md='4'>
            <div className='mb-2'>
              <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
              <p className=''> {formatDate(user?.created_at, 'DD MMMM YYYY')} </p>
            </div>
          </Col>

          <Col md='4'>
            <Show IF={user?.user_type_id === UserTypes.company}>
              <div className='mb-2'>
                <div className='h5 text-dark fw-bolder'>{FM('license-end-date')}</div>
                <p className={'text-danger'}>
                  {formatDate(user?.licence_end_date, 'DD MMMM YYYY')}
                </p>
              </div>
            </Show>
            <Show IF={user?.user_type_id !== UserTypes.company}>
              <div className='mb-0'>
                <div className='h5 text-dark fw-bolder'>{FM('status')}</div>
                <p
                  className={classNames({
                    'text-success': user?.status === 1,
                    'text-danger': user?.status === 0
                  })}
                >
                  {user?.status === 1 ? <>{FM('active')} </> : FM('inactive')}
                </p>
              </div>
            </Show>
          </Col>
        </Row>
        <Show
          IF={
            edit?.user_type_id === UserTypes.employee ||
            edit?.user_type_id === UserTypes.adminEmployee
          }
        >
          <Row className='p-2 pb-0 p'>
            <Col md='3'>
              <div className='mb-2'>
                <div className='h5 text-dark fw-bolder'>{FM('employee-type')}</div>
                <p className='me-1 mb-0 mt-1'> {employeeType(edit)} </p>
              </div>
            </Col>
            <Col md='3'>
              <div className='mb-2'>
                <div className='h5 text-dark fw-bolder'>{FM('contract-type')}</div>
                <p className='me-1 mb-0 mt-1'>
                  {' '}
                  {edit?.contract_type === ContractType['contract-hourly']
                    ? FM('contract-hourly')
                    : FM('contract-fixed')}{' '}
                </p>
              </div>
            </Col>
            <Col md='3'>
              <div className='mb-2'>
                <div className='h5 text-dark fw-bolder'>{FM('contract-value')}</div>
                <Badge className='me-1' color='light-primary mb-0 mt-1'>
                  {edit?.contract_value}
                </Badge>
              </div>
            </Col>
            <Col md='3'>
              <div className='mb-2'>
                <div className='h5 text-dark fw-bolder'>{FM('role-name')}</div>
                <Badge className='me-1' color='light-primary mb-0 mt-1'>
                  {FM('Employee')}
                </Badge>
              </div>
            </Col>
          </Row>

          {/* <hr /> */}
          <Row className='p-2 pb-0 p'>
            <Col md='4'>
              <div className='mb-2'>
                <div className='h5 text-dark fw-bolder'>{FM('municipal-name')}</div>
                <p className='me-1 mb-0 mt-1'> {edit?.assigned_work?.municipal_name ?? 'N/A'} </p>
              </div>
            </Col>

            <Col md='4'>
              <div className='mb-2'>
                <div className='h5 text-dark fw-bolder'>{FM('allowed-hour-per-week')}</div>
                <p className='me-1 mb-0 mt-1'>
                  {' '}
                  {edit?.assigned_work?.assigned_working_hour_per_week ?? 'N/A'}{' '}
                </p>
              </div>
            </Col>

            <Col md='4'>
              <div className='mb-2'>
                <div className='h5 text-dark fw-bolder'>{FM('work-percentage')}</div>
                <p className='me-1 mb-0 mt-1'> {edit?.assigned_work?.working_percent ?? 'N/A'} </p>
              </div>
            </Col>
          </Row>
        </Show>

        <Show
          IF={
            // eslint-disable-next-line no-mixed-operators
            (user?.user_type_id !== UserTypes.admin && user?.user_type_id === UserTypes.company) ||
            user?.user_type_id === UserTypes.branch
          }
        >
          <Row className='p-2 pb-0'>
            <Col>
              <span className='d-block fw-bolder text-dark me-25'>{FM('company-types')}:</span>
              <p className='mt-25'>
                {user?.company_types?.map((d, i) => {
                  return (
                    <Badge className='me-1' color='light-primary mb-0 mt-1'>
                      {d?.name ?? FM('N/A')}
                    </Badge>
                  )
                })}
              </p>
            </Col>

            <Show IF={user?.user_type_id === UserTypes.company}>
              <Col className=''>
                <span className='d-block fw-bolder text-dark me-25'>
                  {FM('establishment-year')}:
                </span>
                <p className='mt-25'>{user?.establishment_year ?? 'N/A'}</p>
              </Col>
            </Show>
            <Show IF={user?.user_type_id === UserTypes.company}>
              <Col className=''>
                <span className='d-block fw-bolder text-dark me-25'>{FM('licence-key')}:</span>
                <p className='mt-25'>{user?.licence_key ?? 'N/A'}</p>
              </Col>
            </Show>
          </Row>

          <Row className='p-2 pb-0'>
            <span className='d-block fw-bolder text-dark me-25'>{FM('assigned-module')}:</span>
            <p className='mt-25'>
              {user?.assigned_module?.map((d, i) => {
                return (
                  <Badge className='me-1' color='light-primary mb-1 mt-1'>
                    {d?.module?.name ?? FM('N/A')}
                  </Badge>
                )
              })}
            </p>
          </Row>
        </Show>

        <Show IF={user?.user_type_id === UserTypes.patient}>
          <Row className='p-2 pb-0'>
            <span className='d-block fw-bolder text-dark me-25'>{FM('disease-description')}:</span>
            <p className='mt-25'>
              <Badge className='me-1' color='light-primary mb-0 mt-1 text-wrap'>
                {user?.disease_description ?? FM('N/A')}
              </Badge>
            </p>
          </Row>
        </Show>
      </Container>
    </>
  )
}

export default Info
