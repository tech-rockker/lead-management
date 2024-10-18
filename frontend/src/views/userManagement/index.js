import { TimeToLeave } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import {
  Activity,
  CheckSquare,
  Clock,
  Edit,
  Eye,
  FileText,
  Flag,
  Home,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  RefreshCcw,
  Sliders,
  Trash2,
  Users
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
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
import { IconSizes, UserTypes, forDecryption } from '../../utility/Const'
import { deleteUser, loadUser } from '../../utility/apis/userManagement'

import { userDelete } from '../../redux/reducers/userManagement'
import Hide from '../../utility/Hide'
import { Permissions } from '../../utility/Permissions'
import Show, { Can } from '../../utility/Show'
import {
  countPlus,
  decrypt,
  decryptObject,
  getAge,
  truncateText,
  viewInHours
} from '../../utility/Utils'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import { FM, isValid, isValidArray } from '../../utility/helpers/common'
import useTopMostParent from '../../utility/hooks/useTopMostParent'
import useUser from '../../utility/hooks/useUser'
import useUserType from '../../utility/hooks/useUserType'
import DropDownMenu from '../components/dropdown'
import BsPopover from '../components/popover'
import TableGrid from '../components/tableGrid'
import BsTooltip from '../components/tooltip'
import Header from '../header'
import AssignHoursEmployee from './EmployeeView/AssignEmployee'
import EmployeeViewModal from './EmployeeView/EmployeeViewModal'
import UserModal from './fragment/UserModal'
import AssignUserBranchModal from './fragment/steps/AssignBranch'
import EmployeeFilter from './nurse/employeeFilter'
import FakePassword from './patient/fakePassword'
const UserManagement = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const empAdd = Can(Permissions?.employeesAdd)
  const empAddSu = Can(Permissions?.adminEmployeeAdd)
  const emp = useSelector((state) => state.auth.userData)
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [employeeFilter, setEmployeeFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const [assignModal, setAssignModal] = useState(false)
  const users = useUser()
  const userType = useUserType()
  const topMostParent = useTopMostParent()
  const location = useLocation()
  const notification = location?.state?.notification
  const [showModalFake, setShowModalFake] = useState(false)
  const [showModalBranch, setShowModalBranch] = useState(false)

  const user = useUser()
  const isSu = user?.top_most_parent?.user_type_id === 1

  const employeeType = (data) => {
    if (data?.employee_type === '1') {
      return FM('regular')
    }
    if (data?.employee_type === '3') {
      return FM('seasonal')
    }
    if (data?.employee_type === '2') {
      return FM('substitute')
    } else {
      return FM('other')
    }
  }
  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  const handleClose = (e) => {
    if (e === false) {
      setEdit(null)
      setShowModal(false)
      setAssignModal(false)
      setShowModalFake(false)
      setShowModalBranch(false)
    }
  }

  const handleViewClose = (e) => {
    if (e === false) {
      setEdit(null)
      setShowViewModal(false)
      setAssignModal(false)
    }
  }

  useEffect(() => {
    if (notification?.data_id && notification?.type === 'employee') {
      // setShowViewModal(true)
      setEdit({
        id: notification?.data_id
      })
    }
  }, [notification])

  const EmployeeCard = (d, index) => {
    const avatar =
      d?.gender === 'male'
        ? require('../../assets/images/avatars/male2.png')
        : require('../../assets/images/avatars/female2.png')
    const user = decryptObject(forDecryption, d)

    return (
      <>
        <div key={`patient-card-${index}`} className='flex-1'>
          {/* <div style={{ border: "3px solid #ffcfcf" }}></div> */}
          <Card
            className={classNames({
              'animate__animated animate__bounceIn': index === 0 && user.id === added,
              'border border-primary border-5': user?.id === notification?.data_id
            })}
          >
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='2' className='d-flex align-items-center justify-content-center'>
                  <img
                    className=' shadow rounded-circle'
                    src={user?.avatar}
                    style={{ width: 55, height: 55 }}
                  />
                </Col>
                <Col xs='8' className='ps-1 d-flex align-items-center'>
                  <div className='flex-1'>
                    <h5 className='mb-0 fw-bolder text-primary text-truncate'>
                      <span className='position-relative'>{truncateText(user?.name, 30)}</span>
                    </h5>
                    <p className='mb-0 text-small-12 text-muted fw-bold'>
                      {getAge(user?.personal_number, FM)}
                    </p>
                    <p
                      className='mb-0'
                      style={{
                        marginTop: 3,
                        backgroundColor: user?.user_color,
                        width: 50,
                        height: 5,
                        borderRadius: 8
                      }}
                    ></p>
                  </div>
                </Col>
                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <Show IF={user?.on_vacation === true}>
                    <BsTooltip title={FM('on-vacation')}>
                      <TimeToLeave style={{ width: 22, height: 22 }} className={'text-danger'} />
                    </BsTooltip>
                  </Show>
                </Col>
                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      {
                        IF: Can(Permissions.employeesRead) || isSu,
                        icon: <Eye size={14} />,
                        onClick: () => {
                          setShowViewModal(!showViewModal)
                          setEdit(user)
                        },
                        name: FM('view')
                      },
                      {
                        IF: Can(Permissions.employeesEdit) || isSu,
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowModal(!showModal)
                          setEdit(user)
                        },
                        name: FM('edit')
                      },
                      {
                        IF:
                          Can(Permissions.employeesEdit) &&
                          (userType === UserTypes.company || userType === UserTypes.branch),
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowModalBranch(true)
                          setEdit(user)
                        },
                        name: FM('assign-branch')
                      },
                      {
                        IF: Can(Permissions.employeesEdit),
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowModalFake(!showModalFake)
                          setEdit(user)
                        },
                        name: FM('change-password')
                      },
                      {
                        IF: Permissions.employeesEdit,
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setAssignModal(!assignModal)
                          setEdit(user)
                        },
                        name: FM('assign-hours')
                      },

                      {
                        IF: (Can(Permissions.employeesDelete) && emp?.id !== user?.id) || isSu,
                        // icon: <Trash2 size={14} />,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={user}
                            title={FM('delete-this', { name: user?.name })}
                            color='text-warning'
                            onClickYes={() => deleteUser({ id: user?.id })}
                            onSuccessEvent={(item) => {
                              dispatch(userDelete(item?.id))
                            }}
                            className='dropdown-item'
                            id={`grid-delete-${user?.id}`}
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
                  <p className='mb-0 text-dark fw-bolder'>{FM('assigned-hours')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Clock size={14} /> {user?.assigned_work?.assigned_working_hour_per_week}{' '}
                      {'hr'}
                    </a>
                  </p>
                </Col>

                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('actutal-hours')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Clock size={14} /> {user?.assigned_work?.actual_working_hour_per_week} {'hr'}{' '}
                      (
                      {viewInHours(
                        Math.floor(
                          user?.assigned_work?.assigned_working_hour_per_week *
                            (user?.assigned_work?.working_percent / 100) *
                            60
                        )
                      )}
                      )
                    </a>
                  </p>
                </Col>

                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('employee-type')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Home size={14} /> {employeeType(user)}
                  </p>
                </Col>
              </Row>
            </CardBody>

            <CardBody className='border-top'>
              <Row className='align-items-center'>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('email')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary' href={`mailto:${user?.email}`}>
                      <Mail size={14} /> {user?.email}
                    </a>
                  </p>
                </Col>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('contact-number')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary' href={`tel:${user?.contact_number}`}>
                      <Phone size={14} /> {user?.contact_number}
                    </a>
                  </p>
                </Col>
                <Hide IF={user?.user_type_id === UserTypes.adminEmployee}>
                  <Col md='4'>
                    <p className='mb-0 text-dark fw-bolder'>{FM('branch')}</p>
                    <p className='mb-0 fw-bold text-secondary text-truncate'>
                      {/* <Home size={14} /> {" "} {user?.employee_branches?.map(a => (<Badge className='me-1' color='light-primary'>{a?.branch?.branch_name ?? 'N/A'} </Badge>))} */}
                      {/* There were UI Band So don't any logical change if you chanfe ther your ui may be effected */}
                      <BsPopover
                        trigger='hover'
                        title={FM('branch')}
                        content={
                          <>
                            <p
                              className='m-0 p-0 fw-bold text-secondary'
                              style={{ maxHeight: 200, overflowY: 'scroll' }}
                            >
                              {user?.employee_branches?.map((a) => (
                                <Badge className='me-1 text-wrap' color='light-primary'>
                                  {truncateText(a?.branch?.branch_name, 20) ?? 'N/A'}{' '}
                                </Badge>
                              ))}
                            </p>
                          </>
                        }
                      >
                        <Home size={14} />
                        <Badge className='me-1' color='light-primary'>
                          {isValidArray(user?.employee_branches)
                            ? truncateText(user?.employee_branches[0]?.branch?.branch_name, 10)
                            : 'N/A'}{' '}
                        </Badge>
                      </BsPopover>
                    </p>
                  </Col>
                </Hide>
                <Show IF={user?.user_type_id === UserTypes.adminEmployee}>
                  <Col md='4'>
                    <p className='mb-0 text-dark fw-bolder'>{FM('branch')}</p>
                    <p className='mb-0 fw-bold text-secondary text-truncate'>
                      <Home size={14} /> {decrypt(user?.branch?.name)}
                    </p>
                  </Col>
                </Show>
              </Row>
            </CardBody>
            <Show IF={user?.top_most_parent?.user_type_id !== UserTypes.admin}>
              <CardBody className=' p-0 pt-1 pb-1 border-top'>
                <Row noGutters className='d-flex align-items-start justify-content-between'>
                  <Col md='2' xs='2' className=''>
                    <BsTooltip title={''}>
                      <div role='' className='text-center'>
                        <div className='d-flex justify-content-center mt-1'>
                          <div className='position-relative'>
                            <Badge pill color='primary' className='badge-up'>
                              {countPlus(user?.assignActivityCount)}
                            </Badge>
                            <Activity
                              className='text-secondary'
                              style={{ width: 25, height: 25 }}
                            />
                          </div>
                        </div>
                        <span className='text-dark fw-bold text-step-title'>{FM('activity')}</span>
                      </div>
                    </BsTooltip>
                  </Col>
                  <Col md='2' xs='2' className=''>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.assignTaskCount)}
                          </Badge>
                          <CheckSquare
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark   fw-bold text-step-title'>{FM('task')}</span>
                    </div>
                  </Col>

                  <Col md='2' xs='2' className=''>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.journals_count)}
                          </Badge>
                          <FileText className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark   fw-bold text-step-title'>{FM('journals')}</span>
                    </div>
                  </Col>
                  <Col md='2' xs='2' className=''>
                    <div role='' className='text-center'>
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.deviations_count)}
                          </Badge>
                          <Flag className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark fw-bold text-step-title'>{FM('deviation')}</span>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Show>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <FakePassword
        showModal={showModalFake}
        setShowModal={handleClose}
        userType={UserTypes.employee}
        edit={edit?.id}
        noView
      />
      <AssignUserBranchModal
        showModal={showModalBranch}
        setShowModal={handleClose}
        onSuccess={() => {
          setFilterData({})
        }}
        edit={edit}
        noView
      />
      <EmployeeViewModal
        key={`user-view-for-${edit?.id}`}
        eId={edit?.id}
        edit={edit}
        disableSave
        showModal={showViewModal}
        setShowModal={handleViewClose}
        color={colors.info.main}
        size='18'
      />
      <UserModal
        onSuccess={() => {
          setFilterData({ k: 5 })
        }}
        showModal={showModal}
        setShowModal={handleClose}
        userType={UserTypes.employee}
        userId={edit?.id}
        noView
      />
      <EmployeeFilter
        show={employeeFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setEmployeeFilter(false)
        }}
      />
      <AssignHoursEmployee showModal={assignModal} setShowModal={handleClose} edit={edit} noView />
      <Header icon={<Users size='25' />} subHeading={FM('all-employees')}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <ButtonGroup color='dark'>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>

          <Show IF={empAdd || empAddSu}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <UserModal
              onSuccess={() => {
                setFilterData({ k: 5 })
              }}
              userType={UserTypes.employee}
              Component={Button.Ripple}
              color='primary'
              size='sm'
              id='create-button'
            >
              <Plus size='14' />
            </UserModal>
          </Show>
          {/* <Link to={getPath('users.employees.create')} className='btn btn-outline-dark btn-sm' id="create-button">
                        <Plus size="14" />
                    </Link> */}
          <Button.Ripple
            onClick={() => setEmployeeFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='14' />
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
        </ButtonGroup>
      </Header>

      {/* Category Types */}
      <Show IF={isValid(topMostParent?.user_type_id)}>
        <TableGrid
          refresh={reload}
          isRefreshed={setReload}
          loadFrom={loadUser}
          jsonData={{
            user_type_id:
              topMostParent?.user_type_id === UserTypes.admin
                ? UserTypes.adminEmployee
                : UserTypes.employee,
            branch_id: topMostParent?.user_type_id === UserTypes.branch ? users?.branch_id : null,
            ...filterData
          }}
          selector='userManagement'
          state='users'
          display='grid'
          gridCol='6'
          gridView={EmployeeCard}
        />
      </Show>
    </>
  )
}

export default UserManagement
