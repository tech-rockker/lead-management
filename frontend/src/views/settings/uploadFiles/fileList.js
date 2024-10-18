import {
  CloudDownload,
  FormatSize,
  PictureAsPdfTwoTone,
  StarBorderRounded,
  StarRounded
} from '@material-ui/icons'

import { ThemeColors } from '@src/utility/context/ThemeColors'
import classnames from 'classnames'
import BsTooltip from '../../../views/components/tooltip'
import { useCallback, useContext, useEffect, useState } from 'react'
import {
  Activity,
  Calendar,
  Cloud,
  Download,
  Edit2,
  File,
  FileText,
  Folder,
  Info,
  MoreVertical,
  PenTool,
  Plus,
  RefreshCcw,
  Sliders,
  Trash2,
  Unlock,
  User,
  Users,
  ArrowRightCircle,
  Search,
  Eye,
  Edit,
  Target
} from 'react-feather'
import { useForm } from 'react-hook-form'
import 'react-image-lightbox/style.css'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import {
  deleteFile,
  deleteFileUser,
  updateFileUserIsBookmark,
  updateBookmarked
} from '../../../redux/reducers/fileupload'
import {
  deleteFiles,
  deleteFilesUser,
  uploadFilesList,
  uploadFilesListUser,
  setSignDone
} from '../../../utility/apis/commons'
import { CategoryType, IconSizes } from '../../../utility/Const'
// ** Styles
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import useUserType from '../../../utility/hooks/useUserType'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { decrypt, formatDate } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import BsPopover from '../../components/popover'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'
import AddUploadFileUser from './addFileCompany'
import AddUploadFile from './addFiles'
import FileFilter from './FileFilter'

import MoveFoldersModal from './moveFoldersModal'
import CheckFileStatus from './checkFileStatus'
import FileEdit from './fileEdit'

import { toast } from 'react-toastify'
import TaskModal from '../../masters/tasks/fragment/TaskModal'
import ViewFileTasks from './viewFileTasks'

