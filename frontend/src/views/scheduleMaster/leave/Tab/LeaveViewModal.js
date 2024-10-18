import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { FM, log } from '../../../../utility/helpers/common'
import EmployeeInfoCard from '../../schedule/fragment/Tabs/EmployeeInfoCard'
import LeaveTabs from './LeaveTabs'
import { leaveView } from '../../../../utility/apis/leave'
import CenteredModal from '../../../components/modal/CenteredModal'

import Shimmer from '../../../components/shimmers/Shimmer'

const LeaveViewModal = ({
  title,
  step = '1',
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
    shift_name: '',
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
  //log(editData)
  const loadDetails = () => {
    if (id) {
      leaveView({
        id,
        loading: setLoadingDetails,
        success: (d) => {
          // const values = jsonDecodeAll(formFields, {
          //     ...d?.payload,
          // repeat_datetime: [
          //     {
          //         start_date: d?.payload?.start_date,
          //         start_time: d?.payload?.start_time,
          //         end_date: d?.payload?.end_date,
          //         end_time: d?.payload?.end_time
          //     }
          // ]

          setEditData(d)
          log(d)
          // setValues(formFields, values, setValue, modifyField)
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
        title={title ?? `${FM(`leave-details`)}`}
        modalClass={'modal-lg'}
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
              <Col xl='5' lg='5' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                <EmployeeInfoCard setUserData={setUser} userId={editData?.user_id} />
              </Col>

              <Col xl='7' lg='7' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
                <LeaveTabs user={editData} leaveItem={editData} step={step} />
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

export default LeaveViewModal
