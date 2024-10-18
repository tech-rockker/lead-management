// ** Custom Components
import { IndeterminateCheckBoxOutlined, SecurityOutlined } from '@material-ui/icons'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowUp,
  CheckSquare,
  ChevronsDown,
  FileText,
  Flag,
  Plus,
  Printer,
  RefreshCcw,
  Scissors,
  Sliders
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
// ** Reactstrap Imports
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { fetchDeviation } from '../../redux/reducers/devitation'
import { UserTypes, forDecryption } from '../../utility/Const'
import Hide from '../../utility/Hide'
import { Permissions } from '../../utility/Permissions'
import Show from '../../utility/Show'
import {
  countPlus,
  createAsyncSelectOptions,
  decryptObject,
  formatDate,
  isGreaterThanToday
} from '../../utility/Utils'
import { loadDevitation } from '../../utility/apis/devitation'
import { loadUser } from '../../utility/apis/userManagement'
import { FM, isValid, isValidArray } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
import useUserType from '../../utility/hooks/useUserType'
import FormGroupCustom from '../components/formGroupCustom'
import Shimmer from '../components/shimmers/Shimmer'
import BsTooltip from '../components/tooltip'
import Header from '../header'
import TaskModal from '../masters/tasks/fragment/TaskModal'
import TimelineShimmer from '../masters/timeline/timelineShimmer'
import BulkPrint from './BulkPrint'
import TimeLineCards from './TimelineCards'
import DeviationFilter from './deviationFilter'
import DeviationDetailsModal from './fragment/deviationDetailModal'
import DevitationModal from './fragment/devitationModal'

