import moment from 'moment'
import React, { createRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Col, Label, Row, Spinner, Table } from 'reactstrap'
import { allLeaves, leaveScheduleFilter } from '../../../utility/apis/leave'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { formatDate } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'

const ShiftDays = ({
  currentMonth = null,
  active = null,
  ips = null,
  leave = null,
  useFieldArray = () => {},
  editIpRes = null,
  ipRes = null,
  reLabel = null,
  getValues = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors,
  setError
}) => {
  const dateRef = createRef()
  const startOfMonth = moment().startOf('month').toDate()
  const endOfMonth = moment().endOf('month').toDate()
  const [schedule, setSchedule] = useState(null)
  const user = useSelector((a) => a.auth.userData)
  const [loading, setLoading] = useState(false)
  const [dates, setDates] = useState([])

  const [filterData, setFilterData] = useState({
    shift_start_date: formatDate(startOfMonth, 'YYYY-MM-DD'),
    shift_end_date: formatDate(endOfMonth, 'YYYY-MM-DD'),
    employee_type: '',
    user_name: '',
    schedule_template_id: '',
    user_ids: [user?.id]
  })

  const getAllLeaves = (data) => {
    leaveScheduleFilter({
      id: user?.id,
      jsonData: {
        ...data,
        ...filterData
      },
      loading: setLoading,
      success: (e) => {
        setSchedule(e)
        setDates(...e?.map((a) => a.schedules?.map((d) => d.shift_date)))
      }
    })
  }

  useEffect(() => {
    getAllLeaves()
  }, [filterData])

  useEffect(() => {
    if (isValid(currentMonth)) {
      const startOfMonth = moment().month(currentMonth).startOf('month').toDate()
      const endOfMonth = moment().month(currentMonth).endOf('month').toDate()
      log(startOfMonth)
      dateRef.current.flatpickr.changeMonth(currentMonth, false)
      setFilterData({
        ...filterData,
        shift_start_date: formatDate(startOfMonth, 'YYYY-MM-DD'),
        shift_end_date: formatDate(endOfMonth, 'YYYY-MM-DD')
      })
    }
  }, [currentMonth])
  return (
    <>
      <Col md='6' className='pe-none'>
        <Label>
          {FM('schedule-date')}{' '}
          <Show IF={loading}>
            {' '}
            <Spinner animation='border' size={'sm'}>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </Show>
        </Label>
        <FormGroupCustom
          // value={allshift}

          placeholder={FM('date')}
          noGroup
          // noLabel
          errors={errors}
          type='date'
          options={{
            inline: true,
            mode: 'multiple'
            // minDate: "today"
            // enable: allshift
            // disable: isValidArray(leave) ? leave : []
          }}
          dateRef={dateRef}
          value={dates}
          className='pe-none'
          name='date'
          noLabel
          // label={FM("schedule-date")}
          control={control}
        />
      </Col>
    </>
  )
}

export default ShiftDays
