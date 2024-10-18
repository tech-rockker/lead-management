// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addFollowUp, editFollowUp, viewFollowUp } from '../../../../utility/apis/followup'
import { addOv, editOv, viewOv } from '../../../../utility/apis/ovhour'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import { isObjEmpty, jsonDecodeAll, setValues, SuccessToast } from '../../../../utility/Utils'
import CenteredModal from '../../../components/modal/CenteredModal'
import OvHourTab from './OvHourTab'
// import FollowupDetails from './steps/FollowupDetails'
import OvHourDetails from './Tabs/OvHourDetails'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const OvModal = ({
  ips = null,
  responseData = () => {},
  edit = null,
  editIpRes = null,
  noView = false,
  ipRes = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  followUpId = null,
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
  const [id, setId] = useState(null)
  const [ipResponse, setIpResponse] = useState(ipRes)
  const [resLabel, setResLabel] = useState(null)
  const requiredEnabled = true

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // form data
  const formFields = {
    ob_type: '',
    title: '',
    date: '',

    start_date: '',
    start_time: '',
    is_repeat: '',
    is_range: '',
    every_week: '',
    repetition_type: '',
    week_days: 'json',
    end_time: ''
  }
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

  useEffect(() => {
    if (edit !== null) {
      setEditData(edit)
      setValue('ip_id', edit?.ip_id)
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
    if (edit === null) setEditData(null)
    setCurrentIndex(0)
  }

  // const modifyField = (key, value) => {
  //     if (key === "questions") {
  //         value = value?.map(q => q?.question_id)
  //     }
  //     return value
  // }

  const loadDetails = () => {
    if (edit?.id) {
      viewOv({
        id: edit?.id,
        loading: setLoadingDetails,
        success: (d) => {
          const values = jsonDecodeAll(formFields, {
            ...d?.payload
          })
          setEditData(values)

          setValues(formFields, values, setValue)
        }
      })
    }
  }
  useEffect(() => {
    log(
      'lijds ijosajdoi sajd',
      (isValid(watch('start_time')) && isValid(watch('end_time'))) || isValidArray(watch('dates'))
    )
  }, [watch('start_time'), watch('end_time'), watch('dates')])

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleSave = (data) => {
    log(data)
    if (edit && !isObjEmpty(edit)) {
      editOv({
        jsonData: {
          ...edit,
          ...data

          // branch_id: isValid(data?.branch_id) ? data?.branch_id : editData?.branch_id,
          // ip_id: isValid(data?.ip_id) ? data?.ip_id : editData?.ip_id,
          // title: isValid(data?.ip_id) ? data?.title : editData?.title,
          // description: isValid(data?.description) ? data?.description : editData?.description,
          // remarks: isValid(data?.remarks) ? data?.remarks : editData?.remarks,
          // reason_for_editing: isValid(data?.reason_for_editing) ? data?.reason_for_editing : "",
          // repeat_datetime: isValidArray(data?.repeat_datetime) ? data?.repeat_datetime : data?.repeat_datetime,

          // follow_up_type: 1,
          // documents: isValidArray(data?.documents) ? data?.documents : editData?.documents
        },
        id: edit?.id,
        loading: setLoading,
        dispatch,
        success: () => {
          // SuccessToast("updated")
          handleModal()
        }
      })
    } else {
      addOv({
        jsonData: {
          ...data,
          is_range: data?.is_repeat,
          every_week: isValid(data?.every_week) ? data?.every_week : null,
          is_repeat: data?.is_repeat
        },
        loading: setLoading,
        dispatch,
        success: (d) => {
          responseData(d?.payload)
          // SuccessToast("done")
          handleModal()
        }
      })
    }
  }

  const onSubmit = (d) => {
    if (isObjEmpty(errors)) {
      handleSave(d)
    }
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (open === true && id) loadDetails()
  }, [open, id])

  useEffect(() => {
    setId(followUpId)
  }, [followUpId])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    setIpResponse(ipRes)
  }, [ipRes])

  const isDisabled = () => {
    if (isValid(watch('start_time')) && isValid(watch('end_time'))) {
      return false
    } else if (isValidArray(watch('dates'))) {
      return false
    } else {
      return true
    }
  }

  return (
    <>
      <CenteredModal
        disableSave={isDisabled()}
        title={`${isValid(edit?.id) ? FM('edit-obe') : FM(`create-obe`)}`}
        loading={loading}
        modalClass={'modal-md'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className='p-0'>
          <Hide IF={isValid(edit?.id)}>
            <OvHourTab
              edit={edit}
              ips={ips}
              ipRes={ipResponse}
              editIpRes={editIpRes}
              getValue={getValues}
              reLabel={resLabel}
              useFieldArray={useFieldArray}
              getValues={getValues}
              setError={setError}
              loadingDetails={loadingDetails}
              requiredEnabled={requiredEnabled}
              watch={watch}
              setValue={setValue}
              onSubmit={handleSubmit(onSubmit)}
              stepper={stepper}
              control={control}
              errors={errors}
            />
          </Hide>
          <Show IF={isValid(edit?.id)}>
            <OvHourDetails
              ips={ips}
              ipRes={ipResponse}
              editIpRes={editIpRes}
              getValue={getValues}
              reLabel={resLabel}
              useFieldArray={useFieldArray}
              getValues={getValues}
              setError={setError}
              loadingDetails={loadingDetails}
              requiredEnabled={requiredEnabled}
              watch={watch}
              setValue={setValue}
              edit={edit}
              onSubmit={handleSubmit(onSubmit)}
              stepper={stepper}
              control={control}
              errors={errors}
            />
          </Show>
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

export default OvModal
