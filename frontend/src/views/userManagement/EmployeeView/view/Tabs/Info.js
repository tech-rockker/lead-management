import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { HourglassEmptyOutlined, ViewWeek } from '@material-ui/icons'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Award, Calendar, Clock, FileText, Info } from 'react-feather'
import { CardBody, Col, Row } from 'reactstrap'
import { incompletePatientFields } from '../../../../../utility/Const'
import { FM, isValid } from '../../../../../utility/helpers/common'
import { incompleteSteps, isAllTrue, viewInHours } from '../../../../../utility/Utils'
import BsTooltip from '../../../../components/tooltip'

const UserInfoTab = ({ user: userData = null, defaultOpen = '1' }) => {
  const [incompleteField, setIncompleteField] = useState(null)
  const [step, setStep] = useState(0)
  const [addPatient, setAddPatient] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [user, setUser] = useState(false)

  const openEditModal = (user, step) => {
    setStep(step)
    setAddPatient(true)
  }

  useEffect(() => {
    if (isValid(userData)) {
      setUser(userData)
    }
  }, [userData])

  function checkURL(documents) {
    return String(documents).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  const renderOldFilePreview = (file) => {
    if (checkURL(file?.documents)) {
      return (
        <a role={'button'} target={'_blank'} href={file?.documents}>
          <img className='rounded' alt={file.name} src={file?.documents} height='150' width='150' />
        </a>
      )
    } else {
      return (
        <a role={'button'} target={'_blank'} href={file?.documents}>
          <FileText url={file?.documents ?? ''} size='150' />
        </a>
      )
    }
  }

  const contractType = () => {
    if (user?.contract_type === '1') {
      return FM('hourly')
    }
    if (user?.contract_type === '2') {
      return FM('fixed')
    } else {
      return FM('N/A')
    }
  }

  const employeeType = () => {
    if (user?.employee_type === '1') {
      return FM('regular')
    }
    if (user?.employee_type === '3') {
      return FM('seasonal')
    }
    if (user?.employee_type === '2') {
      return FM('substitute')
    } else {
      return FM('other')
    }
  }

  const renderRoadMaps = (user, index) => {
    const test = incompleteSteps(incompletePatientFields, { ...user, ...user?.patient_information })
    const info = isAllTrue(test['personal-details'], 'success', 'warning', 'danger')
    const relative = isAllTrue(test['relative-caretaker'], 'success', 'warning', 'danger')
    const diseases = isAllTrue(test['disability-details'], 'success', 'warning', 'danger')
    const work = isAllTrue(test['studies-work'], 'success', 'warning', 'danger')
    const decision = isAllTrue(test['decision-document'], 'success', 'warning', 'danger')

    const avatar =
      user?.gender === 'male'
        ? require('@images/avatars/male2.png')
        : require('@images/avatars/female2.png')
    return (
      <>
        <div key={`patient-card-${index}`} className='flex-1'>
          <CardBody className='p-0 pt-1 pb-1'>
            {/* <Row noGutters className='d-flex align-items-start justify-content-between'>
                            <Col md="2" xs="2" className='position-relative'>
                                <BsTooltip role="button" title={info === "success" ? null : FM("incomplete-details")}>
                                    <div
                                        onClick={() => {
                                            openEditModal(user, 1)
                                        }}
                                        role="button" className='text-center stepCol'>
                                        <div className='d-flex justify-content-center mt-1'>
                                            <div className='position-relative'>
                                                <Badge pill color={info} className='badge-up'>

                                                </Badge>
                                                <ReceiptOutlined className='text-secondary' style={{ width: 25, height: 25 }} />
                                            </div>
                                        </div>
                                        <span className='text-dark    fw-bold text-step-title'>
                                            {FM("info")}
                                        </span>
                                    </div>
                                </BsTooltip>
                            </Col>
                            <Col md="2" xs="2" className='position-relative'>
                                <BsTooltip role="button" title={relative === "success" ? null : FM("incomplete-details")}>

                                    <div
                                        onClick={() => {
                                            openEditModal(user, 2)
                                        }}
                                        role="button" className='text-center stepCol'>
                                        <div className='d-flex justify-content-center mt-1'>
                                            <div className='position-relative'>
                                                <Badge pill color={relative} className='badge-up'>
                                                    {countPlus(user?.persons?.length)}
                                                </Badge>
                                                <PeopleOutlineSharp className='text-secondary' style={{ width: 25, height: 25 }} />
                                            </div>
                                        </div>
                                        <span className='text-dark   fw-bold text-step-title'>
                                            {FM("relatives")}
                                        </span>
                                    </div>
                                </BsTooltip>
                            </Col>
                            <Col md="2" xs="2" className='position-relative'>
                                <BsTooltip role="button" title={diseases === "success" ? null : FM("incomplete-details")}>
                                    <div
                                        onClick={() => {
                                            openEditModal(user, 3)
                                        }}
                                        role="button" className='text-center stepCol'>
                                        <div className='d-flex justify-content-center mt-1'>
                                            <div className='position-relative'>
                                                <Badge pill color={diseases} className='badge-up'>

                                                </Badge>
                                                <AccessibleOutlined className='text-secondary' style={{ width: 25, height: 25 }} />
                                            </div>
                                        </div>
                                        <span className='text-dark   fw-bold text-step-title'>
                                            {FM("diseases")}
                                        </span>
                                    </div>
                                </BsTooltip>
                            </Col>
                            <Col md="2" xs="2" className='position-relative'>
                                <BsTooltip role="button" title={work === "success" ? null : FM("incomplete-details")}>
                                    <div
                                        onClick={() => {
                                            openEditModal(user, 4)
                                        }}
                                        role="button" className='text-center stepCol'>
                                        <div className='d-flex justify-content-center mt-1'>
                                            <div className='position-relative'>
                                                <Badge pill color={work} className='badge-up'>

                                                </Badge>
                                                <WorkOutline className='text-secondary' style={{ width: 25, height: 25 }} />
                                            </div>
                                        </div>
                                        <span className='text-dark   fw-bold text-step-title'>
                                            {FM("work-study")}
                                        </span>
                                    </div>
                                </BsTooltip>
                            </Col>
                            <Col md="2" xs="2" className='position-relative'>
                                <BsTooltip role="button" title={decision === "success" ? null : FM("incomplete-details")}>
                                    <div
                                        onClick={() => {
                                            openEditModal(user, 6)
                                        }}
                                        role="button" className='text-center'>
                                        <div className='d-flex justify-content-center mt-1'>
                                            <div className='position-relative'>
                                                <Badge pill color={decision} className='badge-up'>

                                                </Badge>
                                                <TimelapseOutlined className='text-secondary' style={{ width: 25, height: 25 }} />
                                            </div>
                                        </div>
                                        <span className='text-dark   fw-bold text-step-title' >
                                            {FM("decisions")}
                                        </span>
                                    </div>
                                </BsTooltip>
                            </Col>
                        </Row> */}
          </CardBody>
        </div>
      </>
    )
  }
  const calculation = Math.floor(
    user?.assigned_work?.assigned_working_hour_per_week *
      (user?.assigned_work?.working_percent / 100) *
      60
  )

  return (
    <>
      <div>
        <CardBody className=' border-top'>
          <Row className='align-items-start gy-2'>
            <Col md='4'>
              <p className='mb-0 text-dark fw-bolder'>{FM('name')}</p>
              <p className='mb-0 fw-bold text-secondary'>{user?.name}</p>
            </Col>
            <Col md='4'>
              <div className='mb-2'>
                <div className='h5 text-dark fw-bolder'>{FM('verification-method-type')}</div>
                <p className=''>
                  {' '}
                  {user?.verification_method === 'bank_id' ? FM('bankId') : FM('normal')}{' '}
                </p>
              </div>
            </Col>
            <Col md='4'>
              <p className='mb-0 text-dark fw-bolder'>{FM('status')}</p>
              <p
                className={classNames('mb-0 fw-bold', {
                  'text-success': user?.status === 1,
                  'text-danger': user?.status === 0
                })}
              >
                {user?.status === 1 ? FM('active') : FM('inactive')}
              </p>
            </Col>
            <Col md='4'>
              <p className='mb-0 text-dark fw-bolder'>{FM('contract-type')}</p>
              <p className='mb-0 fw-bold text-secondary'>{contractType(user)}</p>
            </Col>
            <Col md='4'>
              <p className='mb-0 text-dark fw-bolder'>{FM('salary')}</p>
              <p className='mb-0 fw-bold text-secondary'>{user?.contract_value}</p>
            </Col>
            <Col md='4'>
              <p className='mb-0 text-dark fw-bolder'>{FM('employee-type')}</p>
              <p className='mb-0 fw-bold text-secondary'>{employeeType(user)}</p>
            </Col>
          </Row>
          <Row className='justify-content-between align-items-start gy-2 mt-2 border-top'>
            <Col md='4'>
              <StatsHorizontal
                className={'white'}
                icon={<Clock fontSize='small' />}
                color='success'
                stats={
                  user?.assigned_work?.assigned_working_hour_per_week
                    ? viewInHours(user?.assigned_work?.assigned_working_hour_per_week * 60)
                    : '0'
                }
                statTitle={FM('assigned-hour')}
              />
            </Col>

            <Col md='4'>
              <StatsHorizontal
                className={'white'}
                icon={<Award fontSize='small' />}
                color='success'
                stats={
                  user?.assigned_work?.working_percent
                    ? FM(`${user?.assigned_work?.working_percent}%`)
                    : '0'
                }
                statTitle={FM('working-percentage')}
              />
            </Col>
          </Row>
          <Row>
            <Col md='4'>
              <StatsHorizontal
                className={'white'}
                icon={<ViewWeek size={30} />}
                color='info'
                stats={calculation ? viewInHours(calculation) : 0}
                statTitle={
                  <>
                    {FM('hours-per-week')}
                    <BsTooltip
                      className='ms-25'
                      title={
                        <>
                          {`((${user?.assigned_work?.assigned_working_hour_per_week} x (${user?.assigned_work?.working_percent} / 100)) x 60) = ${calculation} minutes`}
                        </>
                      }
                    >
                      <Info className='text-primary' size={14} />
                    </BsTooltip>
                  </>
                }
              />
            </Col>
            <Col md='4'>
              <StatsHorizontal
                className={'white'}
                icon={<HourglassEmptyOutlined size={30} />}
                color='primary'
                key={
                  (user?.assigned_work?.assigned_working_hour_per_week *
                    (user?.assigned_work?.working_percent / 100)) /
                  5
                    ? viewInHours(
                        ((user?.assigned_work?.assigned_working_hour_per_week *
                          (user?.assigned_work?.working_percent / 100)) /
                          5) *
                          60
                      )
                    : '0'
                }
                stats={calculation ? viewInHours(Math.floor(calculation / 5)) : 0}
                statTitle={
                  <>
                    {FM('hours-per-day')}
                    <BsTooltip
                      className='ms-25'
                      title={<>{`${calculation} / 5 = ${calculation / 5} minutes`}</>}
                    >
                      <Info className='text-primary' size={14} />
                    </BsTooltip>
                  </>
                }
              />
            </Col>
            <Col md='4'>
              <StatsHorizontal
                className={'white'}
                icon={<Calendar size={30} />}
                color='success'
                stats={calculation ? viewInHours((calculation / 5) * 20) : 0}
                statTitle={
                  <>
                    {FM('hours-per-month')}
                    <BsTooltip
                      className='ms-25'
                      title={
                        <>
                          {`${calculation / 5} x 20 = ${Math.floor(calculation / 5) * 20} minutes`}
                        </>
                      }
                    >
                      <Info className='text-primary' size={14} />
                    </BsTooltip>
                  </>
                }
              />
            </Col>
          </Row>
        </CardBody>
      </div>
    </>
  )
}

export default UserInfoTab
