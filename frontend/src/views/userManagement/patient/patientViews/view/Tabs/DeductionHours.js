import { logError } from '@craco/craco/lib/logger'
import { HourglassEmptyOutlined, ViewWeek, WatchLater } from '@material-ui/icons'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import classNames from 'classnames'
import moment from 'moment'
import React, { useEffect, useReducer, useState } from 'react'
import { Calendar, Clock, List, Menu, Plus, RefreshCcw, ToggleLeft } from 'react-feather'
import { useForm } from 'react-hook-form'

import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
  Spinner,
  Table,
  UncontrolledTooltip
} from 'reactstrap'

import { CompanyTypes, companyTypes, presets } from '../../../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../../../utility/helpers/common'

import Show from '../../../../../../utility/Show'
import {
  createConstSelectOptions,
  fastLoop,
  formatDate,
  getDates,
  viewInHours
} from '../../../../../../utility/Utils'

import FormGroupCustom from '../../../../../components/formGroupCustom'

import Header from '../../../../../header'
// import WatchLater from '@mui/icons-material/WatchLater'
import { patientApprovalHours } from '../../../../../../utility/apis/commons'
import Hide from '../../../../../../utility/Hide'

const DeductionHours = ({ user }) => {
  const initState = {
    page: 1,
    perPage: 50,
    loading: false,
    employees: [],
    templates: [],
    dates: [],
    branches: [],
    startOfMonth: moment().startOf('week').toDate(),
    endOfMonth: moment().endOf('week').toDate()
  }
  /** @returns {initState} */
  const stateReducer = (o, n) => ({ ...o, ...n })
  const [state, setState] = useReducer(stateReducer, initState)
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
  const [patientHours, setPatientHours] = useState(null)
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(null)
  const [list, setList] = useState([])

  useEffect(() => {
    if (isValid(user?.id)) {
      setId(user?.id)
    }
  }, [user?.id])

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

  useEffect(() => {
    if (isValid(user)) {
      let assigned_hours_per_month = 0
      let assigned_hours_per_week = 0
      let assigned_hours_per_day = 0
      let assigned_hours = 0
      let completed_hours = 0
      let remaining_hours = 0

      fastLoop(user?.agency_hours, (h, i) => {
        assigned_hours_per_month += Number(h?.assigned_hours_per_month)
        assigned_hours_per_week += Number(h?.assigned_hours_per_week)
        assigned_hours_per_day += Number(h?.assigned_hours_per_day)
        assigned_hours += Number(h?.assigned_hours)
        completed_hours += Number(h?.completed_hours)
        remaining_hours += Number(h?.completed_hours) - Number(h?.assigned_hours)
      })
      setPatientHours({
        assigned_hours_per_month: assigned_hours_per_month * 60,
        assigned_hours_per_week: assigned_hours_per_week * 60,
        assigned_hours_per_day: assigned_hours_per_day * 60,
        assigned_hours: assigned_hours * 60,
        completed_hours: completed_hours * 60,
        remaining_hours: remaining_hours * 60,
        used_total_patient_hours: user?.used_total_patient_hours
      })
      // setValue("branch_id", patient?.branch_id)
    }
  }, [user])

  const loadApprovalHours = () => {
    if (isValid(id)) {
      patientApprovalHours({
        jsonData: {
          patient_id: id,
          start_date: formatDate(state?.startOfMonth) ?? null,
          end_date: formatDate(state?.endOfMonth) ?? null
        },
        loading: setLoading,
        success: (e) => {
          setList(e?.payload?.date)
          log(e?.payload?.date)
        }
      })
    }
  }

  useEffect(() => {
    if (isValid(id)) {
      loadApprovalHours()
    }
  }, [id, state.startOfMonth, state.endOfMonth])

  return (
    <div className='p-1'>
      <Header subHeading={FM('hours-deduction')} titleCol='8' childCol='4'></Header>

      <Row className='mt-0'>
        <Col md={12}>
          {/* <Card className='white'>
                        <CardBody className='p-0 '> */}
          <Row className='flex-1 m-0 gx-1'>
            <Show IF={isValid(user?.id)}>
              <Col md='4'>
                <StatsHorizontal
                  className={'white'}
                  icon={<WatchLater fontSize='small' />}
                  color='primary'
                  stats={
                    patientHours?.assigned_hours
                      ? viewInHours(patientHours?.assigned_hours)
                      : '00:00'
                  }
                  statTitle={FM('total-hours')}
                />
              </Col>
              <Col md='4'>
                <StatsHorizontal
                  className={'white'}
                  icon={<WatchLater fontSize='small' />}
                  color='danger'
                  stats={
                    patientHours?.used_total_patient_hours
                      ? viewInHours(patientHours?.used_total_patient_hours)
                      : '00:00'
                  }
                  statTitle={FM('hours-used')}
                />
              </Col>
              <Col md='4'>
                <StatsHorizontal
                  className={'white'}
                  icon={<WatchLater fontSize='small' />}
                  color='success'
                  stats={
                    patientHours?.assigned_hours - patientHours?.used_total_patient_hours
                      ? viewInHours(
                          patientHours?.assigned_hours - patientHours?.used_total_patient_hours
                        )
                      : '00:00'
                  }
                  statTitle={FM('remaining-hours')}
                />
              </Col>
            </Show>
          </Row>
          <Row className='mb-1 mt-0'>
            <Col md='4'>
              <FormGroupCustom
                key={`start-${state.startOfMonth}-${state.endOfMonth}-${watch('user_id')}`}
                noGroup
                noLabel
                placeholder={FM('preset')}
                type={'select'}
                isClearable
                value={watch('preset')}
                onChangeValue={handlePresets}
                control={control}
                options={createConstSelectOptions(presets, FM)}
                name={'preset'}
                className={classNames('mb-1')}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                key={`start-${state.startOfMonth}-${watch('user_id')}`}
                noGroup
                noLabel
                name='from'
                value={state.startOfMonth}
                onChangeValue={(startOfMonth) => {
                  setValue('preset', null)
                  setState({ startOfMonth })
                }}
                control={control}
                label={'from-date'}
                setValue={setValue}
                type={'date'}
                className={classNames('mb-1')}
              />
            </Col>
            <Col md='4'>
              <FormGroupCustom
                key={`end-${state.endOfMonth}-${watch('user_id')}`}
                noGroup
                noLabel
                name='to'
                value={state.endOfMonth}
                onChangeValue={(endOfMonth) => {
                  setValue('preset', null)
                  setState({ endOfMonth })
                }}
                control={control}
                label={'to-date'}
                setValue={setValue}
                type={'date'}
                className={classNames('mb-1')}
              />
            </Col>
          </Row>
          <Table responsive striped bordered size='md'>
            <thead>
              <tr>
                <th scope='col'>{FM('dates')}</th>
                {/* <th scope="col">{FM("total-hours")}</th> */}
                <th scope='col'>{FM('hours-used')}</th>
                <th scope='col'>{FM('remaining-hours')}</th>
                <th scope='col'>{FM('status')}</th>
              </tr>
            </thead>
            <tbody>
              {isValidArray(list)
                ? list?.map((d, i) => {
                    return (
                      <tr>
                        <td>{formatDate(d?.date)}</td>
                        <td>{viewInHours(d?.minutes)}</td>
                        <td>{viewInHours(d?.remaining_minutes)}</td>
                        <td>{FM(d?.status === 1 ? 'approved' : 'not-approved')}</td>
                        {/* <td>{viewInHours(patientHours?.assigned_hours_per_month)}</td> */}
                        {/* <Hide IF={viewInHours(patientHours?.assigned_hours_per_month - (patientHours?.assigned_hours_per_day * (i + 1))) <= "00:00"} >
                                                        <td>{i > 0 ? viewInHours(patientHours?.assigned_hours_per_month - (patientHours?.assigned_hours_per_day * (i + 1))) : viewInHours(patientHours?.assigned_hours_per_month)}</td>
                                                    </Hide>
                                                    <Show IF={viewInHours(patientHours?.assigned_hours_per_month - (patientHours?.assigned_hours_per_day * (i + 1))) <= "00:00"}>
                                                        <td>{FM("00-00")}</td>
                                                    </Show>
                                                    <td>{viewInHours(patientHours?.assigned_hours_per_day)}</td> */}
                        {/* <td>{viewInHours(patientHours?.assigned_hours_per_week)}</td> */}
                        {/* <td>{viewInHours(Number(d?.hours * 60))}</td> */}
                      </tr>
                    )
                  })
                : []}
            </tbody>
          </Table>
          {/* </CardBody> */}
          {/* <CardFooter className='p-1'>
                            <span className='fw-bold text-secondary'>
                                Showing 1 of 2540 employees
                            </span>{" "}
                            <span className='ms-25 text-primary fw-bolder' role={"button"} onClick={loadMore}>
                                {state.loading && state.page > 1 ? <Spinner animation="border" size={"sm"}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner> : "Load More"}
                            </span>
                        </CardFooter> */}
          {/* </Card> */}
        </Col>
      </Row>
    </div>
  )
}

export default DeductionHours
