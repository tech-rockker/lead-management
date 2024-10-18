// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { handleLogin } from '../../../redux/authentication'
import { updateUserProfile } from '../../../utility/apis/companyApis'
import { userFields } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import { isObjEmpty, setValues } from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'

import Forms from './Tabs/Forms'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const ProfileUpdateModal = ({
  reloadDetails = () => {},
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
  const [editData, setEditData] = useState(edit)
  const [showForm, setShowForm] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [id, setId] = useState(null)
  const [ipResponse, setIpResponse] = useState(ipRes)
  const [resLabel, setResLabel] = useState(null)
  const requiredEnabled = true
  const user = useUser()

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // form data
  const formFields = {
    name: '',
    email: '',
    contact_number: '',
    gender: '',
    personal_number: '',
    organization_number: '',
    city: '',
    postal_code: '',
    zipcode: '',
    full_address: '',
    contact_person_number: ''
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
    if (ipRes !== null) {
      setResLabel(ipRes[0])
    }
  }, [ipRes])

  useEffect(() => {
    if (isValid(edit)) {
      setValues(userFields, edit, setValue)
    }
  }, [edit])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    if (edit === null) setEditData(null)
    //  setCurrentIndex(0)
  }

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleSave = (data) => {
    updateUserProfile({
      jsonData: {
        // ...user,
        ...data,
        avatar: data?.avatar[0]?.file_url ?? user?.avatar
      },
      loading: setLoading,
      dispatch,
      success: (d) => {
        const x = {
          ...user,
          ...d?.payload
        }
        dispatch(handleLogin(x))
        //SuccessToast("done")
        handleModal()
        reloadDetails()
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
        title={`${resLabel ? resLabel?.title : ''} ${FM(`profile-update`)}`}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-xl'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className='p-2'>
          <Forms
            ips={ips}
            ipRes={ipResponse}
            editIpRes={edit}
            reLabel={resLabel}
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

export default ProfileUpdateModal
