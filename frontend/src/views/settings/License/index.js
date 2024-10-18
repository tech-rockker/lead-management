import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  Database,
  DollarSign,
  Edit,
  Eye,
  Gift,
  Key,
  MoreVertical,
  Plus,
  RefreshCcw,
  Send,
  Sliders,
  Trash2
} from 'react-feather'
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
import { licensesUpdate } from '../../../redux/reducers/license'
import { assignLicense, expireLicense, loadLicense } from '../../../utility/apis/licenseApis'
import { IconSizes } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { formatDate, jsonDecodeAll, JsonParseValidate, truncateText } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'
import LicenseAddUpdate from './addUpdateLicense'
import LicenseDetailView from './detailView'
import LicenseFilter from './LicenseFilter'

const Licenses = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [viewAdd, setViewAdd] = useState(false)
  const [reload, setReload] = useState(false)
  const [edit, setEdit] = useState(null)
  const [deletedId, setDeletedId] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [deletedd, setDeletedd] = useState(null)
  const [failed, setFailed] = useState(null)
  const [failedd, setFailedd] = useState(null)
  const [loading, setLoading] = useState(false)
  const [packageFilter, setPackageFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
    }
  }, [])

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(false)
      setViewAdd(false)
    }
    setEdit(null)
  }

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const licenseCard = (item, index) => {
    const avatar =
      item?.gender === 'male'
        ? require('../../../assets/images/avatars/Originals/male2.png')
        : require('../../../assets/images/avatars/Originals/company.png')

    return (
      <>
        <div key={`license-card-${index}`} className='flex-1'>
          <Card
            className={classNames('animate__animated animate__slideInUp', {
              'border border-danger': item?.cancelled_by === 1,
              'border border-success': item?.cancelled_by === null
            })}
          >
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='2' className='d-flex align-items-center justify-content-center'>
                  <img
                    className=' shadow rounded-circle'
                    src={item?.company?.avatar}
                    style={{ width: 55, height: 55 }}
                  />
                </Col>
                <Col xs='9' className='ps-1 d-flex align-items-center'>
                  <div className='flex-1'>
                    <h5 className='mb-0 fw-bolder text-primary text-truncate'>
                      <span className='position-relative text-capitalize'>
                        {item?.company?.company_setting?.company_name}
                      </span>
                    </h5>
                    <p>{item?.company?.company_setting?.company_email}</p>
                    {/* <p className='mb-0' style={{ marginTop: 3, backgroundColor: user?.user_color, width: 50, height: 5, borderRadius: 8 }}></p> */}
                  </div>
                </Col>
                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical
                        color={colors.primary.main}
                        size={IconSizes.MenuVertical}
                        style={{ zIndex: 9999 }}
                      />
                    }
                    options={[
                      {
                        IF: Permissions.licencesRead,
                        icon: <Eye size={14} />,
                        onClick: () => {
                          setViewAdd(true)
                          setEdit(item)
                        },
                        name: FM('view')
                      },
                      {
                        IF: Can(Permissions.licencesEdit) && item?.is_used === 0,
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowAdd(true)
                          setEdit(item)
                        },
                        name: FM('edit')
                      },
                      {
                        IF: Can(Permissions.licencesAssign) && item?.is_used === 0,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={item}
                            successText={FM('licence-assigned')}
                            successTitle={FM('assigned')}
                            title={FM('assign-this-licence', { name: item.license_key })}
                            color='text-warning'
                            onClickYes={(e) => assignLicense({ id: item?.id })}
                            className='dropdown-item'
                            onSuccessEvent={(item) => {
                              dispatch(licensesUpdate(item?.id))
                            }}
                            id={`grid-assign-licence-${item?.id}`}
                          >
                            <span className='me-1'>
                              <CheckSquare size={14} />
                            </span>
                            {FM('assign-licence')}
                          </ConfirmAlert>
                        )
                      },
                      {
                        IF:
                          Can(Permissions.licencesExpire) &&
                          item?.is_used === 1 &&
                          item?.cancelled_by === null,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={item}
                            input
                            text={null}
                            successText={FM('licence-expired')}
                            successTitle={FM('expired')}
                            title={FM('expire-this-licence', { name: item.licence_key })}
                            color='text-warning'
                            className='dropdown-item'
                            onClickYes={(e) =>
                              expireLicense({
                                id: item?.top_most_parent_id,
                                jsonData: { reason_for_cancellation: e }
                              })
                            }
                            onSuccessEvent={(item) => {
                              dispatch(licensesUpdate(item?.top_most_parent_id))
                            }}
                            id={`grid-expire-licence-${item?.top_most_parent_id}`}
                          >
                            <span className='me-1'>
                              <AlertTriangle size={14} />
                            </span>
                            {FM('expire-licence')}
                          </ConfirmAlert>
                        )
                      }
                    ]}
                  />
                </Col>
              </Row>
            </CardBody>
            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col md='12'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('licence-key')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Key size={14} /> {item?.licence_key}
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('packages')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Database size={14} />{' '}
                    <Badge className='me-1' color='light-primary'>
                      {' '}
                      {JsonParseValidate(item?.package_details)?.name}
                    </Badge>
                  </p>
                </Col>
                <Col md='12' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('module')}</p>
                  <p className='mb-0 fw-bolder text-truncate'>
                    <a className='text-secondary'>
                      <Gift size={14} />{' '}
                      <>
                        {item?.module?.map((a) => (
                          <Badge className='me-1' color='light-primary'>
                            {a?.name ?? 'N/A'}{' '}
                          </Badge>
                        ))}
                      </>
                    </a>
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
                      <Calendar size={14} /> {formatDate(item?.active_from, 'DD MMMM, YYYY')}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('expired-at')}</p>
                  <p className='mb-0 fw-bolder text-truncate'>
                    <a className='text-primary'>
                      <Calendar size={14} /> {formatDate(item?.expire_at, 'DD MMMM, YYYY')}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('is-used')}</p>
                  <p className='mb-0 fw-bolder text-truncate'>
                    <Gift size={14} />
                    <a
                      className={classNames('mb-0 fw-bold', {
                        'text-success': item?.is_used === 1,
                        'text-danger': item?.is_used === 0
                      })}
                    >
                      {' '}
                      <>{item?.is_used === 1 ? 'Yes' : 'No'}</>
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('is-expired')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <Gift size={14} />
                    <a
                      className={classNames('mb-0 fw-bold', {
                        'text-danger': item?.cancelled_by === 1,
                        'text-success': item?.cancelled_by === null
                      })}
                    >
                      {' '}
                      <>{item?.cancelled_by === 1 ? 'Yes' : 'No'}</>
                    </a>
                  </p>
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
      <LicenseDetailView
        showModals={viewAdd}
        setShowModals={handleClose}
        licenseId={edit?.id}
        noView
      />
      <LicenseFilter
        show={packageFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setPackageFilter(false)
        }}
      />
      <LicenseAddUpdate
        setReload={setReload}
        key={edit?.id}
        show={showAdd}
        edit={edit}
        handleModal={() => {
          setShowAdd(false)
          setEdit(null)
        }}
      />
      <Header
        icon={<Key size={25} />}
        subHeading={<>{FM('manage-licences')}</>}
        description={FM('licences-description')}
      >
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>

        {/* Buttons */}
        <ButtonGroup>
          <Show IF={Permissions.licencesAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <Button.Ripple
              size='sm'
              onClick={() => {
                setShowAdd(true)
              }}
              color='primary'
              id='create-button'
            >
              <Plus size='16' />
            </Button.Ripple>
          </Show>
          <Button.Ripple
            onClick={() => setPackageFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='16' />
          </Button.Ripple>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setFilterData({
                is_used: 'no'
              })
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      {/* Categories */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadLicense}
        jsonData={{
          is_used: 'No',
          ...filterData
        }}
        selector='licenseCls'
        state='licenses'
        display='grid'
        gridCol='6'
        gridView={licenseCard}
      />
    </>
  )
}

export default Licenses
