import React from 'react'
import { Eye, FileText } from 'react-feather'
import { Button, ListGroupItem } from 'reactstrap'
import { FM, isValidArray } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import BsTooltip from '../../../components/tooltip'

const Files = ({ ip }) => {
  const oldFiles = isValidArray(ip?.documents) ? ip?.documents : []

  function checkURL(url) {
    return String(url).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  const renderOldFilePreview = (file) => {
    if (checkURL(file?.file_url)) {
      return <img className='rounded' alt={file.name} src={file?.file_url} height='28' width='28' />
    } else {
      return <FileText url={file?.file_url} size='28' />
    }
  }

  return (
    <div>
      <Hide IF={isValidArray(oldFiles)}>
        <div className='p-2 text-center'>{FM('no-documents')}</div>
      </Hide>
      {oldFiles?.map((file, index) => (
        <ListGroupItem
          key={`${file.name}-${index}`}
          className='d-flex align-items-center justify-content-between'
        >
          <div className='file-details d-flex align-items-center'>
            <div className='file-preview me-1'>{renderOldFilePreview(file)}</div>
            <div>
              <p className='file-name mb-0'>{file?.file_name}</p>
            </div>
          </div>
          <div>
            <BsTooltip
              Tag={Button}
              title={FM('view')}
              color='primary'
              outline
              size='sm'
              className='btn-icon'
              onClick={() => {
                window.open(file?.file_url, '_blank')
              }}
            >
              <Eye size={14} />
            </BsTooltip>
          </div>
        </ListGroupItem>
      ))}
    </div>
  )
}

export default Files
