// // ** Third Party Components
// ** Custom Components
import Avatar from '@components/avatar'
import '@styles/react/apps/app-users.scss'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Calendar, Edit, Home, Mail, Phone, Users } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
// ** Third Party Components
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardText,
  Col,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { getPath } from '../../router/RouteHelper'
import { viewComp } from '../../utility/apis/companyApis'
import { viewUser } from '../../utility/apis/userManagement'
import { UserTypes } from '../../utility/Const'
import { FM, isValid, log } from '../../utility/helpers/common'
import { Permissions } from '../../utility/Permissions'
import Shimmer from '../components/shimmers/Shimmer'
import BsTooltip from '../components/tooltip'
import UserModal from './fragment/UserModal'
const UserManagementDetails = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const [companyData, setCompanyData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const id = parseInt(params.id)

  const loadDetails = () => {
    viewUser({
      id,
      loading: setLoading,
      success: setCompanyData
    })
  }
  const handleClose = (e) => {
    if (e === false) {
      setEdit(null)
      setShowModal(false)
    }
  }
  useEffect(() => {
    if (!isValid(companyData)) {
      loadDetails()
    }
  }, [companyData])

  // ** React Imports
  // ** render user img
  const renderUserImg = () => {
    // if (loaddata !== null) {
    //     return <img alt='user-avatar' className='img-fluid rounded' height='104' width='104' />
    // } else {
    const stateNum = Math.floor(Math.random() * 6),
      states = [
        'light-success',
        'light-danger',
        'light-warning',
        'light-info',
        'light-primary',
        'light-secondary'
      ],
      color = states[stateNum]
    return (
      <Avatar
        initials
        color={color}
        className='rounded'
        content={companyData?.name ?? 'A'}
        contentStyles={{
          borderRadius: 0,
          fontSize: 'calc(36px)',
          width: '100%',
          height: '100%'
        }}
        style={{
          height: '90px',
          width: '90px'
        }}
      />
    )
  }

  return (
    <>
      {loading ? (
        <Card className={classNames('animate__animated animate__bounceIn')}>
          <CardBody>
            <Row>
              <Col
                md='4'
                lg='4'
                sm='6'
                className='d-flex flex-column justify-content-between border-container-lg'
              >
                <div className='user-avatar-section'>
                  <div className='d-flex justify-content-start'>
                    <Shimmer style={{ width: 100, height: 100 }} />
                    <div className='flex-1 ms-1'>
                      <div className='mb-1'>
                        <Shimmer style={{ minHeight: 15, width: '100%' }} />
                        <Shimmer style={{ minHeight: 15, width: '50%', marginTop: 15 }} />
                      </div>
                      <div className='d-flex flex-wrap align-items-center'>
                        <Shimmer style={{ minHeight: 40, width: 40 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md='4' lg='4' sm='6' className='mt-2 mt-xl-0'>
                <Shimmer style={{ minHeight: 15, width: '100%', marginBottom: 15 }} />
                <Shimmer style={{ minHeight: 15, width: '80%', marginBottom: 15 }} />
                <Shimmer style={{ minHeight: 15, width: '50%', marginBottom: 15 }} />
              </Col>
              <Col md='4' lg='4' sm='6' className='mt-2 mt-xl-0'>
                <Shimmer style={{ minHeight: 15, width: '100%', marginBottom: 15 }} />
                <Shimmer style={{ minHeight: 15, width: '80%', marginBottom: 15 }} />
                <Shimmer style={{ minHeight: 15, width: '50%', marginBottom: 15 }} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      ) : (
        <Card className={classNames('animate__animated animate__bounceIn')}>
          <UserModal
            showModal={showModal}
            setShowModal={handleClose}
            userType={UserTypes.patient}
            userId={companyData?.id}
            noView
          />
          <CardBody>
            <Row>
              <Col
                md='4'
                lg='4'
                sm='6'
                className='d-flex flex-column justify-content-between border-container-lg'
              >
                <div className='user-avatar-section'>
                  <div className='d-flex justify-content-start'>
                    {/* {renderUserImg()} */}
                    <div className='d-flex flex-column ms-1'>
                      <ButtonGroup color='primary'>
                        <Show IF={Permissions.employeesEdit}>
                          <BsTooltip
                            title={FM('edit')}
                            className='ms-1'
                            Tag={Link}
                            onClick={() => {
                              setShowModal(!showModal)
                              setEdit(companyData)
                            }}
                            role={'button'}
                          >
                            <Edit />
                          </BsTooltip>
                        </Show>
                      </ButtonGroup>
                    </div>
                    <div className='d-flex flex-column ms-1'>
                      <div className='user-info mb-1'>
                        <h4 className='mb-0'>
                          {companyData !== null ? companyData?.name : 'Eleanor Aguilar'}
                        </h4>
                      </div>
                      {/* <div className='d-flex flex-wrap align-items-center'>
                                                <Mail size="18" />:
                                                <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                                                    {companyData?.email}
                                                </CardText>

                                            </div>
                                            <div className='d-flex flex-wrap align-items-center'>
                                                <UncontrolledTooltip target={`grid-edit-${companyData?.id}`} autohide={true}>
                                                    {FM(`edit`)}
                                                </UncontrolledTooltip>
                                                <Link className='primary' to={{ pathname: getPath('users.employees.update', { id: companyData?.id }) }} role={"button"} id={`grid-edit-${companyData?.id}`} >
                                                    <Edit size="18" />
                                                </Link>
                                            </div> */}
                    </div>
                  </div>
                </div>
              </Col>
              <Col md='4' lg='4' sm='6' className='mt-2 mt-xl-0'>
                <div className='user-info-wrapper'>
                  <div className='d-flex flex-wrap align-items-center my-50'>
                    <div className='user-info-title'>
                      <Users className='me-1' size={14} />
                      <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                        {FM('gender')}
                      </CardText>
                    </div>
                    <CardText className='text-capitalize mb-0'>:{companyData?.gender}</CardText>
                  </div>
                  <div className='d-flex flex-wrap align-items-center my-50'>
                    <div className='user-info-title'>
                      <Mail className='me-1' size={14} />
                      <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                        {FM('zipcode')}
                      </CardText>
                    </div>
                    <CardText className='text-capitalize mb-0'>:{companyData?.zipcode}</CardText>
                  </div>
                  <div className='d-flex flex-wrap align-items-center'>
                    <div className='user-info-title'>
                      <Phone className='me-1' size={14} />
                      <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                        {FM('contact')}
                      </CardText>
                    </div>
                    <CardText className='mb-0'>
                      :{companyData !== null ? companyData?.contact_number : '(123) 456-7890'}
                    </CardText>
                  </div>
                  <div className='d-flex flex-wrap align-items-center'>
                    <div className='user-info-title'>
                      <Home className='me-1' size={14} />
                      <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                        {FM('full_address')}
                      </CardText>
                    </div>
                    <CardText className='mb-0'>
                      :{companyData !== null ? companyData?.full_address : '(123) 456-7890'}
                    </CardText>
                  </div>
                </div>
              </Col>
              <Col md='4' lg='4' sm='6' className='mt-2 mt-xl-0'>
                <div className='user-info-wrapper'>
                  <div className='d-flex flex-wrap align-items-center my-50'>
                    <div className='user-info-title'>
                      <Calendar className='me-1' size={14} />
                      <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                        {FM('joining_date')}
                      </CardText>
                    </div>
                    <CardText className='text-capitalize mb-0'>
                      : {companyData?.joining_date}
                    </CardText>
                  </div>
                  <div className='d-flex flex-wrap align-items-center my-50'>
                    <div className='user-info-title'>
                      <Calendar className='me-1' size={14} />
                      <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                        {FM('establishment_date')}
                      </CardText>
                    </div>
                    <CardText className='text-capitalize mb-0'>
                      : {companyData?.establishment_date}
                    </CardText>
                  </div>
                  <div className='d-flex flex-wrap align-items-center'>
                    <div className='user-info-title'>
                      <Phone className='me-1' size={14} />
                      <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                        {FM('organization_number')}
                      </CardText>
                    </div>
                    <CardText className='mb-0'>
                      : {companyData !== null ? companyData?.organization_number : '(123) 456-7890'}
                    </CardText>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}
    </>
  )
}

export default UserManagementDetails
