import React, { useEffect, useRef, useState } from 'react'
import { Info, User, Users } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'reactstrap'
import { loadUserDetails } from '../../../redux/reducers/userManagement'
import { UserTypes, incompletePatientFields } from '../../../utility/Const'
import { Permissions } from '../../../utility/Permissions'
import {
  ErrorToast,
  createSteps,
  getStatusId,
  incompletePatient,
  incompleteSteps,
  isAllTrue,
  isObjEmpty,
  setValues
} from '../../../utility/Utils'
import { addUser, editUser } from '../../../utility/apis/userManagement'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import useTopMostParent from '../../../utility/hooks/useTopMostParent'
import LoadingButton from '../../components/buttons/LoadingButton'
import DropDownMenu from '../../components/dropdown'
import StepsModal from '../../components/modal/StepsModal'
import Wizard from '../../components/wizard'
import IpStepModal from '../../masters/ip/fragment/IpStepModal'
import { userFields } from './../../../utility/Const'
import UserStep1 from './steps/UserStep1'
import UserStep2 from './steps/UserStep2'
import UserStep3 from './steps/UserStep3'
import UserStep4 from './steps/UserStep4'
import UserStep5 from './steps/UserStep5'
import UserStep6 from './steps/UserStep6'

const UserModal = ({
  responseData = () => {},
  step = null,
  setSaveLoading = () => {},
  fromIp = false,
  setActiveIndex = () => {},
  action = null,
  setAction = () => {},
  contentClassName = null,
  noModal = false,
  enableSaveIp = true,
  scrollControl = true,
  userType = null,
  onSuccess = () => {},
  edit = null,
  noView = false,
  handleToggle = () => {},
  showModal = false,
  setShowModal = () => {},
  userId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  // Dispatch
  const dispatch = useDispatch()
  const { selectedUser, loadingDetails } = useSelector((s) => s.userManagement)
  const [loading, setLoading] = useState(false)
  // const [loadingDetails, setLoadingDetails] = useState(false)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [showForm, setShowForm] = useState(null)
  const [lastIndex, setLastIndex] = useState(5)
  const [s, setS] = useState(null)
  const [id, setId] = useState(null)
  const [display, setDisplay] = useState(true)
  const topMostParent = useTopMostParent()

  const requiredEnabled = true

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showIpModal, setShowIpModal] = useState(null)

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

  const [companyData, setCompanyData] = useState(null)

  //ptientRes
  const [patientRes, setPatientRes] = useState(null)
  const [incomplete, setIncomplete] = useState(null)

  useEffect(() => {
    setActiveIndex(currentIndex)
  }, [currentIndex])

  const modifyField = (key, value) => {
    if (key === 'agency_hours') {
      return []
    } else if (key === 'company_type_id') {
      return isValidArray(value) ? value[0] : null
    }
    return value
  }

  const loadDetails = () => {
    if (isValid(id)) {
      dispatch(
        loadUserDetails({
          id,
          userType
        })
      )
    }
  }
  const viewDetails = (onSuccess = () => {}) => {
    if (isValid(id) && isValid(selectedUser)) {
      setIncomplete(incompletePatient(incompletePatientFields, selectedUser))
      setCompanyData(selectedUser)
      setEditData(selectedUser)
      setValues(userFields, selectedUser, setValue, modifyField)
      onSuccess(selectedUser)
    }
  }
  useEffect(() => {
    viewDetails()
  }, [selectedUser])

  useEffect(() => {
    if (open === true && id) {
      loadDetails()
    }
  }, [open, id])

  useEffect(() => {
    setId(userId)
  }, [userId])

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleModal = () => {
    setCurrentIndex(0)
    setOpen(!open)
    setShowModal(!open)
    reset()
    setCompanyData(null)
    setEditData(null)
    // onSuccess(d?.payload)
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

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

  const handleSave = (data, openIp = false) => {
    log('openIp', data)
    const test = incompleteSteps(incompletePatientFields, { ...data })
    const info = isAllTrue(test['personal-details'], 'success', 'warning', 'danger')
    const relative = isAllTrue(test['relative-caretaker'], 'success', 'warning', 'danger')
    const diseases = isAllTrue(test['disability-details'], 'success', 'warning', 'danger')
    const work = isAllTrue(test['studies-work'], 'success', 'warning', 'danger')
    const decision = isAllTrue(test['decision-document'], 'success', 'warning', 'danger')

    const per_number = data?.personal_number
    const dashRemoved = per_number?.replaceAll('-', '')
    const genPassword = Math.random()?.toString(36)?.substring(2, 12)
    let object = {
      // eslint-disable-next-line prefer-template
      // company_type_id: isValid(data?.company_type_id) ? data?.company_type_id?.map(d => "" + d) : [],
      name: data?.name,
      email: data?.email,
      user_type_id:
        topMostParent?.user_type_id === UserTypes.admin ? UserTypes.adminEmployee : userType,
      gender: data?.gender,
      role_id: isValid(data?.role_id) ? data?.role_id : null,
      branch_id: isValid(data?.branch_id) ? data?.branch_id : null,
      country_id: data?.country_id,
      full_address: data?.full_address,
      city: data?.city,
      postal_area: data?.postal_area,
      contact_number: isValid(data?.contact_number) ? data?.contact_number : null,
      zipcode: data?.zipcode,
      personal_number: dashRemoved,
      password: genPassword,
      'confirm-password': genPassword,
      documents: data?.documents,
      avatar: data?.avatar
    }

    if (userType === UserTypes.patient) {
      object = {
        ...object,
        role_id: isValid(object?.role_id) ? object?.role_id : 6,
        agency_hours: isValid(data?.agency_hours) ? data?.agency_hours : [],
        custom_unique_id: isValid(data?.custom_unique_id) ? data?.custom_unique_id : null,
        is_secret: isValid(data?.is_secret) ? data?.is_secret : 0,
        disease_description: isValid(data?.disease_description) ? data?.disease_description : null,
        aids: isValid(data?.aids) ? data?.aids : null,
        special_information: isValid(data?.special_information) ? data?.special_information : null,
        place_name: isValid(data?.place_name) ? data?.place_name : null,
        working_from: isValid(data?.working_from) ? data?.working_from : null,
        working_to: isValid(data?.working_to) ? data?.working_to : null,
        user_color: isValid(data?.user_color) ? data?.user_color : '#1fff',
        persons: isValidArray(data?.persons) ? data?.persons : [],
        // eslint-disable-next-line prefer-template
        patient_type_id: isValidArray(data?.patient_type_id)
          ? data?.patient_type_id?.map((d) => `${d}`)
          : [],
        company_type_id: isValid(data?.company_type_id) ? [data?.company_type_id] : null,

        institute_name: data?.institute_name,
        institute_contact_number: data?.institute_contact_number,
        institute_contact_person: data?.institute_contact_person,
        institute_full_address: data?.institute_full_address,
        institute_week_days: data?.institute_week_days,
        classes_from: data?.classes_from,
        classes_to: data?.classes_to,

        company_name: data?.company_name,
        company_contact_number: data?.company_contact_number,
        company_contact_person: data?.company_contact_person,
        company_full_address: data?.company_full_address,
        company_week_days: data?.company_week_days,
        from_timing: data?.from_timing,
        to_timing: data?.to_timing,

        aids: data?.aids,
        special_information: data?.special_information,

        another_activity: data?.another_activity,
        another_activity_name: data?.another_activity_name,
        activitys_contact_number: data?.activitys_contact_number ?? null,
        another_activity_contact_person: data?.another_activity_contact_person,
        activitys_full_address: data?.activitys_full_address,
        week_days: data?.week_days,
        another_activity_end_time: data?.another_activity_end_time,
        another_activity_start_time: data?.another_activity_start_time,
        is_fake: data?.is_fake,
        is_password_change: data?.is_password_change,
        assigned_employee: data?.assigned_employee,
        //steps
        step_one: getStatusId(info),
        step_two: getStatusId(relative),
        step_three: getStatusId(diseases),
        step_four: getStatusId(work),
        step_five: getStatusId(decision)
      }
    }

    if (userType === UserTypes.employee) {
      object = {
        ...object,
        role_id: isValid(object?.role_id) ? object?.role_id : `${topMostParent?.id}-employee`,
        // user_color: isValid(data?.user_color) ? data?.user_color : "#1fd",
        joining_date: isValid(data?.joining_date) ? data?.joining_date : null,
        employee_type: data?.employee_type ?? null,
        contract_type: data?.contract_type ?? null,
        contract_value: data?.contract_value ?? null,
        working_percent: data?.working_percent ?? null,
        assigned_working_hour_per_week: data?.assigned_working_hour_per_week ?? null,
        municipal_name: data?.municipal_name ?? null,
        verification_method: data?.verification_method ?? null,
        assigned_patiens: data?.assigned_patiens
      }
    }

    if (isValid(id)) {
      editUser({
        id,
        jsonData: object,
        dispatch,
        loading: setLoading,
        success: (d) => {
          reset()
          onSuccess(d?.payload)
          setPatientRes(d?.payload)
          if (openIp) {
            {
              userType === UserTypes?.patient ? setShowIpModal(true) : setShowIpModal(false)
            }
          } else {
            handleModal()
          }
        }
      })
    } else {
      addUser({
        jsonData: {
          ...object
        },
        loading: setLoading,
        dispatch,
        success: (data) => {
          reset()
          onSuccess(data?.payload)
          setPatientRes(data?.payload)
          if (userType === UserTypes.employee) {
            handleModal()
          }
          if (openIp) {
            {
              userType === UserTypes?.patient ? setShowIpModal(true) : setShowIpModal(false)
            }
          } else {
            handleModal()
          }
        }
      })
    }
  }

  const onSubmit = (d, openIp = false) => {
    log('d', d)
    log('openIp', openIp)
    log('errors', errors)
    if (isObjEmpty(errors)) {
      handleSave(d, openIp)
    }
  }

  const handleSaveForce = (next = false) => {
    if (isObjEmpty(errors)) {
      handleSubmit((e) => onSubmit(e, next))()
    } else {
      ErrorToast('please-enter-required-fields-denoted-with-start')
      stepper.to(1)
      setActiveIndex(0)
      setCurrentIndex(0)
    }
  }

  useEffect(() => {
    log('step', step, new Date())

    if (step !== null) {
      setS(step)
      setActiveIndex(step - 1)
      setCurrentIndex(step - 1)
    }
  }, [step])

  useEffect(() => {
    log(s, new Date(), stepper)
    if (s !== null && stepper?._currentIndex !== s) {
      stepper?.to(s)
    }
  }, [s, stepper])

  const handleSaveNext = () => {
    stepper.next()
    setCurrentIndex(currentIndex + 1)
  }

  useEffect(() => {
    if (action === 'save') {
      log('save called')
      handleSubmit((e) => onSubmit(e, false))()
      setAction(null)
    } else if (action === 'close') {
      handleClose('action')
      setAction(null)
    } else if (action === 'next') {
      handleSaveNext()
      setAction(null)
    } else if (action === 'prev') {
      stepper.previous()
      setCurrentIndex(currentIndex - 1)
      setAction(null)
    }
  }, [action])

  useEffect(() => {
    setSaveLoading(loading)
  }, [loading])

  // const a = ["2022-04-12", "2022-05-12", "2022-08-12", "2022-09-09"]

  const steps = [
    {
      id: 'user-step-1',
      title: FM('personal-details'),
      subtitle: FM('enter-personal-details'),
      icon: <Info size={18} />,
      content: (
        <UserStep1
          isEdit={isValid(id)}
          clearErrors={clearErrors}
          setError={setError}
          activeIndex={currentIndex}
          userType={userType}
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
      id: 'user-step-2',
      title: FM('relative-caretaker'),
      subtitle: FM('relative-caretaker-details'),
      icon: <Users size={18} />,
      content: (
        <UserStep2
          fromIp={fromIp}
          incomplete={incomplete}
          activeIndex={currentIndex}
          userType={userType}
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
      id: 'user-step-3',
      title: FM('disability-details'),
      subtitle: FM('disability-details-details'),
      icon: <User size={18} />,
      content: (
        <UserStep3
          activeIndex={currentIndex}
          userType={userType}
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
      id: 'user-step-4',
      title: FM('studies-work'),
      subtitle: FM('studies-work-details'),
      icon: <User size={18} />,
      content: (
        <UserStep4
          activeIndex={currentIndex}
          userType={userType}
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
      id: 'user-step-5',
      title: FM('other-activities'),
      subtitle: FM('other-activities-details'),
      icon: <User size={18} />,
      content: (
        <UserStep5
          activeIndex={currentIndex}
          userType={userType}
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
      id: 'user-step-6',
      title: userType === UserTypes.employee ? FM('document') : FM('decision-document'),
      subtitle: userType === UserTypes.employee ? FM('upload-document') : FM('decision-details'),
      icon: <User size={18} />,
      content: (
        <UserStep6
          getValues={getValues}
          activeIndex={currentIndex}
          userType={userType}
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
    }
  ]

  const visible = (index) => {
    if (userType === UserTypes.patient) {
      return true
    } else if (userType === UserTypes.employee) {
      if (index === 0 || index === 5) {
        return true
      }
    }
  }

  const renderWithModal = () => {
    return (
      <StepsModal
        hideClose={
          userType === UserTypes.patient
            ? currentIndex === 0
            : userType === UserTypes.employee
            ? currentIndex !== 1
            : null
        }
        closeButton={
          <>
            <Button.Ripple color='secondary' onClick={(e) => handleClose(null)} outline>
              {FM('close')}
            </Button.Ripple>
          </>
        }
        headerClose={true}
        display={display}
        title={userType === UserTypes?.patient ? FM('patient') : FM('employees')}
        scrollControl={scrollControl}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-xl'}
        lastIndex={userType === UserTypes?.patient ? lastIndex : 1}
        // enableForceSave={UserTypes.employee}
        hideSave={userType === UserTypes?.patient ? currentIndex === lastIndex : currentIndex === 1}
        currentIndex={currentIndex}
        showForm={showForm}
        open={open}
        handleModal={handleClose}
        handleSave={handleSaveNext}
        extraButtons={
          enableSaveIp && userType === UserTypes?.patient ? (
            <>
              <DropDownMenu
                direction='up'
                button={
                  <LoadingButton
                    disabled={loadingDetails}
                    loading={loading}
                    color='primary'
                    onClick={(e) => handleSaveForce(false)}
                  >
                    {FM('save')}
                  </LoadingButton>
                }
                options={[
                  {
                    IF: Permissions.ipSelfAdd,
                    name: isValid(patientRes) ? FM('create-ip') : FM('save-create-ip'),
                    onClick: () => {
                      handleSaveForce(true)
                    }
                  }
                ]}
              />
            </>
          ) : userType === UserTypes?.employee ? (
            <>
              <LoadingButton
                disabled={loadingDetails}
                loading={loading}
                color='primary'
                onClick={(e) => handleSaveForce(false)}
              >
                {FM('save')}
              </LoadingButton>{' '}
            </>
          ) : (
            <LoadingButton
              disabled={loadingDetails}
              loading={loading}
              color='primary'
              onClick={(e) => handleSaveForce(false)}
            >
              {FM('save')}
            </LoadingButton>
          )
        }
      >
        <Wizard
          perfectScroll={fromIp}
          // key={loadingDetails}
          options={{
            linear: false
          }}
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
      </StepsModal>
    )
  }

  return (
    <>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <IpStepModal
        createFor={
          isValid(patientRes?.id) ? { label: patientRes?.name, value: patientRes?.id } : null
        }
        enableNext
        patientRes={patientRes}
        showModal={showIpModal}
        setShowModal={setShowIpModal}
        scrollControl={false}
        handleToggle={(e) => {
          if (e) {
            setDisplay(false)
          } else {
            setDisplay(true)
          }
        }}
        noView
      />

      {!noModal ? (
        renderWithModal()
      ) : (
        <>
          <Wizard
            options={{
              linear: false
            }}
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
            contentClassName={contentClassName ? contentClassName : 'fixed-contents-p-0'}
            headerClassName='bg-transparent p-0'
          />
        </>
      )}
    </>
  )
}

export default UserModal          