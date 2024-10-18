// ** React Imports
// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'
// ** Styles
import '@styles/react/apps/app-calendar.scss'
import React, { Fragment, useEffect, useState } from 'react'
import { ArrowLeft, Clock, Download, Edit2, RefreshCcw, Sliders } from 'react-feather'
import { useForm } from 'react-hook-form'
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { Button, ButtonGroup, Col, Row, Spinner, UncontrolledTooltip } from 'reactstrap'

import { useHistory, useLocation, useParams } from 'react-router-dom'
import { getPath } from '../../../router/RouteHelper'
import {
  loadSchedule,
  printScheduleEmpBased,
  printSchedulePatientBased
} from '../../../utility/apis/schedule'
import { loadScTemplate } from '../../../utility/apis/scheduleTemplate'
import { fetchSelectedEvent, UserTypes } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useModules from '../../../utility/hooks/useModules'
import useUser from '../../../utility/hooks/useUser'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import {
  changeScheduleResponse,
  createAsyncSelectOptions,
  formatDate,
  truncateText
} from '../../../utility/Utils'
import Calendarr from '../../calendar/Calendar'
import { updateEvent } from '../../calendar/store'
import LoadingButton from '../../components/buttons/LoadingButton'
import Header from '../../header'
import ScheduleModal from './fragment/ScheduleModal'
import ScheduleViewModal from './fragment/ScheduleVIewModal'
import ScheduleFilter from './ScheduleFilter'

// ** CalendarColors
const calendarsColor = {
  pending: 'danger',
  leave: 'warning',
  vacation: 'danger',
  notApplicable: 'danger',
  completed: 'secondary',
  is_completed: 'success',
  is_notCOmpleted: 'danger',
  primary: 'primary'
}

