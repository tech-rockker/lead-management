import '@styles/react/apps/app-users.scss'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'
import { viewBank } from '../../../utility/apis/banks'
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
  const [open, setOpen] = useState(null)
  const [load, setLoad] = useState(true)

  const handleModal = () => {
    setOpen(!open)
    setShowModals(!open)
    reset()
    if (bankId === null) setEditData(null)
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
    console.log(bankId)
  }, [bankId])

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (showModals) handleModal()
  }, [showModals])

  return (
    <>
      <CenteredModal
        title={FM('view-bankDetail')}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-md'}
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
            <CardBody>
              <Row>
                <Col md='12'>
                  <div className='mb-2'>
                    <div className='h6 '>{FM('bank-name')}</div>
                    <p className=''> {editData?.bank_name} </p>
                  </div>
                </Col>
                <Col md='12'>
                  <div className='mb-2'>
                    <div className='h6 '>{FM('account-number')}</div>
                    <p className=''> {editData?.account_number} </p>
                  </div>
                </Col>
                <Col md='12'>
                  <div className='mb-2'>
                    <div className='h6 '>{FM('clearance-number')}</div>
                    <p className=''> {editData?.clearance_number} </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
            {/* <Form>
                        <div className='p-2'>
                            <FormGroupCustom
                                key={`NAME${edit}`}
                                label={"bank-name"}
                                name={"bank_name"}
                                type={"text"}
                                errors={errors}
                                values={editData}
                                className="pointer-events-none mb-2"
                                control={control}
                                rules={{ required: true }} />

                            <FormGroupCustom
                                key={`NAME${edit}`}
                                label={"account-number"}
                                name={"account_number"}
                                type={"text"}
                                errors={errors}
                                values={editData}
                                className="pointer-events-none mb-2"
                                control={control}
                                rules={{ required: true }} />

                            <FormGroupCustom
                                key={`NAME${edit}`}
                                name={"clearance_number"}
                                type={"text"}
                                errors={errors}
                                label={FM("clearance-number")}
                                className="pointer-events-none mb-2"
                                control={control}
                                rules={{ required: true }}
                                values={editData} />

                        </div>
                    </Form> */}
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
