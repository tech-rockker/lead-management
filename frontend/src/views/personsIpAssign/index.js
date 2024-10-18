import {
  Category,
  Class,
  Hotel,
  PeopleOutlineSharp,
  RadioButtonCheckedOutlined
} from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Activity,
  Calendar,
  CheckCircle,
  CheckSquare,
  Edit,
  Eye,
  Lock,
  MessageSquare,
  MoreVertical,
  Plus,
  Radio,
  RefreshCcw,
  Send,
  Sliders,
  Trash2,
  Users
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { getPath } from '../../router/RouteHelper'
import { loadApprovalList } from '../../utility/apis/approval'
import {
  deletePatientPlan,
  loadApprovedPatientPlan,
  loadPatientPlanList
} from '../../utility/apis/ip'
import { IconSizes } from '../../utility/Const'
import Avatar from '@components/avatar'
// ** Styles
import { FM, isValid, isValidArray } from '../../utility/helpers/common'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import Hide from '../../utility/Hide'
import Show, { Can } from '../../utility/Show'
import {
  countPlus,
  formatDate,
  JsonParseValidate,
  numberFormat,
  truncateText,
  WarningToast
} from '../../utility/Utils'
import DropDownMenu from '../components/dropdown'
import TableGrid from '../components/tableGrid'
import MiniTable from '../components/tableGrid/miniTable'
import BsTooltip from '../components/tooltip'
import Header from '../header'
import ApprovalModal from './Modal/ApprovalModal'
import { Permissions } from '../../utility/Permissions'
import BsPopover from '../components/popover'
import IpDetailModal from '../masters/ip/fragment/ipDetailModal'
import { patientPlanUpdate } from '../../redux/reducers/ip'

