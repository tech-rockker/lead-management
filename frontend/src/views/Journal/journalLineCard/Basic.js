// ** Custom Components
import { SecurityOutlined } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowUp,
  CheckSquare,
  ChevronsDown,
  FileText,
  PenTool,
  Plus,
  Printer,
  RefreshCcw,
  Sliders,
  User
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
// ** Reactstrap Imports
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { fetchJournal } from '../../../redux/reducers/journal'
import { UserTypes, forDecryption } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import {
  JsonParseValidate,
  countPlus,
  createAsyncSelectOptions,
  decrypt,
  decryptObject,
  formatDate,
  isGreaterThanToday
} from '../../../utility/Utils'
import { loadUser } from '../../../utility/apis/userManagement'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import useTopMostParent from '../../../utility/hooks/useTopMostParent'
import useUser from '../../../utility/hooks/useUser'
import useUserType from '../../../utility/hooks/useUserType'
import FormGroupCustom from '../../components/formGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import TimelineShimmer from '../../masters/timeline/timelineShimmer'
import AddJournal from '../AddJournal'
import FilterJournal from '../FilterJournal'
import PrintModal from '../PrintModal'
import ResultModal from '../ResultModal'
import { dashboardDetails } from './../../../utility/apis/dashboard'
import LineCard from './LineCard'

