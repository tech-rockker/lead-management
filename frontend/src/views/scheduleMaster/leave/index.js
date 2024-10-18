import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import {
  Calendar,
  CheckCircle,
  Edit,
  FilePlus,
  Menu,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders,
  ToggleRight,
  Trash2,
  Twitch
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useHistory } from 'react-router-dom'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledTooltip,
  Collapse,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap'
import { leaveApproveWithoutStap, leaveDelete } from '../../../redux/reducers/leave'
import { getPath } from '../../../router/RouteHelper'
import { approveLeaveWithoutStampling, loadLeave } from '../../../utility/apis/leave'
import { deleteSchedule } from '../../../utility/apis/schedule'
import { forDecryption, IconSizes, UserTypes } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import useModules from '../../../utility/hooks/useModules'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { decryptObject, formatDate, JsonParseValidate, truncateText } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import BsPopover from '../../components/popover'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import AcceptWork from './AcceptWork'
import ApproveLeave from './ApproveLeave'
import CompanyLeave from './CompanyLeave'
import EditModal from './EditModal'
import LeaveFilter from './LeaveFilter'
import LeaveModal from './LeaveModal'

function Leave() {
  const history = useHistory()
  const { colors } = useContext(ThemeColors)
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)
  const user = useSelector((a) => a.auth.userData)
  const [filterData, setFilterData] = useState({
    leave_group_id: 'yes'
  })
  const [showAdd, setShowAdd] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [reload, setReload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deletedId, setDeletedId] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [failed, setFailed] = useState(null)
  const [added, setAdded] = useState(null)
  const [editModal, setEditModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const dispatch = useDispatch()
  const [approveStp, setApproveStp] = useState(null)
  const [approved, setApproved] = useState(null)
  const [viewModal, setViewModal] = useState(false)
  const [acceptModal, setAcceptModal] = useState(false)
  const [approveModal, setApproveModal] = useState(false)
  const [approveFail, setApproveFail] = useState(null)
  const [companyLeave, setCompanyLeave] = useState(false)
  const [modal, setModal] = useState(false)

  const location = useLocation()
  const notification = location?.state?.notification

  const handleClose = (e) => {
    if (e === false) {
      setShowModal(e)
      setShowFilter(e)
      setViewModal(e)
      setAcceptModal(e)
      setShowAdd(e)
      setEditModal(e)
      setApproveModal(e)
      setEdit(null)
      setCompanyLeave(e)
    }
  }
  const openEditModal = (ip, path) => {
    setShowModal(!showModal)
  }
  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  const toggleModal = (id) => {
    if (modal !== id) {
      setModal(id)
    } else {
      setModal(null)
    }
  }

  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule, ViewStampling } = useModules()

  const isAdmin =
    user?.user_type_id === UserTypes.company || user?.user_type_id === UserTypes.branch

  const isApprove = (item) =>
    Can(Permissions.leaveSelfEdit) && item?.leave_approved === 0 && isAdmin

  const isEdit = (item) => Can(Permissions.leaveSelfEdit) && item?.leave_approved === 0 && !isAdmin

  const isStampNot = (item) =>
    Can(Permissions.leaveSelfEdit) && item?.leave_approved === 0 && !ViewStampling && isAdmin

  // log(filterData)

  useEffect(() => {
    if (notification?.data_id && notification?.user_type === UserTypes.company) {
      const extraPara = JsonParseValidate(notification?.extra_param)

      setApproveModal(true)
      setEdit({
        leave_group_id: JsonParseValidate(notification?.extra_param)?.leave_group_id,
        leave_object: JsonParseValidate(notification?.extra_param)?.leave_object,
        user_id: notification?.sender_id,
        id: notification?.data_id,
        event: notification?.event
      })
    } else if (
      notification?.user_type === UserTypes.employee &&
      notification?.event === 'leave-applied-approved'
    ) {
      setEdit({
        id: notification?.data_id
      })
    } else if (
      notification?.user_type === UserTypes.employee &&
      notification?.event === 'requested' &&
      JsonParseValidate(notification?.extra_param)?.leave_group_id
    ) {
      setAcceptModal(true)
      setEdit({
        // id: notification?.user_id,
        leave_group_id: JsonParseValidate(notification?.extra_param)?.leave_group_id
        // user_id: notification?.user_id
      })
    } else if (
      notification?.user_type === UserTypes.employee &&
      notification?.event === 'scheduleSlotSelected' &&
      JsonParseValidate(notification?.extra_param)?.leave_group_id
    ) {
      setAcceptModal(true)
      setEdit({
        id: notification?.data_id,
        leave_group_id: JsonParseValidate(notification?.extra_param)?.leave_group_id,
        leaves: JsonParseValidate(notification?.extra_param)?.leave_object,
        user_id: notification?.sender_id
      })
    }
    window.history.replaceState({ fffff: 'kj' }, document.title)
  }, [notification])

  const gridView = (getItem, index) => {
    const item = {
      ...getItem,
      user: decryptObject(forDecryption, getItem?.user)
    }
    return (
      <>
        <Card
          className={classNames({
            'animate__animated animate__bounceIn': index === 0 && item.id === added,
            'border border-primary border-5':
              item?.leaves?.find((a) => a?.id === notification?.data_id)?.leave_group_id ===
              item?.leave_group_id
          })}
        >
          <CardBody>
            <Row noGutters className='align-items-center'>
              <Col md='10' className=''>
                <p className='mb-0 text-dark fw-bolder h4'>
                  {user?.user_type_id === UserTypes.employee ? FM('applied-on') : item?.user?.name}
                </p>
                {/* <Show IF={user?.user_type_id === UserTypes.employee}> */}
                {formatDate(item?.leave_applied_date)}
                {/* </Show> */}
              </Col>

              {/* <Hide IF={user?.user_type_id === UserTypes.company || user?.user_type_id === UserTypes.branch} > */}
              <Col xs='1' className='d-flex align-items-center justify-content-center'>
                {/* <BsTooltip title={isValid(ip?.approved_date) ? FM("ip-approved") : FM("ip-not-approved")}> */}
                <BsTooltip
                  title={
                    item?.leave_approved === 1 ? FM('leave-approved') : FM('leave-not-approved')
                  }
                >
                  {/* <CheckCircle size={28} className={classNames("text-secondary", { "text-success": isValid(ip?.approved_date) })} /> */}
                  <CheckCircle
                    size={28}
                    className={classNames('', { 'text-success': item?.leave_approved === 1 })}
                  />
                </BsTooltip>
              </Col>

              {/* </Hide> */}

              <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                <Show
                  IF={
                    (Can(Permissions.leaveSelfEdit) &&
                      item?.leave_approved === 0 &&
                      !(
                        user?.user_type_id === UserTypes.company ||
                        user?.user_type_id === UserTypes.branch
                      )) ||
                    isApprove(item) ||
                    isStampNot(item) ||
                    (Can(Permissions.leaveSelfDelete) &&
                      item?.leave_approved === 0 &&
                      !(
                        user?.user_type_id === UserTypes.company ||
                        user?.user_type_id === UserTypes.branch
                      ))
                  }
                >
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      {
                        // IF: Can(Permissions.activitySelfAdd) && ViewActivity,

                        IF: isEdit(item),
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setEditModal(true)
                          setEdit(item)
                        },
                        name: FM('edit')
                      },

                      {
                        IF: isApprove(item),
                        icon: <CheckCircle size={14} />,
                        onClick: () => {
                          setApproveModal(true)
                          setEdit(item)
                        },
                        name: FM('approve-leave')
                      },
                      {
                        IF:
                          Can(Permissions.leaveSelfDelete) &&
                          item?.leave_approved === 0 &&
                          !(
                            user?.user_type_id === UserTypes.company ||
                            user?.user_type_id === UserTypes.branch
                          ),
                        icon: <Trash2 size={14} />,
                        name: (
                          <ConfirmAlert
                            item={item}
                            title={FM('delete-this', { name: item?.date })}
                            color='text-warning'
                            onClickYes={() => deleteSchedule({ id: item?.id })}
                            onSuccessEvent={(item) => dispatch(leaveDelete(item?.id))}
                            className=''
                            id={`grid-delete-${item?.id}`}
                          >
                            {FM('delete')}
                          </ConfirmAlert>
                        )
                      }

                      // {
                      //     IF: isStampNot(item),
                      //     icon: <CheckCircle size={14} />,
                      //     name: <ConfirmAlert
                      //         item={item}
                      //         title={FM("approve-this", { name: item?.date })}
                      //         color='text-warning'
                      //         onClickYes={() => approveLeaveWithoutStampling({ id: item?.group_id })}
                      //         successTitle={'approved'}
                      //         successText={'leave is approved'}
                      //         onSuccessEvent={(item) => dispatch(leaveApproveWithoutStap(item))}
                      //         className=""
                      //         id={`grid-delete-${item?.group_id}`}>
                      //         {FM("approved")}
                      //     </ConfirmAlert>
                      // }
                    ]}
                  />
                </Show>
              </Col>

              <Col xs='12' className='mb-2 mt-2'>
                <p className='mb-0 text-dark fw-bolder'>{FM('reason')}</p>
                <BsPopover title={FM('reason')} content={item?.leave_reason}>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      {' '}
                      {truncateText(item?.leave_reason, 50) ?? FM('vacation')}{' '}
                    </a>
                  </p>
                </BsPopover>
              </Col>

              <Col xs='12'>
                <p className='mb-0 text-dark fw-bolder'>
                  <Calendar size={14} /> {FM('date')}
                </p>

                <p className='mb-0 fw-bold  '>
                  <a className='text-secondary'>
                    {item?.leaves?.slice(0, 3).map((d, index) => {
                      return (
                        // <BsTooltip title={formatDate(d?.shift_date, "DD MMMM, YYYY")}>

                        <Badge
                          color={item?.leave_type === 'vacation' ? 'danger' : 'primary'}
                          className='me-25 mb-25 mt-25'
                        >
                          {' '}
                          {truncateText(formatDate(d?.shift_date, 'YYYY-MM-DD'))}{' '}
                        </Badge>

                        // </BsTooltip>
                      )
                    })}

                    {/* <Badge color="primary" onClick={toggle} key={`approve-karo-${edit?.id}`}>view all</Badge>

                                        <Collapse isOpen={isOpen} key={`leave-karo-${edit?.id}`}>
                                           
                                                {item?.leaves?.slice(10).map((d, index) => {
                                                    return (
                                                        <BsTooltip title={formatDate(d?.shift_date, "DD MMMM, YYYY")}>
                                                           
                                                            <Badge color={item?.leave_type === "vacation" ? 'danger' : "primary"} className='me-25 mb-25 mt-25'> {truncateText(formatDate(d?.shift_date, "DD/MM", 10))} </Badge>
                                                         
                                                        </BsTooltip>
                                                    )
                                                })}
                                          
                                        </Collapse> */}
                    <Show IF={item?.leaves?.length > 3}>
                      <Badge
                        color='primary'
                        onClick={() => {
                          setModal(!modal)
                          setEdit(item)
                        }}
                        key={item.id}
                      >
                        view all
                      </Badge>
                    </Show>
                    {/* <Modal isOpen={modal} toggle={() => setModal(!modal)}>


                                            <div>
                                             
                                                Tart lemon drops macaroon oat cake chocolate toffee chocolate bar icing. Pudding jelly beans carrot cake
                                                pastry gummies cheesecake lollipop. I love cookie lollipop cake I love sweet gummi bears cupcake dessert.
                                            </div>


                                        </Modal> */}
                  </a>
                </p>
                {/* </BsPopover> **/}
              </Col>
            </Row>
          </CardBody>

          <Show IF={user?.user_type_id === UserTypes.employee}>
            <Show IF={isValid(item?.approved_by)}>
              <CardBody className='border-top'>
                <div className='d-flex justify-content-between'>
                  <div className='fw-bolder text-dark'>{FM('approved-by')}</div>
                  <div>
                    <p className='fw-bold text-secondary mt-0 mb-0'>{item?.approved_by?.name}</p>
                  </div>
                </div>
              </CardBody>
            </Show>
          </Show>
        </Card>
      </>
    )
  }

  return (
    <>
      <Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-dialog-centered'>
        <ModalHeader toggle={() => setModal(!modal)}>
          {edit?.user?.name} : {FM('leave')}{' '}
        </ModalHeader>
        <ModalBody>
          <div>
            {edit?.leaves?.map((d, index) => {
              return (
                // <BsTooltip title={formatDate(d?.shift_date, "DD MMMM, YYYY")}>

                <Badge
                  color={d?.item?.leave_type === 'vacation' ? 'danger' : 'primary'}
                  className='me-25 mb-25 mt-25'
                >
                  {' '}
                  {formatDate(d?.shift_date, 'YYYY-MM-DD', 10)}{' '}
                </Badge>

                // </BsTooltip>
              )
            })}
          </div>
        </ModalBody>
      </Modal>

      <LeaveModal showModal={showModal} setShowModal={handleClose} noView />
      <AcceptWork showModal={acceptModal} setShowModal={handleClose} edit={edit} noView />
      {/* <CompanyLeave showModal={companyLeave} setShowModal={handleClose} edit={edit} noView /> */}

      {/* <LeaveFilter show={showFilter} setFilterData={(e) => {
                setFilterData({
                    ...filterData
                })
            }} filterData={filterData} handleFilterModal={() => { setShowFilter(false); setReload(true) }} /> */}

      <LeaveFilter
        show={showFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setShowFilter(false)
          setReload(true)
        }}
      />

      {/* <LeaveModal showModal={showAdd} setShowModal={handleClose} edit={edit} noView /> */}
      <EditModal showModal={editModal} setShowModal={handleClose} edit={edit} noView />

      <ApproveLeave
        notification={notification}
        key={`leave-approve-karo-${edit?.id}`}
        showModal={approveModal}
        setShowModal={handleClose}
        notifyDate={edit}
        edit={edit}
        noView
      />

      <Header title={FM('leave')} icon={<Twitch size='25' />}>
        {/* <Show IF={user?.user_type_id === UserTypes.employee}>
                    <ButtonGroup className='me-1' color='dark'>
                        <BsTooltip size="sm" color="primary" className='btn btn-primary btn-sm' onClick={() => setAcceptModal(true)} role={"button"} title={FM("new-task")}>
                            <FilePlus />
                        </BsTooltip>
                    </ButtonGroup>
                </Show> */}

        <ButtonGroup color='dark' className='ms-1'>
          {/* <BsTooltip size="sm" color="secondary" className='btn btn-secondary btn-sm' role={"button"} title={FM("calendar-view")} Tag={Link} to={{ pathname: getPath("schedule.leave.calendar"), state: { data: user } }}>
                        <Menu />
                    </BsTooltip> */}
          <BsTooltip
            size='sm'
            color={'secondary'}
            role={'button'}
            title={FM('calendar-view')}
            Tag={Button}
            onClick={() => history.push(getPath('schedule.leave.calendar'))}
          >
            <Menu size={'14'} />
          </BsTooltip>
          <Show IF={user?.user_type_id === UserTypes.company}>
            <UncontrolledTooltip target='create-leave'>{FM('create-new')}</UncontrolledTooltip>
            <CompanyLeave Component={Button.Ripple} size='sm' color='primary' id='create-leave'>
              <Plus size='14' />
            </CompanyLeave>
          </Show>

          {/* <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip> */}
          <Hide
            IF={user?.user_type_id === UserTypes.company || user?.user_type_id === UserTypes.branch}
          >
            <BsTooltip
              title={'apply-for-leave'}
              color={'primary'}
              Tag={Button.Ripple}
              onClick={() => setShowModal(true)}
              className='btn btn-primary btn-sm'
            >
              <Plus size='14' />
            </BsTooltip>
          </Hide>
          <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>

          <Button.Ripple
            onClick={() => setShowFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='14' />
          </Button.Ripple>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setFilterData({
                leave_group_id: 'yes'
              })
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>

      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadLeave}
        jsonData={{
          ...filterData
        }}
        selector='leave'
        state='leave'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default Leave
