import {
  IndeterminateCheckBoxOutlined,
  PeopleOutlineSharp,
  Rotate90DegreesCcw,
  WorkOutline
} from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Award,
  Check,
  CheckCircle,
  CheckSquare,
  Download,
  Edit,
  Eye,
  File,
  Home,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders,
  ThumbsUp,
  Trash2,
  User
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
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
import { patientPlanDelete, patientPlanUpdate } from '../../../redux/reducers/ip'
import { getPath } from '../../../router/RouteHelper'
import {
  deletePatientPlan,
  ipHistoryEdit,
  ipPrint,
  loadApprovedPatientPlan,
  loadPatientPlanList
} from '../../../utility/apis/ip'
import {
  CategoryType,
  forDecryption,
  IconSizes,
  incompleteIpFields,
  ipFields,
  UserTypes
} from '../../../utility/Const'
// ** Styles
import { FM, isValid, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import useModules from '../../../utility/hooks/useModules'
import useUserType from '../../../utility/hooks/useUserType'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import {
  countPlus,
  decryptObject,
  formatDate,
  incompleteSteps,
  isAllTrue,
  jsonDecodeAll
} from '../../../utility/Utils'
import ActivityModal from '../../activity/fragment/activityModal'
import DropDownMenu from '../../components/dropdown'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import FollowUpModal from '../followups/fragments/followUpModal'
import TaskModal from '../tasks/fragment/TaskModal'
import CompleteModal from './CompleteModal'
import IpDetailModal from './fragment/ipDetailModal'
import IpStepModal from './fragment/IpStepModal'
import IPFilter from './ipFilter'

const ImplementationPlan = ({ user = null }) => {
  const { colors } = useContext(ThemeColors)
  const canEdit = Can(Permissions.ipSelfEdit)

  const dispatch = useDispatch()
  const params = useParams()
  const ip = useSelector((s) => s?.ip?.ip)
  const id = params.id
  const location = useLocation()
  const dashboard = location?.state?.dashboard
  const notification = location?.state?.notification
  const status = location?.state?.status
  const history = useHistory()
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [ipFilter, setIpFilter] = useState(false)

  const [filterData, setFilterData] = useState({
    status: status ?? 1
  })
  const [showModal, setShowModal] = useState(false)
  const [showFollowup, setShowFollowup] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [completeModal, setCompleteModal] = useState(false)
  const [success, setSuccess] = useState(false)
  const [path, setPath] = useState(1)
  const [taskModal, setTaskModal] = useState(false)
  const [sourceId, setSourceId] = useState(null)
  const [step, setStep] = useState('1')
  const userType = useUserType()
  //complete modal
  const handleCompleteModal = () => setCompleteModal(!completeModal)

  const handleClose = (e) => {
    if (e === false) {
      setEdit(null)
      setShowModal(false)
      setShowFollowup(false)
      setViewModal(false)
      setCompleteModal(false)
      setTaskModal(false)
      setShowActivity(false)
      setReload(e)
      setStep('1')
      setPath(1)
    }
  }

  useEffect(() => {
    if (user !== null) {
    }
  }, [user])

  const viewIpModal = (ip, step) => {
    setViewModal(!viewModal)
    setEdit(ip)
    setStep(step)
  }
  const openEditModal = (ip, path) => {
    if (canEdit) {
      setShowModal(!showModal)
      setEdit(ip)
      setPath(path)
    }
  }

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData, showModal])

  // useEffect(() => {
  //     log(status)
  //     if (isValid(status)) {
  //         setFilterData({
  //             status
  //         })
  //     }
  // }, [status])

  useEffect(() => {
    if (notification?.data_id && notification?.type === 'ip') {
      setViewModal(true)
      setEdit({
        id: notification?.data_id
      })
    }
    window.history.replaceState({ fffff: 'kj' }, document.title)
  }, [notification])

  const IpCardView = (data, index) => {
    // const activities = { ...ip, data: activitiesTemp?.data?.map((a) => ({ ...a, patient: decryptObject(forDecryption, a?.patient), branch: decryptObject(forDecryption, a?.branch) })) }

    const valuesTemp = jsonDecodeAll(ipFields, data)
    const values = {
      ...valuesTemp,
      patient: decryptObject(forDecryption, valuesTemp?.patient),
      branch: decryptObject(forDecryption, valuesTemp?.branch)
    }
    const ip = values

    log(values)
    const test = incompleteSteps(incompleteIpFields, {
      ...values,
      persons: values?.patient?.persons_count > 0 ? ['test'] : []
    })
    const patient = isAllTrue(test['select-patient'], 'success', 'warning', 'danger')
    const living = isAllTrue(test['living-area'], 'success', 'warning', 'danger')
    const overall = isAllTrue(test['ip-overall-goal'], 'success', 'warning', 'danger')
    const factors = isAllTrue(test['ip-related-factors'], 'success', 'warning', 'danger')
    const treatment = isAllTrue(test['ip-treatment-working'], 'success', 'warning', 'danger')
    const files = isAllTrue(test['ip-file'], 'success', 'warning', 'danger')
    const listItems = [FM('activity'), FM('ip-followup'), FM('ip-template'), FM('tasks')]

    return (
      <>
        <div className='w-100' key={`ip-${index}`}>
          <Card className='animate__animated animate__fade'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='10' className='d-flex align-items-center '>
                  <div className='w-100'>
                    <h5 className='mb-3px fw-bolder text-primary text-truncate'>
                      <span className='position-relative'>{ip?.title}</span>
                    </h5>
                    <p className='mb-3px text-small-12 text-dark fw-bolder text-truncate'>
                      <BsTooltip
                        title={
                          <>
                            {ip?.category?.name} {ip?.category?.name ? '/' : ''}{' '}
                            {ip?.subcategory?.name}
                          </>
                        }
                      >
                        {ip?.category?.name} {ip?.category?.name ? '/' : ''} {ip?.subcategory?.name}
                      </BsTooltip>
                    </p>
                    <p
                      className={classNames('mb-0 text-small-12 ', {
                        'text-success': ip?.status === 2,
                        'text-danger': ip?.status < 2
                      })}
                    >
                      {isValid(ip?.approved_date)
                        ? ip.status === 2
                          ? FM('completed')
                          : FM('incomplete')
                        : FM('not-approved')}
                    </p>
                  </div>
                </Col>
                <Col xs='1' className='d-flex align-items-center justify-content-center'>
                  <BsTooltip
                    title={isValid(ip?.approved_date) ? FM('ip-approved') : FM('ip-not-approved')}
                  >
                    <CheckCircle
                      size={28}
                      className={classNames('', {
                        'text-success': isValid(ip?.approved_date),
                        'text-secondary': !isValid(ip?.approved_date)
                      })}
                    />
                  </BsTooltip>
                </Col>
                {/* <Show IF={userType === UserTypes.company || userType === UserTypes.employee || userType === UserTypes.branch} > */}
                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      {
                        IF: Permissions.ipSelfRead,
                        icon: <Eye size={14} />,
                        onClick: () => {
                          setViewModal(!viewModal)
                          setEdit(ip)
                        },
                        name: FM('view')
                      },
                      {
                        IF: Can(Permissions.ipSelfEdit) && !isValid(id),
                        icon: <Edit size={14} />,
                        name: FM('edit'),
                        onClick: () => {
                          setShowModal(!showModal)
                          setEdit(ip)
                          setPath(path)
                        }
                      },
                      {
                        IF:
                          Can(Permissions.ipSelfBrowse) &&
                          isValid(ip?.reason_for_editing) &&
                          !isValid(id),
                        icon: <Eye size={14} />,
                        to: { pathname: getPath('implementations.history', { id: ip?.id }) },
                        name: FM('edit-history')
                      },
                      {
                        IF: Can(Permissions.ipFollowUpsSelfAdd) && ViewActivity && !isValid(id),
                        // IF: Permissions.ipFollowUpsSelfAdd,
                        icon: <Plus size={14} />,
                        onClick: () => {
                          setShowFollowup(!showFollowup)
                          setEdit(ip)
                        },
                        name: FM('followups')
                      },
                      {
                        IF: Can(Permissions.taskAdd) && !isValid(id),
                        icon: <Plus size={14} />,
                        onClick: () => {
                          setTaskModal(true)
                          setEdit(ip)
                        },
                        name: FM('add-task')
                      },
                      {
                        IF: Can(Permissions.activitySelfAdd) && !isValid(id),
                        icon: <Plus size={14} />,
                        onClick: () => {
                          setShowActivity(true)
                          setEdit(ip)
                        },
                        name: FM('activity')
                      },
                      {
                        IF:
                          ip?.status === 1 &&
                          (userType === UserTypes.company ||
                            userType === UserTypes.employee ||
                            userType === UserTypes.branch) &&
                          !isValid(id),
                        icon: <Check size={14} />,
                        onClick: () => {
                          handleCompleteModal()
                          setEdit(ip)
                        },
                        name: FM('complete')
                      },
                      {
                        IF: Can(Permissions.ipSelfEdit) && !isValid(id),
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={ip}
                            title={FM('sign-ip')}
                            text='are-you-sure'
                            successText={'ip-signed-successfully'}
                            failedText='ip-sign-failed'
                            failedTitle={'sign-failed'}
                            color='text-success'
                            enableNo
                            successTitle={FM('signed-successfully')}
                            onClickYes={() => {
                              //Where after download list disable  then we apply below code to fix it
                              ipPrint({
                                id: ip?.id,
                                jsonData: { bankid_verified: 'yes' }
                              })
                              // setFilterData({
                              //   status: 2,
                              //   fromFilter: false
                              // })
                              // setReload(true)
                            }}
                            onClickNo={() =>
                              ipPrint({
                                id: ip?.id,
                                jsonData: { bankid_verified: 'no' }
                              })
                            }
                            className='dropdown-item'
                            id={`grid-sign-${ip?.id}`}
                          >
                            <Download size={14} />
                            <span className='ms-1'>{FM('download')}</span>
                          </ConfirmAlert>
                        )
                      },
                      {
                        IF: Can(Permissions.ipSelfDelete) && !isValid(id),
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={ip}
                            uniqueEventId={`delete-${ip?.id}`}
                            title={FM('delete-this', { name: ip?.title })}
                            color='text-warning'
                            text={FM('deleting-this-ip-will-also-delete-following-record')}
                            listItems={listItems}
                            onClickYes={() => deletePatientPlan({ id: ip?.id })}
                            onSuccessEvent={(item) => dispatch(patientPlanDelete(item?.id))}
                            className='dropdown-item'
                            id={`grid-delete-${ip?.id}`}
                          >
                            <Trash2 size={14} /> <span className='ms-1'>{FM('delete')}</span>
                          </ConfirmAlert>
                        )
                      },
                      // Digital Signature approval of IP
                      {
                        IF:
                          !isValid(ip?.approved_date) && ip?.can_approve_this === 1 && !isValid(id),
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={ip}
                            title={FM('approve', { name: ip?.title })}
                            text={'click-yes-to-approve-ip'}
                            color='text-warning'
                            failedTitle={'ip-approve-failed'}
                            failedText={'please-retry-after-sometime'}
                            successTitle={'ip-approved'}
                            successText={'ip-approved-successfully'}
                            onClickYes={() =>
                              loadApprovedPatientPlan({
                                jsonData: { id: ip?.id }
                              })
                            }
                            onSuccessEvent={(item) => dispatch(patientPlanUpdate(item))}
                            className='dropdown-item'
                            id={`grid-approve-${ip?.id}`}
                          >
                            <CheckSquare size={14} /> <span className='ms-1'>{FM('approve')}</span>
                          </ConfirmAlert>
                        )
                      }
                    ]}
                  />
                </Col>
                {/* </Show> */}
              </Row>
            </CardBody>

            <CardBody className=' border-top'>
              <Row className='align-items-center'>
                <Col md='3'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('patient')}</p>
                  <p
                    role={'button'}
                    className='mb-0 fw-bold text-secondary text-truncate'
                    onClick={() => {
                      setViewModal(!viewModal)
                      setEdit(ip)
                    }}
                  >
                    {ip?.patient?.name ?? 'N/A'}
                  </p>
                </Col>
                <Col md='3'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-date')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    {formatDate(ip?.start_date, 'DD MMMM, YYYY') ?? 'N/A'}
                  </p>
                </Col>
                <Col md='3'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('end-date')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    {formatDate(ip?.end_date, 'DD MMMM, YYYY') ?? 'N/A'}
                  </p>
                </Col>

                {/* comment adding on card */}
                <Col md='3'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('date-comment')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    {ip?.date_comment ?? 'N/A'}{' '}
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='p-0 pt-1 pb-1 border-top'>
              <Row noGutters className='d-flex align-items-start justify-content-start'>
                <Col md='2' xs='2' className=''>
                  <BsTooltip
                    title={!ViewActivity ? FM('module-inactive') : null}
                    style={{ opacity: ViewActivity ? 1 : 0.5 }}
                  >
                    <Link
                      className={classNames({ 'pe-none': ip?.activities_count === 0 })}
                      to={{
                        pathname: getPath('ip.timeline', { id: ip?.id }),
                        state: { from: 'IP', ip }
                      }}
                    >
                      <div
                        role='button'
                        className={classNames('text-center', { 'pe-none': !ViewActivity })}
                      >
                        <div className='d-flex justify-content-center mt-1'>
                          <div className='position-relative'>
                            <Badge
                              pill
                              color={ViewActivity ? 'primary' : 'secondary'}
                              className='badge-up'
                            >
                              {countPlus(ip?.activities_count) ?? 0}
                            </Badge>
                            <Activity
                              className='text-secondary'
                              style={{ width: 25, height: 25 }}
                            />
                          </div>
                        </div>
                        <span className='text-dark fw-bold text-step-title'>{FM('activity')}</span>
                      </div>
                    </Link>
                  </BsTooltip>
                </Col>

                <Col md='2' xs='2' className=''>
                  <BsTooltip
                    title={!ViewActivity ? FM('module-inactive') : null}
                    style={{ opacity: ViewActivity ? 1 : 0.5 }}
                  >
                    <Link
                      className={classNames({ 'pe-none': ip?.ip_follow_ups_count === 0 })}
                      to={{
                        pathname: getPath('implementations.followups', { ip: ip?.id }),
                        state: { from: 'IP' }
                      }}
                    >
                      <div
                        role='button'
                        className={classNames('text-center', { 'pe-none': !ViewActivity })}
                      >
                        <div className='d-flex justify-content-center mt-1'>
                          <div className='position-relative'>
                            <Badge
                              pill
                              color={ViewActivity ? 'primary' : 'secondary'}
                              className='badge-up'
                            >
                              {countPlus(ip?.ip_follow_ups_count) ?? 0}
                            </Badge>
                            <CheckSquare
                              className='text-secondary'
                              style={{ width: 25, height: 25 }}
                            />
                          </div>
                        </div>
                        <span className='text-dark   fw-bold text-step-title'>
                          {FM('followups')}
                        </span>
                      </div>
                    </Link>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <div
                    onClick={() => {
                      viewIpModal(ip, '6')
                    }}
                    role='button'
                    className='text-center'
                  >
                    <div className='d-flex justify-content-center mt-1'>
                      <div className='position-relative'>
                        <Badge pill color={'primary'} className='badge-up'>
                          {countPlus(ip?.patient?.personCount) ?? 0}
                        </Badge>
                        <PeopleOutlineSharp
                          className='text-secondary'
                          style={{ width: 25, height: 25 }}
                        />
                      </div>
                    </div>
                    <span className='text-dark   fw-bold text-step-title'>{FM('relatives')}</span>
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='animate__animated animate__flipInX p-0 pt-1 pb-1 border-top ip'>
              <Row noGutters className='d-flex align-items-start justify-content-between'>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={patient === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        // if (Can(Permissions.ipSelfEdit)) {
                        if (
                          userType === UserTypes.company ||
                          userType === UserTypes.employee ||
                          userType === UserTypes.branch
                        ) {
                          openEditModal(ip, 1)
                        }

                        // }
                      }}
                      role='button'
                      className='text-center stepCol'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={patient} className='badge-up'></Badge>
                          <User className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                    </div>
                  </BsTooltip>
                </Col>

                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={living === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        if (
                          userType === UserTypes.company ||
                          userType === UserTypes.employee ||
                          userType === UserTypes.branch
                        ) {
                          openEditModal(ip, 2)
                        }
                      }}
                      role='button'
                      className='text-center stepCol'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={living} className='badge-up'></Badge>
                          <Home className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={overall === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        if (
                          userType === UserTypes.company ||
                          userType === UserTypes.employee ||
                          userType === UserTypes.branch
                        ) {
                          openEditModal(ip, 3)
                        }
                      }}
                      role='button'
                      className='text-center stepCol'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={overall} className='badge-up'></Badge>
                          <Award className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                    </div>
                  </BsTooltip>
                </Col>

                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={factors === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        if (
                          userType === UserTypes.company ||
                          userType === UserTypes.employee ||
                          userType === UserTypes.branch
                        ) {
                          openEditModal(ip, 4)
                        }
                      }}
                      role='button'
                      className='text-center stepCol'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={factors} className='badge-up'></Badge>
                          <ThumbsUp className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={treatment === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        if (
                          userType === UserTypes.company ||
                          userType === UserTypes.employee ||
                          userType === UserTypes.branch
                        ) {
                          openEditModal(ip, 5)
                        }
                      }}
                      role='button'
                      className='text-center stepCol'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={treatment} className='badge-up'></Badge>
                          <WorkOutline
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className=''>
                  <BsTooltip
                    role='button'
                    title={files === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        if (
                          userType === UserTypes.company ||
                          userType === UserTypes.employee ||
                          userType === UserTypes.branch
                        ) {
                          openEditModal(ip, 6)
                        }
                      }}
                      role='button'
                      className='text-center'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={files} className='badge-up'></Badge>
                          <File className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
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
      <ActivityModal showModal={showActivity} setShowModal={handleClose} ipRes={[edit]} noView />
      <TaskModal
        showModal={taskModal}
        setShowModal={handleClose}
        resourceType={CategoryType.implementation}
        sourceId={edit?.id}
        ips={edit}
        noView
      />
      <IpDetailModal
        old={isValid(id)}
        step={step}
        showModal={viewModal}
        setShowModal={handleClose}
        ipId={edit?.id}
        noView
      />
      <FollowUpModal showModal={showFollowup} setShowModal={handleClose} ipRes={[edit]} noView />
      <IpStepModal
        users={user?.id}
        path={path}
        edit={edit}
        showModal={showModal}
        setShowModal={handleClose}
        ipId={edit?.id}
        noView
      />
      <IPFilter
        show={ipFilter}
        users={user?.id}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setIpFilter(false)
        }}
      />

      <Header
        subHeading={isValid(id) ? FM('edit-history') : ''}
        title={FM('iP')}
        icon={
          isValid(id) ? (
            <ArrowLeft
              onClick={() => {
                history.goBack()
              }}
              size={25}
            />
          ) : (
            <Rotate90DegreesCcw size='25' />
          )
        }
      >
        <Hide IF={isValid(id)}>
          <ButtonGroup color='dark'>
            <Show IF={Permissions.ipSelfBrowse}>
              <BsTooltip
                title={FM('incomplete')}
                Tag={Button.Ripple}
                size='sm'
                color='danger'
                onClick={() => {
                  setFilterData({
                    status: 1,
                    fromFilter: false
                  })
                }}
              >
                <IndeterminateCheckBoxOutlined style={{ width: 17, height: 17 }} />
                <span className='align-middle ms-25 fw-bolder'>{ip?.total_incompleted ?? 0}</span>
              </BsTooltip>
            </Show>

            <Show IF={Permissions.ipSelfBrowse}>
              <BsTooltip
                title={FM('completed')}
                Tag={Button.Ripple}
                size='sm'
                color='success'
                onClick={() => {
                  setFilterData({
                    status: 2,
                    fromFilter: false
                  })
                }}
              >
                <CheckSquare size={16} />
                <span className='align-middle ms-25 fw-bolder'>{ip?.total_completed ?? 0}</span>
              </BsTooltip>
            </Show>
          </ButtonGroup>
          <Show IF={Permissions.ipSelfBrowse}>
            <BsTooltip
              title={FM('not-approve')}
              Tag={Button.Ripple}
              size='sm'
              className='ms-1'
              color='danger'
              onClick={() => {
                setFilterData({
                  status: 'no',
                  fromFilter: false
                })
              }}
            >
              <CheckCircle style={{ width: 17, height: 17 }} />
              <span className='align-middle ms-25 fw-bolder'>{ip?.total_not_approved ?? 0}</span>
            </BsTooltip>
          </Show>

          {/* Tooltips */}
          <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
          <ButtonGroup color='dark' className='ms-1'>
            {/* <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip> */}
            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <Show IF={Permissions.ipSelfAdd}>
              <UncontrolledTooltip target='create-modal'>{FM('create-new')}</UncontrolledTooltip>
              <IpStepModal
                user={user?.id}
                Component={Button.Ripple}
                size='sm'
                color='primary'
                id='create-modal'
              >
                <Plus size='14' />
              </IpStepModal>
            </Show>
            {/* <Link to="/implementation-plans/create" className='btn btn-outline-dark btn-sm' id="create-button">
                        <Plus size="14" />
                    </Link> */}
            <Button.Ripple
              onClick={() => setIpFilter(true)}
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
                setFilterData({
                  status: 1,
                  fromFilter: false
                })
                setReload(true)
              }}
            >
              <RefreshCcw size='14' />
            </Button.Ripple>
          </ButtonGroup>
        </Hide>
      </Header>

      {/* Render Complete Modal */}
      <CompleteModal
        edit={edit}
        open={completeModal}
        setCompleteModal={setCompleteModal}
        handleCompleteModal={handleCompleteModal}
        refresh={reload}
        setReload={setReload}
        onSuccess={() => {
          setFilterData({
            status: 1,
            fromFilter: false
          })
          setReload(true)
        }}
      />
      {/* Category Types */}
      <TableGrid
        // force={isValid(user) || isValid(id)}
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={isValid(id) ? ipHistoryEdit : loadPatientPlanList}
        jsonData={{
          ...filterData,
          status: filterData?.status,
          user_id: isValid(user?.id) ? user?.id : filterData?.user_id,
          parent_id: isValid(id) ? id : ''
          // patient_id : isValid(user?.id) ? user?.id : filterData?.patient_id
        }}
        selector='ip'
        state='ip'
        display='grid'
        gridCol='6'
        gridView={IpCardView}
      />
    </>
  )
}

export default ImplementationPlan
