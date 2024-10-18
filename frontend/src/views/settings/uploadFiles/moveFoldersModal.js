import React, { useEffect, useState } from 'react'
import { FM } from '../../../utility/helpers/common'
import { CardBody, Col, Row, CardHeader, CardTitle } from 'reactstrap'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch, useSelector } from 'react-redux'
import { SuccessToast } from '../../../utility/Utils'
import { updateFileListUser } from '../../../redux/reducers/fileupload'
import { moveFilesUserToFolder } from '../../../utility/apis/commons'
import { File, Folder } from 'react-feather'
import { fetchFolders } from '../../../redux/reducers/folderUpload'

const MoveFoldersModal = ({
  showModal = false,
  setShowModal = () => {},
  file = null,
  folderName = null,
  isRefreshed = () => {}
}) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(showModal)
  const [selectedItem, setSelectedItem] = useState(null)

  const { data: folderData } = useSelector((s) => s.folderUpload.viewFolder)
  console.log(folderData)

  const [pages, setPage] = useState(1)
  const [perPage] = useState(20)

  const loadFolders = () => {
    dispatch(
      fetchFolders({
        pages,
        perPage,
        isBookmarked: null,
        loadMore: pages > 1
      })
    )
  }

  useEffect(() => {
    loadFolders()
    setOpen(showModal)
    setSelectedItem(null)
  }, [showModal])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
  }

  const handleSave = () => {
    moveFilesUserToFolder({
      file_id: file?.id,
      folder_id: selectedItem,
      dispatch,
      success: () => {
        dispatch(updateFileListUser(file?.id, selectedItem))
        isRefreshed(true)
        SuccessToast(FM('file-moved-successfully'))
        handleModal()
      },
      error: () => {
        console.log('error')
      }
    })
  }

  return (
    <>
      <CenteredModal
        title={`${FM(`move`)}   " ${file?.title} "`}
        modalClass={'modal-sm'}
        open={open}
        handleModal={handleModal}
        handleSave={handleSave}
        scrollControl={true}
        done='move'
      >
        <CardTitle tag='h4' className='m-1'>{`${FM(
          `current-location`
        )} : ${folderName} `}</CardTitle>
        <CardBody>
          <>
            <Row>
              <div
                className='ps-0 p-1'
                style={{
                  borderRadius: '10px',
                  backgroundColor: selectedItem === null ? '#5058B8' : 'transparent',
                  color: selectedItem === null ? 'white' : 'black'
                }}
              >
                <Col md='12'>
                  <File style={{ fontSize: 30 }} className='ms-1 me-1' />
                  <a onClick={() => setSelectedItem(null)} style={{ cursor: 'pointer' }}>
                    {'Main Page (Without Folders)'}
                  </a>
                </Col>
              </div>
              {folderData
                ?.filter((item) => item.name !== folderName)
                .map((item, index) => (
                  <div
                    key={item?.id}
                    className='ps-0 p-1'
                    style={{
                      borderRadius: '10px',

                      backgroundColor: selectedItem === item?.id ? '#5058B8' : 'transparent',
                      color: selectedItem === item?.id ? 'white' : 'black'
                    }}
                  >
                    <Col md='12'>
                      <Folder style={{ fontSize: 30 }} className='ms-1 me-1' />
                      <a onClick={() => setSelectedItem(item?.id)} style={{ cursor: 'pointer' }}>
                        {item?.name}
                      </a>
                    </Col>
                  </div>
                ))}
            </Row>
          </>
        </CardBody>
      </CenteredModal>
    </>
  )
}

export default MoveFoldersModal
