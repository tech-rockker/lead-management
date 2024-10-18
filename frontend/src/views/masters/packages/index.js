import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Activity,
  Calendar,
  CheckSquare,
  DollarSign,
  Edit,
  Eye,
  Frown,
  Gift,
  MoreVertical,
  Package,
  Plus,
  PlusSquare,
  RefreshCcw,
  Send,
  Sliders,
  Trash2,
  User,
  Users
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
import { packagesDelete } from '../../../redux/reducers/packages'
import { getPath } from '../../../router/RouteHelper'
import { deletePackage, loadPackages } from '../../../utility/apis/packagesApis'
import { IconSizes } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { countPlus, currencyFormat, formatDate, numberFormat } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import AddPackage from './addUpdatePackage'
import PackagesFilter from './packageFilter'

const Packages = () => {
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
                      <span className='position-relative text-capitalize'>{item?.name}</span>
                    </h5>
                    <p className='mb-0 text-small-12 text-muted fw-bold'>
                      <span>
                        {FM('total-packages-assigned', {
                          count: numberFormat(item?.purchaseCount ?? 0)
                        })}
                      </span>
                    </p>
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
                        IF: Permissions.packagesEdit,
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowAdd(true)
                          setEdit(item)
                        },
                        name: FM('edit')
                      },
                      {
                        IF: Permissions.packagesDelete,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={item}
                            title={FM('delete-this', { name: item.name })}
                            color='text-warning'
                            onClickYes={() => deletePackage({ id: item?.id })}
                            onSuccessEvent={(item) => dispatch(packagesDelete(item?.id))}
                            className='dropdown-item'
                            id={`grid-delete-${item?.id}`}
                          >
                            <span className='me-1'>
                              <Trash2 size={14} />
                            </span>
                            {FM('delete')}
                          </ConfirmAlert>
                        )
                      }
                    ]}
                  />
                </Col>
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
                    {currencyFormat(item?.price)}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('discount')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Gift size={14} />{' '}
                      <>
                        {item?.discounted_price}{' '}
                        <span className='text-danger'>
                          (-{numberFormat(item?.discount_value)}
                          {item?.discount_type === '1' ? '%' : ''})
                        </span>
                      </>
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('bankId')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    {' '}
                    {currencyFormat(item?.bankid_charges)}
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('sms-charges')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'> {currencyFormat(item?.sms_charges)} </a>
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
                    <Calendar size={14} /> {item?.validity_in_days}
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
                            {countPlus(item?.number_of_employees)}
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
                          {countPlus(item?.number_of_patients)}
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
      <PackagesFilter
        show={packageFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setPackageFilter(false)
        }}
      />
      <AddPackage
        key={edit?.id}
        show={showAdd}
        edit={edit}
        handleModal={() => {
          setShowAdd(false)
          setEdit(null)
        }}
      />
      <Header
        icon={<Package size='25' />}
        subHeading={<>{FM('manage-packages')}</>}
        description={FM('package-description')}
      >
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>

        {/* Buttons */}
        <ButtonGroup>
          <Show IF={Permissions.packagesAdd}>
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
              setFilterData({})
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
        loadFrom={loadPackages}
        jsonData={{
          ...filterData
        }}
        selector='packages'
        state='packages'
        display='grid'
        gridCol='6'
        gridView={packageCard}
      />
    </>
  )
}

export default Packages
