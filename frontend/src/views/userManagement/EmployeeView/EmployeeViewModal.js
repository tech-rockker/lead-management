// ** Custom Components

import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { personApprovalAdd, viewUser } from '../../../utility/apis/userManagement'
import { forDecryption, userFields, UserTypes } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import Show from '../../../utility/Show'
import { decryptObject, isObjEmpty, jsonDecodeAll } from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import UserInfoCard from './AdminEmployee'
import FinalUserViews from './view/index'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const EmployeeViewModal = ({
  responseData = () => {},
  edit = null,
  editIpRes = null,
  noView = false,
  ipRes = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  eId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const { colors } = useContext(ThemeColors)
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
  const [editModal, setEditModal] = useState(false)

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [enableUpload, setEnableUpload] = useState(false)
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const [cashier, setCashier] = useState(null)

  const user = useUser()
  const isSu = user?.top_most_parent?.user_type_id === 1

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

  const handleEditModal = () => {
    setEditModal(false)
    //setEditData(null)
  }

  const modifyField = (key, value) => {
    if (key === 'questions') {
      value = value?.map((q) => q?.question_id)
    }
    return value
  }
  const formFields = {
    ...userFields
  }
  const loadDetails = () => {
    if (id) {
      viewUser({
        id,
        loading: setLoadingDetails,
        success: (d) => {
          const s = {
            ...d,
            country_id: d?.country?.id ?? '',
            employee_id: UserTypes.employee
          }
          const valuesTemp = jsonDecodeAll(formFields, s)
          const values = { ...valuesTemp, ...decryptObject(forDecryption, valuesTemp) }
          setEditData({
            ...edit,
            ...values
          })
        }
      })
    }
  }

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleSave = (data) => {
    personApprovalAdd({
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
    setId(eId)
  }, [eId])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    setIpResponse(ipRes)
  }, [ipRes])

  return (
    <>
      <Hide IF={isSu}>
        <CenteredModal
          done='Patient'
          title={editData?.name}
          disableFooter
          disableSave={loadingDetails}
          loading={loading}
          modalClass={'modal-xl'}
          open={open}
          handleModal={handleClose}
          handleSave={handleSubmit(onSubmit)}
        >
          <div className='p-1'>
            <FinalUserViews key={`final-view-for-${editData?.id}`} user={editData} />
          </div>
        </CenteredModal>
      </Hide>
      <Show IF={isSu}>
        <CenteredModal
          done='Patient'
          title={editData?.name}
          disableFooter
          disableSave={loadingDetails}
          loading={loading}
          modalClass={'modal-md'}
          open={open}
          handleModal={handleClose}
          handleSave={handleSubmit(onSubmit)}
        >
          <div>
            <UserInfoCard selectedUser={editData} />
          </div>
        </CenteredModal>
      </Show>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default EmployeeViewModal
