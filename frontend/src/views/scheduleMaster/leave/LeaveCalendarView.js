// ** React Imports
// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'
// ** Styles
import '@styles/react/apps/app-calendar.scss'
import { Fragment, useEffect, useState } from 'react'
import { Menu, Plus, RefreshCcw, Sliders, Twitch } from 'react-feather'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, ButtonGroup, Col, Row, Spinner, UncontrolledTooltip } from 'reactstrap'
import { getPath } from '../../../router/RouteHelper'
import { loadLeave } from '../../../utility/apis/leave'
import { deleteSchedule } from '../../../utility/apis/schedule'
import { fetchSelectedEvent, forDecryption, UserTypes } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import useModules from '../../../utility/hooks/useModules'
import useUser from '../../../utility/hooks/useUser'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import {
  changeLeaveResponse,
  decrypt,
  decryptObject,
  formatDate,
  truncateText
} from '../../../utility/Utils'
// import ActivityFilter from '../activity/activityFilter'
// import ActivityDetailsModal from '../activity/activityView/activityDetailModal'
// import ActivityModal from '../activity/fragment/activityModal'

// import FormGroupCustom from '../components/formGroupCustom'

// import FollowupFilter from '../masters/followups/followupFilter'
// import FollowupViewModal from '../masters/followups/FollowupViewModal'
// import FollowUpModal from '../masters/followups/fragments/followUpModal'
// import TaskModal from '../masters/tasks/fragment/TaskModal'
// import TaskDetailModal from '../../masters/tasks/TaskDetailModal'
// import TaskFilter from '../masters/tasks/taskFilter'
// ** Calendar App Component Imports
import Calendarr from '../../calendar/Calendar'
import { updateEvent } from '../../calendar/store'
import LoadingButton from '../../components/buttons/LoadingButton'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import AcceptWork from './AcceptWork'
import CompanyLeave from './CompanyLeave'
import LeaveFilter from './LeaveFilter'
import LeaveModal from './LeaveModal'
import LeaveViewModal from './Tab/LeaveViewModal'

