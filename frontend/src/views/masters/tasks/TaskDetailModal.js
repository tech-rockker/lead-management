/* eslint-disable prefer-template */
// ** Custom Components

import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addTask, editTask, viewTask } from '../../../utility/apis/task'
import { CategoryType, forDecryption } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import {
  decryptObject,
  isObjEmpty,
  jsonDecodeAll,
  setValues,
  updateRequiredOnly
} from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import TaskView from './TaskView'

const TaskDetailModal = ({
  step = 1,
  activity = null,
  activityForEmp = null,
  onSuccess = () => {},
  handleToggle = () => {},
  edit = null,
  ipRes = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  activityId = null,
  sourceId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [showForm, setShowForm] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [lastIndex, setLastIndex] = useState(3)
  const [id, setId] = useState(null)
  const [display, setDisplay] = useState(true)
  const [resLabel, setResLabel] = useState(null)
  const requiredEnabled = true

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // form data
  const formFields = {
    parent_id: '',
    type_id: '',
    source_id: sourceId,
    patient_id: '',
    category_id: '',
    subcategory_id: '',
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    is_repeat: '',
    every: '',
    repetition_type: '',
    week_days: 'json',
    month_day: '',
    end_date: '',
    end_time: '',
    address_url: '',
    video_url: '',
    information_url: '',
    file: '',
    remind_before_start: '',
    before_minutes: '',
    before_is_text_notify: '',
    before_is_push_notify: '',
    remind_after_end: '',
    after_minutes: '',
    after_is_text_notify: '',
    after_is_push_notify: '',
    is_emergency: '',
    emergency_minutes: '',
    emergency_is_text_notify: '',
    emergency_is_push_notify: '',
    in_time: '',
    in_time_is_text_notify: '',
    in_time_is_push_notify: '',
    employees: 'json',
    how_many_time: '',
    how_many_time_array: 'json'
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm()

  useEffect(() => {
    if (edit !== null) {
      setEditData(edit)
    }
  }, [edit])

  useEffect(() => {
    if (ipRes !== null) {
      setResLabel(ipRes[0])
    }
  }, [ipRes])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    setEditData(null)
    setCurrentIndex(0)
  }

  const modifyField = (key, value) => {
    if (key === 'questions') {
      value = value?.map((q) => q?.question_id)
    }
    return value
  }

  const loadDetails = () => {
    if (isValid(id)) {
      viewTask({
        id,
        loading: setLoadingDetails,
        success: (d) => {
          const valuesTemp = jsonDecodeAll(formFields, d)
          const values = {
            ...valuesTemp,
            patient: decryptObject(forDecryption, valuesTemp?.patient),
            employee: decryptObject(forDecryption, valuesTemp?.employee),
            branch: decryptObject(forDecryption, valuesTemp?.branch),
            created_by: decryptObject(forDecryption, valuesTemp?.created_by),
            assign_employee: valuesTemp?.assign_employee?.map((a) => ({
              ...a,
              employee: decryptObject(forDecryption, a?.employee)
            }))
          }
          setEditData(values)
          setValues(formFields, values, setValue, modifyField)
          setValue(
            'employees',
            values?.assign_employee?.map((d) => d.user_id)
          )
        }
      })
    }
  }

  const handleSave = (data) => {
    const weekDays = Array.isArray(data?.week_days) ? data?.week_days.map((x) => '' + x) : []

    if (editData && !isObjEmpty(editData)) {
      const _data = {
        ...data,
        week_days: isValid(weekDays) !== [] ? weekDays : editData?.weekDays
      }
      editTask({
        id,
        jsonData: updateRequiredOnly(_data, editData),
        dispatch,
        loading: setLoading,
        success: () => {
          handleModal()
          onSuccess(data)
        }
      })
    } else {
      addTask({
        jsonData: {
          ...data,
          type_id: CategoryType.activity,
          week_days: weekDays
        },
        loading: setLoading,
        dispatch,
        success: (data) => {
          handleModal()
          onSuccess(data)
        }
      })
    }
  }

  const onSubmit = (d) => {
    log(d)
    log(errors)
    if (isObjEmpty(errors)) {
      if (currentIndex === lastIndex) {
        handleSave(d)
      } else {
        stepper.next()
        setCurrentIndex(currentIndex + 1)
      }
    }
  }

  const handleSaveForce = (d) => {
    log(d)
    log(errors)
    if (isObjEmpty(errors)) {
      handleSave(d)
    }
  }

  const handleClose = (from = null) => {
    if (from) {
      if (stepper?._currentIndex === 0) {
        handleModal()
      } else {
        stepper.previous()
        setCurrentIndex(currentIndex - 1)
      }
    } else {
      handleModal()
    }
  }

  useEffect(() => {
    if (open === true && id) loadDetails()
  }, [open, id])

  useEffect(() => {
    setId(activityId)
  }, [activityId])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    handleToggle(open)
  }, [open])
  return (
    <>
      <CenteredModal
        disableFooter={true}
        title={`${resLabel ? resLabel?.title : ''} ${FM(`task-details`)}`}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-xl'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className='p-2'>
          <TaskView
            step={step}
            activity={activity}
            activityForEmp={activityForEmp}
            setDisplay={setDisplay}
            resLabel={resLabel}
            loadingDetails={loadingDetails}
            ipRes={ipRes}
            requiredEnabled={requiredEnabled}
            watch={watch}
            setValue={setValue}
            edit={editData}
            onSubmit={handleSubmit(onSubmit)}
            control={control}
            errors={errors}
          />
        </div>
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default TaskDetailModal
