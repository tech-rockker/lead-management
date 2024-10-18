import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { viewFollowUp } from '../../../utility/apis/followup'
import { forDecryption } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import { decryptObject, jsonDecodeAll, setValues } from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import Shimmer from '../../components/shimmers/Shimmer'
import UserInfoCard from '../../userManagement/patient/patientViews/view/UserInfoCard'
import FollowUpTabs from './Tabs'

const FollowupViewModal = ({
  step = 1,
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
  const [user, setUser] = useState([])

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

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
    documents: 'json',
    more_witness: 'json',
    witness: 'json'
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
          const valuesTemp = jsonDecodeAll(formFields, {
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
          const values = {
            ...valuesTemp,
            patient: decryptObject(forDecryption, valuesTemp?.patient),
            employee: decryptObject(forDecryption, valuesTemp?.employee),
            branch: decryptObject(forDecryption, valuesTemp?.branch),
            action_by_user: decryptObject(forDecryption, valuesTemp?.action_by_user),
            witness_List: valuesTemp?.witness_List?.map((a) => ({
              ...a,
              user: decryptObject(forDecryption, a?.user)
            }))
          }

          setEditData(values)
          setValues(formFields, values, setValue, modifyField)
        }
      })
    }
  }

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
        disableFooter={true}
        title={`${FM(`followup-details`)}`}
        modalClass={'modal-xl'}
        open={open}
        handleModal={handleModal}
      >
        {loading ? (
          <>
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5, marginTop: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
            <Shimmer style={{ width: '100%', height: 50, marginBottom: 5 }} />
          </>
        ) : (
          <div className='app-user-view p-1'>
            <Row>
              <Show IF={editData?.patient_implementation_plan?.user_id !== null}>
                <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                  <UserInfoCard
                    setUserData={setUser}
                    userId={editData?.patient_implementation_plan?.user_id}
                  />
                </Col>
              </Show>
              <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
                <FollowUpTabs user={user} followup={editData} step={step} />
              </Col>
            </Row>
          </div>
        )}
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default FollowupViewModal
