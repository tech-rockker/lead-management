import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Row, Spinner } from 'reactstrap'
import moment from 'moment'
import { companyLeave, loadLeave } from '../../../utility/apis/leave'
import { loadSchedule } from '../../../utility/apis/schedule'
import { loadUser } from '../../../utility/apis/userManagement'
import { empType, forDecryption, leaveType, UserTypes } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import Show from '../../../utility/Show'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  decryptObject,
  fastLoop,
  formatDate,
  loadScheduleLeaveList,
  WarningToast
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
//changes in comapny7 leve
export default function CompanyLeaves({
  edit = null,
  active,
  noView = false,
  showModal = false,
  setReload,
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) {
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [leaveLoading, setLeaveLoading] = useState(false)
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [scArr, setScArr] = useState([])
  const [leave, setLeave] = useState([])
  const [empLeave, setEmpLeave] = useState([])
  const [leaveArr, setLeaveArr] = useState([])
  const [arr, setArr] = useState([])
  const [emp, setEmp] = useState(null)
  const [errorState, setErrorState] = useState([])
  const user = useUser()
  const dispatch = useDispatch()
  const form = useForm()
  const [key, setKey] = useState(new Date())
  const [ids, setIds] = useState([])
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    setError,
    getValues
  } = form
  const dateRef = useRef()

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    setScArr([])
    setArr([])
    setLeaveArr([])
    if (edit === null) setEditData(null)
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  const loadEmpOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: {
        search,
        branch_id: isValid(watch('branch_id'))
          ? watch('branch_id')
          : user?.user_type_id === UserTypes.branch || user?.user_type_id === UserTypes.company
          ? user?.id
          : user?.branch_id,
        user_type_id: UserTypes.employee
      }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setEmp, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  const loadLeaveArr = (month = null) => {
    const currentCalMonth = dateRef.current?.flatpickr?.currentMonth
    const currentMonth = moment().month()
    const startOfMonth =
      currentMonth === currentCalMonth
        ? formatDate(new Date(), 'YYYY-MM-DD')
        : moment().month(month).startOf('month').toDate()
    const endOfMonth = moment().month(month).endOf('month').toDate()
    if (watch('emp_id')) {
      loadLeave({
        loading: setLeaveLoading,
        jsonData: {
          emp_id: watch('emp_id'),
          start_date: formatDate(startOfMonth),
          end_date: formatDate(endOfMonth)
        },
        success: (e) => {
          setLeave(e?.payload?.map((d, i) => d?.shift_date))
        }
      })
    }
  }

  const loadEmployeeLeve = (id, date, i) => {
    if (isValid(id) && isValid(date)) {
      loadLeave({
        loading: setLeaveLoading,
        jsonData: {
          emp_id: id,
          start_date: date,
          end_date: date
        },
        success: (e) => {
          setEmpLeave({
            ...empLeave,
            [id]: e?.payload
          })
          const index = errorState?.findIndex((e) => e === i)
          const finalArray = errorState ?? []

          if (e?.payload?.length > 0 && isValid(i)) {
            WarningToast('this-employee-is-not-working-on-this-date')
            if (index === -1) {
              finalArray?.push(i)
            }
          } else {
            finalArray?.splice(index, 1)
          }

          // if (index === -1) {
          //     finalArray?.push(i)
          // } else {
          //     finalArray?.splice(index, 1)
          // }
          // log(finalArray)
          // if (finalArray?.length === 0) {
          //     state(null)
          // } else {
          setErrorState([...finalArray])
        }
      })
    }
  }

  const loadScheduleArr = (month = null) => {
    const currentCalMonth = dateRef.current?.flatpickr?.currentMonth
    const currentMonth = moment().month()
    const startOfMonth =
      currentMonth === currentCalMonth
        ? formatDate(new Date(), 'YYYY-MM-DD')
        : moment().month(month).startOf('month').toDate()
    const endOfMonth = moment().month(month).endOf('month').toDate()
    if (watch('emp_id')) {
      loadSchedule({
        loading: setLeaveLoading,
        jsonData: {
          user_id: watch('emp_id'),
          leave_applied: 0,
          // status: 1,
          is_active: 1,
          shift_start_date: formatDate(startOfMonth),
          shift_end_date: formatDate(endOfMonth)
        },
        success: (e) => {
          setScArr(e?.payload?.map((d, i) => d?.shift_date))
          if (isValidArray(e?.payload)) {
            const selectedArr = e?.payload?.sort((a, b) => {
              return new Date(a?.shift_date) - new Date(b.shift_date)
            })
            setLeaveArr(selectedArr)
          }
        }
      })
    }
  }
  useEffect(() => {
    if (dateRef.current?.flatpickr?.currentMonth) {
      loadLeaveArr(dateRef.current?.flatpickr?.currentMonth)
      loadScheduleArr(dateRef.current?.flatpickr?.currentMonth)
    }
  }, [dateRef.current?.flatpickr?.currentMonth, watch('emp_id')])

  const toggleArrayBy = (value, array = [], state = () => {}, find = (e) => e === value) => {
    const index = array?.findIndex((e) => find(e))
    const finalArray = array ?? []
    if (index === -1) {
      finalArray?.push(value)
    } else {
      if (isValid(value)) {
        finalArray[index] = value
      } else {
        finalArray?.splice(index, 1)
      }
    }
    state([...finalArray])
  }
  useEffect(() => {
    log('date', watch('leaves[0][dates]'))
    const re = loadScheduleLeaveList(watch('leaves[0][dates]'), leaveArr, watch('emp_id'))
    if (isValidArray(re)) {
      fastLoop(re, (d, i) => {
        const datas = {
          date: formatDate(d?.shift_date),
          schedule_id: d?.id ?? '',
          assign_emp: null
        }
        toggleArrayBy(datas, ids, setIds, (e) => e?.date === formatDate(d?.shift_date))
      })
    } else {
      setIds([])
    }
    setArr(re)
  }, [watch('leaves[0][dates]'), leaveArr, watch('emp_id')])

  // useEffect(() => {
  //     loadLeaveArr()
  //     loadScheduleArr()
  // }, [watch("emp_id")])

  const handleSave = (data) => {
    const leavesData = isValidArray(ids) && !watch('notify') ? ids : []

    const dates = isValidArray(watch('leaves[0][dates]'))
      ? watch('leaves[0][dates]')?.map((d) => {
          return {
            date: d,
            schedule_id: null,
            assign_emp: null
          }
        })
      : []
    const notifyData = watch('notify') ? dates : []
    companyLeave({
      jsonData: {
        ...data,
        emp_id: data?.emp_id,
        leave_type: data?.leave_type ?? 'leave',
        group_by: true,
        employee_type: isValid(watch('notify')) ? data?.employee_type : '',
        notify_to_employee: watch('notify') ? 1 : 0,
        leaves: isValidArray(ids) && !watch('notify') ? leavesData : notifyData
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        handleModal()
        setReload(true)
      }
    })
    // console.log(data)
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    if (edit !== null) {
      setEditData(edit)
      // setValues(formFields, values, setValue, modifyField)
      // setValues(edit)
    }
  }, [edit])

  log(arr, 'employee')
  return (
    <>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        loading={loading}
        open={open}
        scrollControl={false}
        hideSave
        modalClass={'modal-lg'}
        extraButtons={
          <>
            <LoadingButton loading={loading} color='primary' onClick={handleSubmit(handleSave)}>
              {FM('apply')}
            </LoadingButton>
          </>
        }
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('apply-leave')}
      >
        <form>
          <CardBody>
            <Row className=''>
              <Col md={'5'} className='dflex-1 d-none d-xl-block'>
                <Row>
                  <Col md='12'>
                    <FormGroupCustom
                      label={FM('employees')}
                      type={'select'}
                      async
                      cacheOptions
                      control={control}
                      options={emp}
                      loadOptions={loadEmpOption}
                      name={'emp_id'}
                      className='mb-1'
                    />
                  </Col>

                  {isValidArray(watch('leaves')) ? (
                    <Col md='12' className='mt-0'>
                      <FormGroupCustom
                        type={'select'}
                        control={control}
                        name='leave_type'
                        isClearable
                        errors={errors}
                        className='mb-1'
                        label={FM('apply-this-leave-for-vacation-trip')}
                        options={createConstSelectOptions(leaveType, FM)}
                      />
                    </Col>
                  ) : (
                    ''
                  )}
                  {watch('leave_type') === 'leave' ? (
                    <Col md='12' className='mt-0'>
                      <FormGroupCustom
                        key={watch('leave_type')}
                        errors={errors}
                        placeholder='reason'
                        type='textarea'
                        rules={{ required: false }}
                        name='reason'
                        className='mb-1'
                        control={control}
                      />
                    </Col>
                  ) : (
                    ''
                  )}

                  <Show IF={watch('notify')}>
                    <Col md='12'>
                      <FormGroupCustom
                        label={FM('employee-type')}
                        type={'select'}
                        isMulti
                        cacheOptions
                        errors={errors}
                        control={control}
                        options={createConstSelectOptions(empType, FM)}
                        loadOptions={createConstSelectOptions(empType, FM)}
                        name={'employee_type'}
                        className='mb-1'
                      />
                    </Col>
                  </Show>
                  <Col md='12'>
                    <FormGroupCustom
                      label={FM('notify-to-employee')}
                      type={'checkbox'}
                      async
                      cacheOptions
                      control={control}
                      options={emp}
                      loadOptions={loadEmpOption}
                      name={'notify'}
                      className=''
                    />
                  </Col>
                  <Col md='12' xs='12' className='mt-1'>
                    <FormGroupCustom
                      value={edit?.date}
                      placeholder={FM('dates')}
                      noGroup
                      noLabel
                      errors={errors}
                      type='date'
                      isClearable
                      options={{
                        inline: true,
                        mode: 'multiple',
                        minDate: 'today',
                        disable: isValidArray(leave) ? leave : [],
                        onDayCreate: (dObj, dStr, fp, dayElem) => {
                          const date = dayElem.dateObj
                          // log(date)
                          // dummy logic
                          if (scArr?.includes(formatDate(date, 'YYYY-MM-DD'))) {
                            dayElem.innerHTML += "<span class='event busy'></span>"
                          }
                        }
                      }}
                      onMonthChange={(e) => setKey(new Date())}
                      dateRef={dateRef}
                      classNameInput='d-none'
                      name='leaves[0][dates]'
                      label={FM('start-date')}
                      control={control}
                      rules={{ required: active === false }}
                    />
                  </Col>
                </Row>
              </Col>

              <Col md='6' className='flex-1 d-none d-xl-block mt-2'>
                <Row>
                  <table class='table table-striped mb-0'>
                    <thead>
                      <tr>
                        <th>{FM('dates')}</th>
                        <th>{FM('shift')}</th>
                        <th>{FM('assign-employee')}</th>
                      </tr>
                    </thead>
                    {scheduleLoading ? (
                      <>
                        <tr>
                          <td>
                            <div className='loader-top me-2'>
                              <span className='spinner'>
                                <Spinner color='primary' animation='border' size={'xl'}>
                                  <span className='visually-hidden'>Loading...</span>
                                </Spinner>
                              </span>
                            </div>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tbody>
                        {isValidArray(arr)
                          ? arr?.map((d, i) => {
                              return (
                                <Show IF={scArr?.includes(formatDate(d?.shift_date, 'YYYY-MM-DD'))}>
                                  <tr>
                                    <td>{formatDate(d?.shift_date)}</td>
                                    <td>
                                      {d?.shift_start_time}-{d?.shift_end_time}
                                    </td>
                                    <td>
                                      <Hide IF={watch('notify')}>
                                        <FormGroupCustom
                                          key={`emp-${d?.empId}`}
                                          label={'assign-employee'}
                                          type={'select'}
                                          async
                                          noLabel
                                          noGroup
                                          cacheOptions
                                          control={control}
                                          isClearable
                                          isDisabled={watch('notify')}
                                          error={errorState?.includes(i)}
                                          onChangeValue={(e) => {
                                            const datas = {
                                              date: formatDate(d?.shift_date),
                                              schedule_id: d?.id ?? '',
                                              assign_emp: e ?? null
                                            }
                                            toggleArrayBy(
                                              datas,
                                              ids,
                                              setIds,
                                              (e) => e?.date === formatDate(d?.shift_date)
                                            )
                                            loadEmployeeLeve(e, formatDate(d?.shift_date), i)
                                          }}
                                          isOptionDisabled={(e) => {
                                            // week
                                            if (e?.value === d?.empId) {
                                              return true
                                            }
                                            // month
                                            return false
                                          }}
                                          className='span'
                                          options={emp}
                                          loadOptions={loadEmpOption}
                                          name={`leaves.${i}.employeeId`}
                                        />
                                      </Hide>
                                    </td>
                                  </tr>
                                </Show>
                              )
                            })
                          : []}
                      </tbody>
                    )}
                  </table>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