const Basic = ({
  dUser = false,
  user = null,
  filters = {},
  noHeader = false,
  noFilter = false,
  edit = null,
  showModal,
  setShowModal,
  journalId = null
}) => {
  const [reload, setReload] = useState(false)
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const topMostParent = useTopMostParent()
  const userType = useUserType()
  const userData = useUser()

  //redux
  const { journals, loadingMore, end } = useSelector((s) => s.journal)
  const journal = {
    ...journals,
    data: journals?.data?.map((a) => ({
      ...a,
      patient: decryptObject(forDecryption, a?.patient),
      branch: decryptObject(forDecryption, a?.branch),
      employee: decryptObject(forDecryption, a?.employee)
    }))
  }

  const [loading, setLoading] = useState(false)
  const [visibleItems, setVIsible] = useState([])
  const [formVisible, setFormVisible] = useState(false)
  const [activityFilter, setActivityFilter] = useState(false)
  const [editData, setEditData] = useState(null)
  const [page, setPage] = useState(1)
  const [showResult, setShowResult] = useState(false)
  const [status, setStatus] = useState()
  const [deleted, setDeleted] = useState(null)
  const [failed, setFailed] = useState(false)
  const [added, setAdded] = useState(null)
  const [assignModal, setAssignModal] = useState(false)
  const [filterData, setFilterData] = useState({
    is_active: null,
    is_signed: null,
    is_secret: null
  })
  const [showAdd, setShowAdd] = useState(false)
  const [journalFilter, setJournalFilter] = useState(false)
  const [printModal, setPrintModal] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [patient, setPatient] = useState(null)
  const [perPage, setPerPage] = useState(5)
  const handlePrint = () => setPrintModal(!printModal)

  const location = useLocation()
  const notification = location?.state?.notification

  const loadJournal = () => {
    if (filterData?.patient_id) {
      dispatch(
        fetchJournal({
          page,
          perPage,
          loadMore: page > 1,
          jsonData: {
            ...filterData,
            patient_id: filterData?.patient_id,
            ...filters
          }
        })
      )
    }
  }

  useEffect(() => {
    loadJournal()
  }, [filterData, page, perPage])

  useEffect(() => {
    if (reload) {
      loadJournal()
    }
  }, [reload])

  useEffect(() => {
    if (userType === UserTypes.patient) {
      setFilterData({
        ...filterData,
        patient_id: userData?.id,
        patient_name: userData?.name
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
    }
    setVIsible([...finalArray])
  }
  const removeVisible = (id) => {
    const index = visibleItems?.findIndex((e) => e === id)
    const finalArray = visibleItems ?? []
    if (index === -1) {
    } else {
      finalArray?.splice(index, 1)
    }
    setVIsible([...finalArray])
  }

  const dash = () => {
    dashboardDetails({
      jsonData: {
        start_date: formatDate(new Date(), 'YYYY-MM-DD')
      },
      success: (e) => {}
    })
  }

  //REFRESH
  useEffect(() => {
    if (filterData !== null) {
      setReload(true)
      setValue('patient_id', filterData?.patient_id)
    }
  }, [filterData])

  const handleClose = (e) => {
    if (e === false) {
      setAssignModal(e)
      setAssignModal(null)
      setShowAdd(false)
      setShowDetails(false)
      setShowAddTask(false)
      setReload(false)
      setShowResult(false)
    }
  }
  console.log(user)
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
    if (notification?.data_id && notification?.type === 'journal') {
      setShowResult(true)
      setEditData({
        patient_id: JsonParseValidate(notification?.extra_param)?.patient_id,
        id: notification?.data_id
      })
    }
    window.history.replaceState({ fffff: 'kj' }, document.title)
  }, [notification])

  return (
    <>
      <Header
        titleCol='4'
        title={FM('journals')}
        childCol='8'
        icon={<FileText />}
        subHeading={
          <>
            <span className='text-dark fw-bolder h4'>{decrypt(filterData?.patient_name)}</span>
          </>
        }
      >
        <FilterJournal
          user={user}
          show={journalFilter}
          setFilterData={setFilterData}
          filterData={filterData}
          handleFilterModal={() => {
            setJournalFilter(false)
          }}
        />
        <ResultModal
          loadJournal={loadJournal}
          showModal={showResult}
          setShowModal={handleClose}
          journalIds={editData?.id}
          setReload={setReload}
          noView
        />

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

        {/* </Hide> */}
        <Hide IF={!isValid(filterData?.patient_name)}>
          <ButtonGroup color='dark' className='ms-1'>
            <Show IF={Permissions.journalSelfBrowse}>
              <BsTooltip
                title={FM('total-active')}
                Tag={Button.Ripple}
                size='sm'
                color='primary'
                onClick={() => {
                  setFilterData({
                    ...filterData,
                    is_active: 'yes',
                    is_signed: null,
                    is_secret: null,
                    with_activity: null
                  })
                  setPage(1)
                }}
              >
                <CheckSquare size={16} />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(journal?.total_active)}
                </span>
              </BsTooltip>
            </Show>

            <Show IF={Permissions.journalSelfBrowse}>
              <Show
                IF={
                  userData?.user_type_id === UserTypes.company ||
                  userData?.user_type_id === UserTypes.employee
                }
              >
                <BsTooltip
                  title={FM('total-secret')}
                  Tag={Button.Ripple}
                  size='sm'
                  color='danger'
                  onClick={() => {
                    setPage(1)
                    setFilterData({
                      ...filterData,
                      is_signed: null,
                      is_secret: 'yes',
                      is_active: null,
                      with_activity: null
                    })
                  }}
                >
                  <SecurityOutlined style={{ fontSize: '1.1rem' }} className='danger' />
                  <span className='align-middle ms-25 fw-bolder'>
                    {countPlus(journal?.total_secret)}
                  </span>
                </BsTooltip>
              </Show>
            </Show>

            <Show IF={Permissions.journalSelfBrowse}>
              <BsTooltip
                title={FM('total-signed')}
                Tag={Button.Ripple}
                size='sm'
                color='success'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    ...filterData,
                    is_signed: 'yes',
                    is_secret: null,
                    is_active: null,
                    with_activity: null
                  })
                }}
              >
                <PenTool size={16} />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(journal?.total_signed)}
                </span>
              </BsTooltip>
            </Show>
          </ButtonGroup>
        </Hide>

        {/* Tooltip */}
        <Hide IF={!isValid(filterData?.patient_name)}>
          <ButtonGroup color='dark' className='ms-1'>
            <Show IF={Permissions.journalSelfBrowse}>
              <BsTooltip
                title={FM('with-activity')}
                Tag={Button.Ripple}
                size='sm'
                color='primary'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    ...filterData,
                    is_signed: null,
                    is_secret: null,
                    is_active: null,
                    with_activity: 'yes'
                  })
                }}
              >
                <Activity size={16} className='success' />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(journal?.total_with_activity)}
                </span>
              </BsTooltip>
            </Show>

            <Show IF={Permissions.journalSelfBrowse}>
              <BsTooltip
                title={FM('without-activity')}
                Tag={Button.Ripple}
                size='sm'
                color='secondary'
                onClick={() => {
                  setPage(1)
                  setFilterData({
                    ...filterData,
                    is_signed: null,
                    is_secret: null,
                    is_active: null,
                    with_activity: 'no'
                  })
                }}
              >
                <AlertCircle size={16} className='info' />
                <span className='align-middle ms-25 fw-bolder'>
                  {countPlus(journal?.total_without_activity)}
                </span>
              </BsTooltip>
            </Show>
          </ButtonGroup>
        </Hide>

        <ButtonGroup className='ms-1' color='dark'>
          <Show IF={Permissions.journalPrint}>
            <Hide IF={!isValid(filterData?.patient_name)}>
              <UncontrolledTooltip target='export'>{FM('export')}</UncontrolledTooltip>
              <Button.Ripple
                size='sm'
                color='dark'
                id='export'
                onClick={() => {
                  setPrintModal(true)
                }}
              >
                <Printer size='14' />
              </Button.Ripple>
            </Hide>
          </Show>

          <Show IF={Permissions.journalSelfAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <AddJournal
              dUser={dUser}
              patientId={filterData?.patient_id ? filterData?.patient_id : user?.id}
              onSuccess={(d) => {
                log(d)
                setFilterData({
                  ...filterData
                })
              }}
              Component={Button.Ripple}
              className='btn btn-primary btn-sm'
              size='sm'
              outline
              color='dark'
              id='create-button'
            >
              <Plus size='14' />
            </AddJournal>
          </Show>

          <Hide IF={noFilter}>
            <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple
              onClick={() => setJournalFilter(true)}
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
                is_active: null,
                is_signed: null,
                is_secret: null
              })
              setReload(true)
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>

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
          <Show IF={isValidArray(journal?.data) && isValid(filterData?.patient_id)}>
            <VerticalTimeline
              key={`-total-${journal?.data?.length}`}
              className={classNames('timeline-x', {
                upcoming: true
              })}
              animate={true}
            >
              {isValid(journal) ? (
                journal?.data?.map((item, i) => {
                  const old = isGreaterThanToday(item)
                  if (isValid(item?.id)) {
                    return (
                      <VerticalTimelineElement
                        key={item?.id}
                        animate={true}
                        className={classNames('vertical-timeline-element--work', {
                          active: true,
                          completed: item?.is_signed === 1,
                          prime: item?.is_signed === 0
                        })}
                        contextClassName=''
                        contentStyle={{ background: 'transparent', boxShadow: 'none' }}
                        id={item?.id}
                        intersectionObserverProps={{}}
                        dateClassName='text-dark fw-bolder'
                        date={
                          <>
                            <BsTooltip title={FM('created-date')} size='sm' color='success'>
                              {formatDate(item?.created_at, 'DD MMMM, YYYY hh : mm A')}
                            </BsTooltip>
                          </>
                        }
                        icon={
                          <>
                            <BsTooltip title={item?.patient?.name} size='sm' color='success'>
                              <User size={30} />
                            </BsTooltip>
                          </>
                        }
                      >
                        <LineCard
                          patient_id={userData?.id}
                          old={old}
                          setFilterData={setFilterData}
                          filterData={filterData}
                          loadJournal={loadJournal}
                          onSuccess={loadJournal}
                          item={item}
                          setReload={setReload}
                          showModal={showAdd}
                          setShowModal={handleClose}
                          noView
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
              <Show IF={end && journal?.data?.length > 0}>
                <VerticalTimelineElement
                  role='button'
                  iconOnClick={() => {}}
                  className={classNames('vertical-timeline-element--work', { active: true })}
                  icon={<ArrowUp role='button' />}
                />
              </Show>
            </VerticalTimeline>
          </Show>
          <Show IF={!isValidArray(journal?.data) || !isValid(filterData?.patient_id)}>
            {journal?.total === 0 ? (
              <p className='p-2 text-danger text-center'>
                {decrypt(filterData?.patient_name)} {FM('no-journals-found')}
              </p>
            ) : !isValidArray(journal?.data === null) && isValid(journal) ? (
              <p className='p-2 text-danger text-center'>{FM('please-select-patient')}</p>
            ) : null}
          </Show>
          <Show IF={end && journal?.data?.length > 0 && isValid(filterData?.patient_id)}>
            <p className='p-2  h4  text-center'>{FM('no-more-data')}</p>
          </Show>
        </>
      )}
      <PrintModal
        printModal={printModal}
        setPrintModal={setPrintModal}
        handlePrint={handlePrint}
        patient_id={filterData?.patient_id}
      />
    </>
  )
}
export default Basic
