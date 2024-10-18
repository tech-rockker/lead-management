import {
  IndeterminateCheckBoxOutlined,
  Rotate90DegreesCcw,
  StorageOutlined
} from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Activity,
  Calendar,
  CheckSquare,
  Clock,
  Edit,
  Edit2,
  Eye,
  File,
  Info,
  Map,
  MoreVertical,
  Plus,
  RefreshCcw,
  Scissors,
  Sliders,
  StopCircle,
  Target,
  Trash2,
  UserPlus,
  Users,
  Youtube
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { deleteTask, loadTask } from '../../../utility/apis/task'
import { IconSizes, selectCategoryType } from '../../../utility/Const'
// ** Styles
import { FM, isValid, isValidArray } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'

import { taskDelete } from '../../../redux/reducers/task'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { countPlus, decrypt, formatDate, truncateText } from '../../../utility/Utils'
import ActivityDetailsModal from '../../activity/activityView/activityDetailModal'
import DropDownMenu from '../../components/dropdown'
import BsPopover from '../../components/popover'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import DeviationDetailsModal from '../../devitation/fragment/deviationDetailModal'
import Header from '../../header'
import ResultModal from '../../Journal/ResultModal'
import PatientViewModal from '../../userManagement/patient/PatientViewModal'
import FollowupViewModal from '../followups/FollowupViewModal'
import IpDetailModal from '../ip/fragment/ipDetailModal'
import TaskActionModal from './fragment/taskAction'
import TaskModal from './fragment/TaskModal'
import TaskDetailModal from './TaskDetailModal'
import TaskFilter from './taskFilter'
import UploadFile from '../../settings/uploadFiles/UploadFile'
import Hide from '../../../utility/Hide'

