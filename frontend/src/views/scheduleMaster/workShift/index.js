import { Alarm, WarningOutlined } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Edit, Moon, MoreVertical, Plus, RefreshCcw, Slack, Sliders, Trash2 } from 'react-feather'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { workshiftDelete } from '../../../redux/reducers/companyWorkShift'
import { getPath } from '../../../router/RouteHelper'
import { deleteWorkShift, loadWorkShift } from '../../../utility/apis/companyWorkShift'
import { IconSizes, ShiftType } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { concatString, formatDate } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import WorkShiftFilter from './workShiftFilter'
import WorkShiftModal from './WorkShiftModal'

const WorkShift = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [deletedId, setDeletedId] = useState(null)
  const [failed, setFailed] = useState(false)
  const [reload, setReload] = useState(true)
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(null)
  const [edit, setEdit] = useState(null)
  const [workShiftFilter, setWorkShiftFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
    }
  }, [])

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(e)
      setEdit(null)
    }
  }

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  //////////////new////
  const gridView1 = (item, index) => {
    return (
      <>
        <Card className='animate__animated animate__flipInX'>
          <CardBody>
            <Row className='mb-1'>
              <Col xs={item?.shift_type === 'emergency' ? '9' : '10'}>
                <Row>
                  <Col xs='11' className='ps-1 align-items-center'>
                    <div className='flex-1'>
                      <h4 className='mb-0 fw-bolder text-primary text-truncate'>
                        <span className='position-relative text-capitalize'>
                          {/* {item?.shift_name} */}
                          {concatString(item?.shift_name, 30)}
                        </span>
                      </h4>
                      <p
                        className={`mb-0 text-small-12 fw-bold ${
                          item?.shift_type === ShiftType.SleepingEmergencyRed
                            ? 'text-danger'
                            : 'text-dark'
                        }`}
                      >
                        {/* {FM("created-at")}: {formatDate(item?.created_at, "DD/MM/YY")} */}
                        {FM(item?.shift_type)}
                      </p>
                      <p
                        className='mb-0 colorBar'
                        style={{
                          marginTop: 0,
                          backgroundColor: isValid(item?.shift_color)
                            ? item?.shift_color
                            : '#111111',
                          width: 5,
                          height: 70,
                          borderRadius: 8
                        }}
                      ></p>
                    </div>
                  </Col>
                  {/* <Col md="1"><Flag size={18} fill = { isValid(item?.shift_color) ?  item?.shift_color : "#111111"} color={!isValid(item?.shift_color) ? "#111111" : item?.shift_color} /> </Col> */}
                  {/* <Col md="11">
                                    {item?.shift_name}</CardTitle>
                                    <p className='mb-0 mt-0' style={{ marginTop: 3, backgroundColor: item?.shift_color, width: 50, height: 5, borderRadius: 8 }}></p>
                                </Col> */}
                </Row>
              </Col>
              <Show IF={item?.shift_type === 'emergency'}>
                <Col xs='1'>
                  <BsTooltip title={FM('emergency-shift')}>
                    <WarningOutlined className='text-danger' size={IconSizes.MenuVertical} />
                  </BsTooltip>
                </Col>
              </Show>
              {/* <Show IF={item?.shift_type === "sleeping_emergency"}>
                            <Col xs="1">
                                <BsTooltip title={FM("sleeping-emergency-shift")}>
                                    <Moon className='text-danger' size={IconSizes.MenuVertical} />
                                </BsTooltip>
                            </Col>
                        </Show> */}

              <Col
                xs={item?.shift_type === 'emergency' ? '1' : '2'}
                className='align-items-center justify-content-end pe-1 mb-2'
              >
                <DropDownMenu
                  tooltip={FM(`menu`)}
                  component={
                    <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                  }
                  options={[
                    {
                      IF: Permissions.workShiftEdit,
                      icon: <Edit size={14} />,
                      onClick: () => {
                        setShowAdd(true)
                        setEdit(item)
                      },
                      name: FM('edit')
                    },
                    {
                      IF: Permissions.workShiftDelete,
                      noWrap: true,
                      name: (
                        <ConfirmAlert
                          item={item}
                          title={FM('delete-this', { name: item?.name })}
                          color='text-warning'
                          onClickYes={() => deleteWorkShift({ id: item?.id })}
                          onSuccessEvent={(item) => {
                            dispatch(workshiftDelete(item?.id))
                          }}
                          className='dropdown-item'
                          id={`grid-delete-${item?.id}`}
                        >
                          <span className='me-1'>
                            <Trash2 size={14} />
                          </span>
                          {FM('delete')}
                        </ConfirmAlert>
                      )
                    }
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col md={'6'} className='col-6'>
                <BsTooltip title={FM('start-time')}>
                  <Alarm size={14} className='text-success' /> {item?.shift_start_time}
                </BsTooltip>
              </Col>

              <Col md={'6'} className='col-6 text-right'>
                <BsTooltip title={FM('end-time')}>
                  <Alarm size={14} className='text-danger' /> {item?.shift_end_time}
                </BsTooltip>
              </Col>
            </Row>
            <Hide IF={!isValid(item?.rest_start_time)}>
              <Row>
                <Col md='6' className='col-6'>
                  <span className='fw-bold m-0 status-text'>{FM('rest-from')}</span> :{' '}
                  <span className='text-primary m-0 status-text'>{item?.rest_start_time}</span>
                </Col>
                <Col md='6' className='col-6 text-right'>
                  <span className='fw-bold m-0 status-text'>{FM('rest-to')}</span> :{' '}
                  <span className='text-primary m-0 status-text'>{item?.rest_end_time}</span>
                </Col>
              </Row>
            </Hide>

            {/* <Row>
                        <Col>
                            <div className='design-planning-wrapper '>
                                <div key={item.shift_start_time} className='design-planning'>
                                    <Row>
                                        <Col md='1'>
                                            <UncontrolledTooltip target="gov">{FM("start-time")}</UncontrolledTooltip>
                                            <Avatar className='gr-box-success rounded' id='gov' icon={<Alarm size={14} />} />
                                        </Col>
                                        <Col md='9' style={{ marginTop: '6px' }}>
                                            <h6 className='mb-0' style={{ marginLeft: '15px' }}>{item?.shift_start_time}</h6>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className='design-planning-wrapper '>
                                <div key={item?.shift_end_time} className='design-planning'>
                                    <Row>
                                        <Col md='1'>
                                            <UncontrolledTooltip target="patient">{FM("end-time")}</UncontrolledTooltip>
                                            <Avatar className='gr-box-danger rounded' id='patient' icon={<Alarm icon size={14} />} />
                                        </Col>
                                        <Col md='9' style={{ marginTop: '6px' }}>
                                            <h6 className='mb-0' style={{ marginLeft: '15px' }} >{item?.shift_end_time}</h6>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row> */}
            {/* <div className='d-flex mt-1 text-warning justify-content-between'>
                        <span>{item?.shift_end_time}</span>
                    </div> */}
            <div className='d-flex d-none justify-content-end align-items-end mt-1'>
              <BsTooltip
                Tag={Link}
                title={FM('edit')}
                role={'button'}
                to={{
                  pathname: getPath('companies.update', { id: item.id }),
                  state: { data: item }
                }}
              >
                <Edit color={colors.primary.main} size='18' />
              </BsTooltip>
            </div>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <WorkShiftFilter
        show={workShiftFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setWorkShiftFilter(false)
        }}
      />
      <WorkShiftModal
        responseData={(e) => {
          {
            setFilterData({ e })
            setReload(true)
          }
        }}
        showModal={showAdd}
        edit={edit}
        setShowModal={handleClose}
        noView
      />
      <Header icon={<Slack size={25} />}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
        <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>

        {/* Buttons */}
        <ButtonGroup>
          <Show IF={Permissions.workShiftAdd}>
            {/* <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip>
                        <Button.Ripple onClick={() => setShowAdd(true)} size="sm" color="primary" id="create-button">
                            <Plus size="16" />
                        </Button.Ripple> */}
            <WorkShiftModal Component={Button.Ripple} size='sm' color='primary' id='create-button'>
              <Plus size='16' />
            </WorkShiftModal>
          </Show>
          <Button.Ripple
            onClick={() => setWorkShiftFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='16' />
          </Button.Ripple>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setFilterData(null)
              setReload(true)
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      {/* Categories */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadWorkShift}
        jsonData={filterData}
        selector='companyWorkShift'
        state='workShift'
        display='grid'
        gridCol='4'
        md='6'
        lg='4'
        gridView={gridView1}
      />
    </>
  )
}

export default WorkShift
