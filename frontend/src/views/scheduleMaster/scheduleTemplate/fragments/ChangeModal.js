// ** Custom Components
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Card, Col, Row } from 'reactstrap'

import {
  addScTemplate,
  copyScTemplate,
  editScTemplate,
  loadScTemplate,
  viewScTemplate
} from '../../../../utility/apis/scheduleTemplate'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'

import {
  createAsyncSelectOptions,
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

const ChangeModal = ({
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
      perPage: 5,
      jsonData: { name: search }
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
    log(data)
    if (isValid(edit?.id)) {
      copyScTemplate({
        jsonData: {
          old_template_id: edit?.id,
          new_template_name: data?.new_template_name,
          new_template_id: null
          // replace_data: watch("replace_data") === 1 ? "yes" : "no"
        },
        id: edit?.id,
        loading: setLoading,
        dispatch,
        success: (d) => {
          // SuccessToast("copy")
          responseData(d?.payload)
          handleModal()
        }
      })
    } else {
      addScTemplate({
        jsonData: {
          ...data,
          status: 0
        },
        loading: setLoading,
        // dispatch,
        success: (d) => {
          responseData(d?.payload)
          // SuccessToast("done")
          handleModal()
        }
      })
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
        scrollControl={false}
        title={
          <>
            {FM('create-a-copy')} : {edit?.title}{' '}
          </>
        }
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-sm'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(onSubmit)}
      >
        <div className='p-0 m-0'>
          <Row className='m-2'>
            <Col md={12}>
              <FormGroupCustom
                name={'new_template_name'}
                type={'text'}
                errors={errors}
                label={FM('new-template-name')}
                className='mb-0'
                control={control}
                setValue={setValue}
                rules={{ required: true }}
                value={`${edit?.title} copy`}
              />
            </Col>
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

export default ChangeModal