const FileView = ({ files }) => {
  const { id } = useParams()

  const { folder_name } = useSelector((s) => s.fileupload?.fileUser)

  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const userType = useUserType()
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddFile, setShowAddFile] = useState(false)
  const [viewAdd, setViewAdd] = useState(false)
  // const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [deletedId, setDeletedId] = useState(null)
  const [deletedd, setDeletedd] = useState(false)
  const [failed, setFailed] = useState(false)
  const [failedd, setFailedd] = useState(false)

  const [pages, setPage] = useState(1)
  const [perPage] = useState(20)

  const [reload, setReload] = useState(false)

  const params = useParams()
  const prent = parseInt(params?.id)
  const [filterData, setFilterData] = useState(null)
  const [fileFilter, setFileFilter] = useState(false)

  const [showMoveFolder, setShowMoveFolder] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [searchFile, setSearchFile] = useState(null)
  const [showSignedBy, setShowSignedBy] = useState(false)
  const [showViewedBy, setShowViewedBy] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState(null)
  // const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [editFile, setEditFile] = useState(false)
  const user = useSelector((s) => s.auth?.userData)
  console.log('user: ', user)
  let timer

  const [taskModal, setTaskModal] = useState(false)
  const [showTask, setShowTask] = useState(false)
  const [fileData, setFileData] = useState({
    file_name: '',
    file_path: '',
    file_size: null,
    file_type: ''
  })

  const showForm = () => {
    setFormVisible(!formVisible)
    setShowMoveFolder(false)
    setSelectedFile(false)
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
      setShowSignedBy(false)
      setSelectedFileId(null)
      // setSelectedFolderId(null)
      setShowViewedBy(false)
      setEditFile(false)
    }
  }, [])

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(false)
      setViewAdd(false)
      setShowSignedBy(false)
      setSelectedFileId(null)
      // setSelectedFolderId(null)
      setShowViewedBy(false)
      setEditFile(false)
      setTaskModal(false)
      setShowTask(false)
    }
  }

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  function checkURL(file_path) {
    return String(file_path).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  function checkURLPF(file_path) {
    return String(file_path).match(/\.(pdf)$/) !== null
  }

  const renderOldFilePreview = (file) => {
    if (checkURL(file?.file_path)) {
      return (
        <a role={'button'} target={'_blank'} href={file?.file_path}>
          <img className='rounded' alt={file.name} src={file?.file_path} height='80' width='80' />
        </a>
      )
    } else if (checkURLPF(file?.file_path)) {
      return (
        <a role={'button'} target={'_blank'} href={file?.file_path}>
          <PictureAsPdfTwoTone style={{ fontSize: 80 }} />
        </a>
      )
    } else {
      return (
        <a role={'button'} target={'_blank'} href={file?.file_path}>
          <FileText url={file?.file_path} size='80' />
        </a>
      )
    }
  }

  const setSearchFileWithDelay = (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      setSearchFile(value)
    }, 1000)
  }
  const handleSearchChange = (event) => {
    const newValue = event.target.value
    setSearchFileWithDelay(newValue)
  }
  const handleBookmarkUpdate = (item) => {
    dispatch(updateFileUserIsBookmark({ id: item.id }))
    dispatch(updateBookmarked({ id: item.id, type: 'File' }))
  }

  const downloadFile = async (item) => {
    try {
      const fileURL = item.file_path
      const response = await fetch(fileURL)
      const blob = await response.blob()
      const fileExtension = fileURL.split('.').pop()
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `${item.title}.${fileExtension}`
      })
      const writable = await fileHandle.createWritable()
      await writable.write(blob)
      await writable.close()
      toast.success(FM('file-successfully-downloaded'))
    } catch (error) {
      console.error(error)
    }
  }

  const UserCard = (item, index) => {
    const userIsNotEmployee = !item?.signing_files?.some((file) => file.employee_id === user.id)
    const userIsEmployee = item?.signing_files?.some((file) => file.employee_id === user.id)
    const userIsEmployeeAndSigned = item?.signing_files?.some(
      (file) => file.employee_id === user.id && file.is_signed === 1
    )
    return (
      <>
        <div className='flex-1' key={`ip-${index}`}>
          <Card className='animate__animated animate__slideInUp'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='9' className='d-flex align-items-center'>
                  <Row>
                    <Col xs='12'>
                      <h5 className='mb-3px fw-bolder text-primary'>{item?.title}</h5>
                      <p className='mb-0 text-small-12 text-truncate text-danger d-flex align-items-center'>
                        <CloudDownload fontSize='small' className='me-25' /> {item?.file_size} MB
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col xs='1'>
                  <Show IF={item.tasks.length}>
                    <span
                      id={`task-${item?.id}`}
                      role={'button'}
                      className='text-primary'
                      onClick={() => {
                        setShowTask(true)
                        setEdit(item)
                      }}
                    >
                      <Target size={16} />
                    </span>
                    <UncontrolledTooltip target={`task-${item?.id}`}>
                      <p className='mb-0 fw-bold text-truncate text-small-12'>
                        {`Task Count: ${item?.tasks.length}`}
                      </p>
                    </UncontrolledTooltip>
                  </Show>
                </Col>

                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <Show IF={item?.fileable_type === 'App\\Models\\Activity'}>
                    {item?.fileable && (
                      <>
                        <span
                          id={`activity-${item?.id}`}
                          // role={'button'}
                          className='text-primary'
                          // className='mb-0 text-dark fw-bolder text-small-12'
                        >
                          <Activity size={16} />
                        </span>
                        <UncontrolledTooltip target={`activity-${item?.id}`}>
                          <p className='mb-0 fw-bold text-truncate text-small-12'>
                            {`Activity Name: ${item?.fileable?.title}`}
                          </p>
                        </UncontrolledTooltip>
                      </>
                    )}
                  </Show>
                  <BsTooltip title={FM('favorite')}>
                    {item?.is_bookmark ? (
                      <StarRounded
                        style={{ color: 'orange', fontSize: 26, cursor: 'pointer' }}
                        onClick={() => handleBookmarkUpdate(item)}
                      />
                    ) : (
                      <StarBorderRounded
                        size={30}
                        style={{ color: 'orange', fontSize: 26, cursor: 'pointer' }}
                        onClick={() => handleBookmarkUpdate(item)}
                      />
                    )}
                  </BsTooltip>
                  <Show IF={item?.top_most_parent_id !== 1}>
                    <Show IF={Permissions.fileUploadCompany}>
                      <DropDownMenu
                        tooltip={FM(`menu`)}
                        component={
                          <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                        }
                        options={[
                          {
                            IF: user.id === item?.created_by,
                            onClick: () => {
                              setEditFile(true)
                              setEdit(item)
                            },
                            name: FM('edit'),
                            icon: <Edit size={14} />
                          },
                          {
                            // icon: <Trash2 size={14} />,
                            noWrap: true,
                            name: (
                              <ConfirmAlert
                                uniqueEventId={`${item?.id}-files`}
                                item={item}
                                title={FM('delete-this', { name: item?.title })}
                                color='text-warning'
                                onClickYes={() => deleteFilesUser({ id: item?.id })}
                                onSuccessEvent={(item) => {
                                  deleteFileUser(item?.id)
                                  setReload(true)
                                }}
                                className='dropdown-item'
                                id={`grid-deletes-${item?.id}`}
                              >
                                <Trash2 size={14} />
                                <span className='ms-1'>{FM('delete')}</span>
                              </ConfirmAlert>
                            )
                          },
                          {
                            IF: Permissions.taskAdd,
                            icon: <Plus size={14} />,
                            name: FM('add-task'),
                            onClick: () => {
                              setTaskModal(true)
                              setEdit(item)

                              setFileData({
                                file_name: item.file_name,
                                file_path: item.file_path,
                                file_size: item?.file_size,
                                file_type: 'view'
                              })
                            }
                          },
                          {
                            noWrap: true,
                            name: (
                              <div className='dropdown-item' onClick={() => downloadFile(item)}>
                                <Download size={14} />
                                <span className='ms-1'>{FM('download')}</span>
                              </div>
                            )
                          },
                          {
                            icon: <ArrowRightCircle size={14} />,
                            onClick: () => {
                              setSelectedFile(item)
                              setShowMoveFolder(true)
                            },
                            name: FM('move')
                          }
                        ]}
                      />
                    </Show>
                  </Show>
                </Col>
              </Row>
              <div className='d-flex justify-content-center'>{renderOldFilePreview(item)}</div>
            </CardBody>
            <CardBody className='pt-0'>
              <Row className='align-items-center gy-2'>
                <Col md='2'>
                  <p role={'button'} className='mb-0 text-dark fw-bolder text-small-12'>
                    <Calendar size={16} id={`date-${item?.id}`} />
                  </p>
                  <UncontrolledTooltip target={`date-${item?.id}`}>
                    <p className='mb-0 fw-bold text-truncate text-small-12'>
                      {FM('added-date')} <Calendar size={14} />{' '}
                      {formatDate(item?.created_at, 'YYYY-MM-DD')}
                    </p>
                  </UncontrolledTooltip>
                </Col>
                <Col md='2'>
                  <p role={'button'} className='mb-0 text-dark fw-bolder text-small-12'>
                    <Unlock size={16} id={`isPublic-${item?.id}`} />
                  </p>
                  <UncontrolledTooltip target={`isPublic-${item?.id}`}>
                    <p className='mb-0 fw-bold text-truncate text-small-12'>
                      {FM('is-public')} <Unlock size={14} />{' '}
                      {item?.is_public === 1 ? FM('yes') : FM('no')}
                    </p>
                  </UncontrolledTooltip>
                </Col>
                <Col md='2'>
                  <p role={'button'} className='mb-0 text-dark fw-bolder text-small-12'>
                    <User size={16} id={`userType-${item?.id}`} />
                  </p>
                  <UncontrolledTooltip target={`userType-${item?.id}`}>
                    <p className='mb-0 fw-bold text-truncate text-small-12'>
                      {FM('uploaded-by')} <User size={14} /> {decrypt(item?.created_by?.name)}
                      {/* {item?.user_type === null ? 'Admin' : 'Company'} */}
                    </p>
                  </UncontrolledTooltip>
                </Col>
                <Show IF={item?.user_type !== null}>
                  <Col md='2'>
                    <p role={'button'} className='mb-0 text-dark fw-bolder text-small-12'>
                      <Users size={16} id={`userTypeName-${item?.id}`} />
                    </p>
                    <UncontrolledTooltip target={`userTypeName-${item?.id}`}>
                      <p className='mb-0 fw-bold text-truncate text-small-12'>
                        {FM('uploaded-for')} <Users size={14} /> {item?.user_type?.name}
                      </p>
                    </UncontrolledTooltip>
                  </Col>
                </Show>
                <Show
                  IF={item?.fileable_id && item?.fileable_type === 'App\\Models\\AdminFileFolder'}
                >
                  <Show
                    IF={user.id === item?.created_by && item?.view_only_admin_files?.length > 0}
                  >
                    <Col md='2'>
                      <p
                        id={`fileView-${item?.id}`}
                        role={'button'}
                        className='mb-0 text-dark fw-bolder text-small-12'
                        onClick={() => {
                          setSelectedFileId(item?.id)
                          // setSelectedFolderId(item?.fileable_id)
                          setShowViewedBy(true)
                        }}
                      >
                        <Eye size={14} />
                      </p>
                      <UncontrolledTooltip target={`fileView-${item?.id}`}>
                        <p className='mb-0 fw-bold text-truncate text-small-12'>
                          {FM('viewed-by')}
                        </p>
                      </UncontrolledTooltip>
                    </Col>
                  </Show>
                  <Show
                    IF={
                      item?.signing_files?.length > 0 && userIsEmployee && !userIsEmployeeAndSigned
                    }
                  >
                    <Col md='2'>
                      <BsTooltip role='button' title={FM('sign')}>
                        <ConfirmAlert
                          // uniqueEventId={`file-event-${item?.id}`}
                          uniqueEventId={`${item?.id}-file-sign`}
                          item={item}
                          title={FM('Please Sign This File', {
                            name: item?.title
                          })}
                          enableNo
                          confirmButtonText={'via-bank-id'}
                          disableConfirm={!isValid(user?.personal_number)}
                          onSuccessEvent={(e) => {
                            log('e', item?.id, e)
                            setReload(true)
                          }}
                          textClass='text-danger text-small-12'
                          text={
                            !isValid(user?.personal_number)
                              ? 'please-add-your-personal-number'
                              : 'how-would-you-like-to-sign'
                          }
                          denyButtonText={'normal'}
                          color='text-warning'
                          className=''
                          id={`grid-sign-${item?.id}`}
                          successTitle={FM('signed')}
                          successText={FM('file-is-signed')}
                          onClickYes={() =>
                            setSignDone({
                              jsonData: {
                                file_id: item?.id,
                                employee_id: user?.id,
                                signed_method: 'bankid'
                              }
                            })
                          }
                          onClickNo={() =>
                            setSignDone({
                              jsonData: {
                                file_id: item?.id,
                                employee_id: user?.id,
                                signed_method: null
                              }
                            })
                          }
                        >
                          <PenTool size='15' className='me-2' />
                        </ConfirmAlert>
                      </BsTooltip>
                    </Col>
                  </Show>
                  <Show IF={item?.signing_files?.length > 0 && user.id === item?.created_by}>
                    <Col md='2'>
                      <BsTooltip
                        title={FM('signed-by')}
                        onClick={() => {
                          setSelectedFileId(item?.id)
                          setShowSignedBy(true)
                        }}
                        role='button'
                      >
                        <PenTool size='15' className='me-2' />
                      </BsTooltip>
                    </Col>
                  </Show>
                  <Show IF={item?.signing_files?.length > 0 && userIsEmployeeAndSigned}>
                    <Col xs='2' className='d-flex justify-content-end'>
                      <BsTooltip role='button' title={FM('signed')}>
                        <PenTool size='15' className='text-warning me-2' />
                      </BsTooltip>
                    </Col>
                  </Show>
                </Show>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }

  if (/^\/settings\/manageFiles\/folder\/\d+$/.test(location.pathname)) {
    return (
      <>
        <ViewFileTasks showModal={showTask} setShowModal={handleClose} fileId={edit?.id} noView />
        <CheckFileStatus
          showModal={showSignedBy}
          setShowModal={handleClose}
          fileId={selectedFileId}
          folder={id}
          status={'signed'}
        />
        <CheckFileStatus
          showModal={showViewedBy}
          setShowModal={handleClose}
          fileId={selectedFileId}
          folder={id}
          status={'viewed'}
        />
        <FileEdit
          showModal={editFile}
          setShowModal={handleClose}
          fileEdit={edit}
          setReload={(e) => {
            setReload(true)
          }}
        />
        <MoveFoldersModal
          showModal={showMoveFolder}
          setShowModal={showForm}
          file={selectedFile}
          isRefreshed={setReload}
          folderName={folder_name}
        />
        <FileFilter
          show={fileFilter}
          filterData={filterData}
          setFilterData={setFilterData}
          handleFilterModal={() => {
            setFileFilter(false)
          }}
        />
        <TaskModal
          showModal={taskModal}
          setShowModal={handleClose}
          resourceType={CategoryType.file}
          // fileType='file-manage'
          sourceId={edit?.id}
          file={fileData}
          isRefreshed={setReload}
          noView
        />
        <AddUploadFileUser
          isEdit
          showModal={showAddFile}
          setShowModal={handleClose}
          bankId={edit?.id}
          noView
        />
        <AddUploadFile
          isEdit
          showModal={showAdd}
          setShowModal={handleClose}
          bankId={edit?.id}
          noView
        />
        <Header goToBack={true} name={folder_name} icon={<Folder size='25' />}>
          <div style={{ position: 'relative', width: '200px', marginRight: '20px' }}>
            <Search
              color='#505888'
              size={16}
              style={{
                position: 'absolute',
                top: '50%',
                left: '5px',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              type='text'
              placeholder='Search...'
              onChange={handleSearchChange}
              style={{
                width: '100%',
                height: '35px',
                padding: '5px 30px',
                borderRadius: '5px',
                border: '1px solid #505888'
              }}
            />
          </div>
          <ButtonGroup color='dark'>
            {/* <Show IF={Permissions.fileAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <AddUploadFile
              setReload={(e) => {
                log(e, 'gh')
                setReload(true)
                setFilterData({})
              }}
              Component={Button.Ripple}
              size='sm'
              color='primary'
              id='create-button'
            >
              <Plus size='16' />
            </AddUploadFile>
          </Show> */}
            <Show IF={Permissions.fileUploadCompany}>
              <UncontrolledTooltip target='create-buttons'>{FM('create-new')}</UncontrolledTooltip>
              <AddUploadFileUser
                setReload={(e) => {
                  log(e, 'gh')
                  setReload(true)
                  setFilterData({})
                }}
                Component={Button.Ripple}
                size='sm'
                color='primary'
                id='create-buttons'
                folderId={id}
              >
                <Plus size='16' />
              </AddUploadFileUser>
            </Show>
            <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple
              size='sm'
              color='secondary'
              id='filter'
              onClick={() => setFileFilter(true)}
            >
              <Sliders size='14' />
            </Button.Ripple>
            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <Button.Ripple
              size='sm'
              color='dark'
              id='reload'
              onClick={() => {
                setFilterData({})
              }}
            >
              <RefreshCcw size='14' />
            </Button.Ripple>
          </ButtonGroup>
        </Header>

        <TableGrid
          refresh={reload}
          isRefreshed={setReload}
          loadFrom={uploadFilesListUser}
          jsonData={{
            ...filterData
          }}
          selector='fileupload'
          state='fileUser'
          display='grid'
          md='3'
          gridView={UserCard}
          folderId={id}
          isBookmarked={null}
        />
      </>
    )
  } else if (/^\/settings\/myFavorites\/folder\/\d+$/.test(location.pathname)) {
    return (
      <>
        <MoveFoldersModal
          showModal={showMoveFolder}
          setShowModal={showForm}
          file={selectedFile}
          isRefreshed={setReload}
          folderName={folder_name}
        />
        <FileFilter
          show={fileFilter}
          filterData={filterData}
          setFilterData={setFilterData}
          handleFilterModal={() => {
            setFileFilter(false)
          }}
        />
        <Header name={folder_name} icon={<File size='25' />}>
          <div style={{ position: 'relative', width: '200px', marginRight: '20px' }}>
            <Search
              color='#505888'
              size={16}
              style={{
                position: 'absolute',
                top: '50%',
                left: '5px',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              type='text'
              placeholder='Search...'
              onChange={handleSearchChange}
              style={{
                width: '100%',
                height: '35px',
                padding: '5px 30px',
                borderRadius: '5px',
                border: '1px solid #505888'
              }}
            />
          </div>
          {/* Tooltips */}
          <ButtonGroup color='dark'>
            <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple
              size='sm'
              color='secondary'
              id='filter'
              onClick={() => setFileFilter(true)}
            >
              <Sliders size='14' />
            </Button.Ripple>
            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <Button.Ripple
              size='sm'
              color='dark'
              id='reload'
              onClick={() => {
                setFilterData({})
              }}
            >
              <RefreshCcw size='14' />
            </Button.Ripple>
          </ButtonGroup>
        </Header>
        <TableGrid
          refresh={reload}
          isRefreshed={setReload}
          loadFrom={uploadFilesListUser}
          jsonData={{
            ...filterData
          }}
          selector='fileupload'
          state='fileUser'
          display='grid'
          md='3'
          gridView={UserCard}
          folderId={id}
          isBookmarked={null}
          searchKey={searchFile}
        />
      </>
    )
  }
}

export default FileView
