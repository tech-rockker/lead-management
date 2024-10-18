import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import {
  AccessibleOutlined,
  HourglassEmptyOutlined,
  PeopleOutlineSharp,
  ReceiptOutlined,
  TimelapseOutlined,
  ViewWeek,
  WatchLater,
  WorkOutline
} from '@material-ui/icons'
import moment from 'moment'
import React, { useEffect, useReducer, useState } from 'react'
import { Calendar, Edit, Plus } from 'react-feather'
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Badge,
  CardBody,
  Col,
  Row,
  UncontrolledAccordion
} from 'reactstrap'
import { patientApprovalHours } from '../../../../../../utility/apis/commons'
import {
  forDecryption,
  incompletePatientFields,
  incompletePatientSteps,
  presets,
  UserTypes
} from '../../../../../../utility/Const'
import { FM, isValid, log } from '../../../../../../utility/helpers/common'
import Hide from '../../../../../../utility/Hide'
import Show from '../../../../../../utility/Show'
import {
  countPlus,
  decryptObject,
  fastLoop,
  formatDate,
  getDates,
  incompleteSteps,
  isAllTrue,
  viewInHours
} from '../../../../../../utility/Utils'
import BsTooltip from '../../../../../components/tooltip'
import PersonModal from '../../../../fragment/PersonModal'
import UserModal from '../../../../fragment/UserModal'

