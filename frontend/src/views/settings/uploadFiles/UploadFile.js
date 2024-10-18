import {
  CloudDownload,
  FormatSize,
  IndeterminateCheckBoxOutlined,
  PictureAsPdfTwoTone,
  StarBorderRounded,
  StarRounded,
  Rotate90DegreesCcw
} from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classnames from 'classnames'
import BsTooltip from '../../../views/components/tooltip'
import { useCallback, useContext, useEffect, useState, React } from 'react'
import ReactPaginate from 'react-paginate'
import {
  Activity,
  Calendar,
  Clipboard,
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
  Pocket,
  RefreshCcw,
  Sliders,
  Target,
  Trash2,
  Unlock,
  User,
  Users,
  Search,
  Edit,
  Eye,
  Lock,
  UserPlus
} from 'react-feather'
import ReactDOM from 'react-dom'
import diff from 'deep-diff'
import { useForm } from 'react-hook-form'
import 'react-image-lightbox/style.css'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import {
  deleteFile,
  deleteFileUser,
  updateFileUserIsBookmark,
  updateBookmarked
} from '../../../redux/reducers/fileupload'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Input,
  Row,
  UncontrolledTooltip,
  Badge
} from 'reactstrap'

import {
  deleteFiles,
  deleteFilesUser,
  uploadFilesList,
  uploadFilesListUser,
  showFileFolderBookmark,
  moveFilesUserToFolder,
  setSignDone,
  setViewDone
} from '../../../utility/apis/commons'

import { CategoryType, IconSizes, UserTypes } from '../../../utility/Const'

// ** Styles
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import useUserType from '../../../utility/hooks/useUserType'
import { Permissions } from '../../../utility/Permissions'

import Show, { Can } from '../../../utility/Show'
import {
  decrypt,
  formatDate,
  countPlus,
  truncateText,
  getCounts,
  Searching,
  ViewAllLink
} from '../../../utility/Utils'

import DropDownMenu from '../../components/dropdown'
import BsPopover from '../../components/popover'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'
import AddUploadFileUser from './addFileCompany'
import AddUploadFile from './addFiles'
import FileFilter from './FileFilter'
import FileFolderUpload from './fileFolderUpload'
import { fetchFolders, viewFolder } from '../../../redux/reducers/folderUpload'
import SingleFolder from './singleFolder'

import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import usePackage from '../../../utility/hooks/usePackage'
import FileEdit from './fileEdit'
import CheckFileStatus from './checkFileStatus'

import { toast } from 'react-toastify'
import TaskModal from '../../masters/tasks/fragment/TaskModal'
import { permissionDelete } from '../../../redux/reducers/Permissions'
import ViewFileTasks from './viewFileTasks'