const CalendarView = ({ noFilter = false }) => {
  const { control, watch } = useForm()
  const history = useHistory()
  const params = useParams()
  const query = params
  const location = useLocation()
  const user = useUser()
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
  const [templateOptions, setTemplateOptions] = useState([])

  const [showDetails, setShowDetails] = useState(false)
  const [filterData, setFilterData] = useState({
    shift_id: '',
    patient_id: '',
    shift_start_date: '',
    shift_end_date: ''
  })
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
    shift_name: '',
    shift_start_date: '',
    shift_end_date: '',
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

  const loadTemplateOptions = async (search, loadedOptions, { page }) => {
    const res = await loadScTemplate({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, status: 'active' }
    })
    return createAsyncSelectOptions(res, page, 'title', null, setTemplateOptions)
  }
  log(query)
  const loadAllEvents = () => {
    if (isValid(user?.user_type_id)) {
      loadSchedule({
        loading: setLoading,
        jsonData: {
          user_id: user?.user_type_id === UserTypes.employee ? user?.id : null,
          ...filterData,
          schedule_template_id: params?.id ?? null,
          is_active: params?.id ? (query?.status === '1' ? 1 : 'no') : 1
          // is_active: query?.status === "1" ? "1" : "no"
          // status: params?.id ? null : 1
          //  status: isValid(filterData?.status) ? filterData?.status : activityStatus
        },
        success: (d) => {
          setFetchActivity(changeScheduleResponse(d?.payload))
        }
      })
    }
  }

  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const printEmpData = () => {
    printScheduleEmpBased({
      jsonData: {
        user_id: filterData?.user_id,
        // start_date: formatDate(filterData?.shift_start_date) ?? "",
        // end_date: formatDate(filterData?.shift_end_date) ?? ""
        start_date: formatDate(firstDay) ?? '',
        end_date: formatDate(lastDay) ?? ''
      }
    })
  }
  const printPatientData = () => {
    printSchedulePatientBased({
      jsonData: {
        user_id: filterData?.patient_id,
        // start_date: formatDate(filterData?.shift_start_date) ?? "",
        // end_date: formatDate(filterData?.shift_end_date) ?? "",
        start_date: formatDate(firstDay) ?? '',
        end_date: formatDate(lastDay) ?? ''
      }
    })
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

  const selected = (e) => {
    if (isValid(e?.id)) {
      setId(parseInt(e?._def?.publicId))
      setShowDetails(true)
    }
  }

  const handleClose = (e) => {
    setShowDetails(false)
  }
  const customEventContent = (eventInfo) => {
    // log(eventInfo?.event)
    if (eventInfo.event?.extendedProps?.leave_applied === 1) {
      if (eventInfo.event?.extendedProps?.leave_type === 'vacation') {
        return (
          <>
            <div className='d-flex flex-column flex-1'>
              <div className='d-flex flex-1 align-items-center justify-content-between'>
                <span className='d-block text-capitalize text-small-12'>
                  {truncateText(eventInfo.event.title, 15)}
                </span>
                <span className='badge bg-danger text-small-12'>
                  {FM('schedule-vacation-short-form')}
                </span>
              </div>
              <Show IF={isValid(eventInfo.event.extendedProps?.start_time)}>
                <p className='mb-0'>
                  {formatDate(eventInfo.event.extendedProps?.start_time, 'hh:mm A')} -{' '}
                  {formatDate(eventInfo.event.extendedProps?.end_time, 'hh:mm A')}
                </p>
              </Show>
            </div>
          </>
        )
      } else {
        return (
          <>
            <div className='d-flex flex-column flex-1'>
              <div className='d-flex flex-1 align-items-center justify-content-between'>
                <span className='d-block text-capitalize text-small-12'>
                  {truncateText(eventInfo.event.title, 15)}
                </span>
                <span className='badge bg-warning text-small-12'>
                  {FM('schedule-leave-short-form')}
                </span>
              </div>
              <Show IF={isValid(eventInfo.event.extendedProps?.start_time)}>
                <p className='mb-0'>
                  {formatDate(eventInfo.event.extendedProps?.start_time, 'hh:mm A')} -{' '}
                  {formatDate(eventInfo.event.extendedProps?.end_time, 'hh:mm A')}
                </p>
              </Show>
            </div>
          </>
        )
      }
    } else {
      return (
        <>
          <div className='d-flex flex-column flex-1'>
            <span className='d-block text-small-12 text-capitalize'>
              {truncateText(eventInfo.event.title, 15)}
            </span>
            <Show IF={isValid(eventInfo.event.extendedProps?.start_time)}>
              <p className='mb-0'>
                {formatDate(eventInfo.event.extendedProps?.start_time, 'hh:mm A')} -{' '}
                {formatDate(eventInfo.event.extendedProps?.end_time, 'hh:mm A')}
              </p>
            </Show>
          </div>
        </>
      )
    }
  }

  return (
    <Fragment>
      <Show IF={Can(Permissions.scheduleSelfBrowse)}>
        <ScheduleFilter
          show={showFilter}
          setFilterData={(e) => {
            setFilterData({
              ...filterData,
              ...e
            })
          }}
          filterData={filterData}
          handleFilterModal={() => {
            setShowFilter(false)
          }}
        />
      </Show>
      <Header
        title={location?.state?.data?.title ?? FM('schedules')}
        subHeading={<>{FM('calender-view')}</>}
        titleCol='7'
        childCol='5'
        icon={
          params?.id ? (
            <ArrowLeft
              role={'button'}
              onClick={() => {
                history?.push(getPath('schedule.template'))
              }}
            />
          ) : (
            <Clock style={{ marginTop: -3 }} />
          )
        }
      >
        {/* <Hide IF={isValid(params?.id)}>
                    <div className='flex-1'>
                        <FormGroupCustom
                            noGroup
                            noLabel
                            placeholder={FM("template")}
                            type={"select"}
                            async
                            isClearable
                            defaultOptions
                            control={control}
                            options={templateOptions}
                            matchWith="id"
                            loadOptions={loadTemplateOptions}
                            name={"template_id"}
                            className={classNames('mb-0 flex-1')}
                        />
                    </div>
                </Hide> */}
        <ButtonGroup className='ms-1' color='dark'>
          {params?.id && !isValid(location?.state?.data?.deactivation_date) ? (
            <>
              <UncontrolledTooltip target='create-button'>
                {params?.id ? FM('edit') : FM('create-new')}
              </UncontrolledTooltip>
              <ScheduleModal
                templateId={params?.id}
                responseData={loadAllEvents}
                Component={Button.Ripple}
                className='btn btn-primary btn-sm'
                size='sm'
                outline
                color='dark'
                id='create-button'
              >
                <Edit2 size={14} />
              </ScheduleModal>
            </>
          ) : null}
          <Hide IF={!isValid(filterData?.user_id)}>
            <UncontrolledTooltip target='exports'>{FM('export-by-employee')}</UncontrolledTooltip>
            <Button.Ripple onClick={printEmpData} size='sm' color='secondary' id='exports'>
              <Download size='14' />
            </Button.Ripple>
          </Hide>
          <Hide IF={!isValid(filterData?.patient_id)}>
            <UncontrolledTooltip target='export'>{FM('export-by-patient')}</UncontrolledTooltip>
            <Button.Ripple onClick={printPatientData} size='sm' color='secondary' id='export'>
              <Download size='14' />
            </Button.Ripple>
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
              setFilterData({
                shift_id: '',
                patient_id: '',
                shift_start_date: '',
                shift_end_date: ''
              })
            }}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <ScheduleViewModal showModal={showDetails} setShowModal={handleClose} followId={id} noView />
      <div className='app-calendar border'>
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
              // timeGridWeek={!isValid(filterData?.user_id)}
              // timeGridDay={!isValid(filterData?.user_id)}
              key={`cal-${fetchActivity?.events?.length}-${filterData?.user_id}`}
              visibleDate={(e) => {
                setFilterData({
                  ...filterData,
                  shift_start_date: e?.start_date,
                  shift_end_date: e?.end_date
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
