import { BusinessOutlined } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Activity,
  Calendar,
  CheckSquare,
  ChevronsRight,
  Database,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Flag,
  Gift,
  GitMerge,
  Home,
  Mail,
  MoreVertical,
  Package,
  Phone,
  Plus,
  RefreshCcw,
  Send,
  Sliders,
  Trash2,
  User,
  UserPlus,
  Users
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
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
import { companiesDelete } from '../../redux/reducers/companies'
import { getPath } from '../../router/RouteHelper'
import { deleteComp, loadComp } from '../../utility/apis/companyApis'
import { forDecryption, IconSizes } from '../../utility/Const'
// ** Styles
import { FM } from '../../utility/helpers/common'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../utility/Permissions'
import Show from '../../utility/Show'
import { countPlus, decryptObject, formatDate } from '../../utility/Utils'
import DropDownMenu from '../components/dropdown'
import BsPopover from '../components/popover'
import TableGrid from '../components/tableGrid'
import BsTooltip from '../components/tooltip'
import Header from '../header'
import CompanyFilter from './companyFilter'

const CompanyTypes = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(null)
  const [deletedId, setDeletedId] = useState(null)
  const [failed, setFailed] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [filterData, setFilterData] = useState(null)
  const [companyFilter, setCompanyFilter] = useState(false)
  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
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

  const companyCard = (d, index) => {
    const user = decryptObject(forDecryption, d)
    const avatar =
      user?.gender === 'male'
        ? require('../../assets/images/avatars/Originals/male2.png')
        : require('../../assets/images/avatars/Originals/company.png')

    return (
      <>
        <div key={`company-card-${index}`} className='flex-1'>
          {/* <div style={{ border: "3px solid #ffcfcf" }}></div> */}
          <Card
            className={classNames('animate__animated animate__slideInUp', {
              'border border-danger shadow-danger': user?.status === 3,
              'border border-success shadow-success': user?.status === 1
            })}
          >
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='2' className='d-flex align-items-center justify-content-center'>
                  <img
                    className=' shadow rounded-circle'
                    src={user?.company_setting?.company_logo}
                    style={{ width: 55, height: 55 }}
                  />
                </Col>
                <Col xs='9' className='ps-1 d-flex align-items-center'>
                  <div className='flex-1'>
                    <h5 className='mb-0 fw-bolder text-primary text-truncate'>
                      <span className='position-relative text-capitalize'>
                        {user?.company_setting?.company_name}
                      </span>
                    </h5>
                    <p className='mb-0 text-small-12 text-muted fw-bold'>
                      {user?.company_types?.map((data, index) => {
                        return <>{data?.name} </>
                      })}
                    </p>
                    <p className='mb-0 text-small-12 text-muted fw-bold'>
                      {user?.company_setting?.company_email}
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
                        IF: Permissions.companiesRead,
                        icon: <Eye size={14} />,
                        to: {
                          pathname: getPath('companies.detail', { id: user.id }),
                          state: { data: user }
                        },
                        name: FM('view')
                      },
                      {
                        IF: Permissions.companiesEdit,
                        icon: <Edit size={14} />,
                        to: {
                          pathname: getPath('companies.update', { id: user.id }),
                          state: { data: user }
                        },
                        name: FM('edit')
                      },
                      {
                        IF: Permissions.companiesDelete,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={user}
                            title={FM('delete-this', { name: user.name })}
                            color='text-warning'
                            onClickYes={() => deleteComp({ id: user?.id })}
                            onSuccessEvent={(item) => dispatch(companiesDelete(item?.id))}
                            className='dropdown-item'
                            id={`grid-delete-${user?.id}`}
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
            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('contact-person-name')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <User size={14} /> {user?.name ?? 'N/A'}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('contact_person_email')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary' href={`mailto:${user?.email}`}>
                      <Mail size={14} /> {user?.email}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('cp_contact_number')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary' href={`tel:${user?.contact_person_number}`}>
                      <Phone size={14} /> {user?.contact_person_number}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('city')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Home size={14} /> {user?.city ?? FM('main-branch')}
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('establishment-year')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Gift size={14} /> {user?.establishment_year ?? 'N/A'}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('package')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Database size={14} /> {user?.subscription?.package_details?.name ?? 'N/A'}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('licence_end_date')}</p>
                  <p className='mb-0 fw-bolder text-secondary text-truncate'>
                    <Calendar size={14} />{' '}
                    {formatDate(user?.licence_end_date, 'DD MMMM, YYYY') ?? 'N/A'}
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('Modules')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <BsTooltip role='button' className='me-1' title={null}>
                      <BsPopover
                        trigger='hover'
                        title={FM('Modules')}
                        content={
                          <>
                            <p
                              className='m-0 p-0 fw-bold text-secondary'
                              style={{ maxHeight: 200, overflowY: 'scroll' }}
                            >
                              {user?.assigned_module?.map((a) => (
                                <Badge className='me-1' color='light-primary'>
                                  {a?.module?.name ?? 'N/A'}{' '}
                                </Badge>
                              ))}
                            </p>
                          </>
                        }
                      >
                        <Package size={14} />{' '}
                        {user?.assigned_module?.map((d, i) => {
                          return (
                            <>
                              {' '}
                              <Badge pill color='primary' className='me-25'>
                                {d?.module?.name ?? 'N/A'}
                              </Badge>
                            </>
                          )
                        })}
                      </BsPopover>
                    </BsTooltip>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('status')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Home size={14} />{' '}
                    <Badge pill color={user?.status === 1 ? 'success' : 'danger'} className='me-25'>
                      {user?.status === 1 ? FM('active') : FM('Inactive')}
                    </Badge>
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='animate__animated animate__flipInX p-0 pt-1 pb-1 border-top'>
              <Row noGutters className='d-flex align-items-start justify-content-between'>
                <Col md='3' xs='2' className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.employees_count)}
                          </Badge>
                          <Users className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('employees')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='3' xs='2' className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.patients_count)}
                          </Badge>
                          <UserPlus className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('patient')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='3' xs='2' className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.assigned_module_count)}
                          </Badge>
                          <Package className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('Modules')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='3' xs='2' className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.branchs_count)}
                          </Badge>
                          <GitMerge className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('branch')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <hr className='mt-1' />
                <Col md='3' xs='2' className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.activities_count)}
                          </Badge>
                          <Activity className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('activity')}</span>
                    </div>
                  </BsTooltip>
                </Col>

                <Col md='3' xs='2' className=''>
                  <div role='' className='text-center'>
                    <div className='d-flex justify-content-center mt-1'>
                      <div className='position-relative'>
                        <Badge pill color='primary' className='badge-up'>
                          {countPlus(user?.tasks_count)}
                        </Badge>
                        <CheckSquare className='text-secondary' style={{ width: 25, height: 25 }} />
                      </div>
                    </div>
                    <span className='text-dark   fw-bold text-step-title'>{FM('task')}</span>
                  </div>
                </Col>

                <Col md='3' xs='2' className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.ips_count)}
                          </Badge>
                          <FileText className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark   fw-bold text-step-title'>{FM('iP')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='3' xs='2' className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.follow_ups_count)}
                          </Badge>
                          <ChevronsRight
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('followups')}</span>
                    </div>
                  </BsTooltip>
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
      <CompanyFilter
        show={companyFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setCompanyFilter(false)
        }}
      />
      <Header icon={<BusinessOutlined size={25} />} subHeading={FM('all-companies')}>
        {/* Tooltips */}

        <ButtonGroup color='dark'>
          <Show IF={Permissions.companiesAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <Link to='/companies/create' className='btn btn-primary btn-sm' id='create-button'>
              <Plus size='14' />
            </Link>
          </Show>
          <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
          <Button.Ripple
            onClick={() => setCompanyFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='14' />
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

      {/* Category Types */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadComp}
        jsonData={filterData}
        selector='companies'
        state='companies'
        display='grid'
        gridCol='6'
        gridView={companyCard}
      />
    </>
  )
}

export default CompanyTypes
