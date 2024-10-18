// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { viewUser } from '../../../utility/apis/userManagement'
import { forDecryption, userFields } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import { decryptObject, jsonDecodeAll } from '../../../utility/Utils'
import CenteredModal from '../../components/modal/CenteredModal'
import Shimmer from '../../components/shimmers/Shimmer'
import FinalUserView from './patientViews/view'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const PatientViewModal = ({
  responseData = () => {},
  step = 1,
  edit = null,
  editIpRes = null,
  noView = false,
  ipRes = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  pId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [id, setId] = useState(null)
  // ** Ref
  const ref = useRef(null)

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    if (edit === null) setEditData(null)
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
            // patient_type_id: (isValid(d?.patient_type_id) ? d?.patient_type_id : []),
            ...d?.patient_information,
            id: d?.id,
            patient_information: decryptObject(forDecryption, d?.patient_information)
          }
          const valuesT = jsonDecodeAll(formFields, s)
          const values = decryptObject(forDecryption, valuesT)
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

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (open === true && id) loadDetails()
  }, [open, id])

  useEffect(() => {
    setId(pId)
  }, [pId])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    if (open === false || open === null) {
      document.body.removeAttribute('no-scroll')
    }
  }, [open])

  return (
    <>
      <CenteredModal
        done='Patient'
        title={editData?.name}
        disableFooter
        disableSave={loadingDetails}
        loading={loadingDetails}
        modalClass={'modal-fullscreen'}
        open={open}
        handleModal={handleClose}
      >
        <div className='p-1'>
          <Show IF={loadingDetails}>
            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
            <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
            <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          </Show>
          <Hide IF={loadingDetails}>
            <FinalUserView key={`final-${editData?.id}`} step={step} user={editData} />
          </Hide>
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

export default PatientViewModal
