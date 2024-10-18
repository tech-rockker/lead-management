import '@styles/react/apps/app-users.scss'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Form, Row } from 'reactstrap'
import { FM, isValidArray } from '../../../utility/helpers/common'
import DropZoneCompany from '../../components/buttons/companyFileUpload'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

const AddUploadFileUser = ({
  isEdit = false,
  edit = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  setReload = () => {},
  bankId = null,
  Component = 'span',
  children = null,
  folderId = null,
  ...rest
}) => {
  const dispatch = useDispatch()
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch
  } = form
  const [loading, setLoading] = useState(false)
  const [load, setLoad] = useState(true)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [fileData, setFileData] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
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
        title={FM('upload-your-files')}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-lg'}
        open={open}
        handleModal={handleClose}
        disableFooter
      >
        {/* <Card> */}
        <CardBody>
          <Row>
            <Col md='12'>
              <Form>
                <FormGroupCustom
                  noLabel
                  isMulti
                  name={'files'}
                  type={'hidden'}
                  errors={errors}
                  control={control}
                  rules={{ required: true }}
                  values={fileData}
                />
                <DropZoneCompany
                  value={fileData?.files}
                  onSuccess={(e) => {
                    if (isValidArray(e)) {
                      setValue('files', e?.file_name)
                    } else {
                      setValue('files', [])
                    }
                  }}
                  handleClose={handleClose}
                  setReload={setReload}
                  folderId={folderId}
                />
              </Form>
            </Col>
          </Row>
        </CardBody>
        {/* </Card> */}
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}
export default AddUploadFileUser
