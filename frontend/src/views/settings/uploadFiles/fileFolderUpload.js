import '@styles/react/apps/app-users.scss'
import { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Form, Row, Button, Input } from 'reactstrap'
import { FM, isValidArray } from '../../../utility/helpers/common'
import DropZoneCompany from '../../components/buttons/companyFileUpload'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { FilePlus, Folder, FolderPlus } from 'react-feather'
import { createFolder } from '../../../utility/apis/commons'
import Hide from '../../../utility/Hide'

const FolderInput = ({ folderName, setFolderName }) => {
  return (
    <Input
      type='text'
      placeholder='Enter folder name'
      value={folderName}
      onChange={(e) => setFolderName(e.target.value)}
    />
  )
}

const FileFolderUpload = ({
  onSuccess = () => {},
  isEdit = false,
  edit = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  setReload = () => {},
  bankId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const location = useLocation()
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

  // new Code
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [choice, setChoice] = useState(null)
  const [file, setFile] = useState(null)
  const [folder, setFolder] = useState(null)
  const [folderName, setFolderName] = useState('')
  const [uploadedFolder, setUploadedFoler] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)
  const folderInputRef = useRef(null)

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
  }

  const handleClose = (from = null) => {
    handleModal()
    setChoice(null)
    setFile(null)
    setFolder(null)
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  console.log('Second Call')

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState)

  const handleChoice = (option) => {
    setChoice(option)
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
  }

  const handleFolderSelect = (e) => {
    const folder = e.target.files[0]
    setSelectedFolder(folder)
    setFolderName(folder.name)
  }

  const handleConfirm = () => {
    if (choice === 'new-folder') {
      // Handle the new folder creation logic here
      if (folderName.trim() !== '') {
        createFolder({
          success: (d) => {
            setUploadedFoler([d?.payload])
            onSuccess(d)
          },
          folderName
        })
        handleModal()
        setChoice(null)
        setFile(null)
        setFolderName('')
        console.log('Creating new folder:', folderName)
      }
    } else if (choice === 'upload-file' && file) {
      // Handle the file upload logic here
      console.log('Uploading file:', file)
    }

    // else if (choice === 'upload-folder' && folder) {
    //   // Handle the folder upload logic here
    //   console.log('Uploading folder:', folder)
    // }

    // Reset the choice and close the modal
    setChoice(null)
    setFile(null)
    setFolder(null)
  }

  // new Code
  console.log('file data: ', fileData)
  return (
    <>
      <CenteredModal
        title={FM('create-a-folder-or-upload-a-file')}
        disableSave={loadingDetails}
        loading={loading}
        // modalClass={location.pathname === '/settings/manageFiles' ? 'modal-lg' : 'modal-md'}
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
                {/* <DropZoneCompany
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
                /> */}

                <div className='d-flex flex-column gap-1 mb-1'>
                  <div className='d-flex flex-wrap justfiy-content-between align-items-center gap-2'>
                    <Hide IF={location.pathname === '/settings/manageFiles/files'}>
                      <Button
                        className=''
                        color='secondary'
                        outline
                        size='md'
                        onClick={() => handleChoice('new-folder')}
                      >
                        <div>
                          <FolderPlus size={22} /> {FM('new-folder')}
                        </div>
                      </Button>
                    </Hide>
                    <Hide IF={location.pathname === '/settings/manageFiles/folders'}>
                      <Button color='primary' size='md' onClick={() => handleChoice('upload-file')}>
                        <div>
                          <FilePlus size={22} /> {FM('upload-file')}
                        </div>
                      </Button>
                    </Hide>
                    {/* <Button color='primary' size='md' onClick={() => handleChoice('upload-folder')}>
                      <span>
                        <Folder size={18} /> Upload Folder
                      </span>
                    </Button> */}
                  </div>

                  <div className='my-1'>
                    {choice === 'new-folder' && (
                      <FolderInput folderName={folderName} setFolderName={setFolderName} />
                    )}
                    {choice === 'upload-file' && (
                      // <Input
                      //   type='file'
                      //   accept='.pdf,.doc,.docx'
                      //   onChange={(e) => handleFileSelect(e)}
                      // />
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
                      />
                    )}
                    {/* {choice === 'upload-folder' && (
                      <div>
                        <input
                          type='file'
                          webkitdirectory=''
                          directory=''
                          style={{ display: 'none' }}
                          ref={folderInputRef}
                          onChange={handleFolderSelect}
                        />
                        <Button color='light' onClick={() => folderInputRef.current.click()}>
                          Choose a Folder
                        </Button>
                        {selectedFolder && <p>Selected Folder: {folderName}</p>}
                      </div>
                    )} */}
                  </div>
                  {choice === 'new-folder' && (
                    <div className='text-end mt-2'>
                      <Button color='primary' onClick={handleConfirm}>
                        Create Folder
                      </Button>
                    </div>
                  )}
                </div>
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
export default FileFolderUpload
