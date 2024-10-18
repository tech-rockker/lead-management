// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { addOv, editOv, viewOv } from '../../../../utility/apis/ovhour'
import { FM, isValid } from '../../../../utility/helpers/common'
import { isObjEmpty, jsonDecodeAll, setValues, SuccessToast } from '../../../../utility/Utils'
import CenteredModal from '../../../components/modal/CenteredModal'
import OvDetailView from './OvDetailView'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const OvModalView = ({
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
    handleToggle(open)
  }, [open])

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
        disableFooter
        title={`${resLabel ? resLabel?.title : ''} ${FM(`view-ov`)}`}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-lg'}
        open={open}
        handleModal={handleClose}
      >
        <div className='p-2'>
          <OvDetailView
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

export default OvModalView
