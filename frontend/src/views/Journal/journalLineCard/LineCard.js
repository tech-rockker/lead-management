import { SecurityOutlined } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext, useEffect, useState } from 'react'
import {
  Activity,
  ArrowUpCircle,
  CheckSquare,
  Download,
  Edit,
  Eye,
  MoreVertical,
  PenTool,
  Plus,
  PlusCircle
} from 'react-feather'
import { useLocation } from 'react-router-dom'
import 'react-vertical-timeline-component/style.min.css'
// ** Reactstrap Imports
import { useDispatch } from 'react-redux'
import { Card, CardBody, CardFooter, Col, Row } from 'reactstrap'
import { journalUpdate } from '../../../redux/reducers/journal'
import { CategoryType, IconSizes } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import { formatDate, getValidTime, truncateText } from '../../../utility/Utils'
import { actionJournalSign, activeJournal } from '../../../utility/apis/journal'
import ConfirmAction from '../../../utility/helpers/ConfirmAction'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { FM, isValid, log } from '../../../utility/helpers/common'
import usePackage from '../../../utility/hooks/usePackage'
import useUser from '../../../utility/hooks/useUser'
import ActivityDetailsModal from '../../activity/activityView/activityDetailModal'
import DropDownMenu from '../../components/dropdown'
import BsTooltip from '../../components/tooltip'
import TaskModal from '../../masters/tasks/fragment/TaskModal'
import ActionModal from '../ActionModal'
import ActiveJournal from '../ActiveJournal'
import AddJournal from '../AddJournal'
import FilterJournal from '../FilterJournal'
import ResultModal from '../ResultModal'
import SignedJournal from '../SignedJournal'
import SinglePrintModal from '../SinglePrintModal'

