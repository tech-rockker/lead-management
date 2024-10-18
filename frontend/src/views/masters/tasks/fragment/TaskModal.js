/* eslint-disable prefer-template */
// ** Custom Components

import React, { useEffect, useRef, useState } from 'react'
import { FileText } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import { CategoryType, forDecryption } from '../../../../utility/Const'
import {
  ErrorToast,
  decryptObject,
  isObjEmpty,
  jsonDecodeAll,
  setValues,
  updateRequiredOnly
} from '../../../../utility/Utils'
import { addTask, editTask, viewTask } from '../../../../utility/apis/task'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import StepsModal from '../../../components/modal/StepsModal'
import Wizard from '../../../components/wizard'
import DateTime from './steps/DateTime'
import TaskDetails from './steps/TaskDetails'
import UrlAttachment from './steps/UrlAttachment'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const TaskModal = ({
  dUser = false,
  ips = null,
  user = null,
  followup = null,
  devitation = null,
  activity = null,
  activityForEmp = null,
  file = null,
  responseData = () => {},
  onSuccess = () => {},
  handleToggle = () => {},
  edit = null,
  ipRes = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  activityId = null,
  sourceId = null,
  resourceType = null,
  Component = 'span',
  children = null,
  isRefreshed = () => {},
  // fileType = undefined,
  ...rest
}) => {
  // Dispatch
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [showForm, setShowForm] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [lastIndex, setLastIndex] = useState(2)
  const [id, setId] = useState(null)
  const [display, setDisplay] = useState(true)
  const [resLabel, setResLabel] = useState(null)
  const requiredEnabled = true

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // State Check for uploaded folder
  const updatedFileName = useSelector((s) => s?.fileupload?.fileAdmin?.data[0])

  // form data
  const formFields = {
    resource_id: '',
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
    admin_file: '',
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
    how_many_time_array: 'json',
    repeat_dates: 'json',
    task_for: ''
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
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
            created_by: decryptObject(forDecryption, valuesTemp?.created_by)
          }
          // Check if 'admin_files' exists, if so, assign it to 'file'
          if (values?.admin_file) {
            values.file = {
              file_url: values?.admin_file?.file_path,
              file_name: values?.admin_file?.file_name
            }
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
  console.log(
    'edit: ',
    edit,
    'resource_type: ',
    resourceType,
    ' source_id: ',
    sourceId,
    'file: ',
    file
  )
  const handleSave = (data) => {
    const weekDays = Array.isArray(data?.week_days) ? data?.week_days.map((x) => '' + x) : []

    if (editData && !isObjEmpty(editData)) {
      const _data = {
        ...data,
        status: editData?.status,
        resource_id: sourceId ?? data?.resource_id ?? editData?.resource_id,
        type_id: resourceType ?? data?.type_id ?? editData?.type_id,
        file: {
          file_url:
            editData?.admin_file?.file_path === updatedFileName?.file_name &&
            updatedFileName?.file_name !== undefined
              ? editData?.admin_file?.file_path
              : updatedFileName?.file_name,
          file_name:
            editData?.admin_file?.file_name === updatedFileName?.uploading_file_name &&
            updatedFileName?.uploading_file_name !== undefined
              ? editData?.admin_file?.file_name
              : updatedFileName?.uploading_file_name
        }
      }
      editTask({
        id,
        jsonData: updateRequiredOnly(_data, editData),
        dispatch,
        loading: setLoading,
        success: () => {
          handleModal()
          responseData(data?.payload)
        }
      })
    } else {
      addTask({
        jsonData: {
          ...data,
          resource_id: sourceId ?? data?.resource_id,
          // type_ids: resourceType ?? data?.type_id,
          type_id: dUser === true ? CategoryType.patient : resourceType ?? data?.type_id
          // type: fileType
          // file: file ? file?.file_path : edit?.file
        },
        loading: setLoading,
        dispatch,
        success: (data) => {
          handleModal()
          onSuccess(data?.payload)
        }
      })
    }
    isRefreshed(true)
  }

  const onSubmit = (d, next = false) => {
    log(d)
    log(errors)
    if (isObjEmpty(errors)) {
      handleSave(d)
    } else {
      stepper.next()
      setCurrentIndex(currentIndex + 1)
    }
  }
  const getStep = () => {
    if (!isValid(watch('title')) || !isValid('description')) {
      return 0
    } else {
      return 2
    }
  }

  const handleSaveForce = (d) => {
    log(d)
    log(errors)
    if (isObjEmpty(errors)) {
      handleSubmit((c) => handleSave(c))()
    } else {
      ErrorToast('please-enter-required-fields-denoted-with-start')
      // stepper.to(1)
      stepper.to(getStep())
      setCurrentIndex(0)
    }
  }
  const handleNext = (d) => {
    if (currentIndex !== lastIndex) {
      stepper.next()
      setCurrentIndex(currentIndex + 1)
    } else {
      handleSaveForce()
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

  const steps = [
    {
      id: 'task-details',
      title: FM('task'),
      subtitle: FM('enter-details'),
      icon: <FileText size={18} />,
      content: (
        <TaskDetails
          dUser={dUser}
          user={user}
          sourceId={sourceId}
          resourceType={resourceType}
          activity={activity}
          ips={ips}
          followup={followup}
          file={file}
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
          stepper={stepper}
          control={control}
          errors={errors}
        />
      )
    },
    {
      id: 'date-time',
      title: FM('date-time'),
      subtitle: FM('add-date-time'),
      content: (
        <DateTime
          clearErrors={clearErrors}
          currentIndex={currentIndex}
          showAlert={showAlert}
          setShowForms={setShowForm}
          showForms={showForm}
          requiredEnabled={requiredEnabled}
          watch={watch}
          setValue={setValue}
          edit={editData}
          onSubmit={handleSubmit(onSubmit)}
          stepper={stepper}
          control={control}
          errors={errors}
        />
      )
    },
    // {
    //     id: 'repeat-reminder',
    //     title: FM("repeat-reminder"),
    //     subtitle: FM("repeat-reminder-details"),
    //     content: <RepeatReminder showAlert={showAlert} setShowForms={setShowForm} showForms={showForm} requiredEnabled={requiredEnabled} watch={watch} setValue={setValue} edit={editData} onSubmit={handleSubmit(onSubmit)} stepper={stepper} control={control} errors={errors} />
    // },
    {
      id: 'url-attachments',
      title: FM('url-attachments'),
      subtitle: FM('url-attachments-details'),
      content: (
        <UrlAttachment
          actionType={actionType}
          setShowForms={setShowForm}
          showForms={showForm}
          requiredEnabled={requiredEnabled}
          watch={watch}
          setValue={setValue}
          edit={editData}
          file={file}
          onSubmit={handleSubmit(onSubmit)}
          stepper={stepper}
          control={control}
          errors={errors}
        />
      )
    }
  ]

  return (
    <>
      <StepsModal
        title={FM('tasks')}
        display={display}
        headerClose={true}
        closeButton={
          <>
            <Button.Ripple color='secondary' onClick={(e) => handleClose(null)} outline>
              {FM('close')}
            </Button.Ripple>
          </>
        }
        hideClose={currentIndex === 0}
        enableForceSave
        handleSaveForce={handleSaveForce}
        disableSave={loadingDetails}
        loading={loading}
        lastIndex={lastIndex}
        currentIndex={currentIndex}
        modalClass={'modal-xl'}
        showForm={showForm}
        open={open}
        handleModal={handleClose}
        handleSave={handleNext}
      >
        {/* <CardHeader className='border-bottom'>
                    <Row>
                        <Col md="4">
                            <h4 className='mb-0'> <b>{''}</b>
                                {`${resLabel ? resLabel?.title : ''} ${FM(`tasks`)}`}</h4>
                        </Col>
                    </Row>
                </CardHeader> */}
        <div className='vertical-wizard no-shadow mb-0'>
          <Wizard
            perfectScroll={false}
            options={{
              linear: false
            }}
            withShadow
            withBadge
            badgePosition='right'
            badgeColor='success'
            type='vertical'
            currentIndex={setCurrentIndex}
            instance={(el) => setStepper(el)}
            ref={ref}
            steps={steps}
            stepClass={'ps-1 pe-1 mt-0 mb-0'}
            contentClass={'pt-0'}
            contentClassName={'fixed-contents-p-0'}
            headerClassName='bg-transparent p-0'
          />
        </div>
      </StepsModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default TaskModal
