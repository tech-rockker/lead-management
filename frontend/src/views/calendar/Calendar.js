// ** React Import
import FullCalendar from '@fullcalendar/react'
import { Fragment, memo, useEffect, useRef } from 'react'

// ** Full Calendar & it's Plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'

import { useContextMenu } from 'react-contexify'
import { toast } from 'react-toastify'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
// ** Styles
import svLocale from '@fullcalendar/core/locales/sv'
import '@styles/react/libs/context-menu/context-menu.scss'
import 'react-contexify/dist/ReactContexify.min.css'
import { Check, MoreVertical, Star } from 'react-feather'
import { Card, CardBody } from 'reactstrap'
import Show from '../../utility/Show'
import { formatDate } from '../../utility/Utils'
import { isValid } from '../../utility/helpers/common'

// ** Toast Component
const ToastContent = ({ text }) => (
  <Fragment>
    <div className='toastify-header pb-0'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Check />} />
        <h6 className='toast-title'>{`Clicked ${text}`}</h6>
      </div>
    </div>
  </Fragment>
)

const Calendar = (props) => {
  const { show } = useContextMenu()

  const handleClick = (text) => {
    toast.success(<ToastContent text={text} />, {
      icon: false,
      hideProgressBar: true,
      closeButton: false
    })
  }
  // ** Refs
  const calendarRef = useRef(null)

  // ** Props
  const {
    store,
    isRtl,
    dispatch,
    calendarsColor,
    calendarApi,
    setCalendarApi,
    handleAddEventSidebar,
    blankEvent,
    toggleSidebar,
    selectEvent,
    visibleDate,
    updateEvent,
    customEventContent = null,
    timeGridWeek = true,
    timeGridDay = true
  } = props

  // ** UseEffect checks for CalendarAPI Update
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  // ** calendarOptions(Props)
  const calendarOptions = {
    locale: svLocale,
    firstDay: 1,
    events: store?.events?.length ? store?.events : [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'prev, title, next,',
      end: `dayGridMonth,${timeGridWeek ? 'timeGridWeek' : ''},${timeGridDay ? 'timeGridDay' : ''
        },listMonth`
    },
    /*
          Enable dragging and resizing event
          ? Docs: https://fullcalendar.io/docs/editable
        */
    editable: false,

    /*
          Enable resizing event from start
          ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
        */
    eventResizableFromStart: true,

    /*
          Automatically scroll the scroll-containers during event drag-and-drop and date selecting
          ? Docs: https://fullcalendar.io/docs/dragScroll
        */
    dragScroll: true,

    /*
          Max number of events within a given day
          ? Docs: https://fullcalendar.io/docs/dayMaxEvents
        */
    dayMaxEvents: 3,
    eventMaxStack: 1,

    // views: {
    //     timeline: {
    //         dayMaxEvents: 6 // adjust to 6 only for timeGridWeek/timeGridDay
    //     }
    // },

    /*
          Determines if day names and week names are clickable
          ? Docs: https://fullcalendar.io/docs/navLinks
        */
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName = isValid(calendarsColor[calendarEvent?._def.extendedProps?.calendar])
        ? `bg-light-${calendarsColor[calendarEvent?._def.extendedProps?.calendar]}`
        : 'bg-white'

      return [
        // Background Color
        `${colorName}`
      ]
    },

    eventContent: (eventInfo) => {
      if (isValid(customEventContent) && typeof customEventContent === 'function') {
        return customEventContent(eventInfo)
      } else {
        return (
          <>
            <span
              onContextMenu={(e) => show(e, { id: `menu-${eventInfo?.event?.id}` })}
              className='d-block text-small-12 fw-bolder text-truncate'
            >
              <Show IF={eventInfo.event.extendedProps?.is_compulsory === 1}>
                <Star size={14} className='me-25' />
              </Show>
              {(eventInfo.event.title)}

              <Show IF={isValid(eventInfo.event.extendedProps?.start_time)}>
                <p className='mb-0'>
                  {formatDate(eventInfo.event.extendedProps?.start_time, 'hh:mm A')} -{' '}
                  {formatDate(eventInfo.event.extendedProps?.end_time, 'hh:mm A')}
                </p>
              </Show>
            </span>
          </>
        )
      }
    },

    eventClick({ event: clickedEvent }) {
      if (!isValid(clickedEvent?._def?.extendedProps?.is_leave)) {
        dispatch(selectEvent(clickedEvent))
      }
    },

    customButtons: {
      sidebarToggle: {
        text: <MoreVertical className='d-xl-none d-block' />,
        click() {
          toggleSidebar(true)
        }
      }
    },

    dateClick(info) {
      const ev = blankEvent
      ev.start = info?.date
      ev.end = info?.date
      dispatch(selectEvent(ev))
    },

    datesSet: (arg) => {
      visibleDate({
        start_date: formatDate(arg?.start, 'YYYY-MM-DD'),
        end_date: formatDate(arg?.end, 'YYYY-MM-DD')
      })
    },
    ref: calendarRef,
    direction: isRtl ? 'rtl' : 'ltr'
  }

  return (
    <Card className=''>
      <CardBody className='pb-0'>
        <FullCalendar {...calendarOptions} />{' '}
      </CardBody>
    </Card>
  )
}

export default memo(Calendar)
