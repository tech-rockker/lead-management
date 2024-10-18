import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'
import {
  createJournal,
  createJournalAction,
  editJournal,
  viewJournal
} from '../../utility/apis/journal'
import { forDecryption } from '../../utility/Const'
import { FM, isValid } from '../../utility/helpers/common'
import { decryptObject, isObjEmpty, jsonDecodeAll, setValues } from '../../utility/Utils'
import LoadingButton from '../components/buttons/LoadingButton'
import CenteredModal from '../components/modal/CenteredModal'
import UserInfoCard from '../userManagement/patient/patientViews/view/UserInfoCard'
import ActionJournal from './ActionJournal'
import CreateJournal from './CreateJournal'
import ResultJournal from './ResultJournal'
import JournalTabs from './Tabs/JournalTabs'

const ResultModal = ({
  loadJournal = () => {},
  onSuccess = () => {},
  journalIds = null,
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
    setError
  } = useForm()

  useEffect(() => {
    if (edit !== null) {
      setEditData(edit)
      // setValues(formFields, values, setValue, modifyField)
      // setValues(edit)
    }
  }, [edit])

  const handleModal = (e) => {
    // if (!e) {
    setOpen(!open)
    setShowModal(!open)
    reset()
    setEditData(null)
    setCurrentIndex(0)
    // }
  }
  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (data, is_signed = 0) => {
    if (editData && !isObjEmpty(editData)) {
      editData({
        jsonData: {
          ...data,
          is_signed
        },
        loading: setLoading,
        // dispatch,
        success: (d) => {
          handleClose()
          onSuccess()
        }
      })
    } else {
      createJournalAction({
        jsonData: {
          ...data,
          is_signed
        },
        loading: setLoading,
        // dispatch,
        success: (d) => {
          handleClose()
          onSuccess()
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

  const loadDetails = () => {
    if (isValid(id)) {
      viewJournal({
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
          setValues(formFields, values, setValue)
        }
      })
    }
  }

  useEffect(() => {
    if (open === true && id) loadDetails()
  }, [open, id])

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
    setId(journalIds)
  }, [journalIds])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  return (
    <>
      <CenteredModal
        disableFooter={true}
        title={FM('journals')}
        modalClass='modal-xl'
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
        handleSign={handleSubmit(onHandleSign)}
        extraButtons={
          <>
            <LoadingButton loading={loading} color='primary' onClick={handleSign}>
              {FM('sign')}
            </LoadingButton>
          </>
        }
      >
        <div className='app-user-view p-1'>
          <Row>
            <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
              <UserInfoCard userId={editData?.patient_id} />
            </Col>
            <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
              <JournalTabs loadJournal={loadJournal} data={editData} />
            </Col>
          </Row>
          {/* <ResultJournal useFieldArray={useFieldArray} getValues={getValues} setError={setError} loadingDetails={loadingDetails} requiredEnabled={requiredEnabled} watch={watch} setValue={setValue} edit={edit} onSubmit={handleSubmit(onSubmit)} stepper={stepper} control={control} errors={errors} /> */}
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

export default ResultModal
