import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { HourglassEmptyOutlined, ViewWeek, WarningOutlined } from '@material-ui/icons'
import classNames from 'classnames'
import moment from 'moment'
import { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  ArrowRight,
  Calendar,
  Clock,
  Home,
  MinusCircle,
  Percent,
  Plus,
  PlusCircle,
  User,
  Users
} from 'react-feather'
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  InputGroupText,
  Label,
  Row,
  Table
} from 'reactstrap'
import { date } from 'yup'
import { loadWorkShift } from '../../../../../utility/apis/companyWorkShift'
import { loadPatientPlanList } from '../../../../../utility/apis/ip'
import { loadSchedule, loadScheduleFilter } from '../../../../../utility/apis/schedule'
import { loadScTemplate } from '../../../../../utility/apis/scheduleTemplate'
import { getUsersDropdown, loadUser } from '../../../../../utility/apis/userManagement'
import {
  CompanyTypes,
  employeeTypes,
  empType,
  getWeeksDiff,
  repetitionWeekDays,
  ShiftType,
  UserTypes
} from '../../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import useUser from '../../../../../utility/hooks/useUser'
import Show from '../../../../../utility/Show'
import {
  addDay,
  addDaysArray,
  createAsyncSelectOptions,
  createConstSelectOptions,
  fastLoop,
  formatDate,
  getAmPm,
  getDates,
  getExactTime,
  JsonParseValidate,
  toggleArray,
  truncateText,
  viewInHours,
  WarningToast
} from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import BsTooltip from '../../../../components/tooltip'
import ScheduleTemplateModal from '../../../scheduleTemplate/fragments/scheduleTemplateModal'
import CompanyTypeForm from './CompanyTypesForm'

