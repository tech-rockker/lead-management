import moment from 'moment'
import { Activity, File, Search } from 'react-feather'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { receiveMessageSelected, sendMessageSelected } from '../views/chat/store'
import { Events, UserTypes, forDecryption } from './Const'
import Emitter from './Emitter'
import { FM, isValid, isValidArray, log } from './helpers/common'
import httpConfig from './http/httpConfig'
import Show from './Show'
const CryptoJS = require('crypto-js')
export const truncateText = (text = '', char = 200) => {
  if (isValid(text)) {
    return String(text).substring(0, char) + (String(text)?.length > char ? '...' : '')
  } else {
    return null
  }
}

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

export const decrypt = (text) => {
  if (isValid(text) && httpConfig?.enableAES) {
    let originalText = text
    try {
      // Decrypt
      const bytes = CryptoJS.AES.decrypt(text.toString(), `${httpConfig?.encryptKey}`)
      originalText = bytes.toString(CryptoJS.enc.Utf8)
    } catch (e) {
      log('unable to decrypt', originalText)
    }
    return originalText
  } else {
    return text
  }
}
export const decryptObject = (
  fields,
  object,
  modify = (k, v) => {
    return v
  }
) => {
  const state = {}
  if (isValid(object)) {
    for (const [key, value] of Object.entries(object)) {
      if (fields?.hasOwnProperty(key)) {
        const x = modify(key, value)
        if (isValid(value)) {
          try {
            state[key] = isValid(decrypt(x)) ? decrypt(x) : x
          } catch (error) {
            log(error, key, value)
          }
        } else {
          state[key] = x
        }
      } else {
        const x = modify(key, value)
        state[key] = x
      }
    }
  }
  return {
    ...object,
    ...state
  }
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
// export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
//     if (!value) return value
//     return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
// }

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('AcceussUserData')
export const getUserData = () => JSON.parse(localStorage.getItem('AcceussUserData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#5058b8', // for selected option bg-color
    neutral10: '#28c76f', // for tags bg-color
    neutral20: '#d8d6de', // for input border-color
    neutral30: '#d8d6de' // for input hover border-color
  }
})

/**
 * Display Success Tost Messages
 *
 * @param {*} message
 * @param {*} [settings={}] You can add toast settings
 */
export const SuccessToast = (message, settings = {}, comp = null) => {
  toast(comp ?? FM(message, settings), { type: toast.TYPE.SUCCESS, ...settings })
}
/**
 * Display Success Tost Messages
 *
 * @param {*} message
 * @param {*} [settings={}] You can add toast settings
 */
export const MessageToast = (message, settings = {}) => {
  toast(message, { type: toast.TYPE.DEFAULT, ...settings })
}
/**
 * Display Error Tost Messages
 *
 * @param {*} message
 * @param {*} [settings={}] You can add toast settings
 */
export const ErrorToast = (message, settings = {}, comp = null) => {
  toast(comp ?? FM(message, settings), { type: toast.TYPE.ERROR, limit: 1, ...settings })
}

/**
 * Display Warning Tost Messages
 *
 * @param {*} message
 * @param {*} [settings={}] You can add toast settings
 */
export const WarningToast = (message, settings = {}) => {
  toast(FM(message, settings), { type: toast.TYPE.WARNING, ...settings })
}

export const createSelectOptions = (
  array,
  label = null,
  value = null,
  decrypt = (a) => {
    return a
  }
) => {
  const data = []
  if (isValidArray(array)) {
    array.forEach((op) => {
      const option = decrypt(op)
      data.push({
        label: label
          ? option?.hasOwnProperty(label)
            ? truncateText(option[label], 50)
            : ''
          : option,
        value: value ? (option?.hasOwnProperty(label) ? option[value] : '') : option
      })
    })
  }
  return data
}
export const createConstSelectOptions = (
  object,
  FM = () => { },
  hide = () => {
    return false
  }
) => {
  const data = []
  for (const [key, value] of Object.entries(object)) {
    if (!hide(value)) {
      data.push({
        label: FM(key),
        value
      })
    }
  }
  return data
}

export const createAsyncSelectOptions = (
  res,
  page,
  label,
  value,
  setOptions = () => { },
  decrypt = (a) => {
    return a
  }
) => {
  const response = res?.data?.payload
  let results = {}
  if (response?.data?.length > 0) {
    results = {
      ...response,
      data: createSelectOptions(response?.data, label, value, decrypt)
    }
    log(results)
    setOptions(results?.data)

    return {
      options: results?.data ?? [],
      hasMore: parseInt(results?.last_page) !== parseInt(results?.current_page),
      additional: {
        page: page + 1
      }
    }
  } else {
    return {
      options: [],
      hasMore: false
    }
  }
}
export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value)
}

export const renderStatus = (id, objects = null) => {
  if (objects === null) {
    objects = {
      1: FM('active'),
      0: FM('inactive')
    }
  }
  return objects[id]
}

/**
 * Generate Uniq Id
 */
let id = 0
export const getUniqId = (prefix) => {
  id++
  return `${prefix}-${id}`
}

/**
 * Format date by any formate given using moment
 */
export const formatDate = (value, format = 'YYYY-MM-DD') => {
  const d = moment(value).format(format)
  if (d !== 'Invalid date') {
    return d
  } else {
    return null
  }
}

export const formatTime = (value, format) => {
  const d = moment(value).format(format)
  if (d !== 'Invalid time') {
    return d
  } else {
    return ''
  }
}

export const formatDateTimeByFormat = (value, format) => {
  const d = moment(value).format(format)
  if (d !== 'Invalid date time') {
    return d
  } else {
    return ''
  }
}
export const reverseString = (s) => {
  return [...s].reverse().join('').toUpperCase()
}

