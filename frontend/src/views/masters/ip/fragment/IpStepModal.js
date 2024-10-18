/* eslint-disable prefer-template */
// ** Custom Components
import { WorkOutline } from '@material-ui/icons'
import React, { useEffect, useRef, useState } from 'react'
import { Award, Check, File, Home, ThumbsUp, User } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import { CategoryType, incompleteIpFields, ipFields } from '../../../../utility/Const'
import { Permissions } from '../../../../utility/Permissions'
import Show, { Can } from '../../../../utility/Show'
import {
  ErrorToast,
  SuccessToast,
  WarningToast,
  createSteps,
  getStatusId,
  incompleteSteps,
  isAllTrue,
  isObjEmpty,
  jsonDecodeAll,
  setValues
} from '../../../../utility/Utils'
import { addPatientPlan, editPatientPlan, viewPatientPlan } from '../../../../utility/apis/ip'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import useModules from '../../../../utility/hooks/useModules'
import ActivityModal from '../../../activity/fragment/activityModal'
import LoadingButton from '../../../components/buttons/LoadingButton'
import DropDownMenu from '../../../components/dropdown'
import StepsModal from '../../../components/modal/StepsModal'
import Wizard from '../../../components/wizard'
import FollowUpModal from '../../followups/fragments/followUpModal'
import TaskModal from '../../tasks/fragment/TaskModal'
import Step1 from './Steps/Step1'
import Step2 from './Steps/Step2'
import Step3 from './Steps/Step3'
import Step4 from './Steps/Step4'
import Step5 from './Steps/Step5'
import Step6 from './Steps/Step6'
import Step7 from './Steps/Step7'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const IpStepModal = ({
  path = null,
  user = null,
  enableNext = true,
  createFor = null,
  onSuccess = () => {},
  edit = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  handleToggle = () => {},
  ipId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()

  // Dispatch
  const [open, setOpen] = useState(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [editData, setEditData] = useState(null)
  const [showForm, setShowForm] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [lastIndex, setLastIndex] = useState(6)
  const [id, setId] = useState(null)
  const [display, setDisplay] = useState(true)
  const [stepBg, setStepBg] = useState(['', '', ''])
  const [patientActiveIndex, setPatientActiveIndex] = useState(0)
  const [patientLastIndex, setPatientLastIndex] = useState(5)
  const [ipRes, setIpRes] = useState([])
  const [ipResEdit, setIpResEdit] = useState([])
  const [btnSave, setBtnSave] = useState(false)
  const [followupsRes, setShowFollowUpRes] = useState(null)
  const [activityRes, setActivityRes] = useState(null)
  const [taskRes, setTaskRes] = useState(null)
  const [triggerApprove, setTriggerApprove] = useState(null)
  const requiredEnabled = true

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [addPatient, setAddPatients] = useState(false)
  const [action, setAction] = useState(null)
  const [patientLoading, setSavePatientLoading] = useState(null)

  // form data
  const formFields = { ...ipFields }
  const form = useForm()
  const {
    control,
    handleSubmit,
    formState: { errors, formValues, isSubmitSuccessful, submitCount, isSubmitted },
    reset,
    setValue,
    watch,
    getValues
  } = form

  useEffect(() => {
    if (edit !== null) {
      setEditData(edit)
    }
  }, [edit])

  const handleModal = (e) => {
    // if (!e) {
    setOpen(!open)
    setShowModal(!open)
    reset()
    setEditData(null)
    setIpResEdit([])
    setIpRes([])
    setCurrentIndex(0)
    // }
  }

  useEffect(() => {
    // setTimeout(() => {
    //     handleModal()
    // }, 4000)
    setIpRes([])
  }, [])

  const modifyField = (key, value) => {
    return value
  }

  const loadDetails = (id, onSuccess = () => {}) => {
    if (isValid(id)) {
      viewPatientPlan({
        id,
        loading: setLoadingDetails,
        success: (d) => {
          const values = jsonDecodeAll(formFields, d)
          setEditData(values)
          setValues(formFields, values, setValue, modifyField)
          setIpResEdit([values])
          onSuccess(values)
          // setValue("employees", values?.assign_employee?.map(d => d.user_id))
        }
      })
    }
  }

  const handleSave = (data, next = false, type = null) => {
    const ips = []
    data?.plans?.forEach((ip, index) => {
      const test = incompleteSteps(incompleteIpFields, { ...ip })
      const patient = isAllTrue(test['select-patient'], 'success', 'warning', 'danger')
      const living = isAllTrue(test['living-area'], 'success', 'warning', 'danger')
      const overall = isAllTrue(test['ip-overall-goal'], 'success', 'warning', 'danger')
      const factors = isAllTrue(test['ip-related-factors'], 'success', 'warning', 'danger')
      const treatment = isAllTrue(test['ip-treatment-working'], 'success', 'warning', 'danger')
      const files = isAllTrue(test['ip-file'], 'success', 'warning', 'danger')
      ips.push({
        ...ip,
        step_one: getStatusId(patient),
        step_two: getStatusId(living),
        step_three: getStatusId(overall),
        step_four: getStatusId(factors),
        step_five: getStatusId(treatment),
        step_six: getStatusId(files)
      })
    })

    log(type, 'type')
    if (editData && !isObjEmpty(editData)) {
      const _data = {
        ...data
      }
      editPatientPlan({
        id,
        jsonData: ips,
        dispatch,
        loading: setLoading,
        success: (data) => {
          onSuccess(data?.payload)
          setIpRes(data?.payload)
          // loadDetails(id, onSuccess)

          if (next) {
            if (type === 'f') {
              setShowFollowUp(next)
            } else if (type === 'a') {
              setShowActivity(next)
            } else if (type === 't') {
              setShowTaskModal(next)
            } else if (type === 'approve') {
              setTriggerApprove(true)
            }
          } else {
            if (type !== 'autoSave') {
              handleModal()
            }
          }
        }
      })
    } else {
      addPatientPlan({
        jsonData: ips,
        loading: setLoading,
        dispatch,
        success: (data) => {
          log('ipRes', data)
          onSuccess(data?.payload)
          setIpRes(data?.payload)
          // loadDetails(id, onSuccess)
          if (next) {
            if (type === 'f') {
              setShowFollowUp(next)
            } else if (type === 'a') {
              setShowActivity(next)
            } else if (type === 't') {
              setShowTaskModal(next)
            } else if (type === 'approve') {
              setTriggerApprove(true)
            }
          } else {
            if (type !== 'autoSave') {
              handleModal()
            }
          }
        }
      })
    }
  }

  const onSubmit = (d, next = false, type = null) => {
    log('onSubmit', d)
    log('errors', errors)
    if (isObjEmpty(errors)) {
      if (currentIndex === lastIndex) {
        handleSave(d, next, type)
      } else {
        stepper.next()

        setCurrentIndex(currentIndex + 1)
      }
    } else {
    }
  }

  const getStep = () => {
    if (!isValid(watch('user_id'))) {
      return 1
    } else {
      return 2
    }
  }

  const handleErrors = () => {
    log(errors)
    if (Object.entries(errors)?.length > 0) {
      ErrorToast('please-enter-required-fields-denoted-with-start')
      stepper.to(getStep())
      setCurrentIndex(0)
    }
  }

  const handleSaveForce = (next = false, type = null) => {
    handleSubmit((e) => handleSave(e, next, type))()
  }

  useEffect(() => {
    handleErrors()
  }, [submitCount, errors])

  const handleClose = (from = null) => {
    if (from) {
      if (stepper?._currentIndex === 0) {
        if (addPatient) {
          setAction('close')
        } else {
          handleModal()
        }
      } else {
        stepper.previous()
        setCurrentIndex(currentIndex - 1)
      }
    } else {
      handleModal()
    }
  }

  useEffect(() => {
    if (open === true && id) loadDetails(id)
  }, [open, id])

  useEffect(() => {
    handleToggle(open)
  }, [open])

  useEffect(() => {
    setId(ipId)
  }, [ipId])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  const handleStepBg = (index, color) => {
    const a = stepBg
    a.splice(index, 1, color)
    setStepBg([...a])
  }

  useEffect(() => {}, [watch('template')])

  const addFolloupupsRes = (d) => {
    setShowFollowUpRes(d)
  }

  const addAActivityRes = (d) => {
    setActivityRes(d)
  }

  const addTaskRes = (d) => {
    setTaskRes(d)
  }

  const steps = [
    {
      id: 'ip-step-1',
      title: FM('select-patient'),
      subtitle: FM('enter-person-details'),
      icon: <User size={18} />,
      content: (
        <Step1
          form={form}
          path={path}
          users={user}
          setSaveLoading={setSavePatientLoading}
          isSaved={ipRes?.length > 0}
          createFor={createFor}
          action={action}
          setActiveIndex={setPatientActiveIndex}
          setAction={setAction}
          setAddPatients={setAddPatients}
          handleStepBg={handleStepBg}
          setDisplay={setDisplay}
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
      id: 'ip-step-2',
      title: FM('living-area'),
      subtitle: FM('living-area-details'),
      icon: <Home size={18} />,
      content: (
        <Step2
          path={path}
          formFields={formFields}
          isSaved={ipRes?.length > 0}
          getValues={getValues}
          handleStepBg={handleStepBg}
          setDisplay={setDisplay}
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
      id: 'ip-step-5',
      title: FM('ip-overall-goal'),
      subtitle: FM('ip-overall-goal-details'),
      icon: <Award size={18} />,
      content: (
        <Step5
          path={path}
          isSaved={ipRes?.length > 0}
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
    },
    {
      id: 'ip-step-6',
      title: FM('ip-related-factors'),
      subtitle: FM('ip-related-factors-details'),
      icon: <ThumbsUp size={18} />,
      content: (
        <Step6
          path={path}
          isSaved={ipRes?.length > 0}
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
    },
    {
      id: 'ip-step-7',
      title: FM('ip-treatment-working'),
      subtitle: FM('ip-treatment-working-details'),
      icon: <WorkOutline size={18} />,
      content: (
        <Step7
          path={path}
          isSaved={ipRes?.length}
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
    },
    {
      id: 'ip-step-3',
      title: FM('decision'),
      subtitle: FM('ip-file-details'),
      icon: <File size={18} />,
      content: (
        <Step3
          path={path}
          isSaved={ipRes?.length}
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
    },
    {
      id: 'ip-step-8',
      title: FM('approval'),
      subtitle: FM('persons-approval'),
      icon: <File size={18} />,
      content: (
        <Step4
          path={path}
          setTriggerApprove={setTriggerApprove}
          triggerApprove={triggerApprove}
          handleSaveForce={(e) => handleSaveForce(true, 'approve')}
          ip={ipRes}
          isSaved={ipRes?.length}
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

  const visible = (index) => {
    if (index === 0) {
      if (createFor !== null) {
        return true
      }
    }
    return true
  }

  const saveOnNext = () => {
    if (isObjEmpty(errors)) {
      // const form = getValues()
      // log(form)
      // if (isValid(form.category_id) && isValid(form.subcategory_id) && isValid(form.title) && isValid(form.user_id)) {
      //     // handleSave(getValues()?.plans, false, 'autoSave')
      // }
      // handleSaveForce(false, 'autoSave')
    }
  }

  const handleSaveButton = (type = 'save') => {
    if (addPatient) {
      setAction(type)
    } else {
      stepper.next()
      setCurrentIndex(currentIndex + 1)
      saveOnNext()
    }
  }

  const handleFollowUp = () => {
    if (ipRes?.length) {
      setShowFollowUp(true)
      setDisplay(false)
    } else if (isValid(editData?.id)) {
      setShowFollowUp(true)
      setDisplay(false)
    } else {
      handleSaveForce(true, 'f')
      // setShowFollowUp(true)
    }
  }

  const handleActivity = () => {
    if (ipRes?.length) {
      setShowActivity(true)
      setDisplay(false)
    } else if (isValid(editData?.id)) {
      setShowActivity(true)
      setDisplay(false)
    } else {
      handleSaveForce(true, 'a')
      // setShowActivity(true)
    }
  }

  const handleTask = () => {
    if (ipRes?.length) {
      setShowTaskModal(true)
      setDisplay(false)
    } else if (isValid(editData?.id)) {
      setShowTaskModal(true)
      setDisplay(false)
    } else {
      handleSaveForce(true, 't')
      // setShowTaskModal(true)
    }
  }
  useEffect(() => {
    if (path !== null) {
      stepper?.to(path)
      // setActiveIndex((path - 1))
      setCurrentIndex(path - 1)
    }
  }, [path, stepper])

  return (
    <>
      {/* <Show IF={showFollowUp}> */}
      <TaskModal
        onSuccess={addTaskRes}
        resourceType={CategoryType.implementation}
        sourceId={edit?.id}
        showModal={showTaskModal}
        ipRes={ipId ? ipResEdit : ipRes}
        setShowModal={setShowTaskModal}
        handleToggle={(e) => {
          if (e) {
            setDisplay(false)
          } else {
            setDisplay(true)
          }
        }}
        noView
      />
      {/* </Show> */}
      {/* <Show IF={showActivity}> */}
      <ActivityModal
        onSuccess={addAActivityRes}
        showModal={showActivity}
        ipRes={ipId ? ipResEdit : ipRes}
        setShowModal={setShowActivity}
        handleToggle={(e) => {
          if (e) {
            setDisplay(false)
          } else {
            setDisplay(true)
          }
        }}
        noView
      />
      {/* </Show> */}
      {/* <Show IF={showFollowUp}> */}
      <FollowUpModal
        responseData={addFolloupupsRes}
        showModal={showFollowUp}
        ipRes={ipId ? ipResEdit : ipRes}
        setShowModal={setShowFollowUp}
        handleToggle={(e) => {
          if (e) {
            setDisplay(false)
          } else {
            setDisplay(true)
          }
        }}
        noView
      />
      {/* </Show> */}
      <StepsModal
        hideClose={addPatient ? patientActiveIndex === 0 : currentIndex === 0}
        closeButton={
          <>
            <Button.Ripple color='secondary' onClick={(e) => handleClose(null)} outline>
              {FM('close')}
            </Button.Ripple>
          </>
        }
        headerClose
        title={FM(`implementations`)}
        display={display}
        disableSave={loadingDetails}
        loading={loading}
        lastIndex={addPatient ? patientLastIndex : lastIndex}
        hideSave={addPatient ? patientActiveIndex === patientLastIndex : currentIndex === lastIndex}
        currentIndex={addPatient ? patientActiveIndex : currentIndex}
        modalClass={'modal-xl'}
        showForm={showForm}
        open={open}
        extraButtons={
          <>
            <Show IF={addPatient === false}>
              <DropDownMenu
                direction='up'
                button={
                  ipRes?.length <= 0 ? (
                    <LoadingButton
                      disabled={loadingDetails}
                      loading={loading}
                      color='primary'
                      onClick={(e) => handleSaveForce(false)}
                    >
                      {FM('save')}
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      disabled={loadingDetails}
                      size='sm'
                      loading={loading}
                      color='primary'
                      onClick={() => {
                        WarningToast('already-saved', { item: FM('ip') })
                      }}
                    >
                      <Check size={16} /> {FM('saved')}
                    </LoadingButton>
                  )
                }
                tooltip={FM(`save-and-create`)}
                options={[
                  {
                    IF: Permissions.ipFollowUpsSelfAdd,
                    icon: isValid(followupsRes?.id) ? <Check /> : null,
                    name: ipRes?.length
                      ? FM('create-followup')
                      : isValid(followupsRes?.id)
                      ? FM('followups-created')
                      : FM('create-followup'),
                    onClick: () => {
                      !isValid(followupsRes?.id)
                        ? handleFollowUp()
                        : SuccessToast(FM('followups-created'))
                    }
                  },
                  {
                    IF: Can(Permissions.activitySelfAdd) && ViewActivity,
                    hide: false,
                    icon: isValid(activityRes?.id) ? <Check /> : null,
                    name: ipRes?.length
                      ? FM('create-activity')
                      : isValid(activityRes?.id)
                      ? FM('activity-created')
                      : FM('create-activity'),
                    onClick: () => {
                      !isValid(activityRes?.id)
                        ? handleActivity()
                        : SuccessToast(FM('activity-created'))
                    }
                  },
                  {
                    IF: Permissions.taskAdd,
                    hide: enableNext,
                    icon: isValid(taskRes?.id) ? <Check /> : null,
                    name: ipRes?.length
                      ? FM('create-task')
                      : isValid(taskRes?.id)
                      ? FM('task-created')
                      : FM('create-task'),
                    onClick: () => {
                      !isValid(taskRes?.id) ? handleTask() : SuccessToast(FM('task-created'))
                    }
                  }
                ]}
              />
            </Show>
            <Show IF={addPatient === true}>
              <LoadingButton
                disabled={loadingDetails}
                loading={patientLoading}
                color='primary'
                onClick={(e) => handleSaveButton('save')}
              >
                {FM('save-patient')}
              </LoadingButton>
            </Show>
            {/* <Show IF={createFor !== null}>
                            <LoadingButton disabled={loadingDetails} loading={loading} color='primary' onClick={handleSaveForce}>
                                {FM("save-and-close")}
                            </LoadingButton>
                        </Show> */}
          </>
        }
        handleModal={handleClose}
        handleSave={(e) => handleSaveButton('next')}
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
            stepClass={'ps-1 pe-1 mt-0 mb-0'}
            steps={createSteps(steps, visible)}
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

export default IpStepModal
