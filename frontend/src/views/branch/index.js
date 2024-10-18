// import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Activity,
  Bookmark,
  Calendar,
  CheckSquare,
  Edit,
  Eye,
  File,
  Home,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Pocket,
  RefreshCcw,
  Sliders,
  Trash2,
  User
} from 'react-feather'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
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
import { userDelete } from '../../redux/reducers/userManagement'
import { getPath } from '../../router/RouteHelper'
// import Hide from '../../../utility/Hide'
// import { categoriesDelete, categoriesLoad } from '../../utility/apis/categories'
// import { loadUserTypes } from '../../utility/apis/userTypes'
import { deleteUser, loadUser } from '../../utility/apis/userManagement'
import { forDecryption, IconSizes, UserTypes } from '../../utility/Const'
import { FM } from '../../utility/helpers/common'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../utility/Permissions'
import Show from '../../utility/Show'
import { countPlus, decryptObject, truncateText } from '../../utility/Utils'
import DropDownMenu from '../components/dropdown'
import TableGrid from '../components/tableGrid'
import BsTooltip from '../components/tooltip'
import Header from '../header'
import BranchFilter from './branchFilter'
import BranchViewModal from './branchViewModal'

const Branches = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(null)
  const [failed, setFailed] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [deletedId, setDeletedId] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [views, setViews] = useState([])
  const [branchFilter, setBranchFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const [branchModal, setBranchModal] = useState(false)
  const location = useLocation()
  const notification = location?.state?.notification

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const handleClose = (e) => {
    if (e === false) {
      setEdit(null)
      setBranchModal(e)
    }
  }

  useEffect(() => {
    if (notification?.data_id && notification?.type === 'branch') {
      setBranchModal(true)
      setEdit({
        id: notification?.data_id
      })
    }
    window.history.replaceState({ fffff: 'kj' }, document.title)
  }, [notification])

  // branch card
  const BranchCard = (d, index) => {
    const item = {
      ...decryptObject(forDecryption, d),
      parent: decryptObject(forDecryption, d?.parent)
    }
    const avatar =
      d?.gender === 'male'
        ? require('../../assets/images/avatars/male2.png')
        : require('../../assets/images/avatars/Originals/company.png')
    return (
      <>
        <div key={`branch-card-${index}`} className='flex-1'>
          {/* <div style={{ border: "3px solid #ffcfcf" }}></div> */}
          <Card className='animate__animated animate__fadeInUp'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='2' className='d-flex align-items-center justify-content-center'>
                  <img
                    className=' shadow rounded-circle'
                    src={item?.avatar}
                    style={{ width: 55, height: 55 }}
                  />
                </Col>
                <Col xs='9' className='ps-1 d-flex align-items-center'>
                  <div className='flex-1'>
                    <h5 className='mb-0 fw-bolder text-primary text-truncate'>
                      <span className='position-relative text-capitalize'>
                        {truncateText(item?.branch_name, 30)}
                      </span>
                    </h5>
                    <p className='mb-0 text-small-12 text-dark fw-bolder text-uppercase'>
                      {FM('parent')}: {truncateText(item?.parent?.name)}
                    </p>
                    <p className='mb-0 text-small-12 text-muted fw-bold'>{item?.branch_email}</p>
                    <p className='mb-0 text-small-12 text-muted fw-bold mt-5px '>
                      {item?.company_types?.map((data, index) => {
                        return <>{data?.name} </>
                      })}
                    </p>

                    {/* <p className='mb-0' style={{ marginTop: 3, backgroundColor: item?.user_color, width: 50, height: 5, borderRadius: 8 }}></p> */}
                  </div>
                </Col>
                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      {
                        IF: Permissions.branchRead,
                        icon: <Eye size={14} />,
                        name: FM('view'),
                        onClick: () => {
                          setBranchModal(true)
                          setEdit(item)
                        }
                      },
                      {
                        IF: Permissions.branchEdit,
                        icon: <Edit size={14} />,
                        to: {
                          pathname: getPath('branch.update', { id: item.id }),
                          state: { data: item }
                        },
                        name: FM('edit')
                      },
                      {
                        IF: Permissions.branchDelete,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={item}
                            title={FM('delete-this', { name: item?.name })}
                            color='text-warning'
                            onClickYes={() => deleteUser({ id: item?.id })}
                            onSuccessEvent={(item) => dispatch(userDelete(item?.id))}
                            className='dropdown-item'
                            id={`grid-delete-${item?.id}`}
                          >
                            <Trash2 size={14} />
                            <span className='ms-1'>{FM('delete')}</span>
                          </ConfirmAlert>
                        )
                      }
                    ]}
                  />
                </Col>
              </Row>
            </CardBody>
            <CardBody className='border-top'>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('contact-person-name')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <User size={14} /> {item?.name}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('contact_person_email')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary' href={`mailto:${item?.email}`}>
                      <Mail size={14} /> {item?.email}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('cp_contact_number')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary' href={`tel:${item?.contact_number}`}>
                      <Phone size={14} /> {item?.contact_number}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('personal-number')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <File size={14} /> {item?.personal_number}
                    </a>
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('status')}</p>
                  <p
                    className={classNames('mb-0 fw-bold text-secondary text-truncate', {
                      'text-success': item?.status === 1,
                      'text-danger': item?.status === 0
                    })}
                  >
                    <Calendar size={14} /> {item?.status === 1 ? 'Active' : 'Inactive'}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('city')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Home size={14} /> {item?.city}
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(item?.branchActivityCount)}
                          </Badge>
                          <Activity className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('activity')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(item?.branchIpCount)}
                          </Badge>
                          <Bookmark className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('iP')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(item?.branchTaskCount)}
                          </Badge>
                          <CheckSquare
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('task')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                {/* <Col className=''>
                                    <BsTooltip title={''}>
                                        <div role="" className='text-center'>
                                            <div className='d-flex justify-content-center mt-1'>
                                                <div className='position-relative'>
                                                    <Badge pill color='primary' className='badge-up'>
                                                        {countPlus(item?.branchFollowupCount)}
                                                    </Badge>
                                                    <CheckSquare className='text-secondary' style={{ width: 25, height: 25 }} />
                                                </div>
                                            </div>
                                            <span className='text-dark fw-bold text-step-title'>
                                                {FM("followups")}
                                            </span>
                                        </div>
                                    </BsTooltip>
                                </Col> */}
                <Col className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(item?.branch_patient_number)}
                          </Badge>
                          <User className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('patient')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col className=''>
                  <BsTooltip title={''}>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(item?.branch_employee_number)}
                          </Badge>
                          <User className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('employees')}</span>
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
      <BranchViewModal
        showModal={branchModal}
        setShowModal={handleClose}
        branchId={edit?.id}
        noView
      />
      {/* <AddBranch show={showAdd} edit={edit} handleModal={() => { setShowAdd(false); setEdit(null) }} /> */}
      <BranchFilter
        show={branchFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setBranchFilter(false)
        }}
      />
      <Header icon={<Pocket size='25' />}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>

        <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>

        {/* Buttons */}
        <ButtonGroup>
          <Show IF={Permissions.branchAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <Link to='/branch/create' className='btn btn-primary btn-sm' id='create-button'>
              <Plus size='14' />
            </Link>
          </Show>
          <Button.Ripple
            onClick={() => setBranchFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='16' />
          </Button.Ripple>
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
          {/* <Show IF={Permissions.branchAdd}>
                        <UncontrolledTooltip target="view">{FM("detail-mode")}</UncontrolledTooltip>
                        <Button.Ripple size="sm" color="info" id="view" onClick={() => { !isOpen ? setIsOpen(true) : setIsOpen(false) }}>
                            <Eye size="14" />
                        </Button.Ripple>
                    </Show> */}
        </ButtonGroup>
      </Header>
      {/* Categories */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadUser}
        jsonData={{
          user_type_id: UserTypes.branch,
          ...filterData
        }}
        selector='userManagement'
        state='users'
        display='grid'
        gridCol='6'
        // gridView={gridView1}
        gridView={BranchCard}
      />
    </>
  )
}

export default Branches