const Task = ({ user = null, dUser = false, fileId = null, fileType = null }) => {
  const { colors } = useContext(ThemeColors)
  const userType = useUserType()
  const dispatch = useDispatch()
  const userId = useUser()
  const tasks = useSelector((state) => state)
  const location = useLocation()
  const status = location?.state?.status
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [deletedId, setDeletedId] = useState(null)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const params = useParams()
  const prent = parseInt(params?.id)
  const [filterData, setFilterData] = useState({
    status: status ?? 'no'
  })
  const [taskFilter, setTaskFilter] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showAction, setShowAction] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const [showFollowup, setShowFollowup] = useState(false)
  const [showIp, setShowIp] = useState(false)
  const [showPatient, setShowPatient] = useState(false)
  const [showDeviation, setShowDeviation] = useState(false)
  const [showJournal, setShowJournal] = useState(false)
  const [showFile, setShowFile] = useState(false)
  const [step, setStep] = useState('1')

  const notification = location?.state?.notification
  const dashboard = location?.state?.dashboard
  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
    }
  }, [])

  useEffect(() => {
    if (isValid(filterData)) setReload(true)
  }, [filterData])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(false)
      setShowDetails(false)
      setShowAction(false)
      setShowActivity(false)
      setShowFollowup(false)
      setShowIp(false)
      setShowPatient(false)
      setShowDeviation(false)
      setShowJournal(false)
      setShowFile(false)
      setStep('1')
    }
  }

  const handleClosed = (e) => {
    if (e === false) {
      setShowPatient(false)
      setStep('1')
      setReload(true)
    }
  }

  const openEditModal = (item, step) => {
    setShowDetails(!showDetails)
    setEdit(item)
    setStep(step)
  }

  useEffect(() => {
    if (notification?.data_id && notification?.type === 'task') {
      setShowDetails(true)
      setEdit({
        id: notification?.data_id
      })
    }
    window.history.replaceState({ fffff: 'kj' }, document.title)
  }, [notification])

  const TaskCard = (task, index) => {
    return (
      <>
        <div className='flex-1' key={`ip-${index}`}>
          <Card className='animate__animated animate__fadeIn'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='11' className='d-flex align-items-center'>
                  <Row>
                    <Col xs='12'>
                      <h5 className='mb-3px fw-bolder text-primary'>{task?.title}</h5>
                      <p
                        className={classNames('mb-0 text-small-12 text-truncate', {
                          'text-success': task?.status === 1,
                          'text-danger': task?.status === 0
                        })}
                      >
                        {task?.status === 1 ? FM('completed') : FM('incomplete')}
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
                        IF: Permissions.taskRead,
                        icon: <Eye size={14} />,
                        onClick: () => {
                          setShowDetails(true)
                          setEdit(task)
                        },
                        name: FM('view')
                      },
                      {
                        IF: Can(Permissions.taskEdit) && task?.status === 0,
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowAdd(true)
                          setEdit(task)
                        },
                        name: FM('edit')
                      },
                      {
                        IF: task?.status === 0 && Can(Permissions.taskEdit),
                        icon: <CheckSquare size={14} />,
                        onClick: () => {
                          setShowAction(true)
                          setEdit(task)
                        },
                        name: FM('task-complete')
                      },
                      {
                        IF: Permissions.taskDelete,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={task}
                            title={FM('delete-this', { name: task?.title })}
                            color='text-warning'
                            onClickYes={() => deleteTask({ id: task?.id })}
                            onSuccessEvent={(item) => dispatch(taskDelete(item?.id))}
                            className='ms-0 dropdown-item'
                            id={`grid-delete-${task?.id}`}
                          >
                            <Trash2 size={14} />
                            <span className='ms-1'>{FM('delete')}</span>
                          </ConfirmAlert>
                        )
                      }
                    ]}
                  />
                </Col>
              </Row>
            </CardBody>

            <CardBody className='pt-0'>
              <Row className='align-items-center gy-2'>
                <Col md='12'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('description')}</p>
                  <BsPopover
                    title={FM('description')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(task?.description, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    <Edit2 size={14} />{' '}
                    {task?.description ? truncateText(task?.description, 50) : 'N/A'}
                  </BsPopover>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-date')}</p>
                  <p role={'button'} className='mb-0 fw-bold text-secondary text-truncate'>
                    <Calendar size={14} /> {formatDate(task?.start_date, 'DD MMMM, YYYY')}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('end-date')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Calendar size={14} />{' '}
                      {task?.end_date ? formatDate(task?.end_date, 'DD MMMM, YYYY') : 'N/A'}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-time')}</p>
                  <p role={'button'} className='mb-0 fw-bold text-secondary text-truncate'>
                    <Clock size={14} /> {task?.start_time}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('end-time')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Clock size={14} /> {task?.end_time ?? 'N/A'}
                    </a>
                  </p>
                </Col>
              </Row>
            </CardBody>

            <CardBody className='p-1 border-top'>
              <div className='d-flex justify-content-between align-items-center'>
                <div className='col-9'>
                  <Row noGutters className='d-flex align-items-start justify-content-start'>
                    <Col md='2' xs='2' className=''>
                      <BsTooltip title={FM('assigned-employee')}>
                        <div
                          role='button'
                          className={classNames('text-center ', {
                            'pe-none': task?.assign_employee?.length === 0
                          })}
                        >
                          <div className='d-flex justify-content-center mt-1'>
                            <div
                              className='position-relative'
                              onClick={() => {
                                openEditModal(task, '2')
                              }}
                            >
                              <Badge pill color='primary' className='badge-up'>
                                {countPlus(task?.assign_employee?.length) ?? 0}
                              </Badge>
                              <Users className='text-secondary' style={{ width: 25, height: 25 }} />
                            </div>
                          </div>
                        </div>
                      </BsTooltip>
                    </Col>
                    <Show IF={isValid(task?.resource_data?.activity?.title)}>
                      <Col md='2' xs='2' className='mt-1'>
                        <BsTooltip role='button' title={task?.resource_data?.activity?.title}>
                          <Activity
                            className='text-primary'
                            onClick={() => {
                              setShowActivity(true)
                              setEdit(task)
                            }}
                          />
                        </BsTooltip>
                      </Col>
                    </Show>
                    <Show IF={isValid(task?.resource_data?.follow_up?.title)}>
                      <Col md='2' xs='2' className='mt-1'>
                        <BsTooltip role='button' title={task?.resource_data?.follow_up?.title}>
                          <StopCircle
                            className='text-primary'
                            onClick={() => {
                              setShowFollowup(true)
                              setEdit(task)
                              setStep(step)
                            }}
                          />
                        </BsTooltip>
                      </Col>
                    </Show>
                    <Show IF={isValid(task?.resource_data?.ip?.title)}>
                      <Col md='2' xs='2' className='mt-1'>
                        <BsTooltip role='button' title={task?.resource_data?.ip?.title}>
                          <Rotate90DegreesCcw
                            className='text-primary'
                            onClick={() => {
                              setShowIp(true)
                              setEdit(task)
                              setStep(step)
                            }}
                          />
                        </BsTooltip>
                      </Col>
                    </Show>
                    <Show IF={isValid(task?.resource_data?.patient?.name)}>
                      <Col md='2' xs='2' className='mt-1'>
                        <BsTooltip
                          role='button'
                          title={decrypt(task?.resource_data?.patient?.name)}
                        >
                          <UserPlus
                            className='text-primary'
                            onClick={() => {
                              setShowPatient(true)
                              setEdit(task)
                            }}
                          />
                        </BsTooltip>
                      </Col>
                    </Show>
                    <Show IF={isValid(task?.resource_data?.deviation?.patient?.name)}>
                      <Col md='2' xs='2' className='mt-1'>
                        <BsTooltip
                          role='button'
                          title={decrypt(task?.resource_data?.deviation?.patient?.name)}
                        >
                          <Scissors
                            className='text-primary'
                            onClick={() => {
                              setShowDeviation(true)
                              setEdit(task)
                            }}
                          />
                        </BsTooltip>
                      </Col>
                    </Show>
                    <Show IF={isValid(task?.resource_data?.journal?.patient?.name)}>
                      <Col md='2' xs='2' className='mt-1'>
                        <BsTooltip
                          role='button'
                          title={decrypt(task?.resource_data?.journal?.patient?.name)}
                        >
                          <File
                            className='text-primary'
                            onClick={() => {
                              setShowJournal(true)
                              setEdit(task)
                            }}
                          />
                        </BsTooltip>
                      </Col>
                    </Show>
                    <Show IF={isValid(task?.resource_data?.file?.title)}>
                      <Col md='2' xs='2' className='mt-1'>
                        <BsTooltip role='button' title={task?.resource_data?.file?.title}>
                          <StorageOutlined className='text-primary' />
                        </BsTooltip>
                      </Col>
                      <Col md='2' xs='2' className='mt-1'>
                        <BsTooltip role='button' title={FM('attachment')}>
                          <a target={'_blank'} href={task?.resource_data?.file?.file_path}>
                            <File className='text-primary' />
                          </a>
                        </BsTooltip>
                      </Col>
                    </Show>
                    <Show IF={isValid(task?.admin_file)}>
                      <Col md='2' xs='2' className='mt-1'>
                        <BsTooltip role='button' title={FM('attachment')}>
                          <a target={'_blank'} href={task?.admin_file?.file_path}>
                            <File className='text-primary' />
                          </a>
                        </BsTooltip>
                      </Col>
                    </Show>
                  </Row>
                </div>
                <div className='col-3'>
                  <p className='fw-bolder mb-0 mt-0'>
                    <Show IF={task?.information_url !== null}>
                      <BsTooltip
                        className=''
                        Tag='a'
                        role='button'
                        target='_blank'
                        href={task?.information_url}
                        title={FM('info-url')}
                      >
                        <Info color='#5058b8' size='18' />
                      </BsTooltip>
                    </Show>
                    <Show IF={task?.address_url !== null}>
                      <BsTooltip
                        className='ms-1'
                        Tag='a'
                        role='button'
                        target='_blank'
                        href={task?.address_url}
                        title={FM('address-url')}
                      >
                        <Map color='#5058b8' size='18' />
                      </BsTooltip>
                    </Show>
                    <Show IF={task?.video_url !== null}>
                      <BsTooltip
                        className='ms-1'
                        Tag='a'
                        role='button'
                        target='_blank'
                        href={task?.video_url}
                        title={FM('video-url')}
                      >
                        <Youtube color='#5058b8' size='18' />
                      </BsTooltip>
                    </Show>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }
  //log(tasks?.task?.tasks?.data, "task")
  const userCompletedTaskCount = isValidArray(tasks?.task?.tasks?.data)
    ? tasks?.task?.tasks?.data?.filter((d) => d?.status !== 0)
    : ''
  const userNotCompletedTaskCount = isValidArray(tasks?.task?.tasks?.data)
    ? tasks?.task?.tasks?.data?.filter((d) => d?.status === 0)
    : ''
  return (
    <>
      <ResultModal
        showModal={showJournal}
        setShowModal={handleClose}
        journalIds={edit?.resource_data?.journal?.id}
        noView
      />
      <DeviationDetailsModal
        showModal={showDeviation}
        setShowModal={handleClose}
        devitationId={edit?.resource_data?.deviation?.id}
        noView
      />
      <PatientViewModal
        step={step}
        showModal={showPatient}
        setShowModal={handleClosed}
        pId={edit?.resource_data?.patient?.id}
        noView
      />
      <IpDetailModal
        step={step}
        showModal={showIp}
        setShowModal={handleClose}
        ipId={edit?.resource_data?.ip?.id}
        noView
      />
      <FollowupViewModal
        step={step}
        showModal={showFollowup}
        setShowModal={handleClose}
        followId={edit?.resource_data?.follow_up?.id}
        noView
      />
      <ActivityDetailsModal
        showModal={showActivity}
        setShowModal={handleClose}
        activityId={edit?.resource_data?.activity?.id}
        noView
      />
      <TaskActionModal showModal={showAction} setShowModal={handleClose} edit={edit?.id} noView />
      <TaskDetailModal
        step={step}
        showModal={showDetails}
        setShowModal={handleClose}
        activityId={edit?.id}
        noView
      />
      <TaskModal
        responseData={(e) => {
          {
            setFilterData({ status: status ?? 'no' })
          }
        }}
        user={user?.id}
        showModal={showAdd}
        setShowModal={handleClose}
        activityId={edit?.id}
        noView
      />
      <TaskFilter
        userData={user}
        users={user?.id}
        show={taskFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setTaskFilter(false)
        }}
      />
      {/* <TaskFilter shows={taskFilter}filterData={filterData} setFilterData={setFilterData} handleFilterModal={() => { setTaskFilter(false) }} /> */}
      <Header icon={<Target size='25' />} title={FM('task')}>
        {/* Tooltips */}

        <ButtonGroup color='dark'>
          <Show IF={Permissions.taskBrowse}>
            <BsTooltip
              title={FM('not-completed')}
              Tag={Button.Ripple}
              size='sm'
              color='danger'
              onClick={() => {
                setFilterData({
                  status: 'no'
                })
              }}
            >
              <IndeterminateCheckBoxOutlined style={{ width: 17, height: 17 }} />
              <span className='align-middle ms-25 fw-bolder'>
                {countPlus(tasks?.task?.tasks?.not_completed_tasks, 10000)}
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
                  status: 1
                })
              }}
            >
              <CheckSquare size={16} />
              <span className='align-middle ms-25 fw-bolder'>
                {countPlus(tasks?.task?.tasks?.completed_tasks, 10000)}
              </span>
            </BsTooltip>
          </Show>
        </ButtonGroup>
        <Hide IF={fileId}>
          <ButtonGroup color='dark' className='ms-1'>
            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <Show IF={Permissions.taskAdd}>
              <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
              <TaskModal
                dUser={dUser}
                user={user?.id}
                onSuccess={() => {
                  setFilterData({
                    ...filterData,
                    type_id: user?.id
                  })
                }}
                Component={Button.Ripple}
                size='sm'
                color='primary'
                id='create-button'
              >
                <Plus size='14' />
              </TaskModal>
            </Show>
            <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple
              onClick={() => setTaskFilter(true)}
              size='sm'
              color='secondary'
              id='filter'
            >
              <Sliders size='14' />
            </Button.Ripple>
            <Button.Ripple
              size='sm'
              color='dark'
              id='reload'
              onClick={() => {
                setFilterData({ status: status ?? 'no' })
              }}
            >
              <RefreshCcw size='14' />
            </Button.Ripple>
          </ButtonGroup>
        </Hide>
      </Header>

      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadTask}
        jsonData={{
          ...filterData,
          status: filterData?.status,
          // type_id: isValid(user) ? selectCategoryType?.patient : filterData?.type_id ?? null,
          type_id:
            fileType || (isValid(user) ? selectCategoryType?.patient : filterData?.type_id) || null,
          resource_id: fileId || (isValid(user) ? user?.id : filterData?.resource_id) || null
          // status: isValid(filterData?.status) ? filterData?.status : ""
        }}
        selector='task'
        state='tasks'
        display='grid'
        gridCol='6'
        gridView={TaskCard}
      />
    </>
  )
}

export default Task