const ImplementationPlan = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [ipFilter, setIpFilter] = useState(false)
  const params = useParams()
  const prent = parseInt(params?.id)
  const [filterData, setFilterData] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [viewModal, setViewModal] = useState(false)

  const handleClose = (e) => {
    // setAssignModal(e)
    // setAssignModal(null)
    setShowAdd(false)
  }

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  const IpCardView = (item, index) => {
    const ip = item?.type_id_Data?.ip
    return (
      <>
        <div className='flex-1' key={`ip-${index}`}>
          <Card>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='10' className='d-flex align-items-center'>
                  <div className='flex-1'>
                    <h5 className='mb-3px fw-bolder text-primary text-truncate'>
                      <span className='position-relative'>{ip?.title}</span>
                    </h5>
                    <p className='mb-3px text-small-12 text-dark fw-bolder text-truncate'>
                      {ip?.category?.name} {ip?.category?.name ? '/' : ''} {ip?.subcategory?.name}
                    </p>
                    <p
                      className={classNames('mb-0 text-small-12  text-truncate', {
                        'text-success': isValid(ip?.approved_date),
                        'text-danger': !isValid(ip?.approved_date)
                      })}
                    >
                      {isValid(ip?.approved_date) ? FM('approved') : FM('not-approved')}
                    </p>
                  </div>
                </Col>
                <Col xs='1' className='d-flex align-items-center justify-content-center'>
                  <BsTooltip
                    title={isValid(ip?.approved_date) ? FM('ip-approved') : FM('ip-not-approved')}
                  >
                    <CheckCircle
                      size={28}
                      className={classNames('text-secondary', {
                        'text-success': isValid(ip?.approved_date)
                      })}
                    />
                  </BsTooltip>
                </Col>
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
                        IF: Can(Permissions.requestsAdd) && !isValid(ip?.approved_date),
                        icon: <CheckSquare size={14} />,
                        name: (
                          <ConfirmAlert
                            item={item}
                            title={FM('approve', { name: item?.what_happened })}
                            text={FM('click-yes-to-approve-ip')}
                            color='text-warning'
                            failedTitle={'ip-approve-failed'}
                            failedText={'please-retry-after-sometime'}
                            successTitle={'ip-approved'}
                            successText={'ip-approved-successfully'}
                            onClickYes={() =>
                              loadApprovedPatientPlan({
                                id: item?.request_type_id,
                                jsonData: { id: item?.request_type_id, rid: item?.id }
                              })
                            }
                            onSuccessEvent={(item) => dispatch(patientPlanUpdate(item))}
                            className=''
                            id={`grid-approve-${item?.id}`}
                          >
                            {FM('approve')}
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
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('patient')}</p>
                  <p role={'button'} className='mb-0 fw-bold text-secondary text-truncate'>
                    {ip?.patient?.name ?? 'N/A'}
                  </p>
                </Col>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-date')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    {formatDate(ip?.start_date, 'DD MMMM, YYYY') ?? 'N/A'}
                  </p>
                </Col>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('end-date')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    {formatDate(ip?.end_date, 'DD MMMM, YYYY') ?? 'N/A'}
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className=' border-top'>
              <Row className='align-items-center gy-2'>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('limitation')}</p>
                  <BsPopover
                    title={FM('limitation-info')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(ip?.limitation_details, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    {ip?.limitations
                      ? FM(ip?.limitations)
                      : truncateText(ip?.limitations, 50) ?? 'N/A'}
                  </BsPopover>
                </Col>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('goal')}</p>
                  <BsPopover
                    title={FM('goal-info')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(ip?.goal, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    {ip?.goal ? truncateText(ip?.goal, 50) : 'N/A'}
                  </BsPopover>
                </Col>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('sub-goal')}</p>
                  <BsPopover
                    title={FM('sub-goal-info')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(ip?.sub_goal, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    {ip?.sub_goal_selected
                      ? FM(ip?.sub_goal_selected)
                      : truncateText(ip?.sub_goal, 50) ?? 'N/A'}
                  </BsPopover>
                </Col>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('overall-goal')}</p>
                  <BsPopover
                    title={FM('overall-goal-info')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(ip?.overall_goal_details, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    {ip?.overall_goal
                      ? FM(ip?.overall_goal)
                      : truncateText(ip?.overall_goal_details, 50) ?? 'N/A'}
                  </BsPopover>
                </Col>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('working')}</p>
                  <BsPopover
                    title={FM('working-info')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(ip?.working_method, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    {ip?.working_method ? truncateText(ip?.working_method, 50) : 'N/A'}
                  </BsPopover>
                </Col>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('treatment')}</p>
                  <BsPopover
                    title={FM('treatment-info')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(ip?.treatment, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    {ip?.treatment ? truncateText(ip?.treatment, 50) : 'N/A'}
                  </BsPopover>
                </Col>
              </Row>
              <Row className='border-top pt-2 mt-2'>
                <Col md='4'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('who-will-give-support')}</p>
                  <BsPopover
                    title={FM('who-will-give-support')}
                    role='button'
                    Tag={'p'}
                    className='mb-0 fw-bold text-secondary text-truncate mt-3px'
                  >
                    {isValidArray(JsonParseValidate(ip?.who_give_support))
                      ? JsonParseValidate(ip?.who_give_support)?.map((d, i) => {
                          return (
                            <>
                              <Badge className='text-capitalize me-1' color='light-primary'>
                                {d}
                              </Badge>
                            </>
                          )
                        })
                      : 'N/A'}
                  </BsPopover>
                </Col>
                <Col md='8'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('how-will-support')}</p>
                  <BsPopover
                    title={FM('how-will-support')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(ip?.how_support_should_be_given, 200)}
                    className='mb-0 fw-bold text-secondary text-truncate mt-3px'
                  >
                    {ip?.how_support_should_be_given
                      ? truncateText(ip?.how_support_should_be_given, 50)
                      : 'N/A'}
                  </BsPopover>
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
      <IpDetailModal showModal={viewModal} setShowModal={handleClose} ipId={edit?.id} noView />

      <ApprovalModal
        edit={edit}
        disableSave
        showModal={showAdd}
        setShowModal={handleClose}
        color={colors.info.main}
        size='18'
      />
      <Header icon={<Users size='25' />}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <ButtonGroup color='dark'>
          {/* <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip> */}
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>

          {/* <IpStepModal Component={Button.Ripple} size="sm" outline color="dark" id="create-modal">
                        <Plus size="14" />
                    </IpStepModal> */}
          {/* <Link to="/implementation-plans/create" className='btn btn-outline-dark btn-sm' id="create-button">
                        <Plus size="14" />
                    </Link> */}
          <Button.Ripple onClick={() => setIpFilter(true)} size='sm' color='secondary' id='filter'>
            <Sliders size='14' />
          </Button.Ripple>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setReload(true)
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
        loadFrom={loadApprovalList}
        jsonData={{
          user_id: 273,
          ...filterData
        }}
        selector='approval'
        state='approval'
        display='grid'
        gridCol='6'
        gridView={IpCardView}
      />
    </>
  )
}

export default ImplementationPlan
