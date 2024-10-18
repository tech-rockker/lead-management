// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Card } from 'reactstrap'
import { requestLoad } from '../../../redux/reducers/requests'
import {
  addRequest,
  LoadRequest,
  deleteRequest,
  updateRequest,
  approveRequest
} from '../../../utility/apis/requests'
import { viewScTemplate } from '../../../utility/apis/scheduleTemplate'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { isObjEmpty, jsonDecodeAll, setValues, SuccessToast } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import ApproveForm from './Tab/ApproveForm'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const ApproveModal = ({
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

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleSave = (data) => {
    log(data)
    if (isValid(edit?.id)) {
      approveRequest({
        jsonData: {
          ...data,
          status: edit?.status
        },
        id: edit?.id,
        loading: setLoading,
        dispatch,
        success: (e) => {
          if (e?.payload?.status === '1') {
            SuccessToast('Request Approved')
          } else {
            SuccessToast('Request Rejected')
          }
          responseData(e?.payload)
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
        title={edit.status === '1' ? FM(`approval-modal`) : FM(`rejection-modal`)}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-sm'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className='p-1'>
          <FormGroupCustom
            name={'reply_comment'}
            type={'autocomplete'}
            errors={errors}
            placeholder={FM('reply-comment')}
            label={FM('reply-comment')}
            className='mb-1'
            control={control}
            setValue={setValue}
            rules={{ required: false }}
            value={edit?.title}
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

export default ApproveModal
