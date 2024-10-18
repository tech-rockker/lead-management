import { isValid, isValidArray } from './helpers/common'

export const Patterns = Object.freeze({
  AlphaOnly: /^[a-zA-Z ]*$/,
  AlphaOnlyNoSpace: /^[a-zA-Z]*$/,
  AlphaNumericOnlyNoSpace: /^[a-zA-Z0-9]*$/,
  AlphaNumericOnly: /^[a-zA-Z0-9 ]*$/,
  NumberOnly: /^\d+(\.\d{1,2})?$/,
  NumberOnlyNoDot: /^[0-9]*$/,
  EmailOnly: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  Password: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
  PersonalNumber: /^\d{8}-\d{4}$/
})

export const IconSizes = Object.freeze({
  InputAddon: 16,
  HelpIcon: 12,
  MenuVertical: 22,
  CardListIcon: 15
})

export const Events = Object.freeze({
  Unauthenticated: 'Unauthenticated',
  reactSelect: 'reactSelect',
  RedirectMessage: 'goToMessage',
  RedirectNotification: 'goToNotification',
  created: 'created',
  updated: 'updated',
  deleted: 'deleted',
  approved: 'approved',
  assigned: 'assigned',
  stampIn: 'stampIn',
  stampOut: 'stampOut',
  leaveRequest: 'leaveRequest',
  leaveApproved: 'leaveApproved',
  bankIdVerification: 'bankIdVerification',
  emergency: 'emergency',
  completed: 'completed',
  request: 'request',

  // Confirm Alert Events
  confirmAlert: 'confirmAlert',
  reloadStampData: 'reloadStampData'
})

export const WebAppVersion = Object.freeze({
  current: '0.0.1'
})
export const UserTypes = Object.freeze({
  admin: 1,
  company: 2,
  employee: 3,
  adminEmployee: 16,
  hospital: 4,
  nurse: 5,
  patient: 6,
  caretaker: 7,
  familyMember: 8,
  contactPerson: 9,
  careTakerFamily: 10,
  other: 15,
  guardian: 12,
  branch: 11
})
export const BelongsTo = Object.freeze({
  admin: 1,
  company: 2
})
export const CategoryType = Object.freeze({
  activity: 1,
  implementation: 2,
  user: 3,
  deviation: 4,
  followups: 5,
  jaurnal: 6,
  patient: 7,
  file: 9
  // employee: 3
  // implementation: 2
  // other: 9
})
export const CreateCatType = Object.freeze({
  other: CategoryType.implementation,
  deviation: CategoryType.deviation
})
export const SourceTypes = Object.freeze({
  activity: CategoryType.activity,
  deviation: CategoryType.deviation,
  employee: CategoryType.user,
  followups: CategoryType.followups,
  implementation: CategoryType.implementation,
  journal: CategoryType.jaurnal,
  patient: CategoryType.patient,
  file: CategoryType.file
})
export const InputMask = Object.freeze({
  OrgNumber: {
    delimiter: '-',
    blocks: [6, 4],
    numericOnly: true
  },
  PersonalPhone: {
    delimiter: '-',
    blocks: [6, 4],
    numericOnly: true
  },
  Phone: {
    prefix: '0',
    delimiter: '-',
    blocks: [4, 3, 3],
    numericOnly: true
  },
  PersonalNumber: {
    delimiter: '-',
    blocks: [4, 2, 2, 4],
    numericOnly: true
  }
})

export const repetitionType = Object.freeze({
  day: 1,
  week: 2,
  month: 3,
  year: 4
})

export const repetitionTypeForPatient = Object.freeze({
  week: 2
})

export const weekDays = Object.freeze({
  mon: '1',
  tus: '2',
  wed: '3',
  thu: '4',
  fri: '5',
  sat: '6',
  sun: '0'
})
export const weekDays2 = Object.freeze({
  mon: '1',
  tus: '2',
  wed: '3',
  thu: '4',
  fri: '5',
  sat: '6',
  sun: '7'
})
export const DefaultLanguage = Object.freeze({
  English: 'en',
  Swedish: 'se',
  French: 'fr'
})
export const gender = Object.freeze({
  male: 'male',
  female: 'female',
  other: 'other'
})
export const fetchSelectedEvent = Object.freeze({
  activity: 1,
  followups: 2,
  task: 3
})
export const status = Object.freeze({
  done: 1,
  pending: 2,
  noApplicable: 3,
  upcoming: 0
})
export const weekRepetition = Object.freeze({
  'every-first-week': 1,
  'every-second-week': 2,
  'every-third-week': 3,
  'every-fourth-week': 4,
  'every-fifth-week': 5,
  'every-sixth-week': 6,
  'every-seventh-week': 7,
  'every-eighth-week': 8
})

