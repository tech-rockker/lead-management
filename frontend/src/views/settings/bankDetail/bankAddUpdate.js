import '@styles/react/apps/app-users.scss'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'
import { addBank, editBank, viewBank } from '../../../utility/apis/banks'
import { FM, isValid } from '../../../utility/helpers/common'
import { isObjEmpty, setValues } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import Shimmer from '../../components/shimmers/Shimmer'

const BankAddUpdate = ({
  isEdit = false,
  edit = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  bankId = null,
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
  const [open, setOpen] = useState(false)
  const [load, setLoad] = useState(true)

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    if (bankId === null) setEditData(null)
  }

  const submitData = (jsonData) => {
    if (editData && !isObjEmpty(editData)) {
      editBank({
        jsonData: {
          ...jsonData
        },
        id: bankId,
        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
        }
      })
    } else {
      addBank({
        jsonData: {
          ...jsonData
        },
        loading: setLoading,
        dispatch,
        success: () => {
          setOpen(false)
          handleModal(false)
        }
      })
    }
  }

  const fields = {
    bank_name: '',
    account_number: '',
    clearance_number: ''
  }

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewBank({
        id,
        loading: setLoad,
        success: (d) => {
          setValues(fields, d?.payload, setValue)
          setEditData(d?.payload)
        }
      })
    }
  }

  useEffect(() => {
    if (!isValid(bankId)) {
      reset()
    }
    if (isValid(bankId)) {
      loadDetails(bankId)
    }
  }, [bankId])

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  console.log('fgfdg fdg', editData)

  return (
    <>
      <CenteredModal
        title={editData ? FM('edit-bankDetail') : FM('create-bankDetail')}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-lg'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(submitData)}
      >
        {load && isEdit ? (
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
                  label={'bank-name'}
                  name={'bank_name'}
                  type={'text'}
                  errors={errors}
                  values={editData}
                  className='mb-2'
                  control={control}
                  rules={{ required: true }}
                />

                <FormGroupCustom
                  key={`NAME${edit}`}
                  label={'account-number'}
                  name={'account_number'}
                  type={'text'}
                  errors={errors}
                  values={editData}
                  className='mb-2'
                  control={control}
                  rules={{ required: true }}
                />

                <FormGroupCustom
                  key={`NAME${edit}`}
                  name={'clearance_number'}
                  type={'text'}
                  errors={errors}
                  label={FM('clearance-number')}
                  className='mb-2'
                  control={control}
                  rules={{ required: true }}
                  values={editData}
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
export default BankAddUpdate
