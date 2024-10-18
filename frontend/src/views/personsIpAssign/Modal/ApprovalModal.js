// ** Custom Components

import { Print } from '@material-ui/icons'
import React, { isValidElement, useEffect, useRef, useState } from 'react'
import DropZone from '../../components/buttons/fileUploader'
import { FileText } from 'react-feather'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Button, ButtonGroup, Card, CardBody, Col, Form, Row } from 'reactstrap'
import { addFollowUp, editFollowUp, viewFollowUp } from '../../../utility/apis/followup'
import { ipFollowupsPrint } from '../../../utility/apis/ip'
import { personApprovalAdd } from '../../../utility/apis/userManagement'
import { FM, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { isObjEmpty, jsonDecodeAll, setValues } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import Header from '../../header'
import FollowupDetails from '../../masters/followups/fragments/steps/FollowupDetails'
import ManualForm from './forms/ManualForm'
import DigitalSignature from './forms/DigitalSignature'
import BankIdForm from './forms/BankIdForm'
const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const ApprovalModal = ({
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
  const [showForm, setShowForm] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [id, setId] = useState(null)
  const [ipResponse, setIpResponse] = useState(ipRes)
  const [resLabel, setResLabel] = useState(null)
  const requiredEnabled = true

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [enableUpload, setEnableUpload] = useState(false)
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)

  // form data
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
    file: ''
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
    if (showModal) handleModal()
  }, [showModal])

  return (
    <>
      <CenteredModal
        done='Approve'
        title={FM('PersonApproval')}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-lg'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <CardBody>
          <Form>
            <Header title=''>
              <ManualForm
                data={edit}
                errors={errors}
                control={control}
                handleSubmit={handleSubmit}
                reset={reset}
                setValue={setValue}
                watch={watch}
                getValues={getValues}
                setError={setError}
              />
            </Header>
            <Row>
              <Col>
                <DigitalSignature
                  data={edit}
                  errors={errors}
                  control={control}
                  handleSubmit={handleSubmit}
                  reset={reset}
                  setValue={setValue}
                  watch={watch}
                  getValues={getValues}
                  setError={setError}
                />
              </Col>

              <Col md='12'>
                <BankIdForm
                  data={edit}
                  control={control}
                  handleSubmit={handleSubmit}
                  errors={errors}
                  reset={reset}
                  setValue={setValue}
                  watch={watch}
                  getValues={getValues}
                  setError={setError}
                />
              </Col>
            </Row>
          </Form>
        </CardBody>
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default ApprovalModal