export const repetitionWeekDays = Object.freeze({
  mon: '1',
  tus: '2',
  wed: '3',
  thu: '4',
  fri: '5',
  sat: '6',
  sun: '0'
})
export const repetitionWeekend = Object.freeze({
  sat: '6',
  sun: '0'
})
export const otherActivityTypes = Object.freeze({
  'short-term-activity': 'short-term',
  'daily-activity': 'daily',
  other: 'other'
})
export const monthDaysOptions = (FM = () => {}) => {
  const days = []
  for (let index = 1; index <= 31; index++) {
    days.push({
      label: `${FM('day')} ${index}`,
      value: index
    })
  }
  days.push({
    label: FM('last_day'),
    value: 0
  })
  return days
}

export const entryPoint = `web-${WebAppVersion.current}`

export const goalTypes = Object.freeze({
  'no-restriction': 'no-restriction',
  'slight-restriction': 'slight-restriction',
  'moderate-restriction': 'moderate-restriction',
  'large-limitation': 'large-limitation',
  'total-limitation': 'total-limitation',
  'non-specific': 'non-specific'
})

export const subGoalTypes = Object.freeze({
  'maintain-ability': 'maintain-ability',
  'improve-ability': 'improve-ability',
  'develop-ability': 'develop-ability',
  'improve-participation': 'improve-participation',
  'manage-independently': 'manage-independently',
  'non-specific': 'non-specific'
})

export const goals = Object.freeze({
  other: 'other',
  'Pre-defined Goal': 'Pre-defined Goal'
})

export const overallGoals = Object.freeze({
  'good-living-conditions': 'good-living-conditions',
  'full-participation': 'full-participation',
  'living-like-others': 'living-like-others',
  'living-an-independent-life': 'living-an-independent-life',
  'not-specified': 'not-specified',
  'not-applicable': 'not-applicable'
})

export const whoGiveSupport = Object.freeze({
  caretaker: 'caretaker',
  staff: 'staff'
})

export const notDoneBy = Object.freeze({
  'patient-did-not-want': '3',
  'not-done-by-employee': '4'
})
export const markAsComplete = Object.freeze({
  'completed-by-staff-on-time': '1', // no action
  'completed-by-staff-not-on-time': '2', //
  'completed-by-patient-itself': '3', //
  'patient-did-not-want': '4', //
  'not-done-by-employee': '5' //
})

export const deviationJournal = Object.freeze({
  journal: '0',
  deviation: '1'
})
export const VerifiedType = Object.freeze({
  no: '0',
  yes: '1'
})
export const VerifiedMethod = Object.freeze({
  // eslint-disable-next-line quote-props
  bankId: 'bank_id',
  // eslint-disable-next-line quote-props
  normal: 'normal'
})

export const approveTo = Object.freeze({
  'assign-employee': false,
  'notify-employee': true
})

export const empType = Object.freeze({
  seasonal: '3',
  regular: '1',
  substitute: '2',
  other: '4'
})

const checkManualWorkStudy = (data, key, type) => {
  let re = false
  if (isValidArray(data?.patient_type_id)) {
    if (data?.patient_type_id?.includes(type)) {
      re = isValid(data[key])
    } else re = true
  } else {
    re = false
  }
  return re
}

export const getWeeksDiff = (startDate, endDate) => {
  const msInWeek = 1000 * 60 * 60 * 24 * 7
  return parseInt(Math.round(Math.abs(endDate - startDate) / msInWeek))
}
export const getWeekLables = (count) => {
  const rows = []
  for (let i = 0; i < count; i++) {
    rows.push(`week${i + 1}`)
  }
  return rows
}

export const getAllotedTime = (startDate, endDate) => {
  const allotedHour = 1000 * 60 * 60 * 24 * 7

  return parseInt(Math.round(Math.abs(allotedHour) / (endDate - startDate)))
}