const BasicTimelines = ({
  dUser = false,
  user = null,
  filters = {},
  noHeader = false,
  noFilter = false
}) => {
  const [reload, setReload] = useState(false)
  const dispatch = useDispatch()
  const userType = useUserType()
  const userData = useUser()
  const { devitations: devitation, loadingMore, end } = useSelector((s) => s.devitation)

  const [edit, setEdit] = useState(null)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [loading, setLoading] = useState(false)
  const [visibleItems, setVIsible] = useState([])
  const [deviationFilter, setDeviationFilter] = useState(false)
  const [filterData, setFilterData] = useState({
    is_completed: 'no',
    is_signed: null,
    is_secret: null,
    with_or_without_activity: null
  })
  const [patient, setPatient] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [devStats, setDevStats] = useState(null)
  const [printModal, setPrintModal] = useState(false)
  const handlePrint = () => setPrintModal(!printModal)

  const location = useLocation()
  const notification = location?.state?.notification

  const loadDevitations = () => {
    dispatch(
      fetchDeviation({
        page,
        perPage,
        loadMore: page > 1,
        jsonData: {
          from_date: formatDate(new Date(), 'YYYY-MM-DD'),
          ...filterData,
          ...filters,
          patient_id: filterData?.patient_id ? filterData?.patient_id : user?.id
        }
      })
    )
  }

  useEffect(() => {
    loadDevitations()
  }, [filterData, page, perPage])

  useEffect(() => {
    if (reload) {
      loadDevitations()
    }
  }, [reload])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()

  useEffect(() => {
    if (userType === UserTypes.patient) {
      setFilterData({
        ...filterData,
        patient_id: userData?.id
      })
    }
  }, [userType, userData])

  useEffect(() => {
    if (isValid(user)) {
      setFilterData({
        ...filterData,
        patient_id: user
      })
    }
  }, [user])

  const gradientColor = {
    background: 'linear-gradient(90deg, rgb(74 81 161), rgb(146 154 255))',
    color: 'rgb(80 88 184 / 70%)',
    boxShadow: ' 0 0 10px 1px rgb(80 88 184 / 70%)',
    position: ' absolute',
    zIndex: '100'
  }

  const addVisible = (id) => {
    const index = visibleItems?.findIndex((e) => e === id)
    const finalArray = visibleItems ?? []
    if (index === -1) {
      finalArray?.push(id)
    } else {
      // finalArray?.splice(index, 1)
    }
    setVIsible([...finalArray])
  }
  const removeVisible = (id) => {
    const index = visibleItems?.findIndex((e) => e === id)
    const finalArray = visibleItems ?? []
    if (index === -1) {
      // finalArray?.push(id)
    } else {
      finalArray?.splice(index, 1)
    }
    setVIsible([...finalArray])
  }

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(false)
      setShowDetails(false)
      setShowAddTask(false)
    }
  }

  //REFRESH
  useEffect(() => {
    if (filterData !== null) {
      setReload(true)
      setValue('patient_id', filterData?.patient_id)
    }
  }, [filterData])

  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  useEffect(() => {
    loadPatientOption()
  }, [])

  useEffect(() => {
    if (notification?.data_id && notification?.type === 'deviation') {
      setShowDetails(true)
      setEdit({
        id: notification?.data_id
      })
    }
    window.history.replaceState({ fffff: 'kj' }, document.title)
  }, [notification])

  const devitations = {
    ...devitation,
    data: devitation?.data?.map((a) => ({
      ...a,
      patient: decryptObject(forDecryption, a?.patient),
      user: decryptObject(forDecryption, a?.user),
      branch: decryptObject(forDecryption, a?.branch)
    }))
  }
  return (
    <>
      <DeviationDetailsModal
        showModal={showDetails}
        setShowModal={handleClose}
        devitationId={edit?.id}
        noView
      />
      <DevitationModal
        user={user?.id}
        showModal={showAdd}
        setShowModal={handleClose}
        devitationId={edit?.id}
        noView
      />
      <TaskModal showModal={showAddTask} setShowModal={handleClose} noView />
      <DeviationFilter
        user={user?.id}
        show={deviationFilter}
        setFilterData={setFilterData}
        filterData={filterData}
        handleFilterModal={() => {
          setDeviationFilter(false)
        }}
      />
      <Hide IF={noHeader}>
        <Header
          titleCol='4'
          title={FM('deviation')}
          childCol='8'
          icon={<Scissors />}
          subHeading={
            !isValid(filterData?.from_date) ? (
              <>
                <span>
                  {formatDate(new Date(), 'YYYY-MM-DD')}{' '}
                  <Badge color='light-danger'>{FM('showing-current-date-deviation')}</Badge>
                </span>
              </>
            ) : (
              <span>{formatDate(filterData?.from_date, 'YYYY-MM-DD')}</span>
            )
          }
        >
          {/* Tooltips */}
          <div className='d-flex align-items-center'>
            <Row>
              <Col md='12'>
                <Hide IF={isValid(user) || userType === UserTypes.patient}>
                  <div style={{ width: '200px' }}>
                    <FormGroupCustom
                      noGroup
                      noLabel
                      key={`patient-selected-${filterData?.patient_id}`}
                      label={'patient'}
                      type={'select'}
                      placeholder={FM('select-patient')}
                      async
                      isClearable
                      matchWith={'id'}
                      value={filterData?.patient_id}
                      defaultOptions
                      control={control}
                      onChangeValue={(v) => {
                        setPage(1)
                        setFilterData({
                          ...filterData,
                          is_completed: 'no',
                          is_signed: null,
                          is_secret: null,
                          with_or_without_activity: null,
                          // filterData: decryptObject(forDecryption, filterData),
                          patient_id: v,
                          patient_name: patient?.find((a) => a.value?.id === v)?.value?.name
                        })
                      }}
                      options={patient}
                      loadOptions={loadPatientOption}
                      name={'ip_id'}
                      className='mb-2 flex-1 z-index-999 flex-1'
                    />
                  </div>
                </Hide>
              </Col>
            </Row>
          </div>
          {/* <Hide IF={!isValid(filterData?.patient_name)}> */}
          <ButtonGroup color='dark' className='ms-1'>
            <Show IF={Permissions.deviationSelfBrowse}>
              <BsTooltip
                title={FM('not-completed')}
                Tag={Button.Ripple}
                size='sm'
                color='primary'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    ...filterData,
                    is_completed: 'no',
                    is_signed: null,
                    is_secret: null,
                    with_or_without_activity: null
                  })
                }}
              >
                <IndeterminateCheckBoxOutlined style={{ width: 17, height: 17 }} />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(devitation?.total_not_completed, 10000)}
                </span>
              </BsTooltip>
            </Show>
            <Show IF={Permissions.deviationSelfBrowse}>
              <BsTooltip
                title={FM('completed')}
                Tag={Button.Ripple}
                size='sm'
                color='success'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    ...filterData,
                    is_completed: 'yes',
                    is_signed: null,
                    is_secret: null,
                    with_or_without_activity: null
                  })
                }}
              >
                <CheckSquare size={16} />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(devitation?.total_completed, 10000)}
                </span>
              </BsTooltip>
            </Show>
          </ButtonGroup>
          {/* </Hide> */}
          {/* <Hide IF={!isValid(filterData?.patient_name)}> */}
          <ButtonGroup color='dark' className='ms-1'>
            <Show IF={Permissions.deviationSelfBrowse}>
              <BsTooltip
                title={FM('with-activity')}
                Tag={Button.Ripple}
                size='sm'
                color='info'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    ...filterData,
                    is_completed: null,
                    with_or_without_activity: 'yes',
                    is_signed: null,
                    is_secret: null
                  })
                }}
              >
                <FileText size={16} />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(devitation?.total_with_activity, 10000)}
                </span>
              </BsTooltip>
            </Show>
            <Show IF={Permissions.deviationSelfBrowse}>
              <BsTooltip
                title={FM('without-activity')}
                Tag={Button.Ripple}
                size='sm'
                color='secondary'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    ...filterData,
                    is_completed: null,
                    with_or_without_activity: 'no',
                    is_signed: null,
                    is_secret: null
                  })
                }}
              >
                <Flag size={16} />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(devitation?.total_without_activity, 10000)}
                </span>
              </BsTooltip>
            </Show>
            <Show IF={Permissions.deviationSelfBrowse}>
              <BsTooltip
                title={FM('secret')}
                Tag={Button.Ripple}
                size='sm'
                color='danger'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    ...filterData,
                    is_secret: 'yes',
                    with_or_without_activity: null,
                    is_signed: null,
                    is_completed: null
                  })
                }}
              >
                <SecurityOutlined style={{ fontSize: '1.1rem' }} />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(devitation?.total_secret, 100000)}
                </span>
              </BsTooltip>
            </Show>
          </ButtonGroup>
          {/* </Hide> */}
          <ButtonGroup className='ms-1' color='dark'>
            <Show IF={Permissions.deviationPrint}>
              <Show IF={isValid(filterData?.patient_id)}>
                <UncontrolledTooltip target='print'>{FM('print')}</UncontrolledTooltip>
                <Button.Ripple
                  size='sm'
                  id='print'
                  color='dark'
                  // disabled={!isValid(filterData?.patient_name)}
                  // className={classNames("", { "pointer-events-none": !isValid(filterData?.patient_name) })}
                  onClick={() => {
                    setPrintModal(true)
                  }}
                >
                  <Printer size='14' />
                </Button.Ripple>
              </Show>
            </Show>
            <Show IF={Permissions.deviationSelfAdd}>
              <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
              <DevitationModal
                dUser={dUser}
                user={user?.id ?? filterData?.patient_id}
                Component={Button.Ripple}
                className='btn btn-primary btn-sm'
                size='sm'
                outline
                color='dark'
                id='create-button'
              >
                <Plus size='14' />
              </DevitationModal>
            </Show>
            <Hide IF={noFilter}>
              <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
              <Button.Ripple
                onClick={() => setDeviationFilter(true)}
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
                  patient_id: filterData?.patient_id,
                  patient_name: filterData?.patient_name,
                  is_completed: 'no',
                  is_active: null,
                  is_signed: null,
                  is_secret: null,
                  with_or_without_activity: null
                })
                setReload(true)
              }}
            >
              <RefreshCcw size='14' />
            </Button.Ripple>
          </ButtonGroup>
        </Header>
      </Hide>
      {loading ? (
        <>
          <VerticalTimeline>
            <VerticalTimelineElement
              contentStyle={{ background: 'transparent', boxShadow: '#5058b8' }}
              iconStyle={{ background: 'transparent', color: 'transparent' }}
            >
              <Shimmer height='200px'>
                <Card>
                  <CardHeader>{/* <Shimmer /> */}</CardHeader>
                  <CardBody>
                    <Row>
                      <Col>
                        <Shimmer />
                      </Col>
                      <Col>
                        <Shimmer />
                      </Col>
                      <Col>
                        <Shimmer />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Shimmer>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              contentStyle={{ background: 'transparent', boxShadow: '#5058b8' }}
            >
              <Shimmer height='200px'>
                <Card>
                  <CardHeader>{/* <Shimmer /> */}</CardHeader>
                  <CardBody>
                    <Row>
                      <Col>
                        <Shimmer />
                      </Col>
                      <Col>
                        <Shimmer />
                      </Col>
                      <Col>
                        <Shimmer />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Shimmer>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              contentStyle={{ background: 'transparent', boxShadow: '#5058b8' }}
            >
              <Shimmer height='200px'>
                <Card>
                  <CardHeader>{/* <Shimmer /> */}</CardHeader>
                  <CardBody>
                    <Row>
                      <Col>
                        <Shimmer />
                      </Col>
                      <Col>
                        <Shimmer />
                      </Col>
                      <Col>
                        <Shimmer />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Shimmer>
            </VerticalTimelineElement>
          </VerticalTimeline>
        </>
      ) : (
        <>
          <Show IF={isValidArray(devitation?.data)}>
            <VerticalTimeline
              className={classNames('timeline-x', {
                upcoming: true
                // done: filterData?.status === 1,
                // 'not-done': filterData?.status === 2,
                // 'not-applicable': filterData?.status === 3,
                // journal: filterData?.status === 4,
                // deviation: filterData?.status === 5
              })}
              animate={true}
            >
              {isValid(devitation) ? (
                devitation?.data?.map((item, i) => {
                  const old = isGreaterThanToday(item) && item?.status === 0
                  if (isValid(item?.id)) {
                    return (
                      <VerticalTimelineElement
                        key={item?.id}
                        animate={true}
                        className={classNames('vertical-timeline-element--work', {
                          active: true,
                          completed: item?.is_completed === 1,
                          prime: item?.is_completed === 0
                        })}
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
                        date={formatDate(item?.date_time, 'DD MMMM, YYYY, HH:mm')}
                        icon={<Activity size={30} />}
                      >
                        <TimeLineCards
                          old={old}
                          onSuccess={loadDevitation}
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
                        className={classNames('vertical-timeline-element--work', {
                          active: true
                        })}
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
              <Show IF={end && devitation?.data?.length > 0}>
                <VerticalTimelineElement
                  role='button'
                  iconOnClick={() => { }}
                  className={classNames('vertical-timeline-element--work', { active: true })}
                  icon={<ArrowUp role='button' />}
                />
              </Show>
            </VerticalTimeline>
          </Show>
          <Show IF={!isValidArray(devitation?.data)}>
            <p className='p-2 text-danger text-center'>{FM('no-deviation')}</p>
          </Show>
        </>
      )}
      <BulkPrint
        printModal={printModal}
        setPrintModal={setPrintModal}
        handlePrint={handlePrint}
        patient_id={user?.id ?? filterData?.patient_id}
      />
    </>
  )
}
export default BasicTimelines
