// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { loadComments } from '../../../utility/apis/comment'
import { viewDevitation } from '../../../utility/apis/devitation'
import { viewPatientPlan } from '../../../utility/apis/ip'
import { forDecryption } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import { decryptObject, jsonDecodeAll, setValues } from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import DeviationView from './deviationView'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const DeviationDetailsModal = ({
  onSuccess = () => {},
  edit = null,
  editIpRes = null,
  noView = false,
  ipRes = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  devitationId = null,
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
  const [ipResponse, setIpResponse] = useState(ipRes)
  const [display, setDisplay] = useState(true)
  //  const valRes = isValid(ipRes) ? ipRes[0] : null
  const [resLabel, setResLabel] = useState(null)
  const requiredEnabled = true

  // ** Ref
  const ref = useRef(null)
  //label set

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [comments, setComments] = useState([])
  const [ip, setIp] = useState([])
  const [ipLoading, setIpLoading] = useState(false)

  // form data
  const formFields = {
    branch_id: '',
    date_time: '',
    immediate_action: '',
    probable_cause_of_the_incident: '',
    suggestion_to_prevent_event_again: '',
    related_factor: '',
    critical_range: '',
    follow_up: '',
    further_investigation: '',
    copy_sent_to: [],
    is_secret: '',
    is_signed: '',
    is_completed: '',
    patient_id: '',
    category_id: '',
    subcategory_id: '',
    description: ''
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    setError,
    watch
  } = useForm()

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
  }

  const modifyField = (key, value) => {
    if (key === 'questions') {
      value = value?.map((q) => q?.question_id)
    }
    return value
  }

  const loadDetails = () => {
    if (isValid(id)) {
      viewDevitation({
        id,
        loading: setLoadingDetails,
        success: (a) => {
          const d = {
            ...a
          }
          const valuesTemp = jsonDecodeAll(formFields, d)
          const values = {
            ...valuesTemp,
            patient: decryptObject(forDecryption, valuesTemp?.patient),
            employee: decryptObject(forDecryption, valuesTemp?.employee),
            branch: decryptObject(forDecryption, valuesTemp?.branch)
          }

          setEditData(values)
          setValues(formFields, values, setValue, modifyField)
        }
      })
    }
  }

  const ipIds = parseInt(location?.state?.data?.ip_id)
  const loadIpDetailsData = () => {
    if (!ipIds === NaN) {
      viewPatientPlan({
        id: ipIds,
        loading: setIpLoading,
        success: (e) => setIp(e)
      })
    }
  }

  useEffect(() => {
    loadIpDetailsData()
    if (!isValid(editData)) {
      // loadDetails()
    }
  }, [editData])

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleCloses = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (open === true && id) loadDetails()
  }, [open, id])

  useEffect(() => {
    setId(devitationId)
  }, [devitationId])

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
        title={`${resLabel ? resLabel?.title : ''} ${FM(`deviation-details`)}`}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-xl'}
        open={open}
        handleModal={handleCloses}
      >
        <div className='p-2'>
          <DeviationView
            devitationId={devitationId}
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

export default DeviationDetailsModal
