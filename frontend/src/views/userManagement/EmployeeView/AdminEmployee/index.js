// ** React Imports
// ** Custom Components
import { SecurityOutlined } from '@material-ui/icons'
import { Fragment, useEffect, useState } from 'react'
import { Edit, Eye } from 'react-feather'
// ** Reactstrap Imports
import { Badge, Button, Card, CardBody, Col, Label, ListGroupItem, Row } from 'reactstrap'
import { viewUser } from '../../../../utility/apis/userManagement'
import { forDecryption, userFields } from '../../../../utility/Const'
import { FM, isValid, isValidArray } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import { decrypt, decryptObject, getGenderImage, jsonDecodeAll } from '../../../../utility/Utils'
import Shimmer from '../../../components/shimmers/Shimmer'
import BsTooltip from '../../../components/tooltip'

const UserInfoCard = ({ selectedUser = null, userId = null, setUserData = () => {} }) => {
  const [user, setUser] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [addPatient, setAddPatient] = useState(false)

  useEffect(() => {
    if (selectedUser !== null) {
      setLoadingDetails(false)
      setUser(selectedUser)
    }
  }, [selectedUser])

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewUser({
        id,
        loading: setLoadingDetails,
        success: (d) => {
          const s = {
            ...d,
            country_id: d?.country?.id ?? '',
            patient_type_id: typeof d?.patient_type_id === 'object' ? d?.patient_type_id : [],
            ...d?.patient_information,
            id: d?.patient_information?.patient_id
          }
          const valuesTemp = jsonDecodeAll(userFields, s)
          const values = {
            ...valuesTemp,
            branch: decryptObject(forDecryption, valuesTemp?.branch)
          }
          setUser({
            ...values
          })
          setUserData(values)
        }
      })
    }
  }

  useEffect(() => {
    loadDetails(userId)
  }, [userId])

  const oldFiles = isValidArray(user?.documents) ? user?.documents : []
  function checkURL(url) {
    return String(url).match(/\.(jpeg|jpg|gif|png)$/) !== null
  }

  const renderOldFilePreview = (file) => {
    if (checkURL(file?.file_url)) {
      return (
        <img className='rounded' alt={file.file_name} src={file?.file_url} height='28' width='28' />
      )
    } else {
      return <FileText url={file?.file_url} size='28' />
    }
  }
  function baseName(str) {
    let base = new String(str)?.substring(str?.lastIndexOf('/') + 1)
    if (base?.lastIndexOf('.') !== -1) base = base?.substring(0, base?.lastIndexOf('.'))
    return base
  }

  return (
    <Fragment>
      <Card className='white mb-0 h-100'>
        <CardBody>
          <Show IF={loadingDetails}>
            <div className='user-avatar-section  mb-2 pb-2 border-bottom'>
              <div className='d-flex align-items-center flex-column'>
                <Shimmer
                  className='mb-2 mt-2 shadow rounded-circle'
                  style={{ width: 55, height: 55 }}
                />

                <div className='d-flex flex-column align-items-center text-center'>
                  <div className='user-info'>
                    <h4 className='text-capitalize'>
                      <Shimmer
                        style={{
                          width: 150,
                          height: 5,
                          marginBottom: 5
                        }}
                      />
                      <Shimmer style={{ width: 150, height: 5 }} />
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className='info-container'>
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <span className='fw-bolder text-dark me-25'>Personal No:</span>
                  <span className='d-block'>
                    <Shimmer style={{ width: 200, height: 20 }} />
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder text-dark me-25'>Patient ID:</span>
                  <span className='d-block'>
                    <Shimmer style={{ width: 200, height: 20 }} />
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder text-dark me-25'>Email:</span>
                  <span className='d-block'>
                    <Shimmer style={{ width: 200, height: 20 }} />
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder text-dark me-25'>Contact Number:</span>
                  <span className='d-block'>
                    <Shimmer style={{ width: 200, height: 20 }} />
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder text-dark me-25'>{FM('full-address')}:</span>
                  <span className='d-block'>
                    <Shimmer style={{ width: 200, height: 20 }} />
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder text-dark me-25'>{FM('full-address')}:</span>
                  <span className='d-block'>
                    <Shimmer style={{ width: 200, height: 20 }} />
                  </span>
                </li>
              </ul>
            </div>
          </Show>
          <Hide IF={loadingDetails}>
            <div className='user-avatar-section  mb-2 pb-2 border-bottom'>
              <div className='d-flex align-items-center flex-column'>
                <img
                  className='mb-2 mt-2 shadow rounded-circle'
                  src={user?.avatar}
                  style={{ width: 55, height: 55 }}
                />

                <div className='d-flex flex-column align-items-center text-center'>
                  <div className='user-info'>
                    <h4 className='text-capitalize'>
                      {user !== null ? user?.name : 'Eleanor Aguilar'}{' '}
                      <Show IF={user?.is_secret}>
                        <BsTooltip title={FM('secret-patient')}>
                          <SecurityOutlined
                            style={{ width: 18, height: 18, marginTop: -3 }}
                            className={'text-danger'}
                          />
                        </BsTooltip>
                      </Show>
                    </h4>
                    <p
                      className='mb-0'
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 3,
                        backgroundColor: user?.user_color,
                        width: 100,
                        height: 5,
                        borderRadius: 8
                      }}
                    ></p>
                    <p className='m-0 text-capitalize'>{user?.gender}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {user !== null ? (
                <CardBody className='border-bottom'>
                  <Row className='d-flex justify-content-between align-items-stretch gy-2'>
                    {/* <Col md="6">
                                            <p className='mb-0 text-dark fw-bolder'>
                                                {FM("company-type")}
                                            </p>
                                            <p className='mb-0 fw-bold text-secondary'>
                                                {user?.company_types?.map(a => a.name) ?? 'N/A'}
                                            </p>
                                        </Col> */}
                    {/* <Col md="6">
                                            <p className='mb-0 h5 text-dark fw-bolder'>
                                                {FM("branch")}
                                            </p>
                                            <p className='mb-0 fw-bold text-secondary'> {decrypt(user?.branch?.name)} </p>
                                        </Col> */}
                    <Col md='6'>
                      <p className='mb-0 text-dark fw-bolder'>{FM('email')}</p>
                      <p className='mb-0 fw-bold text-secondary'>{user?.email}</p>
                    </Col>
                    <Col md='6'>
                      <p className='mb-0 text-dark fw-bolder'>{FM('contact-number')}</p>
                      <p className='mb-0 fw-bold text-secondary'>{user?.contact_number}</p>
                    </Col>
                    <Col md='6'>
                      <p className='mb-0 text-dark fw-bolder'>{FM('personal-number')}</p>
                      <p className='mb-0 fw-bold text-secondary'>{user?.personal_number}</p>
                    </Col>
                    <Col md='6'>
                      <p className='mb-0 text-dark fw-bolder'>{FM('employee-id')}</p>
                      <p className='mb-0 fw-bold text-secondary text-uppercase'>
                        {user?.unique_id}
                      </p>
                    </Col>
                    <Col md='6'>
                      <p className='mb-0 text-dark fw-bolder'>{FM('full-address')}</p>
                      <p className='mb-0 fw-bold text-secondary'>{user?.full_address}</p>
                    </Col>
                    <Col md='6'>
                      <p className='mb-0 text-dark fw-bolder'>{FM('city')}</p>
                      <p className='mb-0 fw-bold text-secondary'>{user?.city}</p>
                    </Col>
                    <Col md='6'>
                      <p className='mb-0 text-dark fw-bolder'>{FM('postal-area')}</p>
                      <p className='mb-0 fw-bold text-secondary'>{user?.postal_area}</p>
                    </Col>
                    <Col md='6'>
                      <p className='mb-0 text-dark fw-bolder'>{FM('postal-code')}</p>
                      <p className='mb-0 fw-bold text-secondary'>{user?.zipcode ?? 'N/A'}</p>
                    </Col>
                  </Row>
                </CardBody>
              ) : null}
            </div>
          </Hide>
        </CardBody>
        <CardBody className='mt-0'>
          <div>
            <Hide IF={isValidArray(oldFiles)}>
              <div className='p-2 text-center'>{FM('no-documents')}</div>
            </Hide>
            <p className='mb-1 text-dark fw-bolder'>{FM('document')}</p>
            {oldFiles?.map((file, index) => (
              <ListGroupItem
                key={`${file.name}-${index}`}
                className='d-flex align-items-center justify-content-between mb-1'
              >
                <div className='file-details d-flex align-items-center'>
                  <div className='file-preview me-1'>{renderOldFilePreview(file)}</div>
                  <div>
                    <p className='file-name mb-0'>{file?.file_name}</p>
                  </div>
                </div>
                <div>
                  <BsTooltip
                    Tag={Button}
                    title={FM('view')}
                    color='primary'
                    outline
                    size='sm'
                    className='btn-icon'
                    onClick={() => {
                      window.open(file?.file_url, '_blank')
                    }}
                  >
                    <Eye size={14} />
                  </BsTooltip>
                </div>
              </ListGroupItem>
            ))}
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserInfoCard
