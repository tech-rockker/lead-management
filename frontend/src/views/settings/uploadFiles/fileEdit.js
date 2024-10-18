import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CardBody, Col, Row, Badge } from 'reactstrap'
import CenteredModal from '../../components/modal/CenteredModal'
import { decrypt, formatDate } from '../../../utility/Utils'
import DropZoneCompany from '../../components/buttons/companyFileUpload'
import { isValidArray } from '../../../utility/helpers/common'
const FileEdit = ({ showModal = null, setShowModal, fileEdit = null, setReload = () => {} }) => {
  const [loading, setLoading] = useState(true)
  const [signingData, setSigningData] = useState([])
  const [open, setOpen] = useState(showModal)
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch
  } = form

  useEffect(() => {
    setOpen(showModal)
  }, [fileEdit, showModal])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
  }

  return (
    <CenteredModal
      title='Edit'
      loading={loading}
      modalClass='modal-lg'
      open={open}
      handleModal={handleModal}
      disableFooter
    >
      <CardBody>
        <DropZoneCompany value={fileEdit} handleClose={handleModal} setReload={setReload} />
      </CardBody>
    </CenteredModal>
  )
}

export default FileEdit
