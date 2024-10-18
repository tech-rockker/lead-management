import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addLeave, allLeaves } from '../../../utility/apis/leave'
import { loadSchedule } from '../../../utility/apis/schedule'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import { formatDate, SuccessToast } from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import Tab from './Tab/Tab'

const LeaveModal = ({
  responseData = () => {},
  showModal = false,
  edit = null,
  setShowModal = () => {},
  Component = 'span',
  noView = false,
  children = null,
  ...rest
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [leaveLoading, setLeaveLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [scLoading, setScLoading] = useState(false)
  const [scheduleArr, setSchedule] = useState([])
  const [leave, setLeave] = useState(null)
  const [month, setMonth] = useState(null)
  // const user = useUser()
  const user = useSelector((a) => a.auth.userData)

  const requiredEnabled = true
  const ref = useRef(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()
  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()

    setCurrentIndex(0)
  }
  const handleClose = (from = null) => {
    setEditData(null)
    handleModal()
    setCurrentIndex(0)
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

  const getAllLeaves = (month) => {
    const currentCalMonth = month
    const currentMonth = moment().month()
    const startOfMonth =
      currentMonth === currentCalMonth
        ? formatDate(new Date(), 'YYYY-MM-DD')
        : moment().month(month).startOf('month').toDate()
    const endOfMonth = moment().month(month).endOf('month').toDate()
    allLeaves({
      id: user?.id,
      jsonData: {
        start_date: formatDate(startOfMonth),
        end_date: formatDate(endOfMonth)
      },
      loading: setLeaveLoading,
      success: (e) => {
        setLeave(e)
      }
    })
  }

  const getAllSchedule = (month) => {
    const currentCalMonth = month
    const currentMonth = moment().month()
    const startOfMonth =
      currentMonth === currentCalMonth
        ? formatDate(new Date(), 'YYYY-MM-DD')
        : moment().month(month).startOf('month').toDate()
    const endOfMonth = moment().month(month).endOf('month').toDate()
    loadSchedule({
      jsonData: {
        user_id: user?.id,
        leave_applied: 0,
        // status: 1,
        is_active: 1,
        shift_start_date: formatDate(startOfMonth),
        shift_end_date: formatDate(endOfMonth)
      },
      loading: setScLoading,
      success: (e) => {
        setSchedule(e?.payload?.map((d, i) => d?.shift_date))
      }
    })
  }

  // useEffect(() => {
  //     if (user?.id) {
  //         getAllLeaves()
  //         getAllSchedule()
  //     }

  // }, [])

  const onSubmit = (data) => {
    log(data)
    let _data = {}
    if (data?.is_repeat === 1) {
      _data = {
        is_repeat: 1,
        reason: isValid(data?.reason) ? data?.reason : null,
        start_date: isValid(data?.start_date) ? data?.start_date : null,
        leave_type: isValid(data?.leave_type) ? data?.leave_type : null,
        end_date: isValid(data?.end_date) ? data?.end_date : null,
        every_week: isValid(data?.every_week) ? data?.every_week : null,
        week_days: isValidArray(data?.week_days) ? data?.week_days : [],
        leaves: null
      }
    } else {
      _data = {
        is_repeat: 0,
        leave_type: isValid(data?.leave_type) ? data?.leave_type : null,
        reason: null,
        start_date: null,
        end_date: null,
        every_week: null,
        week_days: null,
        leaves: [
          {
            dates: data?.dates ?? null,
            reason: data?.reason ?? null
          }
        ]
      }
    }

    addLeave({
      jsonData: {
        ..._data,
        group_by: true
      },
      loading: setLoading,
      dispatch,
      success: (d) => {
        log(d?.payload)
        responseData()

        handleClose()
        // getAllLeaves()
        // onSuccess()
        // loadJournal()
        log(data)
      }
    })
    //}
  }

  return (
    <>
      <CenteredModal
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-sm'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
        title={FM('apply-for-leave')}
      >
        <Tab
          loadScheduleArr={(e) => {
            if (user?.id) {
              if (month !== e) {
                setMonth(e)
                getAllLeaves(e)
                getAllSchedule(e)
              }
            }
          }}
          scArr={scheduleArr ?? []}
          getValues={getValues}
          leave={leave}
          setError={setError}
          loadingDetails={loadingDetails}
          requiredEnabled={requiredEnabled}
          watch={watch}
          setValue={setValue}
          edit={editData}
          onSubmit={handleSubmit(onSubmit)}
          stepper={stepper}
          control={control}
          errors={errors}
        />
        {/* <LeaveDetail   getValues={getValues} setError={setError} loadingDetails={loadingDetails} requiredEnabled={requiredEnabled} watch={watch} setValue={setValue} edit={editData} onSubmit={handleSubmit(onSubmit)} stepper={stepper} control={control} errors={errors} /> */}
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default LeaveModal
