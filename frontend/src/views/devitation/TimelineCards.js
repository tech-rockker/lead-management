import { Add, SecurityOutlined } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useState } from 'react'
import {
  Activity,
  AlertCircle,
  Calendar,
  Download,
  Edit,
  Eye,
  Image,
  MoreVertical,
  PenTool,
  Plus,
  Trash2,
  User
} from 'react-feather'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import 'react-vertical-timeline-component/style.min.css'
// ** Reactstrap Imports
import { Card, CardBody, CardFooter, Col, Row } from 'reactstrap'
import { devitationDelete } from '../../redux/reducers/devitation'
import { getPath } from '../../router/RouteHelper'
import {
  addDevitationAction,
  deleteDevitation,
  printDevitation
} from '../../utility/apis/devitation'
import { CategoryType, forDecryption, IconSizes } from '../../utility/Const'
import { FM, isValid, log } from '../../utility/helpers/common'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import Hide from '../../utility/Hide'
import usePackage from '../../utility/hooks/usePackage'
import useUser from '../../utility/hooks/useUser'
import { Permissions } from '../../utility/Permissions'
import Show, { Can } from '../../utility/Show'
import { decryptObject, formatDate, truncateText } from '../../utility/Utils'
import ActivityDetailsModal from '../activity/activityView/activityDetailModal'
import DropDownMenu from '../components/dropdown'
import BsTooltip from '../components/tooltip'
import TaskModal from '../masters/tasks/fragment/TaskModal'
import DeviationDetailModal from './fragment/deviationDetailModal'
import DevitationModal from './fragment/devitationModal'
import SinglePrintDev from './SinglePrintDev'

