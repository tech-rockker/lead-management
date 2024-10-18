import '@styles/react/apps/app-users.scss'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Form, Row } from 'reactstrap'
import { FM, isValidArray, log } from '../../../utility/helpers/common'
import DropZoneAdmin from '../../components/buttons/adminFileUploader'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

const AddUploadFile = ({
  isEdit = false,
  edit = null,
  noView = false,
  setReload = () => {},
  showModal = false,
  setShowModal = () => {},
  bankId = null,
  Component = 'span',
  children = null,
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
  // const [reload, setReload] = useState(false)

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  const handleReload = () => {
    setReload(true)
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
                <DropZoneAdmin
                  value={fileData?.files}
                  onSuccess={(e) => {
                    if (isValidArray(e)) {
                      setValue('files', e?.file_name)
                    } else {
                      setValue('files', [])
                    }
                  }}
                  handleClose={handleClose}
                  setReload={(e) => {
                    log(e)
                    setReload(e)
                  }}
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
export default AddUploadFile