const UserInfoTab = ({ user: userData = null, defaultOpen = '1', hours }) => {
  const [incompleteField, setIncompleteField] = useState(null)
  const [step, setStep] = useState(0)
  const [addPatient, setAddPatient] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [user, setUser] = useState(false)
  const [patientHours, setPatientHours] = useState(null)

  const initState = {
    page: 1,
    perPage: 50,
    loading: false,

    startOfMonth: moment().startOf('week').toDate(),
    endOfMonth: moment().endOf('week').toDate()
  }

  const stateReducer = (o, n) => ({ ...o, ...n })
  const [state, setState] = useReducer(stateReducer, initState)

  const openEditModal = (user, step) => {
    setStep(step)
    setAddPatient(true)
  }

  useEffect(() => {
    if (isValid(userData)) {
      setUser(userData)
    }
  }, [userData])

  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(null)
  const [list, setList] = useState([])

  useEffect(() => {
    if (isValid(user?.id)) {
      setId(user?.id)
    }
  }, [user?.id])

  const handlePresets = (preset) => {
    if (isValid(preset)) {
      if (preset === presets.thisMonth) {
        const startOfMonth = moment().startOf('month').toDate()
        const endOfMonth = moment().endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.thisWeek) {
        const startOfMonth = moment().startOf('week').toDate()
        const endOfMonth = moment().endOf('week').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.prevMonth) {
        const startOfMonth = moment().subtract(1, 'months').startOf('month').toDate()
        const endOfMonth = moment().subtract(1, 'months').endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.nextMonth) {
        const startOfMonth = moment().add(1, 'months').startOf('month').toDate()
        const endOfMonth = moment().add(1, 'months').endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === 'custom') {
        if (isValid(state.startOfMonth) && isValid(state.endOfMonth)) {
          const dates = getDates(state.startOfMonth, state.endOfMonth)
          setState({ dates })
        }
      }
    }
  }

  useEffect(() => {
    handlePresets('custom')
  }, [state?.startOfMonth, state?.endOfMonth])

  useEffect(() => {
    if (isValid(user)) {
      let assigned_hours_per_month = 0
      let assigned_hours_per_week = 0
      let assigned_hours_per_day = 0
      let assigned_hours = 0

      fastLoop(user?.agency_hours, (h, i) => {
        assigned_hours_per_month += Number(h?.assigned_hours_per_month)
        assigned_hours_per_week += Number(h?.assigned_hours_per_week)
        assigned_hours_per_day += Number(h?.assigned_hours_per_day)
        assigned_hours += Number(h?.assigned_hours)
      })
      setPatientHours({
        assigned_hours_per_month: assigned_hours_per_month * 60,
        assigned_hours_per_week: assigned_hours_per_week * 60,
        assigned_hours_per_day: assigned_hours_per_day * 60,
        assigned_hours: assigned_hours * 60
      })
      // setValue("branch_id", patient?.branch_id)
    }
  }, [user])

  const loadApprovalHours = () => {
    patientApprovalHours({
      jsonData: {
        patient_id: id,
        start_date: formatDate(state?.startOfMonth) ?? null,
        end_date: formatDate(state?.endOfMonth) ?? null
      },
      loading: setLoading,
      success: (e) => {
        setList(e?.payload?.date)
        log(e?.payload?.date)
      }
    })
  }

  // useEffect(() => {
  //     loadApprovalHours()
  // }, [id])

  // useEffect(() => {
  //     if (isValid(id)) {
  //         loadApprovalHours()
  //     }
  // }, [state.startOfMonth, state.endOfMonth])

  const renderRoadMaps = (user, index) => {
    // const d = jsonDecodeAll(userFields, { ...user, ...user?.patient_information })
    const test = incompleteSteps(incompletePatientFields, user)
    // log("sdsdsd", user)
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
            <Row noGutters className='d-flex align-items-start justify-content-between'>
              <Col md='2' xs='2' className='position-relative'>
                <BsTooltip
                  role='button'
                  title={info === 'success' ? null : FM('incomplete-details')}
                >
                  <div
                    onClick={() => {
                      // openEditModal(user, 1)
                    }}
                    role='button'
                    className='text-center stepCol'
                  >
                    <div className='d-flex justify-content-center mt-1'>
                      <div className='position-relative'>
                        <Badge pill color={info} className='badge-up'></Badge>
                        <ReceiptOutlined
                          className='text-secondary'
                          style={{ width: 25, height: 25 }}
                        />
                      </div>
                    </div>
                    <span className='text-dark    fw-bold text-step-title'>{FM('info')}</span>
                  </div>
                </BsTooltip>
              </Col>
              <Col md='2' xs='2' className='position-relative'>
                <BsTooltip
                  role='button'
                  title={relative === 'success' ? null : FM('incomplete-details')}
                >
                  <div
                    onClick={() => {
                      // openEditModal(user, 2)
                    }}
                    role='button'
                    className='text-center stepCol'
                  >
                    <div className='d-flex justify-content-center mt-1'>
                      <div className='position-relative'>
                        <Badge pill color={relative} className='badge-up'>
                          {countPlus(user?.persons?.length)}
                        </Badge>
                        <PeopleOutlineSharp
                          className='text-secondary'
                          style={{ width: 25, height: 25 }}
                        />
                      </div>
                    </div>
                    <span className='text-dark   fw-bold text-step-title'>{FM('relatives')}</span>
                  </div>
                </BsTooltip>
              </Col>
              <Col md='2' xs='2' className='position-relative'>
                <BsTooltip
                  role='button'
                  title={diseases === 'success' ? null : FM('incomplete-details')}
                >
                  <div
                    onClick={() => {
                      // openEditModal(user, 3)
                    }}
                    role='button'
                    className='text-center stepCol'
                  >
                    <div className='d-flex justify-content-center mt-1'>
                      <div className='position-relative'>
                        <Badge pill color={diseases} className='badge-up'></Badge>
                        <AccessibleOutlined
                          className='text-secondary'
                          style={{ width: 25, height: 25 }}
                        />
                      </div>
                    </div>
                    <span className='text-dark   fw-bold text-step-title'>{FM('diseases')}</span>
                  </div>
                </BsTooltip>
              </Col>
              <Col md='2' xs='2' className='position-relative'>
                <BsTooltip
                  role='button'
                  title={work === 'success' ? null : FM('incomplete-details')}
                >
                  <div
                    onClick={() => {
                      // openEditModal(user, 4)
                    }}
                    role='button'
                    className='text-center stepCol'
                  >
                    <div className='d-flex justify-content-center mt-1'>
                      <div className='position-relative'>
                        <Badge pill color={work} className='badge-up'></Badge>
                        <WorkOutline className='text-secondary' style={{ width: 25, height: 25 }} />
                      </div>
                    </div>
                    <span className='text-dark   fw-bold text-step-title'>{FM('work-study')}</span>
                  </div>
                </BsTooltip>
              </Col>
              <Col md='2' xs='2' className='position-relative'>
                <BsTooltip
                  role='button'
                  title={decision === 'success' ? null : FM('incomplete-details')}
                >
                  <div
                    onClick={() => {
                      // openEditModal(user, 6)
                    }}
                    role='button'
                    className='text-center'
                  >
                    <div className='d-flex justify-content-center mt-1'>
                      <div className='position-relative'>
                        <Badge pill color={decision} className='badge-up'></Badge>
                        <TimelapseOutlined
                          className='text-secondary'
                          style={{ width: 25, height: 25 }}
                        />
                      </div>
                    </div>
                    <span className='text-dark   fw-bold text-step-title'>{FM('decisions')}</span>
                  </div>
                </BsTooltip>
              </Col>
            </Row>
          </CardBody>
        </div>
      </>
    )
  }
  return (
    <>
      <UserModal
        Component={Plus}
        size={18}
        step={step}
        showModal={addPatient}
        setShowModal={setAddPatient}
        noView
        userId={user?.id}
        setSaveLoading={setSaveLoading}
        enableSaveIp={false}
        onSuccess={(e) => {
          setUser(e)
        }}
        userType={UserTypes.patient}
        scrollControl={false}
      />
      {renderRoadMaps(user)}
      <div className=' white m-1'>
        <UncontrolledAccordion defaultOpen={defaultOpen}>
          <AccordionItem className='shadow mb-1 border-0  white'>
            <AccordionHeader targetId='1'>
              <Row className='flex-1'>
                <Col md='12'>
                  <h5 className='mb-0'>
                    {FM('persons')}
                    <BsTooltip
                      onClick={() => {
                        setStep(incompletePatientSteps['relative-caretaker'])
                        setAddPatient(true)
                      }}
                      Tag={Edit}
                      title={FM('edit')}
                      role={'button'}
                      style={{ marginTop: -5 }}
                      className='ms-1 d-none'
                      size={16}
                    />
                  </h5>
                </Col>
              </Row>
            </AccordionHeader>
            <AccordionBody accordionId='1'>
              <PersonModal
                hideEdit
                fromView
                hideHeader
                hideAdd
                edit={user}
                onSuccess={(e) => log('persons', decryptObject(forDecryption, e))}
              />
            </AccordionBody>
          </AccordionItem>
          <AccordionItem className='shadow mb-1 border-0 white'>
            <AccordionHeader targetId='2'>
              <Row className='flex-1'>
                <Col md='12'>
                  <h5 className='mb-0'>
                    {FM('disability-details')}
                    <BsTooltip
                      onClick={() => {
                        setStep(incompletePatientSteps['disability-details'])
                        setAddPatient(true)
                      }}
                      Tag={Edit}
                      title={FM('edit')}
                      role={'button'}
                      style={{ marginTop: -5 }}
                      className='ms-1 d-none'
                      size={16}
                    />
                  </h5>
                </Col>
              </Row>
            </AccordionHeader>
            <AccordionBody accordionId='2' className='pt-1'>
              <Show
                IF={
                  isValid(user?.disease_description) ||
                  isValid(user?.patient_information?.aids) ||
                  isValid(user?.patient_information?.special_information)
                }
              >
                <Hide IF={!isValid(user?.disease_description)}>
                  <div className='mb-2'>
                    <div className='h5 text-dark fw-bolder'>{FM('disease-description')}</div>
                    <p className=''> {user?.disease_description} </p>
                  </div>
                </Hide>
                <Hide IF={user?.patient_information?.aids === null}>
                  <div className='mb-2'>
                    <div className='h5 text-dark fw-bolder '>{FM('aids')}</div>
                    <p className=''> {user?.patient_information?.aids} </p>
                  </div>
                </Hide>
                <Hide IF={user?.patient_information?.special_information === null}>
                  <div className='mb-2'>
                    <div className='h5 text-dark fw-bolder  '>{FM('special-information')}</div>
                    <p className=''> {user?.patient_information?.special_information} </p>
                  </div>
                </Hide>
              </Show>
            </AccordionBody>
          </AccordionItem>

          <AccordionItem className='shadow mb-1 border-0 white'>
            <AccordionHeader targetId='3'>
              <Row className='flex-1'>
                <Col md='12'>
                  <h5 className='mb-0'>
                    {FM('studies-work')}
                    <BsTooltip
                      onClick={() => {
                        setStep(incompletePatientSteps['studies-work'])
                        setAddPatient(true)
                      }}
                      Tag={Edit}
                      title={FM('edit')}
                      role={'button'}
                      style={{ marginTop: -5 }}
                      className='ms-1 d-none'
                      size={16}
                    />
                  </h5>
                </Col>
              </Row>
            </AccordionHeader>
            <AccordionBody accordionId='3' className='pt-1'>
              <Row>
                <div className='mb-2'>
                  <div className='h5 text-dark fw-bolder'>{FM('patient-type')}</div>
                  <p className=''>
                    {' '}
                    {user?.patient_types?.map((d, i) => {
                      return (
                        <Badge className='me-1' color='light-primary'>
                          {d?.designation}
                        </Badge>
                      )
                    })}
                  </p>
                </div>
              </Row>
              <Row>
                <Hide IF={!isValid(user?.institute_name)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('institute-name')}</div>
                      <p className=''> {user?.institute_name} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.institute_contact_person)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('contact-person')}</div>
                      <p className=''> {user?.institute_contact_person} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.institute_contact_number)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('institute-phone')}</div>
                      <p className=''> {user?.institute_contact_number} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.institute_full_address)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('institute-address')}</div>
                      <p className=''> {user?.institute_full_address} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.classes_from)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('time-from')}</div>
                      <p className=''> {formatDate(user?.classes_from, 'HH:mm')} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.classes_to)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('time-to')}</div>
                      <p className=''> {formatDate(user?.classes_to, 'HH:mm')} </p>
                    </div>
                  </Col>
                </Hide>
              </Row>
              <hr className='mt-0 mb-2' />
              <Row className=''>
                <Hide IF={!isValid(user?.company_name)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('company-name')}</div>
                      <p className=''> {user?.company_name} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.company_contact_person)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('contact-person')}</div>
                      <p className=''> {user?.company_contact_person} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.company_contact_number)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('company-phone')}</div>
                      <p className=''> {user?.company_contact_number} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.company_full_address)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('company-address')}</div>
                      <p className=''> {user?.company_full_address} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.from_timing)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('working-from')}</div>
                      <p className=''> {formatDate(user?.from_timing, 'HH:mm')} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.to_timing)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('work-to')}</div>
                      <p className=''> {formatDate(user?.to_timing, 'HH:mm')} </p>
                    </div>
                  </Col>
                </Hide>
              </Row>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem className='shadow mb-1 border-0 white'>
            <AccordionHeader targetId='4'>
              <Row className='flex-1'>
                <Col md='12'>
                  <h5 className='mb-0'>
                    {FM('other-activities')}
                    <BsTooltip
                      onClick={() => {
                        setStep(incompletePatientSteps['other-activities'])
                        setAddPatient(true)
                      }}
                      Tag={Edit}
                      title={FM('edit')}
                      role={'button'}
                      style={{ marginTop: -5 }}
                      className='ms-1 d-none'
                      size={16}
                    />
                  </h5>
                </Col>
              </Row>
            </AccordionHeader>
            <AccordionBody accordionId='4' className='pt-1'>
              <Row>
                <Hide IF={!isValid(user?.another_activity)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('activity-type')}</div>
                      <p className=''> {user?.another_activity} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.another_activity_name)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('name')}</div>
                      <p className=''> {user?.another_activity_name} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.another_activity_contact_person)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('contact-person')}</div>
                      <p className=''> {user?.another_activity_contact_person} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.activitys_contact_number)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('contact-number')}</div>
                      <p className=''> {user?.activitys_contact_number} </p>
                    </div>
                  </Col>
                </Hide>
                <Hide IF={!isValid(user?.activitys_full_address)}>
                  <Col md='4'>
                    <div className='mb-2'>
                      <div className='h5 text-dark fw-bolder'>{FM('address')}</div>
                      <p className=''> {user?.activitys_full_address} </p>
                    </div>
                  </Col>
                </Hide>
              </Row>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem className='shadow mb-1 border-0 white'>
            <AccordionHeader targetId='5'>
              <Row className='flex-1'>
                <Col md='12'>
                  <h5 className='mb-0'>
                    {FM('decision-document')}
                    <BsTooltip
                      onClick={() => {
                        setStep(incompletePatientSteps['decision-document'])
                        setAddPatient(true)
                      }}
                      Tag={Edit}
                      title={FM('edit')}
                      role={'button'}
                      style={{ marginTop: -5 }}
                      className='ms-1 d-none'
                      size={16}
                    />
                  </h5>
                </Col>
              </Row>
            </AccordionHeader>
            <AccordionBody accordionId='5' className='pt-1'>
              {/* <Row>

                                                <Hide IF={!isValid(d?.name)}>
                                                    <Col md="4">
                                                        <StatsHorizontal className={"white"}
                                                            icon={<PermContactCalendarIcon fontSize="small" />}
                                                            color='primary'
                                                            stats={d?.name}
                                                            statTitle={FM("agency-name")} />

                                                    </Col>
                                                </Hide>
                                               
                                                <Hide IF={!isValid(d?.start_date)}>


                                                    <Col md="4">
                                                        <StatsHorizontal className={"white"}
                                                            icon={<TodayIcon fontSize="small" />}
                                                            color='primary'
                                                            stats={d?.start_date}
                                                            statTitle={FM("start-date")} />

                                                    </Col>
                                                </Hide>
                                                <Hide IF={!isValid(d?.end_date)}>
                                                    <Col md="4">
                                                        <StatsHorizontal className={"white"}
                                                            icon={<EventIcon fontSize="small" />}
                                                            color='primary'
                                                            stats={d?.end_date}
                                                            statTitle={FM("end-date")} />

                                                    </Col>
                                                </Hide>
                                            </Row> */}
              {user?.agency_hours?.map((d, i) => {
                return (
                  <>
                    <Row>
                      <Hide IF={!isValid(d?.name)}>
                        <Col md='3'>
                          <div className='mb-2'>
                            <div className='h5 text-dark fw-bolder'>{FM('agency')}</div>
                            <p className=''> {d?.name} </p>
                          </div>
                        </Col>
                      </Hide>
                      <Hide IF={!isValid(d?.assigned_hours)}>
                        <Col md='3'>
                          <div className='mb-2'>
                            <div className='h5 text-dark fw-bolder'>{FM('hours')}</div>
                            <p className=''> {d?.assigned_hours} </p>
                          </div>
                        </Col>
                      </Hide>
                      <Hide IF={!isValid(d?.start_date)}>
                        <Col md='3'>
                          <div className='mb-2'>
                            <div className='h5 text-dark fw-bolder'>{FM('start-date')}</div>
                            <p className=''> {d?.start_date} </p>
                          </div>
                        </Col>
                      </Hide>
                      <Hide IF={!isValid(d?.end_date)}>
                        <Col md='3'>
                          <div className='mb-2'>
                            <div className='h5 text-dark fw-bolder'>{FM('end-date')}</div>
                            <p className=''> {d?.end_date} </p>
                          </div>
                        </Col>
                      </Hide>
                    </Row>
                    <Row>
                      <Col md='3'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<HourglassEmptyOutlined fontSize='small' />}
                          color='primary'
                          stats={
                            d?.assigned_hours_per_day
                              ? viewInHours(d?.assigned_hours_per_day * 60)
                              : '0'
                          }
                          statTitle={FM('hours-per-day')}
                        />
                      </Col>
                      <Col md='3'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<ViewWeek fontSize='small' />}
                          color='info'
                          stats={
                            d?.assigned_hours_per_week
                              ? viewInHours(d?.assigned_hours_per_week * 60)
                              : '0'
                          }
                          statTitle={FM('hours-per-week')}
                        />
                      </Col>
                      <Col md='3'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<Calendar fontSize='small' />}
                          color='success'
                          stats={
                            d?.assigned_hours_per_month
                              ? viewInHours(d?.assigned_hours_per_month * 60)
                              : '0'
                          }
                          statTitle={FM('hours-per-month')}
                        />
                      </Col>
                      <Col md='3'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<WatchLater fontSize='small' />}
                          color='success'
                          stats={d?.assigned_hours ? viewInHours(d?.assigned_hours * 60) : '0'}
                          statTitle={FM('total-hours')}
                        />
                      </Col>
                    </Row>
                  </>
                )
              })}
              <Row className='mt-0'>
                <Col md={12}>
                  {/* <Card className='white'>
                                                        <CardBody className='p-0 '> */}
                  <Row className='flex-1 m-0'>
                    <Show IF={isValid(user?.id)}></Show>
                  </Row>
                  {/* </CardBody>
                                                    </Card> */}
                </Col>
              </Row>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>
      </div>
    </>
  )
}

export default UserInfoTab
