import { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import { IndeterminateCheckBoxOutlined } from '@material-ui/icons'
import 'react-vertical-timeline-component/style.min.css'
import classNames from 'classnames'
import {
  Activity,
  ArrowLeft,
  ArrowUp,
  CheckSquare,
  ChevronsDown,
  Clock,
  FileText,
  Flag,
  Plus,
  RefreshCcw,
  Sliders,
  X
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchActivity } from '../../../redux/reducers/activity'
import { getPath } from '../../../router/RouteHelper'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import {
  countPlus,
  decryptObject,
  formatDate,
  isGreaterThanToday,
  JsonParseValidate,
  minusDay
} from '../../../utility/Utils'
import ActivityFilter from '../../activity/activityFilter'
import ActivityDetailsModal from '../../activity/activityView/activityDetailModal'
import ActivityModal from '../../activity/fragment/activityModal'
import CommentModal from '../../activity/modals/commentModal'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import TaskModal from '../tasks/fragment/TaskModal'
import TimeLineCard from './TimeLineCard'
import TimelineShimmer from './timelineShimmer'
import { UserTypes, forDecryption } from '../../../utility/Const'
import useUserType from '../../../utility/hooks/useUserType'

const BasicTimeline = ({ filters = {}, noHeader = false, noFilter = false, user = null }) => {
  const dispatch = useDispatch()
  const param = useParams()
  const location = useLocation()
  const { activities: activitiesTemp, loadingMore, end } = useSelector((s) => s.activity)
  const ip = param?.id
  const ipData = location?.state?.ip
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [reload, setReload] = useState(false)
  const [edit, setEdit] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const userType = useUserType()
  const [filterData, setFilterData] = useState({
    status: 0,
    start_date: formatDate(new Date(), 'YYYY-MM-DD')
  })

  const [showAdd, setShowAdd] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showComment, setShowComment] = useState(false)

  const notification = location?.state?.notification

  const loadActivities = () => {
    dispatch(
      fetchActivity({
        page,
        perPage,
        loadMore: page > 1,
        jsonData: {
          ...filterData,
          status:
            filterData?.status === 4 ? null : filterData?.status === 5 ? null : filterData?.status,
          patient_id: filterData?.patient_id ? filterData?.patient_id : user?.id,
          ip_id: isValid(ip) ? ip : filterData?.ip_id,
          ...filters
        }
      })
    )
    setReload(false)
  }

  useEffect(() => {
    loadActivities()
  }, [filterData, page, perPage])

  useEffect(() => {
    if (reload) {
      loadActivities()
    }
  }, [reload])

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(false)
      setShowDetails(false)
      setShowAddTask(false)
      setShowComment(false)
    }
  }

  useEffect(() => {
    if (notification?.data_id && notification?.type === 'comment') {
      setShowComment(true)
      setEdit({
        id: notification?.data_id,
        title: JsonParseValidate(notification?.extra_param)?.title
      })
    } else if (notification?.data_id && notification?.event === 'activity-marked-not-applicable') {
      setEdit({
        id: notification?.data_id,
        start_date: JsonParseValidate(notification?.extra_param)?.start_date
      })
      const status = JsonParseValidate(notification?.extra_param)?.status
      if (status === 3) {
        setFilterData({
          ...filterData,
          old: false,
          status: 3,
          with_journal: 0,
          with_deviation: 0,
          end_date: '',
          start_date: formatDate(new Date(), 'YYYY-MM-DD')
        })
      }
    } else if (notification?.data_id && notification?.event === 'activity-marked-not-done') {
      setEdit({
        id: notification?.data_id,
        start_date: JsonParseValidate(notification?.extra_param)?.start_date
      })
      const status = JsonParseValidate(notification?.extra_param)?.status
      if (status === 2) {
        setFilterData({
          ...filterData,
          old: false,
          status: 2,
          with_journal: 0,
          with_deviation: 0,
          end_date: '',
          start_date: formatDate(new Date(), 'YYYY-MM-DD')
        })
      }
    } else if (notification?.data_id && notification?.event === 'activity-marked-done') {
      setEdit({
        id: notification?.data_id,
        start_date: JsonParseValidate(notification?.extra_param)?.start_date
      })
      const status = JsonParseValidate(notification?.extra_param)?.status
      if (status === 1) {
        setFilterData({
          ...filterData,
          old: false,
          status: 1,
          with_journal: 0,
          with_deviation: 0,
          end_date: '',
          start_date: formatDate(new Date(), 'YYYY-MM-DD')
        })
      }
    } else if (notification?.data_id && notification?.type === 'activity') {
      setShowDetails(true)
      setEdit({
        id: notification?.data_id
      })
    }
    window.history.replaceState({ fffff: 'kj' }, document.title)
  }, [notification])

  const getTitle = () => {
    if (filterData?.filter) {
      let a = ''
      if (filterData.status === 0) {
        a = filterData?.old ? FM('no-action-performed') : FM('upcoming-activity')
      } else if (filterData.status === 1) {
        a = FM('done-activity')
      } else if (filterData.status === 2) {
        a = FM('not-done-activity')
      } else if (filterData.status === 3) {
        a = FM('not-applicable-activity')
      } else if (filterData.status === 4) {
        a = FM('journal-activity')
      } else if (filterData.status === 5) {
        a = FM('deviation-activity')
      }
      return `${FM('filtered-activity')}: ${a}`
    } else {
      if (filterData.status === 0) {
        return filterData?.old ? FM('no-action-performed') : FM('upcoming-activity')
      } else if (filterData.status === 1) {
        return FM('done-activity')
      } else if (filterData.status === 2) {
        return FM('not-done-activity')
      } else if (filterData.status === 3) {
        return FM('not-applicable-activity')
      } else if (filterData.status === 4) {
        return FM('journal-activity')
      } else if (filterData.status === 5) {
        return FM('deviation-activity')
      }
    }
  }
  // log(activitiesTemp)
  const activities = {
    ...activitiesTemp,
    data: activitiesTemp?.data?.map((a) => ({
      ...a,
      patient: decryptObject(forDecryption, a?.patient),
      branch: decryptObject(forDecryption, a?.branch)
    }))
  }
  // log(activities)
  return (
    <>
      <CommentModal
        showModal={showComment}
        setShowModal={handleClose}
        edit={edit?.id}
        activity={edit}
        noView
      />
      <ActivityDetailsModal
        showModal={showDetails}
        setShowModal={handleClose}
        activityId={edit?.id}
        noView
      />
      <ActivityModal showModal={showAdd} setShowModal={handleClose} user={user?.id} noView />
      <TaskModal showModal={showAddTask} setShowModal={handleClose} noView />
      <ActivityFilter
        show={showFilter}
        setFilterData={(e) => {
          setFilterData({
            ...e,
            filter: true,
            status: e?.with_deviation === 1 ? 5 : e?.with_journal === 1 ? 4 : e?.status
          })
        }}
        filterData={filterData}
        handleFilterModal={() => {
          setShowFilter(false)
        }}
      />

      <Header
        title={<>{getTitle()}</>}
        titleCol='5'
        childCol='7'
        icon={
          isValid(ip) ? (
            <Link to={getPath('implementations')}>
              <ArrowLeft />
            </Link>
          ) : (
            <Activity />
          )
        }
        subHeading={
          <>
            <span className='fw-bolder text-dark'>
              {formatDate(
                isValid(filterData?.start_date)
                  ? new Date(filterData?.start_date)
                  : filterData?.old
                  ? new Date(activities?.startDate ?? '')
                  : new Date(activities?.startDate ? activities?.startDate : new Date()),
                'YYYY-MM-DD'
              )}
            </span>
            <Show IF={isValid(filterData?.end_date) && filterData?.filter}>
              <span className='fw-bolder text-dark'>
                {' - '}
                {formatDate(new Date(filterData?.end_date), 'YYYY-MM-DD')}
              </span>
            </Show>
          </>
        }
        description={
          <>
            <span className='text-dark fw-bolder'>
              {isValid(ip) ? (
                <>
                  {FM('iP')}: {ipData?.title}{' '}
                </>
              ) : (
                ''
              )}
            </span>
          </>
        }
      >
        <Show IF={activities?.total_activities_time_passed > 0}>
          <ButtonGroup color='dark' className='me-1'>
            <Show IF={Permissions.activitySelfBrowse}>
              <BsTooltip
                title={FM('no-action-performed')}
                Tag={Button.Ripple}
                size='sm'
                color='danger'
                className='blink'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    old: true,
                    filter: false,
                    status: 0,
                    start_date: '',
                    end_date: formatDate(minusDay(new Date(), 1), 'YYYY-MM-DD')
                  })
                }}
              >
                <Activity size={16} />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(activities?.total_activities_time_passed)}
                </span>
              </BsTooltip>
            </Show>
          </ButtonGroup>
        </Show>
        {/* Tooltips */}
        <ButtonGroup color='dark'>
          <Show IF={Permissions.activitySelfBrowse}>
            <BsTooltip
              title={FM('upcoming')}
              Tag={Button.Ripple}
              size='sm'
              color='primary'
              onClick={() => {
                setPage(1)
                setFilterData({
                  ...filterData,
                  status: 0,
                  old: false,
                  with_journal: 0,
                  with_deviation: 0,
                  end_date: filterData?.filter ? filterData?.end_date : '',
                  start_date: filterData?.filter
                    ? filterData?.start_date
                    : formatDate(new Date(), 'YYYY-MM-DD')
                })
              }}
            >
              <Clock size={16} />
              <span className='align-middle ms-25 fw-bolder'>
                {countPlus(activities?.total_pending)}
              </span>
            </BsTooltip>
          </Show>
          <Show IF={userType !== UserTypes.patient}>
            <Show IF={Permissions.activitySelfBrowse}>
              <BsTooltip
                title={FM('not-done')}
                Tag={Button.Ripple}
                size='sm'
                color='danger'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    ...filterData,
                    old: false,
                    end_date: filterData?.filter ? filterData?.end_date : '',
                    start_date: filterData?.filter
                      ? filterData?.start_date
                      : formatDate(new Date(), 'YYYY-MM-DD'),

                    status: 2,
                    with_journal: 0,
                    with_deviation: 0
                  })
                }}
              >
                <IndeterminateCheckBoxOutlined style={{ width: 17, height: 17 }} />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(activities?.total_not_done)}
                </span>
              </BsTooltip>
            </Show>
          </Show>
          <Show IF={Permissions.activitySelfBrowse}>
            <BsTooltip
              title={FM('done')}
              Tag={Button.Ripple}
              size='sm'
              color='success'
              onClick={() => {
                setPage(1)
                setFilterData({
                  ...filterData,
                  status: 1,
                  with_journal: 0,
                  with_deviation: 0,
                  end_date: filterData?.filter ? filterData?.end_date : '',
                  start_date: filterData?.filter
                    ? filterData?.start_date
                    : formatDate(new Date(), 'YYYY-MM-DD'),
                  old: false
                })
              }}
            >
              <CheckSquare size={16} />
              <span className='align-middle ms-25 fw-bolder'>
                {countPlus(activities?.total_done)}
              </span>
            </BsTooltip>
          </Show>
          <Show IF={Permissions.activitySelfBrowse}>
            <BsTooltip
              title={FM('not-applicable')}
              Tag={Button.Ripple}
              size='sm'
              color='secondary'
              onClick={() => {
                setPage(1)
                setFilterData({
                  ...filterData,
                  old: false,
                  status: 3,
                  with_journal: 0,
                  with_deviation: 0,
                  end_date: filterData?.filter ? filterData?.end_date : '',
                  start_date: filterData?.filter
                    ? filterData?.start_date
                    : formatDate(new Date(), 'YYYY-MM-DD')
                })
              }}
            >
              <X size={16} />
              <span className='align-middle ms-25 fw-bolder'>
                {countPlus(activities?.total_not_applicable)}
              </span>
            </BsTooltip>
          </Show>
        </ButtonGroup>
        <ButtonGroup color='dark' className='ms-1'>
          <Show IF={Permissions.journalSelfBrowse}>
            <BsTooltip
              title={FM('journals')}
              Tag={Button.Ripple}
              size='sm'
              color='info'
              onClick={() => {
                setPage(1)
                setFilterData({
                  ...filterData,
                  with_journal: 1,
                  with_deviation: 0,
                  old: false,
                  status: 4,
                  end_date: filterData?.filter ? filterData?.end_date : '',
                  start_date: filterData?.filter
                    ? filterData?.start_date
                    : formatDate(new Date(), 'YYYY-MM-DD')
                })
              }}
            >
              <FileText size={16} />
              <span className='align-middle ms-25 fw-bolder'>
                {countPlus(activities?.today_created_journal)}
              </span>
            </BsTooltip>
          </Show>
          <Show IF={Permissions.deviationSelfBrowse}>
            <BsTooltip
              title={FM('deviations')}
              Tag={Button.Ripple}
              size='sm'
              color='danger'
              onClick={() => {
                setPage(1)
                setFilterData({
                  ...filterData,
                  status: 5,
                  old: false,
                  with_deviation: 1,
                  with_journal: 0,
                  end_date: filterData?.filter ? filterData?.end_date : '',
                  start_date: filterData?.filter
                    ? filterData?.start_date
                    : formatDate(new Date(), 'YYYY-MM-DD')
                })
              }}
            >
              <Flag size={16} />
              <span className='align-middle ms-25 fw-bolder'>
                {countPlus(activities?.today_created_deviation)}
              </span>
            </BsTooltip>
          </Show>
        </ButtonGroup>
        <ButtonGroup className='ms-1' color='dark'>
          <Show IF={Permissions.activitySelfAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <ActivityModal
              user={user?.id}
              onSuccess={(e) => {
                setPage(1)
                loadActivities()
              }}
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
          <Hide IF={noFilter}>
            <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple
              onClick={() => setShowFilter(true)}
              size='sm'
              color='secondary'
              id='filter'
            >
              <Sliders size='14' />
            </Button.Ripple>
          </Hide>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setPage(1)
              setFilterData({
                status: 0,
                start_date: formatDate(new Date(), 'YYYY-MM-DD'),
                end_date: '',
                with_journal: 0,
                with_deviation: 0,
                filter: false,

                ...filters
              })
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      <Show
        IF={
          isValid(activities?.startDate) &&
          filterData?.start_date !== activities?.startDate &&
          !filterData?.filter &&
          !filterData.old &&
          filterData?.status === 0
        }
      >
        <Row className='justify-content-center mt-3 mb-3'>
          <Col md='4' className='shadow white text-center p-2'>
            <p className='h4 fw-bolder text-danger'>{FM('no-activity-today')}</p>
            <p className='mb-0'>{FM('showing-upcoming-activities')}</p>
          </Col>
        </Row>
      </Show>
      <VerticalTimeline
        className={classNames('timeline-x', {
          'd-none': !isValidArray(activities?.data),
          upcoming: filterData?.status === 0 || !isValid(filterData?.status),
          done: filterData?.status === 1,
          'not-done': filterData?.status === 2 || filterData?.old,
          'not-applicable': filterData?.status === 3,
          journal: filterData?.status === 4,
          deviation: filterData?.status === 5
        })}
        animate={true}
      >
        {isValid(activities) ? (
          activities?.data?.map((item, i) => {
            const old =
              filterData?.filter === false
                ? isGreaterThanToday(item) &&
                  (isValid(filterData?.status) ? item?.status === 0 : true)
                : isGreaterThanToday(item) && item?.status === 0
            if (isValid(item?.id)) {
              return (
                <VerticalTimelineElement
                  key={item?.id}
                  animate={true}
                  className={classNames(
                    `vertical-timeline-element--work card-status-${item?.status}`,
                    {
                      active: true,
                      'date-crossed': old
                    }
                  )}
                  contextClassName=''
                  contentStyle={{ background: 'transparent', boxShadow: 'none' }}
                  id={item?.id}
                  intersectionObserverProps={
                    {
                      // onChange: (inView, e) => {
                      //     log("inView", inView)
                      //     if (inView) {
                      //         addVisible(item?.id)
                      //     } else {
                      //         removeVisible(item?.id)
                      //     }
                      // }
                    }
                  }
                  dateClassName='text-dark fw-bolder'
                  date={formatDate(item?.end_date, 'DD MMMM, YYYY')}
                  icon={<Activity size={30} />}
                >
                  <TimeLineCard
                    old={old}
                    onSuccess={loadActivities}
                    item={item}
                    setReload={setReload}
                  />
                </VerticalTimelineElement>
              )
            } else {
              return (
                <VerticalTimelineElement
                  key={item?.id}
                  animate={true}
                  className={classNames('vertical-timeline-element--work', { active: true })}
                  contextClassName=''
                  contentStyle={{ background: 'transparent', boxShadow: 'none' }}
                  dateClassName='text-dark fw-bolder'
                  date={FM('loading')}
                  icon={<Activity size={30} />}
                >
                  <TimelineShimmer />
                </VerticalTimelineElement>
              )
            }
          })
        ) : (
          <></>
        )}
        <Hide IF={end}>
          <VerticalTimelineElement
            role='button'
            iconClassName='iconJump'
            iconOnClick={() => {
              if (!loadingMore) {
                setPage(page + 1)
              }
            }}
            className={classNames('vertical-timeline-element--work', { active: true })}
            icon={<ChevronsDown role='button' />}
          />
        </Hide>
        <Show IF={end && activities?.data?.length > 0}>
          <VerticalTimelineElement
            role='button'
            iconOnClick={() => {}}
            className={classNames('vertical-timeline-element--work', { active: true })}
            icon={<ArrowUp role='button' />}
          />
        </Show>
      </VerticalTimeline>
      <Show IF={!isValidArray(activities?.data)}>
        <p className='p-2 text-danger fw-bolder h4 shadow white text-center'>{FM('no-data')}</p>
      </Show>
      <Show IF={end && activities?.data?.length > 0}>
        <p className='p-2  h4  text-center'>{FM('no-more-data')}</p>
      </Show>
    </>
  )
}
export default BasicTimeline