const UploadFile = () => {
  const pack = usePackage()
  const location = useLocation()
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

  const [searchFile, setSearchFile] = useState(null)
  const [showTask, setShowTask] = useState(false)
  const [taskModal, setTaskModal] = useState(false)
  // const [searchFile, setSearchFile] = useState('')

  const [pages, setPage] = useState(1)
  const [reload, setReload] = useState(false)
  const [showViewedBy, setShowViewedBy] = useState(false)
  const [showSignedBy, setShowSignedBy] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState(null)
  const params = useParams()
  const prent = parseInt(params?.id)
  const [filterData, setFilterData] = useState(null)
  const [fileFilter, setFileFilter] = useState(false)

  const [json, setJson] = useState(null)
  const [editFile, setEditFile] = useState(false)
  const user = useUser()

  let timer

  const searchBar =
    location.pathname === '/settings/manageFiles' || location.pathname === '/settings/myFavorites'
      ? null
      : true
  const perPage =
    location.pathname === '/settings/manageFiles' || location.pathname === '/settings/myFavorites'
      ? 10
      : 25
  const isBookmarked =
    location.pathname === '/settings/myFavorites' ||
    location.pathname === '/settings/myFavorites/folders'
      ? true
      : null
  const pathForLink =
    location.pathname === '/settings/manageFiles'
      ? '/settings/manageFiles/folders'
      : '/settings/myFavorites/folders'

  const { loading } = useSelector((s) => s.folderUpload)
  const [fileData, setFileData] = useState({
    file_name: '',
    file_path: '',
    file_size: null,
    file_type: ''
  })
  const {
    current_page,
    data: folderData,
    loadMore,
    pageNumber: page_no,
    per_page,
    total
  } = useSelector((s) => s.folderUpload?.viewFolder)

  const loadFolders = useCallback(() => {
    if (pages > 0) {
      const d = diff(filterData, json) // undefined if equal
      let p = pages

      if (isValid(d) || searchFile) {
        setJson(filterData)
        p = 1
      }
      dispatch(
        fetchFolders({
          page: p,
          perPage,
          isBookmarked,
          searchKey: searchFile,
          loadMore: pages > 1,
          jsonData: {
            ...filterData
          }
        })
      )
      setReload(false)
    }
  })

  useEffect(() => {
    loadFolders()
  }, [filterData, pages, perPage, isBookmarked, searchFile])

  useEffect(() => {
    if (reload) {
      loadFolders()
    }
  }, [reload])

  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
      setShowViewedBy(false)
      setShowSignedBy(false)
      setEditFile(false)
    }
  }, [])

  const handleClose = (e) => {
    if (e === false) {
      //setEdit(null)
      setShowAdd(false)
      setViewAdd(false)
      setShowViewedBy(false)
      setShowSignedBy(false)
      setSelectedFileId(null)
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
        <a
          role={'button'}
          target={'_blank'}
          href={file?.file_path}
          onClick={() => {
            if (
              file?.view_only_admin_files?.length > 0 &&
              file?.view_only_admin_files?.some((item) => item?.employee_id === user?.id)
            ) {
              setViewDone({
                jsonData: {
                  admin_file_id: file?.id,
                  employee_id: user?.id
                }
              })
            }
          }}
        >
          <img className='rounded' alt={file.name} src={file?.file_path} height='80' width='80' />
        </a>
      )
    } else if (checkURLPF(file?.file_path)) {
      return (
        <a
          role={'button'}
          target={'_blank'}
          href={file?.file_path}
          onClick={() => {
            if (
              file?.view_only_admin_files?.length > 0 &&
              file?.view_only_admin_files?.some((item) => item?.employee_id === user?.id)
            ) {
              setViewDone({
                jsonData: {
                  admin_file_id: file?.id,
                  employee_id: user?.id
                }
              })
            }
          }}
        >
          <PictureAsPdfTwoTone style={{ fontSize: 80 }} />
        </a>
      )
    } else {
      return (
        <a
          role={'button'}
          target={'_blank'}
          href={file?.file_path}
          onClick={() => {
            if (
              file?.view_only_admin_files?.length > 0 &&
              file?.view_only_admin_files?.some((item) => item?.employee_id === user?.id)
            ) {
              setViewDone({
                jsonData: {
                  admin_file_id: file?.id,
                  employee_id: user?.id
                }
              })
            }
          }}
        >
          <FileText url={file?.file_path} size='80' />
        </a>
      )
    }
  }

  const counts = getCounts(folderData, total, per_page)
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

    if (['/settings/myFavorites', '/settings/myFavorites/files'].includes(location.pathname)) {
      setReload(true)
    }
  }

  const Folders = ({ response: response, refresh, isRefreshed }) => {
    return (
      <>
        <Hide
          IF={
            total <= perPage ||
            folderData.length === 0 ||
            location.pathname === '/settings/manageFiles/folders' ||
            location.pathname === '/settings/myFavorites/folders'
          }
        >
          <ViewAllLink path={pathForLink} label={FM('view-all-folders')} />
        </Hide>
        <div className='d-flex flex-wrap'>
          {response?.map((index, item) => (
            <div key={item} className='ps-0 pt-0 p-2'>
              <SingleFolder items={index} refresh={refresh} isRefreshed={isRefreshed} />
            </div>
          ))}
        </div>
        <Hide
          IF={
            location.pathname === '/settings/manageFiles' ||
            location.pathname === '/settings/myFavorites'
          }
        >
          <Row>
            <Col xl='12' md='12'>
              <ReactPaginate
                initialPage={current_page - 1}
                disableInitialCallback
                onPageChange={(pages) => {
                  setPage(pages?.selected + 1)
                }}
                pageCount={counts}
                key={current_page - 1}
                nextLabel={''}
                breakLabel={'...'}
                breakClassName='page-item'
                breakLinkClassName='page-link'
                activeClassName={'active'}
                pageClassName={'page-item'}
                previousLabel={''}
                nextLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousClassName={'page-item prev'}
                previousLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                containerClassName={'pagination react-paginate justify-content-center'}
              />
            </Col>
          </Row>
        </Hide>
      </>
    )
  }
  // const handleSave = (id) => {
  //   setSignDone({
  //     jsonData: {
  //       file_id: id,
  //       employee_id: user?.id
  //     }
  //   })
  // }

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

  const handleSearch = (event) => {
    setSearchFile(event.target.value)
    // Implement your search logic here using searchQuery to filter the files
  }
  // console.log('searchQuery')

  const UserCard = (item, index) => {
    const userIsNotEmployee = !item?.signing_files?.some((file) => file.employee_id === user.id)
    const userIsEmployee = item?.signing_files?.some((file) => file.employee_id === user.id)
    const userIsEmployeeAndSigned = item?.signing_files?.some(
      (file) => file.employee_id === user.id && file.is_signed === 1
    )

    /*drag and drop*/
    const handleDragStart = (e) => {
      e.dataTransfer.setData('id', JSON.stringify({ type: 'File', data: item?.id }))
    }
    const handleDragEnd = (e) => {
      e.target.style.opacity = '1'
    }
    const handleDrag = (e) => {
      e.target.style.opacity = '0'
    }
    /*drag and drop*/
    return (
      <>
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={handleDrag}
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          className='flex-1'
          key={`ip-${index}`}
        >
          <Card className='animate__animated animate__slideInUp'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='8' className='d-flex align-items-center'>
                  <Row>
                    <Col xs='12'>
                      <h5
                        id={`title-${item?.id}`}
                        role='button'
                        className='mb-3px fw-bolder text-primary'
                      >
                        {truncateText(item?.title, 15)}
                      </h5>
                      <UncontrolledTooltip target={`title-${item?.id}`}>
                        <p>{item?.title}</p>
                      </UncontrolledTooltip>
                      <p className='mb-0 text-small-12 text-truncate text-danger d-flex align-items-center'>
                        <CloudDownload fontSize='small' className='me-25' /> {item?.file_size} MB
                      </p>
                    </Col>
                  </Row>
                </Col>

                <Col xs='1'>
                  <Show IF={item?.fileable_type === 'App\\Models\\Activity'}>
                    {item?.fileable && (
                      <>
                        <span
                          id={`activity-${item?.id}`}
                          // role={'button'}
                          className='text-primary'
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
                  <Show IF={item?.fileable_type === 'App\\Models\\PatientImplementationPlan'}>
                    {item?.fileable && (
                      <>
                        <span
                          id={`implementation-${item?.id}`}
                          // role={'button'}
                          className='text-primary'
                          // className='mb-0 text-dark fw-bolder text-small-12'
                        >
                          <Rotate90DegreesCcw fontSize='small' />
                        </span>
                        <UncontrolledTooltip target={`implementation-${item?.id}`}>
                          <p className='mb-0 fw-bold text-truncate text-small-12'>
                            {`IP Name: ${item?.fileable?.title}`}
                          </p>
                        </UncontrolledTooltip>
                      </>
                    )}
                  </Show>
                  <Show IF={item?.fileable_type === 'App\\Models\\Task'}>
                    {item?.fileable && (
                      <>
                        <span
                          id={`task-${item?.id}`}
                          // role={'button'}
                          className='text-primary'
                          // className='mb-0 text-dark fw-bolder text-small-12'
                        >
                          <Target size={16} />
                        </span>
                        <UncontrolledTooltip target={`task-${item?.id}`}>
                          <p className='mb-0 fw-bold text-truncate text-small-12'>
                            {`Activity Name: ${item?.fileable?.title}`}
                          </p>
                        </UncontrolledTooltip>
                      </>
                    )}
                  </Show>
                  <Show
                    IF={
                      item?.fileable_type === 'App\\Models\\User' &&
                      item?.fileable?.user_type_id === UserTypes.employee
                    }
                  >
                    {item?.fileable && (
                      <>
                        <span
                          id={`employee-${item?.id}`}
                          // role={'button'}
                          className='text-primary'
                        >
                          <Users size={16} />
                        </span>
                        <UncontrolledTooltip target={`employee-${item?.id}`}>
                          <p className='mb-0 fw-bold text-truncate text-small-12'>
                            {`Employee Name: ${decrypt(item?.fileable?.name)}`}
                          </p>
                        </UncontrolledTooltip>
                      </>
                    )}
                  </Show>
                  <Show
                    IF={
                      item?.fileable_type === 'App\\Models\\User' &&
                      item?.fileable?.user_type_id === UserTypes.patient
                    }
                  >
                    {item?.fileable && (
                      <>
                        <span
                          id={`patient-${item?.id}`}
                          // role={'button'}
                          className='text-primary'
                        >
                          <UserPlus size={16} />
                        </span>
                        <UncontrolledTooltip target={`patient-${item?.id}`}>
                          <p className='mb-0 fw-bold text-truncate text-small-12'>
                            {`Patient Name: ${decrypt(item?.fileable?.name)}`}
                          </p>
                        </UncontrolledTooltip>
                      </>
                    )}
                  </Show>
                  <Show IF={item?.fileable_type === 'App\\Models\\PatientCashier'}>
                    {item?.fileable && (
                      <>
                        <span
                          id={`patientCashier-${item?.id}`}
                          // role={'button'}
                          className='text-primary'
                        >
                          <Clipboard size={16} />
                        </span>
                        <UncontrolledTooltip target={`patientCashier-${item?.id}`}>
                          <p className='mb-0 fw-bold text-truncate text-small-12'>
                            {`Receipt No. : ${item?.fileable?.receipt_no}`}
                          </p>
                        </UncontrolledTooltip>
                      </>
                    )}
                  </Show>
                  <Show
                    IF={
                      item?.fileable_type === 'App\\Models\\User' &&
                      item?.fileable?.user_type_id === UserTypes.branch
                    }
                  >
                    {item?.fileable && (
                      <>
                        <span
                          id={`branch-${item?.id}`}
                          // role={'button'}
                          className='text-primary'
                        >
                          <Pocket size={16} />
                        </span>
                        <UncontrolledTooltip target={`branch-${item?.id}`}>
                          <p className='mb-0 fw-bold text-truncate text-small-12'>
                            {`Branch Name: ${decrypt(item?.fileable?.name)}`}
                          </p>
                        </UncontrolledTooltip>
                      </>
                    )}
                  </Show>
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
                <Col xs='1'>
                  <BsTooltip title={FM('favorite')}>
                    <StarRounded style={{ color: 'orange', fontSize: 26, cursor: 'pointer' }} />
                  </BsTooltip>
                </Col>
                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
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
                    <Show IF={Permissions.fileUploadCompany && user.id === item?.created_by?.id}>
                      <DropDownMenu
                        tooltip={FM(`menu`)}
                        component={
                          <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                        }
                        options={[
                          {
                            onClick: () => {
                              setEditFile(true)
                              setEdit(item)
                            },
                            name: FM('edit'),
                            icon: <Edit size={14} />
                          },
                          {
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
                  <p
                    id={`date-${item?.id}`}
                    role={'button'}
                    className='mb-0 text-dark fw-bolder text-small-12'
                  >
                    <Calendar size={16} />
                  </p>
                  <UncontrolledTooltip target={`date-${item?.id}`}>
                    <p className='mb-0 fw-bold text-truncate text-small-12'>
                      {FM('added-date')} <Calendar size={14} />{' '}
                      {formatDate(item?.created_at, 'YYYY-MM-DD')}
                    </p>
                  </UncontrolledTooltip>
                </Col>
                <Col md='2'>
                  <p
                    id={`isPublic-${item?.id}`}
                    role={'button'}
                    className='mb-0 text-dark fw-bolder text-small-12'
                  >
                    {item?.is_public ? <Unlock size={16} /> : <Lock size={16} />}
                  </p>
                  <UncontrolledTooltip target={`isPublic-${item?.id}`}>
                    <p className='mb-0 fw-bold text-truncate text-small-12'>
                      {FM('is-public')}{' '}
                      {item?.is_public === 1 ? <Unlock size={14} /> : <Lock size={14} />}
                      {item?.is_public === 1 ? FM('yes') : FM('no')}
                    </p>
                  </UncontrolledTooltip>
                </Col>
                <Col md='2'>
                  <p
                    id={`userType-${item?.id}`}
                    role={'button'}
                    className='mb-0 text-dark fw-bolder text-small-12'
                  >
                    <User size={16} />
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
                    <p
                      id={`userTypeName-${item?.id}`}
                      role={'button'}
                      className='mb-0 text-dark fw-bolder text-small-12'
                    >
                      <Users size={16} />
                    </p>
                    <UncontrolledTooltip target={`userTypeName-${item?.id}`}>
                      <p className='mb-0 fw-bold text-truncate text-small-12'>
                        {FM('uploaded-for')} <Users size={14} /> {item?.user_type?.name}
                      </p>
                    </UncontrolledTooltip>
                  </Col>
                </Show>
                <Show IF={item?.fileable_type === null}>
                  <Show
                    IF={user.id === item?.created_by?.id && item?.view_only_admin_files?.length > 0}
                  >
                    <Col md='2'>
                      <p
                        id={`fileView-${item?.id}`}
                        role={'button'}
                        className='mb-0 text-dark fw-bolder text-small-12'
                        onClick={() => {
                          setSelectedFileId(item?.id)
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

                  {/* uncomment when add bankID for signing
                 <Show
                  IF={item?.signing_files?.length > 0 && userIsEmployee && !userIsEmployeeAndSigned}
                >
                  <Col md='2'>
                    <p
                      id={`fileToSign-${item?.id}`}
                      role={'button'}
                      className='mb-0 text-dark fw-bolder text-small-12'
                    >
                     <ConfirmAlert
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
                          !isValid(user?.personal_number) || pack?.is_enable_bankid_charges === 0
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
                        <PenTool size='15' />
                      </ConfirmAlert>
                    </p>
                    <UncontrolledTooltip target={`fileToSign-${item?.id}`}>
                      <p className='mb-0 fw-bold text-truncate text-small-12'>{FM('sign')}</p>
                    </UncontrolledTooltip>
                  </Col>
                </Show>        
                 */}
                  <Show
                    IF={
                      item?.signing_files?.length > 0 && userIsEmployee && !userIsEmployeeAndSigned
                    }
                  >
                    <Col md='2'>
                      <p
                        id={`fileToSign-${item?.id}`}
                        role={'button'}
                        className='mb-0 text-dark fw-bolder text-small-12'
                      >
                        <ConfirmAlert
                          uniqueEventId={`${item?.id}-file-sign`}
                          item={item}
                          title={FM('Please Sign This File', {
                            name: item?.title
                          })}
                          color='text-warning'
                          onClickYes={() =>
                            setSignDone({
                              jsonData: {
                                file_id: item?.id,
                                employee_id: user?.id,
                                signed_method: null
                              }
                            })
                          }
                          onSuccessEvent={(e) => {
                            log('e', item?.id, e)
                            setReload(true)
                          }}
                          textClass='text-danger text-small-12'
                          confirmButtonText={'Sign'}
                          className=''
                          id={`grid-sign-${item?.id}`}
                          successTitle={FM('signed')}
                          successText={FM('file-is-signed')}
                        >
                          <PenTool size='14' className='me-2' />
                        </ConfirmAlert>
                      </p>
                      <UncontrolledTooltip target={`fileToSign-${item?.id}`}>
                        <p className='mb-0 fw-bold text-truncate text-small-12'>{FM('sign')}</p>
                      </UncontrolledTooltip>
                    </Col>
                  </Show>
                  <Show IF={item?.signing_files?.length > 0 && user.id === item?.created_by}>
                    <Col md='2'>
                      <p
                        id={`fileSign-${item?.id}`}
                        role={'button'}
                        className='mb-0 text-dark fw-bolder text-small-12'
                        onClick={() => {
                          setSelectedFileId(item?.id)
                          setShowSignedBy(true)
                        }}
                      >
                        <PenTool size={14} />
                      </p>
                      <UncontrolledTooltip target={`fileSign-${item?.id}`}>
                        <p className='mb-0 fw-bold text-truncate text-small-12'>
                          {FM('signed-by')}
                        </p>
                      </UncontrolledTooltip>
                    </Col>
                  </Show>
                  <Show IF={item?.signing_files?.length > 0 && userIsEmployeeAndSigned}>
                    <Col md='2'>
                      <p
                        id={`fileSignDone-${item?.id}`}
                        role={'button'}
                        className='mb-0 text-dark fw-bolder text-small-12'
                      >
                        <PenTool size={14} className='text-warning' />
                      </p>
                      <UncontrolledTooltip target={`fileSignDone-${item?.id}`}>
                        <p className='mb-0 fw-bold text-truncate text-small-12'>{FM('signed')}</p>
                      </UncontrolledTooltip>
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

  const AdminCard = (item, index) => {
    return (
      <>
        <div className='flex-1' key={`ip-${index}`}>
          <Card className='animate__animated animate__slideInUp'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='11' className='d-flex align-items-center'>
                  <Row>
                    <Col xs='12'>
                      <h5 className='mb-3px fw-bolder text-primary'>{item?.title}</h5>
                      <p className='mb-0 text-small-12 text-truncate text-danger d-flex align-items-center'>
                        <CloudDownload fontSize='small' className='me-25' /> {item?.file_size} MB
                      </p>
                    </Col>
                  </Row>
                </Col>

                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <Show IF={item?.top_most_parent_id === 1}>
                    <Show IF={Permissions.fileDelete}>
                      <DropDownMenu
                        tooltip={FM(`menu`)}
                        component={
                          <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                        }
                        options={[
                          {
                            noWrap: true,
                            name: (
                              <ConfirmAlert
                                uniqueEventId={`${item?.id}-files`}
                                item={item}
                                title={FM('delete-this', { name: item?.title })}
                                color='text-warning'
                                onClickYes={() => deleteFiles({ id: item?.id })}
                                onSuccessEvent={(item) => {
                                  deleteFile(item?.id)
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
                            noWrap: true,
                            name: (
                              <div className='dropdown-item' onClick={() => downloadFile(item)}>
                                <Download size={14} />
                                <span className='ms-1'>{FM('download')}</span>
                              </div>
                            )
                          }
                        ]}
                      />
                    </Show>
                  </Show>
                </Col>
              </Row>
              <div className='d-flex justify-content-center mt-2'>{renderOldFilePreview(item)}</div>
            </CardBody>
            <CardBody className='pt-0'>
              <Row className='align-items-center gy-2'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('added-date')}</p>
                  <p role={'button'} className='mb-0 fw-bold text-secondary text-truncate'>
                    <Calendar size={14} /> {formatDate(item?.created_at, 'DD MMMM, YYYY')}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('is-public')}</p>
                  <p role={'button'} className='mb-0 fw-bold text-secondary text-truncate'>
                    <Unlock size={14} /> {item?.is_public === 1 ? FM('yes') : FM('no')}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('uploaded-by')}</p>
                  <p role={'button'} className='mb-0 fw-bold text-secondary text-truncate'>
                    <Users size={14} /> {item?.user_type === null ? 'Admin' : 'Company'}
                  </p>
                </Col>
                <Show IF={isValidArray(item?.assign_to_company_info)}>
                  <Col md='12'>
                    <p className='mb-0 text-dark fw-bolder'>{FM('assign-to')}</p>
                    <BsPopover
                      title={FM('assign-to')}
                      role='button'
                      Tag={'p'}
                      content={
                        isValidArray(item?.assign_to_company_info)
                          ? item?.assign_to_company_info?.map((d, i) => {
                              return (
                                <>
                                  {decrypt(d?.branch_name)} <br />
                                </>
                              )
                            })
                          : null
                      }
                      className='mb-0 fw-bold text-secondary text-truncate'
                    >
                      <Edit2 size={14} />{' '}
                      {FM('assigned-to-companies', { count: item?.assign_to_company_info?.length })}
                    </BsPopover>
                  </Col>
                </Show>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <ViewFileTasks showModal={showTask} setShowModal={handleClose} fileId={edit?.id} noView />
      <CheckFileStatus
        showModal={showViewedBy}
        setShowModal={handleClose}
        fileId={selectedFileId}
        folder={null}
        status={'viewed'}
      />
      <CheckFileStatus
        showModal={showSignedBy}
        setShowModal={handleClose}
        fileId={selectedFileId}
        folder={null}
        status={'signed'}
      />
      <FileEdit
        showModal={editFile}
        setShowModal={handleClose}
        fileEdit={edit}
        setReload={(e) => {
          log(e, 'gh')
          setReload(true)
        }}
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

      <Header
        goToBack={
          location.pathname === '/settings/manageFiles' ||
          location.pathname === '/settings/myFavorites'
            ? null
            : true
        }
        icon={<File size='25' />}
      >
        <Searching handleSearchChange={handleSearchChange} showSearchBar={searchBar} />
        {/* Tooltips */}
        <ButtonGroup color='dark'>
          <Show IF={Permissions.fileAdd}>
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
          </Show>
          <Show IF={Permissions.fileUploadCompany}>
            <Show IF={location.pathname.includes('/settings/manageFiles')}>
              <UncontrolledTooltip target='create-buttons'>
                {FM('create-a-folder-or-upload-a-file')}
              </UncontrolledTooltip>
              <FileFolderUpload
                onSuccess={(e) => {
                  setPage(1)
                  loadFolders()
                }}
                setReload={(e) => {
                  log(e, 'gh')
                  setReload(true)
                  setFilterData({})
                }}
                Component={Button.Ripple}
                size='sm'
                color='primary'
                id='create-buttons'
              >
                <Plus size='16' />
              </FileFolderUpload>
            </Show>
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
      <Show
        IF={
          isValid(userType) &&
          [
            '/settings/manageFiles',
            '/settings/manageFiles/folders',
            '/settings/myFavorites',
            '/settings/myFavorites/folders'
          ].includes(location.pathname)
        }
      >
        {!loading && <Folders refresh={reload} isRefreshed={setReload} response={folderData} />}
      </Show>
      <Show
        IF={
          isValid(userType) &&
          [
            '/settings/manageFiles',
            '/settings/manageFiles/files',
            '/settings/myFavorites',
            '/settings/myFavorites/files'
          ].includes(location.pathname)
        }
      >
        {userType === 1 ? (
          <TableGrid
            refresh={reload}
            isRefreshed={setReload}
            loadFrom={uploadFilesList}
            jsonData={{
              ...filterData
            }}
            selector='fileupload'
            state='fileAdmin'
            display='grid'
            gridCol='4'
            gridView={AdminCard}
            isBookmarked={null}
          />
        ) : (
          <TableGrid
            refresh={reload}
            isRefreshed={setReload}
            loadFrom={uploadFilesListUser}
            jsonData={{
              ...filterData
            }}
            selector='fileupload'
            state={
              location.pathname.includes('/settings/manageFiles') ? 'fileUser' : 'fileUserBookmark'
            }
            display='grid'
            md='3'
            gridView={UserCard}
            isBookmarked={location.pathname.includes('/settings/manageFiles') ? null : true}
            searchKey={searchFile}
          />
        )}
      </Show>
    </>
  )
}

export default UploadFile
