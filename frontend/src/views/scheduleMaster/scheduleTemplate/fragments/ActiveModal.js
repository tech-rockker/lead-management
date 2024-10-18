// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Alert, Card, Col, Row } from 'reactstrap'
import { getPath } from '../../../../router/RouteHelper'

import {
  addScTemplate,
  changeStatusScTemplate,
  copyScTemplate,
  editScTemplate,
  loadScTemplate,
  viewScTemplate
} from '../../../../utility/apis/scheduleTemplate'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'

import {
  createAsyncSelectOptions,
  ErrorToast,
  formatDate,
  isObjEmpty,
  jsonDecodeAll,
  setValues,
  SuccessToast
} from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'

const defaultValues = {
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
}

const ActiveModal = ({
  status = 1,
  ips = null,
  responseData = () => {},
  edit = null,
  editIpRes = null,
  noView = false,
  ipRes = null,
  showModal = false,
  handleToggle = () => {},
  setShowModal = () => {},
  followId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  // Dispatch
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [id, setId] = useState(null)
  const [ipResponse, setIpResponse] = useState(ipRes)
  const [resLabel, setResLabel] = useState(null)
  const [template, setTemplate] = useState([])
  const [error, setErrors] = useState(null)

  // ** Ref
  const ref = useRef()
  // log(ref)
  // ** State
  const [stepper, setStepper] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // form data
  const formFields = {
    from_date: '',
    to_date: '',
    status: '',
    title: '',
    shifts: 'json'
  }

  const loadTemplateOptions = async (search, loadedOptions, { page }) => {
    const res = await loadScTemplate({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, status: 'active' }
    })

    return createAsyncSelectOptions(res, page, 'title', 'id', setTemplate)
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()

  const loadTemplateOption = async (search, loadedOptions, { page }) => {
    const res = await loadScTemplate({
      async: true,
      page,
      perPage: 50,
      jsonData: { name: search, status: 'active' }
    })

    return createAsyncSelectOptions(res, page, 'title', null, setTemplate)
  }

  useEffect(() => {
    if (followId !== null) {
      // setEditData(followId)
      // setValue("ip_id", followId?.ip_id)
    }
  }, [edit])

  useEffect(() => {
    if (ipRes !== null) {
      setResLabel(ipRes[0])
    }
  }, [ipRes])

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    if (followId === null) setEditData(null)
    setCurrentIndex(0)
  }

  useEffect(() => {
    handleToggle(open)
  }, [open])

  const handleSave = (data) => {
    // log(data)
    if (isValid(edit?.id)) {
      changeStatusScTemplate({
        id: edit?.id,
        jsonData: { replacing_template_id: data?.replacing_template_id, status },
        loading: setLoading,
        dispatch,
        success: (d) => {
          SuccessToast('activated')
          responseData(d?.payload)
          handleModal()
        },
        error: (e) => {
          log('e', e)
          if (isValidArray(e?.data?.message)) {
            setErrors(e?.data?.message)
          }
        }
      })
    } else {
      ErrorToast('selected-template-id-not-found')
      // addScTemplate({
      //     jsonData: {
      //         ...data,
      //         status: 0
      //     },
      //     loading: setLoading,
      //     // dispatch,
      //     success: (d) => {
      //         responseData(d?.payload)
      //         SuccessToast("done")
      //         handleModal()

      //     }
      // })
    }
  }

  const onSubmit = (d) => {
    if (isObjEmpty(errors)) {
      handleSave(d)
    }
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  // useEffect(() => {
  //     if (open === true && id) loadDetails()

  // }, [open, id])

  // useEffect(() => {
  //     loadDetails()
  // }, [id])

  useEffect(() => {
    setId(followId)
  }, [followId])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    setIpResponse(ipRes)
  }, [ipRes])

  const r = (Math.random() + 1).toString(36).substring(7)
  return (
    <>
      <CenteredModal
        done={status === 1 ? 'activate' : 'inactivate'}
        scrollControl={false}
        title={
          <>
            {status === 1 ? FM('activate-template') : FM('inactivate-template')} : {edit?.title}
          </>
        }
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-md'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className='p-1 m-0'>
          <Row className='m-0 gx-0'>
            <Show IF={isValid(error)}>
              <Col md='12'>
                <Alert color='danger' className='p-1'>
                  {`${FM(
                    'there-is-an-active-schedule-exist-please-change-the-schedule-before-activating-this-template'
                  )}`}
                  <ul className='mt-1'>
                    {error?.map((d, i) => {
                      return (
                        <>
                          <li key={`alert-${i}`} color='danger' className='fw-bold m-0'>
                            {`${FM('schedule-exits-on-date-of-employee', {
                              employee: d?.emp_name ?? 'employee',
                              date: formatDate(d?.start_time, 'YYYY-MM-DD'),
                              start: formatDate(d?.start_time, 'HH:mm'),
                              end: formatDate(d?.end_time, 'HH:mm')
                            })}`}
                            <br />
                            <Link
                              target={'_blank'}
                              to={{
                                pathname: getPath('schedule.calender.view', {
                                  id: d?.schedule_template_id
                                }),
                                state: { data: { title: d?.schedule_template_name } }
                              }}
                            >
                              ({FM('view-template')} {d?.schedule_template_name})
                            </Link>
                          </li>
                        </>
                      )
                    })}
                  </ul>
                </Alert>
              </Col>
            </Show>
            <Col md='12'>
              <Hide IF={status === 0}>
                <Alert color='primary' className='p-1'>
                  {FM(
                    'you-can-choose-a-template-to-replace-it-will-replace-the-selected-template-with-this-template'
                  )}{' '}
                  {edit?.title}
                </Alert>
              </Hide>
              <Show IF={status === 0}>
                <Alert color='primary' className='p-1'>
                  {FM('please-note-that-you-can-not-reactivate-this-template')}
                </Alert>
              </Show>
            </Col>
            <Hide IF={status === 0}>
              <Col md='12'>
                <FormGroupCustom
                  noLabel
                  key={`fcdbdsfgsgfs-${edit?.template_id}`}
                  async
                  defaultOptions
                  // value={edit?.id}
                  control={control}
                  // rules={{ required: true }}
                  // errors={errors}
                  //isMulti
                  //  onChange={multiSelectHandle}
                  /////
                  type={'select'}
                  errors={errors}
                  name={'replacing_template_id'}
                  isClearable
                  //matchWith="id"
                  cacheOptions
                  loadOptions={loadTemplateOption}
                  options={template}
                  placeholder={FM('select-template')}
                  rules={{ required: false }}
                  className='mb-0'
                />
              </Col>
            </Hide>
          </Row>
        </div>
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}

export default ActiveModal
