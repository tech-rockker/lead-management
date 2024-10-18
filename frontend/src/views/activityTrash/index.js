import { LocalActivityOutlined } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Calendar,
  Edit2,
  MoreVertical,
  RefreshCcw,
  RefreshCw,
  Trash,
  UserPlus,
  Eye,
  Users
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { trashedActivityDeleteX } from '../../redux/reducers/activitytrashed'
import {
  activityRestore,
  deleteTrashedActivity,
  loadTrashedActivity
} from '../../utility/apis/trashedActivity'
import ActivityLogModal from '../activity/activityView/activityLogModal'
import { forDecryption, IconSizes } from '../../utility/Const'
// ** Styles
import { FM, isValid } from '../../utility/helpers/common'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import Hide from '../../utility/Hide'
import { Permissions } from '../../utility/Permissions'
import Show from '../../utility/Show'
import { decryptObject, formatDate, truncateText } from '../../utility/Utils'
import DropDownMenu from '../components/dropdown'
import BsPopover from '../components/popover'
import TableGrid from '../components/tableGrid'
import Header from '../header'

const TrashActivity = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [reload, setReload] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const [showLogDetails, setShowLogDetails] = useState(false)
  const [selectedActivityId, setSelectedActivityId] = useState(null)

  const showForm = () => {
    setFormVisible(!formVisible)
    setShowLogDetails(false)
    setSelectedActivityId(false)
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
      setShowLogDetails(false)
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

  const TrashedCard = (datas, index) => {
    const item = {
      ...datas,
      ...decryptObject(forDecryption, datas),
      patient: decryptObject(forDecryption, datas?.patient)
    }
    return (
      <>
        <div className='flex-1' key={`ip-${index}`}>
          <Card className='animate__animated animate__slideInUp'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='11' className='d-flex align-items-center'>
                  <Row>
                    <Col xs='12'>
                      <h5 className='mb-3px fw-bolder text-primary'>{item?.title}</h5>
                      <p className='mb-0 text-small-12 text-truncate'>
                        {truncateText(item?.category?.name, 30)}
                      </p>
                    </Col>
                  </Row>
                </Col>

                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      {
                        IF: Permissions.trashedActivityRestore,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={item}
                            title={FM('restore-this-activity', { name: item?.title })}
                            text={'You can revert this anytime.'}
                            successTitle={'Restored'}
                            successText={'activity-restored-successfully'}
                            color='text-warning'
                            onClickYes={() =>
                              activityRestore({
                                id: item?.id
                              })
                            }
                            onSuccessEvent={(item) => dispatch(trashedActivityDeleteX(item?.id))}
                            className='dropdown-item'
                            id={`grid-restore-${item?.id}`}
                          >
                            <RefreshCw size={14} />
                            <span className='ms-1'>{FM('restore-activity')}</span>
                          </ConfirmAlert>
                        )
                      },
                      {
                        IF: Permissions.trashedActivityDelete,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            uniqueEventId={`${item?.id}-trashed`}
                            item={item}
                            title={FM('delete-this', { name: item?.title })}
                            color='text-warning'
                            onClickYes={() => deleteTrashedActivity({ id: item?.id })}
                            onSuccessEvent={(item) => {
                              trashedActivityDeleteX(item?.id)
                              setReload(true)
                            }}
                            className='dropdown-item'
                            id={`grid-deletes-${item?.id}`}
                          >
                            <Trash size={14} />
                            <span className='ms-1'>{FM('permanent-delete')}</span>
                          </ConfirmAlert>
                        )
                      },
                      {
                        icon: <Eye size={14} />,
                        onClick: () => {
                          setSelectedActivityId(item?.id)
                          setShowLogDetails(true)
                        },
                        name: FM('edit-history')
                      }
                    ]}
                  />
                </Col>
              </Row>
            </CardBody>
            <CardBody className='pt-0'>
              <Row className='align-items-center gy-2'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('ip-plans')}</p>
                  <p role={'button'} className='mb-0 fw-bold text-secondary text-truncate'>
                    <RefreshCcw size={14} /> {item?.implementation_plan?.title ?? 'N/A'}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('patient')}</p>
                  <p role={'button'} className='mb-0 fw-bold text-secondary text-truncate'>
                    <UserPlus size={14} /> {truncateText(item?.patient?.name)}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-date')}</p>
                  <p role={'button'} className='mb-0 fw-bold text-secondary text-truncate'>
                    <Calendar size={14} /> {formatDate(item?.start_date, 'DD MMMM, YYYY')}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('end-date')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Calendar size={14} /> {formatDate(item?.end_date, 'DD MMMM, YYYY')}
                    </a>
                  </p>
                </Col>
                <Col md='12'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('description')}</p>
                  <BsPopover
                    title={FM('description')}
                    role='button'
                    Tag={'p'}
                    content={truncateText(item?.description, 50)}
                    className='mb-0 fw-bold text-secondary text-truncate'
                  >
                    <Edit2 size={14} />{' '}
                    {item?.description ? truncateText(item?.description, 50) : 'N/A'}
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
      <ActivityLogModal
        showModal={showLogDetails}
        setShowModal={showForm}
        activityId={selectedActivityId}
      />
      <Header icon={<LocalActivityOutlined size={25} />} subHeading={FM('all-trashed-activity')}>
        <ButtonGroup color='dark'>
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
        loadFrom={loadTrashedActivity}
        jsonData={{
          ...filterData
        }}
        selector='activitytrashed'
        state='trashedActivities'
        display='grid'
        gridCol='6'
        gridView={TrashedCard}
      />
    </>
  )
}

export default TrashActivity
