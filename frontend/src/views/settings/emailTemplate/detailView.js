import '@styles/react/apps/app-users.scss'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'
import { viewEmailTemplate } from '../../../utility/apis/emailTemplate'
import { FM, isValid } from '../../../utility/helpers/common'
import { setValues } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import Shimmer from '../../components/shimmers/Shimmer'

const DetailView = ({
  edit = null,
  noView = false,
  showModals = false,
  setShowModals = () => {},
  emailTemplateId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const dispatch = useDispatch()
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch
  } = form
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [editData, setEditData] = useState(null)
  const [open, setOpen] = useState(null)
  const [load, setLoad] = useState(true)

  const handleModal = () => {
    setOpen(!open)
    setShowModals(!open)
    reset()
    if (emailTemplateId === null) setEditData(null)
  }

  const fields = {
    mail_sms_for: '',
    mail_subject: '',
    mail_body: '',
    sms_body: '',
    notify_body: '',
    custom_attributes: ''
  }

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewEmailTemplate({
        id,
        loading: setLoad,
        success: (d) => {
          setValues(fields, d, setValue)
          setEditData(d)
        }
      })
    }
  }

  useEffect(() => {
    if (!isValid(emailTemplateId)) {
      reset()
    }
    if (isValid(emailTemplateId)) {
      loadDetails(emailTemplateId)
    }
  }, [emailTemplateId])

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (showModals) handleModal()
  }, [showModals])

  return (
    <>
      <CenteredModal
        title={FM('view-emailTemplate')}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-lg'}
        open={open}
        handleModal={handleClose}
        disableFooter
      >
        {load ? (
          <>
            <Row>
              <Col md='8' className='d-flex align-items-stretch'>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md='6'>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col md='6'>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col md='12' className='mt-2'>
                        <Shimmer style={{ height: 320 }} />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col md='4' className='d-flex align-items-stretch'>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md='12'>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
                      <Col md='12' className='mt-2'>
                        <Shimmer style={{ height: 320 }} />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Form>
              <div className='p-2'>
                <FormGroupCustom
                  key={`NAME${edit}`}
                  label={'mail-for'}
                  name={'mail_sms_for'}
                  type={'text'}
                  errors={errors}
                  values={editData}
                  className='pointer-events-none mb-2'
                  control={control}
                  rules={{ required: true }}
                />

                <FormGroupCustom
                  key={`NAME${edit}`}
                  label={'mail-subject'}
                  name={'mail_subject'}
                  type={'text'}
                  errors={errors}
                  values={editData}
                  className='pointer-events-none mb-2'
                  control={control}
                  rules={{ required: true }}
                />

                <FormGroupCustom
                  key={`NAME${edit}`}
                  name={'mail_body'}
                  type={'textarea'}
                  errors={errors}
                  label={FM('mail-body')}
                  className='pointer-events-none mb-2'
                  control={control}
                  rules={{ required: true }}
                  values={editData}
                />

                <FormGroupCustom
                  key={`NAME${edit}`}
                  name={'notify_body'}
                  type={'text'}
                  label={FM('notify-body')}
                  errors={errors}
                  className='pointer-events-none mb-2'
                  control={control}
                  rules={{ required: false }}
                  values={editData}
                />

                <FormGroupCustom
                  key={`NAME${edit}`}
                  label={'custom-attributes'}
                  name={'custom_attributes'}
                  type={'text'}
                  errors={errors}
                  values={editData}
                  className='pointer-events-none mb-2'
                  control={control}
                  rules={{ required: false }}
                />
              </div>
            </Form>
          </>
        )}
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}
export default DetailView
