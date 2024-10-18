import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Crosshair,
  Edit,
  Eye,
  List,
  MoreVertical,
  Plus,
  RefreshCcw,
  Sliders,
  Trash2,
  Upload
} from 'react-feather'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { ovDelete } from '../../../redux/reducers/ovhour'
import { getPath } from '../../../router/RouteHelper'
// import Hide from '../../../utility/Hide'
import { deleteOv, loadOv } from '../../../utility/apis/ovhour'
import { IconSizes } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import useModules from '../../../utility/hooks/useModules'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { concatString, formatDate } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import NoActiveModule from '../../components/NoModule'
// import NoActiveModule from '../../components/NoModule'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'
import ImportOv from './Fragment/OvImport'

//import CompleteModal from './CompleteModal'

import OvModal from './Fragment/OvModal'
import OvFilter from './OvFilter'
import OvModalView from './view/OvModalView'

const Ov = () => {
  const history = useHistory()
  const params = useParams()
  const location = useLocation()
  const id = params?.id ?? null
  const token = params?.token ?? null
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [reload, setReload] = useState(false)
  const [edit, setEdit] = useState(null)
  const [filterData, setFilterData] = useState({ group_by: 'yes' })
  const [importModal, setImportModal] = useState(null)
  const { ViewSchedule } = useModules()

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])
  const handleImport = () => setImportModal(!importModal)
  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(e)
      setEdit(null)
      setShowView(e)
    }
  }

  const FollowupCard = (obe, index) => {
    return (
      <>
        <div className='flex-1' key={`ip-${index}`}>
          <Card className='animate__animated animate__fadeIn'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='11' className='d-flex align-items-center'>
                  <Row>
                    {/* <Col xs="2">
                                            <Avatar color={followup?.status === 1 ? 'light-primary' : 'light-primary'} content={getInitials(followup?.title)} />
                                        </Col> */}
                    <Col>
                      <h5 className='mb-0 fw-bolder text-primary d-flex align-items-center text-capitalize'>
                        {/* {followup?.title} */}
                        <Show IF={isValid(obe?.end_date) && !isValid(token)}>
                          <List size={20} className='me-25' />
                        </Show>
                        {concatString(obe?.title, 30)}
                      </h5>
                      <p
                        className={classNames('mb-0 text-small-12 text-truncate', {
                          'text-danger': obe?.ob_type === 'red'
                        })}
                      >
                        {FM(obe?.ob_type === 'red' ? 'red-day' : obe?.ob_type)}
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
                        IF: isValid(obe?.end_date) && !isValid(token),
                        icon: isValid(obe?.end_date) ? <List size={14} /> : <Eye size={14} />,
                        onClick: () => {
                          if (isValid(obe?.end_date)) {
                            history.push({
                              pathname: getPath('schedule.ov-list', {
                                id: obe?.id,
                                token: obe?.group_token
                              }),
                              state: { name: obe?.title }
                            })
                          } else {
                            // setShowView(true)
                            // setEdit(obe)
                          }
                        },
                        name: FM('view')
                      },
                      {
                        IF: Permissions.workShiftEdit,
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowAdd(true)
                          setEdit(obe)
                        },
                        name: FM('edit')
                      },
                      {
                        IF: Permissions.workShiftDelete,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={obe}
                            title={FM('delete-this', { name: obe?.title })}
                            color='text-warning'
                            onClickYes={() => deleteOv({ id: obe?.id })}
                            onSuccessEvent={(item) => {
                              dispatch(ovDelete(item?.id))
                            }}
                            className='dropdown-item'
                          >
                            <Trash2 size={14} className='me-1' style={{ marginTop: -3 }} />
                            {FM('delete')}
                          </ConfirmAlert>
                        )
                      }
                    ]}
                  />
                </Col>
              </Row>
            </CardBody>

            <CardBody className='border-top'>
              <Row className='align-items-center'>
                <Col md='6' className=''>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-time')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Clock size={14} /> {obe?.start_time ?? 'N/A'}
                    </a>
                  </p>
                </Col>
                <Col md='6' className=''>
                  <p className='mb-0 text-dark fw-bolder'>{FM('end-time')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Clock size={14} /> {obe?.end_time ?? 'N/A'}
                    </a>
                  </p>
                </Col>
                <Col md='6' className='mt-1'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('start-date')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Calendar size={14} /> {formatDate(obe?.date, 'DD MMMM, YYYY') ?? 'N/A'}
                    </a>
                  </p>
                </Col>
                <Show IF={isValid(obe?.end_date)}>
                  <Col md='6' className='mt-1'>
                    <p className='mb-0 text-dark fw-bolder'>{FM('end-date')}</p>
                    <p className='mb-0 fw-bold text-truncate'>
                      <a className='text-secondary'>
                        <Calendar size={14} /> {formatDate(obe?.end_date, 'DD MMMM, YYYY') ?? 'N/A'}
                      </a>
                    </p>
                  </Col>
                </Show>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }
  log(location)
  if (ViewSchedule) {
    return (
      <>
        <OvFilter
          id={id}
          show={showFilter}
          setFilterData={(e) => {
            setFilterData({
              ...filterData,
              ...e
            })
          }}
          filterData={filterData}
          handleFilterModal={() => {
            setShowFilter(false)
          }}
        />
        <OvModal
          showModal={showAdd}
          setShowModal={handleClose}
          followUpId={edit?.id}
          edit={edit}
          noView
        />
        <OvModalView
          showModal={showView}
          setShowModal={handleClose}
          followUpId={edit?.id}
          edit={edit}
          noView
        />
        <Header
          key={location?.state?.title}
          icon={
            isValid(id) ? (
              <ArrowLeft
                role='button'
                onClick={() => {
                  history.push(getPath('schedule.ov'))
                }}
              />
            ) : (
              <Crosshair />
            )
          }
          title={location?.state?.name ?? null}
        >
          <ButtonGroup className='ms-1'>
            <Hide IF={isValid(id)}>
              <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
              <OvModal Component={Button.Ripple} size='sm' color='primary' id='create-button'>
                <Plus size='16' />
              </OvModal>
              <UncontrolledTooltip target='import'>{FM('import')}</UncontrolledTooltip>
              <Button.Ripple size='sm' color='dark' onClick={handleImport} id='import'>
                <Upload size='16' />
              </Button.Ripple>
            </Hide>
            <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
            <Button.Ripple
              onClick={() => setShowFilter(true)}
              size='sm'
              color='secondary'
              id='filter'
            >
              <Sliders size='16' />
            </Button.Ripple>

            <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
            <Button.Ripple
              size='sm'
              color='dark'
              id='reload'
              onClick={() => {
                setFilterData({ group_by: 'yes' })
              }}
            >
              <RefreshCcw size='14' />
            </Button.Ripple>
          </ButtonGroup>
        </Header>
        <ImportOv
          open={importModal}
          setImportModal={setImportModal}
          handleImport={handleImport}
          refresh={reload}
          setReload={setReload}
        />

        <TableGrid
          refresh={reload}
          isRefreshed={setReload}
          loadFrom={loadOv}
          jsonData={{
            ...filterData,
            group_token: token ?? undefined,
            group_by: token ? 0 : 'yes'
          }}
          selector='ovhour'
          state='ovhour'
          display='grid'
          gridCol='4'
          gridView={FollowupCard}
        />
      </>
    )
  } else {
    return <NoActiveModule module='schedule' />
  }
}

export default Ov
