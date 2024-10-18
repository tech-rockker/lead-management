import Avatar from '@components/avatar'
import {
  Accessibility,
  Add,
  Category,
  Comment,
  RadioButtonChecked,
  RadioButtonUnchecked,
  ShareRounded,
  Warning
} from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Calendar,
  Eye,
  MoreVertical,
  Plus,
  RefreshCcw,
  Send,
  Sliders,
  Tag,
  Trash2,
  Users
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
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
import { deleteActivity, loadActivity } from '../../utility/apis/activity'
import { forDecryption, IconSizes } from '../../utility/Const'
// ** Styles
import { activityDelete } from '../../redux/reducers/activity'
import { FM } from '../../utility/helpers/common'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../utility/Permissions'
import Show from '../../utility/Show'
import { decryptObject, formatDate, SuccessToast } from '../../utility/Utils'
import DropDownMenu from '../components/dropdown'
import TableGrid from '../components/tableGrid'
import BsTooltip from '../components/tooltip'
import Header from '../header'
import TaskModal from '../masters/tasks/fragment/TaskModal'
import ActivityFilter from './activityFilter'
import ActivityDetailsModal from './activityView/activityDetailModal'
import ActivityModal from './fragment/activityModal'
import AssignUserModal from './modals/assignUserModal'
import CommentModule from './modals/commentModal'
import CompletedModal from './modals/CompletedModal'
import NotApplicable from './modals/NotApplicableModal'

