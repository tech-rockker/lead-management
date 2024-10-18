import React from 'react'
import { Eye, FileText } from 'react-feather'
import { Button, ListGroupItem } from 'reactstrap'
import { FM, isValid, isValidArray } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import BsTooltip from '../../../../components/tooltip'

const FilesTab = ({ edit }) => {
  function checkURL(file_path) {
    return String(file_path).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  const renderOldFilePreview = (file) => {
    if (checkURL(file?.file_path)) {
      return (
        <a role={'button'} target={'_blank'} href={file?.file_path}>
          <img className='rounded' alt={file.name} src={file?.file_path} height='50' width='50' />
        </a>
      )
    } else {
      return (
        <a role={'button'} target={'_blank'} href={file?.file_path}>
          <FileText url={file?.file_path} size='50' />
        </a>
      )
    }
  }
  return (
    <div>
      <Hide IF={isValid(renderOldFilePreview)}>
        <div className='p-2 text-center'>{FM('no-documents')}</div>
      </Hide>
      <div className='d-flex justify-content-start mt-2'>{renderOldFilePreview(edit)}</div>
    </div>
  )
}

export default FilesTab