// ** CalendarColors
const calendarsColor = {
  leave: 'warning',
  vacation: 'danger'
}
const CalendarView = ({ noFilter = false }) => {
  const dispatch = useDispatch()
  const user = useUser()
  const [fetchActivity, setFetchActivity] = useState([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(null)
  const [revoke, setRevoke] = useState(null)
  const history = useHistory()
  const [loadingFollowUp, setLoadingFollowUp] = useState(false)
  const [loadingTask, setLoadingTask] = useState(false)
  const [acceptModal, setAcceptModal] = useState(false)

  // ** Variables

  // ** states
  const [calendarApi, setCalendarApi] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [addActivityModal, setAddActivityModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [filterData, setFilterData] = useState({})
  const [selectedType, setSelectedType] = useState(fetchSelectedEvent.activity)
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()
  const [companyLeave, setCompanyLeave] = useState(false)
  ////Activity Status///
  const [activityStatus, setActivityStatus] = useState(null)
  ////followupsState
  const [id, setId] = useState(null)
  // ** Hooks

  //revoke

  const [isRtl] = useRTL()

  // ** AddEventSidebar Toggle Function
  const handleAddEventSidebar = () => setAddActivityModal(!addActivityModal)

  // ** LeftSidebar Toggle Function
  const toggleSidebar = (val) => setLeftSidebarOpen(val)
  const blankEvent = {
    id: '',
    shift_name: '',
    shift_date: '',
    shift_start_time: '',
    shift_end_time: '',
    allDay: false,
    url: '',
    extendedProps: {
      calendar: '',
      status: '',
      is_completed: '',
      guests: [],
      location: '',
      description: ''
    }
  }
  const loadAllEvents = () => {
    if (
      isValid(user?.user_type_id === UserTypes.employee) ||
      isValid(user?.user_type_id === UserTypes.employee)
    ) {
      loadLeave({
        loading: setLoading,
        jsonData: {
          ...filterData
        },
        success: (d) => {
          if (isValid(user?.id)) {
            setFetchActivity(changeLeaveResponse(user?.user_type_id, d?.payload))
          }
        }
      })
    }
  }
  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(e)
      setShowDetails(e)
      setShowFilter(e)
      setLoading(e)
      setAcceptModal(e)
    }
  }

  log('load', loading)
  const customEventContent = (eventInfo) => {
    // log(eventInfo?.event)
    if (eventInfo.event?.extendedProps?.leave_applied === 1) {
      if (eventInfo.event?.extendedProps?.leave_type === 'vacation') {
        return (
          <>
            <ConfirmAlert
              title={FM('revoke-this', { name: eventInfo?.event?.extendedProps?.shift_date })}
              item={eventInfo}
              color='text-warning'
              onClickYes={() => deleteSchedule({ id: eventInfo?.event?.id })}
              onSuccessEvent={(e) => loadAllEvents()}
              className=''
              id={`grid-revoke-${eventInfo?.event?.id}`}
            >
              <div className='d-flex align-items-center justify-content-between'>
                <span className='d-block text-capitalize text-small-12'>
                  {truncateText(eventInfo.event.title, 15)}
                </span>
                <span className='badge bg-danger text-small-12'>
                  {FM('schedule-vacation-short-form')}
                </span>
              </div>
            </ConfirmAlert>
          </>
        )
      } else {
        return (
          <>
            <ConfirmAlert
              title={FM('revoke-this', { name: eventInfo?.event?.extendedProps?.shift_date })}
              item={eventInfo}
              color='text-warning'
              onClickYes={() => deleteSchedule({ id: eventInfo?.event?.id })}
              onSuccessEvent={(e) => {
                loadAllEvents()
              }}
              className=''
              id={`grid-revoke-${eventInfo?.event?.id}`}
            >
              <div className='d-flex align-items-center justify-content-between'>
                <span className='d-block text-capitalize text-small-12'>
                  {truncateText(eventInfo.event.title, 15)}
                </span>
                <span className='badge bg-warning text-small-12'>
                  {FM('schedule-leave-short-form')}
                </span>
              </div>
            </ConfirmAlert>
          </>
        )
      }
    } else {
      return (
        <>
          <span className='d-block text-small-12 text-capitalize'>
            {truncateText(eventInfo.event.title, 15)}
          </span>
          {/* 
                <p className='text-small-12 mb-0  mt-25'>
                    {eventInfo.event?.shift_name ?? FM('custom-shift')}
                </p> */}
          <Show IF={isValid(eventInfo.event.extendedProps?.start_time)}>
            <p className='mb-0'>
              {formatDate(eventInfo.event.extendedProps?.start_time, 'hh:mm A')} -{' '}
              {formatDate(eventInfo.event.extendedProps?.end_time, 'hh:mm A')}
            </p>
          </Show>
        </>
      )
    }
  }
  // ** refetchEvents
  const refetchEvents = () => {
    if (calendarApi !== null) {
      calendarApi.refetchEvents()
    }
  }

  useEffect(() => {
    loadAllEvents()
  }, [filterData])

  useEffect(() => {
    loadAllEvents()
  }, [])

  const selected = (e) => {
    if (isValid(e?.id)) {
      setId(parseInt(e?._def?.publicId))
      setShowDetails(true)
    }
  }

  return (
    <Fragment>
      <LeaveModal
        responseData={() => {
          loadAllEvents()
        }}
        showModal={showAdd}
        setShowModal={handleClose}
        noView
      />
      <AcceptWork showModal={acceptModal} setShowModal={handleClose} noView />

      <Show IF={Can(Permissions.leaveSelfBrowse)}>
        <LeaveFilter
          hideDates
          show={showFilter}
          setFilterData={(e) => {
            setFilterData({
              ...filterData,
              ...e,
              status: !isValid(e?.status) ? 0 : e?.status,
              start_date: isValid(e?.start_date) ? e?.start_date : filterData?.start_date
            })
          }}
          filterData={filterData}
          handleFilterModal={handleClose}
        />
      </Show>

      <Header title={FM('leave-calender')} titleCol='8' childCol='4' icon={<Twitch />}>
        <ButtonGroup className='me-1' color='dark'>
          {/* <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip>
                    <LeaveModal onSuccess={loadAllEvents} Component={Button.Ripple} className='btn btn-primary btn-sm' size="sm" outline color="dark" id="create-button">
                        <Plus size="14" />
                    </LeaveModal> */}
        </ButtonGroup>
        {/* <Show IF={user?.user_type_id === UserTypes.employee}>

                    <ButtonGroup className='me-1' color='dark'>
                        <BsTooltip size="sm" color="primary" className='btn btn-primary btn-sm' onClick={() => setAcceptModal(true)} role={"button"} title={FM("new-task")}>
                            <FilePlus />
                        </BsTooltip>
                    </ButtonGroup>

                </Show> */}

        <ButtonGroup className='ms-1' color='dark'>
          <Show IF={Permissions.leaveSelfBrowse}>
            <BsTooltip
              size='sm'
              color={'secondary'}
              role={'button'}
              title={FM('card-view')}
              Tag={Button}
              onClick={() => history.push(getPath('schedule.leave.card_view'))}
            >
              <Menu size='14' />
            </BsTooltip>
          </Show>
          <Show
            IF={user?.user_type_id === UserTypes.company || user?.user_type_id === UserTypes.branch}
          >
            <UncontrolledTooltip target='create-leave'>{FM('create-new')}</UncontrolledTooltip>
            <CompanyLeave
              setReload={() => {
                loadAllEvents()
              }}
              Component={Button.Ripple}
              size='sm'
              color='primary'
              id='create-leave'
            >
              <Plus size='14' />
            </CompanyLeave>
          </Show>

          <Hide
            IF={user?.user_type_id === UserTypes.company || user?.user_type_id === UserTypes.branch}
          >
            <BsTooltip
              title={'create-leave'}
              color={'primary'}
              className='btn btn-primary btn-sm'
              Tag={Button.Ripple}
              onClick={() => setShowAdd(true)}
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

          <LoadingButton
            loading={loading}
            size='sm'
            color='dark'
            tooltip={FM('refresh-data')}
            onClick={() => {
              loadAllEvents()
            }}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>

      <LeaveViewModal
        title={FM('leave-details')}
        showModal={showDetails}
        setShowModal={handleClose}
        followId={id}
        noView
      />
      <div className='app-calendar overflow-hidden border'>
        <Row className='g-0'>
          <Col md='12' className='position-relative'>
            <Show IF={loading || loadingFollowUp || loadingTask}>
              <div className='loader-top'>
                <span className='spinner'>
                  <Spinner color='primary' animation='border' size={'xl'}>
                    <span className='visually-hidden'>Loading...</span>
                  </Spinner>
                </span>
              </div>
            </Show>
            {/* <Show IF={!loading}> */}
            <Calendarr
              key={`cal-${fetchActivity?.events?.length}`}
              visibleDate={(e) => {
                setFilterData({
                  ...filterData,
                  ...e
                })
              }}
              isRtl={isRtl}
              store={{
                events: isValidArray(fetchActivity) ? fetchActivity : [],
                selectedCalendars: ['done', 'pending', 'notApplicable', 'upcoming', 'is_completed'],
                selectEvent: {}
              }}
              customEventContent={customEventContent}
              dispatch={dispatch}
              blankEvent={blankEvent}
              calendarApi={calendarApi}
              selectEvent={selected}
              updateEvent={updateEvent}
              toggleSidebar={toggleSidebar}
              calendarsColor={calendarsColor}
              setCalendarApi={setCalendarApi}
              handleAddEventSidebar={handleAddEventSidebar}
            />
            {/* </Show> */}
          </Col>
        </Row>
      </div>
    </Fragment>
  )
}

export default CalendarView
