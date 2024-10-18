import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { MenuOpen, ViewWeek, WarningOutlined } from '@material-ui/icons'
import classNames from 'classnames'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { Item, Menu, Separator, useContextMenu } from 'react-contexify'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  Clock,
  Copy,
  Info,
  MinusCircle,
  Moon,
  Plus,
  PlusCircle,
  Repeat,
  Trash2
} from 'react-feather'
import {
  Badge,
  Button,
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
import { loadWorkShift } from '../../../../../utility/apis/companyWorkShift'
import {
  loadScheduleData,
  loadScheduleDataPatient,
  loadScheduleList
} from '../../../../../utility/apis/schedule'
import { loadScTemplate } from '../../../../../utility/apis/scheduleTemplate'
import { getUsersDropdown } from '../../../../../utility/apis/userManagement'
import {
  CompanyTypes,
  empType,
  forDecryption,
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
  decrypt,
  decryptObject,
  fastLoop,
  formatDate,
  getAmPm,
  getExactTime,
  getFirstAndLast,
  getMonday,
  getWeekNumber,
  getWeeksDiff,
  JsonParseValidate,
  truncateText,
  viewInHours,
  WarningToast
} from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import BsTooltip from '../../../../components/tooltip'
import ScheduleTemplateModal from '../../../scheduleTemplate/fragments/scheduleTemplateModal'
// ** Styles
import '@styles/react/libs/context-menu/context-menu.scss'
import 'react-contexify/dist/ReactContexify.min.css'
import { loadLeave } from '../../../../../utility/apis/leave'
import CenteredModal from '../../../../components/modal/CenteredModal'
import BsPopover from '../../../../components/popover'
import WorkShiftModal from '../../../workShift/WorkShiftModal'

const ScheduleFormTab = ({
  templateId = null,
  setPatientHour = () => {},
  setPatientView = () => {},
  setEmployeeView = () => {},
  watch,
  setValue,
  control,
  errors
}) => {
  // States
  const { show, hideAll } = useContextMenu()
  const user = useUser()
  const dateRef = useRef()
  const [key, setKey] = useState(new Date())
  const [domSet, setDom] = useState(null)
  const [height, setHeight] = useState('100%')
  const [refresh, setRefresh] = useState([])
  const [template, setTemplate] = useState([])
  const [templateNew, setTemplateNew] = useState(null)
  const [shiftNew, setShiftNew] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [shiftOptions, setShift] = useState([])
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
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [contextMenuData, setContextMenuData] = useState(null)
  const [availableSchedules, setAvailableSchedules] = useState([])
  const [addedEmployees, setAddedEmployees] = useState(null)
  const [addedPatients, setAddedPatients] = useState(null)
  const [loadedDates, setLoadedDates] = useState([])
  const [lastSelectedDate, setLastSelectedDate] = useState(formatDate(new Date()))
  const [dataSets, setDataSets] = useState(null)
  const [weeks, setWeek] = useState(1)
  const [copyModal, showCopyModal] = useState(false)
  const [cSelected, setCSelected] = useState([])
  const [dSelected, setDSelected] = useState([])
  const [selectType, setSelectType] = useState(null)
  const [leaves, setLeaves] = useState([])
  const [leaveData, setLeaveData] = useState(null)
  const [selectedDates, setSelectedDates] = useState([])

  const onCheckboxBtnClick = (selected) => {
    const index = cSelected.indexOf(selected)
    if (index < 0) {
      cSelected.push(selected)
    } else {
      cSelected.splice(index, 1)
    }
    setCSelected([...cSelected])
  }

  // Dropdown
  const loadShiftOption = async (search, loadedOptions, { page }) => {
    if (isValid(watch('shift_type'))) {
      const res = await loadWorkShift({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, shift_type: watch('shift_type') }
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
    if (isValid(user)) {
      const res = await getUsersDropdown({
        async: true,
        page,
        perPage: 100,
        jsonData: {
          name: search,
          branch_id: user?.user_type_id === UserTypes?.company ? user?.id : null,
          user_type_id: UserTypes.employee,
          employee_type: watch('employee_type')
        }
      })
      return createAsyncSelectOptions(res, page, 'name', null, setEmployee, (x) => {
        return decryptObject(forDecryption, x)
      })
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  const loadTemplateOptions = async (search, loadedOptions, { page }) => {
    const res = await loadScTemplate({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, hide_deactivated: 'yes' }
    })
    return createAsyncSelectOptions(res, page, 'title', null, setTemplate)
  }

  useEffect(() => {
    if (isValid(watch('shift_id'))) {
      const id = watch('shift_id')
      const s = shiftOptions.find((a) => a.value.id === id)
      setWorkShiftView(s?.value)
    } else {
      setWorkShiftView(null)
    }
  }, [watch('shift_id')])

  useEffect(() => {
    if (isValid(patient)) {
      let assigned_hours_per_month = 0
      let assigned_hours_per_week = 0
      let assigned_hours_per_day = 0
      let assigned_hours = 0
      fastLoop(patient?.agency_hours, (h, i) => {
        assigned_hours_per_month += Number(h?.assigned_hours_per_month)
        assigned_hours_per_week += Number(h?.assigned_hours_per_week)
        assigned_hours_per_day += Number(h?.assigned_hours_per_day)
        assigned_hours += Number(h?.assigned_hours)
      })
      setPatientHours({
        assigned_hours: assigned_hours * 60,
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
    setEmployeeView(empView)
  }, [empView])

  useEffect(() => {
    setPatientHour(patientHours)
  }, [patientHours])

  useEffect(() => {
    setPatientView(patient)
  }, [patient])

  useEffect(() => {
    if (isValid(templateId)) {
      setValue('schedule_template_id', templateId)
    }
  }, [templateId])

  useEffect(() => {
    if (isValid(templateNew)) {
      setValue('schedule_template_id', templateNew?.id)
    }
  }, [templateNew])

  useEffect(() => {
    if (isValid(shiftNew)) {
      setValue('shift_id', shiftNew?.id)
      setValue(
        'shift_start_time',
        isValid(shiftNew?.shift_start_time) ? shiftNew?.shift_start_time : null
      )
      setValue(
        'shift_end_time',
        isValid(shiftNew?.shift_end_time) ? shiftNew?.shift_end_time : null
      )
      setValue(
        'rest_start_time',
        isValid(shiftNew?.rest_start_time) ? shiftNew?.rest_start_time : null
      )
      setValue('rest_end_time', isValid(shiftNew?.rest_end_time) ? shiftNew?.rest_end_time : null)
      // setValue("shift_type", shiftNew?.shift_type)
    }
  }, [shiftNew])

  useEffect(() => {
    if (isValid(watch('user_id'))) {
      const id = watch('user_id')
      const s = employee.find((a) => a.value.id === id)
      setEmpView({
        ...s?.value,
        assigned_work: {
          ...s?.value?.assigned_work,
          // assigned_working_hour_per_week: Math.floor(),
          actual_working_hours_per_week_in_min: Math.floor(
            s?.value?.assigned_work?.assigned_working_hour_per_week *
              (s?.value?.assigned_work?.working_percent / 100) *
              60
          )
        }
      })
    } else {
      setEmpView(null)
    }
  }, [watch('user_id')])

  useEffect(() => {
    setEmpView(null)
    setValue('user_id', null)
  }, [watch('employee_type')])

  useEffect(() => {
    if (isValid(shiftView)) {
      setValue(
        'shift_start_time',
        isValid(shiftView?.shift_start_time) ? shiftView?.shift_start_time : null
      )
      setValue(
        'shift_end_time',
        isValid(shiftView?.shift_end_time) ? shiftView?.shift_end_time : null
      )
      setValue(
        'rest_start_time',
        isValid(shiftView?.rest_start_time) ? shiftView?.rest_start_time : null
      )
      setValue('rest_end_time', isValid(shiftView?.rest_end_time) ? shiftView?.rest_end_time : null)
    } else {
      setValue('shift_start_time', null)
      setValue('shift_end_time', null)
      setValue('rest_start_time', null)
      setValue('rest_end_time', null)
    }
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
      // start observing the DOM node
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

  const loadPatientOption = async (search, loadedOptions, { page }) => {
    if (isValid(user)) {
      const res = await getUsersDropdown({
        async: true,
        page,
        perPage: 100,
        jsonData: {
          name: search,
          branch_id:
            user?.user_type_id === UserTypes?.branch
              ? user?.id
              : user?.user_type_id === UserTypes.company
              ? user?.branch_id
              : user?.top_most_parent?.id,
          user_type_id: UserTypes.patient
        }
        // jsonData: { name: search, branch_id: user?.user_type_id === UserTypes?.company ? user?.id : isValid(user?.branch_id) ? user?.branch_id : user?.top_most_parent?.id, user_type_id: UserTypes.patient }
      })
      return createAsyncSelectOptions(res, page, 'name', null, setPatients, (x) => {
        return decryptObject(forDecryption, x)
      })
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  const loadLeaves = (month) => {
    if (isValid(watch('user_id'))) {
      const currentCalMonth = dateRef.current?.flatpickr?.currentMonth
      const currentMonth = moment().month()
      const startOfMonth =
        currentMonth === currentCalMonth
          ? formatDate(new Date(), 'YYYY-MM-DD')
          : moment().month(month).startOf('month').toDate()
      const endOfMonth = moment().month(month).endOf('month').toDate()
      loadLeave({
        jsonData: {
          start_date: formatDate(startOfMonth),
          end_date: formatDate(endOfMonth),
          emp_id: watch('user_id'),
          leave_approved: 'yes',
          leave_group_id: 'yes'
        },
        loading: setLoadingDetails,
        success: (e) => {
          if (isValidArray(e?.payload)) {
            const leaves = []
            fastLoop(e?.payload, (group, index) => {
              const l = group?.leaves?.map((a) => a.shift_date)
              leaves.push(...l)
            })
            setLeaveData({
              ...leaveData,
              [watch('user_id')]: leaves
            })
            setLeaves(leaves)
          } else {
            setLeaves([])
          }
        }
      })
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

  useEffect(() => {
    if (isValidArray(patients)) {
      setPatient(patients?.find((a) => a.value.id === watch('patient_id'))?.value)
    } else {
      setPatient(null)
    }
  }, [watch('patient_id')])

  const isShitValid = (start, end, shifts = [], employee_id = null, patient_id = null) => {
    // log("isShitValid")
    let message = 'invalid-shift-start-end-time'
    const re = shifts.find((d) => {
      const s = new Date(d?.shift_start_time).getTime()
      const e = new Date(d?.shift_end_time).getTime()
      log(d?.shift_start_time, d?.shift_end_time, s, e, start, end)
      let re = false
      if (s === start && e === end) {
        log('case 1')
        re = true
      } else if (start >= s && start < e) {
        log('case 2')
        re = true
      } else if (end > s && end <= e) {
        log('case 3')
        re = true
      }
      if (re) {
        if (isValid(employee_id)) {
          if (d?.employee_id === employee_id) {
            re = true
            message = 'schedule-with-same-time-and-employee'
          } else {
            re = false
          }
        }
      }
      return re
    })
    if (isValid(re)) {
      WarningToast(message)
    }
    return !isValid(re)
  }

  function loadPatientData() {
    if (isValid(patient?.id) && patient?.id > 0 && isValid(watch('schedule_template_id'))) {
      const sa = isValid(dataSets)
        ? isValidArray(dataSets[patient?.id])
          ? dataSets[patient?.id]
          : []
        : []

      const found = sa.find(
        (a) =>
          new Date(lastSelectedDate) >= a.start_date && new Date(lastSelectedDate) <= a.end_date
      )

      if (!isValid(found)) {
        loadScheduleDataPatient({
          jsonData: {
            date: lastSelectedDate,
            patient_id: patient?.id,
            schedule_template_id: watch('schedule_template_id')
          },
          success: (d) => {
            const p = {}
            for (const key in d) {
              p[key] = {
                ...d[key],
                remaining_hours: d[key]?.patient_assigned_hours - d[key]?.patient_completed_hours
              }
            }
            setAddedPatients({
              ...addedPatients,
              ...p
            })
          },
          error: () => {}
        })
        // }
      }
    }
  }

  function loadTemplateData() {
    if (isValid(empView?.id) && empView?.id > 0 && isValid(watch('schedule_template_id'))) {
      const sa = isValid(dataSets)
        ? isValidArray(dataSets[empView?.id])
          ? dataSets[empView?.id]
          : []
        : []

      const found = sa.find(
        (a) =>
          new Date(lastSelectedDate) >= a.start_date && new Date(lastSelectedDate) <= a.end_date
      )

      if (!isValid(found)) {
        loadScheduleData({
          jsonData: {
            date: lastSelectedDate,
            user_id: empView?.id,
            schedule_template_id: watch('schedule_template_id')
          },
          success: (d) => {
            const dataSet = []

            if (isValidArray(d)) {
              const data = d[0]
              const dSet = data?.data_sets
              const id = data?.id
              const name = data?.name

              if (isValidArray(dSet)) {
                fastLoop(dSet, (data, index) => {
                  if (!isValid(sa?.find((a) => a.id === data?.id))) {
                    dataSet.push({
                      id,
                      name,
                      ...data,
                      start_date: new Date(data?.start_date),
                      end_date: new Date(data?.end_date),
                      assigned_hours: data?.assigned_hours,
                      remaining_hours: data?.remaining_hours,
                      scheduled_hours: data?.scheduled_hours,
                      assigned_hours_week: Math.floor(data?.assigned_hours / 4),
                      remaining_hours_week: Math.floor(data?.assigned_hours / 4)
                    })
                  }
                })
              } else {
                dataSet.push({
                  start_date: new Date(`${empView?.joining_date} 00:00:00`),
                  end_date: new Date(addDay(new Date(`${empView?.joining_date} 00:00:00`), 27)),
                  assigned_hours: empView?.assigned_work?.actual_working_hours_per_week_in_min * 4,
                  remaining_hours: empView?.assigned_work?.actual_working_hours_per_week_in_min * 4,
                  assigned_hours_week: empView?.assigned_work?.actual_working_hours_per_week_in_min,
                  remaining_hours_week:
                    empView?.assigned_work?.actual_working_hours_per_week_in_min,
                  scheduled_hours: 0
                })
              }
            } else {
              dataSet.push({
                start_date: new Date(`${empView?.joining_date} 00:00:00`),
                end_date: new Date(addDay(new Date(`${empView?.joining_date} 00:00:00`), 27)),
                assigned_hours: empView?.assigned_work?.actual_working_hours_per_week_in_min * 4,
                remaining_hours: empView?.assigned_work?.actual_working_hours_per_week_in_min * 4,
                assigned_hours_week: empView?.assigned_work?.actual_working_hours_per_week_in_min,
                remaining_hours_week: empView?.assigned_work?.actual_working_hours_per_week_in_min,
                scheduled_hours: 0
              })
            }
            if (isValidArray(dataSet)) {
              setDataSets({
                ...dataSets,
                [empView?.id]: [...sa, ...dataSet]
              })
            }
          },
          error: () => {}
        })
        // }
      }
    }
  }

  function loadAllPatientData(lastSelectedDate) {
    if (isValid(watch('schedule_template_id'))) {
      loadScheduleDataPatient({
        jsonData: {
          date: lastSelectedDate,
          schedule_template_id: watch('schedule_template_id')
        },
        success: (d) => {
          const p = {}
          for (const key in d) {
            p[key] = {
              ...d[key],
              remaining_hours: d[key]?.patient_assigned_hours - d[key]?.patient_completed_hours
            }
          }
          setAddedPatients({
            ...addedPatients,
            ...p
          })
        },
        error: () => {}
      })
      // }
    }
  }

  function loadAllEmployeeData(lastSelectedDate) {
    if (isValid(watch('schedule_template_id'))) {
      loadScheduleData({
        jsonData: {
          date: lastSelectedDate,
          schedule_template_id: watch('schedule_template_id')
        },
        success: (d) => {
          if (isValidArray(d)) {
            const data = d
            const dataSetUser = {}
            const added = {}

            fastLoop(data, (user, uIndex) => {
              const dSet = user?.data_sets
              const id = user?.id
              const name = user?.name
              const dataSet = []

              if (isValidArray(dSet)) {
                fastLoop(dSet, (data, index) => {
                  dataSet.push({
                    id,
                    name,
                    ...data,
                    start_date: new Date(data?.start_date),
                    end_date: new Date(data?.end_date),
                    assigned_hours: data?.assigned_hours,
                    remaining_hours: data?.remaining_hours,
                    scheduled_hours: data?.scheduled_hours,
                    assigned_hours_week: Math.floor(data?.assigned_hours / 4),
                    remaining_hours_week: Math.floor(data?.remaining_hours / 4)
                  })
                  added[id] = {
                    id,
                    name,
                    assigned_work: {
                      actual_working_hours_per_week_in_min: Math.floor(data?.assigned_hours / 4)
                    }
                  }
                })
                dataSetUser[id] = dataSet
              }
            })
            setDataSets({
              ...dataSets,
              ...dataSetUser
            })
            setAddedEmployees({
              ...addedEmployees,
              ...added
            })
          }
        },
        error: () => {}
      })
      // }
    }
  }

  const calculateHours = () => {
    const remainingHours = {}
    const remainingHoursPatient = {}
    const lastShift = {}
    const endOfWeek = {}
    const hourLimit = {}
    const emergencyHours = {}
    const lastLimitShift = {}
    const allDates = dates
    // log("calculating hours")

    fastLoop(allDates, (schedule, index) => {
      const schedules = []
      const date = new Date(schedule?.date)

      // log("calculating date", date)

      fastLoop(schedule?.shifts, (shift, i) => {
        const user = shift?.employee_id
        const patient = shift?.patient_id

        // log("calculating user", user)

        if (isValid(user) && isValid(dataSets)) {
          const sets = isValidArray(dataSets[user]) ? dataSets[user] : []

          if (isValid(sets)) {
            const found = sets.find((a) => date >= a.start_date && date <= a.end_date)

            if (isValid(found) && user === found?.emp_id) {
              const diff = getExactTime(shift?.shift_end_time, shift?.shift_start_time)
              const restDiff = getExactTime(shift?.rest_end_time ?? 0, shift?.rest_start_time ?? 0)
              // log("rrestdiff", restDiff)
              const actualRemainingHours = found?.assigned_hours_week // value in minutes
              const actualRemainingHoursPatient = addedPatients?.hasOwnProperty(shift?.patient_id)
                ? addedPatients[shift?.patient_id]?.remaining_hours
                : null // value in minutes

              const previousShift2 = lastLimitShift?.hasOwnProperty(user)
                ? lastLimitShift[user]
                : null
              const nextShift2 = previousShift2
                ? getExactTime(shift?.shift_start_time, previousShift2)
                : null

              const _7thDay = getFirstAndLast(schedule?.date)?.lastDay // reset on monday
              // const _7thDay = addDay(schedule?.date, 6) // reset on 7th day
              let shiftMinutes = diff.minutesTotal - restDiff.minutesTotal

              if (hourLimit?.hasOwnProperty(user)) {
                hourLimit[user] = hourLimit[user] + shiftMinutes
              } else {
                hourLimit[user] = shiftMinutes
              }

              if (
                shift?.shift?.shift_type === ShiftType.emergency ||
                shift?.shift?.shift_type === ShiftType.SleepingEmergency
              ) {
                if (emergencyHours?.hasOwnProperty(user)) {
                  emergencyHours[user] = emergencyHours[user] + shiftMinutes
                } else {
                  emergencyHours[user] = shiftMinutes
                }
              }
              if (endOfWeek?.hasOwnProperty(user)) {
                const lastWeek = endOfWeek[user]
                if (date?.getTime() > lastWeek?.getTime()) {
                  endOfWeek[user] = new Date(_7thDay)
                  remainingHours[user] = actualRemainingHours
                  // remainingHoursPatient[user] = actualRemainingHoursPatient
                  emergencyHours[user] = shiftMinutes
                  hourLimit[user] = shiftMinutes
                  delete lastLimitShift[user]
                }
              } else {
                endOfWeek[user] = new Date(_7thDay)
              }

              // let minusEm = 0
              const emergency = emergencyHours?.hasOwnProperty(user)
                ? emergencyHours[user]
                : shift?.shift?.shift_type === ShiftType.emergency ||
                  shift?.shift?.shift_type === ShiftType.SleepingEmergency
                ? diff.minutesTotal - restDiff.minutesTotal
                : null
              if (shift?.shift?.shift_type === ShiftType.SleepingEmergency) {
                shiftMinutes = shiftMinutes - emergency
                hourLimit[user] = hourLimit[user] - emergency
              }
              const previousRemainingMinutes = remainingHours?.hasOwnProperty(user)
                ? remainingHours[user]
                : actualRemainingHours
              const remainingMinutes = previousRemainingMinutes - shiftMinutes

              const previousRemainingMinutesPatient = remainingHoursPatient?.hasOwnProperty(patient)
                ? remainingHoursPatient[patient]
                : actualRemainingHoursPatient
              const remainingMinutesPatient = previousRemainingMinutesPatient - shiftMinutes

              const previousShift = lastShift?.hasOwnProperty(user) ? lastShift[user] : null
              const nextShift = previousShift
                ? getExactTime(shift?.shift_start_time, previousShift)
                : null

              const total = hourLimit?.hasOwnProperty(user) ? hourLimit[user] : shiftMinutes

              remainingHours[user] = remainingMinutes
              remainingHoursPatient[patient] = remainingMinutesPatient
              lastShift[user] = shift?.shift_end_time

              const previousEndOfWeek = endOfWeek?.hasOwnProperty(user)
                ? endOfWeek[user]
                : new Date(_7thDay)

              if (hourLimit?.hasOwnProperty(user)) {
                if (hourLimit[user] > 2400 || hourLimit[user] === 2400) {
                  if (!lastLimitShift?.hasOwnProperty(user)) {
                    lastLimitShift[user] = shift?.shift_end_time
                  }
                }
              }

              shift.totalMinutes = total
              shift.remaining_minutes_till_date_employee = remainingMinutes
              shift.remaining_minutes_till_date_patient = remainingMinutesPatient
              shift.rest_between_next_shift = nextShift
              shift.rest_between_next_shift2 = nextShift2
              shift.end_of_week = previousEndOfWeek
              shift.emergency_minutes = emergency
              shift.extra_hours = remainingMinutes < 0 ? remainingMinutes : 0
              shift._7thDay = new Date(_7thDay)
              shift.schedule_type = remainingMinutes < 0 ? 'extra' : shift.schedule_type
              // shift.type = (remainingMinutes < 0)
            }
          }
        }
        schedules[i] = shift
      })
      allDates[index] = {
        date: schedule?.date,
        shifts: schedules
      }
    })
    log('endOfWeek', endOfWeek)
    log('lastLimitShift', lastLimitShift)
    // log("lastShift", lastShift)
    // log("allDates", allDates)
    setDates([...allDates])
  }

  useEffect(() => {
    calculateHours()
  }, [lastUpdated, dataSets, addedEmployees, addedPatients])

  const loadSchedules = (month) => {
    log('loaded at', new Date(), month)
    const currentCalMonth = dateRef.current?.flatpickr?.currentMonth
    const currentMonth = moment().month()
    const startOfMonth =
      currentMonth === currentCalMonth
        ? formatDate(new Date(), 'YYYY-MM-DD')
        : moment().month(month).startOf('month').toDate()
    const endOfMonth = moment().month(month).endOf('month').toDate()
    const monthLoaded = isValid(
      loadedDates.find(
        (a) =>
          a.shift_start_date === formatDate(startOfMonth) &&
          a.shift_end_date === formatDate(endOfMonth)
      )
    )

    if (
      isValid(startOfMonth) &&
      isValid(endOfMonth) &&
      isValid(watch('schedule_template_id')) &&
      !monthLoaded
    ) {
      loadScheduleList({
        jsonData: {
          shift_start_date: formatDate(startOfMonth),
          shift_end_date: formatDate(endOfMonth),
          schedule_template_id: watch('schedule_template_id')
        },
        loading: setLoadingDetails,
        success: (e) => {
          setLoadedDates([
            ...loadedDates,
            {
              shift_start_date: formatDate(startOfMonth),
              shift_end_date: formatDate(endOfMonth)
            }
          ])
          if (isValidArray(e?.payload)) {
            const sch = e?.payload
            const reSchedule = []
            const disabledDates = []
            // log(sch, "sch")
            fastLoop(sch, (shift, i) => {
              if (shift?.leave_applied === 1) {
                disabledDates.push(new Date(shift.shift_date))
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
                        shift_id: shift?.shift_id ?? null,
                        shift_start_time: shift?.shift_start_time,
                        shift_end_time: shift?.shift_end_time,
                        rest_start_time: shift?.rest_start_time,
                        rest_end_time: shift?.rest_end_time,
                        schedule_type: shift?.schedule_type,
                        employee_id: shift?.user_id,
                        leave_approved: shift?.leave_approved,
                        employee: {
                          ...shift?.user
                        },
                        patient_id: shift?.patient_id,
                        patient: shift?.patient
                        // ...shift
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
                        shift_id: shift?.shift_id ?? null,
                        shift_start_time: shift?.shift_start_time,
                        shift_end_time: shift?.shift_end_time,
                        schedule_type: shift?.schedule_type,
                        rest_start_time: shift?.rest_start_time,
                        rest_end_time: shift?.rest_end_time,
                        employee_id: shift?.user_id,
                        leave_approved: shift?.leave_approved,
                        employee: {
                          ...shift?.user
                        },
                        patient_id: shift?.patient_id,
                        patient: shift?.patient
                        // ...shift
                      }
                    ]
                  })
                }
              }
            })
            const finalSorted = []
            const date = [...selectedDates]
            fastLoop(reSchedule, (d, i) => {
              if (new Date(d?.date) > new Date()) {
                const a = d?.shifts.sort((a, b) => {
                  return new Date(a?.shift_start_time) - new Date(b.shift_start_time)
                })
                finalSorted.push({
                  ...d,
                  shifts: a.map((a, i) => ({ ...a, index: i }))
                })
                date.push(new Date(d?.date))
              }
            })
            date?.sort((a, b) => {
              return a - b
            })
            finalSorted?.sort((a, b) => {
              return new Date(a?.date) - new Date(b.date)
            })
            if (isValidArray(date)) {
              dateRef.current?.flatpickr?.setDate(date)
              setSelectedDates(date)
            }
            log('updating,', finalSorted)
            setDates([...dates, ...finalSorted])
            setValue('shift_dates', date)
            setAvailableSchedules([...dates, ...finalSorted])
            loadAllEmployeeData(formatDate(startOfMonth))
            loadAllPatientData(formatDate(startOfMonth))
          } else {
            // WarningToast("no-schedules-this-month")
            // sd
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
    loadTemplateData()
  }, [watch('schedule_template_id'), empView?.id, lastSelectedDate])

  useEffect(() => {
    if (dateRef.current?.flatpickr?.currentMonth) {
      loadLeaves(dateRef.current?.flatpickr?.currentMonth)
    }
  }, [dateRef.current?.flatpickr?.currentMonth, empView?.id])

  useEffect(() => {
    loadPatientData()
  }, [watch('schedule_template_id'), patient?.id, lastSelectedDate])

  useEffect(() => {
    if (dateRef.current?.flatpickr?.currentMonth) {
      loadSchedules(dateRef.current?.flatpickr?.currentMonth)
    }
  }, [dateRef.current?.flatpickr?.currentMonth, watch('schedule_template_id')])

  // const updateOldDate = (date, type, i = -1) => {
  //     if (isValid(date)) {
  //         const index = dates.findIndex(a => a.date === date?.date)
  //         if (index !== -1) {
  //             const d = dates
  //             const shift = d[index]
  //             let shifts = shift?.shifts
  //             if (i > -1) {
  //                 shifts[i] = {
  //                     ...shifts[i],
  //                     type
  //                 }
  //             } else {
  //                 shifts = shifts?.filter(a => {
  //                     if (isValid(a?.schedule_id)) {
  //                         return true
  //                     }
  //                 })?.map(a => ({ ...a, type }))
  //                 // shifts = shifts.filter(a => isValid(a.schedule_id) && a.type === "deleted")
  //             }
  //             d[index] = {
  //                 ...d[index],
  //                 type,
  //                 shifts
  //             }
  //             log("updateOldDate", d)
  //             const dts = isValidArray(datesDeleted[date?.date]) ? datesDeleted[date?.date] : []
  //             const dt = [
  //                 ...dts,
  //                 ...shifts
  //             ]
  //             const filteredArr = dt.reduce((acc, current) => {
  //                 const x = acc.find(item => item.schedule_id === current.schedule_id)
  //                 if (!x) {
  //                     return acc.concat([current])
  //                 } else {
  //                     return acc
  //                 }
  //             }, [])
  //             setDatesDeleted({
  //                 ...datesDeleted,
  //                 [date?.date]: filteredArr
  //             })
  //             // setDates([...d])
  //         }
  //     }
  // }

  const sortShifts = (date, shifts, more = false) => {
    const re = shifts
    log('sortShifts', shifts, more)
    let endRest = isValid(watch('rest_end_time'))
      ? `${formatDate(date, 'YYYY-MM-DD')} ${watch('rest_end_time')}`
      : null
    const startRest = isValid(watch('rest_start_time'))
      ? `${formatDate(date, 'YYYY-MM-DD')} ${watch('rest_start_time')}`
      : null

    let end = isValid(watch('shift_end_time'))
      ? `${formatDate(date, 'YYYY-MM-DD')} ${watch('shift_end_time')}`
      : null
    const start = isValid(watch('shift_start_time'))
      ? `${formatDate(date, 'YYYY-MM-DD')} ${watch('shift_start_time')}`
      : null
    if (new Date(end).getTime() <= new Date(start)) {
      end = isValid(watch('shift_end_time'))
        ? `${formatDate(addDay(date, 1), 'YYYY-MM-DD')} ${watch('shift_end_time')}`
        : null
    }
    if (new Date(endRest).getTime() <= new Date(startRest)) {
      endRest = isValid(watch('rest_end_time'))
        ? `${formatDate(addDay(date, 1), 'YYYY-MM-DD')} ${watch('rest_end_time')}`
        : null
    }
    const isInvalidEmp = new Date(`${empView?.joining_date} 00:00:00`) > date

    const patient_id = watch('patient_id')
    const employee_id = isInvalidEmp ? null : watch('user_id')
    const shift = shiftOptions?.find((a) => a.value?.id === watch('shift_id'))?.value

    const currentShift = shift?.id
      ? {
          id: shift?.id,
          shift_name: shift?.shift_name,
          shift_type: shift?.shift_type,
          shift_color: shift?.shift_color
        }
      : null

    // patient
    const pat = patients.find((s) => s.value?.id === patient_id)?.value
    const patData = {
      user_type_id: pat?.user_type_id,
      id: pat?.id,
      gender: pat?.gender,
      name: pat?.name,
      branch: { id: pat?.branch?.id, name: pat?.branch?.name }
    }

    // Employee
    const emp = employee.find((s) => s.value?.id === employee_id)?.value
    const empData = isInvalidEmp
      ? null
      : {
          user_type_id: emp?.user_type_id,
          id: emp?.id,
          gender: emp?.gender,
          name: emp?.name,
          branch: { id: emp?.branch?.id, name: emp?.branch?.name }
        }

    if (isValidArray(shifts)) {
      const shiftExists = shifts?.find(
        (a) => a.shift_start_time === null && a.shift_end_time === null && a.type !== 'delete'
      )

      if (isValid(shiftExists)) {
        // update if shift is null
        re.push({
          type: 'update',
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
          rest_end_time: shiftExists?.rest_end_time ? shiftExists?.rest_end_time : endRest,
          rest_start_time: shiftExists?.rest_start_time ? shiftExists?.rest_start_time : startRest,
          schedule_type: 'basic',
          patient_id,
          patient: patData,
          employee_id,
          employee: empData
        })
      } else {
        // add more shift
        const ex = shifts?.find((a) => a.type !== 'delete')
        more = more ? more : !isValid(ex)
        const isVal =
          singleLiving || homeLiving
            ? isValid(
                shifts?.find((shift, index) => {
                  if (
                    shift.shift_start_time === start &&
                    shift?.shift_end_time === end &&
                    shift?.employee_id === employee_id
                  ) {
                    return true
                  }
                })
              )
            : false

        if (
          isValid(end) &&
          isValid(start) &&
          more &&
          !isVal &&
          isShitValid(
            new Date(start).getTime(),
            new Date(end).getTime(),
            shifts?.filter((a) => a.type !== 'delete'),
            employee_id
          )
        ) {
          re.push({
            type: 'add',
            shift: currentShift ?? null,
            shift_id: currentShift?.id ?? null,
            shift_start_time: start,
            shift_end_time: end,
            rest_end_time: endRest,
            rest_start_time: startRest,
            schedule_type: 'basic',
            patient_id,
            patient: patData,
            employee_id,
            employee: empData
          })
        } else {
          if (isVal) {
            WarningToast('schedule-with-same-time-and-employee')
          }
        }
      }
    } else {
      // add new shift
      const diff = getExactTime(start, end)

      if (diff?.minutesTotal < 30) {
        WarningToast('please-make-at-lease-30-min-shift')
        return
      }
      if (isValid(end) && isValid(start)) {
        re.push({
          type: 'add',
          shift: currentShift ?? null,
          shift_id: currentShift?.id ?? null,
          shift_start_time: start,
          shift_end_time: end,
          rest_end_time: endRest,
          rest_start_time: startRest,
          schedule_type: 'basic',
          patient_id,
          patient: patData,
          employee_id,
          employee: empData
        })
      }
    }
    re.sort((a, b) => {
      return new Date(a?.shift_start_time) - new Date(b.shift_start_time)
    })
    const er = re.map((a, i) => ({ ...a, index: i }))
    if (isValid(emp)) {
      setAddedEmployees({
        ...addedEmployees,
        [employee_id]: {
          ...emp,
          assigned_work: {
            ...emp?.assigned_work,
            actual_working_hours_per_week_in_min: Math.floor(
              emp?.assigned_work?.assigned_working_hour_per_week *
                (emp?.assigned_work?.working_percent / 100) *
                60
            )
          }
        }
      })
    }
    log('sortShifts', er)
    setLastUpdated(new Date())
    return er
  }

  // methods
  const sortDates = (data) => {
    const validTime = isValid(watch('shift_end_time')) && isValid(watch('shift_start_time'))
    const d = isValidArray(data) ? data?.map((a) => formatDate(a)) : []

    const lastDate = dateRef.current?.flatpickr?.latestSelectedDateObj ?? null
    const selected = [...dates]
    log('last date', lastDate)
    log('dates', data)

    if (isValid(lastDate)) {
      // check if date is already exists
      const exists = dates.findIndex((a) => a.date === formatDate(lastDate))
      if (exists !== -1) {
        // update date
        const date = dates[exists]
        const isPreserved = isValid(availableSchedules.find((a) => a.date === date?.date))

        log('sortDates exists date', date)
        log('sortDates isPreserved', availableSchedules)

        if (isPreserved) {
          log('sortDates isPreserved', isPreserved)

          if (d?.includes(formatDate(lastDate))) {
            // update
            selected[exists] = {
              date: formatDate(lastDate, 'YYYY-MM-DD'),
              shifts: sortShifts(lastDate, date?.shifts),
              type: 'update'
            }
            log('sortDates update')
          } else {
            if (isValidArray(data)) {
              // delete
              const shifts = date?.shifts
                ?.filter((a) => {
                  if (isValid(a?.schedule_id)) {
                    return true
                  }
                })
                ?.map((a) => ({ ...a, type: 'delete' }))

              selected[exists] = {
                date: formatDate(lastDate, 'YYYY-MM-DD'),
                shifts,
                type: 'delete'
              }
              log('sortDates delete')
            }
          }
        } else {
          // remove
          if (!d?.includes(formatDate(lastDate))) {
            selected.splice(exists, 1)
            log('sortDates remove', lastDate, data?.includes(lastDate))
          }
        }
      } else {
        // add date
        if (isValidArray(data) && validTime) {
          selected.push({
            date: formatDate(lastDate, 'YYYY-MM-DD'),
            shifts: sortShifts(lastDate, []),
            type: 'add'
          })
          log('sortDates add')
          const w = getWeeksDiff(new Date(), lastDate)
          setWeek(w > weeks ? w : weeks)
        } else {
          log('sortDates add not valid')
        }
      }
    }
    selected.sort((a, b) => {
      return new Date(a?.date) - new Date(b.date)
    })
    log('sortDates', selected)
    setDates([...selected])
    setLastUpdated(new Date())
  }

  // hook
  useEffect(() => {
    // if (isValid(watch('shift_start_time')) && isValid(watch('shift_end_time'))) {
    sortDates(watch('shift_dates'))
    // }
  }, [watch('shift_dates')?.length, watch('shift_start_time'), watch('shift_end_time')])

  // render methods

  const addMoreShift = (date) => {
    if (isValid(date)) {
      const index = dates.findIndex((a) => a.date === date?.date)
      if (index !== -1) {
        const d = [...dates]
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

  const removeShift = (date, i) => {
    if (isValid(date)) {
      const index = dates.findIndex((a) => a.date === date?.date)
      if (index !== -1) {
        const d = [...dates]
        const shift = d[index]
        const shifts = shift?.shifts
        const thisShift = shifts[i]
        if (isValid(thisShift?.schedule_id)) {
          // mark as delete
          shifts[i] = {
            ...shifts[i],
            type: 'delete'
          }
        } else {
          // delete
          shifts?.splice(i, 1)
        }
        d[index] = {
          ...d[index],
          shifts
        }
        log('remove', i, shifts)
        setDates([...d])
      }
    }
  }
  const addPatientAndEmployee = (date, i, type = 'add', userType = null) => {
    log('addBoth', date, i, type, userType)
    if (isValid(date)) {
      const index = dates.findIndex((a) => a.date === date?.date)
      const patient_id = watch('patient_id')
      const employee_id = watch('user_id')

      if (index !== -1) {
        const d = [...dates]
        const shift = d[index]
        const shifts = shift?.shifts
        const currentShift = shifts[i]
        let newData = null
        // Patient
        const pat = patients.find((s) => s.value?.id === patient_id)?.value
        const patData = {
          user_type_id: pat?.user_type_id,
          id: pat?.id,
          gender: pat?.gender,
          name: pat?.name,
          branch: { id: pat?.branch?.id, name: pat?.branch?.name }
        }

        // const patAdded = isValid(shifts?.find(a => (
        //     a.patient_id === patient_id &&
        //     a.shift_end_time === shifts[i]?.shift_end_time &&
        //     a.shift_start_time === shifts[i]?.shift_start_time
        // )))

        // Employee
        const emp = employee.find((s) => s.value?.id === employee_id)?.value
        const empData = {
          user_type_id: emp?.user_type_id,
          id: emp?.id,
          gender: emp?.gender,
          name: emp?.name,
          branch: { id: emp?.branch?.id, name: emp?.branch?.name }
        }

        // const empAdded = isValid(shifts?.find(a => (
        //     a.employee_id === employee_id &&
        //     a.shift_end_time === shifts[i]?.shift_end_time &&
        //     a.shift_start_time === shifts[i]?.shift_start_time
        // )))
        // validate patient and employee
        const dup = []
        fastLoop(shifts, (shift) => {
          if (
            new Date(shift.shift_start_time).getTime() ===
              new Date(currentShift?.shift_start_time).getTime() &&
            new Date(shift?.shift_end_time).getTime() ===
              new Date(currentShift?.shift_end_time).getTime() &&
            shift?.employee_id === employee_id
          ) {
            dup.push(shift)
          } else {
          }
        })

        // case 1 - patient and employee and time must no be same in the array
        if (
          (userType === 'employee' || userType === null) &&
          type !== 'remove' &&
          isValidArray(dup)
        ) {
          WarningToast('schedule-with-same-time-and-employee')
          return
        }

        if (type === 'add') {
          if (userType === null) {
            // add both employee and patient
            log('add employee and patient')
            newData = {
              ...currentShift,
              ...newData,
              type: 'add',
              patient_id,
              patient: patData,
              employee_id,
              employee: empData
            }
          } else if (userType === 'patient') {
            log('add patient')
            newData = {
              ...currentShift,
              ...newData,
              patient_id,
              type: 'add',
              patient: patData,
              employee_id: null,
              employee: null
            }
          } else if (userType === 'employee') {
            log('add employee')
            newData = {
              ...currentShift,
              ...newData,
              type: 'add',
              patient_id: null,
              patient: null,
              employee_id,
              employee: empData
            }
          }
        } else if (type === 'remove') {
          if (userType === null) {
            // remove both employee and patient
            log('remove patient and employee')
            shifts[i] = {
              ...currentShift,
              type: 'delete',
              employee_id: null,
              employee: null,
              patient_id: null,
              patient: null
            }
          } else if (userType === 'patient') {
            // remove patient
            log('remove patient')
            shifts[i] = {
              ...currentShift,
              type: 'delete',
              employee_id: currentShift?.employee_id ? currentShift?.employee_id : null,
              employee: currentShift?.employee ? currentShift?.employee : null,
              patient_id: null,
              patient: null
            }
          } else if (userType === 'employee') {
            // remove employee
            log('remove employee')
            shifts[i] = {
              ...currentShift,
              type: 'delete',
              patient_id: currentShift?.patient_id ? currentShift?.patient_id : null,
              patient: currentShift?.patient ? currentShift?.patient : null,
              employee_id: null,
              employee: null
            }
          }
        } else if (type === 'replace') {
          if (userType === null) {
            // replace both employee and patient
            log('replace patient and employee')
            shifts[i] = {
              ...currentShift,
              type: isValid(currentShift?.schedule_id) ? 'update' : 'add',
              employee_id,
              employee: empData,
              patient_id,
              patient: patData
            }
          } else if (userType === 'patient') {
            // replace patient
            log('replace patient')
            shifts[i] = {
              ...currentShift,
              type: isValid(currentShift?.schedule_id) ? 'update' : 'add',
              employee_id: currentShift?.employee_id ? currentShift?.employee_id : null,
              employee: currentShift?.employee ? currentShift?.employee : null,
              patient_id,
              patient: patData
            }
          } else if (userType === 'employee') {
            // replace employee
            log('replace employee')
            shifts[i] = {
              ...currentShift,
              type: isValid(currentShift?.schedule_id) ? 'update' : 'add',
              patient_id: currentShift?.patient_id ? currentShift?.patient_id : null,
              patient: currentShift?.patient ? currentShift?.patient : null,
              employee_id,
              employee: empData
            }
          }
        }
        if (isValid(newData)) {
          shifts.push({
            ...newData
          })
        }
        shifts.sort((a, b) => {
          return new Date(a?.shift_start_time) - new Date(b.shift_start_time)
        })
        d[index] = {
          ...d[index],
          shifts: shifts.map((a, i) => ({ ...a, index: i }))
        }

        log('updatePatient', d)
        setLastUpdated(new Date())

        if (isValid(patient_id) || isValid(employee_id) || type !== 'remove') {
          setDates([...d])
          if (isValid(pat)) {
            const p = addedPatients?.hasOwnProperty(patient_id) ? addedPatients[patient_id] : {}

            setAddedPatients({
              ...addedPatients,
              [patient_id]: {
                ...p,
                ...pat
              }
            })
          }
          if (isValid(emp)) {
            const e = addedEmployees?.hasOwnProperty(employee_id) ? addedEmployees[employee_id] : {}

            setAddedEmployees({
              ...addedEmployees,
              [employee_id]: {
                ...emp,
                assigned_work: {
                  ...e,
                  ...emp?.assigned_work,
                  actual_working_hours_per_week_in_min: Math.floor(
                    emp?.assigned_work?.assigned_working_hour_per_week *
                      (emp?.assigned_work?.working_percent / 100) *
                      60
                  )
                }
              }
            })
          }
        } else {
          WarningToast('please-select-a-patient-or-employee-first')
        }
      }
    }
  }
  function handleContextMenu(event, id, shift) {
    event.preventDefault()
    setContextMenuData(shift)
    show(event, {
      id,
      props: {
        ...shift
      }
    })
  }
  const renderDates = (datesAll, index) => {
    const re = []

    fastLoop(datesAll, (d, dateIndex) => {
      const isOldDate = new Date(d) <= new Date()

      const dateIncluded = isValid(dates?.find((a) => a.date === d))
        ? dates?.find((a) => a.date === d && a.type !== 'delete')
        : null
      const moreShift = dateIncluded?.shifts?.filter((a) => a.type !== 'delete')
      if (isValidArray(moreShift)) {
        fastLoop(moreShift, (shiftIncluded, shiftIndex) => {
          const shiftStart = `${shiftIncluded?.shift_end_time}`
          const shiftEnd = `${shiftIncluded?.shift_start_time}`

          const shiftRestStart = `${shiftIncluded?.rest_end_time}`
          const shiftRestEnd = `${shiftIncluded?.rest_start_time}`

          const shift = getExactTime(shiftStart, shiftEnd)
          const shiftRest = getExactTime(shiftRestStart, shiftRestEnd)
          // log('shiftRest', shiftRest)
          const emergencyExhausted = shiftIncluded?.emergency_minutes > 720
          const is40HoursExhausted = shiftIncluded?.totalMinutes >= 2400
          const totalWorkMin = shiftIncluded?.totalMinutes

          const emp =
            isValid(shiftIncluded?.employee_id) &&
            addedEmployees?.hasOwnProperty(shiftIncluded?.employee_id)
              ? addedEmployees[shiftIncluded?.employee_id]
              : null
          const pat =
            isValid(shiftIncluded?.patient_id) &&
            addedPatients?.hasOwnProperty(shiftIncluded?.patient_id)
              ? addedPatients[shiftIncluded?.patient_id]
              : null
          const isLeave =
            leaveData?.hasOwnProperty(emp?.id) &&
            leaveData[emp?.id].includes(formatDate(d, 'YYYY-MM-DD'))

          re.push(
            <>
              <tr
                className={classNames({ 'bg-reds': is40HoursExhausted })}
                key={`tr-${dateIncluded?.date}-${shiftIndex}`}
                onContextMenu={(e) =>
                  handleContextMenu(e, `menu-employee`, {
                    date: dateIncluded?.date,
                    index: shiftIncluded?.index,
                    ...shiftIncluded
                  })
                }
              >
                <td
                  role={'button'}
                  onClick={(e) =>
                    handleContextMenu(e, `menu-employee`, {
                      date: dateIncluded?.date,
                      index: shiftIncluded?.index,
                      ...shiftIncluded
                    })
                  }
                >
                  <MenuOpen className='text-dark' />
                </td>
                <td>
                  {/* <Hide IF={leaves.includes(formatDate(d, "YYYY-MM-DD"))}> */}
                  <Show IF={!isOldDate && isValid(dateIncluded) && shiftIndex === 0}>
                    <BsTooltip title={FM('add-more-shift')}>
                      <PlusCircle
                        role={
                          dateIncluded &&
                          isValid(watch('shift_start_time')) &&
                          isValid(watch('shift_end_time'))
                            ? 'button'
                            : 'none'
                        }
                        onClick={() => {
                          if (
                            isValid(watch('shift_start_time')) &&
                            isValid(watch('shift_end_time'))
                          ) {
                            addMoreShift(dateIncluded)
                          }
                        }}
                        className={
                          dateIncluded &&
                          isValid(watch('shift_start_time')) &&
                          isValid(watch('shift_end_time'))
                            ? 'text-success'
                            : 'text-muted'
                        }
                        size={20}
                      />
                    </BsTooltip>
                  </Show>
                  <Show IF={!isOldDate && shiftIndex > 0}>
                    <BsTooltip title={FM('remove-shift')}>
                      <MinusCircle
                        role={'button'}
                        onClick={() => removeShift(dateIncluded, shiftIncluded?.index)}
                        className={'text-danger'}
                        size={20}
                      />
                    </BsTooltip>
                  </Show>
                  {/* </Hide> */}
                  <Show IF={isLeave || shiftIncluded?.leave_approved === 1}>
                    <BsTooltip className='ms-1' title={FM('employee-on-leave')}>
                      <Badge className='bg-danger' color='danger'>
                        <div className='p-25'>L</div>
                      </Badge>
                    </BsTooltip>
                  </Show>
                </td>
                <td>
                  <Show IF={shiftIndex === 0}>
                    <p key={`date-${formatDate(d, 'DD MMMM, YYYY')}`} className=' mb-0'>
                      {formatDate(d, 'YYYY-MM-DD')}
                    </p>
                  </Show>
                </td>
                {/* <td> */}
                {/* {dateIncluded && empView?.assigned_work?.actual_working_hours_per_week_in_min ? <>
                                        <BsTooltip title={FM("actual-total-work-hours-per-day")}>{viewInHours(shiftPerDayMinutes)}</BsTooltip>
                                    </> : "--"} */}
                {/* </td> */}
                <td>
                  <p
                    key={`shift-${watch('shift_id')}`}
                    className=' mb-0'
                    title={shiftIncluded?.shift?.shift_name}
                  >
                    {truncateText(shiftIncluded?.shift?.shift_name, 5) ?? '--'}
                  </p>
                </td>
                <td className='blink'>
                  {shiftIncluded?.shift?.shift_type === ShiftType.emergency ? (
                    <BsTooltip
                      title={
                        emergencyExhausted
                          ? FM('emergency-hours-exceeded-the-limit')
                          : FM('emergency-shift')
                      }
                    >
                      <WarningOutlined
                        className={classNames({
                          'text-danger': emergencyExhausted,
                          'text-dark': !emergencyExhausted
                        })}
                      />{' '}
                    </BsTooltip>
                  ) : (
                    ''
                  )}{' '}
                  {shiftIncluded?.shift?.shift_type === ShiftType.SleepingEmergency ? (
                    <BsTooltip
                      title={
                        emergencyExhausted
                          ? FM('emergency-hours-exceeded-the-limit')
                          : FM('SleepingEmergency')
                      }
                    >
                      <Moon
                        className={classNames({
                          'text-danger': emergencyExhausted,
                          'text-dark': !emergencyExhausted
                        })}
                      />{' '}
                    </BsTooltip>
                  ) : (
                    ''
                  )}{' '}
                </td>
                <td>
                  <p key={`shift-${watch('shift_id')}`} className=' mb-0'>
                    {shiftIncluded?.shift_start_time && shiftIncluded?.shift_end_time ? (
                      <>
                        {getAmPm(new Date(shiftIncluded?.shift_start_time)) ?? ''}
                        {' - '}
                        {getAmPm(new Date(shiftIncluded?.shift_end_time)) ?? ''}
                      </>
                    ) : (
                      '--'
                    )}
                  </p>
                </td>
                <td>
                  <p className=' mb-0'>
                    {shiftIncluded ? <>{viewInHours(shift?.minutesTotal)}</> : '--'}
                  </p>
                </td>
                <td>
                  <p className=' mb-0'>
                    {shiftIncluded ? <>{viewInHours(shiftRest?.minutesTotal)}</> : '--'}
                  </p>
                </td>
                <td title={shiftIncluded?.patient?.name}>
                  <BsPopover
                    bodyClass='p-0'
                    trigger='hover'
                    placement='left'
                    title={shiftIncluded?.patient?.name}
                    content={
                      <>
                        <Show IF={isValid(pat?.patient_assigned_hours)}>
                          <Show IF={isValidArray(pat?.ips)}>
                            {pat?.ips?.map((d, i) => {
                              return (
                                <Row key={`ip-${i}`}>
                                  <Col className='border'>
                                    <div className='p-1 ps-2'>
                                      <p className='mb-0'>
                                        {FM('iP')} {i + 1} : {truncateText(d?.title, 10)}
                                      </p>
                                      <p className='mb-0'>
                                        {d?.start_date} - {d?.end_date}
                                      </p>
                                    </div>
                                  </Col>
                                </Row>
                              )
                            })}
                          </Show>
                          <Row>
                            <Show IF={pat?.patient_assigned_hours > 0}>
                              <Col md='12'>
                                <StatsHorizontal
                                  className={'white mb-0'}
                                  icon={<ViewWeek size={30} />}
                                  color='primary'
                                  stats={viewInHours(pat?.patient_assigned_hours)}
                                  statTitle={<span className=''>{FM('total-hours')}</span>}
                                />
                              </Col>
                            </Show>
                            <Col md='12'>
                              <StatsHorizontal
                                className={'white mb-0'}
                                icon={<ViewWeek size={30} />}
                                color={
                                  pat?.patient_assigned_hours > 0
                                    ? totalWorkMin > pat?.patient_assigned_hours
                                      ? 'danger'
                                      : 'success'
                                    : ''
                                }
                                stats={
                                  <span
                                    className={
                                      pat?.patient_assigned_hours > 0
                                        ? totalWorkMin > pat?.patient_assigned_hours
                                          ? 'text-danger'
                                          : 'text-success'
                                        : 'text-primary'
                                    }
                                  >
                                    {viewInHours(totalWorkMin)}
                                  </span>
                                }
                                statTitle={FM('assigned-hours')}
                              />
                            </Col>
                            <Show
                              IF={
                                pat?.patient_assigned_hours > 0 &&
                                totalWorkMin >= pat?.patient_assigned_hours
                              }
                            >
                              <Col md='12'>
                                <StatsHorizontal
                                  className={'white mb-0'}
                                  icon={<ViewWeek size={30} />}
                                  color='danger'
                                  stats={
                                    <span className='text-danger'>
                                      {viewInHours(totalWorkMin - pat?.patient_assigned_hours)}
                                    </span>
                                  }
                                  statTitle={FM('extra-hours')}
                                />
                              </Col>
                            </Show>
                            <Show IF={totalWorkMin <= pat?.patient_assigned_hours}>
                              <Col md='12'>
                                <StatsHorizontal
                                  className={'white mb-0'}
                                  icon={<Clock size={30} />}
                                  color='success'
                                  stats={
                                    <span className='text-success'>
                                      {viewInHours(pat?.patient_assigned_hours - totalWorkMin)}
                                    </span>
                                  }
                                  statTitle={FM('remaining-hours')}
                                />
                              </Col>
                            </Show>
                          </Row>
                        </Show>
                      </>
                    }
                  >
                    <span className='cursor-question'>
                      {isValid(pat) ? (
                        <Info size={16} className='text-primary' style={{ marginTop: -4 }} />
                      ) : null}{' '}
                      {truncateText(shiftIncluded?.patient?.name, 5) ?? (
                        <span className='text-muted'>{FM('no-patient')}</span>
                      )}
                    </span>
                  </BsPopover>
                </td>
                <td>
                  {isValid(shiftIncluded?.remaining_minutes_till_date_patient) &&
                  pat?.patient_assigned_hours > 0 ? (
                    shiftIncluded?.remaining_minutes_till_date_patient !== 0 ? (
                      shiftIncluded?.remaining_minutes_till_date_patient > 0 ? (
                        <>
                          <BsTooltip title={FM('remaining-hours-this-week')}>
                            <span className='text-success fw-bold'>
                              {viewInHours(shiftIncluded?.remaining_minutes_till_date_patient)} (-)
                            </span>
                          </BsTooltip>
                        </>
                      ) : (
                        <>
                          <BsTooltip title={FM('extra-hours-this-week')}>
                            <span className={'text-danger fw-bold'}>
                              {viewInHours(
                                Math.abs(shiftIncluded?.remaining_minutes_till_date_patient)
                              )}{' '}
                              (+)
                            </span>
                          </BsTooltip>
                        </>
                      )
                    ) : (
                      '00:00'
                    )
                  ) : (
                    '--'
                  )}
                </td>
                <td key={shiftIncluded?.employee?.id} className='ms-1'>
                  <BsPopover
                    bodyClass='p-0'
                    trigger='hover'
                    placement='left'
                    title={shiftIncluded?.employee?.name}
                    content={
                      <>
                        <Show IF={isValid(emp?.id)}>
                          <Row>
                            <Show IF={emp?.assigned_work?.actual_working_hours_per_week_in_min > 0}>
                              <Col md='12'>
                                <StatsHorizontal
                                  className={'white mb-0'}
                                  icon={<ViewWeek size={30} />}
                                  color='primary'
                                  stats={viewInHours(
                                    emp?.assigned_work?.actual_working_hours_per_week_in_min
                                  )}
                                  statTitle={<span className=''>{FM('actual-work-hours')}</span>}
                                />
                              </Col>
                            </Show>
                            <Col md='12'>
                              <StatsHorizontal
                                className={'white mb-0'}
                                icon={<ViewWeek size={30} />}
                                color={
                                  emp?.assigned_work?.actual_working_hours_per_week_in_min > 0
                                    ? totalWorkMin >
                                      emp?.assigned_work?.actual_working_hours_per_week_in_min
                                      ? 'danger'
                                      : 'success'
                                    : ''
                                }
                                stats={
                                  <span
                                    className={
                                      emp?.assigned_work?.actual_working_hours_per_week_in_min > 0
                                        ? totalWorkMin >
                                          emp?.assigned_work?.actual_working_hours_per_week_in_min
                                          ? 'text-danger'
                                          : 'text-success'
                                        : 'text-primary'
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
                                emp?.assigned_work?.actual_working_hours_per_week_in_min > 0 &&
                                totalWorkMin >=
                                  emp?.assigned_work?.actual_working_hours_per_week_in_min
                              }
                            >
                              <Col md='12'>
                                <StatsHorizontal
                                  className={'white mb-0'}
                                  icon={<ViewWeek size={30} />}
                                  color='danger'
                                  stats={
                                    <span className='text-danger'>
                                      {viewInHours(
                                        totalWorkMin -
                                          emp?.assigned_work?.actual_working_hours_per_week_in_min
                                      )}
                                    </span>
                                  }
                                  statTitle={FM('extra-hours-this-week')}
                                />
                              </Col>
                            </Show>
                            <Show
                              IF={
                                totalWorkMin <=
                                emp?.assigned_work?.actual_working_hours_per_week_in_min
                              }
                            >
                              <Col md='12'>
                                <StatsHorizontal
                                  className={'white mb-0'}
                                  icon={<Clock size={30} />}
                                  color='success'
                                  stats={
                                    <span className='text-success'>
                                      {viewInHours(
                                        emp?.assigned_work?.actual_working_hours_per_week_in_min -
                                          totalWorkMin
                                      )}
                                    </span>
                                  }
                                  statTitle={FM('remaining-hours-this-week')}
                                />
                              </Col>
                            </Show>
                          </Row>
                        </Show>
                      </>
                    }
                  >
                    {isValid(emp?.id) ? (
                      <Info size={16} className='text-primary' style={{ marginTop: -4 }} />
                    ) : null}{' '}
                    {truncateText(shiftIncluded?.employee?.name, 5) ?? (
                      <span className='text-muted'>{FM('no-employee')}</span>
                    )}
                  </BsPopover>
                </td>

                <td>
                  {isValid(shiftIncluded?.remaining_minutes_till_date_employee) &&
                  emp?.assigned_work?.actual_working_hours_per_week_in_min > 0 ? (
                    shiftIncluded?.remaining_minutes_till_date_employee !== 0 ? (
                      shiftIncluded?.remaining_minutes_till_date_employee > 0 ? (
                        <>
                          <BsTooltip title={FM('remaining-hours-this-week')}>
                            <span className='text-success fw-bold'>
                              {viewInHours(shiftIncluded?.remaining_minutes_till_date_employee)} (-)
                            </span>
                          </BsTooltip>
                        </>
                      ) : (
                        <>
                          <BsTooltip title={FM('extra-hours-this-week')}>
                            <span className={'text-danger fw-bold'}>
                              {viewInHours(
                                Math.abs(shiftIncluded?.remaining_minutes_till_date_employee)
                              )}{' '}
                              (+)
                            </span>
                          </BsTooltip>
                        </>
                      )
                    ) : (
                      '00:00'
                    )
                  ) : (
                    '--'
                  )}
                </td>
                <td>
                  {shiftIncluded?.rest_between_next_shift ? (
                    <p
                      className={classNames('mb-0 fw-bold', {
                        'text-danger': shiftIncluded?.rest_between_next_shift?.hours < 9,
                        'text-warning':
                          shiftIncluded?.rest_between_next_shift?.hours >= 9 &&
                          shiftIncluded?.rest_between_next_shift?.hours < 11,
                        'text-success': shiftIncluded?.rest_between_next_shift?.hours >= 11
                      })}
                    >
                      <BsTooltip
                        title={
                          shiftIncluded?.rest_between_next_shift?.hours > 11
                            ? null
                            : FM('there-must-be-9-11-hours-gap-between-2-shifts')
                        }
                      >
                        {viewInHours(shiftIncluded?.rest_between_next_shift?.minutesTotal)}
                      </BsTooltip>
                    </p>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className='blink'>
                  {shiftIncluded?.rest_between_next_shift2?.minutesTotal < 2160 ? (
                    <BsTooltip title={FM('please-give-rest-at-least-36-hours')}>
                      <WarningOutlined className={'text-danger'} />{' '}
                    </BsTooltip>
                  ) : (
                    ''
                  )}{' '}
                </td>
              </tr>
            </>
          )
        })
      } else {
        re.push(
          <>
            <tr>
              <td>
                <MenuOpen className='text-muted' />
              </td>
              <td>
                <Hide IF={leaves.includes(formatDate(d, 'YYYY-MM-DD'))}>
                  <Show IF={!isOldDate && !isValid(dateIncluded)}>
                    <BsTooltip title={FM('add-shift')}>
                      <PlusCircle
                        role={
                          isValid(watch('shift_start_time')) && isValid(watch('shift_end_time'))
                            ? 'button'
                            : 'none'
                        }
                        onClick={() => {
                          if (
                            isValid(watch('shift_start_time')) &&
                            isValid(watch('shift_end_time'))
                          ) {
                            dateRef?.current?.flatpickr?.setDate(
                              [...dates?.map((a) => new Date(a.date)), new Date(d)],
                              true
                            )
                          }
                        }}
                        className={
                          isValid(watch('shift_start_time')) && isValid(watch('shift_end_time'))
                            ? 'text-success'
                            : 'text-muted'
                        }
                        size={20}
                      />
                    </BsTooltip>
                  </Show>
                  <Show IF={!isOldDate && isValid(dateIncluded)}>
                    <BsTooltip title={FM('add-more-shift')}>
                      <PlusCircle
                        role={
                          dateIncluded &&
                          isValid(watch('shift_start_time')) &&
                          isValid(watch('shift_end_time'))
                            ? 'button'
                            : 'none'
                        }
                        onClick={() => {
                          if (
                            isValid(watch('shift_start_time')) &&
                            isValid(watch('shift_end_time'))
                          ) {
                            addMoreShift(dateIncluded)
                          }
                        }}
                        className={
                          dateIncluded &&
                          isValid(watch('shift_start_time')) &&
                          isValid(watch('shift_end_time'))
                            ? 'text-success'
                            : 'text-muted'
                        }
                        size={20}
                      />
                    </BsTooltip>
                  </Show>
                </Hide>
              </td>
              <td>
                <p key={`date-${formatDate(d, 'DD MMMM, YYYY')}`} className=' mb-0'>
                  {formatDate(d, 'YYYY-MM-DD')}
                </p>
              </td>
              <td>--</td>
              <td></td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td></td>
            </tr>
          </>
        )
      }
    })
    return (
      <>
        <div className='table-'>
          {/* <Scrollbars autoHide style={{ height: "300px" }}> */}
          <Table striped responsive className='fixed-table'>
            <thead>
              <tr>
                <th colSpan={2}></th>
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
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('shift-rest-hours')}</p>
                </th>
                <th>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('patient')}</p>
                </th>
                <th>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('patient-hours')}</p>
                </th>
                <th>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('employee')}</p>
                </th>
                <th>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>{FM('remaining-hours')}</p>
                </th>
                <th colSpan={2}>
                  <p className='text-dark mb-0 fw-bolder text-small-12'>
                    {FM('rest-between-shift')}
                  </p>
                </th>
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
    const mot = dates[0]?.date
    const allDates = isValidArray(dates) ? addDaysArray(getMonday(mot), weeks * 7) : []
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
            <CardHeader
              className='border-bottom p-1'
              onContextMenu={(e) =>
                handleContextMenu(e, `menu-week`, {
                  week,
                  index,
                  allWeeks
                })
              }
            >
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
                                        <p className='mb-0 mt-25 text-small-12 '>
                                            {isValid(empView?.assigned_work?.assigned_work?.actual_working_hours_per_week_in_min) ? viewInHours(empView?.assigned_work?.actual_working_hours_per_week_in_min) : "00:00"}
                                            {" "} {FM("per-week")} (
                                            {isValid(empView?.assigned_work?.working_percent) ? empView?.assigned_work?.working_percent : 0}%
                                            {" "} {FM("of")} {" "}
                                            {isValid(empView?.assigned_work?.assigned_working_hour_per_week) ? empView?.assigned_work?.assigned_working_hour_per_week : 0} {FM("hours")}
                                            )
                                        </p> */}
                    <p className=' mb-0'>{FM('all-time-is-hh-mm')}</p>
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

  const closeContextMenu = () => {
    hideAll()
    // setContextMenuData(null)
  }
  const resetEverything = () => {
    setLoadedDates([])
    setRefresh(new Date())
    // setDatesDeleted([])
    setDates([])
    setAvailableSchedules([])
    setDataSets(null)
    dateRef.current?.flatpickr?.setDate(null)
  }

  const loadWeeks = (exclude = [], max = 52, min = null) => {
    const startWeek = min ? min : getWeekNumber(dates[0]?.date)
    const re = []
    let x = 1
    // log("max", startWeek, max, exclude)
    for (let i = startWeek; i <= max + startWeek; i++) {
      const index = x
      if (isValidArray(exclude)) {
        if (!exclude?.includes(index)) {
          re.push({
            label: `${i} ${FM('week')}`,
            i,
            value: index
          })
        }
      } else {
        re.push({
          label: `${i} ${FM('week')}`,
          i,
          value: index
        })
      }
      x++
    }
    return re
  }

  const handleCopyModal = (e) => {
    log(copyModal, 'asad')
    showCopyModal(!copyModal)
    setSelectType(e)
  }
  const isValidRepeat = watch('week_to') - 1 + cSelected?.length * Number(watch('repeat'))

  const handleCopy = () => {
    if (selectType === 'replace') {
      // replace
      const week = contextMenuData?.week
      const weekFirstDate = new Date(week[0])
      const weekLastDate = new Date(week[6])
      const from = watch('week_from')
      const to = watch('week_to')
      const destinationDateArray = isValidArray(contextMenuData?.allWeeks[to - 1])
        ? contextMenuData?.allWeeks[to - 1]
        : addDaysArray(
            moment(weekFirstDate)
              .add(to - 1, 'w')
              .toDate(),
            6
          )
      const fromDates = dates?.filter((d) => {
        const date = new Date(d?.date)
        if (date >= weekFirstDate && date <= weekLastDate) {
          return true
        }
      })

      const toDates = dates?.filter((d) => {
        const date = new Date(d?.date)
        if (isValidArray(destinationDateArray)) {
          return !(
            date.getTime() >= new Date(destinationDateArray[0])?.getTime() &&
            date.getTime() <= new Date(destinationDateArray[6])?.getTime()
          )
        } else {
          return true
        }
      })
      const finalDateArray = []
      fastLoop(destinationDateArray, (date, index) => {
        const day = moment(date).day()
        const find = fromDates.find((d) => moment(d?.date).day() === day)
        if (isValid(find)) {
          const shifts = find?.shifts?.map((s) => ({
            ...s,
            type: 'add',
            shift_start_time: `${date} ${formatDate(s?.shift_start_time, 'HH:mm')}`,
            shift_end_time: `${date} ${formatDate(s?.shift_end_time, 'HH:mm')}`
          }))
          finalDateArray.push({
            date,
            shifts
          })
        }
      })

      if (isValidArray(finalDateArray)) {
        const previousDate = toDates
        const allDates = previousDate.concat(finalDateArray)
        allDates.sort((a, b) => {
          return new Date(a?.date) - new Date(b.date)
        })
        dateRef.current?.flatpickr?.setDate(allDates?.map((a) => new Date(a?.date)))
        setDates([...allDates])
        setWeek(to > weeks ? to : weeks)
        showCopyModal(false)
      }

      log(
        moment(weekFirstDate).subtract(to, 'w').toDate(),
        toDates,
        finalDateArray,
        destinationDateArray,
        fromDates,
        to,
        from,
        week
      )
    } else {
      // repeat
      const selectedWeeks = []
      const to = watch('week_to')
      const selectedWeekStartDate = isValid(contextMenuData?.allWeeks[0][0])
        ? new Date(contextMenuData?.allWeeks[0][0])
        : null
      const selectedWeekEndDate = isValid(
        contextMenuData?.allWeeks[cSelected[cSelected.length - 1] - 1][6]
      )
        ? new Date(contextMenuData?.allWeeks[cSelected[cSelected.length - 1] - 1][6])
        : null
      const startDate = moment(selectedWeekStartDate)
        .add(to - 1, 'w')
        .toDate()
      const howManyTimes = watch('repeat')
      const destinationDateArray = addDaysArray(startDate, 7 * (howManyTimes * cSelected?.length))
      const finalDateArray = []

      if (isValidRepeat < 52) {
        const fromDates = dates?.filter((d) => {
          const date = new Date(d?.date)
          if (date >= selectedWeekStartDate && date <= selectedWeekEndDate) {
            return true
          }
        })

        const toDates = dates?.filter((d) => {
          const date = new Date(d?.date)
          if (isValidArray(destinationDateArray)) {
            return !(
              date.getTime() >= new Date(destinationDateArray[0])?.getTime() &&
              date.getTime() <=
                new Date(destinationDateArray[destinationDateArray.length - 1])?.getTime()
            )
          } else {
            return true
          }
        })

        fastLoop(destinationDateArray, (date, index) => {
          const day = moment(date).day()
          const find = fromDates.find((d) => moment(d?.date).day() === day)
          if (isValid(find)) {
            const shifts = find?.shifts?.map((s) => ({
              ...s,
              type: 'add',
              shift_start_time: `${date} ${formatDate(s?.shift_start_time, 'HH:mm')}`,
              shift_end_time: `${date} ${formatDate(s?.shift_end_time, 'HH:mm')}`
            }))
            finalDateArray.push({
              date,
              shifts
            })
          }
        })

        if (isValidArray(finalDateArray)) {
          const previousDate = toDates
          const allDates = previousDate.concat(finalDateArray)
          allDates.sort((a, b) => {
            return new Date(a?.date) - new Date(b.date)
          })
          dateRef.current?.flatpickr?.setDate(allDates?.map((a) => new Date(a?.date)))
          setDates([...allDates])
          setWeek(isValidRepeat > weeks ? isValidRepeat : weeks)
          showCopyModal(false)
        }
        log(
          destinationDateArray,
          startDate,
          new Date(destinationDateArray[destinationDateArray.length - 1])
        )
      }
    }
  }

  const renderWeekButtons = (type) => {
    const startWeek = getWeekNumber(dates[0]?.date)
    const endWeek = getWeekNumber(dates[dates?.length - 1]?.date)
    const re = []
    if (isValid(weeks)) {
      let x = 1
      for (let i = startWeek; i <= endWeek; i++) {
        const index = x
        re.push(
          <>
            <Button
              className='m-25'
              size='sm'
              key={`week-button-${i}`}
              color='primary'
              outline={!cSelected?.includes(index)}
              onClick={() => onCheckboxBtnClick(index)}
              active={cSelected.includes(index)}
            >
              {FM('week')} {i}
            </Button>
          </>
        )
        x++
      }
    }
    return re
  }

  return (
    <div className='p-0 m-0' onClick={closeContextMenu}>
      <CardBody className='p-0 m-0'>
        <Container fluid className='m-0 p-0'>
          <Row className='g-0'>
            <Col
              lg={3}
              md={4}
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
                          isClearable={!isValid(templateId)}
                          defaultOptions
                          control={control}
                          options={template}
                          matchWith='id'
                          value={watch('schedule_template_id') ?? ''}
                          onChangeValue={() => {
                            resetEverything()
                          }}
                          append={
                            <ScheduleTemplateModal
                              responseData={(e) => {
                                setTemplateNew(e)
                              }}
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
                          key={`fcdbdsfgsgfs--${watch('shift_type')}-${shiftNew?.id}`}
                          type={'select'}
                          control={control}
                          errors={errors}
                          name={'shift_id'}
                          isClearable
                          matchWith='id'
                          //  isMulti
                          defaultOptions
                          value={watch('shift_id') ?? ''}
                          async
                          cacheOptions
                          loadOptions={loadShiftOption}
                          options={shiftOptions}
                          placeholder={FM('shift')}
                          rules={{ required: false }}
                          className='mb-1'
                          append={
                            <Show IF={isValid(watch('shift_type'))}>
                              <WorkShiftModal
                                shift_type={watch('shift_type')}
                                responseData={(e) => {
                                  setShiftNew(e)
                                }}
                                Component={InputGroupText}
                              >
                                <Plus size={16} />
                              </WorkShiftModal>
                            </Show>
                          }
                        />
                      </Col>
                      {/* 
                                            <Col md={6}>
                                                <FormGroupCustom
                                                    key={`shift-start-time-${shiftView?.shift_start_time}-${watch("shift_id")}`}
                                                    disabled={watch("shift_id")}
                                                    //   isDisable={watch("shift_id")}
                                                    name={`shift_start_time`}
                                                    type={"date"}
                                                    label={FM(`start-time`)}
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true

                                                    }}
                                                    value={shiftView?.shift_start_time ?? null}
                                                    dateFormat={"HH:mm"}
                                                    errors={errors}
                                                    className="mb-1"
                                                    setValue={setValue}
                                                    control={control}
                                                    rules={{ required: false }}
                                                //value={edit?.how_many_time_array[i]?.start ? new Date(edit?.how_many_time_array[i]?.start) : ""}
                                                />

                                            </Col>
                                            <Col md={6}>
                                                <FormGroupCustom
                                                    key={`start-time-vvv${shiftView?.shift_end_time}-${watch("shift_id")}`}
                                                    disabled={watch("shift_id")}
                                                    name={`shift_end_time`}
                                                    type={"date"}
                                                    label={FM("end-time")}
                                                    // defaultDate={dates[1]}
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true
                                                    }}
                                                    dateFormat={"HH:mm"}
                                                    errors={errors}
                                                    className="mb-1"
                                                    value={shiftView?.shift_end_time ?? null}
                                                    control={control}
                                                    setValue={setValue}
                                                    rules={{ required: false }}
                                                />
                                            </Col> */}
                      <Show
                        IF={
                          !isValid(watch('schedule_template_id')) ||
                          !isValid(watch('shift_end_time')) ||
                          !isValid(watch('shift_start_time'))
                        }
                      >
                        <Col md='12' className='text-center text-danger text-small-12 mb-5px'>
                          {FM('please-select-shift-first')}
                        </Col>
                      </Show>
                      <Col
                        md='12'
                        className={classNames('d-flex justify-content-center', {
                          'pe-nones':
                            !isValid(watch('schedule_template_id')) ||
                            !isValid(watch('shift_end_time')) ||
                            !isValid(watch('shift_start_time'))
                        })}
                      >
                        <FormGroupCustom
                          type={'date'}
                          // key={`re-dates-${!isValid(watch('shift_start_time')) && !isValid(watch('shift_end_time'))}`}
                          noGroup
                          noLabel
                          dateFormat={null}
                          options={{
                            weekNumbers: true,
                            mode: 'multiple',
                            inline: true,
                            disable: [
                              new Date(),
                              ...leaves,
                              function (date) {
                                const d = formatDate(date)
                                // return true to enable
                                const isDateIncluded = isValid(dates?.find((a) => a.date === d))
                                  ? dates?.find((a) => a.date === d && a.type !== 'delete')
                                  : null
                                if (dates.length > 0) {
                                  return (
                                    !isValid(isDateIncluded) &&
                                    !isValid(watch('shift_start_time')) &&
                                    !isValid(watch('shift_end_time'))
                                  )
                                } else {
                                  return false
                                }
                              }
                            ],
                            // enable: [function (date) { return enableFutureDates(date) }, edit?.start_date, new Date()],
                            minDate: 'today',
                            maxDate: groupEnabled
                              ? isValidArray(watch('shift_dates'))
                                ? new Date(addDay(new Date(watch('shift_dates')[0]), 27))
                                : null ?? null
                              : null
                          }}
                          onChangeValue={() => {
                            setLastSelectedDate(
                              formatDate(dateRef.current?.flatpickr?.latestSelectedDateObj)
                            )
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
                      {/* <Show IF={dates?.length === 0} */}
                    </Row>
                  </Col>
                </Row>
              </Scrollbars>
            </Col>
            <Col
              lg={9}
              md={8}
              className=''
              style={{
                overflow: 'hidden',
                height
              }}
            >
              <Row className='p-1 pe-1 gx-1 shadow white'>
                <Col md={3}>
                  <FormGroupCustom
                    type={'select'}
                    control={control}
                    errors={errors}
                    name={'week'}
                    value={weeks}
                    options={loadWeeks(null, 52, 1)}
                    onChangeValue={(e) => {
                      setWeek(e)
                    }}
                    label={FM('week')}
                    rules={{ required: false }}
                    className='mb-0'
                  />
                </Col>
                <Show IF={singleLiving || homeLiving}>
                  <Col md={3}>
                    <FormGroupCustom
                      key={`-patient_id-${user}`}
                      type={'select'}
                      control={control}
                      errors={errors}
                      name={'patient_id'}
                      defaultOptions
                      matchWith='id'
                      async
                      isClearable
                      cacheOptions
                      loadOptions={loadPatientOption}
                      options={patients}
                      label={FM('patient')}
                      rules={{ required: false }}
                      className='mb-0'
                    />
                  </Col>
                  {/* <Col className={classNames({ "d-none": ip?.length <= 1 })}>
                                        <FormGroupCustom
                                            key={`${watch('patient_id')}-plan`}
                                            type={"select"}
                                            control={control}
                                            errors={errors}
                                            name={"plan"}
                                            defaultOptions
                                            matchWith="id"
                                            async
                                            isClearable
                                            cacheOptions
                                            value={""}
                                            loadOptions={loadIpOption}
                                            options={ip}
                                            label={FM("plan")}
                                            rules={{ required: false }}
                                            className='mb-0'
                                        />
                                    </Col> */}
                </Show>
                <Col md={3}>
                  <FormGroupCustom
                    type={'select'}
                    control={control}
                    errors={errors}
                    isClearable
                    name={'employee_type'}
                    options={createConstSelectOptions(empType, FM)}
                    label={FM('employee-type')}
                    rules={{ required: false }}
                    className='mb-0'
                  />
                </Col>
                <Col md={3}>
                  <FormGroupCustom
                    key={`-user_id-${user}-${watch('employee_type')}`}
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
                    options={employee}
                    label={FM('Employee')}
                    rules={{ required: false }}
                    className='mb-0'
                  />
                </Col>
              </Row>
              <Scrollbars autoHide>
                <div className=''>
                  <Row className='p-1 me-0 gx-1'>
                    <Show
                      IF={
                        isValid(empView?.id) &&
                        new Date(`${empView?.joining_date} 00:00:00`) > new Date()
                      }
                    >
                      <Col md='12'>
                        <p className='alert alert-danger p-1'>
                          {FM('the-joining-date-of-selected-employee-is', {
                            date: empView?.joining_date
                          })}
                        </p>
                      </Col>
                    </Show>
                    <Show IF={isValidArray(dates)}>
                      <Col md='12' style={{ paddingBottom: 100 }}>
                        {renderDayWeeks()}
                      </Col>
                    </Show>
                  </Row>
                </div>
              </Scrollbars>
            </Col>
          </Row>
        </Container>
      </CardBody>
      <Menu id={'menu-week'}>
        <Item onClick={(e) => handleCopyModal('replace')}>
          <Repeat className='me-1' size={18} /> {FM('replace-week')}
        </Item>
        <Item onClick={(e) => handleCopyModal('repeat')}>
          <Copy className='me-1' size={18} /> {FM('repeat-week')}
        </Item>
      </Menu>
      <CenteredModal
        handleSave={handleCopy}
        scrollControl={false}
        open={copyModal}
        handleModal={handleCopyModal}
      >
        <div className='p-2'>
          <Row>
            <Col md='12'>
              <Label>{FM('select-week-to-copy')}</Label>
            </Col>
            <Col md='12' className='mb-2'>
              <Show IF={selectType === 'replace'}>
                <FormGroupCustom
                  noLabel
                  isDisabled
                  type={'select'}
                  control={control}
                  errors={errors}
                  name={'week_from'}
                  value={contextMenuData?.index + 1}
                  options={loadWeeks()}
                  onChangeValue={(e) => {
                    setDSelected(e)
                  }}
                  label={FM('week')}
                  rules={{ required: false }}
                  className='mb-0'
                />
              </Show>
              <Show IF={selectType === 'repeat'}>{renderWeekButtons()}</Show>
            </Col>
            <Show IF={selectType === 'replace'}>
              <Col md='12'>
                <Label>{FM('select-week-to-replace')}</Label>
              </Col>
            </Show>
            <Col md='12' className=''>
              <Show IF={selectType === 'repeat'}>
                <FormGroupCustom
                  type={'select'}
                  control={control}
                  errors={errors}
                  name={'week_to'}
                  value={contextMenuData?.index + 1}
                  options={loadWeeks(cSelected)}
                  onChangeValue={(e) => {
                    setDSelected(e)
                  }}
                  label={FM('start-from')}
                  rules={{ required: false }}
                  className='mb-2'
                />
                <FormGroupCustom
                  type={'number'}
                  control={control}
                  errors={errors}
                  name={'repeat'}
                  label={FM('how-many-times')}
                  rules={{ required: true }}
                  className='mb-0 '
                />

                <Show
                  IF={
                    isValid(watch('week_to')) &&
                    isValid(watch('repeat')) &&
                    Number(watch('repeat')) > 1
                  }
                >
                  {/* <p className='mt-2 mb-0 fw-bolder alert alert-warning p-1'>
                                        {FM('week-from-to-data-will-be-replaced', { from: watch('week_to'), to: isValidRepeat })}
                                    </p> */}
                  <Show IF={isValidRepeat > 52}>
                    <p className='mt-2 mb-0 fw-bolder alert alert-danger p-1'>
                      {FM('please-check-input-you-can-copy-data-up-to-52-weeks')}
                    </p>
                  </Show>
                </Show>
              </Show>
              <Show IF={selectType === 'replace'}>
                <FormGroupCustom
                  noLabel
                  type={'select'}
                  control={control}
                  errors={errors}
                  name={'week_to'}
                  options={loadWeeks([contextMenuData?.index + 1], weeks)}
                  onChangeValue={(e) => {
                    setDSelected(e)
                  }}
                  label={FM('week')}
                  rules={{ required: false }}
                  className='mb-0'
                />
              </Show>
            </Col>
          </Row>
        </div>
      </CenteredModal>
      <Menu id={'menu-employee'}>
        <Item disabled id='item-header'>
          <div>
            <p className='mb-0 text-dark '>
              {String(contextMenuData?.date)} {' - '}
              <span className='text-dark'>
                {contextMenuData?.shift_start_time && contextMenuData?.shift_end_time ? (
                  <>
                    {getAmPm(new Date(contextMenuData?.shift_start_time)) ?? ''}
                    {' - '}
                    {getAmPm(new Date(contextMenuData?.shift_end_time)) ?? ''}
                  </>
                ) : null}
              </span>
            </p>
          </div>
        </Item>
        <Separator />
        <Item
          disabled={
            !isValid(patient?.id) ||
            !isValid(empView?.id) ||
            !isValid(contextMenuData?.patient_id) ||
            !isValid(contextMenuData?.employee_id) ||
            new Date(`${empView?.joining_date} 00:00:00`) > new Date(contextMenuData?.date)
          }
          onClick={() => {
            addPatientAndEmployee({ date: contextMenuData?.date }, contextMenuData?.index, 'add')
          }}
        >
          <Plus className='me-1' size={18} /> {FM('new-shift-with-patient-and-employee')}
        </Item>
        <Item
          disabled={
            !isValid(patient?.id) ||
            !isValid(empView?.id) ||
            (patient?.id === contextMenuData?.patient_id &&
              empView?.id === contextMenuData?.employee_id) ||
            new Date(`${empView?.joining_date} 00:00:00`) > new Date(contextMenuData?.date)
          }
          onClick={() => {
            addPatientAndEmployee(
              { date: contextMenuData?.date },
              contextMenuData?.index,
              'replace'
            )
          }}
        >
          <Repeat className='me-1' size={18} /> {FM('replace-patient-and-employee')}
        </Item>
        <Item
          disabled={!isValid(contextMenuData?.patient_id) && !isValid(contextMenuData?.employee_id)}
          onClick={() => {
            addPatientAndEmployee({ date: contextMenuData?.date }, contextMenuData?.index, 'remove')
          }}
        >
          <Trash2 className='me-1' size={18} /> {FM('remove-patient-and-employee')}
        </Item>

        <Separator />
        <Item disabled id='item-header'>
          {FM('employee-options')}
        </Item>
        <Item
          disabled={
            !isValid(empView?.id) ||
            !isValid(contextMenuData?.employee_id) ||
            new Date(`${empView?.joining_date} 00:00:00`) > new Date(contextMenuData?.date)
          }
          onClick={() => {
            addPatientAndEmployee(
              { date: contextMenuData?.date },
              contextMenuData?.index,
              'add',
              'employee'
            )
          }}
        >
          <Plus className='me-1' size={18} />{' '}
          {FM(isValid(empView?.id) ? 'new-shift-with' : 'new-shift')}{' '}
          <span className='ms-25 fw-bolder'>{empView?.name ? <>{empView?.name}</> : null}</span>
        </Item>
        <Item
          disabled={
            (!isValid(empView?.id) && !isValid(contextMenuData?.employee_id)) ||
            empView?.id === contextMenuData?.employee_id ||
            new Date(`${empView?.joining_date} 00:00:00`) > new Date(contextMenuData?.date)
          }
          onClick={() => {
            addPatientAndEmployee(
              { date: contextMenuData?.date },
              contextMenuData?.index,
              'replace',
              'employee'
            )
          }}
        >
          <Repeat className='me-1' size={18} />{' '}
          {FM(isValid(empView?.id) ? 'replace-with' : 'replace')}{' '}
          <span className='ms-25 fw-bolder'>{empView?.name ? <>{empView?.name}</> : null}</span>
        </Item>
        <Item
          disabled={!isValid(contextMenuData?.employee_id)}
          onClick={() => {
            addPatientAndEmployee(
              { date: contextMenuData?.date },
              contextMenuData?.index,
              'remove',
              'employee'
            )
          }}
        >
          <Trash2 className='me-1' size={18} /> {FM('remove')}{' '}
          <span className='ms-25 fw-bolder'>
            {contextMenuData?.employee?.name ? <>({contextMenuData?.employee?.name})</> : null}
          </span>
        </Item>
        <Separator />
        <Item disabled id='item-header'>
          {FM('patient-options')}
        </Item>
        <Item
          disabled={
            !isValid(patient?.id) ||
            (!isValid(contextMenuData?.patient_id) && !isValid(contextMenuData?.employee_id))
          }
          onClick={() => {
            addPatientAndEmployee(
              { date: contextMenuData?.date },
              contextMenuData?.index,
              'add',
              'patient'
            )
          }}
        >
          <Plus className='me-1' size={18} />{' '}
          {FM(isValid(patient?.id) ? 'new-shift-with' : 'new-shift')}{' '}
          <span className='ms-25 fw-bolder'>{patient?.name ? <>{patient?.name}</> : null}</span>
        </Item>
        <Item
          disabled={
            (!isValid(patient?.id) && !isValid(contextMenuData?.patient_id)) ||
            contextMenuData?.patient_id === patient?.id
          }
          onClick={() => {
            addPatientAndEmployee(
              { date: contextMenuData?.date },
              contextMenuData?.index,
              'replace',
              'patient'
            )
          }}
        >
          <Repeat className='me-1' size={18} />{' '}
          {FM(isValid(patient?.id) ? 'replace-with' : 'replace')}{' '}
          <span className='ms-25 fw-bolder'>{patient?.name ? <>{patient?.name}</> : null}</span>
        </Item>
        <Item
          disabled={!isValid(contextMenuData?.patient_id)}
          onClick={() => {
            addPatientAndEmployee(
              { date: contextMenuData?.date },
              contextMenuData?.index,
              'remove',
              'patient'
            )
          }}
        >
          <Trash2 className='me-1' size={18} /> {FM('remove')}{' '}
          <span className='ms-25 fw-bolder'>
            {contextMenuData?.patient?.name ? <>({contextMenuData?.patient?.name})</> : null}
          </span>
        </Item>
        <Separator />
        <Item
          disabled={
            !isValid(contextMenuData?.shift_start_time) && !isValid(contextMenuData?.shift_end_time)
          }
          onClick={() => {
            removeShift({ date: contextMenuData?.date }, contextMenuData?.index)
          }}
        >
          <span className='text-danger d-flex align-items-center fw-bold'>
            {' '}
            <Trash2 className='me-1' size={18} /> {FM('remove-shift')}
          </span>
        </Item>
      </Menu>
    </div>
  )
}

export default ScheduleFormTab