const CompanyTypes = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [activityFilter, setActivityFilter] = useState(false)
  const [edit, setEdit] = useState(null)
  const [status, setStatus] = useState()
  const [deleted, setDeleted] = useState(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [assignModal, setAssignModal] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

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

  const handleClose = (e) => {
    if (e === false) {
      setAssignModal(e)
      setAssignModal(null)
      setShowAdd(false)
      setShowDetails(false)
      setShowAddTask(false)
    }
  }

  const gridView = (data, index) => {
    const item = decryptObject(forDecryption, data)
    // branch: decryptObject(forDecryption, data?.branch)

    return (
      <>
        <Card
          className={classNames({
            'card-app-design animate__animated animate__bounceIn': index === 0 && item.id === added
          })}
        >
          <CardBody>
            <Row>
              <Col xs='10'>
                <CardTitle className='mb-75 text-capitalize'>{item?.title}</CardTitle>
              </Col>
              <Col xs='2' className='d-flex align-items-center justify-content-end pe-1'>
                <DropDownMenu
                  tooltip={FM(`menu`)}
                  component={
                    <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                  }
                  options={[
                    {
                      IF: Permissions.activitySelfRead,
                      icon: <Eye size={14} />,
                      onClick: () => {
                        setShowDetails(true)
                        setEdit(item)
                      },
                      name: FM('view')
                    },
                    {
                      IF: Permissions.activitySelfEdit,
                      icon: <Send size={14} />,
                      onClick: () => {
                        setShowAdd(true)
                        setEdit(item)
                      },
                      name: FM('edit')
                    },
                    // {
                    //     icon: <Send size={14} />,
                    //     to: { pathname: getPath('activity.update', { id: item.id }), state: { data: item } },
                    //     name: FM("edit")
                    // },

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
                      IF: Permissions.activitySelfDelete,
                      noWrap: true,
                      name: (
                        <ConfirmAlert
                          item={item}
                          title={FM('delete-this', { name: item?.title })}
                          color='text-warning'
                          onClickYes={() => deleteActivity({ id: item?.id })}
                          onSuccessEvent={(item) => {
                            dispatch(activityDelete(item?.id))
                          }}
                          className='dropdown-item'
                          id={`grid-delete-${item?.id}`}
                        >
                          <Trash2 size={14} />
                          <span className='ms-1'>{FM('delete')}</span>
                        </ConfirmAlert>
                      )
                    }
                    // {
                    //     icon: <Lock size={14} />,
                    //     name: FM("Hello"),
                    //     onClick: () => {

                    //     }
                    // },
                    // {
                    //     icon: <MessageSquare size={14} />,
                    //     name: FM("Message"),
                    //     onClick: () => {

                    //     }
                    // }
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='design-planning-wrapper '>
                  <div key={item.category} className='design-planning'>
                    <Row>
                      <Col md='1'>
                        <UncontrolledTooltip target='phones'>{FM('category')}</UncontrolledTooltip>
                        <Avatar
                          className='gradient-shadow-primary rounded'
                          id='phones'
                          icon={<Category size={14} />}
                        />
                      </Col>
                      <Col md='9' style={{ marginTop: '6px' }}>
                        <h6 className='mb-0' style={{ marginLeft: '15px' }}>
                          {item?.category?.name}
                        </h6>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='design-planning-wrapper '>
                  <div key={item.ip} className='design-planning'>
                    <Row>
                      <Col md='1'>
                        <UncontrolledTooltip target='ip'>{FM('ip')}</UncontrolledTooltip>
                        <Avatar
                          className='gradient-shadow-secondary rounded'
                          id='ip'
                          icon={<Accessibility size={14} />}
                        />
                      </Col>
                      <Col md='9' style={{ marginTop: '6px' }}>
                        <h6 className='mb-0' style={{ marginLeft: '15px' }}>
                          {item?.implementation_plan?.title}
                        </h6>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='design-planning-wrapper '>
                  <div key={item.start_date} className='design-planning'>
                    <Row>
                      <Col md='1'>
                        <UncontrolledTooltip target='phone'>{FM('start-date')}</UncontrolledTooltip>
                        <Avatar
                          className='gr-box-info rounded'
                          id='phone'
                          icon={<Calendar size={14} />}
                        />
                      </Col>
                      <Col md='9' style={{ marginTop: '6px' }}>
                        <h6 className='mb-0' style={{ marginLeft: '15px' }}>
                          {formatDate(item?.start_date, 'DD MMMM, YYYY')}
                        </h6>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='design-planning-wrapper '>
                  <div key={item.end_date} className='design-planning'>
                    <Row>
                      <Col md='1'>
                        <UncontrolledTooltip target='email'>{FM('end-date')}</UncontrolledTooltip>
                        <Avatar
                          className='gr-box-black rounded'
                          id='email'
                          icon={<Calendar size={14} />}
                        />
                      </Col>
                      <Col md='9' style={{ marginTop: '6px' }}>
                        <h6 className='mb-0' style={{ marginLeft: '15px' }}>
                          {formatDate(item?.end_date, 'DD MMMM, YYYY')}
                        </h6>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
            <div className='d-flex  justify-content-start align-items-end mt-2'>
              {item?.status !== 1 ? (
                <BsTooltip Tag={Link} title={FM('mark-as-complete')} role={'button'}>
                  <CompletedModal
                    edit={item}
                    Component={RadioButtonUnchecked}
                    color={colors.warning.main}
                    size='18'
                  />
                </BsTooltip>
              ) : (
                <BsTooltip
                  Tag={Link}
                  title={FM('completed')}
                  onClick={() => SuccessToast('activity-already-completed')}
                  role={'button'}
                >
                  <RadioButtonChecked color={colors.primary.main} size='18' />
                </BsTooltip>
              )}
              <BsTooltip className='ms-1' title={FM('comment')} role={'button'}>
                <CommentModule edit={item} Component={Comment} color={colors.info.main} size='18' />
              </BsTooltip>
              {item?.status !== 3 ? (
                <BsTooltip
                  className='ms-1'
                  Tag={Link}
                  title={FM('mark-as-not-applicable')}
                  role={'button'}
                >
                  <NotApplicable
                    edit={item}
                    Component={Warning}
                    color={colors.warning.main}
                    size='18'
                  />
                </BsTooltip>
              ) : (
                <BsTooltip className='ms-1' Tag={Link} title={FM('not-applicable')} role={'button'}>
                  <Warning color={'secondary'} size='18' />
                </BsTooltip>
              )}
              <BsTooltip
                className='ms-1'
                Tag={Link}
                title={FM('tag')}
                role={'button'}
                to={{
                  pathname: getPath('companies.detail', { id: item.id }),
                  state: { data: item }
                }}
              >
                <Tag color={colors.primary.main} size='18' />
              </BsTooltip>
              <BsTooltip className='ms-1' title={FM('assign-activity')}>
                <AssignUserModal Component={ShareRounded} size='18' color='primary' edit={item} />
              </BsTooltip>
              {item.is_risk === 1 ? (
                <BsTooltip className='ms-1' title={FM('Risky')}>
                  <div className='heart'>
                    <svg width='30' height='30' viewBox='0 0 200 200' style={{ marginTop: '30px' }}>
                      <g transform='translate(100 100)'>
                        <path
                          transform='translate(-50 -50)'
                          fill='red'
                          d='M92.71,7.27L92.71,7.27c-9.71-9.69-25.46-9.69-35.18,0L50,14.79l-7.54-7.52C32.75-2.42,17-2.42,7.29,7.27v0 c-9.71,9.69-9.71,25.41,0,35.1L50,85l42.71-42.63C102.43,32.68,102.43,16.96,92.71,7.27z'
                        ></path>
                        <animateTransform
                          attributeName='transform'
                          type='scale'
                          values='1; 1.5; 1.25; 1.5; 1.5; 1;'
                          dur='1s'
                          repeatCount='indefinite'
                          additive='sum'
                        ></animateTransform>
                      </g>
                    </svg>
                  </div>
                </BsTooltip>
              ) : null}
            </div>
          </CardBody>
        </Card>
      </>
    )
  }
  return (
    <>
      <ActivityDetailsModal
        showModal={showDetails}
        setShowModal={handleClose}
        activityId={edit?.id}
        noView
      />
      <ActivityModal showModal={showAdd} setShowModal={handleClose} activityId={edit?.id} noView />
      <TaskModal
        showModal={showAddTask}
        setShowModal={handleClose}
        noView
        activity={edit}
        activityId={edit?.id}
      />
      <ActivityFilter
        show={activityFilter}
        setFilterData={setFilterData}
        filterData={filterData}
        handleFilterModal={() => {
          setActivityFilter(false)
        }}
      />
      <Header icon={<Users size='25' />} subHeading={FM('all-activity')}>
        {/* Tooltips */}
        <ButtonGroup color='dark'>
          <Show IF={Permissions.activitySelfBrowse}>
            <UncontrolledTooltip target='upcoming'>{FM('upcoming')}</UncontrolledTooltip>
            <Button.Ripple
              className='btn btn-info btn-sm '
              onClick={() => {
                setStatus(0)
                setReload(true)
              }}
              id='upcoming'
            >
              {FM('upcoming')}
            </Button.Ripple>
          </Show>
          <Show IF={Permissions.activitySelfBrowse}>
            <UncontrolledTooltip target='done'>{FM('done')}</UncontrolledTooltip>
            <Button.Ripple
              className='btn btn-success btn-sm '
              onClick={() => {
                setFilterData({
                  status: 1
                })
                setReload(true)
              }}
              id='done'
            >
              {FM('done')}
            </Button.Ripple>
          </Show>
          <Show IF={Permissions.activitySelfBrowse}>
            <UncontrolledTooltip target='pending'>{FM('pending')}</UncontrolledTooltip>
            <Button.Ripple
              size='sm'
              className='btn btn-warning btn-sm '
              onClick={() => {
                setFilterData({
                  status: 2
                })
                setReload(true)
              }}
              id='pending'
            >
              {FM('pending')}
            </Button.Ripple>
          </Show>
          <Show IF={Permissions.activitySelfBrowse}>
            <UncontrolledTooltip target='not-applicable'>
              {FM('not-applicable')}
            </UncontrolledTooltip>
            <Button.Ripple
              size='sm'
              className='btn btn-danger btn-sm '
              onClick={() => {
                setFilterData({
                  status: 3
                })
                setReload(true)
              }}
              id='not-applicable'
            >
              {FM('not-applicable')}
            </Button.Ripple>
          </Show>
          <Show IF={Permissions.activitySelfAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <ActivityModal
              Component={Button.Ripple}
              className='btn btn-primary btn-sm'
              size='sm'
              outline
              color='dark'
              id='create-button'
            >
              <Plus size='14' />
            </ActivityModal>
          </Show>
          <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
          <Button.Ripple
            onClick={() => setActivityFilter(true)}
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
              setReload(true)
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
        loadFrom={loadActivity}
        jsonData={{
          ...filterData
        }}
        selector='activity'
        state='activities'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default CompanyTypes
