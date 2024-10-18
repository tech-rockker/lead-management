// ** React Imports
// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'
// ** Styles
import '@styles/react/apps/app-calendar.scss'
import React, { Fragment, useEffect, useState } from 'react'
import { Activity, Plus, RefreshCcw, Sliders } from 'react-feather'
import { useForm } from 'react-hook-form'
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { Button, ButtonGroup, Col, Row, Spinner, UncontrolledTooltip } from 'reactstrap'
import { fetchSelectedEvent } from '../../utility/Const'
import Hide from '../../utility/Hide'
import { Permissions } from '../../utility/Permissions'
import Show, { Can } from '../../utility/Show'
import {
  changeActivityResponse,
  changeFollowUpResponse,
  changeTaskResponse,
  createConstSelectOptions
} from '../../utility/Utils'
import { loadActivity } from '../../utility/apis/activity'
import { loadFollowUp } from '../../utility/apis/followup'
import { loadTask } from '../../utility/apis/task'
import { FM, isValid, isValidArray } from '../../utility/helpers/common'
import useModules from '../../utility/hooks/useModules'
import ActivityFilter from '../activity/activityFilter'
import ActivityDetailsModal from '../activity/activityView/activityDetailModal'
import ActivityModal from '../activity/fragment/activityModal'
import LoadingButton from '../components/buttons/LoadingButton'
import FormGroupCustom from '../components/formGroupCustom'
import Header from '../header'
import FollowupViewModal from '../masters/followups/FollowupViewModal'
import FollowupFilter from '../masters/followups/followupFilter'
import FollowUpModal from '../masters/followups/fragments/followUpModal'
import TaskDetailModal from '../masters/tasks/TaskDetailModal'
import TaskModal from '../masters/tasks/fragment/TaskModal'
import TaskFilter from '../masters/tasks/taskFilter'
// ** Calendar App Component Imports
import Calendar from './Calendar'
import { updateEvent } from './store'

