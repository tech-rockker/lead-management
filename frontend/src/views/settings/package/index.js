import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Calendar, Gift, Package, PlusSquare, RefreshCcw, Users } from 'react-feather'
import { useDispatch } from 'react-redux'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { loadPackagesUser } from '../../../utility/apis/packagesApis'
import { UserTypes } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import { countPlus, currencyFormat, formatDate, numberFormat } from '../../../utility/Utils'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'

const PackagesUser = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [edit, setEdit] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [deletedId, setDeletedId] = useState(null)
  const [failed, setFailed] = useState(null)
  const [loading, setLoading] = useState(false)
  const [packageFilter, setPackageFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const user = useUser()
  const userType = useUserType()
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
    }
  }, [])

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const packageCard = (item, index) => {
    const avatar =
      item?.gender === 'male'
        ? require('../../../assets/images/avatars/Originals/male2.png')
        : require('../../../assets/images/avatars/Originals/company.png')

    return (
      <>
        <div key={`package-card-${index}`} className='flex-1'>
          {/* <div style={{ border: "3px solid #ffcfcf" }}></div> */}
          <Card className='animate__animated animate__slideInUp'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='2' className='d-flex align-items-center justify-content-center'>
                  <img
                    className=' shadow rounded-circle'
                    src={avatar?.default}
                    style={{ width: 55, height: 55 }}
                  />
                </Col>
                <Col xs='9' className='ps-1 d-flex align-items-center'>
                  <div className='flex-1'>
                    <h5 className='mb-0 fw-bolder text-primary text-truncate'>
                      <span className='position-relative text-capitalize'>
                        {item?.package_details?.name}
                      </span>
                    </h5>
                    <p className='mb-0 text-small-12 text-dark fw-bolder'>
                      <span>
                        {FM('licence-key-assigned', {
                          count: item?.licence_key ?? 'No Licence key'
                        })}
                      </span>
                    </p>
                    {/* <p className='mb-0' style={{ marginTop: 3, backgroundColor: user?.user_color, width: 50, height: 5, borderRadius: 8 }}></p> */}
                  </div>
                </Col>
                {/* <Col xs="1" className='d-flex justify-content-end align-items-centers'>
                                </Col> */}
              </Row>
            </CardBody>
            {/* <CardBody className=' border-top'>
                            <Row className='align-items-center'>
                                <Col md="6">
                                    <p className='mb-0 text-dark fw-bolder'>
                                        {FM("number_of_employees")}
                                    </p>
                                    <p className='mb-0 fw-bold text-truncate'>
                                        <a className='text-secondary'> <User size={14} /> {" "} {numberFormat(item?.number_of_employees)}</a>
                                    </p>
                                </Col>
                                <Col md="6">
                                    <p className='mb-0 text-dark fw-bolder'>
                                        {FM("number_of_patients")}
                                    </p>
                                    <p className='mb-0 fw-bold text-truncate'>
                                        <a className='text-secondary'><Frown size={14} /> {" "} {numberFormat(item?.number_of_patients)}</a>
                                    </p>
                                </Col>

                            </Row>
                        </CardBody> */}
            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('price')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    {' '}
                    {currencyFormat(item?.package_details?.price)}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('discount')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Gift size={14} />{' '}
                      <>
                        {item?.package_details?.discounted_price}{' '}
                        <span className='text-danger'>
                          (-{numberFormat(item?.package_details?.discount_value)}
                          {item?.package_details?.discount_type === '1' ? '%' : ''})
                        </span>
                      </>
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('bankId')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    {' '}
                    {currencyFormat(item?.package_details?.bankid_charges)}
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('sms-charges')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      {' '}
                      {currencyFormat(item?.package_details?.sms_charges)}{' '}
                    </a>
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('created-at')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Calendar size={14} /> {formatDate(item?.created_at, 'DD MMMM, YYYY')}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('validity')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Calendar size={14} /> {item?.package_details?.validity_in_days}
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-date')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Calendar size={14} /> {formatDate(item?.start_date, 'DD MMMM, YYYY')}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('end-date')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Calendar size={14} /> {formatDate(item?.end_date, 'DD MMMM, YYYY')}
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=' p-0 pt-1 pb-1 border-top'>
              <Row noGutters className='d-flex align-items-start justify-content-around'>
                <Col md='6' xs='2' className=''>
                  <BsTooltip title={''}>
                    <div className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(item?.package_details?.number_of_employees)}
                          </Badge>
                          <Users className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('employees')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='6' xs='2' className=''>
                  <div className='text-center'>
                    <div className='d-flex justify-content-center mt-1'>
                      <div className='position-relative'>
                        <Badge pill color='primary' className='badge-up'>
                          {countPlus(item?.package_details?.number_of_patients)}
                        </Badge>
                        <PlusSquare className='text-secondary' style={{ width: 25, height: 25 }} />
                      </div>
                    </div>
                    <span className='text-dark   fw-bold text-step-title'>{FM('patient')}</span>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Header
        icon={<Package size='25' />}
        subHeading={<>{FM('manage-packages')}</>}
        description={FM('package-description')}
      >
        <ButtonGroup>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setFilterData({})
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      {/* Categories */}
      {userType === UserTypes.company ? (
        <TableGrid
          refresh={reload}
          isRefreshed={setReload}
          loadFrom={loadPackagesUser}
          jsonData={{
            ...filterData,
            user_id: userType === UserTypes.company ? user?.id : filterData?.user_id
          }}
          selector='packages'
          state='packages'
          display='grid'
          gridCol='6'
          gridView={packageCard}
        />
      ) : null}
    </>
  )
}

export default PackagesUser