export const concatString = (d, length = 9) => {
  return `${d?.slice(0, length)}   `
}
export const updateRequiredOnly = (formData, editData) => {
  const rest = {}
  for (const [key] of Object.entries(editData)) {
    if (formData?.hasOwnProperty(key)) {
      rest[key] = editData[key]
    }
  }
  return { ...rest, ...formData }
}
export const isFloat = (n) => {
  return String(n).includes('.')
}
export const currencyFormat = (
  money,
  languageCode = 'sv',
  countryCode = 'SE',
  currency = 'SEK'
) => {
  if (money) {
    return new Intl.NumberFormat(`${languageCode}-${countryCode}`, {
      currency,
      style: 'currency',
      // minimumFractionDigits: isFloat(money) ? 2 : 0,
      maximumFractionDigits: isFloat(money) ? 2 : 0
    }).format(money)
  } else {
    return 0
  }
}

export const numberFormat = (number, languageCode = 'sv', countryCode = 'SE') => {
  if (number) {
    return new Intl.NumberFormat(`${languageCode}-${countryCode}`).format(number)
  } else {
    return 0
  }
}

export const calculateDiscount = (price, discount) => {
  return currencyFormat(price - (price * discount) / 100)
}

export const toggleArray = (value, array = [], state = () => { }) => {
  const index = array?.findIndex((e) => e === value)
  const finalArray = [...array] ?? []
  if (index === -1) {
    finalArray?.push(value)
  } else {
    finalArray?.splice(index, 1)
  }
  // log(finalArray)
  // if (finalArray?.length === 0) {
  //     state(null)
  // } else {
  state([...finalArray])
  // }
}
export const removeByIndex = (index, array = [], state = () => { }) => {
  const finalArray = array ?? []
  // log("index", JSON.stringify(array))
  if (index !== -1) {
    finalArray?.splice(index, 1)
  }
  // log(index, finalArray)
  state([...finalArray])
}
export const enableFutureDates = (date) => {
  if (date >= new Date()) {
    return true
  } else {
    return false
  }
}

export const addDay = (d, day) => {
  const someDate = new Date(d)
  const numberOfDaysToAdd = day
  const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd)
  return result
}

export const addDaysArray = (startDate, endDate) => {
  const re = []
  if (typeof endDate === 'number') {
    for (let index = 0; index < endDate; index++) {
      re.push(formatDate(addDay(startDate, index), 'YYYY-MM-DD'))
    }
  } else {
  }
  return re
}
export const minusDay = (d, day) => {
  const someDate = new Date(d)
  const numberOfDaysToAdd = day
  const result = someDate.setDate(someDate.getDate() - numberOfDaysToAdd)
  return result
}

export const setValues = (
  fields,
  object,
  state = () => { },
  modify = (k, a) => {
    return a
  }
) => {
  for (const [key, value] of Object.entries(object)) {
    if (fields?.hasOwnProperty(key)) {
      state(key, modify(key, value))
    }
  }
}
export const IsJsonString = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
export const JsonParseValidate = (data, ret = null) => {
  if (data && IsJsonString(data)) {
    const json = JSON.parse(data)
    if (typeof json === 'object') {
      return json
    } else {
      return ret
    }
  } else {
    return ret
  }
}
export const jsonDecodeAll = (fields, object, all = true) => {
  const re = {}
  for (const [key, value] of Object.entries(object)) {
    if (fields?.hasOwnProperty(key)) {
      if (fields[key] === 'json') {
        re[key] = JsonParseValidate(value)
      } else {
        re[key] = value
      }
    }
  }
  if (all) {
    return { ...object, ...re }
  } else {
    return re
  }
}

export const incompletePatient = (fields, object) => {
  const re = {}
  for (const [field, keys] of Object.entries(fields)) {
    let x = false
    if (typeof keys === 'object') {
      for (const [k, type] of Object.entries(keys)) {
        if (object?.hasOwnProperty(k)) {
          if (type === 'json') {
            x = isValidArray(object[k])
          } else if (type === 'length') {
            x = parseInt(object[k]) > 0
          } else {
            x = isValid(object[k])
          }
        }
      }
    }
    re[field] = x
  }
  return re
}
export const isAllTrue = (k, success = null, warning = null, danger = null) => {
  const r = []
  for (const [key, value] of Object.entries(k)) {
    r.push(value)
  }
  // log(r)
  if (r?.filter((a) => a === true)?.length === r?.length) {
    return success
  } else if (r?.filter((a) => a === false)?.length === r?.length) {
    return danger
  } else {
    return warning
  }
}

export const incompleteSteps = (fields, object) => {
  const re = {}
  for (const [field, keys] of Object.entries(fields)) {
    const x = {}
    if (typeof keys === 'object') {
      for (const [k, type] of Object.entries(keys)) {
        if (object?.hasOwnProperty(k)) {
          if (type === 'json') {
            x[k] = isValidArray(object[k])
          } else if (type === 'length') {
            x[k] = parseInt(object[k]) > 0
          } else if (typeof type === 'function') {
            x[k] = type(object)
          } else {
            x[k] = isValid(object[k])
          }
        }
      }
    }
    re[field] = x
  }
  return re
}
export const RenderHtml = ({ data, ...rest }) => {
  return <div dangerouslySetInnerHTML={{ __html: data }} {...rest} />
}
export function timeConvert(n, FM = () => { }) {
  const num = n
  const hours = num / 60
  const rhours = Math.floor(hours)
  const minutes = (hours - rhours) * 60
  const rminutes = Math.round(minutes)
  // return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s)."
  if ((n) => 60) {
    return `${rhours} ${FM('hour')} ${rminutes} ${FM('minute')}`
  } else {
    return `${rminutes} ${FM('minute')}`
  }
}

