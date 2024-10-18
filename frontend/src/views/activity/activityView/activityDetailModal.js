// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
// import CenteredModal from '../../../components/modal/CenteredModal'
import { addActivity, editActivity, viewActivity } from '../../../utility/apis/activity'
import { loadComments } from '../../../utility/apis/comment'
import { viewPatientPlan } from '../../../utility/apis/ip'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import { isObjEmpty, jsonDecodeAll, setValues, updateRequiredOnly } from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import ActivityView from './ActivityView'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const ActivityDetailsModal = ({
  step = '1',
  noView = false,
  showModal = false,
  setShowModal = () => {},
  activityId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const [open, setOpen] = useState(null)

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
  }

  const handleCloses = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  return (
    <>
      <CenteredModal
        disableFooter={true}
        title={`${FM(`activity-details`)}`}
        modalClass={'modal-xl'}
        open={open}
        handleModal={handleCloses}
      >
        <div className='p-2'>
          <ActivityView step={step} id={activityId} />
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

export default ActivityDetailsModal
