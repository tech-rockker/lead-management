// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  CardBody,
  Button,
  Badge,
  Modal,
  Input,
  Label,
  ModalBody,
  ModalHeader
} from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import Select from 'react-select'
import { Check, Briefcase, X } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Avatar from '@components/avatar'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { SecurityOutlined } from '@material-ui/icons'
import { decryptObject, getGenderImage } from '../../../../utility/Utils'
import { FM } from '../../../../utility/helpers/common'
import BsTooltip from '../../../components/tooltip'
import Show from '../../../../utility/Show'
import Shimmer from '../../../components/shimmers/Shimmer'
import Hide from '../../../../utility/Hide'
import { forDecryption } from '../../../../utility/Const'

const UserInfoCard = ({ edit }) => {
  // ** State
  const [show, setShow] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(true)

  // const edit = {
  //     ...editt,
  //     patient: decryptObject(forDecryption, editt?.patient),
  //     branch: decryptObject(forDecryption, editt?.branch)
  // }

  return (
    <Fragment>
      <Card className='white mb-0 h-100'>
        <CardBody>
          <Show IF={!edit}>
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
          <Hide IF={!edit}>
            <div className='user-avatar-section  mb-2 pb-2 border-bottom'>
              <div className='d-flex align-items-center flex-column'>
                <img
                  className='mb-2 mt-2 shadow rounded-circle'
                  src={getGenderImage(edit?.patient?.gender)}
                  style={{ width: 55, height: 55 }}
                />

                <div className='d-flex flex-column align-items-center text-center'>
                  <div className='user-info'>
                    <h4 className='text-capitalize'>
                      {edit !== null ? edit?.patient?.name : 'Eleanor Aguilar'}{' '}
                      <Show IF={edit?.is_secret}>
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
                        backgroundColor: edit?.patient?.user_color,
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
              {edit !== null ? (
                <ul className='list-unstyled'>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('branch')}:</span>
                    <span className='d-block'>{edit?.branch?.branch_name ?? 'N/A'}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('personal-no')}:</span>
                    <span className='d-block'>{edit?.patient?.personal_number}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('patient-id')}:</span>
                    <span className='d-block'>{edit?.patient?.custom_unique_id}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('email')}:</span>
                    <span className='d-block'>{edit?.patient?.email}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('contact-number')}:</span>
                    <span className='d-block'>{edit?.patient?.contact_number}</span>
                  </li>
                  <li className='mb-75'>
                    <span className='fw-bolder text-dark me-25'>{FM('full-address')}:</span>
                    <span className='d-block'>{edit?.patient?.full_address}</span>
                  </li>
                  <li>
                    <span className='d-block fw-bolder text-dark me-25'>{FM('patient-type')}:</span>
                    <p className='mt-25'>
                      {edit?.patient?.patient_types?.map((d, i) => {
                        return (
                          <Badge className='me-1' color='light-primary'>
                            {d?.designation ?? 'N/A'}
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
