/* eslint-disable no-duplicate-imports */
import { SecurityOutlined } from '@material-ui/icons'
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Badge, Card, CardBody } from 'reactstrap'
import { FM, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import Shimmer from '../../components/shimmers/Shimmer'
import BsTooltip from '../../components/tooltip/'

const UserInfo = ({ edit }) => {
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

  const avatar =
    edit?.gender === 'male'
      ? require('../../../assets/images/avatars/Originals/male2.png')
      : require('../../../assets/images/avatars/Originals/company.png')

  log('com', edit)

  return (
    <Hide IF={edit?.type_id === null}>
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
                      src={edit?.avatar}
                      style={{ width: 55, height: 55 }}
                    />
                    <div className='d-flex flex-column align-items-center text-center'>
                      <div className='user-info'>
                        <h4 className='text-capitalize mt-1'>
                          {edit !== null ? edit?.branch_name : 'Eleanor Aguilar'}{' '}
                          <Show IF={edit?.is_secret === 1}>
                            <BsTooltip title={FM('secret-patient')}>
                              <SecurityOutlined
                                style={{ width: 18, height: 18, marginTop: -3 }}
                                className={'text-danger'}
                              />
                            </BsTooltip>
                          </Show>
                        </h4>
                        <p>{edit?.branch_email}</p>
                        <p
                          className='mb-0'
                          style={{
                            marginTop: 3,
                            backgroundColor: edit?.user_color,
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
                  {edit !== null ? (
                    <ul className='list-unstyled'>
                      <li className='mb-1'>
                        <span className='fw-bolder text-dark me-25'>{FM('company-type')}</span>
                        <span className='d-block'>
                          {edit?.company_types?.map((d, i) => {
                            return (
                              <>
                                <Badge pill color='primary' className='me-25'>
                                  {' '}
                                  {d?.name}{' '}
                                </Badge>
                              </>
                            )
                          })}
                        </span>
                      </li>
                      <li className='mb-1'>
                        <span className='fw-bolder text-dark me-25'>
                          {FM('parent-company-name')}
                        </span>
                        <span className='d-block '>{edit?.top_most_parent?.name}</span>
                      </li>
                      <li className='mb-1'>
                        <span className='fw-bolder text-dark me-25'>
                          {FM('parent-company-email')}
                        </span>
                        <span className='d-block '>{edit?.top_most_parent?.email}</span>
                      </li>
                      <li className='mb-1'>
                        <span className='fw-bolder text-dark me-25'>
                          {FM('parent-company-contact-no')}
                        </span>
                        <span className='d-block '>{edit?.branch?.contact_number}</span>
                      </li>
                      {/* <li className='mb-1'>
                                        <span className='fw-bolder text-dark me-25'>{FM("establishment-year")}</span>
                                        <span className='d-block'>{edit?.establishment_year}</span>
                                    </li> */}
                      {/* <li className='mb-1'>
                                        <span className='fw-bolder text-dark me-25'>{FM("Secret ID")}</span>
                                        <span className='d-block text-uppercase'>{edit?.unique_id}</span>
                                    </li> */}
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
