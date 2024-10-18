import { ChatBubbleOutlined, ReceiptOutlined } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import { useContext, useState } from 'react'
import {
  AlertTriangle,
  Bookmark,
  Calendar,
  CheckSquare,
  Edit,
  Eye,
  FileMinus,
  Info,
  Map,
  MapPin,
  MessageCircle,
  MoreVertical,
  Plus,
  Star,
  Trash2,
  User,
  UserPlus,
  X,
  Youtube
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import 'react-vertical-timeline-component/style.min.css'
// ** Reactstrap Imports
import Avatar from '@components/avatar'
import { Card, CardBody, CardFooter, Col, Row } from 'reactstrap'
import { activityDelete } from '../../../redux/reducers/activity'
import { getPath } from '../../../router/RouteHelper'
import { CategoryType, IconSizes, UserTypes } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import {
  countPlus,
  decrypt,
  enableFutureDates,
  fastLoop,
  formatDate,
  getValidTime,
  truncateText
} from '../../../utility/Utils'
import { deleteActivity } from '../../../utility/apis/activity'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { FM, isValid, isValidArray } from '../../../utility/helpers/common'
import useUserType from '../../../utility/hooks/useUserType'
import ActivityDetailsModal from '../../activity/activityView/activityDetailModal'
import ActivityLogModal from '../../activity/activityView/activityLogModal'
import ActivityModal from '../../activity/fragment/activityModal'
import ActionModal from '../../activity/modals/ActionModal'
import NotApplicable from '../../activity/modals/NotApplicableModal'
import TagModal from '../../activity/modals/TagModal'
import AssignUserModal from '../../activity/modals/assignUserModal'
import CommentModal from '../../activity/modals/commentModal'
import DropDownMenu from '../../components/dropdown'
import BsPopover from '../../components/popover'
import BsTooltip from '../../components/tooltip'
import TaskModal from '../tasks/fragment/TaskModal'

const TimeLineCard = ({ old = false, onSuccess = () => {}, item, setReload }) => {
  const { colors } = useContext(ThemeColors)
  const canEdit = Can(Permissions.activitySelfEdit)
  const dispatch = useDispatch()
  const userType = useUserType()
  const location = useLocation()
  const user = useSelector((a) => a.auth.userData)
  const [showAdd, setShowAdd] = useState(false)
  const [edit, setEdit] = useState(null)
  const [editComment, setEditComment] = useState(null)
  const [taskModal, setTaskModal] = useState(false)
  const [sourceId, setSourceId] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showLogDetails, setShowLogDetails] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [step, setStep] = useState('1')
  const notification = location?.state?.notification

  const handleClose = (e) => {
    if (!e) {
      setStep('1')
      setShowAdd(false)
      setShowDetails(false)
      setShowLogDetails(false)
    }
  }

  const handleTaskClose = () => {
    setTaskModal(false)
    setShowDetails(false)
  }

  const getTextColor = (status) => {
    switch (status) {
      case 'completed-by-staff-on-time':
        return 'text-success'
      case 'completed-by-staff-not-on-time':
        return 'text-danger'
      case 'completed-by-patient-itself':
        return 'text-success'
      case 'patient-did-not-want':
        return 'text-danger'
      case 'not-done-by-employee':
        return 'text-danger'
      default:
        return 'text-dark'
    }
  }
  const getEmployees = () => {
    const re = []
    if (isValidArray(item?.assign_employee)) {
      fastLoop(item?.assign_employee, (d, i) => {
        // re.push({
        //     title: d?.employee?.name ?? '',
        //     content: d?.employee?.name ?? ''
        //     // img: d?.employee?.avatar ?? ''
        // })
        if (isValid(d?.employee?.name)) {
          re.push(
            <BsTooltip title={decrypt(d?.employee?.name)}>
              <Avatar color='light-primary' content={decrypt(d?.employee?.name)} initials />
            </BsTooltip>
          )
        }
      })
    }
    return re
  }

  return (
    <>
      <ActivityDetailsModal
        step={step}
        showModal={showDetails}
        setShowModal={handleClose}
        activityId={edit?.id}
        noView
      />
      <ActivityLogModal
        showModal={showLogDetails}
        setShowModal={handleClose}
        activityId={edit?.id}
      />
      <TaskModal
        showModal={taskModal}
        onSuccess={onSuccess}
        setShowModal={handleTaskClose}
        resourceType={CategoryType.activity}
        sourceId={sourceId}
        activity={edit}
        noView
      />
      <ActivityModal
        showModal={showAdd}
        onSuccess={onSuccess}
        setShowModal={handleClose}
        activityId={edit?.id}
        noView
      />
      <Card className='shadow mb-1' key={item.id}>
        <div
          className={classNames('text-small-12 fw-bolder time position-absolute', {
            'text-danger': old,
            'text-dark': !old
          })}
        >
          {getValidTime(item?.start_time, 'h:mm A')}{' '}
          <Hide IF={item?.end_time === null}> - {getValidTime(item?.end_time, 'h:mm A')} </Hide>
        </div>
        <div className='timeline-header pt-1 pb-1'>
          <Row className='align-items-start gx-0'>
            <Col xs='6' className='text-truncate'>
              <p
                role={'button'}
                className='h5 fw-bolder text-white mt-0'
                onClick={() => {
                  if (isValid(item?.patient?.name)) {
                    setStep('4')
                    setShowDetails(true)
                    setEdit(item)
                  }
                }}
              >
                <User size={20} /> {truncateText(item?.patient?.name, 15)}
              </p>
            </Col>
            <Col xs='6' className='d-flex justify-content-center pe-0'>
              <p className='fw-bolder  mb-0 mt-0 text-large text-white'>
                <Show IF={item?.information_url !== null}>
                  <BsTooltip
                    className=''
                    Tag={'a'}
                    role={'button'}
                    target={'_blank'}
                    href={item?.information_url}
                    title={FM('info-url')}
                  >
                    <Info color={'white'} size='18' />
                  </BsTooltip>
                </Show>
                <Show IF={item?.address_url !== null}>
                  <BsTooltip
                    className='ms-1'
                    Tag={'a'}
                    role={'button'}
                    target={'_blank'}
                    href={item?.address_url}
                    title={FM('address-url')}
                  >
                    <Map color={'white'} size='18' />
                  </BsTooltip>
                </Show>
                <Show IF={item?.video_url !== null}>
                  <BsTooltip
                    className='ms-1'
                    Tag={'a'}
                    role={'button'}
                    target={'_blank'}
                    href={item?.video_url}
                    title={FM('video-url')}
                  >
                    <Youtube color={'white'} size='18' />
                  </BsTooltip>
                </Show>
                <Show IF={item?.file !== null}>
                  <BsTooltip
                    className='ms-1'
                    Tag={'a'}
                    role={'button'}
                    target={'_blank'}
                    href={item?.file}
                    title={FM('document')}
                  >
                    <FileMinus color={'white'} size='16' />
                  </BsTooltip>
                </Show>
              </p>
            </Col>
          </Row>
        </div>
        <CardBody className=''>
          <Row className='d-flex justify-content-end'>
            <Show IF={item?.series_start_date !== null}>
              <Col xs='2' className='d-flex justify-content-end'>
                <BsTooltip
                  title={`${FM('series')} | ${formatDate(
                    item?.series_start_date,
                    'DD MMM YYYY'
                  )} - ${formatDate(item?.series_end_date, 'DD MMM YYYY')}`}
                >
                  <Info color={'grey'} size='18' />
                </BsTooltip>
              </Col>
            </Show>
          </Row>
          <Row className='align-items-center'>
            <Col
              xs={
                item?.is_compulsory === 1 && item?.is_risk === 1
                  ? 9
                  : item?.is_compulsory === 1 || item?.is_risk === 1
                  ? 10
                  : 11
              }
            >
              <div className='w-100'>
                <h5 className='h4 text-primary fw-bolder mt-3px mb-3px text-capitalize'>
                  {truncateText(item?.title, 35)}
                </h5>
                <Show IF={isValid(item?.category)}>
                  <p className='mb-0 mt-0 text-small-12 text-secondary fw-bolder text-truncate '>
                    {item?.category?.name} {item?.subcategory?.name ? '/' : ''}{' '}
                    {item?.subcategory?.name}
                  </p>
                </Show>
              </div>
            </Col>
            <Show IF={item?.is_compulsory === 1}>
              <Col xs='1' className='d-flex justify-content-end'>
                <h4 className='text-danger fw-bolder'>
                  <BsTooltip title={FM('this-activity-is-compulsory')}>
                    <Star size={IconSizes.MenuVertical} className='text-info' />
                  </BsTooltip>
                </h4>
              </Col>
            </Show>

            <Show IF={item?.is_risk === 1}>
              <Col xs='1' className='d-flex justify-content-end'>
                <Show IF={userType !== UserTypes.patient}>
                  <h4 className='text-danger fw-bolder'>
                    <BsTooltip role='button' title={item?.message}>
                      <AlertTriangle
                        size={IconSizes.MenuVertical}
                        className='text-danger blinking'
                      />
                    </BsTooltip>
                  </h4>
                </Show>
              </Col>
            </Show>

            <Col xs='1' className='d-flex justify-content-end'>
              <DropDownMenu
                tooltip={FM(`menu`)}
                component={
                  <MoreVertical color={colors?.dark?.main} size={IconSizes.MenuVertical} />
                }
                options={[
                  {
                    IF: Permissions.activitySelfRead,
                    icon: <Eye size={14} />,
                    onClick: () => {
                      setEdit(item)
                      setShowDetails(true)
                    },
                    name: FM('view')
                  },
                  {
                    IF: Permissions.calendarBrowse,
                    icon: <Calendar size={14} />,
                    to: { pathname: getPath('master.task.calendar'), state: { data: item } },
                    name: FM('Calendar')
                  },
                  {
                    IF: canEdit && !old && item?.status === 0,
                    icon: <Edit size={14} />,
                    onClick: () => {
                      setShowAdd(true)
                      setEdit(item)
                    },
                    name: FM('edit')
                  },
                  {
                    IF: Permissions.taskAdd,
                    icon: <Plus size={14} />,
                    name: FM('add-task'),
                    onClick: () => {
                      setTaskModal(true)
                      setEdit(item)
                      setSourceId(item?.id)
                    }
                  },
                  {
                    IF: Permissions.activitySelfDelete && item?.status !== 1,
                    noWrap: true,
                    name: (
                      <ConfirmAlert
                        item={item}
                        title={FM('delete-this', { name: item?.title })}
                        color='text-warning'
                        text={FM('add-this-activity-to-trash')}
                        onClickYes={() => deleteActivity({ id: item?.id })}
                        onSuccessEvent={(item) => dispatch(activityDelete(item?.id))}
                        className='dropdown-item'
                        id={`grid-delete-${item?.id}`}
                      >
                        <span className='me-1'>
                          <Trash2 size={14} />
                        </span>
                        {FM('delete')}
                      </ConfirmAlert>
                    )
                  },
                  {
                    icon: <Eye size={14} />,
                    onClick: () => {
                      setEdit(item)
                      setShowLogDetails(true)
                    },
                    name: FM('edit-history')
                  }
                ]}
              />
            </Col>
          </Row>
        </CardBody>
        <CardBody className='border-top pt-1 pb-1'>
          <Row>
            {/* <Show IF={item?.status === 0}> */}
            <Col md='12' className='mb-0'>
              <p className='fw-bolder text-dark mt-0 mb-0'>
                {truncateText(item?.description, 150)}
              </p>
            </Col>
            {/* </Show> */}
            <Show IF={item?.status === 1 || item?.status === 2 || item?.status === 3}>
              <Col md='12' className='mb-0 mt-2'>
                <p className='fw-bold text-secondary  mt-3px mb-3px'>
                  <>
                    <span
                      className={classNames('fw-bolder', {
                        'text-success': item?.status === 1,
                        'text-danger': item?.status === 2,
                        'text-dark': item?.status === 3
                      })}
                    >
                      {item?.status === 1
                        ? FM('marked-complete-by')
                        : item?.status === 2
                        ? FM('marked-incomplete-by')
                        : FM('marked-not-applicable-by')}{' '}
                      {decrypt(item?.action_by_user?.name)}
                    </span>{' '}
                    <span className='text-small-12'>
                      {FM('on')} {item?.action_date}
                    </span>
                  </>
                </p>

                <p className='fw-bold text-secondary  mt-0 mb-12px'>
                  {item?.action_comment}
                  {item?.comment}
                </p>
                <Show IF={item?.status === 1 || item?.status === 2}>
                  <p
                    className={`fw-bolder text-small-12 mt-3px mb-0 ${getTextColor(
                      item?.selected_option
                    )}`}
                  >
                    {FM(item?.selected_option)}
                  </p>
                </Show>
              </Col>
            </Show>
            <Show IF={isValid(item?.activity_tag)}>
              <Col md='12' className='mb-0 mt-1'>
                <span className='b-0 badge p-25 text-small-12 align-middle bg-primary me-1'>
                  <BsTooltip role='button' className='me-1' title={item?.activity_tag}>
                    <Bookmark className='align-middle me-25' />{' '}
                    {truncateText(item?.activity_tag, 15)}
                  </BsTooltip>
                </span>
              </Col>
            </Show>
          </Row>
        </CardBody>
        <CardBody className='border-top pt-1 pb-1'>
          <Row>
            <Col md='12' className='mb-0'>
              <p className='fw-bolder text-dark mt-0 mb-0'>
                {FM('created-by')}: {decrypt(item?.created_by?.name)}
              </p>
            </Col>
          </Row>
        </CardBody>
        <Show IF={isValidArray(item?.assign_employee)}>
          <CardBody className='border-top pt-1 pb-1'>
            <div
              className='d-flex align-items-center justify-content-start'
              onClick={() => {
                setEdit(item)
                setShowDetails(true)
                setStep('3')
              }}
            >
              {getEmployees()}
              {/* <AvatarGroup size='sm' data={getEmployees()} /> <span className='d-block text-dark fw-bolder ms-1'>5+</span> */}
            </div>
          </CardBody>
        </Show>
        <CardFooter className='border-top pt-1 pb-1'>
          <Row className='d-flex align-items-center justify-content-start'>
            <Col xs='10'>
              <Row className='d-flex align-items-center justify-content-start'>
                <Show IF={userType !== UserTypes.patient}>
                  <Col xs='2' className='pt-0 pb-0'>
                    <CommentModal
                      nofityComment={editComment}
                      edit={item.id}
                      activity={item}
                      setReload={setReload}
                      Component={BsTooltip}
                      role='button'
                      title={FM('view-comments')}
                    >
                      <div className='badge bg-primary'>
                        <ChatBubbleOutlined className='align-middle me-25' />
                        <span className='align-middle ms-25'>
                          {countPlus(item?.comments_count) ?? 0}
                        </span>
                      </div>
                    </CommentModal>
                  </Col>
                </Show>
                <Col xs='1' className={userType === UserTypes.patient ? 'p-0 ms-1' : 'p-0'}>
                  <BsTooltip
                    role='button'
                    className='me-1'
                    title={isValid(item?.ip_id) ? FM('view-ip') : FM('ip-not-assigned')}
                    onClick={() => {
                      if (isValid(item?.ip_id)) {
                        setStep('2')
                        setShowDetails(true)
                        setEdit(item)
                      }
                    }}
                  >
                    <ReceiptOutlined
                      className='text-dark'
                      style={{ width: 20, height: 20, opacity: isValid(item?.ip_id) ? 1 : 0.5 }}
                    />
                  </BsTooltip>
                </Col>
                <Col xs='1' className='p-0'>
                  <BsTooltip
                    role='button'
                    className='me-1'
                    title={item?.branch?.branch_name ?? FM('main-branch')}
                  >
                    <MapPin
                      className='text-dark'
                      style={{ color: '#000', width: 20, height: 20 }}
                    />
                  </BsTooltip>
                </Col>
                <Show IF={userType !== UserTypes.patient}>
                  <Col xs='1' className='p-0'>
                    <BsTooltip role='button' className='me-1' title={FM('view-activity-comments')}>
                      <BsPopover
                        title={FM('comments')}
                        content={
                          <>
                            <Show IF={isValid(item?.external_comment)}>
                              <Col md='12'>
                                <p className='mt-0 mb-0 p-0 fw-bolder  text-dark'>
                                  {FM('comment')}
                                </p>
                                <p className='m-0 p-0 fw-bold text-secondary'>
                                  {truncateText(item?.external_comment, 100)}
                                </p>
                              </Col>
                            </Show>
                            <Show IF={isValid(item?.internal_comment)}>
                              <Col md='12'>
                                <Show IF={Permissions.readInternalComment}>
                                  <p className='mt-1 mb-0 p-0 fw-bolder text-dark'>
                                    {FM('internal-comment')}
                                  </p>
                                  <p className='m-0 p-0 fw-bold text-secondary'>
                                    {truncateText(item?.internal_comment, 100)}
                                  </p>
                                </Show>
                              </Col>
                            </Show>
                            <Show IF={isValid(item?.repetition_comment)}>
                              <Col md='12'>
                                <p className='mt-1 mb-0 p-0 fw-bolder text-dark'>
                                  {FM('repetition-comment')}
                                </p>
                                <p className='m-0 p-0 fw-bold text-secondary'>
                                  {truncateText(item?.repetition_comment, 100)}
                                </p>
                              </Col>
                            </Show>
                          </>
                        }
                      >
                        <MessageCircle
                          //   className={
                          //     isValid(item?.external_comment) || isValid(item?.internal_comment)
                          //       ? 'text-primary'
                          //       : 'text-dark'
                          //   }
                          style={{
                            width: 20,
                            height: 20,
                            color:
                              isValid(item?.external_comment) || isValid(item?.internal_comment)
                                ? colors.primary.main
                                : colors.dark.main
                          }}
                        />
                      </BsPopover>
                    </BsTooltip>
                  </Col>
                </Show>
              </Row>
            </Col>

            <Show
              IF={
                item?.status === 0 &&
                (user?.user_type_id === UserTypes.company ||
                  user?.user_type_id === UserTypes.branch ||
                  user?.user_type_id === UserTypes.employee ||
                  user?.user_type_id === UserTypes.hospital ||
                  user?.user_type_id === UserTypes.nurse)
              }
            >
              <Col xs='2' className='d-flex justify-content-end'>
                {/* <BsTooltip role="button" title={FM("repeat")}>
                                <RepeatModal edit={item} Component={Repeat} size="22" color={colors.secondary.main} className='me-25' />
                            </BsTooltip> */}
                <BsTooltip role='button' title={FM('add-tag')}>
                  <TagModal
                    Component={Bookmark}
                    size='22'
                    setReload={setReload}
                    color={colors.dark.main}
                    edit={item}
                    className='me-1'
                  />
                </BsTooltip>
                <BsTooltip role='button' title={FM('not-applicable')}>
                  <NotApplicable
                    setEdit={setEdit}
                    edit={item}
                    Component={X}
                    setReload={setReload}
                    color={colors.dark.main}
                    size='22'
                    className='me-1'
                  />
                </BsTooltip>
                <BsTooltip
                  role='button'
                  title={
                    item?.assign_employee?.length > 0
                      ? `${FM('assign-employee')}`
                      : FM('assign-employee')
                  }
                >
                  <AssignUserModal
                    setReload={setReload}
                    Component={UserPlus}
                    size='22'
                    color={
                      item?.assign_employee?.length > 0 ? colors.primary.main : colors.dark.main
                    }
                    edit={item}
                  />
                </BsTooltip>
                <Hide IF={enableFutureDates(new Date(item?.start_date))}>
                  <BsTooltip role='button' title={FM('action')}>
                    <ActionModal
                      setReload={setReload}
                      Component={CheckSquare}
                      size='22'
                      color={colors.dark.main}
                      edit={item}
                      className='ms-1 me-0'
                    />
                  </BsTooltip>
                </Hide>
              </Col>
            </Show>
          </Row>
        </CardFooter>
      </Card>
    </>
  )
}

export default TimeLineCard
