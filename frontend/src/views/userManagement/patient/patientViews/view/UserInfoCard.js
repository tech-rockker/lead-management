// ** React Imports
// ** Custom Components
import { SecurityOutlined } from '@material-ui/icons'
import { Fragment, useEffect, useState } from 'react'
// ** Reactstrap Imports
import { Badge, Card, CardBody } from 'reactstrap'
import { viewUser } from '../../../../../utility/apis/userManagement'
import { forDecryption, userFields } from '../../../../../utility/Const'
import { FM, isValid } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import Show from '../../../../../utility/Show'
import { decryptObject, jsonDecodeAll } from '../../../../../utility/Utils'
import Shimmer from '../../../../components/shimmers/Shimmer'
import BsTooltip from '../../../../components/tooltip'

const UserInfoCard = ({
  selectedUser = null,
  userId = null,
  setUserData = () => {},
  visible = false,
  onSuccess = () => {}
}) => {
  const [user, setUser] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [addPatient, setAddPatient] = useState(false)
  const [viewEdit, setViewEdit] = useState(visible)

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
          // const d = decryptObject(forDecryption, e?.patient_information)
          const s = {
            ...decryptObject(forDecryption, d),
            country_id: d?.country?.id ?? '',
            // patient_type_id: (typeof d?.patient_type_id === "object" ? d?.patient_type_id : []),
            ...d?.patient_information,
            id: d?.patient_information?.patient_id,
            patient_information: decryptObject(forDecryption, d?.patient_information)
          }
          const valuesTemp = jsonDecodeAll(userFields, s)
          const values = {
            ...valuesTemp
            // user: decryptObject(forDecryption, valuesTemp?.user)
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

  const getUser = decryptObject(forDecryption, user)

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
                  <span className='fw-bolder text-dark me-25'>{FM('personal-no')} :</span>
                  <span className='d-block'>
                    <Shimmer style={{ width: 200, height: 20 }} />
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder text-dark me-25'> {FM('patient-id')} :</span>
                  <span className='d-block'>
                    <Shimmer style={{ width: 200, height: 20 }} />
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder text-dark me-25'>{FM('email')} :</span>
                  <span className='d-block'>
                    <Shimmer style={{ width: 200, height: 20 }} />
                  </span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder text-dark me-25'>{FM('contact-number')} :</span>
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
                  src={getUser?.avatar}
                  style={{ width: 55, height: 55 }}
                />

                <div className='d-flex flex-column align-items-center text-center'>
                  <div className='user-info'>
                    <h4 className='text-capitalize'>
                      {getUser !== null ? getUser?.name : 'Eleanor Aguilar'}{' '}
                      <Show IF={getUser?.is_secret}>
                        <BsTooltip title={FM('secret-patient')}>
                          <SecurityOutlined
                            style={{ width: 18, height: 18, marginTop: -3 }}
                            className={'text-danger'}
                          />
                        </BsTooltip>

                        {/* {viewEdit ? <UserModal userType={UserTypes.patient} userId={user?.id} noView >

                                                    <BsTooltip onClick={() => {
                                                        setAddPatient(true)
                                                    }} Tag={Edit} title={FM("edit")} role={"button"} style={{ marginTop: -5 }} className="ms-1" size={16} />
                                                </UserModal> : null} */}

                        {/* user edit*/}
                        {/* {viewEdit ? <BsTooltip
                                                    title={FM("edit")} role={"button"} style={{ marginTop: -5 }} className="ms-1" size={16} > <UserModal userType={UserTypes.patient} userId={user?.id} Component={Edit} /></BsTooltip> : null} */}
                      </Show>
                    </h4>
                    <p className='m-0 text-capitalize'>{getUser?.gender}</p>
                    <p
                      className='mb-0'
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 3,
                        backgroundColor: getUser?.getUser_color,
                        width: 100,
                        height: 5,
                        borderRadius: 8
                      }}
                    ></p>
                  </div>
                </div>
              </div>
            </div>
            <div className='info-container'>
              {getUser !== null ? (
                <ul className='list-unstyled'>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('branch')}:</span>
                    <span className='d-block'>{getUser?.branch?.branch_name ?? 'N/A'}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('personal-no')}:</span>
                    <span className='d-block'>{getUser?.personal_number ?? 'N/A'}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('patient-id')} :</span>
                    <span className='d-block'>{getUser?.custom_unique_id ?? 'N/A'}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('email')}:</span>
                    <span className='d-block'>{getUser?.email ?? 'N/A'}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('contact-number')} :</span>
                    <span className='d-block'>{getUser?.contact_number ?? 'N/A'}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('full-address')}:</span>
                    <span className='d-block'>{getUser?.full_address ?? 'N/A'}</span>
                  </li>
                  <li>
                    <span className='d-block fw-bolder text-dark me-25'>{FM('patient-type')}:</span>
                    <p className='mt-25'>
                      {getUser?.patient_types?.map((d, i) => {
                        return (
                          <Badge className='me-1' color='light-primary'>
                            {d?.designation}
                          </Badge>
                        )
                      })}
                    </p>
                  </li>
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