// ** CalendarColors
const calendarsColor = {
  pending: 'danger',
  done: 'success',
  notApplicable: 'danger',
  upcoming: 'primary',
  is_completed: 'success',
  is_notCOmpleted: 'danger'
}
const CalendarComponent = ({ noFilter = false }) => {
  const { control, watch } = useForm()

  const [fetchActivity, setFetchActivity] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingFollowUp, setLoadingFollowUp] = useState(false)
  const [loadingTask, setLoadingTask] = useState(false)
  // ** Variables
  const dispatch = useDispatch()

  // ** states
  const [calendarApi, setCalendarApi] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [addActivityModal, setAddActivityModal] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [activityRes, setActivityRes] = useState([])
  const [followupsRes, setFollowupsRes] = useState([])
  const [taskRes, setTaskRes] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [filterData, setFilterData] = useState({})
  const [selectedType, setSelectedType] = useState(fetchSelectedEvent.activity)
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()

  ////Activity Status///
  const [activityStatus, setActivityStatus] = useState(null)
  ////followupsState
  const [id, setId] = useState(null)
  // ** Hooks
  const [isRtl] = useRTL()

  // ** AddEventSidebar Toggle Function
  const handleAddEventSidebar = () => setAddActivityModal(!addActivityModal)

  // ** LeftSidebar Toggle Function
  const toggleSidebar = (val) => setLeftSidebarOpen(val)

  // ** Blank Event Object
  const blankEvent = {
    id: '',
    title: '',
    start: '',
    end: '',
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
    if (ViewActivity) {
      if (selectedType === fetchSelectedEvent.activity) {
        loadActivity({
          loading: setLoading,
          // perPage: 1000,
          jsonData: {
            ...filterData,
            status: isValid(filterData?.status) ? filterData?.status : activityStatus
          },
          success: (d) => {
            // setStartDate(filterData?.start_date)
            // const calendars = d?.payload?.map(d => (d?.status === 1 ? "done" : d?.status === 2 ? "pending" : d?.status === 3 ? "notApplicable" : "upcoming"))
            // const selectedCalendars = ["done", "notApplicable", "pending", "upcoming"]
            // eslint-disable-next-line no-unused-expressions
            // watch("event_label") !== 0 ? setFetchActivity(changeActivityResponse(d?.payload)) : ''
            setActivityRes(changeActivityResponse(d?.payload))
          }
        })
      }
      if (selectedType === fetchSelectedEvent.followups) {
        loadFollowUp({
          loading: setLoadingFollowUp,

          // perPage: 1000,
          jsonData: {
            ...filterData,
            is_completed: isValid(filterData?.status) ? filterData?.status : ''
          },
          // dispatch,
          success: (d) => {
            // const calendars = d?.payload?.map(d => (d?.status === 1 ? "done" : d?.status === 2 ? "pending" : d?.status === 3 ? "notApplicable" : "upcoming"))
            // const selectedCalendars = ["done", "notApplicable", "pending", "upcoming"]
            // setStartDate(filterData?.start_date)
            // setFetchActivity(changeActivityResponse(d?.payload))
            setFollowupsRes(changeFollowUpResponse(d?.payload))
          }
        })
      }

      if (selectedType === fetchSelectedEvent.task) {
        loadTask({
          loading: setLoadingTask,

          // perPage: 1000,
          jsonData: {
            ...filterData,
            is_completed: isValid(filterData?.status) ? filterData?.status : ''
          },
          // dispatch,
          success: (d) => {
            // const calendars = d?.payload?.map(d => (d?.status === 1 ? "done" : d?.status === 2 ? "pending" : d?.status === 3 ? "notApplicable" : "upcoming"))
            // const selectedCalendars = ["done", "notApplicable", "pending", "upcoming"]
            // setStartDate(filterData?.start_date)
            // setFetchActivity(changeActivityResponse(d?.payload))
            setTaskRes(changeTaskResponse(d?.payload))
          }
        })
      }
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
  }, [filterData, ViewActivity, selectedType])

  useEffect(() => {
    setFetchActivity(
      selectedType === fetchSelectedEvent?.activity
        ? activityRes
        : selectedType === fetchSelectedEvent?.followups
          ? followupsRes
          : taskRes
    )
  }, [activityRes, followupsRes, taskRes, selectedType])

  useEffect(() => {
    const t = watch('type')
    if (t === fetchSelectedEvent.activity) {
      setFetchActivity(activityRes)
    } else if (t === fetchSelectedEvent.followups) {
      setFetchActivity(followupsRes)
    } else if (t === fetchSelectedEvent.task) {
      setFetchActivity(taskRes)
    } else {
      setFetchActivity([...activityRes, ...followupsRes, ...taskRes])
    }
  }, [watch('type')])

  const selected = (e) => {
    if (isValid(e?.id)) {
      setId(parseInt(e?.id))
      setShowDetails(true)
    }
  }

  const handleClose = (e) => {
    setShowDetails(false)
  }

  return (
    <Fragment>
      <Show
        IF={
          Can(Permissions.activitySelfAdd) &&
          ViewActivity &&
          watch('type') === fetchSelectedEvent.activity
        }
      >
        <ActivityFilter
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
          handleFilterModal={() => {
            setShowFilter(false)
          }}
        />
      </Show>
      <Show
        IF={
          Can(Permissions.ipFollowUpsSelfBrowse) && watch('type') === fetchSelectedEvent.followups
        }
      >
        <FollowupFilter
          hideDates
          show={showFilter}
          setFilterData={(e) => {
            setFilterData({
              ...filterData,
              ...e,
              is_completed: !isValid(e?.status) ? 0 : e?.status,
              start_date: isValid(e?.start_date) ? e?.start_date : filterData?.start_date
            })
          }}
          filterData={filterData}
          handleFilterModal={() => {
            setShowFilter(false)
          }}
        />
      </Show>
      <Show IF={Can(Permissions.taskBrowse) && watch('type') === fetchSelectedEvent.task}>
        <TaskFilter
          hideDates
          show={showFilter}
          setFilterData={(e) => {
            setFilterData({
              ...filterData,
              ...e,
              is_completed: !isValid(e?.status) ? 0 : e?.status,
              start_date: isValid(e?.start_date) ? e?.start_date : filterData?.start_date
            })
          }}
          filterData={filterData}
          handleFilterModal={() => {
            setShowFilter(false)
          }}
        />
      </Show>

      <Header title={FM('Calender')} titleCol='8' childCol='4' icon={<Activity />}>
        <Show IF={ViewActivity}>
          <FormGroupCustom
            noLabel
            type={'select'}
            placeholder={'select'}
            control={control}
            value={selectedType}
            onChangeValue={(e) => {
              setSelectedType(e)
            }}
            options={createConstSelectOptions(fetchSelectedEvent, FM, (val) => {
              if (val === fetchSelectedEvent.activity) {
                return !ViewActivity
              }
              if (val === fetchSelectedEvent.followups) {
                return !ViewActivity
              }
            })}
            name={'type'}
          />
        </Show>
        <ButtonGroup className='ms-1' color='dark'>
          <Show
            IF={
              Can(Permissions.activitySelfAdd) &&
              ViewActivity &&
              watch('type') === fetchSelectedEvent.activity
            }
          >
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <ActivityModal
              onSuccess={loadAllEvents}
              Component={Button.Ripple}
              className='btn btn-primary btn-sm'
              size='sm'
              outline
              color='dark'
              id='create-button'
            >
              <Plus size='14' />
            </ActivityModal>
          </Show>
          <Show
            IF={
              Can(Permissions.ipFollowUpsSelfBrowse) &&
              watch('type') === fetchSelectedEvent.followups
            }
          >
            {' '}
            <UncontrolledTooltip target='create-followup'>{FM('create-new')}</UncontrolledTooltip>
            <FollowUpModal
              onSuccess={loadAllEvents}
              Component={Button.Ripple}
              className='btn btn-primary btn-sm'
              size='sm'
              outline
              color='dark'
              id='create-followup'
            >
              <Plus size='14' />
            </FollowUpModal>
          </Show>
          <Show IF={Can(Permissions.taskBrowse) && watch('type') === fetchSelectedEvent.task}>
            <TaskModal
              onSuccess={loadAllEvents}
              Component={Button.Ripple}
              className='btn btn-primary btn-sm'
              size='sm'
              outline
              color='dark'
              id='create-task'
            >
              <Plus size='14' />
            </TaskModal>
          </Show>
          <Hide IF={noFilter}>
            <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple
              onClick={() => setShowFilter(true)}
              size='sm'
              color='secondary'
              id='filter'
            >
              <Sliders size='14' />
            </Button.Ripple>
          </Hide>
          <LoadingButton
            loading={loading || loadingFollowUp || loadingTask}
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
      <Show
        IF={
          Can(Permissions.activitySelfAdd) &&
          ViewActivity &&
          watch('type') === fetchSelectedEvent.activity
        }
      >
        {' '}
        <ActivityDetailsModal
          showModal={showDetails}
          setShowModal={handleClose}
          activityId={id}
          noView
        />
      </Show>
      <Show
        IF={
          Can(Permissions.ipFollowUpsSelfBrowse) && watch('type') === fetchSelectedEvent.followups
        }
      >
        <FollowupViewModal
          step={'1'}
          showModal={showDetails}
          setShowModal={handleClose}
          followId={id}
          noView
        />
      </Show>
      <Show IF={Can(Permissions.taskBrowse) && watch('type') === fetchSelectedEvent.task}>
        <TaskDetailModal
          step={'1'}
          showModal={showDetails}
          setShowModal={handleClose}
          activityId={id}
          noView
        />
      </Show>
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
            <Calendar
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

export default CalendarComponent
