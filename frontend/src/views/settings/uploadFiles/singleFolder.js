import { useDispatch } from 'react-redux'
import { Badge } from '@material-ui/core'
import {
  CloudDownload,
  FolderTwoTone,
  FormatSize,
  StarBorderRounded,
  StarRounded
} from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Edit2, Info, MoreVertical, Trash2, Download, Share, Folder } from 'react-feather'
import 'react-image-lightbox/style.css'
import { useParams, Link, useLocation } from 'react-router-dom'
import { Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import BsTooltip from '../../../views/components/tooltip'
import { IconSizes } from '../../../utility/Const'
// ** Styles
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'

import DropDownMenu from '../../components/dropdown'
import EditNameModal from './editNameModal'
import { updateFileListUser } from '../../../redux/reducers/fileupload'
import { deleteFolder, editFolder, moveFilesUserToFolder } from '../../../utility/apis/commons'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import {
  folderDelete,
  updateIsBookmark,
  updateBookmarked
} from '../../../redux/reducers/folderUpload'

const SingleFolder = ({ items, onSuccess = () => {}, refresh = false, isRefreshed = () => {} }) => {
  const location = useLocation()
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [reload, setReload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [isDroppedOn, setIsDroppedOn] = useState(false)

  const handleUpdateName = (id, newName) => {
    if (editFolder) {
      editFolder({
        id,
        jsonData: {
          name: newName
        },
        dispatch,
        loading: setLoading,
        success: (d) => {
          onSuccess(d)
          isRefreshed(true)
        }
      })
    }
    setEditModal(!editModal)
    isRefreshed(false)
  }

  const handleBookmarkUpdate = (item) => {
    dispatch(updateIsBookmark({ id: item.id }))
    dispatch(updateBookmarked({ id: item.id, type: 'Folder' }))
    if (['/settings/myFavorites', '/settings/myFavorites/folders'].includes(location.pathname)) {
      isRefreshed(true)
    }
  }

  const isManageFilesPath = location.pathname.includes('/settings/manageFiles')
  const goToPath = isManageFilesPath
    ? `/settings/manageFiles/folder/${items?.id}`
    : `/settings/myFavorites/folder/${items?.id}`

  /*drag and drop */
  const handleDropFile = (fileId, folderId) => {
    moveFilesUserToFolder({
      file_id: fileId,
      folder_id: folderId,
      dispatch,
      success: () => {
        dispatch(updateFileListUser(fileId, folderId))

        isRefreshed(true)
      },
      error: () => {
        console.log('error')
      }
    })
  }

  const handleOnDrop = (e) => {
    e.preventDefault()
    const droppedData = JSON.parse(e.dataTransfer.getData('id'))
    if (droppedData.type === 'File') {
      const { data: fileId } = droppedData
      handleDropFile(fileId, items.id)
      isRefreshed(true)
    }
    setIsDroppedOn(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDroppedOn(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDroppedOn(false)
  }
  /*drag and drop*/

  return (
    <Col>
      <div onDrop={handleOnDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
        <Card className={`shadow ${isDroppedOn ? 'border-primary' : 'white'}`}>
          <div className='timeline-header pt-1 pb-1'>
            {editModal && (
              <EditNameModal
                id={items?.id}
                isOpen={editModal}
                toggle={() => setEditModal(!editModal)}
                existingName={items?.name}
                onUpdate={handleUpdateName}
              />
            )}
            <Row className='align-items-start gx-0'>
              {/* link tag added so that when we click on folder it will redirect to subfolders and files */}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '219px'
                }}
              >
                <Link to={goToPath}>
                  <div className='fw-bolder text-primary'>
                    {/* <Folder size={24} className='ms-1 me-1' /> */}
                    <Badge
                      badgeContent={items?.admin_files_count}
                      overlap='circular'
                      showZero
                      max={999}
                      color='primary'
                    >
                      <FolderTwoTone style={{ fontSize: 60 }} className='ms-1 me-1' />
                    </Badge>
                    {items.name}
                  </div>
                </Link>
                <BsTooltip title={FM('favorite')}>
                  {items?.is_bookmark ? (
                    <StarRounded
                      style={{ color: 'orange', fontSize: 26, cursor: 'pointer' }}
                      onClick={() => handleBookmarkUpdate(items)}
                    />
                  ) : (
                    <StarBorderRounded
                      size={30}
                      style={{ color: 'orange', fontSize: 26, cursor: 'pointer' }}
                      onClick={() => handleBookmarkUpdate(items)}
                    />
                  )}
                </BsTooltip>

                <DropDownMenu
                  tooltip={FM(`menu`)}
                  component={
                    <MoreVertical
                      color={colors.primary.main}
                      size={IconSizes.MenuVertical}
                      className='me-1'
                    />
                  }
                  options={[
                    // {
                    //   // IF: Can(Permissions.deviationPrint) && items?.is_signed === 1,
                    //   icon: <Download size={14} />,
                    //   onClick: () => {
                    //     // handleDownload(items)
                    //   },
                    //   name: FM('download')
                    // },
                    {
                      icon: <Edit2 size={14} />,
                      onClick: () => {
                        setEditModal(true)
                      },
                      name: FM('edit')
                    },
                    {
                      noWrap: true,
                      name: (
                        <ConfirmAlert
                          uniqueEventId={`${items?.id}-folders`}
                          item={items}
                          title={FM('delete-this', { name: items?.name })}
                          color='text-warning'
                          onClickYes={() => deleteFolder({ id: items?.id })}
                          onSuccessEvent={(items) => {
                            dispatch(folderDelete(items?.id))
                            isRefreshed(true)
                          }}
                          className='dropdown-item'
                          id={`grid-deletes-${items?.id}`}
                        >
                          <Trash2 size={14} />
                          <span className='ms-1'>{FM('delete')}</span>
                        </ConfirmAlert>
                      )
                    }
                    // {
                    //   // IF: Can(Permissions.deviationPrint) && items?.is_signed === 1,
                    //   icon: <Info size={14} />,
                    //   onClick: () => {},
                    //   name: FM('file-information')
                    // },
                    // {
                    //   // IF: Can(Permissions.deviationPrint) && items?.is_signed === 1,
                    //   icon: <Share size={14} />,
                    //   onClick: () => {},
                    //   name: FM('share')
                    // },
                  ]}
                />
              </div>
            </Row>
          </div>
        </Card>
      </div>
    </Col>
  )
}

export default SingleFolder