const TimeLineCards = ({ item: items, setReload, onSuccess = () => {} }) => {
  const pack = usePackage()
  const dispatch = useDispatch()
  const { colors } = useContext(ThemeColors)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddAct, setShowAddAct] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showPatient, setShowPatient] = useState(false)
  const [edit, setEdit] = useState(null)
  const [taskModal, setTaskModal] = useState(false)
  const [sourceId, setSourceId] = useState(false)
  const [devitationModal, setDevitationModal] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showDetail, setShowDetail] = useState(false)
  const [action, setAction] = useState(false)
  const [actionFailed, setActionFailed] = useState(false)
  const user = useUser()
  const [printModal, setPrintModal] = useState(false)
  const handlePrint = () => setPrintModal(!printModal)

  const location = useLocation()
  const notification = location?.state?.notification

  const item = {
    ...items,
    patient: decryptObject(forDecryption, items?.patient),
    branch: decryptObject(forDecryption, items?.branch),
    completed_by: decryptObject(forDecryption, items?.completed_by)
  }

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(false)
      setShowAddAct(false)
      setShowPatient(false)
      setShowAddTask(false)
      setPrintModal(false)
    }
  }

  const handleTaskClose = () => {
    setTaskModal(false)
  }

  const handleDevClose = () => {
    setDevitationModal(false)
  }

  const handleDevDetailsClose = () => {
    setShowDetail(false)
  }

  // useEffect(() => {
  //     if (notification?.data_id) {
  //         setShowDetail(true)
  //         setEdit({
  //             id: notification?.data_id
  //         })
  //     }
  // }, [notification])
  return (
    <>
      <TaskModal
        onSuccess={onSuccess}
        showModal={showAddTask}
        setShowModal={handleClose}
        resourceType={CategoryType.deviation}
        sourceId={edit?.id}
        noView
        activity={edit}
      />
      <DeviationDetailModal
        showModal={showDetail}
        setShowModal={handleDevDetailsClose}
        devitationId={edit?.id}
        noView
      />
      <DevitationModal
        showModal={showAdd}
        setShowModal={handleClose}
        devitationId={edit?.id}
        noView
      />
      <ActivityDetailsModal
        showModal={showAddAct}
        setShowModal={handleClose}
        activityId={edit?.activity_id}
        noView
      />
      <Card className='shadow'>
        <div className='timeline-header pt-1 pb-1'>
          <Row className='align-items-start gx-0'>
            <Col xs='6'>
              <p
                className='h5 fw-bolder text-white mt-0'
                onClick={() => {
                  setShowDetail(true)
                  setEdit(item)
                }}
                role={'button'}
              >
                <User size={20} /> {truncateText(item?.patient?.name, 20)}
              </p>
            </Col>
            <Col xs='6' className='d-flex justify-content-center pe-0'>
              <p className='fw-bolder  mb-0 mt-0 text-large text-white'>
                <Show IF={item?.activity_id !== null}>
                  <BsTooltip
                    title={item?.activity?.title}
                    Tag={'a'}
                    onClick={() => {
                      setShowAddAct(true)
                      setEdit(item)
                    }}
                    role={'button'}
                  >
                    <Activity style={{ width: 22, height: 22 }} className={'text-white'} />
                  </BsTooltip>
                </Show>
                <Show IF={item?.related_factor !== null}>
                  <BsTooltip
                    className='ms-1'
                    Tag={'a'}
                    role={'button'}
                    target={'_blank'}
                    href={item?.related_factor}
                    title={FM('related-factor')}
                  >
                    <Image color={'white'} size='18' />
                  </BsTooltip>
                </Show>
              </p>
            </Col>
          </Row>
        </div>
        <CardBody className=''>
          <Row className='align-items-start pt-1'>
            <Col>
              <h5 className='h4 text-primary fw-bolder mt-3px mb-3px text-capitalize'>
                {truncateText(item?.branch?.branch_name, 35)}
              </h5>
              <Show IF={isValid(item?.category)}>
                <p className='mb-0 mt-0 text-small-12 text-secondary fw-bolder text-truncate '>
                  {truncateText(item?.category?.name, 15)}{' '}
                  {truncateText(item?.subcategory?.name ? '/' : '')}{' '}
                  {truncateText(item?.subcategory?.name, 15)}
                </p>
              </Show>
            </Col>
            <Show IF={item?.is_secret === 1}>
              <Col xs='1' className='d-flex justify-content-end'>
                <h4 className='text-danger fw-bolder'>
                  <BsTooltip title={FM('secret-patient')}>
                    <SecurityOutlined className='danger' />
                  </BsTooltip>
                </h4>
              </Col>
            </Show>
            <Col xs='1' className='d-flex justify-content-end'>
              <DropDownMenu
                tooltip={FM(`menu`)}
                component={
                  <MoreVertical color={colors?.dark?.main} size={IconSizes.MenuVertical} />
                }
                options={[
                  {
                    IF: Permissions.deviationSelfRead,
                    icon: <Eye size={14} />,
                    onClick: () => {
                      setShowDetail(true)
                      setEdit(item)
                    },
                    name: FM('view')
                  },
                  {
                    IF: Can(Permissions.deviationSelfEdit) && item?.is_signed === 0,
                    icon: <Edit size={14} />,
                    onClick: () => {
                      setShowAdd(true)
                      setEdit(item)
                    },
                    name: FM('edit')
                  },
                  {
                    IF: Permissions.taskAdd,
                    icon: <Plus size={14} />,
                    onClick: () => {
                      setShowAddTask(true)
                      setEdit(item)
                    },
                    name: FM('add-task')
                  },
                  {
                    IF: Can(Permissions.deviationPrint) && item?.is_signed === 1,
                    icon: <Download size={14} />,
                    onClick: () => {
                      setPrintModal(true)
                      setEdit(item)
                    },
                    name: FM('export')
                  },
                  {
                    IF: Can(Permissions.deviationSelfDelete) && item?.is_signed === 0,
                    noWrap: true,
                    name: (
                      <ConfirmAlert
                        item={item}
                        title={FM('delete-this', { name: item?.patient?.name })}
                        color='text-warning'
                        onClickYes={() => deleteDevitation({ id: item?.id })}
                        onSuccessEvent={(item) => dispatch(devitationDelete(item?.id))}
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

        <CardBody className='border-top pt-1 pb-1'>
          <Row>
            <Col md='12' className='mb-0'>
              <p className='fw-bolder text-dark mt-0 mb-0'>
                <BsTooltip title={FM('description')}>
                  {truncateText(item?.description, 150)}
                </BsTooltip>
              </p>
            </Col>
            <hr className='mt-1' />
            <Col md='12' className='mb-0 mt-0'>
              <p className='fw-bolder text-dark mb-0 mt-0'>
                <BsTooltip title={FM('immediate-action')}>
                  {truncateText(item?.immediate_action, 150)}
                </BsTooltip>
              </p>
            </Col>
            <Show IF={item?.activity_note}>
              <hr className='mt-1' />
              <Col md='12' className='mb-0 mt-0'>
                <p className='fw-bolder text-dark mb-0 mt-0'>
                  <BsTooltip title={FM('activity-note')}>
                    {truncateText(item?.activity_note, 150)}
                  </BsTooltip>
                </p>
              </Col>
            </Show>
          </Row>
        </CardBody>
        <CardFooter className='border-top pt-1 pb-1'>
          <Row className='d-flex align-items-center justify-content-between'>
            <Col xs='10'>
              <Row className='d-flex align-items-center justify-content-start'>
                <Col xs='3' className='p-0'>
                  <BsTooltip className='ms-1' title={FM('severity-level')}>
                    <span className='mb-0 fw-bolder text-danger'>
                      <AlertCircle
                        size='18'
                        // Inline style was given due to the icon alignment
                        style={{
                          marginBottom: '3px'
                        }}
                      />{' '}
                      : {item?.critical_range}
                    </span>
                  </BsTooltip>
                </Col>
                <Show IF={item.is_completed === 1}>
                  <Col xs='3' className='p-0'>
                    <BsTooltip
                      role='button'
                      className='me-1'
                      title={FM('completed-date-&-completed-by')}
                    >
                      <span className='mb-0 badge p-25 text-small-12 bg-primary me-1'>
                        {formatDate(item?.completed_date, 'YYYY-MM-DD')}, {item?.completed_by?.name}
                      </span>
                      <span className='mb-0 badge p-25 text-small-12 bg-primary me-1'></span>
                    </BsTooltip>
                  </Col>
                </Show>
              </Row>
            </Col>
            <Show IF={Permissions.deviationSelfEdit}>
              <Show IF={item?.is_signed === 1}>
                <Col xs='1' className='d-flex justify-content-end'>
                  <BsTooltip role='button' title={FM('signed')}>
                    <PenTool size='22' className='text-warning me-1' />
                  </BsTooltip>
                </Col>
              </Show>
              <Hide IF={item?.is_completed === 1 && item?.is_signed === 1}>
                <Col xs='1' className='d-flex justify-content-end'>
                  {/* <BsTooltip role="button" title={FM("assign-user")}>
                                    <AssignUserModal setReload={setReload} Component={UserPlus} size="22" color={colors.secondary.main} edit={item} className='me-1' />
                                </BsTooltip>  */}
                  <BsTooltip role='button' title={FM('sign')}>
                    <ConfirmAlert
                      title={FM('complete-this-deviation', { name: item?.patient?.name })}
                      item={item}
                      uniqueEventId={`deviation-event-${item?.id}`}
                      enableNo
                      confirmButtonText={'via-bank-id'}
                      disableConfirm={
                        !isValid(user?.personal_number) || pack?.is_enable_bankid_charges === 0
                      }
                      textClass='text-danger fw-bold text-small-12'
                      text={
                        !isValid(user?.personal_number)
                          ? 'please-add-your-personal-number'
                          : 'how-would-you-like-to-sign'
                      }
                      denyButtonText={'normal'}
                      color='text-warning'
                      successTitle={FM('signed')}
                      successText={FM('deviation-is-signed')}
                      onClickYes={() =>
                        addDevitationAction({
                          jsonData: {
                            signed_method: 'bankid',
                            id: item?.id,
                            is_signed: 1,
                            deviation_ids: [item?.id]
                          }
                        })
                      }
                      onClickNo={() =>
                        addDevitationAction({
                          jsonData: {
                            signed_method: null,
                            id: item?.id,
                            is_signed: 1,
                            deviation_ids: [item?.id]
                          }
                        })
                      }
                      onSuccessEvent={(e) => {
                        log(item?.id, 'e', e)
                        dispatch(devitationDelete(e?.id))
                      }}
                      className=''
                      id={`grid-delete-${item?.id}`}
                    >
                      <PenTool size='22' className='me-1' />
                    </ConfirmAlert>
                  </BsTooltip>
                </Col>
              </Hide>
            </Show>
          </Row>
        </CardFooter>
      </Card>
      <SinglePrintDev
        printModal={printModal}
        setPrintModal={setPrintModal}
        handlePrint={handlePrint}
        patient_id={item?.patient_id}
        deviation_id={item?.id}
        is_secret={item?.is_secret}
      />
    </>
  )
}

export default TimeLineCards