const ScheduleFormTab = ({
  ips = null,
  useFieldArray = () => {},
  leave = null,
  editIpRes = null,
  ipRes = null,
  reLabel = null,
  getValues = () => {},
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit = () => {},
  control,
  errors,
  setError
}) => {
  // States
  const user = useUser()
  const dateRef = useRef()
  const [domSet, setDom] = useState(null)
  const [height, setHeight] = useState('100%')
  const [branch, setBranch] = useState([])
  const [refresh, setRefresh] = useState([])
  const [branchSelected, setBranchSelected] = useState(null)
  const [template, setTemplate] = useState([])
  const [templateNew, setTemplateNew] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [shiftSelected, setShift] = useState([])
  const [employee, setEmployee] = useState([])
  const [shiftView, setWorkShiftView] = useState([])
  const [empView, setEmpView] = useState([])
  const [patient, setPatient] = useState(null)
  const [patientHours, setPatientHours] = useState(null)
  const [patients, setPatients] = useState([])
  const [ip, setIp] = useState([])
  const [plan, setPlan] = useState(null)
  const [singleLiving, setSingleLiving] = useState(false)
  const [homeLiving, setHomeLiving] = useState(false)
  const [groupLiving, setGroupLiving] = useState(false)
  const [groupEnabled, setGroupEnabled] = useState(false)
  const [dates, setDates] = useState([])
  const [datesDeleted, setDatesDeleted] = useState([])
  const [SelectedDates, setSelectedDates] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [key, setKey] = useState(new Date())

  // Dropdown
  const loadShiftOption = async (search, loadedOptions, { page }) => {
    if (isValid(watch('shift_type'))) {
      const res = await loadWorkShift({
        async: true,
        page,
        perPage: 100,
        jsonData: {
          name: search,
          shift_type: watch('shift_type') === ShiftType.Basic ? 'normal' : 'emergency'
        }
      })

      return createAsyncSelectOptions(res, page, 'shift_name', null, setShift)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  const loadEmployeeOptions = async (search, loadedOptions, { page }) => {
    const res = await getUsersDropdown({
      async: true,
      page,
      perPage: 100,
      jsonData: {
        name: search,
        branch_id: watch('branch_id'),
        user_type_id: UserTypes.employee,
        employee_type: watch('employee_type')
      }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setEmployee)
  }

  const loadBranchOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.branch }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setBranch)
  }

  const loadTemplateOptions = async (search, loadedOptions, { page }) => {
    const res = await loadScTemplate({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'title', null, setTemplate)
  }

  useEffect(() => {
    // viewShiftDetails()
    if (isValid(watch('shift_id'))) {
      const id = watch('shift_id')
      const s = shiftSelected.find((a) => a.value.id === id)
      //log(s)
      setWorkShiftView(s?.value)
    }
  }, [watch('shift_id')])

  useEffect(() => {
    if (isValid(patient)) {
      let assigned_hours_per_month = 0
      let assigned_hours_per_week = 0
      let assigned_hours_per_day = 0
      fastLoop(patient?.agency_hours, (h, i) => {
        assigned_hours_per_month += Number(h?.assigned_hours_per_month)
        assigned_hours_per_week += Number(h?.assigned_hours_per_week)
        assigned_hours_per_day += Number(h?.assigned_hours_per_day)
      })
      setPatientHours({
        assigned_hours_per_month: assigned_hours_per_month * 60,
        assigned_hours_per_week: assigned_hours_per_week * 60,
        assigned_hours_per_day: assigned_hours_per_day * 60
      })
      setValue('branch_id', patient?.branch_id)
    }
  }, [patient])

  useEffect(() => {
    setValue('dates', dates)
  }, [dates])

  useEffect(() => {
    // viewShiftDetails()
    if (isValid(watch('user_id'))) {
      const id = watch('user_id')
      const s = employee.find((a) => a.value.id === id)
      //log(s)
      setEmpView({
        ...s?.value,
        assigned_work: {
          ...s?.value?.assigned_work,
          actual_working_hours_per_week_in_min: Math.round(
            s?.value?.assigned_work?.actual_working_hour_per_week * 60
          )
        }
      })
      // if (isValid(s?.value?.assigned_work?.working_percent)) {
      //     setGroupEnabled(true)
      // } else {
      //     setGroupEnabled(false)
      // }
    }
  }, [watch('user_id')])

  useEffect(() => {
    setValue(
      'shift_start_time',
      isValid(shiftView?.shift_start_time) ? shiftView?.shift_start_time : edit?.shift_start_time
    )
    setValue(
      'shift_end_time',
      isValid(shiftView?.shift_end_time) ? shiftView?.shift_end_time : edit?.shift_end_time
    )
  }, [shiftView])

  useEffect(() => {
    const dom = document.getElementById('schedule-modal')
    setDom(dom)
  }, [])

  useEffect(() => {
    if (isValid(domSet)) {
      const resizeObserver = new ResizeObserver((entries) => {
        setHeight(entries[0].target.offsetHeight)
      })
      // start observing a DOM node
      resizeObserver.observe(domSet)
    }
  }, [domSet])

  useEffect(() => {
    setEmpView(null)
    setPatient(null)
    setPatientHours(null)
    setValue('user_id', null)
    setValue('patient_id', null)
  }, [refresh])

  useEffect(() => {
    // log(branch)
    setBranchSelected(branch?.find((a) => a.value?.id === watch('branch_id'))?.value)
  }, [watch('branch_id')])

  useEffect(() => {
    if (isValidArray(JsonParseValidate(user?.company_type_id))) {
      const types = JsonParseValidate(user?.company_type_id)
      setHomeLiving(false)
      setSingleLiving(false)
      setGroupLiving(false)

      if (types?.includes(CompanyTypes['home-living'])) {
        setHomeLiving(true)
      }
      if (types?.includes(CompanyTypes['singe-living'])) {
        setSingleLiving(true)
      }
      if (types?.includes(CompanyTypes['group-living'])) {
        setGroupLiving(true)
      }
    }
  }, [user])

  useEffect(() => {
    if (isValidArray(JsonParseValidate(branchSelected?.company_type_id))) {
      const types = JsonParseValidate(branchSelected?.company_type_id)
      setHomeLiving(false)
      setSingleLiving(false)
      setGroupLiving(false)
      if (types?.includes(CompanyTypes['home-living'])) {
        setHomeLiving(true)
      }
      if (types?.includes(CompanyTypes['singe-living'])) {
        setSingleLiving(true)
      }
      if (types?.includes(CompanyTypes['group-living'])) {
        setGroupLiving(true)
      }
    }
  }, [branchSelected])

  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await getUsersDropdown({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, branch_id: watch('branch_id'), user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPatients)
  }

  const loadIpOption = async (search, loadedOptions, { page }) => {
    if (isValid(watch('patient_id'))) {
      const res = await loadPatientPlanList({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, user_id: watch('patient_id') }
      })
      return createAsyncSelectOptions(res, page, 'title', null, setIp)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  useEffect(() => {
    if (ip.length > 1) {
      if (isValid(watch('plan'))) {
        setPlan(watch('plan'))
      }
    } else {
      setPlan(ip[0]?.value)
    }
  }, [watch('plan'), watch('patient_id'), ip])

  // useEffect(() => {
  //     if (isValidArray(patients)) {
  //         setPatient(patients?.find(a => a.value.id === watch('patient_id'))?.value)
  //     }
  // }, [watch('patient_id')])

  const isShitValid = (start, end, shifts = []) => {
    // log(start, end)
    const re = shifts.find((d) => {
      const s = new Date(d?.shift_start_time).getTime()
      const e = new Date(d?.shift_end_time).getTime()
      let re = false
      if (s === start && e === end) {
        re = true
      } else if (start >= s && start <= e) {
        re = true
      } else if (end >= s && end <= e) {
        re = true
      }
      return re
    })
    log('re', re)
    if (isValid(re)) {
      WarningToast('invalid-shift-start-end-time')
    }
    return !isValid(re)
  }

  const loadEmployees = (month) => {
    const currentCalMonth = dateRef.current?.flatpickr?.currentMonth
    const currentMonth = moment().month()
    const startOfMonth =
      currentMonth === currentCalMonth
        ? formatDate(new Date(), 'YYYY-MM-DD')
        : moment().month(month).startOf('month').toDate()
    const endOfMonth = moment().month(month).endOf('month').toDate()
    if (isValid(startOfMonth) && isValid(endOfMonth) && isValid(watch('schedule_template_id'))) {
      loadSchedule({
        jsonData: {
          shift_start_date: formatDate(startOfMonth),
          shift_end_date: formatDate(endOfMonth),
          schedule_template_id: watch('schedule_template_id')
        },
        loading: setLoadingDetails,
        success: (e) => {
          if (isValidArray(e)) {
            const sch = e[0]
            const reSchedule = []
            const disabledDates = []
            log(sch, 'sch')
            fastLoop(sch?.schedules, (shift, i) => {
              if (shift?.leave_applied === 1) {
                disabledDates.push(shift.shift_date)
              } else {
                const exists = reSchedule.findIndex((a) => a.date === shift?.shift_date)

                if (exists !== -1) {
                  reSchedule[exists] = {
                    date: shift?.shift_date,
                    shifts: [
                      ...reSchedule[exists].shifts,
                      {
                        shift,
                        type: null,
                        schedule_id: shift?.id,
                        schedule_template_id: watch('schedule_template_id'),
                        shift_id: shift?.id ?? null,
                        shift_start_time: shift?.shift_start_time,
                        shift_end_time: shift?.shift_end_time,
                        schedule_type: shift?.schedule_type
                      }
                    ]
                  }
                } else {
                  reSchedule.push({
                    date: shift?.shift_date,
                    shifts: [
                      {
                        shift,
                        type: null,
                        schedule_id: shift?.id,
                        schedule_template_id: watch('schedule_template_id'),
                        shift_id: shift?.id ?? null,
                        shift_start_time: shift?.shift_start_time,
                        shift_end_time: shift?.shift_end_time,
                        schedule_type: shift?.schedule_type
                      }
                    ]
                  })
                }
              }
            })
            const finalSorted = []
            const date = []
            fastLoop(reSchedule, (d, i) => {
              const a = d?.shifts.sort((a, b) => {
                return new Date(a?.shift_start_time) - new Date(b.shift_start_time)
              })
              finalSorted.push({
                ...d,
                shifts: a
              })
              date.push(new Date(d?.date))
            })
            date?.sort((a, b) => {
              return a - b
            })
            finalSorted?.sort((a, b) => {
              return new Date(a?.date) - new Date(b.date)
            })
            if (isValidArray(date)) {
              dateRef.current?.flatpickr?.setDate(date)
            }
            setDates(finalSorted)
            setSelectedDates(date)
          }
        }
      })
    } else {
      // setDates([])
      // setSelectedDates([])
      // dateRef.current?.flatpickr?.setDate([])
    }
  }

  useEffect(() => {
    if (dateRef.current?.flatpickr?.currentMonth) {
      loadEmployees(dateRef.current?.flatpickr?.currentMonth)
    }
  }, [dateRef.current?.flatpickr?.currentMonth, watch('schedule_template_id')])

  const updateOldDate = (date, type, i = -1) => {
    if (isValid(date)) {
      const index = dates.findIndex((a) => a.date === date?.date)
      if (index !== -1) {
        const d = dates
        const shift = d[index]
        let shifts = shift?.shifts
        if (i > -1) {
          shifts[i] = {
            ...shifts[i],
            type
          }
        } else {
          shifts = shifts?.map((a) => ({ ...a, type }))
          // shifts = shifts.filter(a => isValid(a.schedule_id) && a.type === "deleted")
        }
        d[index] = {
          ...d[index],
          type,
          shifts
        }
        log('updateOldDate', d)
        const dts = isValidArray(datesDeleted[date?.date]) ? datesDeleted[date?.date] : []
        const dt = [...dts, ...shifts]
        const filteredArr = dt.reduce((acc, current) => {
          const x = acc.find((item) => item.schedule_id === current.schedule_id)
          if (!x) {
            return acc.concat([current])
          } else {
            return acc
          }
        }, [])
        setDatesDeleted({
          ...datesDeleted,
          [date?.date]: filteredArr
        })
        setDates([...d])
      }
    }
  }

  const sortShifts = (date, shifts, more = false) => {
    const oldShifts = isValidArray(datesDeleted[formatDate(date, 'YYYY-MM-DD')])
      ? datesDeleted[formatDate(date, 'YYYY-MM-DD')]?.filter(
          (a) => isValid(a.schedule_id) && a.type === 'deleted'
        )
      : []

    const re = shifts
    let end = isValid(watch('shift_end_time'))
      ? `${formatDate(date, 'YYYY-MM-DD')} ${watch('shift_end_time')}`
      : null
    const start = isValid(watch('shift_start_time'))
      ? `${formatDate(date, 'YYYY-MM-DD')} ${watch('shift_start_time')}`
      : null
    const shift = shiftSelected?.find((a) => a.value?.id === watch('shift_id'))?.value
    const currentShift = {
      id: shift?.id,
      shift_name: shift?.shift_name,
      shift_type: shift?.shift_type,
      shift_color: shift?.shift_color
    }
    if (new Date(end).getTime() < new Date(start)) {
      end = isValid(watch('shift_end_time'))
        ? `${formatDate(addDay(date, 1), 'YYYY-MM-DD')} ${watch('shift_end_time')}`
        : null
    }
    if (isValidArray(shifts)) {
      const shiftExists = shifts?.find(
        (a) => a.shift_start_time === null && a.shift_end_time === null && a.type !== 'deleted'
      )

      if (isValid(shiftExists)) {
        // update if shift is null
        re.push({
          type: 'updated',
          shift: isValid(shiftExists?.shift)
            ? shiftExists?.shift
            : !isValid(shiftExists?.shift_start_time) && !isValid(shiftExists?.shift_end_time)
            ? currentShift
            : null,
          shift_id: isValid(shiftExists?.shift_id)
            ? shiftExists?.shift_id
            : !isValid(shiftExists?.shift_start_time) && !isValid(shiftExists?.shift_end_time)
            ? currentShift?.id
            : null,
          shift_start_time: shiftExists?.shift_start_time ? shiftExists?.shift_start_time : start,
          shift_end_time: shiftExists?.shift_end_time ? shiftExists?.shift_end_time : end,
          schedule_type: 'basic'
        })
      } else {
        // add more shift
        const m = isValidArray(shifts?.filter((a) => a.type === 'deleted')) ?? more
        if (
          isValid(end) &&
          isValid(start) &&
          m &&
          isShitValid(
            new Date(start).getTime(),
            new Date(end).getTime(),
            shifts?.filter((a) => a.type !== 'deleted')
          )
        ) {
          re.push({
            type: 'add_more',
            shift: currentShift ?? null,
            shift_id: currentShift?.id ?? null,
            shift_start_time: start,
            shift_end_time: end,
            schedule_type: 'basic'
          })
        }
      }
    } else {
      // add new shift
      if (isValid(end) && isValid(start)) {
        re.push({
          type: 'new',
          shift: currentShift ?? null,
          shift_id: currentShift?.id ?? null,
          shift_start_time: start,
          shift_end_time: end,
          schedule_type: 'basic'
        })
      }
    }
    re.sort((a, b) => {
      return new Date(a?.shift_start_time) - new Date(b.shift_start_time)
    })
    log('sortShifts', re)
    return re
  }

  // methods
  const sortDates = (data) => {
    const lastDate = dateRef.current?.flatpickr?.latestSelectedDateObj
    const oldDateIndex = dates?.findIndex(
      (a) => a.date === formatDate(lastDate, 'YYYY-MM-DD') && a.type !== 'deleted'
    )

    if (oldDateIndex !== -1) {
      updateOldDate({ date: formatDate(lastDate, 'YYYY-MM-DD') }, 'deleted')
    } else {
      const d = data
      const selected = []
      d?.sort((a, b) => {
        return a - b
      })
      if (isValidArray(d)) {
        setStartDate(d[0])
      } else {
        setStartDate(null)
      }
      fastLoop(d, (x, i) => {
        const dateIndex = dates?.find((a) => a.date === formatDate(x, 'YYYY-MM-DD'))
        log(dateIndex, 'dateIndex')
        log(x, 'dateIndex')
        if (isValid(dateIndex)) {
          //update
          selected.push({
            date: formatDate(x, 'YYYY-MM-DD'),
            shifts: sortShifts(x, dateIndex?.shifts)
          })
        } else {
          //add
          selected.push({
            date: formatDate(x, 'YYYY-MM-DD'),
            shifts: sortShifts(x, [])
          })
        }
      })
      log('sortDates', selected)

      setDates([...selected])
    }
  }

  // hook
  useEffect(() => {
    if (isValidArray(watch('shift_dates'))) {
      sortDates(watch('shift_dates'))
      // setSelectedDates(watch('shift_dates'))
    } else {
      // setDates([])
      setStartDate(null)
    }
  }, [watch('shift_dates')?.length, watch('shift_start_time'), watch('shift_end_time')])

  // render methods
  const findNextShift = useCallback(
    (start, end) => {
      let re = null

      const array = getDates(new Date(start), new Date(end))
      if (isValidArray(array)) {
        for (const date of array) {
          const findIndex = dates?.findIndex((a) => a.date === date)
          if (findIndex !== -1) {
            re = `${dates[findIndex]?.shifts[0]?.shift_start_time}`
            break
          }
        }
      } else {
        const findIndex = dates?.findIndex((a) => a.date === start)
        if (findIndex !== -1) {
          re = `${dates[findIndex]?.shifts[0]?.shift_start_time}`
        }
      }
      // log(start, re)

      return re
    },
    [dates]
  )

  const addMoreShift = (date) => {
    if (isValid(date)) {
      const index = dates.findIndex((a) => a.date === date?.date)
      if (index !== -1) {
        const d = dates
        const shift = d[index]
        d[index] = {
          ...d[index],
          shifts: sortShifts(new Date(date?.date), shift?.shifts, true)
        }
        log('addMoreShift', d)
        setDates([...d])
      }
    }
  }

  const removeShift = (date, shift, i) => {
    if (isValid(date)) {
      const index = dates.findIndex((a) => a.date === date?.date)
      if (index !== -1) {
        const d = dates
        const shift = d[index]
        const shifts = shift?.shifts
        shifts?.splice(i, 1)
        d[index] = {
          ...d[index],
          shifts
        }
        // log(i, shifts)
        setDates([...d])
      }
    }
  }
  const updateDate = (date, i, extraMinutes, extra = false) => {
    if (isValid(date)) {
      const index = dates.findIndex((a) => a.date === date?.date)
      if (index !== -1) {
        const d = dates
        const shift = d[index]
        const shifts = shift?.shifts
        shifts[i] = {
          ...shifts[i],
          extraMinutes,
          extra,
          schedule_type: extra ? 'extra' : 'basic'
        }
        d[index] = {
          ...d[index],
          shifts
        }
        log('updateDate', d)
        setDates([...d])
      }
    }
  }

  const renderDates = (datesAll, index) => {
    const re = []
    let remaining = empView?.assigned_work?.actual_working_hours_per_week_in_min
    let totalWorkMin = 0
    let totalWorkMinEmergency = 0
    let footer = ''

    fastLoop(datesAll, (d, i) => {
      const dateIncluded = isValid(dates?.find((a) => a.date === d))
        ? dates?.find((a) => a.date === d && a.type !== 'deleted')
        : null
      const dI = dateIncluded
      const moreShift = dateIncluded?.shifts?.filter((a) => a.type !== 'deleted')
      const latestShift = isValidArray(moreShift) ? moreShift[0] : null

      const shiftStart = `${latestShift?.shift_end_time}` // it must be shift_end_date - do not change
      const shiftEnd = `${latestShift?.shift_start_time}` // it must be shift_start_date - do not change

      const nextDayShift = dateIncluded
        ? isValid(moreShift[1])
          ? `${moreShift[1]?.shift_start_time}`
          : findNextShift(formatDate(addDay(d, 1), 'YYYY-MM-DD'), datesAll[datesAll?.length - 1])
        : null

      const shift = getExactTime(shiftStart, shiftEnd)
      const gap = dateIncluded && nextDayShift ? getExactTime(shiftStart, nextDayShift) : null
      remaining = remaining - (dateIncluded ? shift.minutesTotal : 0)
      totalWorkMin = totalWorkMin + (dateIncluded ? shift.minutesTotal : 0)

      // if (remaining < 0 && latestShift?.extraMinutes !== Math.abs(remaining)) {
      //     // updateExtra hours
      //     updateDate(dateIncluded, 0, Math.abs(remaining), true)
      // } else if (remaining > 0 && latestShift?.extraMinutes !== Math.abs(remaining)) {
      //     updateDate(dateIncluded, 0, Math.abs(remaining), false)
      // }

      if (latestShift?.shift?.shift_type === ShiftType.Emergency) {
        totalWorkMinEmergency = totalWorkMinEmergency + (dateIncluded ? shift.minutesTotal : 0)
      }
      re.push(
        <>
          <tr>
            <td>
              <Show IF={isValid(dateIncluded)}>
                <PlusCircle
                  role={dateIncluded ? 'button' : 'none'}
                  onClick={() => addMoreShift(dateIncluded)}
                  className={dateIncluded ? 'text-success' : 'text-secondary'}
                  size={20}
                />
              </Show>
              <Show IF={!isValid(dateIncluded)}>
                <PlusCircle
                  role={'button'}
                  onClick={() => {
                    dateRef?.current?.flatpickr?.setDate(
                      [...dates?.map((a) => new Date(a.date)), new Date(d)],
                      true
                    )
                  }}
                  className={'text-success'}
                  size={20}
                />
              </Show>
            </td>
            <td>
              <p key={`date-${formatDate(d, 'DD MMMM, YYYY')}`} className='text-secondary mb-0'>
                {formatDate(d, 'YYYY-MM-DD')}
              </p>
            </td>
            {/* <td>
                            {dateIncluded && empView?.assigned_work?.actual_working_hours_per_week_in_min ? <>
                                <BsTooltip title={FM("actual-total-work-hours-per-day")}>{viewInHours(shiftPerDayMinutes)}</BsTooltip>
                            </> : "--"}
                        </td> */}
            <td>
              <p
                key={`shift-${watch('shift_id')}`}
                className='text-secondary text-truncate mb-0'
                title={latestShift?.shift?.shift_name}
              >
                {truncateText(latestShift?.shift?.shift_name, 15) ?? '--'}
              </p>
            </td>
            <td>
              {latestShift?.shift?.shift_type === ShiftType.Emergency ? (
                <BsTooltip title={FM('emergency-shift')}>
                  <WarningOutlined className='text-danger' />{' '}
                </BsTooltip>
              ) : (
                ''
              )}{' '}
            </td>
            <td>
              <p
                key={`shift-${watch('shift_id')}`}
                className='text-secondary mb-0'
                title={
                  latestShift?.shift_start_time && latestShift?.shift_end_time
                    ? `${
                        getAmPm(
                          new Date(latestShift?.shift_start_time),
                          null,
                          'YYYY-MM-DD hh:mm A'
                        ) ?? ''
                      } - ${
                        getAmPm(
                          new Date(latestShift?.shift_end_time),
                          null,
                          'YYYY-MM-DD hh:mm A'
                        ) ?? ''
                      }`
                    : null
                }
              >
                {latestShift?.shift_start_time && latestShift?.shift_end_time ? (
                  <>
                    {getAmPm(new Date(latestShift?.shift_start_time)) ?? ''}
                    {' - '}
                    {getAmPm(new Date(latestShift?.shift_end_time)) ?? ''}
                  </>
                ) : (
                  '--'
                )}
              </p>
            </td>
            <td>
              <p className='text-secondary mb-0'>{dateIncluded ? <>{shift?.diffStr}</> : '--'}</p>
            </td>
            <td>
              <PlusCircle
                role={dateIncluded ? 'button' : 'none'}
                onClick={() => addMoreShift(dateIncluded)}
                className={dateIncluded ? 'text-success' : 'text-secondary'}
                size={20}
              />
            </td>
            <td>
              <MinusCircle
                role={dateIncluded ? 'button' : 'none'}
                onClick={() => addMoreShift(dateIncluded)}
                className={dateIncluded ? 'text-danger' : 'text-secondary'}
                size={20}
              />{' '}
              Jordan Employee
            </td>
            {/* <td>
                            {
                                dateIncluded && gap ? <p h={gap?.hoursTotal} className={classNames("mb-0 fw-bold", { "text-danger": gap?.hoursTotal < 9, "text-warning": gap?.hoursTotal >= 9 && gap?.hoursTotal < 11, "text-success": gap?.hoursTotal >= 11 })}>
                                    <BsTooltip title={gap?.hoursTotal > 11 ? null : FM("there-must-be-9-11-hours-gap-between-2-shifts")}>
                                        {viewInHours(gap?.minutesTotal)}
                                    </BsTooltip>
                                </p> : "--"
                            }
                        </td> */}
            <Show IF={groupEnabled}>
              <td>
                {remaining !== 0 ? (
                  dateIncluded ? (
                    remaining > 0 ? (
                      <>
                        <BsTooltip title={FM('remaining-hours-per-week')}>
                          <span className='text-success fw-bold'>{viewInHours(remaining)} (-)</span>
                        </BsTooltip>
                      </>
                    ) : (
                      <>
                        <BsTooltip title={FM('extra-hours-per-week')}>
                          <span className='text-danger fw-bold'>
                            {viewInHours(Math.abs(remaining))} (+)
                          </span>
                        </BsTooltip>
                      </>
                    )
                  ) : (
                    '--'
                  )
                ) : (
                  '--'
                )}
              </td>
            </Show>
          </tr>
        </>
      )
      if (moreShift) {
        fastLoop(moreShift, (dateIncluded, i) => {
          if (i !== 0) {
            const shiftStart = `${dateIncluded?.shift_end_time}` // it must be shift_end_date - do not change
            const shiftEnd = `${dateIncluded?.shift_start_time}` // it must be shift_start_date - do not change\
            let next
            if (isValid(moreShift[i + 1])) {
              const nextShift = moreShift[i + 1]
              next = `${nextShift?.shift_start_time}`
            }
            // const nextDayShift = dateIncluded ? findNextShift(formatDate(addDay(d, 1), "YYYY-MM-DD"), datesAll[datesAll?.length - 1]) : null
            const nextDayShift = next
              ? next
              : dateIncluded
              ? findNextShift(
                  formatDate(addDay(d, 1), 'YYYY-MM-DD'),
                  datesAll[datesAll?.length - 1]
                )
              : null

            const shift = getExactTime(shiftStart, shiftEnd)
            const gap = dateIncluded && nextDayShift ? getExactTime(shiftStart, nextDayShift) : null

            remaining = remaining - (dateIncluded ? shift.minutesTotal : 0)
            totalWorkMin = totalWorkMin + (dateIncluded ? shift.minutesTotal : 0)

            if (dateIncluded?.shift?.shift_type === ShiftType.Emergency) {
              totalWorkMinEmergency =
                totalWorkMinEmergency + (dateIncluded ? shift.minutesTotal : 0)
            }
            re.push(
              <>
                <tr>
                  <td>
                    <MinusCircle
                      role={'button'}
                      onClick={() => removeShift(dI, dateIncluded, i)}
                      className={'text-danger'}
                      size={20}
                    />
                  </td>
                  <td>
                    {/* <p key={`date-${formatDate(d, "DD MMMM, YYYY")}`} className='text-secondary mb-0'>
                                        {formatDate(d, "YYYY-MM-DD")}
                                    </p> */}
                  </td>
                  {/* <td> */}
                  {/* {dateIncluded && empView?.assigned_work?.actual_working_hours_per_week_in_min ? <>
                                        <BsTooltip title={FM("actual-total-work-hours-per-day")}>{viewInHours(shiftPerDayMinutes)}</BsTooltip>
                                    </> : "--"} */}
                  {/* </td> */}
                  <td>
                    <p
                      key={`shift-${watch('shift_id')}`}
                      className='text-secondary mb-0'
                      title={dateIncluded?.shift?.shift_name}
                    >
                      {truncateText(dateIncluded?.shift?.shift_name, 25) ?? '--'}
                    </p>
                  </td>
                  <td>
                    {dateIncluded?.shift?.shift_type === ShiftType.Emergency ? (
                      <BsTooltip title={FM('emergency-shift')}>
                        <WarningOutlined className='text-danger' />{' '}
                      </BsTooltip>
                    ) : (
                      ''
                    )}{' '}
                  </td>
                  <td>
                    <p key={`shift-${watch('shift_id')}`} className='text-secondary mb-0'>
                      {dateIncluded?.shift_start_time && dateIncluded?.shift_end_time ? (
                        <>
                          {getAmPm(new Date(dateIncluded?.shift_start_time)) ?? ''}
                          {' - '}
                          {getAmPm(new Date(dateIncluded?.shift_end_time)) ?? ''}
                        </>
                      ) : (
                        '--'
                      )}
                    </p>
                  </td>
                  <td>
                    <p className='text-secondary mb-0'>
                      {dateIncluded ? (
                        <>
                          {shift?.diffStr}
                          {/* {(shift.minutesTotal - shiftPerDayMinutes !== 0) ? <BsTooltip title={shift.minutesTotal > shiftPerDayMinutes ? FM("extra-hours") : FM("remaining-hours")}><span className={classNames('fw-bolder ms-25', { "text-danger": shift.minutesTotal > shiftPerDayMinutes, "text-success": shift.minutesTotal <= shiftPerDayMinutes })}>
                                                    ({
                                                        getExactTimeWithMili((Math.abs(shift.minutesTotal - shiftPerDayMinutes) * 60000)).diffStr
                                                    }
                                                    )
                                                </span>
                                                </BsTooltip> : ""} */}
                        </>
                      ) : (
                        '--'
                      )}
                    </p>
                  </td>
                  <td>
                    {dateIncluded && gap ? (
                      <p
                        className={classNames('mb-0 fw-bold', {
                          'text-danger': gap?.hours < 9,
                          'text-warning': gap?.hours >= 9 && gap?.hours < 11,
                          'text-success': gap?.hours >= 11
                        })}
                      >
                        <BsTooltip
                          title={
                            gap?.hours > 11
                              ? null
                              : FM('there-must-be-9-11-hours-gap-between-2-shifts')
                          }
                        >
                          {viewInHours(gap?.minutesTotal)}
                        </BsTooltip>
                      </p>
                    ) : (
                      '--'
                    )}
                  </td>
                  <Show IF={groupEnabled}>
                    <td>
                      {remaining !== 0 ? (
                        dateIncluded ? (
                          remaining > 0 ? (
                            <>
                              <BsTooltip title={FM('remaining-hours-per-week')}>
                                <span className='text-success fw-bold'>
                                  {viewInHours(remaining)} (-)
                                </span>
                              </BsTooltip>
                            </>
                          ) : (
                            <>
                              <BsTooltip title={FM('extra-hours-per-week')}>
                                <span className='text-danger fw-bold'>
                                  {viewInHours(Math.abs(remaining))} (+)
                                </span>
                              </BsTooltip>
                            </>
                          )
                        ) : (
                          '--'
                        )
                      ) : (
                        '--'
                      )}
                    </td>
                  </Show>
                </tr>
              </>
            )
          }
        })
      }
      footer = (
        <Show IF={i === 6}>
          <Row className='border-top  m-0 p-0 pt-2 pb-2 align-items-center'>
            <Show IF={totalWorkMinEmergency > 720}>
              <Col md='12'>
                <Alert color='danger' className='p-1'>
                  {FM('emergency-hours-exceeded-the-limit')}
                </Alert>
              </Col>
            </Show>
            <Col md='12'>
              <Row>
                <Show IF={groupEnabled}>
                  <Col md='4'>
                    <StatsHorizontal
                      className={'white mb-0'}
                      icon={<ViewWeek size={30} />}
                      color='primary'
                      stats={viewInHours(
                        empView?.assigned_work?.actual_working_hours_per_week_in_min
                      )}
                      statTitle={<span className=''>{FM('actual-work-hours')}</span>}
                    />
                  </Col>
                </Show>
                <Col md='4'>
                  <StatsHorizontal
                    className={'white mb-0'}
                    icon={<ViewWeek size={30} />}
                    color={
                      totalWorkMin > empView?.assigned_work?.actual_working_hours_per_week_in_min
                        ? 'danger'
                        : 'success'
                    }
                    stats={
                      <span
                        className={
                          totalWorkMin >
                          empView?.assigned_work?.actual_working_hours_per_week_in_min
                            ? 'text-danger'
                            : 'text-success'
                        }
                      >
                        {viewInHours(totalWorkMin)}
                      </span>
                    }
                    statTitle={FM('assigned-total-work-hours-this-week')}
                  />
                </Col>
                <Show
                  IF={
                    totalWorkMin > empView?.assigned_work?.actual_working_hours_per_week_in_min &&
                    groupEnabled
                  }
                >
                  <Col md='4'>
                    <StatsHorizontal
                      className={'white mb-0'}
                      icon={<ViewWeek size={30} />}
                      color='danger'
                      stats={
                        <span className='text-danger'>
                          {viewInHours(
                            totalWorkMin -
                              empView?.assigned_work?.actual_working_hours_per_week_in_min
                          )}
                        </span>
                      }
                      statTitle={FM('extra-hours-this-week')}
                    />
                  </Col>
                </Show>
                <Show
                  IF={
                    totalWorkMin <= empView?.assigned_work?.actual_working_hours_per_week_in_min &&
                    groupEnabled
                  }
                >
                  <Col md='4'>
                    <StatsHorizontal
                      className={'white mb-0'}
                      icon={<Clock size={30} />}
                      color='success'
                      stats={
                        <span className='text-success'>
                          {viewInHours(
                            empView?.assigned_work?.actual_working_hours_per_week_in_min -
                              totalWorkMin
                          )}
                        </span>
                      }
                      statTitle={FM('remaining-hours-this-week')}
                    />
                  </Col>
                </Show>
              </Row>
            </Col>
          </Row>
        </Show>
      )
    })
    return (
      <>
        <div className='table-'>
          {/* <Scrollbars autoHide style={{ height: "300px" }}> */}
          <Table striped responsive className='fixed-table'>
            <thead>
              <tr>
                <th></th>
                <th>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('date')}</p>
                </th>
                {/* <th>
                                <p className='text-dark mb-0 fw-bolder text-small-12'>
                                    {FM("actual-work-hours-per-day")}
                                </p>
                            </th> */}
                <th colSpan={2}>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('shift')}</p>
                </th>
                <th>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('shift-time')}</p>
                </th>
                <th>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>
                    {FM('shift-hours-per-day')}
                  </p>
                </th>
                <th>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('patient')}</p>
                </th>
                <th>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('employee')}</p>
                </th>
                {/* <th>
                                <p className='text-dark mb-0 fw-bolder text-small-12'>
                                    {FM("rest-between-shift")}
                                </p>
                            </th> */}
                <Show IF={groupEnabled}>
                  <th>
                    <p className='text-dark mb-0 fw-bolder text-small-12'>
                      {FM('remaining-hours')}
                    </p>
                  </th>
                </Show>
              </tr>
            </thead>
            <tbody>{re}</tbody>
          </Table>
          {/* </Scrollbars> */}
        </div>
        {/* {footer} */}
      </>
    )
  }
  const renderDayWeeks = () => {
    const re = []
    const allDates = isValidArray(dates) ? addDaysArray(dates[0]?.date, 28) : []
    const allWeeks = []
    const chunkSize = 7
    for (let i = 0; i < allDates.length; i += chunkSize) {
      const chunk = allDates.slice(i, i + chunkSize)
      allWeeks.push(chunk)
    }
    // log("allWeeks", allWeeks)
    if (isValidArray(allWeeks)) {
      fastLoop(allWeeks, (week, index) => {
        re.push(
          <Card className='white' key={`week-days-${index}`}>
            <CardHeader className='border-bottom p-1'>
              <Row className='flex-1'>
                <Col md='5'>
                  <p className='text-dark fw-bold text-capitalize mb-0'>
                    {FM('week')} : {index + 1} - {formatDate(week[0], 'DD MMMM')} {' : '}{' '}
                    {formatDate(week[week?.length - 1], 'DD MMMM')}
                  </p>
                </Col>
                <Col md='7' className='d-flex justify-content-end'>
                  <div>
                    {/* <p className='text-dark fw-bolder text-uppercase mb-0'>
                                            {FM("employee-assigned-work-hours", { employee: empView?.name })}
                                        </p>
                                        <p className='mb-0 mt-25 text-small-12 text-secondary'>
                                            {isValid(empView?.assigned_work?.actual_working_hours_per_week_in_min) ? viewInHours(empView?.assigned_work?.actual_working_hours_per_week_in_min) : "00:00"}
                                            {" "} {FM("per-week")} (
                                            {isValid(empView?.assigned_work?.working_percent) ? empView?.assigned_work?.working_percent : 0}%
                                            {" "} {FM("of")} {" "}
                                            {isValid(empView?.assigned_work?.assigned_working_hour_per_week) ? empView?.assigned_work?.assigned_working_hour_per_week : 0} {FM("hours")}
                                            )
                                        </p> */}
                    <p className='text-secondary mb-0'>{FM('all-time-is-hh-mm')}</p>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className='p-0'>{renderDates(week, index)}</CardBody>
          </Card>
        )
      })
    }
    return re
  }
  const renderCompanyType = () => {
    let re = ''

    if (isValidArray(JsonParseValidate(patient?.company_type_id))) {
      const types = JsonParseValidate(patient?.company_type_id)
      if (types[0] === CompanyTypes['home-living']) {
        re = FM('home-living')
      } else if (types[0] === CompanyTypes['singe-living']) {
        re = FM('singe-living')
      } else if (types[0] === CompanyTypes['group-living']) {
        re = FM('group-living')
      }
    }
    return isValid(re) ? <span className='text-primary fw-bolder'>({re})</span> : ''
  }

  return (
    <div className='p-0 m-0'>
      <FormGroupCustom
        noLabel
        noGroup
        value={edit?.is_repeat}
        type='hidden'
        name='is_repeat'
        control={control}
      />
      <CardBody className='p-0 m-0'>
        <Container fluid className='m-0 p-0'>
          <Row className='g-0'>
            <Col
              md='3'
              className='shadow white pt-0 pb-0'
              style={{
                overflow: 'hidden',
                height
              }}
            >
              <Scrollbars autoHide>
                <Row className='p-1 g-0'>
                  <Col md='12' className=''>
                    <Row className=''>
                      <Col md={12}>
                        <FormGroupCustom
                          key={`template-new-${templateNew?.id}`}
                          label={'schedule-template'}
                          type={'select'}
                          async
                          isClearable
                          defaultOptions
                          control={control}
                          options={template}
                          matchWith='id'
                          value={templateNew?.id ?? ''}
                          append={
                            <ScheduleTemplateModal
                              responseData={setTemplateNew}
                              Component={InputGroupText}
                            >
                              <Plus size={16} />
                            </ScheduleTemplateModal>
                          }
                          loadOptions={loadTemplateOptions}
                          name={'schedule_template_id'}
                          className={classNames('mb-1')}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md='12'>
                        <Label>{FM('shift-and-type')}</Label>
                        <FormGroupCustom
                          placeholder={FM('shift-type')}
                          type={'select'}
                          noLabel
                          // isDisabled={!isValid(watch('schedule_type') === 1)}
                          isClearable
                          // defaultOptions
                          value={edit?.shift_type}
                          control={control}
                          options={createConstSelectOptions(ShiftType, FM)}
                          name='shift_type'
                          className='mb-1'
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='12'>
                        <FormGroupCustom
                          noLabel
                          key={`fcdbdsfgsgfs-${edit?.shift_id}-${watch('shift_type')}`}
                          type={'select'}
                          control={control}
                          errors={errors}
                          name={'shift_id'}
                          isClearable
                          matchWith='id'
                          //  isMulti
                          async
                          cacheOptions
                          loadOptions={loadShiftOption}
                          value={edit?.shift_id}
                          options={shiftSelected}
                          placeholder={FM('shift')}
                          rules={{ required: false }}
                          className='mb-1'
                        />
                      </Col>

                      <Col md={6}>
                        <FormGroupCustom
                          key={`shift-start-time-${shiftView?.shift_start_time}-${watch(
                            'shift_id'
                          )}`}
                          disabled={watch('shift_id')}
                          //   isDisable={watch("shift_id")}
                          name={`shift_start_time`}
                          type={'date'}
                          label={FM(`start-time`)}
                          options={{
                            enableTime: true,
                            noCalendar: true
                          }}
                          value={shiftView?.shift_start_time ?? edit?.shift_start_time}
                          dateFormat={'HH:mm'}
                          errors={errors}
                          className='mb-1'
                          setValue={setValue}
                          control={control}
                          rules={{ required: false }}
                          //value={edit?.how_many_time_array[i]?.start ? new Date(edit?.how_many_time_array[i]?.start) : ""}
                        />
                      </Col>
                      <Col md={6}>
                        <FormGroupCustom
                          key={`start-time-vvv${shiftView?.shift_end_time}-${watch('shift_id')}`}
                          disabled={watch('shift_id')}
                          name={`shift_end_time`}
                          type={'date'}
                          label={FM('end-time')}
                          // defaultDate={dates[1]}
                          options={{
                            enableTime: true,
                            noCalendar: true
                            // minDate: new Date(`${formatDate(new Date(addDay(new Date(), 1)), "YYYY-MM-DD")} ${watch(`shift_start_time`)}`) ?? ''
                          }}
                          dateFormat={'HH:mm'}
                          errors={errors}
                          className='mb-1'
                          value={shiftView?.shift_end_time ?? edit?.shift_end_time}
                          control={control}
                          setValue={setValue}
                          rules={{ required: false }}
                        />
                      </Col>
                      <Col md='12' className='d-flex justify-content-center'>
                        <FormGroupCustom
                          type={'date'}
                          key={`re-dates`}
                          noGroup
                          noLabel
                          dateFormat={null}
                          options={{
                            mode: 'multiple',
                            inline: true,
                            // enable: [function (date) { return enableFutureDates(date) }, edit?.start_date, new Date()],
                            minDate: empView?.shift_start_date ?? 'today',
                            maxDate: groupEnabled
                              ? isValidArray(watch('shift_dates'))
                                ? new Date(addDay(new Date(watch('shift_dates')[0]), 27))
                                : null ?? null
                              : null
                          }}
                          onMonthChange={(e) => setKey(new Date())}
                          dateRef={dateRef}
                          control={control}
                          errors={errors}
                          setValue={setValue}
                          name={'shift_dates'}
                          label={FM('select-dates')}
                          rules={{ required: true }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Scrollbars>
            </Col>
            <Col
              md={9}
              className=''
              style={{
                overflow: 'hidden',
                height
              }}
            >
              <Row className='p-1 pe-1 gx-1 shadow white'>
                <Col>
                  <FormGroupCustom
                    label={'branch'}
                    type={'select'}
                    async
                    isClearable
                    defaultOptions
                    value={branchSelected?.id ?? watch('branch_id')}
                    control={control}
                    options={branch}
                    matchWith='id'
                    onChangeValue={() => {
                      setRefresh(new Date())
                    }}
                    loadOptions={loadBranchOptions}
                    name={'branch_id'}
                    // noLabel={branch.length === 0}
                    className={classNames('mb-0 ', {
                      'd-block': branch.length > 0,
                      'pe-none': branch.length === 0
                    })}
                  />
                </Col>
                <Hide IF={groupLiving && (!singleLiving || !homeLiving)}>
                  <Col>
                    <FormGroupCustom
                      key={`${edit?.patient_id}-patient_id-${refresh}`}
                      type={'select'}
                      control={control}
                      errors={errors}
                      name={'patient_id'}
                      defaultOptions
                      matchWith='id'
                      async
                      isClearable
                      cacheOptions
                      value={''}
                      loadOptions={loadPatientOption}
                      options={patients}
                      label={FM('patient')}
                      rules={{ required: singleLiving && (!homeLiving || !groupLiving) }}
                      className='mb-0'
                    />
                  </Col>
                  <Col className={classNames({ 'd-none': ip?.length <= 1 })}>
                    <FormGroupCustom
                      key={`${watch('patient_id')}-plan-${refresh}`}
                      type={'select'}
                      control={control}
                      errors={errors}
                      name={'plan'}
                      defaultOptions
                      matchWith='id'
                      async
                      isClearable
                      cacheOptions
                      value={''}
                      loadOptions={loadIpOption}
                      options={ip}
                      label={FM('plan')}
                      rules={{ required: true }}
                      className='mb-0'
                    />
                  </Col>
                </Hide>
                <Col>
                  <FormGroupCustom
                    type={'select'}
                    control={control}
                    errors={errors}
                    isClearable
                    name={'employee_type'}
                    value={edit?.employee_type}
                    options={createConstSelectOptions(empType, FM)}
                    label={FM('employee-type')}
                    rules={{ required: false }}
                    className='mb-0'
                  />
                </Col>
                <Col>
                  <FormGroupCustom
                    key={`${edit?.user_id}-user_id-${watch('branch_id')}-${watch('employee_type')}`}
                    type={'select'}
                    control={control}
                    errors={errors}
                    name={'user_id'}
                    defaultOptions
                    isClearable
                    async
                    matchWith='id'
                    cacheOptions
                    // isDisabled={!isValid(watch('schedule_type'))}
                    loadOptions={loadEmployeeOptions}
                    value={edit?.user_id}
                    options={employee}
                    label={FM('Employee')}
                    rules={{ required: false }}
                    className='mb-0'
                  />
                </Col>
              </Row>
              <Scrollbars autoHide>
                <div className=''>
                  <Row className='p-1 me-1 gx-1'>
                    <Show IF={isValid(empView?.id) && groupEnabled && false}>
                      <div className='border-bottom text-dark text-capitalize pb-25 fw-bolder mb-2'>
                        {FM('employee-assigned-work-hours', { employee: empView?.name })} -
                      </div>
                      <Col md='4'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<Clock size={30} />}
                          color='primary'
                          stats={
                            isValid(empView?.assigned_work?.assigned_working_hour_per_week)
                              ? empView?.assigned_work?.assigned_working_hour_per_week
                              : 0
                          }
                          statTitle={FM('work-hours')}
                        />
                      </Col>
                      <Col md='4'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<Percent size={30} />}
                          color='info'
                          stats={`${
                            isValid(empView?.assigned_work?.working_percent)
                              ? empView?.assigned_work?.working_percent
                              : 0
                          }%`}
                          statTitle={FM('work-grade')}
                        />
                      </Col>
                      <Col md='4'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<Clock size={30} />}
                          color='success'
                          stats={
                            isValid(empView?.assigned_work?.actual_working_hours_per_week_in_min)
                              ? viewInHours(
                                  empView?.assigned_work?.actual_working_hours_per_week_in_min
                                )
                              : '0'
                          }
                          statTitle={FM('actual-work-hours')}
                        />
                      </Col>
                    </Show>
                    <Show IF={isValid(patient?.id) && false}>
                      <div className='border-bottom text-dark text-capitalize pb-25 fw-bolder mb-2'>
                        {renderCompanyType()}{' '}
                        {FM('patients-total-assigned-hours', { patient: patient?.name })} -
                      </div>
                      <Col md='4'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<HourglassEmptyOutlined size={30} />}
                          color='primary'
                          stats={
                            patientHours?.assigned_hours_per_day
                              ? viewInHours(patientHours?.assigned_hours_per_day)
                              : '0'
                          }
                          statTitle={FM('hours-per-day')}
                        />
                      </Col>
                      <Col md='4'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<ViewWeek size={30} />}
                          color='info'
                          stats={
                            patientHours?.assigned_hours_per_week
                              ? viewInHours(patientHours?.assigned_hours_per_week)
                              : '0'
                          }
                          statTitle={FM('hours-per-week')}
                        />
                      </Col>
                      <Col md='4'>
                        <StatsHorizontal
                          className={'white'}
                          icon={<Calendar size={30} />}
                          color='success'
                          stats={
                            patientHours?.assigned_hours_per_month
                              ? viewInHours(patientHours?.assigned_hours_per_month)
                              : '0'
                          }
                          statTitle={FM('hours-per-month')}
                        />
                      </Col>
                    </Show>
                    <Show IF={isValidArray(dates)}>
                      <Col md='12'>{renderDayWeeks()}</Col>
                    </Show>
                  </Row>
                </div>
              </Scrollbars>
            </Col>
          </Row>
        </Container>
      </CardBody>
    </div>
  )
}

export default ScheduleFormTab