export const incompletePatientFields = Object.freeze({
  'personal-details': {
    name: '',
    email: '',
    gender: '',
    personal_number: '',
    contact_number: '',
    custom_unique_id: ''
  },
  'relative-caretaker': {
    personCount: 'length',
    persons: 'json'
  },
  'disability-details': {
    disease_description: '',
    aids: '',
    special_information: ''
  },
  'studies-work': {
    patient_type_id: 'json',
    institute_name: (data) => checkManualWorkStudy(data, 'institute_name', '2'),
    institute_contact_number: (data) => checkManualWorkStudy(data, 'institute_contact_number', '2'),
    institute_full_address: (data) => checkManualWorkStudy(data, 'institute_full_address', '2'),
    institute_contact_person: (data) => checkManualWorkStudy(data, 'institute_contact_person', '2'),
    institute_week_days: (data) => checkManualWorkStudy(data, 'institute_week_days', '2'),
    classes_from: (data) => checkManualWorkStudy(data, 'classes_from', '2'),
    classes_to: (data) => checkManualWorkStudy(data, 'classes_to', '2'),

    company_name: (data) => checkManualWorkStudy(data, 'company_name', '3'),
    company_contact_number: (data) => checkManualWorkStudy(data, 'company_contact_number', '3'),
    company_full_address: (data) => checkManualWorkStudy(data, 'company_full_address', '3'),
    company_contact_person: (data) => checkManualWorkStudy(data, 'company_contact_person', '3'),
    company_week_days: (data) => checkManualWorkStudy(data, 'company_week_days', '3'),
    from_timing: (data) => checkManualWorkStudy(data, 'from_timing', '3'),
    to_timing: (data) => checkManualWorkStudy(data, 'to_timing', '3')
  },
  'decision-document': {
    agency_hours: 'json'
  }
})

export const incompletePatientSteps = Object.freeze({
  'personal-details': 1,
  'relative-caretaker': 2,
  'disability-details': 3,
  'studies-work': 4,
  'other-activities': 5,
  'decision-document': 6
})

export const companyTypes = Object.freeze({
  single: 3,
  home: 2,
  group: 1
})

export const roleTypes = Object.freeze({
  company: {
    employees: UserTypes.employee
    // patient: UserTypes.patient
  },
  admin: {
    employees: UserTypes.adminEmployee
  }
})

export const roleType = Object.freeze({
  company: {
    employees: UserTypes.employee,
    patient: UserTypes.patient
  },
  admin: {
    employee: UserTypes.adminEmployee
  }
})

export const userFields = Object.freeze({
  id: '',
  avatar: '',
  user_type_id: '',
  role_id: '',
  custom_unique_id: '',
  category_id: '',
  country_id: '',
  branch_id: '',
  dept_id: '',
  govt_id: '',
  patient_type_id: 'json',
  company_type_id: 'json',
  working_from: '',
  working_to: '',
  place_name: '',
  agency_hours: '',
  name: '',
  email: '',
  password: '',
  confirm_password: '',
  contact_number: '',
  gender: '',
  personal_number: '',
  organization_number: '',
  city: '',
  postal_code: '',
  zipcode: '',
  full_address: '',
  license_key: '',
  license_end_date: '',
  is_substitute: '',
  is_regular: '',
  is_seasonal: '',
  is_secret: '',
  joining_date: '',
  establishment_date: '',
  user_color: '',
  is_file_required: '',
  persons: '',
  disease_description: '',
  postal_area: '',
  agencies_id: '',
  company_type_id: 'json',
  aids: '',
  special_information: '',
  another_activity: '',
  another_activity_name: '',
  another_activity_contact_person: '',
  activitys_contact_number: '',
  activitys_full_address: '',
  another_activity_end_time: '',
  another_activity_start_time: '',
  week_days: 'json',
  institute_name: '',
  institute_contact_number: '',
  institute_full_address: '',
  institute_contact_person: '',
  institute_week_days: 'json',
  classes_from: '',
  classes_to: '',
  company_name: '',
  company_contact_number: '',
  company_full_address: '',
  company_contact_person: '',
  company_week_days: 'json',
  from_timing: '',
  to_timing: '',
  documents: 'json',
  contract_type: '',
  contract_value: '',
  employee_type: '',
  contact_person_number: '',
  assigned_employee: '',
  assigned_patiens: '',
  verification_method: ''
})

