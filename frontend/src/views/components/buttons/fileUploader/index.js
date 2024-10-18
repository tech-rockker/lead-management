// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Progress,
  ButtonGroup
} from 'reactstrap'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Imports
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'
import { X, DownloadCloud, FileText, Check, Eye, File } from 'react-feather'
import { ErrorToast, getFIleBinaries, humanFileSize, setValues } from '../../../../utility/Utils'
// ** Styles
import '@styles/react/libs/file-uploader/file-uploader.scss'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import Hide from '../../../../utility/Hide'
import { uploadFiles } from '../../../../utility/apis/commons'
import BsTooltip from '../../tooltip'
import { useDispatch } from 'react-redux'

const DropZone = ({
  className = '',
  value = null,
  name = null,
  onSuccess = () => {},
  multiple = false,
  accept = null,
  maxSize = 10.2,
  minSize = 0,
  maxFiles = 1,
  setValue = () => {}
}) => {
  // ** State
  const [files, setFiles] = useState([])
  const [controller, setController] = useState(new AbortController())
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState([])
  const [oldFiles, setOldFIles] = useState([])
  const [deleteOldFiles, setDeleteOldFIles] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    onSuccess(uploaded)
  }, [uploaded])

  console.log('value', value)

  console.log('files', files)

  useEffect(() => {
    if (isValid(value) && deleteOldFiles === false) {
      if (multiple && maxFiles > 1) {
        setOldFIles([
          ...value?.map((a) => {
            return {
              url: a?.file_path,
              name: a?.file_name,
              size: '',
              ext: '',
              type: ''
            }
          })
        ])
      } else {
        console.log('file type')
        setOldFIles([
          {
            url: value?.file_path,
            name: value?.file_name,
            size: '',
            ext: '',
            type: value?.file_type ?? null
          }
        ])
      }
    }
  }, [value])

  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    accept,
    maxSize: maxSize * 1024 * 1000,
    minSize,
    maxFiles,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        ErrorToast('invalid-file-selected')
      } else {
        setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))])
      }
    }
  })

  const handleRemoveFile = (file) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i) => i.name !== file.name)
    setFiles([...filtered])

    if (maxFiles === 1) {
      setUploaded([])
    } else {
      const uF = uploaded
      const f = uF.filter((i) => i.uploading_file_name !== file.name)
      setUploaded([...f])
    }
  }

  const renderFileSize = (size) => {
    return humanFileSize(size)
  }

  const renderFilePreview = (file) => {
    if (file.type.startsWith('image')) {
      return (
        <img
          className='rounded'
          alt={file.name}
          src={URL.createObjectURL(file)}
          height='28'
          width='28'
        />
      )
    } else {
      return <FileText size='28' />
    }
  }
  function checkURL(url) {
    return String(url).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  const renderOldFilePreview = (file) => {
    if (checkURL(file?.url)) {
      return <img className='rounded' alt={file.name} src={file?.url} height='28' width='28' />
    } else {
      return <FileText url={file?.url} size='28' />
    }
  }
  function baseName(str) {
    let base = new String(str)?.substring(str?.lastIndexOf('/') + 1)
    if (base?.lastIndexOf('.') !== -1) base = base?.substring(0, base?.lastIndexOf('.'))
    return base
  }
  const fileList = files?.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className='d-flex align-items-center justify-content-between'
    >
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <div>
        <Button
          color='danger'
          outline
          size='sm'
          className='btn-icon'
          onClick={() => handleRemoveFile(file)}
        >
          <X size={14} />
        </Button>
      </div>
    </ListGroupItem>
  ))
  const uploadedFiles = uploaded?.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className='d-flex align-items-center justify-content-between'
    >
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderOldFilePreview(file?.file_name)}</div>
        <div>
          <p className='file-name mb-0'>{file?.uploading_file_name}</p>
          <p className='file-size mb-0'>{file.file_extension}</p>
        </div>
      </div>
      <div>
        <Button color='flat-success' size='sm' className='btn-icon pe-none'>
          <Check size={14} />
        </Button>
        <BsTooltip
          Tag={Button}
          title={FM('view')}
          color='primary'
          outline
          size='sm'
          className='btn-icon'
          onClick={() => {
            window.open(file?.file_name, '_blank')
          }}
        >
          <Eye size={14} />
        </BsTooltip>
      </div>
    </ListGroupItem>
  ))

  const renderOldList = oldFiles?.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className='d-flex align-items-center justify-content-between'
    >
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderOldFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file?.name ?? baseName(file?.url)}</p>
        </div>
      </div>
      <div>
        <Button color='flat-success' size='sm' className='btn-icon pe-none'>
          <Check size={14} />
        </Button>
        <BsTooltip
          Tag={Button}
          title={FM('view')}
          color='primary'
          outline
          size='sm'
          className='btn-icon'
          onClick={() => {
            window.open(file?.url, '_blank')
          }}
        >
          <Eye size={14} />
        </BsTooltip>
      </div>
    </ListGroupItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
    setUploaded([])
  }

  const handleCancel = () => {
    controller?.abort()
    setController(new AbortController())
    setProgress(0)
  }

  const handleUpload = () => {
    log(files)
    uploadFiles({
      success: (d) => {
        setProgress(0)
        if (multiple) {
          setUploaded([...uploaded, ...d?.payload])
        } else {
          setUploaded([d?.payload])
        }
        setFiles([])
      },
      loading: setLoading,
      progress: setProgress,
      dispatch,
      controller,
      formData:
        maxFiles === 0 || maxFiles > 1
          ? { is_multiple: 1, ...getFIleBinaries(files) }
          : { is_multiple: 0, file: files[0] }
    })
  }

  const handleReplace = () => {
    setOldFIles([])
  }

  const handleDelete = (d) => {
    setOldFIles([])
    setFiles([])
    setUploaded([])
    setDeleteOldFIles(true)
  }

  return (
    <>
      <Hide
        IF={
          maxFiles === files?.length ||
          maxFiles === uploaded?.length ||
          maxFiles === files?.length + uploaded?.length ||
          maxFiles === 0 ||
          oldFiles?.length > 0
        }
      >
        <div {...getRootProps({ className: `dropzone ${className}` })}>
          <input {...getInputProps()} />
          <div className='d-flex align-items-center justify-content-center flex-column'>
            <DownloadCloud size={34} />
            <h5>{FM('upload')}</h5>
            <p className='text-secondary text-center text-size-12 mb-0 ps-2 pe-2'>
              {FM('drop-files-here-or-click')}{' '}
              <a href='/' onClick={(e) => e.preventDefault()}>
                {FM('browse')}
              </a>{' '}
              {FM('through-your-machine')}
            </p>
            <p className='text-size-12 mb-0 text-dark fw-bold mt-0'>
              {FM('please-upload-file-less-than', { size: renderFileSize(maxSize * 1024 * 1000) })}
            </p>
          </div>
        </div>
      </Hide>

      {files?.length || uploaded?.length ? (
        <Fragment>
          <ListGroup className={maxFiles === files?.length || maxFiles === 0 ? '' : 'my-2'}>
            {uploadedFiles}
            {fileList}
          </ListGroup>
          <Show IF={maxFiles === files?.length + uploaded?.length && maxFiles > 1}>
            <div className='limit-reached text-danger text-size-12'>
              {FM('max-upload-limit-reached')}
            </div>
          </Show>
          <Show IF={loading}>
            <Progress animated striped className='progress-bar-success my-1' value={progress} />
          </Show>

          <div className='d-flex justify-content-end mt-2'>
            <Hide IF={loading || maxFiles === 1}>
              <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                {FM('remove-all')}
              </Button>
            </Hide>
            <Show IF={loading}>
              <Button className='me-1' color='danger' outline onClick={handleCancel}>
                {FM('cancel')}
              </Button>
            </Show>
            <Hide IF={loading || files?.length <= 0}>
              <Button onClick={handleUpload} color='primary'>
                {FM('upload')}
              </Button>
            </Hide>
          </div>
        </Fragment>
      ) : null}
      {oldFiles?.length ? (
        <Fragment>
          <ListGroup className={'my-2'}>{renderOldList}</ListGroup>

          <div className='d-flex justify-content-end mt-2'>
            <Button className='me-1' color='danger' outline onClick={handleReplace}>
              {FM('replace')}
            </Button>

            <Button className='me-1' color='danger' outline onClick={handleDelete}>
              {FM('remove')}
            </Button>
          </div>
        </Fragment>
      ) : null}
    </>
  )
}

export default DropZone
