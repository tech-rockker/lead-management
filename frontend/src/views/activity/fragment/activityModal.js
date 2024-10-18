/* eslint-disable prefer-template */
// ** Custom Components

import React, { useEffect, useRef, useState } from 'react'
import { FileText } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import { ErrorToast, isObjEmpty, jsonDecodeAll, setValues } from '../../../utility/Utils'
import { addActivity, editActivity, viewActivity } from '../../../utility/apis/activity'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import LoadingButton from '../../components/buttons/LoadingButton'

import StepsModal from '../../components/modal/StepsModal'
import Wizard from '../../components/wizard'
import ActivityDetails from './steps/ActivityDetails'
import DateTime from './steps/DateTime'
import RepeatReminder from './steps/RepeatReminder'
import UrlAttachment from './steps/UrlAttachment'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const ActivityModal = ({
  onSuccess = () => {},
  user = null,
  edit = null,
  editIpRes = null,
  noView = false,
  ipRes = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  activityId = null,
  Component = 'span',
  children = null,
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
  const [lastIndex, setLastIndex] = useState(3)
  const [id, setId] = useState(null)

  const [display, setDisplay] = useState(true)
  const [ipData, setIpData] = useState(null)
  //  const valRes = isValid(ipRes) ? ipRes[0] : null
  const [reslabel, setResLabel] = useState(null)
  const requiredEnabled = true

  // ** Ref
  const ref = useRef(null)
  //label set

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // State Check for uploaded folder
  const updatedFileName = useSelector((s) => s?.fileupload?.fileAdmin?.data[0])

  // form data
  const formFields = {
    ip_id: '',
    patient_id: '',
    category_id: '',
    subcategory_id: '',
    branch_id: '',
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
    repeat_dates: '',

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

    employees: '',
    how_many_time_array: 'json',
    is_compulsory: '',
    is_risk: '',
    message: '',
    task: {
      type_id: '',
      title: '',
      parent_id: '',
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
      employees: ''
    }
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    setError,
    clearErrors,
    watch
  } = useForm({
    is_compulsory: false,
    remind_before_start: 0,
    before_is_push_notify: 0,
    before_is_text_notify: 0,
    before_minutes: '',

    how_many_time: 1,
    in_time_is_push_notify: 0,
    in_time_is_text_notify: 0,

    remind_after_end: 0,
    after_is_push_notify: 0,
    after_is_text_notify: 0,
    after_minutes: '',

    is_emergency: 0,
    emergency_is_push_notify: 0,
    emergency_is_text_notify: 0,
    emergency_minutes: 0
  })

  useEffect(() => {
    if (edit !== null) {
      setEditData(edit)
    }
  }, [edit])

  useEffect(() => {
    if (isValid(ipRes)) {
      setResLabel(ipRes[0])
    }
  }, [ipRes])

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    setEditData(null)
    setCurrentIndex(0)
    setIpData(null)
  }

  const modifyField = (key, value) => {
    if (key === 'questions') {
      value = value?.map((q) => q?.question_id)
    }
    return value
  }

  const loadDetails = () => {
    if (isValid(id)) {
      viewActivity({
        id,
        loading: setLoadingDetails,
        success: (a) => {
          const d = {
            ...a
          }
          const values = jsonDecodeAll(formFields, d)
          // Check if 'admin_files' exists, if so, assign it to 'file'
          if (values?.admin_file) {
            values.file = {
              file_url: values?.admin_file?.file_path,
              file_name: values?.admin_file?.file_name
            }
          }
          setEditData(values)
          console.log(values)
          setValues(formFields, values, setValue, modifyField)
          setValue(
            'employees',
            values?.assign_employee?.map((d) => d.user_id)
          )
          setIpData(values?.implementation_plan)
        }
      })
    }
  }

  const handleSave = (data) => {
    const weekDays = Array.isArray(data?.week_days) ? data?.week_days.map((x) => '' + x) : []

    if (editData && !isObjEmpty(editData)) {
      editActivity({
        id,
        jsonData: {
          ...data,
          time_update_series: data?.time_update_series === 1 ? 'yes' : 'no',
          title_update_series: data?.title_update_series === 1 ? 'yes' : 'no',
          date_update_series: data?.date_update_series === 1 ? 'yes' : 'no',
          file: {
            file_url:
              data?.admin_file?.file_path === updatedFileName?.file_name &&
              updatedFileName?.file_name !== undefined
                ? data?.admin_file?.file_path
                : updatedFileName?.file_name,
            file_name:
              data?.admin_file?.file_name === updatedFileName?.uploading_file_name &&
              updatedFileName?.uploading_file_name !== undefined
                ? data?.admin_file?.file_name
                : updatedFileName?.uploading_file_name
          }
        },
        dispatch,
        loading: setLoading,
        success: () => {
          handleModal()
          onSuccess(data)
          console.log('onSuccess', data)
        }
      })
    } else {
      addActivity({
        jsonData: {
          ...data,
          // ip_id: data?.ip_id?.id,
          before_is_text_notify: isValid(data?.before_is_text_notify)
            ? data?.before_is_text_notify
            : 0,

          before_is_push_notify: isValid(data?.before_is_push_notify)
            ? data?.before_is_push_notify
            : 0,

          before_minutes: isValid(data?.before_minutes) ? data?.before_minutes : 0,

          how_many_time: isValid(data?.how_many_time) ? data?.how_many_time : 0,

          in_time_is_push_notify: isValid(data?.in_time_is_push_notify)
            ? data?.in_time_is_push_notify
            : 0,

          in_time_is_text_notify: isValid(data?.in_time_is_text_notify)
            ? data?.in_time_is_text_notify
            : 0,

          employees: isValidArray(data?.employees) ? data?.employees : [],
          week_days: weekDays,
          repeat_dates: isValidArray(data?.repeat_dates) ? data?.repeat_dates : []
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

  const handleSaveForce = ({ next = false }) => {
    //log(d)
    log(errors)
    if (isObjEmpty(errors)) {
      handleSubmit((e) => onSubmit(e, next))()
    } else {
      ErrorToast('please-enter-required-fields-denoted-with-start')
      stepper.to(1)
      setCurrentIndex(0)
    }
  }

  const handleSaveNext = () => {
    stepper.next()
    setCurrentIndex(currentIndex + 1)
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

  const steps = [
    {
      id: 'activity-details',
      title: FM('activity'),
      subtitle: FM('enter-details'),
      icon: <FileText size={18} />,
      content: (
        <ActivityDetails
          clearErrors={clearErrors}
          open={open}
          user={user}
          setIpData={setIpData}
          setDisplay={setDisplay}
          editIpRes={editIpRes}
          resLabel={reslabel}
          ipRes={ipRes}
          loadingDetails={loadingDetails}
          requiredEnabled={requiredEnabled}
          watch={watch}
          getValues={getValues}
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
      title: FM('date-&-time'),
      subtitle: FM('date-time-repeat-details'),
      content: (
        <DateTime
          clearErrors={clearErrors}
          currentIndex={currentIndex}
          ipData={ipData}
          showAlert={showAlert}
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
      id: 'repeat-reminder',
      title: FM('repeat-reminder'),
      subtitle: FM('repeat-reminder-details'),
      content: (
        <RepeatReminder
          clearErrors={clearErrors}
          setError={setError}
          showAlert={showAlert}
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
      )
    },
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
        title={FM('activity')}
        headerClose={true}
        hideClose={currentIndex === 0}
        display={display}
        closeButton={
          <>
            <Button.Ripple color='secondary' onClick={(e) => handleClose(null)} outline>
              {FM('close')}
            </Button.Ripple>
          </>
        }
        //enableForceSave
        //handleSaveForce={handleSubmit(handleSaveForce)}
        disableSave={loadingDetails}
        loading={loading}
        lastIndex={lastIndex}
        hideSave={currentIndex === lastIndex}
        currentIndex={currentIndex}
        modalClass={'modal-xl'}
        showForm={showForm}
        open={open}
        handleModal={handleClose}
        handleSave={handleSaveNext}
        extraButtons={
          <LoadingButton
            disabled={loadingDetails}
            loading={loading}
            color='primary'
            onClick={(e) => handleSaveForce(false)}
          >
            {FM('save')}
          </LoadingButton>
        }
      >
        {/* <CardHeader className='border-bottom'>
                    <Row>
                        <Col md="4">
                            <h4 className='mb-0'> <b>{isValid(ipRes) ? reslabel?.title : isValid(ipRes) && ipRes?.length > 0 ? watch("ip_id") : ""} </b>
                              </h4>
                        </Col>
                      
                    </Row>
                </CardHeader> */}
        <div className='vertical-wizard no-shadow mb-0'>
          <Wizard
            key={loadingDetails}
            options={{
              linear: loadingDetails
            }}
            perfectScroll={false}
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

export default ActivityModal
