// ** React Imports
import { useState, Fragment, useEffect, useSelector } from 'react'

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
  ButtonGroup,
  Input,
  Col,
  Row
} from 'reactstrap'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Imports
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'
import { X, DownloadCloud, FileText, Check, Eye, File } from 'react-feather'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  decryptObject,
  ErrorToast,
  getFIleBinaries,
  humanFileSize
} from '../../../../utility/Utils'
// ** Styles
import '@styles/react/libs/file-uploader/file-uploader.scss'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import Hide from '../../../../utility/Hide'
import { uploadFiles } from '../../../../utility/apis/commons'
import BsTooltip from '../../tooltip'
import FormGroupCustom from '../../formGroupCustom'
import { useForm } from 'react-hook-form'
import { loadUserTypes } from '../../../../utility/apis/userTypes'
import { UserTypes, forDecryption, roleType, roleTypes } from '../../../../utility/Const'
import { useDispatch } from 'react-redux'
import { uploadFile } from '../../../../redux/reducers/fileupload'
import { loadUser, loadBranchesUsers } from '../../../../utility/apis/userManagement'
import useUserType from '../../../../utility/hooks/useUserType'
import useTopMostParent from '../../../../utility/hooks/useTopMostParent'
import Accordian from '../../Accordian'
import useUser from '../../../../utility/hooks/useUser'
const DropZoneCompany = ({
  value = null,
  onSuccess = () => {},
  multiple = false,
  accept = null,
  maxSize = 26214400,
  minSize = 0,
  maxFiles = 1,
  handleClose,
  folderId = null,
  setReload = () => {}
}) => {
  // ** State
  const [files, setFiles] = useState([])
  const dispatch = useDispatch()
  const [controller, setController] = useState(new AbortController())
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState([])
  const [oldFiles, setOldFIles] = useState([])
  const [userList, setUserList] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])

  // Emp
  const [emp, setEmp] = useState([])
  const [empSel, setEmpSel] = useState(null)

  const [type, setType] = useState(null)

  const userType = useUserType()
  const topMostParent = useTopMostParent()
  const user = useUser()

  const getUsers = () => {
    loadBranchesUsers({
      success: (data) => {
        setUserList(data)
        return data
      }
    })
  }

  useEffect(() => {
    if (userType) {
      setType(userType)
    }
  }, [userType])
  const [formData, setFormData] = useState({
    option:
      value?.signing_files?.length > 0 ? '3' : value?.view_only_admin_files?.length > 0 ? '2' : '1',
    showCheckboxes: value?.is_for_all && value?.user_type_id
  })

  //
  const [usertypeData, setUserTypeData] = useState(null)
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form

  const options = createConstSelectOptions(roleType.company, FM)
  useEffect(() => {
    onSuccess(uploaded)
    getUsers()
  }, [uploaded])

  useEffect(() => {
    if (isValid(value)) {
      if (multiple && maxFiles > 1) {
        setOldFIles([
          ...value?.map((a) => {
            return {
              id: null,
              name: '',
              url: a?.file_path,
              name: a?.title,
              size: '',
              ext: ''
            }
          })
        ])
      } else {
        setOldFIles([
          {
            id: value?.id,
            url: value?.file_path,
            name: value?.title,
            size: value?.file_size,
            is_for_all: value?.is_for_all,
            // name: value?.file_name,
            ext: ''
          }
        ])
      }
    }
  }, [value])

  useEffect(() => {
    if (Array.isArray(watch('user_type_id'))) {
      if (watch('user_type_id').includes(3)) {
        // Include employee IDs if user_type_id includes 3

        const ids = userList.flatMap((item) =>
          item.employees
            .filter((employee) => employee.id !== user?.id)
            .map((employee) => employee.id)
        )

        // Use the callback form to ensure you get the updated state
        setSelectedEmployees((prevState) => ids)
      } else {
        // Remove employee IDs if user_type_id does not include 3
        setSelectedEmployees([])
      }
    }
  }, [watch('user_type_id')])

  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    accept,
    maxSize,
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
          {/* <p className='file-name mb-0'>{baseName(file?.url)}</p> */}
          <p className='file-name mb-0'>{baseName(file?.name)}</p>
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
    setUploaded(null)
  }

  const handleCancel = () => {
    controller?.abort()
    setController(new AbortController())
    setProgress(0)
  }

  const handleUpload = () => {
    log(files)
    const userTypeIds = value?.user_type_id ?? watch('user_type_id')

    if (Array.isArray(userTypeIds) && userTypeIds.length > 1) {
      // If userTypeIds is an array with more than one value, call uploadFiles for each value
      userTypeIds.forEach((userTypeId) => {
        const formDataForUserType = {
          is_multiple: 0,
          file_id: oldFiles[0]?.id,
          file: files[0],
          title: oldFiles[0]?.name ?? files[0]?.name,
          store_in_db: 1,
          user_type_id: userTypeId,
          is_for_all: 1,
          status:
            formData.option === '1'
              ? 'private'
              : formData.option === '2'
              ? 'viewOnly'
              : formData.option === '3'
              ? 'sign'
              : undefined,
          employee_id: selectedEmployees,
          folder_id: folderId
        }

        uploadFiles({
          success: (d) => {
            setReload(true)
            setProgress(0)
            setUploaded([d?.payload])
            setFiles([])
            handleClose()
          },
          loading: setLoading,
          progress: setProgress,
          controller,
          formData: formDataForUserType
        })
      })
    } else {
      // Call the function with the original formData
      uploadFiles({
        success: (d) => {
          setReload(true)
          setProgress(0)
          setUploaded([d?.payload])
          setFiles([])
          handleClose()
        },
        loading: setLoading,
        progress: setProgress,
        controller,
        formData: {
          is_multiple: 0,
          file_id: oldFiles[0]?.id,
          file: files[0],
          title: oldFiles[0]?.name ?? files[0]?.name,
          store_in_db: 1,
          user_type_id: userTypeIds,
          is_for_all: userTypeIds === undefined ? 0 : 1,
          status:
            formData.option === '1'
              ? 'private'
              : formData.option === '2'
              ? 'viewOnly'
              : formData.option === '3'
              ? 'sign'
              : undefined,
          employee_id: selectedEmployees,
          folder_id: folderId
        }
      })
    }
  }

  const handleReplace = () => {
    setOldFIles([])
  }

  //emp options
  const loadEmpOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: {
        name: search,
        user_type_id:
          userType === UserTypes.admin || userType === UserTypes.adminEmployee
            ? UserTypes.adminEmployee
            : UserTypes.employee
      }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setEmp, (x) => {
      return decryptObject(forDecryption, x)
    })
  }
  function handleCheckboxChange(value) {
    const currentValues = watch('user_type_id') || []
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    setValue('user_type_id', updatedValues)
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
        <div {...getRootProps({ className: 'dropzone' })}>
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
            <p className='text-size-12 mb-0 text-dark fw-bold'>
              {FM('max-upload-size', { size: renderFileSize(maxSize) })}
            </p>
          </div>
        </div>
      </Hide>
      {oldFiles?.length ? (
        <Fragment>
          <ListGroup className={'my-2'}>{renderOldList}</ListGroup>

          {/* <div className='d-flex justify-content-end mt-2'>
            <Button className='me-1' color='danger' outline onClick={handleReplace}>
              {FM('replace')}
            </Button>
          </div> */}
        </Fragment>
      ) : null}

      {files?.length || uploaded?.length || oldFiles?.length ? (
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
          <Row className='mt-2'>
            {/* <Col md='6'>
              <FormGroupCustom
                noLabel
                placeholder={FM('file-title')}
                name={'title'}
                type={'text'}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{ required: true }}
                value={oldFiles[0]?.name}
              />
            </Col>
            {/* <Hide IF={watch('option') === '1' || watch('option') === '3'}>
              <Col md='3'>
                <FormGroupCustom
                  noLabel
                  isMulti
                  placeholder={FM('user-type')}
                  type={'select'}
                  errors={errors}
                  className='mb-2'
                  control={control}
                  options={createConstSelectOptions(roleType.company, FM)}
                  name={'user_type_id'}
                />
              </Col>
            </Hide> */}
            <Col md='2'>
              <FormGroupCustom
                disabled={value?.signing_files?.length > 0}
                label={'Private'}
                name={'option'}
                type={'radio'}
                errors={errors}
                value={'1'}
                setValue={(value) =>
                  setFormData({ ...formData, option: '1', showCheckboxes: false })
                }
                control={control}
                checked={formData.option === '1'}
              />
            </Col>
            <Col md='2'>
              <FormGroupCustom
                disabled={value?.signing_files?.length > 0}
                label={'View Only'}
                name={'option'}
                type={'radio'}
                errors={errors}
                value={'2'}
                setValue={(value) =>
                  setFormData({ ...formData, option: '2', showCheckboxes: true })
                }
                className='mb-2'
                control={control}
                checked={formData.option === '2'}
              />
            </Col>
            <Hide IF={value?.user_type_id === 6}>
              <Col md='2'>
                <FormGroupCustom
                  label={'Sign'}
                  name={'option'}
                  type={'radio'}
                  errors={errors}
                  value={'3'}
                  setValue={(value) =>
                    setFormData({ ...formData, option: '3', showCheckboxes: false })
                  }
                  control={control}
                  checked={formData.option === '3'}
                />
              </Col>
            </Hide>
          </Row>
          <Row>
            <Show IF={formData?.showCheckboxes && !value?.signing_files}>
              <>
                {options.map((option) => (
                  <Col key={option.value}>
                    <FormGroupCustom
                      name={`user_type_id_${option.value}`}
                      type={'checkbox'}
                      label={`For All ${option.label} (including existing & new)`}
                      classNameLabel={'w-100'}
                      className='mb-2'
                      control={control}
                      rules={{ required: false }}
                      onChangeValue={() => handleCheckboxChange(option.value)}
                      checked={watch('user_type_id')?.includes(option.value) ?? false}
                      forceValue
                      setValue={setValue}
                      value={watch('user_type_id')}
                    />
                  </Col>
                ))}
              </>
            </Show>
          </Row>
          {formData.option === '2' || formData.option === '3' ? (
            <Hide
              IF={
                formData.showCheckboxes === 0 ||
                (Array.isArray(watch('user_type_id')) && watch('user_type_id').includes(3))
              }
            >
              <Row>
                <div>
                  <div className='accordion'>
                    {userList.map((item) => (
                      <Accordian
                        key={item.id}
                        userData={item}
                        fileData={value}
                        setValue={setValue}
                        control={control}
                        watch={watch}
                        setSelectedEmployees={setSelectedEmployees}
                        selectedEmployees={selectedEmployees}
                        // setAllEmployees={
                        //   Array.isArray(watch('user_type_id')) && watch('user_type_id').includes(3)
                        // }
                      />
                    ))}
                  </div>
                </div>
              </Row>
            </Hide>
          ) : null}
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

            {/* <Hide IF={loading || oldFiles?.length <= 0 || files?.length <= 0}>
              <Button onClick={handleUpload} color='primary'>
                {FM('upload')}
              </Button>
            </Hide> */}
            <Show IF={!loading || oldFiles?.length > 0 || files?.length > 0}>
              <Button onClick={handleUpload} color='primary'>
                {value?.id ? FM('Update') : FM('upload')}
              </Button>
            </Show>
          </div>
        </Fragment>
      ) : null}
    </>
  )
}

export default DropZoneCompany