export const ipFields = Object.freeze({
  // Step 1
  user_id: '',
  persons: [],

  // Step 2
  category_id: '',
  subcategory_id: '',
  title: '',
  subcategory: '',
  save_as_template: '',
  branch_id: '',

  goal: '',

  limitations: '',
  limitation_details: '',

  how_support_should_be_given: '',
  who_give_support: 'json',

  sub_goal: '',
  sub_goal_selected: '',
  sub_goal_details: '',

  start_date: '',
  end_date: '',

  // Step 3
  overall_goal: '',
  overall_goal_details: '',

  // step 4
  body_functions: '',
  personal_factors: '',
  health_conditions: '',
  other_factors: '',

  // Step 5
  treatment: '',
  working_method: '',

  // step 6
  documents: 'json'
})

export const IpTemplatesFiled = Object.freeze({
  // Step 2
  title: '',
  goal: '',

  limitations: '',
  limitation_details: '',

  how_support_should_be_given: '',
  who_give_support: 'json',

  sub_goal: '',
  sub_goal_selected: '',
  sub_goal_details: '',

  start_date: '',
  end_date: ''
})

export const selectCategoryType = Object.freeze({
  activity: 1,
  implementation: 2,
  followups: 5,
  patient: 7,
  branch: 8,
  jaurnal: 6,
  deviation: 4
})

export const selectCategoryTypes = Object.freeze({
  // activity: 1,
  patient: 7
})

export const selectScheduleType = Object.freeze({
  basic: 1,
  extra: 2
})

export const incompleteIpFields = Object.freeze({
  'select-patient': {
    user_id: '',
    // personCount: "length",
    persons: 'json'
  },
  'living-area': {
    category_id: '',
    subcategory_id: '',
    title: '',
    limitations: '',
    limitation_details: '',
    goal: '',
    start_date: '',
    end_date: '',
    who_give_support: 'json',
    how_support_should_be_given: '',
    sub_goal_selected: '',
    sub_goal_details: '',
    sub_goal: ''
  },
  'ip-overall-goal': {
    overall_goal: '',
    overall_goal_details: ''
  },
  'ip-related-factors': {
    body_functions: '',
    personal_factors: '',
    health_conditions: '',
    other_factors: ''
  },
  'ip-treatment-working': {
    treatment: '',
    working_method: ''
  },
  'ip-file': {
    admin_files: ''
  }
})

export const incompleteIpSteps = Object.freeze({
  'select-patient': 1,
  'living-area': 2,
  'ip-overall-goal': 3,
  'ip-related-factors': 4,
  'ip-treatment-working': 5,
  'ip-file': 6
})
export const ContractType = Object.freeze({
  'contract-hourly': 1,
  'contract-fixed': 2
})

export const CompanyTypes = Object.freeze({
  'group-living': 1,
  'home-living': 2,
  'singe-living': 3
})

export const CMD = Object.freeze({
  getContacts: 'getusers',
  connectedUsers: 'connectedusers',
  getChats: 'getuserwithmessage',
  getMessages: 'getmessages',
  message: 'message',
  readMessages: 'readmessages',
  totalUnreadMessage: 'totalunreadmessage'
})

export const acceptTask = Object.freeze({
  yes: 'yes',
  no: 'no'
})

export const approveStatus = Object.freeze({
  approved: 'yes',
  'not-approved': 'no'
})

export const Modules = Object.freeze({
  schedule: 'Schedule',
  deviation: 'Deviation',
  journal: 'Journal',
  activity: 'Activity',
  stampling: 'Stampling',
  fileManagement: 'File Management'
})

export const ShiftType = Object.freeze({
  basic: 'normal',
  emergency: 'emergency'
  // SleepingEmergency: "sleeping_emergency"
})

export const leaveType = Object.freeze({
  yes: 'vacation',
  no: 'leave'
})

export const presets = Object.freeze({
  thisWeek: 'this-week',
  thisMonth: 'this-month',
  prevMonth: 'pre-month',
  nextMonth: 'next-month'
})

export const presetsCurrentMonth = Object.freeze({
  thisWeek: 'this-week',
  thisMonth: 'this-month',
  prevMonth: 'pre-month'
})
export const perPageOptions = Object.freeze({
  'per-page-10': 10,
  'per-page-20': 20,
  'per-page-30': 30,
  'per-page-40': 40,
  'per-page-50': 50
})

export const forDecryption = Object.freeze({
  name: '',
  personal_number: '',
  full_address: '',
  company_address: '',
  email: '',
  contact_number: '',
  city: '',
  zipcode: '',
  postal_code: ''
})
