// ** React Imports
// ** Custom Components
import { SecurityOutlined } from '@material-ui/icons'
import { Fragment, useEffect, useState } from 'react'
import { Edit } from 'react-feather'
// ** Reactstrap Imports
import { Badge, Card, CardBody } from 'reactstrap'
import { viewUser } from '../../../../utility/apis/userManagement'
import { userFields } from '../../../../utility/Const'
import { FM, isValid } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import { getGenderImage, jsonDecodeAll } from '../../../../utility/Utils'
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
          const values = jsonDecodeAll(userFields, s)
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
                        {/* <BsTooltip onClick={() => {
                                                    setAddPatient(true)
                                                }} Tag={Edit} title={FM("edit")} role={"button"} style={{ marginTop: -5 }} className="ms-1" size={16} /> */}
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
            <div className='info-container'>
              {user !== null ? (
                <ul className='list-unstyled'>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('company-type')}:</span>
                    <span className='d-block'>
                      {user?.company_types?.map((d, i) => {
                        return (
                          <Badge className='me-1' color='light-primary'>
                            {d?.name}
                          </Badge>
                        )
                      })}
                    </span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('branch')}:</span>
                    <span className='d-block'>{user?.branch?.branch_name}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('email')}:</span>
                    <span className='d-block'>{user?.email}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('contact-number')}:</span>
                    <span className='d-block'>{user?.contact_number}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('personal-number')}:</span>
                    <span className='d-block'>{user?.personal_number}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('employee-id')}:</span>
                    <span className='d-block text-uppercase'>{user?.unique_id}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('full-address')}:</span>
                    <span className='d-block'>{user?.full_address}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('city')}:</span>
                    <span className='d-block'>{user?.city}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('postal-area')}:</span>
                    <span className='d-block'>{user?.postal_area}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('postal-code')}:</span>
                    <span className='d-block'>{user?.zipcode ?? 'N/A'}</span>
                  </li>
                  {/* <li>
                                        <span className='d-block fw-bolder text-dark me-25'>Patient type:</span>
                                        <p className='mt-25'>
                                            {user?.patient_types?.map((d, i) => {
                                                return (
                                                    <Badge className='me-1' color='light-primary'>
                                                        {d?.designation}
                                                    </Badge>
                                                )
                                            })}
                                        </p>
                                    </li> */}
                </ul>
              ) : null}
            </div>
          </Hide>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserInfoCard
