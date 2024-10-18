import { IndeterminateCheckBoxOutlined, Rotate90DegreesCcw } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Edit,
  Edit2,
  Edit3,
  Eye,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders,
  StopCircle,
  Trash2,
  User
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { followupDelete } from '../../../redux/reducers/followups'
import { getPath } from '../../../router/RouteHelper'
// import Hide from '../../../utility/Hide'
import {
  deleteFollowUp,
  loadFollowUp,
  loadFollowUpEditHistory
} from '../../../utility/apis/followup'
import { CategoryType, forDecryption, IconSizes } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import useModules from '../../../utility/hooks/useModules'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { countPlus, decryptObject, formatDate, truncateText } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import NoActiveModule from '../../components/NoModule'
import BsPopover from '../../components/popover'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import TaskModal from '../tasks/fragment/TaskModal'
import CompleteModal from './CompleteModal'
import FilterFollow from './followupFilter'
import FollowupViewModal from './FollowupViewModal'
import FollowUpModal from './fragments/followUpModal'

const FollowUps = ({ onSuccess = () => {} }) => {
  const { colors } = useContext(ThemeColors)
  const followupsState = useSelector((state) => state?.followups)

  const dispatch = useDispatch()
  const params = useParams()
  const parent = parseInt(params.parent)
  const location = useLocation()
  const from = location?.state?.from ?? null
  const status = location?.state?.status
  const ip = parseInt(params.ip)
  const [showAdd, setShowAdd] = useState(false)
  const [showView, setShowView] = useState(false)
  const [followFilter, setFollowFilter] = useState(false)
  const [failed, setFailed] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [deletedId, setDeletedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [edit, setEdit] = useState(null)
  const [filterData, setFilterData] = useState({
    status: status ?? ip ? null : 0
  })

  const [completeModal, setCompleteModal] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [step, setStep] = useState('1')
  const [taskModal, setTaskModal] = useState(false)
  const [sourceId, setSourceId] = useState(null)
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()
  const notification = location?.state?.notification

  //complete modal
  const handleCompleteModal = () => setCompleteModal(!completeModal)

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
    }
  }, [])

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(e)
      setEdit(null)
      setShowView(e)
      setViewModal(e)
      setTaskModal(false)
      setReload(true)
      setStep('1')
    }
  }

  const openEditModal = (followup, step) => {
    setViewModal(!viewModal)
    setEdit(followup)
    setStep(step)
  }
  const isVisibleHistory = (followup) => {
    return Can(Permissions.ipFollowUpsSelfBrowse) && !ip
  }

  const canEdit = (followup) => {
    return (
      Can(Permissions.ipFollowUpsSelfEdit) &&
      (followup?.is_completed === 0 || followup?.status === 0)
    )
  }
  const canComplete = (followup) => {
    return (
      Can(Permissions.ipFollowUpsSelfEdit) &&
      (followup?.is_completed === 0 || followup?.status === 0)
    )
  }

  useEffect(() => {
    if (notification?.data_id && notification?.type === 'followup') {
      setViewModal(true)
      setEdit({
        id: notification?.data_id
      })
    }
    window.history.replaceState({ fffff: 'kj' }, document.title)
  }, [notification])

  const FollowupCard = (d, index) => {
    const followup = decryptObject(forDecryption, d)
    const actBy = decryptObject(forDecryption, followup?.action_by_user)
    const PatBy = decryptObject(forDecryption, followup?.patient_implementation_plan?.patient)
    const Pat2By = decryptObject(forDecryption, followup?.patient)

    return (
      <>
        <div className='flex-1' key={`ip-${index}`}>
          <Card className='animate__animated animate__fadeIn'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='11' className='d-flex align-items-center'>
                  <Row>
                    {/* <Col xs="2">
                                            <Avatar color={followup?.status === 1 ? 'light-primary' : 'light-primary'} content={getInitials(followup?.title)} />
                                        </Col> */}
                    <Col>
                      <h5 className='mb-3px fw-bolder text-primary text-capitalize'>
                        {followup?.title}
                      </h5>
                      <p
                        className={classNames('mb-0 text-small-12 text-truncate', {
                          'text-success': followup?.is_completed === 1,
                          'text-danger': followup?.status === 0
                        })}
                      >
                        {followup?.is_completed === 1 ? (
                          <>
                            {' '}
                            {FM('completed-at')} {followup?.action_date} {FM('&-completed-by')}{' '}
                            {actBy?.name}
                          </>
                        ) : (
                          FM('incomplete')
                        )}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      {
                        IF: Can(Permissions.ipFollowUpsSelfRead),
                        icon: <Eye size={14} />,
                        onClick: () => {
                          setViewModal(true)
                          setEdit(followup)
                        },
                        name: FM('view')
                      },

                      {
                        IF: isVisibleHistory(followup),
                        icon: <Eye size={14} />,
                        to: {
                          pathname: getPath('followups.history', {
                            ip: followup?.ip_id,
                            parent: followup?.id ?? ''
                          })
                        },
                        name: FM('edit-history')
                      },

                      {
                        IF: canEdit(followup) && !isValid(followup?.parent_id),
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowAdd(true)
                          setEdit(followup)
                        },
                        name: FM('edit')
                      },

                      {
                        IF: canComplete(followup) && !isValid(followup?.parent_id),
                        icon: <Check size={14} />,
                        onClick: () => {
                          handleCompleteModal()
                          setEdit(followup)
                        },

                        name: FM('complete')
                      },
                      {
                        IF: Can(Permissions.taskAdd) && !isValid(followup?.parent_id),
                        icon: <Plus size={14} />,
                        onClick: () => {
                          setTaskModal(true)
                          setEdit(followup)
                        },
                        name: FM('add-task')
                      },
                      {
                        IF: Can(Permissions.ipFollowUpsSelfDelete) && !isValid(followup?.parent_id),
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={followup}
                            title={FM('delete-this', { name: followup?.title })}
                            color='text-warning'
                            onClickYes={() => deleteFollowUp({ id: followup?.id })}
                            onSuccessEvent={(item) => dispatch(followupDelete(item?.id))}
                            className='sm-0 dropdown-item'
                            id={`grid-delete-${followup?.id}`}
                          >
                            <Trash2 size={14} className='me-1' />
                            {FM('delete')}
                          </ConfirmAlert>
                        )
                      }
                    ]}
                  />
                </Col>
              </Row>
            </CardBody>

            <CardBody className='border-top'>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-date')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Calendar size={14} />{' '}
                      {formatDate(followup?.start_date, 'DD MMMM, YYYY') ?? 'N/A'}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('end-date')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Calendar size={14} />{' '}
                      {formatDate(followup?.end_date, 'DD MMMM, YYYY') ?? 'N/A'}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-time')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Clock size={14} /> {followup?.start_time ?? 'N/A'}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('end-time')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Clock size={14} /> {followup?.end_time ?? 'N/A'}
                    </a>
                  </p>
                </Col>
              </Row>
            </CardBody>

            <CardBody className='border-top'>
              <Row className='align-items-center gy-2'>
                <Col md='12'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('description')}</p>
                  <BsPopover
                    title={FM('description')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(followup?.description, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    <Edit2 size={14} />{' '}
                    {followup?.description ? truncateText(followup?.description, 50) : 'N/A'}
                  </BsPopover>
                </Col>
                <Col md='12'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('comments')}</p>
                  <BsPopover
                    title={FM('comments')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(followup?.remarks, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    <Edit3 size={14} />{' '}
                    {followup?.remarks ? truncateText(followup?.remarks, 50) : 'N/A'}
                  </BsPopover>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='p-0 pt-1 pb-1 border-top'>
              <Row noGutters className='d-flex align-items-start justify-content-start'>
                <Col md='2' xs='2' className=''>
                  <BsTooltip
                    className='text-capitalize'
                    title={
                      isValid(followup?.patient_implementation_plan?.title)
                        ? followup?.patient_implementation_plan?.title
                        : 'N/A'
                    }
                  >
                    <div
                      onClick={() => {
                        openEditModal(followup, '2')
                      }}
                      role='button'
                      className='text-center'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Rotate90DegreesCcw
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('iP')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className=''>
                  <BsTooltip
                    className='text-capitalize'
                    title={parent ? Pat2By?.name : PatBy?.name ?? 'N/A'}
                  >
                    <div
                      onClick={() => {
                        openEditModal(followup, '5')
                      }}
                      role='button'
                      className='text-center'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <User className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('patient')}</span>
                    </div>
                  </BsTooltip>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <TaskModal
        showModal={taskModal}
        onSuccess={onSuccess}
        setShowModal={handleClose}
        resourceType={CategoryType.followups}
        sourceId={edit?.id}
        followup={edit}
        noView
      />
      <FollowUpModal
        responseData={(e) => {
          setFilterData({
            status: status ?? ip ? null : 0
          })
        }}
        showModal={showAdd}
        setShowModal={handleClose}
        followUpId={edit?.id}
        noView
      />
      <FilterFollow
        show={followFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setFollowFilter(false)
        }}
      />
      <FollowupViewModal
        step={step}
        showModal={viewModal}
        setShowModal={handleClose}
        followId={edit?.id}
        noView
      />
      <Show IF={ViewActivity}>
        <Header
          icon={
            ip ? (
              <>
                <Link to={getPath('followups')}>
                  <ArrowLeft className='align-middle' size={25} />
                </Link>
              </>
            ) : (
              <StopCircle size={25} />
            )
          }
          title={ip ? FM('follow-ups') : null}
        >
          <ButtonGroup>
            {/* <BsTooltip title={FM("latest-entry")} Tag={Button.Ripple} size="sm" color="primary"
                        onClick={() => {
                            setFilterData({
                                is_latest_entry: 1
                            })
                        }} >
                        <IndeterminateCheckBoxOutlined style={{ width: 17, height: 17 }} />
                    </BsTooltip> */}
          </ButtonGroup>
          <Hide IF={ip}>
            <ButtonGroup color='dark'>
              <Show IF={Permissions.taskBrowse}>
                <BsTooltip
                  title={FM('not-completed')}
                  Tag={Button.Ripple}
                  size='sm'
                  color='danger'
                  onClick={(e) => {
                    setFilterData({
                      is_completed: 0
                    })
                  }}
                >
                  <IndeterminateCheckBoxOutlined style={{ width: 17, height: 17 }} />
                  <span className='align-middle ms-25 fw-bolder'>
                    {countPlus(followupsState?.followup?.not_completed_follow_ups, 10000)}
                  </span>
                </BsTooltip>
              </Show>
              <Show IF={Permissions.taskBrowse}>
                <BsTooltip
                  title={FM('completed')}
                  Tag={Button.Ripple}
                  size='sm'
                  color='success'
                  onClick={() => {
                    setFilterData({
                      is_completed: 1
                    })
                  }}
                >
                  <CheckSquare size={16} />
                  <span className='align-middle ms-25 fw-bolder'>
                    {countPlus(followupsState?.followup?.completed_follow_ups, 10000)}
                  </span>
                </BsTooltip>
              </Show>
            </ButtonGroup>
          </Hide>
          <ButtonGroup className='ms-1'>
            <Hide IF={ip}>
              <Show IF={Permissions.ipFollowUpsSelfAdd}>
                <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
                <FollowUpModal
                  Component={Button.Ripple}
                  size='sm'
                  color='primary'
                  id='create-button'
                >
                  <Plus size='16' />
                </FollowUpModal>
              </Show>
              <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
              <Button.Ripple
                onClick={() => setFollowFilter(true)}
                size='sm'
                color='secondary'
                id='filter'
              >
                <Sliders size='16' />
              </Button.Ripple>
            </Hide>
            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <Button.Ripple
              size='sm'
              color='dark'
              id='reload'
              onClick={() => {
                setFilterData({
                  status: status ?? ip ? null : 0
                })
              }}
            >
              <RefreshCcw size='14' />
            </Button.Ripple>
          </ButtonGroup>
        </Header>
      </Show>
      {/* complete modal */}

      <CompleteModal
        noView
        followUp={edit}
        open={completeModal}
        setCompleteModal={setCompleteModal}
        handleCompleteModal={handleCompleteModal}
        refresh={reload}
        setReload={setReload}
        onSuccess={() => {
          setFilterData({
            status: status ?? ip ? null : 0
          })
        }}
      />
      <Hide IF={ViewActivity}>
        <NoActiveModule module='activity' />
      </Hide>
      {/* Categories */}
      <Show IF={ViewActivity}>
        <TableGrid
          // force={}
          refresh={reload}
          isRefreshed={setReload}
          loadFrom={parent ? loadFollowUpEditHistory : loadFollowUp}
          jsonData={{
            ...filterData,
            status: filterData?.status,
            ip_id: isValid(filterData?.ip_id) ? filterData?.ip_id : ip,
            parent_id: isValid(parent) ? parent : ''
          }}
          selector='followups'
          state='followup'
          display='grid'
          gridCol='6'
          gridView={FollowupCard}
        />
      </Show>
    </>
  )
}

export default FollowUps
