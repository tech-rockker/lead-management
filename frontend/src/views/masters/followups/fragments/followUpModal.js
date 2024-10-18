// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addFollowUp, editFollowUp, viewFollowUp } from '../../../../utility/apis/followup'
import { FM, isValid, isValidArray } from '../../../../utility/helpers/common'
import { isObjEmpty, jsonDecodeAll, setValues } from '../../../../utility/Utils'
import CenteredModal from '../../../components/modal/CenteredModal'
import FollowupDetails from './steps/FollowupDetails'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const FollowUpModal = ({
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
    ip_id: '',
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
    remarks: '',
    persons: '',
    questions: '',
    documents: 'json'
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

  const modifyField = (key, value) => {
    if (key === 'questions') {
      value = value?.map((q) => q?.question_id)
    }
    return value
  }

  const loadDetails = () => {
    if (id) {
      viewFollowUp({
        id,
        loading: setLoadingDetails,
        success: (d) => {
          const values = jsonDecodeAll(formFields, {
            ...d?.payload,
            repeat_datetime: [
              {
                start_date: d?.payload?.start_date,
                start_time: d?.payload?.start_time,
                end_date: d?.payload?.end_date,
                end_time: d?.payload?.end_time
              }
            ]
          })
          setEditData(values)
          setValues(formFields, values, setValue, modifyField)
        }
      })
    }
  }

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleSave = (data) => {
    if (editData && !isObjEmpty(editData)) {
      editFollowUp({
        jsonData: {
          // ...editData,

          branch_id: isValid(data?.branch_id) ? data?.branch_id : editData?.branch_id,
          ip_id: isValid(data?.ip_id) ? data?.ip_id : editData?.ip_id,
          title: isValid(data?.ip_id) ? data?.title : editData?.title,
          description: isValid(data?.description) ? data?.description : editData?.description,
          remarks: isValid(data?.remarks) ? data?.remarks : editData?.remarks,
          reason_for_editing: isValid(data?.reason_for_editing) ? data?.reason_for_editing : '',
          repeat_datetime: isValidArray(data?.repeat_datetime)
            ? data?.repeat_datetime
            : data?.repeat_datetime,

          follow_up_type: 1,
          documents: isValidArray(data?.documents) ? data?.documents : []
        },
        id: editData?.id,
        loading: setLoading,
        dispatch,
        success: (d) => {
          handleModal()
          responseData(d?.payload)
        }
      })
    } else {
      addFollowUp({
        jsonData: {
          ...data,
          follow_up_type: 1
        },
        loading: setLoading,
        dispatch,
        success: (d) => {
          responseData(d?.payload)
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

  return (
    <>
      <CenteredModal
        title={`${resLabel ? resLabel?.title : ''} ${FM(`followups`)}`}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-xl'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className='p-2'>
          <FollowupDetails
            ips={ips}
            ipRes={ipResponse}
            editIpRes={editIpRes}
            reLabel={resLabel}
            useFieldArray={useFieldArray}
            getValues={getValues}
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

export default FollowUpModal
