import React, { useEffect, useState } from 'react'
import { CardBody, Col, Row, Badge } from 'reactstrap'
import CenteredModal from '../../components/modal/CenteredModal'
import { uploadFilesListUser } from '../../../utility/apis/commons'
import { decrypt, formatDate } from '../../../utility/Utils'
import Hide from '../../../utility/Hide'
const CheckFileStatus = ({
  showModal = false,
  setShowModal,
  fileId,
  folder = null,
  status = null
}) => {
  const [loading, setLoading] = useState(true)
  const [fileViewData, setFileViewData] = useState([])
  const [open, setOpen] = useState(showModal)

  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

  const loadAllUsers = (fileId) => {
    if (fileId) {
      uploadFilesListUser({
        folder_id: folder,
        jsonData: {
          file_id: fileId
        },
        success: (data) => {
          setLoading(false)
          setFileViewData(
            status === 'viewed'
              ? data?.payload[0]?.view_only_admin_files
              : status === 'signed'
              ? data?.payload[0]?.signing_files
              : []
          )
        },
        error: () => {
          console.log('Error loading data')
        }
      })
    }
  }
  console.log('view file data: ', fileViewData)

  useEffect(() => {
    console.log('folder: ', folder)
    loadAllUsers(fileId)
    setOpen(showModal)
  }, [fileId, showModal])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
  }

  const renderViewList = (isViewed) => (
    <ul>
      {fileViewData
        .filter((item) => item?.is_viewed === isViewed)
        .map((item) => (
          <li key={item.id}>
            {capitalize(decrypt(item?.employee?.name))}
            {item?.is_viewed === 1 && <span> | {item?.signed_at}</span>}
          </li>
        ))}
    </ul>
  )
  const renderSignList = (isSigned) => (
    <ul>
      {fileViewData
        .filter((item) => item.is_signed === isSigned)
        .map((item) => (
          <li key={item.id}>
            {capitalize(decrypt(item?.employee?.name))}
            {item.is_signed === 1 && <span> | {item?.signed_at}</span>}
          </li>
        ))}
    </ul>
  )
  let remaining, done
  if (status === 'viewed') {
    remaining = fileViewData?.some((item) => item?.is_viewed === 0)
    done = fileViewData?.some((item) => item?.is_viewed === 1)
  } else {
    remaining = fileViewData?.some((item) => item?.is_signed === 0)
    done = fileViewData?.some((item) => item?.is_signed === 1)
  }

  return (
    <CenteredModal
      title={status === 'viewed' ? 'Viewed By' : 'Signed By'}
      loading={loading}
      modalClass='modal-md'
      open={open}
      handleModal={handleModal}
      disableFooter
    >
      <CardBody>
        <Row>
          <Col md='12' className='my-2'>
            {`Following are the employees who are assigned to ${status} this document`}
          </Col>
        </Row>
        <Row>
          {
            <Col md='6' className='mb-3'>
              <h5>
                <Badge color='success'>{`${
                  status === 'viewed' ? 'Viewed' : 'Signed'
                } Remaining`}</Badge>
              </h5>
              <Hide IF={status === 'signed'}>
                {!loading ? (
                  remaining ? (
                    renderViewList(0)
                  ) : (
                    <p>Everyone has already Viewed</p>
                  )
                ) : (
                  <p>Loading...</p>
                )}
              </Hide>
              <Hide IF={status === 'viewed'}>
                {' '}
                {!loading ? (
                  remaining ? (
                    renderSignList(0)
                  ) : (
                    <p>Everyone has already Signed</p>
                  )
                ) : (
                  <p>Loading...</p>
                )}
              </Hide>
            </Col>
          }
          <Col md='6' className='mb-3'>
            <h5>
              <Badge color='success'>{`${status === 'viewed' ? 'Viewed' : 'Signed'} Done`}</Badge>
            </h5>
            <Hide IF={status === 'signed'}>
              {!loading ? (
                done ? (
                  renderViewList(1)
                ) : (
                  <p>No one has Viewed yet</p>
                )
              ) : (
                <p>Loading...</p>
              )}
            </Hide>
            <Hide IF={status === 'viewed'}>
              {!loading ? (
                done ? (
                  renderSignList(1)
                ) : (
                  <p>No one has signed yet</p>
                )
              ) : (
                <p>Loading...</p>
              )}
            </Hide>
          </Col>
        </Row>
      </CardBody>
    </CenteredModal>
  )
}

export default CheckFileStatus
