import React, { useEffect, useState } from 'react'
import { FM } from '../../../utility/helpers/common'
import { CardBody, Col, Row, CardHeader, CardTitle, Nav, Container } from 'reactstrap'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch, useSelector } from 'react-redux'
import { SuccessToast } from '../../../utility/Utils'
import { File, Folder } from 'react-feather'
import { deleteTask, loadTask } from '../../../utility/apis/task'
import categoriesTypes from '../../../redux/reducers/categoriesTypes'
import Task from '../../masters/tasks'
import { CategoryType } from '../../../utility/Const'
const ViewFileTasks = ({
  showModal = false,
  setShowModal = () => {},
  fileId = null,
  isRefreshed = () => {},
  vertical = false
}) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(showModal)
  //   const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    // loadFolders()
    setOpen(showModal)
    // setSelectedItem(null)
  }, [showModal])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
  }

  return (
    <>
      <CenteredModal
        disableFooter={true}
        title={`${FM(`task`)}`}
        modalClass={'modal-lg'}
        open={open}
        handleModal={handleModal}
      >
        <Container className='p-2 mb-0'>
          <Task fileId={fileId} fileType={CategoryType.file} />
        </Container>
      </CenteredModal>
    </>
  )
}

export default ViewFileTasks
