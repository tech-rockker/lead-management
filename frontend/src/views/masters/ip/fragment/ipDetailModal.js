/* eslint-disable prefer-template */
// ** Custom Components
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { viewPatientPlan } from '../../../../utility/apis/ip'
import { forDecryption, ipFields } from '../../../../utility/Const'
import { FM, isValid } from '../../../../utility/helpers/common'
import { decryptObject, jsonDecodeAll } from '../../../../utility/Utils'
import CenteredModal from '../../../components/modal/CenteredModal'
import UserTabs from '../../../userManagement/patient/patientViews/view/Tabs'
import UserInfoCard from '../../../userManagement/patient/patientViews/view/UserInfoCard'
import DetailsTab from './Tabs/DetailsTab'
import IpTabs from './Tabs/IpTabs'

import '@styles/react/apps/app-users.scss'
import IpDetailsTab from './Tabs'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const IpDetailModal = ({
  old = false,
  step = 1,
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
  // Dispatch
  const [open, setOpen] = useState(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [editData, setEditData] = useState(null)
  const [display, setDisplay] = useState(true)

  // form data
  const formFields = {
    ...ipFields
  }

  useEffect(() => {
    handleToggle(open)
  }, [open])

  useEffect(() => {
    if (edit !== null) {
      setEditData(edit)
    }
  }, [edit])

  const handleModal = () => {
    setOpen(!open)
    setEditData(null)
    setShowModal(!open)
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewPatientPlan({
        id,
        params: { log: old },
        loading: setLoadingDetails,
        success: (d) => {
          const valuesTemp = jsonDecodeAll(formFields, d)
          const values = {
            ...valuesTemp,
            patient: decryptObject(forDecryption, valuesTemp?.patient),
            employee: decryptObject(forDecryption, valuesTemp?.employee),
            branch: decryptObject(forDecryption, valuesTemp?.branch),
            persons: valuesTemp?.persons?.map((h) => ({
              ...h,
              ...decryptObject(forDecryption, h?.persons)
            }))
          }
          setEditData(values)
        }
      })
    }
  }

  useEffect(() => {
    if (open) {
      // loadDetails(ipId)
    }
  }, [open])

  return (
    <>
      <CenteredModal
        display={display}
        disableFooter={true}
        title={`${FM(`Implementations-details`)}`}
        modalClass={'modal-xl'}
        open={open}
        handleModal={handleModal}
      >
        <IpDetailsTab old={old} step={step} ipId={ipId} open={open} />
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default IpDetailModal
