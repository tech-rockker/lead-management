// ** React Imports
// ** Custom Components
import { SecurityOutlined } from '@material-ui/icons'
import { Fragment, useEffect, useState } from 'react'
import { Edit } from 'react-feather'
// ** Reactstrap Imports
import { Badge, Card, CardBody } from 'reactstrap'
import { viewUser } from '../../../utility/apis/userManagement'
import { forDecryption, userFields, UserTypes } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import Show from '../../../utility/Show'
import { decryptObject, getGenderImage, jsonDecodeAll } from '../../../utility/Utils'
import Shimmer from '../../components/shimmers/Shimmer'
import BsTooltip from '../../components/tooltip'
import UserModal from '../../userManagement/fragment/UserModal'
import ChangeEmail from './ChangeEmail'
import ChangePassword from './ChangePassword'
import ProfileUpdateModal from './ProfileUpdateModal'

const ProfileInfoCard = ({
  selectedUser = null,
  userId = null,
  setUserData = () => {},
  visible = false,
  onSuccess = () => {}
}) => {
  //   const [user, setUser] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [addPatient, setAddPatient] = useState(false)
  const [viewEdit, setViewEdit] = useState(visible)
  const [show, setShow] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddMail, setShowAddMail] = useState(false)
  const userType = useUserType()
  const getUser = useUser()

  const user = decryptObject(forDecryption, getUser)

  const handleClose = (e) => {
    if (e === false) {
      setShow(e)
      setShowAdd(false)
      setShowAddMail(false)
    }
  }
  useEffect(() => {
    if (selectedUser !== null) {
      setLoadingDetails(false)
      //   setUser(selectedUser)
    }
  }, [selectedUser])

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewUser({
        id,
        loading: setLoadingDetails,
        success: (e) => {
          const d = decryptObject(forDecryption, e)
          const s = {
            ...d,
            country_id: d?.country?.id ?? '',
            patient_type_id: typeof d?.patient_type_id === 'object' ? d?.patient_type_id : [],
            ...d?.patient_information,
            id: d?.patient_information?.patient_id
          }
          const values = jsonDecodeAll(userFields, s)
          setUserData(values)
        }
      })
    }
  }

  useEffect(() => {
    loadDetails(userId)
  }, [userId])
  log(user)
  return (
    <Fragment>
      <ChangePassword showModal={showAdd} setShowModal={handleClose} edit={user} noView />
      <ChangeEmail showModal={showAddMail} setShowModal={handleClose} edit={user} noView />
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
                  src={user?.avatar}
                  style={{ width: 100, height: 100 }}
                />

                <div className='d-flex flex-column align-items-center text-center'>
                  <div className='user-info'>
                    <h4 className='text-capitalize'>
                      {/* {user !== null ? user?.name : 'Eleanor Aguilar'}{" "} */}
                      {userType === UserTypes.company ? user?.name : user?.name}
                      <Show IF={user?.is_secret}>
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
                    <Hide IF={user?.is_fake === 0}>
                      <h5
                        className='text-decoration-underline cursor-pointer mt-1'
                        onClick={() => setShowAddMail(true)}
                      >
                        {' '}
                        {FM('change-email')}
                      </h5>
                    </Hide>
                    <h5
                      className='text-decoration-underline cursor-pointer mt-1'
                      onClick={() => setShowAdd(true)}
                    >
                      {' '}
                      {FM('change-password')}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className='info-container'>
              {user !== null ? (
                <ul className='list-unstyled'>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('email')}:</span>
                    <span className='d-block'>{user?.email ?? 'N/A'}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('contact-number')}:</span>
                    <span className='d-block'>
                      {user?.user_type_id === UserTypes.company
                        ? user?.contact_person_number
                        : user?.contact_number ?? 'N/A'}
                    </span>
                  </li>
                  <Hide IF={user?.user_type_id === UserTypes.admin}>
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>{FM('personal-number')} :</span>
                      <span className='d-block'>{user?.personal_number ?? 'N/A'}</span>
                    </li>
                  </Hide>
                  <Show IF={user?.user_type_id === UserTypes.patient}>
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>{FM('unique-id')} :</span>
                      <span className='d-block'>{user?.unique_id ?? 'N/A'}</span>
                    </li>
                  </Show>
                  {/* <Show IF={user?.user_type_id === UserTypes.company}>
                                        <li className='mb-75'>
                                            <span className='fw-bolder text-dark me-25'>{FM("establishment-year")} :</span>
                                            <span className='d-block'>{user?.establishment_year ?? 'N/A'}</span>
                                        </li>
                                    </Show> */}
                  <Hide IF={user?.user_type_id === UserTypes.company}>
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>{FM('full-address')}:</span>
                      <span className='d-block'>{user?.full_address ?? 'N/A'}</span>
                    </li>
                    {/* <Hide IF={user?.user_type_id === UserTypes.patient}> */}
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>{FM('city')} :</span>
                      <span className='d-block'>{user?.city ?? 'N/A'}</span>
                    </li>
                    {/* </Hide> */}
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>{FM('postal-area')} :</span>
                      <span className='d-block'>{user?.postal_area ?? 'N/A'}</span>
                    </li>
                    <li className='mb-75'>
                      <span className='fw-bolder text-dark me-25'>{FM('postal-code')} :</span>
                      <span className='d-block'>{user?.zipcode ?? 'N/A'}</span>
                    </li>
                  </Hide>
                </ul>
              ) : null}
            </div>
          </Hide>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ProfileInfoCard
