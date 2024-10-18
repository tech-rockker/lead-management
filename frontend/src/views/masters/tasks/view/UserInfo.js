import { SecurityOutlined } from '@material-ui/icons'
import React, { Fragment, useEffect, useState } from 'react'
import { Badge, Card, CardBody } from 'reactstrap'
import { viewUser } from '../../../../utility/apis/userManagement'
import { userFields, UserTypes } from '../../../../utility/Const'
import { FM } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import { jsonDecodeAll } from '../../../../utility/Utils'
import Shimmer from '../../../components/shimmers/Shimmer'
import BsTooltip from '../../../components/tooltip'

const UserInfo = ({ edit }) => {
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const formFields = {
    ...userFields
  }
  const loadDetails = () => {
    if (edit?.id) {
      viewUser({
        id: edit?.id,
        loading: setLoading,
        success: (d) => {
          const s = {
            ...d,
            country_id: d?.country?.id ?? '',
            patient_type_id: typeof d?.patient_type_id === 'object' ? d?.patient_type_id : [],
            ...d?.patient_information,
            id: d?.patient_information?.patient_id
          }
          const values = jsonDecodeAll(formFields, s)
          setEditData({
            ...edit,
            ...values
          })
        }
      })
    }
  }

  useEffect(() => {
    loadDetails()
  }, [edit])
  const avatar =
    edit?.gender === 'male'
      ? require('../../../../assets/images/avatars/Originals/male2.png')
      : require('../../../../assets/images/avatars/Originals/female2.png')

  console.log(edit)

  return (
    <Hide IF={editData === null}>
      {loading ? (
        <>
          {' '}
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
        </>
      ) : (
        <>
          {' '}
          <Fragment>
            <Card className='white'>
              <CardBody>
                <div className='user-avatar-section  mb-2 pb-2 border-bottom'>
                  <div className='d-flex align-items-center flex-column'>
                    <img
                      className=' shadow rounded-circle'
                      src={avatar?.default}
                      style={{ width: 55, height: 55 }}
                    />
                    <div className='d-flex flex-column align-items-center text-center'>
                      <div className='user-info'>
                        <h4 className='text-capitalize mt-1'>
                          {editData !== null ? editData?.name : 'Eleanor Aguilar'}{' '}
                          <Show IF={editData?.is_secret === 1}>
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
                            marginTop: 3,
                            backgroundColor: editData?.user_color,
                            width: '100%',
                            height: 5,
                            borderRadius: 8
                          }}
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='info-container'>
                  {editData !== null ? (
                    <ul className='list-unstyled'>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>Personal No:</span>
                        <span className='d-block'>{editData?.personal_number}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>Patient ID:</span>
                        <span className='d-block'>{editData?.custom_unique_id}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>Email:</span>
                        <span className='d-block'>{editData?.email}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>Contact Number:</span>
                        <span className='d-block'>{editData?.contact_number}</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder text-dark me-25'>{FM('full-address')}:</span>
                        <span className='d-block'>{editData?.full_address}</span>
                      </li>
                      <li>
                        <span className='d-block fw-bolder text-dark me-25'>Patient type:</span>
                        <p className='mt-25'>
                          {editData?.patient_types?.map((d, i) => {
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
              </CardBody>
            </Card>
          </Fragment>
        </>
      )}
    </Hide>
  )
}

export default UserInfo
