import { is } from 'immutable'
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { createJournal, editJournal } from '../../utility/apis/journal'
import { FM, isValid, log } from '../../utility/helpers/common'
import { isObjEmpty, setValues } from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import CenteredModal from '../components/modal/CenteredModal'
import CreateJournal from './CreateJournal'

const AddJournal = ({
  dUser = false,
  patientId = null,
  loadJournal = () => {},
  onSuccess = () => {},
  journalId = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  edit = null,
  responseData = () => {},
  Component = 'span',
  noView = false,
  children = null,
  ...rest
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingSign, setLoadingSign] = useState(false)
  const [open, setOpen] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [editData, setEditData] = useState(null)
  const [stepper, setStepper] = useState(null)
  const [id, setId] = useState(null)

  const [loadingDetails, setLoadingDetails] = useState(false)
  const requiredEnabled = true

  const ref = useRef(null)

  const formFields = {
    parent_id: '',
    deviation_id: '',
    top_most_parent_id: '',
    branch_id: '',
    patient_id: '',
    emp_id: '',
    category_id: '',
    subcategory_id: '',
    activity_id: '',
    date: '',
    time: '',
    description: '',
    is_signed: '',
    entry_mode: '',
    status: ''
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError,
    clearErrors
  } = useForm()

  useEffect(() => {
    if (edit !== null) {
      setEditData(edit)
      // setValues(formFields, values, setValue, modifyField)
      // setValues(edit)
    }
  }, [edit])

  const handleModal = (e) => {
    setOpen(!open)
    setShowModal(!open)
  }
  const handleClose = (from = null) => {
    reset()
    setCurrentIndex(0)
    handleModal()
    setEditData(null)
  }

  const handleSave = (data, is_signed = 0) => {
    if (isValid(edit?.id)) {
      editJournal({
        id: edit?.id,
        jsonData: {
          ...data,
          is_signed
        },
        loading: is_signed ? setLoadingSign : setLoading,
        dispatch,
        success: (d) => {
          log(edit?.patient_id, d?.payload?.patient_id)

          if (edit?.patient_id !== d?.payload?.patient_id) {
            log('patinet-changed')
            loadJournal(d)
          }
          // onSuccess()
          // loadJournal()
          console.log(d)
          handleClose()
        }
      })
      // console.log(editData)
    } else {
      createJournal({
        jsonData: {
          ...data,
          is_signed
        },
        loading: is_signed ? setLoadingSign : setLoading,
        dispatch,
        success: (d) => {
          handleClose()
          // onSuccess()
          // loadJournal()
        }
      })
    }
  }

  const handleSign = (data) => {
    handleSave(data, 1)
  }

  const onSubmit = (d) => {
    if (isObjEmpty(errors)) {
      handleSave(d)
    }
  }

  //edit

  // const loadDetails = () => {
  //     if (isValid(id)) {
  //         load({
  //             id,
  //             loading: setLoadingDetails,
  //             success: a => {
  //                 const d = {
  //                     ...a
  //                 }
  //                 const values = jsonDecodeAll(formFields, d)
  //                 setEditData(values)
  //                 setValues(formFields, values, setValue, modifyField)
  //                 setValue("employees", values?.assign_employee?.map(d => d.user_id))
  //             }
  //         })
  //     }
  // }

  const onHandleSign = (d) => {
    if (isObjEmpty(errors)) {
      handleSign(d)
    }
  }

  // useEffect(() => {
  //     if (open === true && id) loadDetails()
  // }, [open, id])

  const handleSaveForce = () => {}

  useEffect(() => {
    setId(journalId)
  }, [journalId])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  const createStrike = (edit) => {
    if (edit === null) {
      return FM('create-journal')
    }
    if (edit?.is_signed === 1) {
      return FM('strike')
    } else {
      return FM('edit-journal')
    }
  }

  return (
    <>
      <CenteredModal
        hideSave={edit?.is_signed === 1}
        disableFooter={false}
        title={createStrike(edit)}
        modalClass='modal-lg'
        open={open}
        loading={loading}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
        handleSign={handleSubmit(onHandleSign)}
        extraButtons={
          <>
            <LoadingButton
              loading={loadingSign}
              color='primary'
              onClick={handleSubmit(onHandleSign)}
            >
              {FM('sign')}
            </LoadingButton>
          </>
        }
      >
        <div className='p-2'>
          <CreateJournal
            dUser={dUser}
            patientId={patientId}
            useFieldArray={useFieldArray}
            getValues={getValues}
            setError={setError}
            loadingDetails={loadingDetails}
            requiredEnabled={requiredEnabled}
            clearError={clearErrors}
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

export default AddJournal