const LineCard = ({
  patient_id = null,
  item,
  setReload = () => {},
  loadJournal = () => {},
  onSuccess = () => {}
}) => {
  const pack = usePackage()
  const { colors } = useContext(ThemeColors)
  const [showAdd, setShowAdd] = useState(false)
  const [showAction, setShowAction] = useState(false)
  const dispatch = useDispatch()
  const [showResult, setShowResult] = useState(false)
  const [edit, setEdit] = useState(null)
  const [taskModal, setTaskModal] = useState(false)
  const [sourceId, setSourceId] = useState(false)
  const [assignModal, setAssignModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [deletedd, setDeletedd] = useState(false)
  const [deleteddd, setDeleteddd] = useState(false)
  const [signModal, setSignedModal] = useState(false)
  const [signedFailed, setSignFailed] = useState(false)
  const [failed, setFailed] = useState(false)
  const [failedd, setFailedd] = useState(false)
  const [faileddd, setFaileddd] = useState(false)
  const [moreFolowups, setMoreFollowups] = useState(false)
  const [journalFilter, setJournalFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const [active, setActive] = useState(false)
  const [signed, setSigned] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const user = useUser()
  const location = useLocation()
  const notification = location?.state?.notification
  const [printModal, setPrintModal] = useState(false)
  const handlePrint = () => setPrintModal(!printModal)

  const handleSigned = () => setSigned(!signed)
  const handleActive = () => setActive(!active)

  const handleClose = (e) => {
    setAssignModal(e)
    setAssignModal(null)
    setShowAdd(false)
    setShowAction(false)
    setShowResult(false)
    setShowDetails(false)
    setShowAddTask(false)
  }

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  const handleTaskClose = () => {
    setTaskModal(false)
  }

  const status = (item) => {
    if (item?.is_signed === 1) {
      return FM('strike')
    } else {
      return FM('edit')
    }
  }

  const sign = (item) => {
    if (item?.is_signed === 1) {
      return FM('sign')
    } else {
      return FM('not-signed')
    }
  }

  const handleSave = (data) => {
    activeJournal({
      jsonData: {
        ...data,
        journal_id: item?.id,
        is_active: 1,
        journal_id: item?.id
      },

      loading: setLoading,
      success: setDeletedd,
      error: setFailedd
      // dispatch
    })
  }

  const handleSaveInactive = (data) => {
    activeJournal({
      jsonData: {
        ...data,
        journal_id: item?.id,
        is_active: 0,
        journal_id: item?.id
      },
      loading: setLoading,
      success: setDeleteddd,
      error: setFaileddd
      // dispatch
    })
  }
  const signJournal = (data) => {
    actionJournalSign({
      jsonData: {
        ...data,
        journal_ids: [item?.id],
        is_signed: 1,
        journal_id: item?.id
      },
      loading: setLoading,
      success: setDeleted,
      error: setFailed
      // dispatch
    })
  }

  return (
    <>
      {/* <TaskModal showModal={taskModal} setShowModal={handleTaskClose} sourceId={sourceId} noView /> */}
      {/* <ActivityModal showModal={showAdd} setShowModal={handleClose} activityId={edit?.id} noView /> */}
      <AddJournal
        loadJournal={loadJournal}
        showModal={showAdd}
        setShowModal={handleClose}
        edit={item}
        noView
        setReload={setReload}
      />
      <ActionModal
        loadJournal={loadJournal}
        showModal={showAction}
        setShowModal={handleClose}
        journalId={item?.id}
        // edit={item}
        isSigned={item?.is_signed}
        setReload={setReload}
        noView
      />
      <ResultModal
        loadJournal={loadJournal}
        showModal={showResult}
        setShowModal={handleClose}
        journalIds={item?.id}
        setReload={setReload}
        noView
      />
      <FilterJournal
        loadJournal={loadJournal}
        show={journalFilter}
        setShowModal={setJournalFilter}
        filterData={filterData}
        setReload={setReload}
        handleFilterModal={() => {
          setJournalFilter(false)
        }}
      />
      <ActivityDetailsModal
        showModal={showDetails}
        setShowModal={handleClose}
        activityId={edit?.activity_id}
        noView
      />
      <TaskModal
        onSuccess={onSuccess}
        showModal={showAddTask}
        setShowModal={handleClose}
        resourceType={CategoryType.jaurnal}
        sourceId={edit?.id}
        noView
        activity={edit}
      />

      <Card className='shadow'>
        <div className='text-small-12 fw-bolder time position-absolute'>
          {/* {formatDate(item?.date, "DD MMMM, YYYY")} - {getValidTime(item?.time, "h:mm A")} */}
          {/* {formatDate(item?.date, "DD MMMM, YYYY")} - {getValidTime(item?.time, "h:mm A")} */}
        </div>
        <div className='timeline-header pt-1 pb-1'>
          <Row className='align-items-start gx-0'>
            <Col md='12'>
              <BsTooltip
                role='button'
                title={
                  <>
                    {item?.category?.name} / {item?.subcategory?.name}
                  </>
                }
              >
                <p className='h5 fw-bold text-white mt-0 me-2 text-truncate'>
                  {/* {item?.category?.name} {item?.subcategory?.name ? "/" : ""} {item?.subcategory?.name} */}
                  {item?.category?.name} / {item?.subcategory?.name}
                </p>
              </BsTooltip>
            </Col>
          </Row>
        </div>

        <CardBody className=''>
          <Row className='align-items-start pt-1'>
            <Col>
              {/* <h5 className='h4 text-primary fw-bolder mt-3px mb-3px text-capitalize'>
                                {truncateText(item?.title, 35)}
                            </h5> */}
              <Show IF={isValid(item?.category)}>
                <p className='mb-0 mt-0  text-secondary fw-bolder text-truncate '>
                  {FM('incident-date')} {formatDate(item?.date, 'DD MMMM, YYYY ')}{' '}
                  {getValidTime(item?.time, 'h:mm A')}
                </p>
              </Show>
            </Col>

            <Show IF={item?.is_secret === 1}>
              <Col xs='1' className='d-flex justify-content-end'>
                <h4 className='text-danger fw-bolder'>
                  <BsTooltip title={FM('secret-journal')}>
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
                    IF: Permissions.journalSelfRead,
                    icon: <Eye size={14} />,
                    onClick: () => {
                      setShowResult(true)
                      setEdit(item)
                    },
                    name: FM('view')
                  },
                  {
                    IF: Can(Permissions.journalSelfEdit) && item?.is_signed === 0,
                    icon: <Edit size={14} />,
                    onClick: () => {
                      setShowAdd(true)
                      setEdit(item)
                    },
                    name: status(item)
                  },
                  // {
                  //     // IF: Permissions.activitySelfEdit,
                  //     icon: <Plus size={14} />,
                  //     onClick: () => {
                  //         setShowAction(true)
                  //         setEdit(item)
                  //     },
                  //     name: FM("action/result")
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
                    IF: Can(Permissions.journalPrint) && item?.is_signed === 1,
                    icon: <Download size={14} />,
                    onClick: () => {
                      setPrintModal(true)
                      setEdit(item)
                    },
                    name: FM('export')
                  }
                ]}
              />
            </Col>
          </Row>
        </CardBody>
        <Hide IF={item?.activity_note === null}>
          <CardBody className='border-top pt-1 pb-1'>
            <Row>
              <Col md='12' className='mb-0'>
                <div className='fw-bolder text-dark'>{FM('activity-note')}</div>
                <BsTooltip role='button' title={item?.activity_note}>
                  <p className='fw-bold text-secondary mt-0 mb-0'>
                    {truncateText(item?.activity_note, 100)}
                  </p>
                </BsTooltip>
              </Col>
            </Row>
          </CardBody>
        </Hide>
        <CardBody className='border-top pt-1 pb-1'>
          <Row>
            <Col md='12' className='mb-0'>
              <div className='fw-bolder text-dark'>{FM('description')}</div>
              {/* <Show IF={item?.description !== null}> */}
              <BsTooltip role='button' title={item?.description}>
                <p className='fw-bold text-secondary mt-0 mb-0'>
                  {truncateText(item?.description, 100) ?? 'N/A'}
                </p>
              </BsTooltip>
              {/* </Show> */}
            </Col>
            <Col md='12' className=''>
              <div className='d-flex justify-content-between fw-bold mt-0'>
                <div className='text-small-13 text-primary'>
                  <BsTooltip
                    role='button'
                    title={item?.is_signed === 1 ? FM('signed-by') : FM('created-by')}
                  >
                    {item?.employee?.name}
                  </BsTooltip>
                </div>
                <div className='text-small-12'>
                  {formatDate(item?.created_at, 'DD MMMM YYYY hh:mm a')}
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
        <Show IF={isValid(item?.journal_actions[0]?.comment_action)}>
          <CardBody className='border-top pt-1 pb-1'>
            <div className='fw-bolder text-dark'>{FM('action')}</div>
            <Row>
              <Col md='12' className='fw-bolder'>
                <BsTooltip role='button' title={item?.journal_actions[0]?.comment_action}>
                  <p className='fw-bold  text-secondary mt-0 mb-0'>
                    {' '}
                    {truncateText(item?.journal_actions[0]?.comment_action, 100)}{' '}
                  </p>
                </BsTooltip>
              </Col>
              <Col md='12' className=''>
                <div className='d-flex justify-content-between fw-bold mt-0'>
                  <div className='text-small-13 text-primary'>
                    <BsTooltip
                      role='button'
                      title={item?.is_signed === 1 ? FM('signed-by') : FM('created-by')}
                    >
                      {item?.employee?.name}
                    </BsTooltip>
                  </div>
                  <div className='text-small-12'>
                    {formatDate(item?.journal_actions[0]?.created_at, 'DD MMMM YYYY hh:mm a')}
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Show>
        <Show IF={isValid(item?.journal_actions[0]?.comment_result)}>
          <CardBody className='border-top pt-1 pb-1'>
            <div className='fw-bolder text-dark'>{FM('result')}</div>

            <Row>
              <Col md='12' className='fw-bold'>
                <BsTooltip role='button' title={item?.journal_actions[0]?.comment_result}>
                  <p className='fw-bold  text-secondary mt-0 mb-0'>
                    {' '}
                    {truncateText(item?.journal_actions[0]?.comment_result, 100)}
                  </p>
                </BsTooltip>
              </Col>

              <Col md='12' className=''>
                <div className='d-flex justify-content-between fw-bold mt-0'>
                  <div className='text-small-13 text-primary'>
                    <BsTooltip
                      role='button'
                      title={item?.is_signed === 1 ? FM('signed-by') : FM('created-by')}
                    >
                      {item?.employee?.name}
                    </BsTooltip>
                  </div>
                  <div className='text-small-12'>
                    {formatDate(item?.journal_actions[0]?.created_at, 'DD MMMM YYYY hh:mm a')}
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Show>

        <CardFooter className='border-top pt-1 pb-1 ps-2'>
          <Row className='d-flex align-items-center justify-content-start'>
            <Show IF={Permissions.journalSelfBrowse}>
              <Col xs='10'>
                <Hide IF={item?.activity === null}>
                  <Row className='d-flex align-items-center justify-content-start'>
                    <Col xs='2' className='pt-0 pb-0'>
                      <div className='badge bg-primary'>
                        <BsTooltip role='button' title={FM('activity')}>
                          <Activity
                            size='22'
                            className='align-middle'
                            onClick={() => {
                              setShowDetails(true)
                              setEdit(item)
                            }}
                          />
                        </BsTooltip>
                      </div>
                    </Col>
                  </Row>
                </Hide>
              </Col>
            </Show>
            <Col xs='2' className='d-flex justify-content-end'>
              <Show IF={Permissions.journalSelfEdit}>
                <Show IF={item?.is_signed === 1}>
                  {/* <Col xs="1" className='d-flex justify-content-end'> */}
                  <BsTooltip role='button' title={FM('strike')}>
                    <ArrowUpCircle
                      size='22'
                      className='me-1'
                      color={colors?.secondary?.main}
                      onClick={() => {
                        setShowAdd(true)
                        setEdit(item)
                      }}
                    />
                  </BsTooltip>
                  {/* </Col> */}
                </Show>
              </Show>

              <Show IF={Permissions.journalSelfEdit}>
                {/* <Col xs="1" className='d-flex justify-content-end'> */}
                <BsTooltip
                  role='button'
                  title={item?.is_signed === 1 ? FM('signed') : FM('click-for-sign')}
                >
                  <Hide IF={item?.is_signed === 1}>
                    {/* <ConfirmAlert
                      item={item}
                      uniqueEventId={`journal-event-${item?.id}`}
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
                      title={FM('sign-this-journal', {
                        name: item?.patient?.name
                      })}
                      color='text-warning'
                      successTitle={FM('signed')}
                      successText={FM('journal-is-signed')}
                      onClickYes={() => {
                        actionJournalSign({
                          id: item?.id,
                          jsonData: {
                            signed_method: 'bankid',
                            id: item?.id,
                            journal_ids: [item?.id],
                            is_signed: 1
                          }
                        })
                      }}
                      onClickNo={() =>
                        actionJournalSign({
                          id: item?.id,
                          jsonData: {
                            id: item?.id,
                            journal_ids: [item?.id],
                            is_signed: 1
                          }
                        })
                      }
                      onSuccessEvent={(e) => {
                        log('e', item?.id, e)
                        dispatch(
                          journalUpdate({
                            id: e?.id,
                            is_signed: 1
                          })
                        )
                      }}
                      className=''
                      id={`grid-delete-${item?.id}`}
                    >
                      <PenTool size='22' className='me-1' />
                    </ConfirmAlert> */}
                    <ConfirmAlert
                      item={item}
                      uniqueEventId={`journal-event-${item?.id}`}
                     
                  
                      textClass='text-danger fw-bold text-small-12'
                      // text={
                      //   !isValid(user?.personal_number)
                      //     ? 'please-add-your-personal-number'
                      //     : 'how-would-you-like-to-sign'
                      // }
                      denyButtonText={'normal'}
                      title={FM('sign-this-journal', {
                        name: item?.patient?.name
                      })}
                      color='text-warning'
                      successTitle={FM('signed')}
                      successText={FM('journal-is-signed')}
                    
                      onClickYes={() =>
                        actionJournalSign({
                          id: item?.id,
                          jsonData: {
                            id: item?.id,
                            journal_ids: [item?.id],
                            is_signed: 1
                          }
                        })
                      }
                      onSuccessEvent={(e) => {
                        log('e', item?.id, e)
                        dispatch(
                          journalUpdate({
                            id: e?.id,
                            is_signed: 1
                          })
                        )
                      }}
                      className=''
                      id={`grid-delete-${item?.id}`}
                    >
                      <PenTool size='22' className='me-1' />
                    </ConfirmAlert>
              
                  </Hide>
                  <Show IF={item?.is_signed === 1}>
                    <PenTool size='22' className='me-1' color={colors?.success?.main} />
                  </Show>
                </BsTooltip>
                {/* </Col> */}
              </Show>

              <Show IF={Permissions.journalSelfAction && item?.is_signed !== 1}>
                {/* <Col xs="1" className='d-flex justify-content-end'> */}
                <BsTooltip role='button' title={FM('action')}>
                  <PlusCircle
                    size='22'
                    className='me-1'
                    color={colors?.secondary?.main}
                    onClick={() => {
                      setShowAction(true)
                      setEdit(item)
                    }}
                  />
                </BsTooltip>
                {/* </Col> */}
              </Show>

              <Show IF={Permissions.journalSelfAction}>
                <Show IF={item?.is_signed === 1}>
                  {/* <Col xs="1" className='d-flex justify-content-end'> */}
                  <Show IF={item?.is_active === 0}>
                    <BsTooltip role='button' title={FM('click-to-active')}>
                      <ConfirmAction
                        title={FM('active-this-journal', {
                          name: item?.patient?.name
                        })}
                        color='text-warning'
                        onClickYes={() =>
                          handleSave({
                            id: item?.id,
                            is_active: 1,
                            loading: setLoading,
                            success: setDeletedd,
                            error: setFailedd
                          })
                        }
                        // onClickYes={() => handleSave({ journal_id: item?.id, is_active: 1, loading: setLoading, success: setDeletedd, error: setFailedd })}
                        onSuccess={deletedd}
                        onFailed={failedd}
                        onClose={(e) => {
                          if (e) {
                            dispatch(
                              journalUpdate({
                                id: item?.id,
                                is_active: 1
                              })
                            )
                          }
                          setDeletedd(null)
                          setFailedd(null)
                        }}
                        className=''
                        id={`grid-delete-${item?.id}`}
                      >
                        <CheckSquare size='22' className='me-1' />
                      </ConfirmAction>
                    </BsTooltip>
                  </Show>

                  <Show IF={Permissions.journalSelfAction}>
                    <Show IF={item?.is_active === 1}>
                      <BsTooltip role='button' title={FM('click-to-inactive')}>
                        <ConfirmAction
                          title={FM('inactive-this-journal', {
                            name: item?.patient?.name
                          })}
                          successTitle={'Inactive'}
                          successText={'journal is Inactive'}
                          color='text-warning'
                          onClickYes={() =>
                            handleSaveInactive({
                              id: item?.id,
                              is_active: 0,
                              loading: setLoading,
                              success: setDeleteddd,
                              error: setFaileddd
                            })
                          }
                          onSuccess={deleteddd}
                          onFailed={faileddd}
                          onClose={(e) => {
                            if (e) {
                              dispatch(
                                journalUpdate({
                                  id: item?.id,
                                  is_active: 0
                                })
                              )
                            }
                            setDeleteddd(null)
                            setFaileddd(null)
                          }}
                          className=''
                          id={`grid-delete-${item?.id}`}
                        >
                          <CheckSquare size='22' className='me-1' color={colors?.success?.main} />
                        </ConfirmAction>
                      </BsTooltip>
                    </Show>
                  </Show>
                  {/* </Col> */}
                </Show>
              </Show>

              <Show IF = {Permissions.journalSelfRead}>
                <BsTooltip role='button' title={FM("view")}>
                  <Eye

                    size='22'
                    className='me-1'
                    color={colors?.primary?.main}
                    onClick={() => {
                      setShowResult(true)
                      setEdit(item)
                    }}
                  />  
                </BsTooltip>

              </Show>

              
            </Col>
          </Row>
        </CardFooter>
      </Card>
      <ActiveJournal
        handelActive={handleActive}
        active={active}
        setActive={setActive}
        item={item}
        loadJournal={loadJournal}
      />
      <SignedJournal
        signed={signed}
        setSigned={setSigned}
        handleSigned={handleSigned}
        item={item}
        loadJournal={loadJournal}
      />
      <SinglePrintModal
        printModal={printModal}
        setPrintModal={setPrintModal}
        handlePrint={handlePrint}
        patient_id={item?.patient_id}
        journal_id={item?.id}
        is_secret={item?.is_secret}
      />
    </>
  )
}

export default LineCard
