/* eslint-disable no-confusing-arrow */
import { AspectRatio, ZoomOutMap } from '@material-ui/icons'
import classNames from 'classnames'
import { param } from 'jquery'
import moment from 'moment'
import { useEffect, useReducer, useRef } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { ArrowLeft, Calendar, Clock, Download, Edit2, Menu, Plus, RefreshCcw } from 'react-feather'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { useForm } from 'react-hook-form'
import ReactPaginate from 'react-paginate'
import { ResizableBox } from 'react-resizable'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  InputGroupText,
  Row,
  Spinner,
  Table,
  UncontrolledTooltip
} from 'reactstrap'
import { getPath } from '../../../router/RouteHelper'
import {
  loadScheduleFilter,
  printScheduleEmpBased,
  printSchedulePatientBased
} from '../../../utility/apis/schedule'
import { loadScTemplate } from '../../../utility/apis/scheduleTemplate'
import { loadUser } from '../../../utility/apis/userManagement'
import { empType, perPageOptions, presets, UserTypes } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import { useSkin } from '../../../utility/hooks/useSkin'
import useTopMostParent from '../../../utility/hooks/useTopMostParent'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import {
  addDay,
  createAsyncSelectOptions,
  createConstSelectOptions,
  createSelectOptions,
  fastLoop,
  formatDate,
  getDates
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import ScheduleTemplateModal from '../scheduleTemplate/fragments/scheduleTemplateModal'
import ScheduleModal from './fragment/ScheduleModal'

const d = [
  'leave_applied',
  'leave_type',
  'id',
  'leave_reason',
  'ob_type',
  'ov_start_time',
  'ov_end_time',
  'patient_id',
  'schedule_type',
  'shift_date',
  'shift_end_time',
  'shift_start_time',
  'shift_name',
  'emergency_work_duration',
  'extra_work_duration',
  'scheduled_work_duration',
  'vacation_duration',
  'ob_work_duration'
]

const TemplateView = () => {
  const { skin } = useSkin()
  const { control, watch, setValue } = useForm()
  const history = useHistory()
  const handle = useFullScreenHandle()
  const params = useParams()
  const location = useLocation()
  const topMostParent = useTopMostParent()

  // Reducer State
  const initState = {
    lastPage: null,
    total: 0,
    page: 1,
    perPage: 30,
    loading: false,
    employees: [],
    templates: [],
    dates: [],
    branches: [],
    startOfMonth: moment().startOf('week').toDate(),
    endOfMonth: moment().endOf('week').toDate(),
    dom: null,
    height: null,
    initHeight: null,
    width: null
  }
  /** @returns {initState} */
  const stateReducer = (o, n) => ({ ...o, ...n })
  const [state, setState] = useReducer(stateReducer, initState)
  // End Reducer State

  const loadTemplateOptions = async (search, loadedOptions, { page }) => {
    const res = await loadScTemplate({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'title', null, (templates) =>
      setState({ templates })
    )
  }

  const loadBranchOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: 11 }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', (branches) => setState({ branches }))
  }

  const handleEmployees = (payload) => {
    setState({
      employees: payload?.data,
      page: parseInt(payload?.current_page),
      lastPage: payload?.last_page,
      total: payload?.total
    })
  }

  const loadEmployees = () => {
    if (isValid(state.startOfMonth) && isValid(state.endOfMonth) && isValid(topMostParent?.id)) {
      loadScheduleFilter({
        page: state.page,
        perPage: state.perPage,
        jsonData: {
          // status: params?.id ? null : 1,
          branch_id: topMostParent?.id,
          all_employee: true,
          user_type_id: UserTypes.employee,
          shift_start_date: formatDate(state.startOfMonth),
          shift_end_date: formatDate(state.endOfMonth),
          employee_type: watch('employee_type'),
          is_active: params?.id ? null : 1,
          schedule_template_id: isValid(params?.id)
            ? params?.id
            : isValid(watch('template_id'))
            ? watch('template_id')
            : null
        },
        loading: (e) => {
          setState({ loading: e })
        },
        success: handleEmployees
      })
    }
  }
  const printEmpData = () => {
    printScheduleEmpBased({
      jsonData: {
        user_id: watch('user_id'),
        start_date: formatDate(state.startOfMonth) ?? '',
        end_date: formatDate(state.endOfMonth) ?? ''
      }
    })
  }
  const printPatientData = () => {
    printSchedulePatientBased({
      jsonData: {
        user_id: watch('patient_id'),
        start_date: formatDate(state.startOfMonth) ?? '',
        end_date: formatDate(state.endOfMonth) ?? ''
      }
    })
  }

  useEffect(() => {
    // if (isValid(watch('template_id'))) {
    loadEmployees()
    // }
  }, [
    watch('template_id'),
    watch('branch_id'),
    watch('employee_type'),
    topMostParent,
    state.startOfMonth,
    state.endOfMonth,
    state.page,
    state.perPage
  ])

  useEffect(() => {
    if (isValid(params?.id)) {
      loadEmployees()
    }
  }, [
    params?.id,
    watch('branch_id'),
    watch('employee_type'),
    topMostParent,
    state.startOfMonth,
    state.endOfMonth,
    state.page,
    state.perPage
  ])

  const handlePresets = (preset) => {
    if (isValid(preset)) {
      if (preset === presets.thisMonth) {
        const startOfMonth = moment().startOf('month').toDate()
        const endOfMonth = moment().endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.thisWeek) {
        const startOfMonth = moment().startOf('week').toDate()
        const endOfMonth = moment().endOf('week').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.prevMonth) {
        const startOfMonth = moment().subtract(1, 'months').startOf('month').toDate()
        const endOfMonth = moment().subtract(1, 'months').endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === presets.nextMonth) {
        const startOfMonth = moment().add(1, 'months').startOf('month').toDate()
        const endOfMonth = moment().add(1, 'months').endOf('month').toDate()
        const dates = getDates(startOfMonth, endOfMonth)
        setState({ dates, startOfMonth, endOfMonth })
      } else if (preset === 'custom') {
        if (isValid(state.startOfMonth) && isValid(state.endOfMonth)) {
          const dates = getDates(state.startOfMonth, state.endOfMonth)
          setState({ dates })
        }
      }
    }
  }

  useEffect(() => {
    handlePresets('custom')
  }, [state?.startOfMonth, state?.endOfMonth])

  const loadMore = (page) => {
    setState({
      page
    })
  }
  const handleFullScreen = () => {
    if (handle.active) {
      setState({ height: state.initHeight })
      handle.exit()
    } else {
      const width =
        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      const height =
        window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      setState({ width, height: height - 15 })
      // document.getElementById('destination').appendChild(document.getElementById('source'))
      handle.enter()
    }
  }

  useEffect(() => {
    if (!handle.active) {
      setState({ height: state.initHeight })
    }
  }, [handle.active])

  useEffect(() => {
    const dom = document.getElementById('schedule-card')

    setState({ dom, initHeight: dom.offsetHeight })
  }, [])

  useEffect(() => {
    if (isValid(state.dom)) {
      const resizeObserver = new ResizeObserver((entries) => {
        setState({ width: entries[0].target.offsetWidth, height: entries[0].target.offsetHeight })
      })
      // start observing a DOM node
      resizeObserver.observe(state.dom)
    }
  }, [state.dom])

  const renderShifts = (employee, date) => {
    const re = []
    const schedules = employee?.schedules
    if (isValidArray(schedules)) {
      const schedulesToday = schedules?.filter(
        (a) => a.shift_date === formatDate(date, 'YYYY-MM-DD')
      )
      fastLoop(schedulesToday, (schedule, index) => {
        if (schedule?.leave_applied === 1) {
          re.push(
            <>
              <center
                key={`schedule-${date}-${index}-${employee?.id}`}
                className='text-small-12 fw-bolder badge bg-danger rounded-pill'
              >
                {schedule?.leave_type === 'vacation'
                  ? FM('schedule-vacation-short-form')
                  : FM('schedule-leave-short-form')}
              </center>
            </>
          )
        } else {
          re.push(
            <>
              <span
                key={`schedule-${date}-${index}-${employee?.id}`}
                className='text-small-12 m-25 text-dark fw-bolder d-block'
              >
                {formatDate(schedule?.shift_start_time, 'hh:mm A')}
                {' - '}
                {formatDate(schedule?.shift_end_time, 'hh:mm A')}
              </span>
            </>
          )
        }
      })
    }
    return re
  }

  const renderTdDates = (employee, eIndex) => {
    const th = []
    const td = []
    fastLoop(state.dates, (date, index) => {
      if (eIndex === 0) {
        th.push(
          <>
            <th key={`th-${index}-${eIndex}`} className={`text-center`}>
              {formatDate(date, 'DD-MM-YYYY')}
            </th>
          </>
        )
      }
      td.push(
        <>
          <td key={`td-${index}-${eIndex}`} className='text-center'>
            {renderShifts(employee, date)}
          </td>
        </>
      )
    })
    return { th, td }
  }

  const renderDates = () => {
    if (isValidArray(state?.employees)) {
      const th = []
      const tr = []
      fastLoop(state.employees, (employee, index) => {
        const row = renderTdDates(employee, index)
        th.push(...row.th)
        tr.push(
          <>
            <tr key={`tr-${index}-row`}>
              <th className={`text-start text-capitalize ${skin}`}>
                {String(employee.name).toLocaleLowerCase()}
              </th>
              {row.td}
            </tr>
          </>
        )
      })
      if (tr.length > 0) {
        return (
          <>
            <thead>
              <tr>
                <th>{FM('employee')}</th>
                {th}
              </tr>
            </thead>
            <tbody>{tr}</tbody>
          </>
        )
      }
    } else {
      return null
    }
  }
  return (
    <div>
      <Header
        title={location?.state?.data?.title ?? FM('schedules')}
        subHeading={FM('table-view')}
        titleCol='8'
        childCol='4'
        description={!isValid(params?.id) ? FM('schedule-table-view-description') : ''}
        icon={
          params?.id ? (
            <ArrowLeft
              role={'button'}
              onClick={() => {
                history?.push(getPath('schedule.template'))
              }}
            />
          ) : (
            <Clock style={{ marginTop: -3 }} />
          )
        }
      >
        <ButtonGroup className='ms-1' color='dark'>
          <Show IF={Permissions.scheduleSelfBrowse}>
            <BsTooltip
              size='sm'
              color='primary'
              role={'button'}
              title={FM('calendar-view')}
              Tag={Button}
              onClick={() =>
                params?.id
                  ? history?.push({
                      pathname: getPath('schedule.calender.view', { id: params?.id }),
                      state: location?.state
                    })
                  : history.push(getPath('schedule.calendar'))
              }
            >
              <Calendar size='14' />
            </BsTooltip>
          </Show>
          {/* 
                    {params?.id ? <BsTooltip title={FM("new-schedule-template")} Tag={ScheduleTemplateModal} Component={Button.Ripple} className='btn btn-primary btn-sm' size="sm" outline color="dark" >
                        <Plus size="14" />
                    </BsTooltip> : <BsTooltip title={FM("new-schedule-template")} Tag={ScheduleModal} Component={Button.Ripple} className='btn btn-primary btn-sm' size="sm" outline color="dark" >
                        <Plus size="14" />
                    </BsTooltip>} */}
          {params?.id && !isValid(location?.state?.data?.deactivation_date) ? (
            <>
              <UncontrolledTooltip target='create-button'>
                {params?.id ? FM('edit') : FM('create-new')}
              </UncontrolledTooltip>
              <ScheduleModal
                templateId={params?.id}
                responseData={loadEmployees}
                Component={Button.Ripple}
                className='btn btn-primary btn-sm'
                size='sm'
                outline
                color='dark'
                id='create-button'
              >
                <Edit2 size={14} />
              </ScheduleModal>
            </>
          ) : null}
          <Hide IF={!isValid(watch('user_id'))}>
            <UncontrolledTooltip target='export'>{FM('export')}</UncontrolledTooltip>
            <Button.Ripple onClick={printEmpData} size='sm' color='secondary' id='export'>
              <Download size='14' />
            </Button.Ripple>
          </Hide>
          <Hide IF={!isValid(watch('patient_id'))}>
            <UncontrolledTooltip target='export'>{FM('export')}</UncontrolledTooltip>
            <Button.Ripple onClick={printPatientData} size='sm' color='secondary' id='export'>
              <Download size='14' />
            </Button.Ripple>
          </Hide>
          <LoadingButton
            loading={false}
            size='sm'
            color='dark'
            tooltip={FM('refresh-data')}
            onClick={() => {}}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>

      <Row className='mt-2'>
        <Col md={12}>
          <FullScreen handle={handle}>
            <Card className='white'>
              <CardHeader className='border-bottom p-1'>
                <Row className='flex-1'>
                  <Hide IF={isValid(params?.id)}>
                    <Col md='2'>
                      <FormGroupCustom
                        noGroup
                        noLabel
                        placeholder={FM('template')}
                        type={'select'}
                        async
                        isClearable
                        defaultOptions
                        control={control}
                        options={state.templates}
                        matchWith='id'
                        loadOptions={loadTemplateOptions}
                        name={'template_id'}
                        className={classNames('mb-0')}
                      />
                    </Col>
                  </Hide>

                  {/* <Col md="2">
                                        <FormGroupCustom
                                            noLabel
                                            noGroup
                                            placeholder={FM("branch")}
                                            type={"select"}
                                            isDisabled={!state.branches?.length}
                                            async
                                            isClearable
                                            defaultOptions
                                            control={control}
                                            options={state.branches}
                                            loadOptions={loadBranchOptions}
                                            name={"branch_id"}
                                        />
                                    </Col> */}
                  <Col md='2'>
                    <FormGroupCustom
                      noGroup
                      noLabel
                      placeholder={FM('employee-type')}
                      type={'select'}
                      isClearable
                      control={control}
                      options={createConstSelectOptions(empType, FM)}
                      name={'employee_type'}
                      className={classNames('mb-0')}
                    />
                  </Col>
                  {/* <Col md="2">
                                        <FormGroupCustom
                                            key={`start-${state.startOfMonth}-${state.endOfMonth}`}
                                            noGroup
                                            noLabel
                                            placeholder={FM("preset")}
                                            type={"select"}
                                            isClearable
                                            value={watch('preset')}
                                            onChangeValue={handlePresets}
                                            control={control}
                                            options={createConstSelectOptions(presets, FM)}
                                            name={"preset"}
                                            className={classNames('mb-0')}
                                        />
                                    </Col> */}
                  <Col md='2'>
                    <FormGroupCustom
                      key={`start-${state.startOfMonth}-${handle.active}`}
                      noGroup
                      noLabel
                      name='from'
                      appendTo={handle.active}
                      value={state.startOfMonth}
                      onChangeValue={(startOfMonth) => {
                        setValue('preset', null)
                        setState({ startOfMonth })
                      }}
                      control={control}
                      label={'from-date'}
                      setValue={setValue}
                      type={'date'}
                      className={classNames('mb-0')}
                    />
                  </Col>
                  <Col md='2'>
                    <FormGroupCustom
                      key={`end-${state.endOfMonth}-${handle.active}`}
                      noGroup
                      noLabel
                      name='to'
                      options={{
                        minDate: state.startOfMonth ?? null,
                        maxDate: isValid(state.startOfMonth)
                          ? new Date(addDay(state.startOfMonth, 365))
                          : null ?? null
                      }}
                      appendTo={handle.active}
                      value={state.endOfMonth}
                      onChangeValue={(endOfMonth) => {
                        setValue('preset', null)
                        setState({ endOfMonth })
                      }}
                      control={control}
                      label={'to-date'}
                      setValue={setValue}
                      type={'date'}
                      className={classNames('mb-0')}
                    />
                  </Col>
                </Row>
              </CardHeader>
              <CardBody
                id='schedule-card'
                className='p-0 border-bottom-0'
                style={{ minHeight: /*326*/ 500, overflow: 'hidden' }}
              >
                <Show IF={state.loading}>
                  <div className='loader-top '>
                    <span className='spinner'>
                      <Spinner color='primary' animation='border' size={'xl'}>
                        <span className='visually-hidden'>Loading...</span>
                      </Spinner>
                    </span>
                  </div>
                </Show>
                <Show IF={!isValidArray(state?.employees)}>
                  <div className='p-5 text-center'>{FM('please-select-schedule-first')}</div>
                </Show>
                <Show IF={isValidArray(state.employees)}>
                  <ResizableBox
                    axis='y'
                    width={state.width}
                    height={state.height}
                    handle={
                      // <Hide IF={handle.active}>
                      <div role={'button'} className='resize-height'>
                        {/* <BsTooltip title={FM("resize-table")}> <AspectRatio /></BsTooltip> */}
                      </div>
                      // </Hide>
                    }
                    maxConstraints={[state.width, 2000]}
                    minConstraints={[state.width, state.initHeight]}
                  >
                    <Scrollbars
                      renderThumbHorizontal={({ style, ...props }) => (
                        <div
                          {...props}
                          style={{
                            ...style,
                            height: 8,
                            left: 0,
                            bottom: 0,
                            zIndex: 5,
                            backgroundColor: skin === 'light' ? '#e0e0e0' : '#5e5e5e'
                          }}
                        />
                      )}
                      renderThumbVertical={({ style, ...props }) => (
                        <div
                          {...props}
                          style={{
                            ...style,
                            width: 8,
                            zIndex: 5,
                            backgroundColor: skin === 'light' ? '#e0e0e0' : '#5e5e5e'
                          }}
                        />
                      )}
                    >
                      <Table striped bordered size='sm' className={`fixed-table scheduled `}>
                        {renderDates()}
                      </Table>
                    </Scrollbars>
                  </ResizableBox>
                </Show>
              </CardBody>
              <CardFooter className='p-1'>
                <Row className='d-flex align-items-center'>
                  <Col md='4' className='d-flex align-items-center'>
                    <FormGroupCustom
                      noLabel
                      prepend={<InputGroupText>{FM('per-page')}</InputGroupText>}
                      placeholder={FM('per-page')}
                      type={'select'}
                      control={control}
                      value={state.perPage}
                      onChangeValue={(perPage) => setState({ perPage, page: 1 })}
                      options={createConstSelectOptions(perPageOptions, FM)}
                      name={'perPage'}
                      menuPlacement='top'
                      className='me-2'
                    />
                    <ReactPaginate
                      initialPage={parseInt(state.page) - 1}
                      disableInitialCallback
                      onPageChange={(page) => {
                        loadMore(page?.selected + 1)
                      }}
                      pageCount={Math.ceil(state?.total / parseInt(state?.perPage))}
                      key={`pager-${parseInt(state.page) - 1}`}
                      nextLabel={''}
                      breakLabel={'...'}
                      breakClassName='page-item'
                      breakLinkClassName='page-link'
                      activeClassName={'active'}
                      pageClassName={'page-item'}
                      previousLabel={''}
                      nextLinkClassName={'page-link'}
                      nextClassName={'page-item next'}
                      previousClassName={'page-item prev'}
                      previousLinkClassName={'page-link'}
                      pageLinkClassName={'page-link'}
                      containerClassName={'pagination react-paginate justify-content-start mb-0'}
                    />
                  </Col>
                  <Col md='8' className='d-flex align-items-center justify-content-end'>
                    <Show IF={isValidArray(state?.employees)}>
                      <BsTooltip title={handle.active ? FM('exit-full-screen') : FM('full-screen')}>
                        <ZoomOutMap className='ms-1' onClick={handleFullScreen} />
                      </BsTooltip>
                    </Show>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </FullScreen>
        </Col>
      </Row>
    </div>
  )
}

export default TemplateView
