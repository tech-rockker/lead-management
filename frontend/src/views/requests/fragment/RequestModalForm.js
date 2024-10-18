// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import {
  addRequest,
  LoadRequest,
  deleteRequest,
  updateRequest
} from '../../../utility/apis/requests'
import { viewScTemplate } from '../../../utility/apis/scheduleTemplate'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { isObjEmpty, jsonDecodeAll, setValues, SuccessToast } from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import ApproveForm from './Tab/ApproveForm'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const RequestModalForm = ({
  ips = null,
  responseData = () => {},
  edit = null,
  editIpRes = null,
  noView = false,
  ipRes = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  followId = null,
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
  const ref = useRef()
  // log(ref)
  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // form data
  const formFields = {
    from_date: '',
    to_date: '',
    status: '',
    title: '',
    shifts: 'json'
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
    if (followId !== null) {
      // setEditData(followId)
      // setValue("ip_id", followId?.ip_id)
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
    if (followId === null) setEditData(null)
    setCurrentIndex(0)
  }
  log(followId)
  const loadDetails = () => {
    if (id) {
      viewScTemplate({
        id,
        loading: setLoading,
        success: (d) => {
          const values = jsonDecodeAll(formFields, {
            ...d
          })
          setEditData(values)
          setValues(formFields, values, setValue)
        }
      })
    }
  }
  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleSave = (data) => {
    log(data)
    if (isValid(edit?.id)) {
      updateRequest({
        jsonData: {
          ...edit,
          ...data,
          status: edit?.status
        },
        id: edit?.id,
        loading: setLoading,
        dispatch,
        success: () => {
          SuccessToast('renamed')
          handleModal()
        }
      })
    } else {
      addRequest({
        jsonData: {
          ...data,
          status: '0'
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
  // useEffect(() => {
  //     loadDetails()
  // }, [id])

  useEffect(() => {
    setId(followId)
  }, [followId])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    setIpResponse(ipRes)
  }, [ipRes])

  return (
    <>
      <CenteredModal
        scrollControl={false}
        title={FM(`request-form`)}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-sm'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className=''>
          <ApproveForm
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
          {/* <LeaveDetail   getValues={getValues} setError={setError} loadingDetails={loadingDetails} requiredEnabled={requiredEnabled} watch={watch} setValue={setValue} edit={editData} onSubmit={handleSubmit(onSubmit)} stepper={stepper} control={control} errors={errors} /> */}
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

export default RequestModalForm
