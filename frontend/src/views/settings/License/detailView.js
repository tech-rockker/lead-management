import '@styles/react/apps/app-users.scss'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Calendar, Database, Gift, Key, User } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Card, CardBody, Col, Form, Row } from 'reactstrap'
import { viewEmailTemplate } from '../../../utility/apis/emailTemplate'
import { viewLicense } from '../../../utility/apis/licenseApis'
import { FM, isValid } from '../../../utility/helpers/common'
import {
  addDay,
  formatDate,
  JsonParseValidate,
  setValues,
  truncateText
} from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import Shimmer from '../../components/shimmers/Shimmer'

const LicenseDetailView = ({
  edit = null,
  noView = false,
  showModals = false,
  setShowModals = () => {},
  licenseId = null,
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
    if (licenseId === null) setEditData(null)
  }

  const formFields = {
    user_id: edit?.top_most_parent_id,
    licence_key: '',
    licence_end_date: '',
    package_id: '',
    modules: '',
    module_attached: 'json',
    package_details: 'json',
    expire_at: ''
  }

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewLicense({
        id,
        loading: setLoad,
        success: (d) => {
          setValues(formFields, d, setValue)
          setEditData(d)
        }
      })
    }
  }

  useEffect(() => {
    if (!isValid(licenseId)) {
      reset()
    }
    if (isValid(licenseId)) {
      loadDetails(licenseId)
    }
  }, [licenseId])

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (showModals) handleModal()
  }, [showModals])

  return (
    <>
      <CenteredModal
        title={FM('view-licence-details')}
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
              <Col md='12' className='d-flex align-items-stretch'>
                <Card>
                  <CardBody>
                    <Row>
                      <Col md='12'>
                        <Shimmer style={{ height: 40 }} />
                      </Col>
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
            <CardBody className=''>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('company')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <User size={14} /> {editData?.company?.branch_name}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('licence-key')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Key size={14} /> {editData?.licence_key}
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('module')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Gift size={14} />{' '}
                      <>
                        {truncateText(
                          editData?.module?.map((a) => a?.name),
                          40
                        )}
                      </>
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('packages')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Database size={14} /> {JsonParseValidate(editData?.package_details)?.name}
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('active-from')}</p>
                  <p className='mb-0 fw-bolder text-truncate'>
                    <a className='text-primary'>
                      <Calendar size={14} /> {formatDate(editData?.active_from, 'DD MMMM, YYYY')}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('expired-at')}</p>
                  <p className='mb-0 fw-bolder text-truncate'>
                    <a className='text-primary'>
                      <Calendar size={14} /> {formatDate(editData?.expire_at, 'DD MMMM, YYYY')}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('is-used')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <Gift size={14} />{' '}
                    <a
                      className={classNames('mb-0 fw-bold', {
                        'text-success': editData?.is_used === 1,
                        'text-danger': editData?.is_used === 0
                      })}
                    >
                      {' '}
                      <>{editData?.is_used === 1 ? 'Yes' : 'No'}</>
                    </a>
                  </p>
                </Col>
              </Row>
            </CardBody>
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
export default LicenseDetailView
