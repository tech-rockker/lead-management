import React, { useEffect, useState } from 'react'
import { Star } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Row, Spinner } from 'reactstrap'

import {
  getSamplelanguage,
  languageEdit,
  language_Import
} from '../../../utility/apis/languageLabel'
import { FM, isValid } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

export default function ImportLangModal({
  responseData = () => {},
  edit = null,
  noView = false,
  showModal = false,
  setReload = () => {},
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) {
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingSample, setLoadingSample] = useState(false)
  const [user, setUser] = useState([])
  const dispatch = useDispatch()
  const form = useForm({
    option: null
  })
  const [response, setResponse] = useState(null)
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form

  const handleModal = () => {
    reset()
    setOpen(!open)
    setShowModal(!open)
    if (edit === null) setEditData(null)
  }
  const handleClose = (from = null) => {
    handleModal()
  }
  const sampleBooking = () => {
    getSamplelanguage({
      loading: setLoadingSample,
      success: (e) => {
        window.open(e?.url, '_blank')
      }
    })
  }

  useEffect(() => {
    setEditData(edit)
  }, [editData])

  const handleSave = (form) => {
    if (isValid(editData?.id)) {
      languageEdit({
        jsonData: {
          ...form,
          title: form?.language_title,
          value: form?.language_value,
          file: form?.file[0],
          status: editData?.status
        },
        id: editData?.id,
        loading: setLoading,
        dispatch,
        success: (data) => {
          setReload(true)
          // SuccessToast('language-moved-to-update')
          responseData(data?.payload)
          handleModal()
        }
      })
    } else if (!isValid(editData?.id)) {
      language_Import({
        formData: {
          ...form,
          //  activity_id: edit?.id,
          //  status: form?.option === "1" || form?.option === "2" || form?.option === "3" ? 1 : 2,
          // question: null
          file: form?.file[0]
          //id: isValid(edit?.id) ? edit?.id : ""
        },
        // id : edit?.id,
        loading: setLoading,
        dispatch,
        success: (data) => {
          setReload(true)
          // SuccessToast('language-moved-to-done')
          responseData(data?.payload)
          handleModal()
        }
      })
    }
  }
  //  disableSave={isValid(watch('option'))}
  return (
    <>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        disableSave={false}
        loading={loading}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('import-language')}
      >
        <CardBody>
          <Row>
            <div className='text-center mt-1'>
              <Star size={20} />
              <p className='mt-1 text-small-12'>
                {' '}
                {FM(
                  'Please-download-this-csv-file-and-fill-all-the-details-accordingly.-After-that-you-can-upload-the-file-to-import-your-items.'
                )}
              </p>
            </div>
            <div className='text-center text-warning mb-1 text-bolder'>
              {loadingSample ? (
                <div className='loader-top me-2 '>
                  <span className='spinner'>
                    <Spinner color='primary' animation='border' size={'xl'}>
                      <span className='visually-hidden'>Loading...</span>
                    </Spinner>
                  </span>
                </div>
              ) : (
                <u onClick={sampleBooking} style={{ cursor: 'pointer' }}>
                  {' '}
                  {FM('download-sample-file')}{' '}
                </u>
              )}
            </div>
          </Row>
          <Row className='mt-1 border-top pt-2'>
            <Col md='6'>
              <FormGroupCustom
                label={'language-name'}
                name={'language_title'}
                type={'text'}
                value={editData?.title}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{ required: true }}
              />
            </Col>
            <Col md='6'>
              <FormGroupCustom
                label={'language-short-name'}
                name={'language_value'}
                type={'text'}
                value={editData?.value}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{ required: true }}
              />
            </Col>
            <Col md='12'>
              <FormGroupCustom
                label={'language-file'}
                name={'file'}
                type={'file'}
                errors={errors}
                noGroup
                className='mb-2'
                control={control}
                rules={{ required: false }}
              />
            </Col>
          </Row>
        </CardBody>
      </CenteredModal>
    </>
  )
}
