// // ** Third Party Components
// ** Custom Components
import Avatar from '@components/avatar'
import { History } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import '@styles/react/apps/app-users.scss'
import React, { useContext, useEffect, useState } from 'react'
import { Edit, FileText, Plus } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
// ** Third Party Components
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Input,
  Row,
  UncontrolledAccordion,
  UncontrolledTooltip
} from 'reactstrap'
import { getPath } from '../../../router/RouteHelper'
import { viewFollowUp } from '../../../utility/apis/followup'
import { IconSizes, weekDays } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { formatDate, RenderHtml } from '../../../utility/Utils'
import DropZone from '../../components/buttons/fileUploader'
import FormGroupCustom from '../../components/formGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'
import MiniTable from '../../components/tableGrid/miniTable'
import BsTooltip from '../../components/tooltip'
import FollowUpModal from './fragments/followUpModal'
import QuestionModal from './questionsModal'

const DetailsCard = ({ step = 1, loadingDetails, followUpId, edit, setValue }) => {
  const { colors } = useContext(ThemeColors)
  const [weekDaysSelected, setWeekDaysSelected] = useState(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const [companyData, setCompanyData] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editShow, setEditAdd] = useState(false)
  // const [edit, setEdit] = useState([])
  const [followupEdit, setFollowuEdit] = useState([])
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch,
    reset
  } = useForm()

  const loadDetails = () => {
    if (followUpId) {
      viewFollowUp({
        id: followUpId,
        loading: setLoading,
        success: (d) => {
          const weeks = d.payload?.is_repeat
            ? JSON.parse(d.payload?.week_days)?.map((d) => parseInt(d, 10))
            : null

          setWeekDaysSelected(weeks)
          setCompanyData(d?.payload)
        }
      })
    }
  }

  useEffect(() => {
    if (!isValid(followUpId)) {
      loadDetails()
    }
  }, [followUpId])

  const handleClose = (e) => {
    setEditModal(e)
    setEditModal(null)
  }

  // ** render user docs

  const renderdocx = (edit) => {
    return (
      <Col md='4' xs='6' className='profile-latest-img'>
        <a href='/' onClick={(e) => e.preventDefault()}>
          <img className='img-fluid rounded' src={edit?.documents} alt={'documents'} />
        </a>
      </Col>
    )
  }

  const renderWeeks = () => {
    const re = []
    for (const [key, value] of Object.entries(weekDays)) {
      re.push(
        <>
          <Button.Ripple
            active={weekDaysSelected?.includes(value)}
            className='btn-icon rounded-circle active-dark text-small-12 text-nowrap p-0'
            outline
            color={'primary'}
            style={{ width: 40, height: 40, marginRight: 5 }}
          >
            {FM(key)}
          </Button.Ripple>
        </>
      )
    }
    return <ButtonGroup className='mb-1'>{re}</ButtonGroup>
  }

  function checkURL(documents) {
    return String(documents).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  const renderOldFilePreview = (file) => {
    if (checkURL(file?.documents)) {
      return (
        <img className='rounded' alt={file.name} src={file?.documents} height='150' width='150' />
      )
    } else {
      return <FileText url={file?.documents} size='28' />
    }
  }

  return (
    <>
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
        <>
          <FollowUpModal
            showModal={editModal}
            setShowModal={handleClose}
            followUpId={followUpId}
            noView
          />
          <Row>
            <Col lg={{ size: 8, order: 1 }} sm={{ size: 12 }} xs={{ order: 1 }}>
              <Card className='post'>
                <CardBody>
                  <Row>
                    <Col
                      md='4'
                      lg='4'
                      sm='6'
                      className='d-flex flex-column justify-content-between border-container-lg'
                    >
                      <div className='user-avatar-section'>
                        <div className='d-flex justify-content-start'>
                          <div className='d-flex flex-column ms-1'>
                            <div className='user-info mb-1'>
                              <h4 className='mb-0 text-capitalize'>{edit?.title}</h4>
                            </div>
                            <ButtonGroup color='dark' size='sm'>
                              <UncontrolledTooltip target='followups-history'>
                                {FM('followups-history')}
                              </UncontrolledTooltip>
                              <Show IF={Permissions.ipFollowUpsSelfEdit}>
                                <UncontrolledTooltip target='edit-followups'>
                                  {FM('edit-followups')}
                                </UncontrolledTooltip>
                                <Button.Ripple
                                  onClick={() => {
                                    setEditModal(true)
                                    setFollowuEdit(edit)
                                  }}
                                  color='primary'
                                  id='edit-followups'
                                >
                                  <Edit size='14' />
                                </Button.Ripple>
                              </Show>
                              <Show IF={Permissions.questionsEdit}>
                                <BsTooltip
                                  title={FM('complete-question')}
                                  Tag={Link}
                                  className='btn btn-secondary btn-sm'
                                >
                                  <QuestionModal
                                    scrollControl={false}
                                    handleToggle={(e) => {
                                      if (e) {
                                        setShowAdd(false)
                                      } else {
                                        setShowAdd(true)
                                      }
                                    }}
                                    followupsData={edit}
                                    edit={edit?.questions}
                                  >
                                    <Plus size={IconSizes.InputAddon} />
                                  </QuestionModal>
                                </BsTooltip>
                              </Show>
                              <Link
                                size='sm'
                                to={{
                                  pathname: getPath('followups.history', {
                                    ip: edit?.ip_id,
                                    parent: edit?.parent_id ?? ''
                                  })
                                }}
                                outline
                                color='dark'
                                className='btn btn-dark btn-sm'
                                id='followups-history'
                              >
                                <History size='14' />
                              </Link>
                            </ButtonGroup>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col md='4' lg='4' sm='6' className='mt-2 '>
                      <div className='user-info-wrapper'>
                        <div className='user-info-wrapper'>
                          <MiniTable
                            labelProps={{ md: '4' }}
                            valueProps={{ md: 7 }}
                            label={'start-date'}
                            value={formatDate(edit?.start_date, 'DD MMMM YYYY')}
                          />
                          <MiniTable
                            labelProps={{ md: '4' }}
                            valueProps={{ md: 7 }}
                            label={'reason-for-edit'}
                            value={edit?.reason_for_editing}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md='4' lg='4' sm='6' className='mt-2 '>
                      <div className='user-info-wrapper'>
                        <MiniTable
                          labelProps={{ md: '5' }}
                          valueProps={{ md: 5 }}
                          label={'end-date'}
                          value={formatDate(edit?.end_date, 'DD MMMM YYYY')}
                        />
                      </div>
                    </Col>

                    <UncontrolledAccordion className='accordion-margin mt-2'>
                      <AccordionItem>
                        <AccordionHeader tag='h2' targetId={'1'}>
                          {FM(`description`)}
                        </AccordionHeader>
                        <AccordionBody accordionId={'1'}>
                          <RenderHtml data={edit?.description} />
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader tag='h2' targetId={'2'}>
                          {FM(`remarks`)}
                        </AccordionHeader>
                        <AccordionBody accordionId={'2'}>
                          <RenderHtml data={edit?.remarks} />
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader tag='h2' targetId={'3'}>
                          {FM(`document`)}
                        </AccordionHeader>
                        <AccordionBody accordionId={'3'}>
                          {renderOldFilePreview(edit)}
                        </AccordionBody>
                      </AccordionItem>
                      <AccordionItem>
                        <AccordionHeader tag='h2' targetId={'4'}>
                          {FM(`questions`)}
                        </AccordionHeader>
                        <AccordionBody accordionId={'4'}>
                          {edit?.questions?.map((d, i) => {
                            return (
                              <CardBody>
                                <Row>
                                  <Col md='6'>
                                    <div className='mb-2'>
                                      <div className='h6 '>{FM(`question ${i + 1}`)}</div>
                                      <p className=''> {d?.question} </p>
                                    </div>
                                  </Col>
                                  <Col md='6'>
                                    <div className='mb-2'>
                                      <div className='h6 '>{FM('answer')}</div>
                                      <p className=''> {d?.answer} </p>
                                    </div>
                                  </Col>
                                  <Col md='6'>
                                    <div className='mb-2'>
                                      <div className='h6 '>{FM('created-at')}</div>
                                      <p className=''>
                                        {' '}
                                        {formatDate(d?.created_at, 'DD MMMM YYYY')}{' '}
                                      </p>
                                    </div>
                                  </Col>
                                </Row>
                              </CardBody>
                            )
                          })}
                        </AccordionBody>
                      </AccordionItem>
                    </UncontrolledAccordion>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg={{ size: 4, order: 2 }} sm={{ size: 12 }} xs={{ order: 2 }}>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <div>
                        <h4 color='primary' className='mb-2'>
                          {FM(`patient-details`)}
                        </h4>
                      </div>
                      <Col md='12'>
                        <div className='mb-2'>
                          <div className='h6 '>{FM('ip-name')}</div>
                          <p className=''> {edit?.patient_implementation_plan?.title} </p>
                        </div>
                      </Col>
                      <Col md='12'>
                        <div className='mb-2'>
                          <div className='h6 '>{FM('start-date')}</div>
                          <p className=''> {edit?.patient_implementation_plan?.start_date} </p>
                        </div>
                      </Col>
                      <Col md='12'>
                        <div className='mb-2'>
                          <div className='h6 '>{FM('end-date')}</div>
                          <p className=''> {edit?.patient_implementation_plan?.end_date} </p>
                        </div>
                      </Col>
                      <Col md='12'>
                        <div className='mb-2'>
                          <div className='h6 '>{FM('goal')}</div>
                          <p className=''> {edit?.patient_implementation_plan?.goal} </p>
                        </div>
                      </Col>
                      <Col md='12'>
                        <div className='mb-2'>
                          <div className='h6 '>{FM('sub-goal')}</div>
                          <p className=''> {edit?.patient_implementation_plan?.sub_goal} </p>
                        </div>
                      </Col>
                      <Col md='12'>
                        <div className='mb-2'>
                          <div className='h6 '>{FM('overall-goal')}</div>
                          <p className=''> {edit?.patient_implementation_plan?.overall_goal} </p>
                        </div>
                      </Col>
                      <Col md='12'>
                        <div className='mb-2'>
                          <div className='h6 '>{FM('reason')}</div>
                          <p className=''>
                            {' '}
                            {edit?.patient_implementation_plan?.reason_for_editing}{' '}
                          </p>
                        </div>
                      </Col>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default DetailsCard