export const humanFileSize = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`
  }
  const units = si
    ? ['Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']
    : ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let u = -1
  const r = 10 ** dp
  do {
    bytes /= thresh
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)
  return `${bytes.toFixed(dp)} ${units[u]}`
}

export const getFIleBinaries = (files = {}) => {
  const re = {}
  for (const [key, val] of Object.entries(files)) {
    re[`file[${key}]`] = val
  }
  return re
}

export const getSelectValues = (val = [], matchWith = null) => {
  if (matchWith) {
    return val?.map((a) => a.value[matchWith])
  } else return val?.map((a) => a.value)
}

export const matchValue = (value, selected, matchWith) => {
  if (typeof value === 'object') {
    return String(value[matchWith]) === String(selected)
  } else {
    return String(value) === String(selected)
  }
}

export const makeSelectValues = (
  option = [],
  value = [],
  multi = false,
  matchWith = null,
  grouped = false,
  setOption = null
) => {
  try {
    let re = []
    if (!multi) {
      re = isValidArray(option) ? option?.find((c) => matchValue(c?.value, value, matchWith)) : []
      // log('matchWith', matchWith)
      // log(option, value)
    } else {
      if (value?.length > 0) {
        value?.forEach((v, i) => {
          let x = []
          if (grouped) {
            option?.forEach((q) => {
              if (isValid(q?.options?.find((a) => matchValue(a?.value, v, matchWith)))) {
                x = q?.options?.find((a) => matchValue(a?.value, v, matchWith))
              }
            })
          } else {
            x = option?.find((a) => matchValue(a?.value, v, matchWith))
          }
          // log("x", x)
          // log("option", option)
          if (x) re.push(x)
        })
      }
    }

    return re
  } catch (error) {
    log('makeSelectValues', error)
    // log(option, value)
    // log(matchWith, multi)
  }
}

export const Status = () => {
  const options = [
    { value: 0, label: FM('upcoming') },
    { value: 1, label: FM('done') },
    { value: 2, label: FM('not-done') },
    { value: 3, label: FM('not-applicable') }
  ]
  return options
}

export const StatusWithoutNotDone = () => {
  const options = [
    { value: 0, label: FM('upcoming') },
    { value: 1, label: FM('done') },
    // { value: 2, label: FM('not-done') },
    { value: 3, label: FM('not-applicable') }
  ]
  return options
}

export const gender = () => {
  const options = [
    { value: 0, label: FM('male') },
    { value: 1, label: FM('female') },
    { value: 2, label: FM('other') }
  ]
  return options
}
export const genderType = () => {
  const options = [
    { value: 'male', label: FM('male') },
    { value: 'female', label: FM('female') },
    { value: 'other', label: FM('other') }
  ]
  return options
}

export const followupStatus = () => {
  const options = [
    { value: 0, label: FM('incomplete') },
    // { value: 1, label: FM("completed") },
    { value: 1, label: FM('completed') }
  ]
  return options
}

export const changeActivityResponse = (data = []) => {
  // log("d", moment(new Date()).toLocaleString())
  // log("d", moment(new Date()).zone(-60).toString())0

  const re = []
  if (data?.length > 0) {
    data?.forEach((d, i) => {
      re.push({
        id: d?.id,
        title: d?.title,
        start: isValid(d?.end_date)
          ? formatDate(`${d?.start_date}T${d?.start_time}.000Z`, 'YYYY-MM-DD HH:mm')
          : null,

        end:
          isValid(d?.end_date) && isValid(d?.end_time)
            ? formatDate(`${d?.end_date}T${d?.end_time}.000Z`, 'YYYY-MM-DD HH:mm')
            : null,
        allDay: !(isValid(d?.end_date) && isValid(d?.end_time)),
        extendedProps: {
          calendar:
            d?.status === 1
              ? 'done'
              : d?.status === 2
                ? 'pending'
                : d?.status === 3
                  ? 'notApplicable'
                  : 'upcoming',
          status: parseInt(d?.status),
          is_compulsory: d?.is_compulsory
        }
      })
    })
  }

  return re
}
export const changeFollowUpResponse = (data = []) => {
  // log("d", moment(new Date()).toLocaleString())
  // log("d", moment(new Date()).zone(-60).toString())0

  const re = []
  if (data?.length > 0) {
    data?.forEach((d, i) => {
      re.push({
        id: d?.id,
        title: d?.title,
        start: isValid(d?.end_date)
          ? formatDate(`${d?.start_date}T${d?.start_time}.000Z`, 'YYYY-MM-DD HH:mm')
          : null,
        // start: moment.tz(`${d?.start_date}T${d?.start_time}.000Z`, "Sweden/Stockholm"),
        end:
          isValid(d?.end_date) && isValid(d?.end_time)
            ? formatDate(`${d?.end_date}T${d?.end_time}.000Z`, 'YYYY-MM-DD HH:mm')
            : null,
        allDay: !(isValid(d?.end_date) && isValid(d?.end_time)),
        extendedProps: {
          calendar: d?.is_completed === 1 ? 'is_completed' : 'is_notCOmpleted',
          status: parseInt(d?.status)
        }
      })
    })
  }

  return re
}

export const changeTaskResponse = (data = []) => {
  const re = []
  if (data?.length > 0) {
    data?.forEach((d, i) => {
      re.push({
        id: d?.id,
        title: d?.title,
        start: isValid(d?.end_date)
          ? formatDate(`${d?.start_date}T${d?.start_time}.000Z`, 'YYYY-MM-DD HH:mm')
          : null,
        // start: moment.tz(`${d?.start_date}T${d?.start_time}.000Z`, "Sweden/Stockholm"),
        end:
          isValid(d?.end_date) && isValid(d?.end_time)
            ? formatDate(`${d?.end_date}T${d?.end_time}.000Z`, 'YYYY-MM-DD HH:mm')
            : null,
        allDay: !(isValid(d?.end_date) && isValid(d?.end_time)),
        extendedProps: {
          calendar: d?.status === 1 ? 'is_completed' : 'is_notCOmpleted',
          status: parseInt(d?.status)
        }
      })
    })
  }

  return re
}

export const changeScheduleResponse = (data = []) => {
  const re = []
  log(re)
  if (data?.length > 0) {
    data?.forEach((x, i) => {
      const d = {
        ...x,
        user: decryptObject(forDecryption, x?.user)
      }
      re.push({
        id: d?.id,
        // eslint-disable-next-line prefer-template
        title: d?.user?.name ?? 'No Employee',
        start_time: d?.shift_start_time,
        end_time: d?.shift_end_time,
        start: isValid(d?.shift_start_time) ? new Date(`${d?.shift_start_time}`) : null,
        // start: moment.tz(`${d?.start_date}T${d?.shift_start_time}.000Z`, "Sweden/Stockholm"),
        end:
          isValid(d?.shift_end_time) && isValid(d?.shift_end_time)
            ? new Date(`${d?.shift_end_time}`)
            : null,
        allDay: false,
        extendedProps: {
          calendar:
            d?.leave_applied === 1
              ? d?.leave_type === 'vacation'
                ? 'vacation'
                : 'leave'
              : new Date(d?.shift_end_time).getTime() > new Date().getTime()
                ? 'primary'
                : 'completed',
          status: parseInt(d?.status),
          ...d
        }
      })
    })
  }

  return re
}

export const scheduleDatesHaders = (data = []) => {
  const re = []
  log(re)
  if (data?.length > 0) {
    data?.forEach((d, i) => {
      re.push({
        dates: data
      })
    })
  }

  return re
}

export const changeLeaveResponse = (userTypeId, data = []) => {
  const re = []

  if (data?.length > 0) {
    data?.forEach((d, i) => {
      re.push({
        id: d?.id,
        title:
          userTypeId === UserTypes.company
            ? concatString(decrypt(d?.user?.name), 5)
            : isValid(d?.leave_reason)
              ? concatString(d?.leave_reason, 5)
              : FM('vacation'),
        start: d?.shift_date,
        // start: moment.tz(`${d?.start_date}T${d?.shift_start_time}.000Z`, "Sweden/Stockholm"),
        end: d?.shift_date,
        allDay: true,
        extendedProps: {
          calendar:
            d?.leave_applied === 1
              ? d?.leave_type === 'vacation'
                ? 'vacation'
                : 'leave'
              : new Date(d?.shift_end_time).getTime() > new Date().getTime()
                ? 'primary'
                : 'completed',
          status: parseInt(d?.status),
          is_leave: true,
          ...d
        }
      })
    })
  }

  return re
}

export const loadScheduleLeaveList = (datesArr, scheduleArr, userId = null) => {
  const re = []

  if (isValidArray(scheduleArr) || isValidArray(datesArr)) {
    const schedule = isValidArray(scheduleArr) ? scheduleArr : []
    const dates = isValidArray(datesArr) ? datesArr : []
    log('schedule', schedule)
    log('dates', dates)
    dates?.map((d) => {
      const r = schedule?.filter((f) => formatDate(f?.shift_date) === formatDate(d))
      if (r?.length > 0) {
        r?.forEach((item, i) => {
          re.push({
            id: item?.id,
            shift_date: item?.shift_date,
            empId: item?.user_id,
            shift_id: item?.shift_id,
            shift_start_time: formatDate(item?.shift_start_time, 'HH:mm'),
            shift_end_time: formatDate(item?.shift_end_time, 'HH:mm')
          })
        })
      } else {
        re.push({
          id: '',
          shift_date: formatDate(d),
          empId: isValid(userId) ? userId : null,
          shift_id: ''
        })
      }
    })
    log('re', re)
    return re
  } else {
    return re
  }
}
export const accountStatus = () => {
  const options = [
    { value: 3, label: FM('inactive') },
    { value: 1, label: FM('active') }
  ]
  return options
}

export const createSteps = (
  steps = [],
  visible = (i) => {
    return true
  }
) => {
  const re = []
  steps?.forEach((a, i) => {
    if (visible(i)) {
      re.push(a)
    }
  })
  return re
}

export const getValidTime = (time, format) => {
  return formatDate(`${formatDate(new Date(), 'YYYY-MM-DD')} ${time}`, format)
}
function diff_hours(date2, date1) {
  // let diff = (dt2.getTime() - dt1.getTime()) / 1000
  // diff /= (60 * 60)
  // return Math.abs(Math.round(diff))
  let dateDifference = 0
  if (date2 < date1) {
    dateDifference = date2 - date1
  } else {
    dateDifference = date1 - date2
  }
  return dateDifference
}
export function calculateTime(dateNow, dateFuture) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400)
  diffInMilliSeconds -= days * 86400

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24
  diffInMilliSeconds -= hours * 3600

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60
  diffInMilliSeconds -= minutes * 60

  const totalHours = days >= 1 ? days * 24 + hours : hours

  const difference = {
    days,
    hours,
    minutes,
    totalHours
  }
  return difference
}
export function getExactTime(date1, date2) {
  const milliseconds = Math.abs(new Date(date1) - new Date(date2))

  const secs = Math.floor(Math.abs(milliseconds) / 1000)
  const mins = Math.floor(secs / 60)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  const millisecs = Math.floor(Math.abs(milliseconds)) % 1000
  const multiple = (term, n) => {
    n = n > 0 ? n : 0
    if (n < 10) {
      return `0${n}`
    } else {
      return n
    }
  }

  return {
    days,
    hours: hours % 24,
    hoursTotal: hours,
    minutesTotal: mins,
    minutes: mins % 60,
    seconds: secs % 60,
    secondsTotal: secs,
    milliSeconds: millisecs,
    get diffStr() {
      return `${multiple(`hour`, this.hours)}:${multiple(`min`, this.minutes)}`
      // return `${this.hours}:${this.minutes}`
    },
    get diffStrMs() {
      return `${this.diffStr.replace(` and`, `, `)} and ${multiple(
        `millisecond`,
        this.milliSeconds
      )}`
    }
  }
}

export function getExactTimeWithMili(milliseconds) {
  const secs = Math.floor(Math.abs(milliseconds) / 1000)
  const mins = Math.floor(secs / 60)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  const millisecs = Math.floor(Math.abs(milliseconds)) % 1000
  const multiple = (term, n) => {
    if (n < 10) {
      return `0${n}`
    } else {
      return n
    }
  }

  return {
    days,
    hours: hours % 24,
    hoursTotal: hours,
    minutesTotal: mins,
    minutes: mins % 60,
    seconds: secs % 60,
    secondsTotal: secs,
    milliSeconds: millisecs,
    get diffStr() {
      return `${multiple(`hour`, this.hours)}:${multiple(`min`, this.minutes)}`
    },
    get diffStrMs() {
      return `${this.diffStr.replace(` and`, `, `)} and ${multiple(
        `millisecond`,
        this.milliSeconds
      )}`
    }
  }
}
export const renderPersonType = (person) => {
  let re = ''
  if (person?.is_family_member) {
    re += `${FM('is-family-member')}, `
  }
  if (person?.is_contact_person) {
    re += `${FM('is-contact-person')}, `
  }
  if (person?.is_caretaker) {
    re += `${FM('is-caretaker')}, `
  }
  if (person?.is_guardian) {
    re += `${FM('is-guardian')}, `
  }
  if (person?.is_other) {
    re += person?.is_other_name
  }
  return re
}
export const personalNumberToDob = (p = '') => {
  if (isValid(p)) {
    const str = p
    const onlyNumbers = str.replace(/\D/g, '')
    const flat = String(onlyNumbers).substring(0, 8)
    const date = `${flat.slice(0, 4)}-${flat.slice(4, 6)}-${flat.slice(6, 8)}`
    return date
  }
}
export function getAge(dateString, FM = () => { }, bool = false) {
  const now = new Date()
  const today = new Date(now.getYear(), now.getMonth(), now.getDate())

  const yearNow = now.getYear()
  const monthNow = now.getMonth()
  const dateNow = now.getDate()
  const getDob = personalNumberToDob(dateString)
  const dob = new Date(getDob)

  const yearDob = dob.getYear()
  const monthDob = dob.getMonth()
  const dateDob = dob.getDate()

  let age = {}
  let ageString = 'Invalid Age'
  let yearString = ''
  let monthString = ''
  let dayString = ''

  let yearAge = yearNow - yearDob
  let monthAge = ''
  let dateAge = ''

  if (monthNow >= monthDob) {
    monthAge = monthNow - monthDob
  } else {
    yearAge--
    monthAge = 12 + monthNow - monthDob
  }

  if (dateNow >= dateDob) {
    dateAge = dateNow - dateDob
  } else {
    monthAge--
    dateAge = 31 + dateNow - dateDob

    if (monthAge < 0) {
      monthAge = 11
      yearAge--
    }
  }

  age = {
    years: yearAge,
    months: monthAge,
    days: dateAge
  }

  if (age.years > 1) yearString = FM('years-old')
  else yearString = FM('year-old')
  if (age.months > 1) monthString = FM('months-old')
  else monthString = FM('month-old')
  if (age.days > 1) dayString = FM('days-old')
  else dayString = FM('day-old')

  // if ((age.years > 0) && (age.months > 0) && (age.days > 0)) ageString = `${age.years + yearString}, ${age.months}${monthString}, and ${age.days}${dayString} old.`
  // else if ((age.years === 0) && (age.months === 0) && (age.days > 0)) ageString = `Only ${age.days}${dayString} old!`
  // else if ((age.years > 0) && (age.months === 0) && (age.days === 0)) ageString = `${age.years + yearString} old. Happy Birthday!!`
  // else if ((age.years > 0) && (age.months > 0) && (age.days === 0)) ageString = `${age.years + yearString} and ${age.months}${monthString} old.`
  // else if ((age.years === 0) && (age.months > 0) && (age.days > 0)) ageString = `${age.months + monthString} and ${age.days}${dayString} old.`
  // else if ((age.years > 0) && (age.months === 0) && (age.days > 0)) ageString = `${age.years + yearString} and ${age.days}${dayString} old.`
  // else if ((age.years === 0) && (age.months > 0) && (age.days === 0)) ageString = `${age.months + monthString} old.`
  // else ageString = "Oops! Could not calculate age!"
  // log(age)
  if (age.years > 0) {
    ageString = `${age.years} ${yearString}`
  } else if (age.months > 0) {
    ageString = `${age.months} ${monthString}`
  } else if (age.days > 0) {
    ageString = `${age.days} ${dayString}`
  }
  // log("age", age)
  return bool ? (age.years > 0 || age.months > 0 || age.days > 0) && age?.years < 125 : ageString
}

export const getPatientTypes = (types) => {
  const type = JsonParseValidate(types)
}

export const countPlus = (number, max = number) => {
  return parseInt(number) > max ? `${max}+` : number
}

export const getGenderImage = (gender) => {
  if (gender === 'male') {
    return require('@images/avatars/male2.png').default
  } else if (gender === 'female') {
    return require('@images/avatars/female2.png').default
  } else {
    return require('@images/avatars/avatar-blank.png').default
  }
}

export const isGreaterThanToday = (item) => {
  const zx = moment(new Date(`${item?.start_date} ${item?.start_time}`))
    .add(10, 'm')
    .toDate()
  const CurrentDate = new Date()
  const GivenDate = item?.end_time ? new Date(`${item?.start_date} ${item?.end_time}`) : zx

  if (GivenDate === 'Invalid Date') {
    return false
  }
  if (GivenDate > CurrentDate) {
    return false
  } else {
    return true
  }
}

export const getStartEndDate = (list = []) => {
  const first = 0
  const last = list.length - 1

  return {
    startDate: list[first]?.start_date,
    endDate: list[last]?.start_date
  }
}

export const createBlankArray = (length) => {
  const re = []
  for (let index = 0; index < length; index++) {
    re.push({})
  }
  return re
}
export const copySentTo = () => {
  const options = [
    {
      value: 'i-want-to-report-a-value-damage',
      label: FM('i-want-to-report-a-value-damage')
    },
    {
      value: 'i-want-to-report-a-wild-damage',
      label: FM('i-want-to-report-a-wild-damage')
    }
  ]
  return options
}

export const Type = () => {
  const options = [
    { value: 1, label: FM('in') },
    { value: 2, label: FM('out') }
  ]
  return options
}

export const WithActivity = () => {
  const options = [
    { value: 'yes', label: FM('yes') },
    { value: 'no', label: FM('no') }
  ]
  return options
}

export const Severity = () => {
  const options = [
    { value: '1', label: FM('1') },
    { value: '2', label: FM('2') },
    { value: '3', label: FM('3') },
    { value: '4', label: FM('4') },
    { value: '5', label: FM('5') }
  ]
  return options
}

export const ipStatus = () => {
  const options = [
    { value: 'no', label: FM('not-approve') },
    { value: 1, label: FM('approve/incomplete') },
    { value: 2, label: FM('completed') }
  ]
  return options
}
export const activityWithJournal = () => {
  const options = [
    { value: 2, label: FM('without-journal') },
    { value: 1, label: FM('with-journal') }
  ]
  return options
}
export const activityWithDeviation = () => {
  const options = [
    { value: 2, label: FM('without-deviation') },
    { value: 1, label: FM('with-deviation') }
  ]
  return options
}
export const ipWithActivity = () => {
  const options = [
    { value: 2, label: FM('without-activity') },
    { value: 1, label: FM('with-activity') }
  ]
  return options
}
export const ipWithFollowup = () => {
  const options = [
    { value: 2, label: FM('without-followup') },
    { value: 1, label: FM('with-followup') }
  ]
  return options
}
export const requestedDays = () => {
  const options = [
    { value: 1, label: FM('today') },
    { value: 7, label: FM('week') },
    { value: 30, label: FM('month') }
  ]
  return options
}

export const GetIcons = ({ type }) => {
  let IX = File
  switch (type) {
    case 'activity':
      IX = Activity
      break
    default:
      IX = File
      break
  }
  return <IX size={14} />
}

export const getBookmarked = (data, match = 1) => {
  const re = []
  if (isValidArray(data)) {
    data?.forEach((d, i) => {
      // if (d?.is_bookmarked === match) {
      re.push({
        ...d,
        isBookmarked: 1,
        ...d?.bookmark_master
      })
      // }
    })
  }
  return re
}
export const getStatusId = (status) => {
  const success = 1
  const warning = 2
  const danger = 3
  return status === 'success' ? success : status === 'warning' ? warning : danger
}
export const taskStatus = () => {
  const options = [
    { value: 'no', label: FM('incomplete') },
    { value: 1, label: FM('complete') }
  ]
  return options
}

export const manageFileFilter = () => {
  const options = [
    // { value: null, label: FM("admin") },
    { value: 3, label: FM('company-to-employee') },
    { value: 6, label: FM('company-to-patient') }
  ]
  return options
}

export const fromNow = (data) => {
  return moment(data).fromNow()
}

export const fastLoop = (array, change = () => { }) => {
  const theArray = array ?? []
  const arrayLength = theArray.length
  let x = 0
  while (x < arrayLength) {
    const arr = theArray[x]
    change(arr, x)
    x++
  }
}

export const changeUserResponse = (chat, contacts, user, add = false) => {
  const u = []
  let um = 0
  fastLoop(chat, (d, i) => {
    um += d?.unread_messages_count
    if (d?.sender_id === user?.id) {
      u[i] = {
        id: d?.receiver?.id,
        fullName: d?.receiver?.name,
        role: d?.receiver?.user_type?.name,
        about: '',
        avatar: d?.receiver?.avatar,
        status: 'offline',
        chat: {
          id: d?.receiver?.id,
          unseenMsgs: !add ? d?.unread_messages_count : 0,
          lastMessage: {
            time: d?.updated_at,
            message: d?.message
          }
        }
      }
    } else {
      u[i] = {
        id: d?.sender?.id,
        fullName: d?.sender?.name,
        role: d?.sender?.user_type?.name,
        about: '',
        avatar: d?.sender?.avatar,
        status: 'offline',
        chat: {
          id: d?.sender?.id,
          unseenMsgs: !add ? d?.unread_messages_count : 0,
          lastMessage: {
            time: d?.updated_at,
            message: d?.message
          }
        }
      }
    }
  })
  const c = []

  fastLoop(contacts, (d, i) => {
    um += d?.unread_messages_count
    if (d?.unread_messages_count > 0) {
      u[i] = {
        id: d?.id,
        fullName: d?.name,
        role: d?.user_type?.name,
        about: '',
        avatar: d?.avatar,
        status: 'offline',
        chat: {
          id: d?.id,
          unseenMsgs: d?.unread_messages_count,
          lastMessage: d?.message ?? null
        }
      }
    }
    c[i] = {
      id: d?.id,
      fullName: d?.name,
      role: d?.user_type?.name,
      about: '',
      avatar: d?.avatar,
      status: 'offline',
      chat: {
        id: d?.id,
        unseenMsgs: d?.unread_messages_count,
        lastMessage: d?.message ?? null
      }
    }
  })
  return {
    chatsContacts: u,
    contacts: c,
    unread_messages_count: um,
    profileUser: {}
  }
}

export const getChatResponse = (payload, chats) => {
  const messages = payload?.data?.data
  const user = payload?.user
  const update = payload?.update ?? false
  const m = update ? chats : []

  fastLoop(messages?.data, (d, i) => {
    if (update) {
      m.unshift({
        id: d?.id,
        time: new Date(d?.created_at),
        message: d?.message,
        senderId: d?.sender_id,
        ...d
      })
    } else {
      m[i] = {
        id: d?.id,
        time: new Date(d?.created_at),
        message: d?.message,
        senderId: d?.sender_id,
        ...d
      }
    }
  })

  return {
    chat: {
      id: user?.id,
      userId: user?.id,
      unseenMsgs: 0,
      chat: m.sort(function (a, b) {
        return a.id - b.id
      }),
      ...messages,
      data: null
    },
    contact: {
      ...user
    }
  }
}

export const fetchMessage = (user, data, dispatch = () => { }, chats = [], selected = null) => {
  log('fm', data)
  if (data?.command === 'message') {
    if (data?.from === user?.id) {
      // message sent
      if (chats?.findIndex((a) => a.id === data?.id) === -1) {
        dispatch(
          sendMessageSelected({
            id: data?.id,
            message: data?.message,
            time: new Date(data?.created_at),
            senderId: data?.from,
            ...data
          })
        )
      }
    } else {
      // message received
      if (selected?.id) {
        if (
          chats?.findIndex((a) => a.id === data?.id) === -1 &&
          isValid(selected?.id) &&
          selected?.id === data?.from
        ) {
          dispatch(
            receiveMessageSelected({
              id: data?.id,
              message: data?.message,
              time: new Date(data?.created_at),
              senderId: data?.from,
              ...data
            })
          )
        }
      }
    }
  }
}

export const changeConnectedUsersResponse = (data) => {
  const r = []
  if (isValid(data)) {
    const a = data
    const x = Object.entries(a)
    for (const [key, val] of x) {
      const user = key
      const ids = Object.entries(val)?.map((a) => a[1])?.length > 0
      if (ids) {
        r.push(parseInt(user))
      }
    }
    // log("x", x)
  }
  // log("r", r)

  return r
}
export const findLatestSchedule = (schData, success = () => { }) => {
  const data = schData
  const schedules = []
  if (isValidArray(schData)) {
    fastLoop(data, (d, i) => {
      schedules.push({
        ...d,
        start_time: `${d?.shift_start_time}`,
        end_time: `${d?.shift_end_time}`,
        ist_start_time: new Date(`${d?.shift_start_time}`),
        ist_end_time: new Date(`${d?.shift_end_time}`)
      })
    })
    schedules?.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.start_time) - new Date(a.end_time)
    })
    const current_time = new Date()

    const latestOne = schedules.filter((a) => {
      if (
        current_time.getTime() <= a?.ist_end_time?.getTime() &&
        current_time?.getTime() >= a?.ist_start_time
      ) {
        return true
      }
    })

    log('testXX', latestOne)
    log('test', schedules)
    success(latestOne)
  }
}

export const getAllotedDays = (startDate, endDate, oneDay) => {
  return Math.round(Math.abs(oneDay / (endDate - startDate)))
}

export const viewInHours = (minutes) => {
  let h = Math.floor(minutes / 60)
  let m = Math.round(minutes % 60)
  h = h > 0 ? h : 0
  m = m > 0 ? m : 0
  h = h < 10 ? `0${h}` : h
  m = m < 10 ? `0${m}` : m
  return `${h}:${m}`
}
export function getDates(startDate, endDate) {
  const date = new Date(startDate.getTime())

  const dates = []

  while (date <= endDate) {
    dates.push(formatDate(new Date(date)), 'YYYY-MM-DD')
    date.setDate(date.getDate() + 1)
  }

  return dates.filter((a) => a !== 'YYYY-MM-DD')
}

export const getAmPm = (time, date = null, format = 'hh:mm A') => {
  if (typeof time === 'object') {
    return formatDate(time, format)
  }
  return formatDate(`${formatDate(new Date(date), 'YYYY-MM-DD')} ${time}`, format)
}

export const DynamicIcon = (icon) => {
  return isValid(icon) ? icon : null
}

export function getMonday(d) {
  d = new Date(d)
  const day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

export const getFirstAndLast = (d) => {
  const curr = new Date(d)
  const firstDay = getMonday(d)
  const lastDay = new Date(addDay(firstDay, 6))

  return { firstDay, lastDay }
}
export function getWeeksDiff(startDate, endDate) {
  const msInWeek = 1000 * 60 * 60 * 24 * 7

  return Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / msInWeek)
}

export function currencySign() {
  return <span className='fw-bolder'>kr</span>
}

export const emitAlertStatus = (e, payload = null, eventId = Events.confirmAlert) => {
  Emitter.emit(eventId, { type: e, payload: isValid(payload) ? payload : null })
}

export const getWeekNumber = (date) => {
  const dt = new Date(date)
  const tdt = new Date(dt.valueOf())
  const dayn = (dt.getDay() + 6) % 7
  tdt.setDate(tdt.getDate() - dayn + 3)
  const firstThursday = tdt.valueOf()
  tdt.setMonth(0, 1)
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7))
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000)
}

export const walkStatus = () => {
  const options = [
    { value: 'scheduled', label: FM('scheduled') },
    { value: 'walkin', label: FM('walkin') }
  ]
  return options
}

export const handleBankIdRedirect = (list) => {
  log(list)
  if (isValidArray(list)) {
    list.forEach((l, i) => {
      if (isValid(l?.response?.redirectUrl)) {
        const w = window.open(l?.response?.redirectUrl, '_blank')
        let isOpen = true
        const i = setInterval(() => {
          if (!isOpen) {
            emitAlertStatus('failed')
            clearInterval(i)
          }
          if (w.closed) {
            isOpen = false
          } else {
            isOpen = true
          }
        }, 1000)
      } else {
        // ErrorToast(l?.errorObject?.message)
      }
    })
  }
}

export const SpaceTrim = (str) => {
  return /^\s*$/.test(str)
}
export const getYear = (startYear) => {
  const currentYear = new Date().getFullYear(),
    years = []
  startYear = startYear || 2020
  while (startYear <= currentYear + 3) {
    years.push(startYear++)
  }
  return years
}
export function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function hexToRgbA(hex) {
  let c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('')
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = `0x${c.join('')}`
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255]
  }
  throw new Error('Bad Hex')
}

export const hrsStatus = () => {
  const options = [
    { value: 0, label: FM('no-leave') },
    { value: 1, label: FM('leave/vacation') }
  ]
  return options
}
export function msToTime(duration) {
  // eslint-disable-next-line prefer-const
  let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor(duration / (1000 * 60 * 60))

  hours = hours < 10 ? `0${hours}` : hours
  minutes = minutes < 10 ? `0${minutes}` : minutes
  seconds = seconds < 10 ? `0${seconds}` : seconds
  if (minutes === 0) return hours
  else return `${hours}:${minutes}`
  // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

export const sortedActivity = (activity) => {
  return [...activity].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}
export const formatMessage = (key, value) => {
  const boldKey = (key) => `<strong>${FM(key)}</strong>`

  switch (key) {
    case 'selected_option':
      key = FM(`action`)
      return `${boldKey(key)} : ${FM(value)} `
    case 'before_minutes':
      key = FM('before-start')
      return value === 0
        ? `${boldKey(key)} ${boldKey('reminder')} ${FM('set-off')}`
        : `${boldKey(key)} ${boldKey('reminder')} : ${value} min`
    case 'after_minutes':
      key = FM('after-end')
      return value === 0
        ? `${boldKey(key)} ${boldKey('reminder')} ${FM('set-off')}`
        : `${boldKey(key)} ${boldKey('reminder')} : ${value} min`
    case 'emergency_minutes':
      key = FM('emergency')
      return value === 0
        ? `${boldKey(key)} ${boldKey('reminder')} ${FM('set-off')}`
        : `${boldKey(key)} ${boldKey('reminder')} : ${value} min`
    case 'in_time':
      key = FM('on-start')
      return value === 1
        ? `${boldKey(key)} ${boldKey('reminder')} ${FM('set-on')}`
        : `${boldKey(key)} ${boldKey('reminder')} ${FM('set-off')}`
    case 'is_risk':
      return value === 1 ? FM(`at-risk`) : FM(`not-at-risk`)
    case 'is_compulsory':
      return value === 1 ? FM(`is-priority`) : FM(`not-priority`)
    case 'status':
      if (value === 1) {
        return FM(`activity-done`)
      } else if (value === 2) {
        return `${FM('activity-not-done')}`
      }
      break

    default:
      return `${boldKey(key)} : ${value}`
  }
}

export const getCounts = (data, total, per_page) => {
  let re = 0

  if (data) {
    if (data.total && data.per_page) {
      re = Math.ceil(data.total / parseInt(data.per_page))
    } else if (total && per_page) {
      re = Math.ceil(total / parseInt(per_page))
    }
  }

  return re
}

export const Searching = ({ handleSearchChange, showSearchBar = null }) => {
  return (
    <Show IF={showSearchBar}>
      <div style={{ position: 'relative', width: '200px', marginRight: '20px' }}>
        <Search
          color='#505888'
          size={16}
          style={{
            position: 'absolute',
            top: '50%',
            left: '5px',
            transform: 'translateY(-50%)'
          }}
        />
        <input
          type='text'
          placeholder={FM('search')}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            height: '35px',
            padding: '5px 30px',
            borderRadius: '5px',
            border: '1px solid #505888'
          }}
        />
      </div>
    </Show>
  )
}
export const ViewAllLink = ({ path, label }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        height: '40px'
      }}
    >
      <Link to={path}>{label}</Link>
    </div>
  )
}
