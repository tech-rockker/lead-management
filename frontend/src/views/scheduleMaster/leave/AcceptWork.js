import { formatDate } from '@fullcalendar/react'
import moment from 'moment'
import React, { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Card, CardBody, Col, Row, Spinner } from 'reactstrap'
import { loadWorkShift } from '../../../utility/apis/companyWorkShift'
import { allLeaveDates, allLeaves, leaveScheduleSelectedSlot } from '../../../utility/apis/leave'
import { loadSchedule } from '../../../utility/apis/schedule'
import { loadUser } from '../../../utility/apis/userManagement'
import { acceptTask, presets, ShiftType, UserTypes } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  fastLoop,
  getDates,
  JsonParseValidate,
  SuccessToast,
  toggleArray,
  viewInHours
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import BsTooltip from '../../components/tooltip'

export default function AcceptWork({
  edit = null,
  noView = false,
  showModal = false,
  setReload,
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) {
  const initState = {
    page: 1,
    perPage: 50,
    loading: false,
    employees: [],
    templates: [],
    dates: [],
    branches: [],
    startOfMonth: moment().startOf('month').toDate(),
    endOfMonth: moment().endOf('month').toDate()
  }
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notData, setNotData] = useState(null)
  const notification = location?.state?.notification
  // const [user, setUser] = useState([])
  const user = useSelector((a) => a.auth.userData)
  const [leaveDates, setLeaveDates] = useState([])
  const [loadLeave, setLoadLeave] = useState(false)
  const [shiftSelected, setShift] = useState([])
  const [ids, setIds] = useState([])
  const dispatch = useDispatch()
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form
  const [leave, setLeave] = useState(null)
  /** @returns {initState} */
  const stateReducer = (o, n) => ({ ...o, ...n })
  const [state, setState] = useReducer(stateReducer, initState)

  const handlePresets = (preset) => {
    if (isValid(preset)) {
      if (preset === presets.thisMonth) {
        const startOfMonth = moment().startOf('month').toDate()
        const endOfMonth = moment().endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.thisWeek) {
        const startOfMonth = moment().startOf('week').toDate()
        const endOfMonth = moment().endOf('week').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.prevMonth) {
        const startOfMonth = moment().subtract(1, 'months').startOf('month').toDate()
        const endOfMonth = moment().subtract(1, 'months').endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.nextMonth) {
        const startOfMonth = moment().add(1, 'months').startOf('month').toDate()
        const endOfMonth = moment().add(1, 'months').endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === 'custom') {
        if (isValid(state.startOfMonth) && isValid(state.endOfMonth)) {
          const dates = getDates(state.startOfMonth, state.endOfMonth)
          setState({ dates })
        }
      }
    }
  }

  useEffect(() => {
    handlePresets('custom')
  }, [state?.startOfMonth, state?.endOfMonth])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    if (edit === null) setEditData(null)
  }

  const getAllLeaveDates = () => {
    if (isValid(edit?.leave_group_id)) {
      loadSchedule({
        jsonData: {
          //  user_id: user?.user_type_id === UserTypes.employee ? user?.id : watch("user_id"),
          // shift_start_date: formatDate(watch("from"), "DD-MM-YYYY") ?? null,
          // shift_end_date: formatDate(watch("to"), "DD-MM-YYYY") ?? null
          //user_id: edit?.user_id
          leave_group_id: isValid(edit?.leave_group_id) ? edit?.leave_group_id : null
        },
        loading: setLoadLeave,
        success: (e) => {
          setLeaveDates(e?.payload)
        }
      })
    }
  }

  useEffect(() => {
    getAllLeaveDates()
  }, [edit?.leave_group_id])

  // useEffect(() => {
  //     getAllLeaveDates()
  // }, [loading])

  const getAllLeaves = (data) => {
    allLeaves({
      id: user?.id,
      jsonData: {
        ...data
      },
      loading: setLoading,
      success: (e) => {
        setLeave(e)
      }
    })
  }

  // useEffect(() => {
  //     getAllLeaves()
  // }, [])

  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    leaveScheduleSelectedSlot({
      jsonData: {
        // date: formatDate(ids?.date),
        // shift_name: ids?.shift_name,
        // leave_group_id: isValid(edit?.leave_group_id) ? edit?.leave_group_id : ""
        schedule_ids: ids
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        handleModal()

        // SuccessToast("leave-accepted")
      }
    })
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

  useEffect(() => {
    if (notification?.data_id) {
      setNotData({
        preset: 'this-month',
        id: notification?.data_id,
        user_id: JsonParseValidate(notification?.extra_param)?.employee_id
      })
      setValue('user_id', JsonParseValidate(notification?.extra_param)?.employee_id)
      window.history.replaceState({ fffff: 'kj' }, document.title)
    }
  }, [notification])

  const selectAll = (selectArr) => {
    //(new Date(formatDate(new Date(), "YYYY-MM-DD 00:00:00")).getTime() < new Date(d?.shift_date).getTime())
    // return isValidArray(selectArr) ? selectArr?.filter((d) => d?.approved_by_company === 0).map(item => toggleArray(item?.id, ids, setIds)) : []
    const re = []
    if (isValidArray(selectArr)) {
      fastLoop(selectArr, (d, i) => {
        re.push(d?.id)
      })
    }
    log('re', re)
    setIds(re)
  }

  useEffect(() => {
    selectAll(leaveDates)
  }, [watch('select_all')])
  log(ids)

  return (
    <>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        loading={loadLeave}
        open={open}
        scrollControl={!edit?.leave_group_id}
        hideSave
        modalClass={'modal-lg'}
        extraButtons={
          <>
            <LoadingButton loading={loading} color='primary' onClick={handleSubmit(handleSave)}>
              {FM('accept')}
            </LoadingButton>
          </>
        }
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('rescheduled-task')}
      >
        <form className='p-0'>
          <table class='table table-striped mb-0'>
            <thead>
              <tr>
                <th>{FM('dates')}</th>
                <th>{FM('start-time')}</th>
                <th>{FM('end-time')}</th>

                <th>{FM('status')}</th>
                <th>
                  <>
                    {isValidArray(leaveDates) ? (
                      isValid(leaveDates?.find((f) => f?.slot_assigned_to === null)) ? (
                        <BsTooltip title={FM('check-all')}>
                          <FormGroupCustom
                            noLabel
                            noGroup
                            name={`select_all`}
                            type={'checkbox'}
                            errors={errors}
                            className={'ms-1 p-1'}
                            //value={ids?.includes(d?.id)}
                            control={control}
                            rules={{ required: false }}
                          />
                        </BsTooltip>
                      ) : null
                    ) : null}
                  </>
                </th>
              </tr>
            </thead>
            {loadLeave ? (
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
                {isValidArray(leaveDates) ? (
                  leaveDates
                    ?.filter((a) => a.leave_approved === 1)
                    ?.map((d, i) => {
                      return (
                        <>
                          <Show IF={isValid(d?.leave_approved)}>
                            <tr>
                              <td key={i}>{formatDate(d?.shift_date)}</td>
                              <td key={i}>{d?.start_time}</td>
                              <td key={i}>{d?.end_time}</td>

                              <td>
                                {isValid(d?.slot_assigned_to) ? (
                                  <Badge className='' color='light-danger'>
                                    {FM('slot-booked')}
                                  </Badge>
                                ) : (
                                  <Badge color='light-success'>{FM('slot-available')}</Badge>
                                )}
                              </td>
                              <td key={i}>
                                <Hide IF={isValid(d?.slot_assigned_to)}>
                                  <FormGroupCustom
                                    noLabel
                                    noGroup
                                    name={`schedule_ids`}
                                    type={'checkbox'}
                                    errors={errors}
                                    onChangeValue={() => {
                                      {
                                        toggleArray(d?.id, ids, setIds)
                                        //setIds({ date: d?.shift_date, shift_name: d?.shift_name })
                                      }
                                    }}
                                    className={'ms-1'}
                                    value={watch('select_all') ? 1 : 0}
                                    control={control}
                                    rules={{ required: false }}
                                  />
                                </Hide>
                              </td>
                            </tr>
                          </Show>
                        </>
                      )
                    })
                ) : (
                  <tr>
                    <td scope='col' colspan='6' className='text-center'>
                      <div className='text-center'>
                        <h4>
                          {' '}
                          {watch('user_id')
                            ? FM('no-dates-available')
                            : user?.user_type_id === UserTypes.employee
                            ? FM('no-dates-available')
                            : FM('please-select-employee')}
                        </h4>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>

          {/* <Col sm={{ order: 1 }} md="4" className="d-flex align-items-stretch">
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Hide IF={user?.user_type_id === UserTypes.employee}>
                                        <Col md="12" >
                                            <FormGroupCustom
                                                placeholder={"select-employee"}
                                                label={"employee"}
                                                type={"select"}
                                                //async
                                                cacheOptions
                                                control={control}
                                                value={notData?.user_id ?? null}
                                                options={emp}
                                                loadOptions={loadEmployeeOptions}
                                                name={"user_id"}
                                                className={"mb-2"}
                                            />
                                        </Col>
                                    </Hide>

                                        <Col md="12" className={"mb-1"}>
                                            <FormGroupCustom
                                                key={`start-${state.startOfMonth}-${state.endOfMonth}-${watch("user_id")}`}
                                                noGroup

                                                noLabel
                                                placeholder={FM("preset")}
                                                type={"select"}
                                                isClearable
                                                value={notData?.preset ?? watch('preset')}
                                                onChangeValue={handlePresets}
                                                control={control}
                                                options={createConstSelectOptions(presets, FM)}
                                                name={"preset"}
                                                className="mb-2"
                                            />
                                        </Col>
                                        <Col md="12" className={"mb-1"}>
                                            <FormGroupCustom
                                                key={`start-${state.startOfMonth}-${watch("user_id")}`}
                                                noGroup
                                                noLabel
                                                name="from"
                                                value={state.startOfMonth}
                                                onChangeValue={(startOfMonth) => { setValue("preset", null); setState({ startOfMonth }) }}
                                                control={control}
                                                label={"from-date"}
                                                type={"date"}
                                                className="mb-2"
                                            />
                                        </Col>
                                        <Col md="12" className={"mb-1"}>
                                            <FormGroupCustom
                                                key={`end-${state.endOfMonth}-${watch("user_id")}`}
                                                noGroup
                                                noLabel
                                                name="to"
                                                value={state.endOfMonth}
                                                options={{
                                                    minDate: new Date(watch('from'))
                                                }}
                                                onChangeValue={(endOfMonth) => { setValue("preset", null); setState({ endOfMonth }) }}
                                                control={control}
                                                label={"to-date"}
                                                type={"date"}

                                            />
                                        </Col>

                                    </Row>
                                </CardBody>
                            </Card>
                        </Col> */}
        </form>
      </CenteredModal>
    </>
  )
}
