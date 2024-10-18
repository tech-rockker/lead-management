// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addFollowUp, editFollowUp, viewFollowUp } from '../../../../utility/apis/followup'
import { FM } from '../../../../utility/helpers/common'
import { isObjEmpty, jsonDecodeAll, setValues } from '../../../../utility/Utils'
import CenteredModal from '../../../components/modal/CenteredModal'
import DetailsCard from '../followupsDetails'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const FollowUpDetailsModal = ({
  step = 1,
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
    documents: ''
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
          ...data,
          follow_up_type: 1
        },
        id: editData?.id,
        loading: setLoading,
        dispatch,
        success: () => {
          handleModal()
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

  const handleCloses = (from = null) => {
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
        disableFooter={true}
        title={`${resLabel ? resLabel?.title : ''} ${FM(`followups-details`)}`}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-xl'}
        open={open}
        handleModal={handleCloses}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className='p-2'>
          <DetailsCard
            step={step}
            followUpId={followUpId}
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

export default FollowUpDetailsModal
