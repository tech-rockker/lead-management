/* eslint-disable prefer-template */
// ** Custom Components

import React, { useEffect, useRef, useState } from 'react'
import { FileText } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import {
  addDevitation,
  editDevitation,
  printDevitation,
  viewDevitation
} from '../../../utility/apis/devitation'
import { forDecryption } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import {
  createSteps,
  decryptObject,
  ErrorToast,
  isObjEmpty,
  jsonDecodeAll,
  setValues
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import StepsModal from '../../components/modal/StepsModal'
import Wizard from '../../components/wizard'
import CatSubCat from './steps/CatSubCat'
import Customer from './steps/Customer'
import DevDetails from './steps/DevDetails'
import Others from './steps/Others'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const DevitationModal = ({
  dUser = false,
  onSuccess = () => {},
  user = null,
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
  const [loadings, setLoadings] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [showForm, setShowForm] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [lastIndex, setLastIndex] = useState(2)
  const [id, setId] = useState(null)

  const [display, setDisplay] = useState(true)
  //  const valRes = isValid(ipRes) ? ipRes[0] : null
  const [reslabel, setResLabel] = useState(null)
  const requiredEnabled = true

  // ** Ref
  const ref = useRef(null)
  //label set

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const componentRef = useRef()

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
    further_investigation: 'json',
    is_secret: '',
    is_signed: '',
    is_completed: '',
    patient_id: '',
    category_id: '',
    subcategory_id: '',
    description: '',
    deviation_ids: []
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    clearErrors
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

  const handleSave = (data) => {
    if (editData && !isObjEmpty(editData)) {
      editDevitation({
        id,
        jsonData: {
          ...data,
          related_factor: data?.subcat_image ?? data?.cat_image ?? null
        },
        dispatch,
        loading: setLoading,
        success: () => {
          onSuccess(data)
          handleModal()
        }
      })
    } else {
      addDevitation({
        jsonData: {
          ...data,
          related_factor: data?.subcat_image ?? data?.cat_image ?? null
        },
        loading: setLoading,
        dispatch,
        success: (data) => {
          onSuccess(data)
          handleModal()
        }
      })
    }
  }

  const onSubmit = (d, next = false) => {
    log(d)
    log(errors)
    if (isObjEmpty(errors)) {
      handleSave(d)
    } else {
      stepper.next()
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleSaveForce = ({ next = false }) => {
    //log(d)
    log(errors)
    if (isObjEmpty(errors)) {
      handleSubmit((e) => onSubmit(e, next))()
    } else {
      ErrorToast('please-enter-required-fields-denoted-with-start')
      stepper.to(1)
      setCurrentIndex(0)
    }
  }

  const printDetails = (d, next = false) => {
    if (isValid(id)) {
      printDevitation({
        id,
        loading: setLoading,
        success: (a) => {
          window.open(a, '_blank')
          if (isObjEmpty(errors)) {
            handleSubmit((e) => onSubmit(e, next))()
          }
          // handleModal()
        }
      })
    }
  }

  const handleSaveNext = () => {
    stepper.next()
    setCurrentIndex(currentIndex + 1)
  }

  const handleClose = (from = null) => {
    if (from) {
      if (stepper?._currentIndex === 0) {
        handleModal()
      } else {
        stepper.previous()
        setCurrentIndex(currentIndex - 1)
      }
    } else {
      handleModal()
    }
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

  const visible = (index) => {
    if (index === 3) {
      if (Can(Permissions.investigationBrowse)) {
        return true
      }
    } else {
      return true
    }
  }

  const steps = [
    // {
    //     id: 'branch-patient',
    //     title: FM("patient-date"),
    //     subtitle: FM("enter-details"),
    //     content: <Customer currentIndex={currentIndex} showAlert={showAlert} requiredEnabled={requiredEnabled} watch={watch} setValue={setValue} edit={editData} onSubmit={handleSubmit(onSubmit)} stepper={stepper} control={control} errors={errors} />
    // },
    {
      id: 'cat-sbcat',
      title: FM('cat-sbcat'),
      subtitle: FM('enter-details'),
      icon: <FileText size={18} />,
      content: (
        <CatSubCat
          clearError={clearErrors}
          dUser={dUser}
          user={user}
          currentIndex={currentIndex}
          open={open}
          setDisplay={setDisplay}
          editIpRes={editIpRes}
          resLabel={reslabel}
          ipRes={ipRes}
          loadingDetails={loadingDetails}
          requiredEnabled={requiredEnabled}
          watch={watch}
          setValue={setValue}
          edit={editData}
          onSubmit={handleSubmit(onSubmit)}
          stepper={stepper}
          control={control}
          errors={errors}
        />
      )
    },

    {
      id: 'dev-details',
      title: FM('dev-form'),
      subtitle: FM('enter-details'),
      content: (
        <DevDetails
          showAlert={showAlert}
          requiredEnabled={requiredEnabled}
          watch={watch}
          setValue={setValue}
          edit={editData}
          onSubmit={handleSubmit(onSubmit)}
          stepper={stepper}
          control={control}
          errors={errors}
        />
      )
    },
    {
      id: 'investigation',
      title: FM('investigation'),
      subtitle: FM('enter-details'),
      content: (
        <Others
          actionType={actionType}
          setShowForms={setShowForm}
          showForms={showForm}
          requiredEnabled={requiredEnabled}
          watch={watch}
          setValue={setValue}
          edit={editData}
          onSubmit={handleSubmit(onSubmit)}
          stepper={stepper}
          control={control}
          errors={errors}
        />
      )
    }
  ]

  return (
    <>
      <StepsModal
        title={FM('devitation')}
        headerClose={true}
        hideClose={currentIndex === 0}
        display={display}
        closeButton={
          <>
            <Button.Ripple color='secondary' onClick={(e) => handleClose(null)} outline>
              {FM('close')}
            </Button.Ripple>
          </>
        }
        disableSave={loadingDetails}
        loading={loading}
        lastIndex={lastIndex}
        hideSave={currentIndex === lastIndex}
        currentIndex={currentIndex}
        modalClass={'modal-xl'}
        showForm={showForm}
        open={open}
        handleModal={handleClose}
        handleSave={handleSaveNext}
        extraButtons={
          <>
            <LoadingButton
              disabled={loadingDetails}
              loading={loading}
              color='primary'
              onClick={(e) => handleSaveForce(false)}
            >
              {FM('save')}
            </LoadingButton>
            {/* <Show IF={Permissions.deviationPrint}>
                            {editData?.id ? <LoadingButton disabled={loadingDetail}
                                loading={loadings}
                                color='secondary'
                                onClick={() => printDetails()}
                            >
                                {FM("save-print")}
                            </LoadingButton> : null}

                        </Show> */}
          </>
        }
      >
        <div className='vertical-wizard no-shadow mb-0'>
          <Wizard
            key={loadingDetails}
            options={{
              linear: loadingDetails
            }}
            perfectScroll={false}
            withShadow
            withBadge
            badgePosition='right'
            badgeColor='success'
            type='vertical'
            currentIndex={setCurrentIndex}
            instance={(el) => setStepper(el)}
            ref={ref}
            steps={createSteps(steps, visible)}
            stepClass={'ps-1 pe-1 mt-0 mb-0'}
            contentClass={'pt-0'}
            contentClassName={'fixed-contents-p-0'}
            headerClassName='bg-transparent p-0'
          />
        </div>
      </StepsModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default DevitationModal
