import React, { useEffect, useState } from 'react'
import { Calendar, Plus, X } from 'react-feather'
import { useFieldArray } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Badge, Card, CardBody, CardHeader, Col, Row } from 'reactstrap'
import { companyTypes, Patterns, UserTypes } from '../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import {
  addDay,
  calculateTime,
  enableFutureDates,
  fastLoop,
  getAllotedDays,
  getExactTime,
  JsonParseValidate,
  viewInHours
} from '../../../../utility/Utils'
import DropZone from '../../../components/buttons/fileUploader'
import FormGroupCustom from '../../../components/formGroupCustom'
import Shimmer from '../../../components/shimmers/Shimmer'
import BsTooltip from '../../../components/tooltip'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { HourglassEmptyOutlined, ViewWeek } from '@material-ui/icons'
import { Label } from 'recharts'

const a = [
  {
    no_of_hours: '',
    issuer: '',
    start_date: '',
    end_date: ''
  }
]
const UserStep6 = ({
  getValues = () => {},
  activeIndex = null,
  userType = null,
  createFor = null,
  setDisplay = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit = null,
  onSubmit,
  control,
  errors
}) => {
  const [time, setTime] = useState(null)
  const [end, setEnd] = useState(null)
  const [dateCount, setDateCount] = useState(null)
  const [updated, setUpdated] = useState(null)
  const [required, setRequired] = useState(false)
  const [day, setDay] = useState(null)
  const [week, setWeek] = useState(null)
  const [month, setMonth] = useState(null)

  const user = useSelector((s) => s.auth.userData)

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'agency_hours' // unique name for your Field Array
  })

  useEffect(() => {
    const wh = watch('agency_hours')
    fastLoop(wh, (d, i) => {
      const start = d?.start_date
      const end = d?.end_date
      const hours = d?.assigned_hours
      const day = getExactTime(`${start} 00:00:00`, `${end} 00:00:00`)
      log(d?.start_date, day)
      const perDay = hours / (day?.days + 1)
      const perWeek = perDay * 7
      const perMonth = perDay * 30
      if (day.days > 0) {
        setValue(`agency_hours[${i}].assigned_hours_per_day`, perDay.toFixed(2) * 60)
        setValue(`agency_hours[${i}].assigned_hours_per_month`, perMonth.toFixed(2) * 60)
        setValue(`agency_hours[${i}].assigned_hours_per_week`, perWeek.toFixed(2) * 60)
      }
      log(perDay)
      log(perWeek)
      log(perMonth)
    })
    log('wh', wh)
  }, [updated])

  useEffect(() => {
    const s = isValid(watch('start_date')) ? watch('start_date') : null
    if (s) {
      const e = isValid(watch('end_date')) ? watch('end_date') : addDay(watch('start_date'), 365)
      const getDiff = calculateTime(new Date(s), new Date(e))
      setEnd(e)
      if (getDiff) {
        setTime(getDiff)
      }
    }
  }, [watch('start_date')])

  useEffect(() => {
    const s = isValid(watch('start_date')) ? watch('start_date') : null
    if (s) {
      const e = isValid(watch('end_date')) ? watch('end_date') : addDay(watch('start_date'), 365)
      const getDiff = calculateTime(new Date(s), new Date(e))
      setEnd(e)
      if (getDiff) {
        setTime(getDiff)
      }
    }
  }, [watch('end_date')])

  useEffect(() => {
    if (edit === null) {
      if (fields?.length === 0) {
        append({
          name: ' ',
          assigned_hours_per_day: ' ',
          assigned_hours_per_month: ' ',
          assigned_hours_per_week: '  ',
          assigned_hours: ' ',
          start_date: ' ',
          end_date: ''
        })
      }
    } else {
      if (edit !== null) {
        if (isValidArray(edit?.agency_hours)) {
          log('valid')
          remove()
          edit?.agency_hours?.map((d, i) => {
            append({
              name: d?.name,
              assigned_hours_per_day: d?.assigned_hours_per_day * 60,
              assigned_hours_per_month: d?.assigned_hours_per_month * 60,
              assigned_hours_per_week: d?.assigned_hours_per_week * 60,
              assigned_hours: Number(d?.assigned_hours).toFixed(),
              start_date: d.start_date,
              end_date: d?.end_date
            })
          })
        } else {
          append({
            name: '',
            assigned_hours_per_day: '',
            assigned_hours_per_month: '',
            assigned_hours_per_week: '',
            assigned_hours: '',
            start_date: '',
            end_date: ''
          })
        }
      }
    }
  }, [edit])

  useEffect(() => {
    // if (user !== null) {
    // const types = JsonParseValidate(user?.company_type_id)
    // if (types?.includes(companyTypes?.group)) {
    if (
      watch('company_type_id') === companyTypes.home ||
      watch('company_type_id') === companyTypes.single
    ) {
      setRequired(false)
    } else {
      setRequired(false)
    }
    // } else {
    //     setRequired(true)
    // }
    // }
  }, [watch('company_type_id')])

  const findErrors = (name, index) => {
    let x = false
    if (errors && errors?.agency_hours && errors?.agency_hours[index]) {
      const a = errors?.agency_hours[index]
      x = a?.hasOwnProperty(name)
    }
    return x
  }
  // return null

  return (
    <div className='w-100 overflow-x-hidden p-2'>
      {loadingDetails ? (
        <Row>
          <Col md='12' className='d-flex align-items-stretch'>
            <Card>
              <CardBody className='p-0'>
                <Row>
                  <Col md='6'>
                    <Shimmer style={{ height: 40 }} />
                  </Col>
                  <Col md='6'>
                    <Shimmer style={{ height: 40 }} />
                  </Col>
                  <Col md='12' className='mt-2'>
                    <Shimmer style={{ height: 320 }} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          <Show IF={userType === UserTypes.patient}>
            <Card className=''>
              <CardHeader className='text-dark fw-bold border-bottom pb-2'>
                {FM('agency-details')}
              </CardHeader>
              <CardBody className='p-1'>
                {fields.map((field, i) => (
                  <div className='border-bottom mb-1'>
                    <Row className='mb-0'>
                      <Col md='2'>
                        <FormGroupCustom
                          key={`${field?.assigned_hours}-agency_hours[${i}].assigned_hours-${edit?.agency_hours[i]?.assigned_hours}`}
                          placeholder={FM('no-of-hours')}
                          label={FM('no-of-hours')}
                          name={`agency_hours[${i}].assigned_hours`}
                          type={'number'}
                          error={findErrors('assigned_hours', i)}
                          value={watch(`agency_hours[${i}].assigned_hours`)}
                          className='mb-1'
                          onChangeValue={(e) => setUpdated(e)}
                          control={control}
                          rules={{
                            required,
                            maxLength: 4,
                            pattern: required ? Patterns.NumberOnlyNoDot : undefined,
                            validate: (v) => {
                              return required
                                ? watch(`agency_hours[${i}].assigned_hours_per_day`) <= 24 * 60
                                : true
                            }
                          }}
                        />
                      </Col>

                      <Col md='3'>
                        <FormGroupCustom
                          key={`${field?.name}-agency_hours[${i}].name-${edit?.agency_hours[i]?.name}`}
                          placeholder={FM('issuer')}
                          label={FM('issuer')}
                          name={`agency_hours[${i}].name`}
                          type={'text'}
                          error={findErrors('name', i)}
                          value={watch(`agency_hours[${i}].name`)}
                          className='mb-1'
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>

                      <Col md='3'>
                        <FormGroupCustom
                          key={`${field?.start_date}-agency_hours[${i}].start_date-${edit?.agency_hours[i]?.start_date}`}
                          placeholder={FM('start-date')}
                          label={FM('start-date')}
                          name={`agency_hours[${i}].start_date`}
                          type={'date'}
                          onChangeValue={(e) => setUpdated(e)}
                          setValue={setValue}
                          error={findErrors('start_date', i)}
                          value={watch(`agency_hours[${i}].start_date`)}
                          options={
                            {
                              // minDate: isValid(watch(`agency_hours[${(i - 1)}].end_date`)) ? addDay(new Date(watch(`agency_hours[${(i - 1)}].end_date`)), 1) : null
                              // enable: [function (date) { return enableFutureDates(date) }, edit?.agency_hours[i]?.start_date, new Date()]
                            }
                          }
                          className='mb-1'
                          control={control}
                          rules={{ required }}
                        />
                      </Col>

                      <Col md='3'>
                        <FormGroupCustom
                          key={`${field?.end_date}-agency_hours[${i}].end_date-${edit?.agency_hours[i]?.end_date}`}
                          placeholder={FM('end-date')}
                          label={FM('end-date')}
                          name={`agency_hours[${i}].end_date`}
                          type={'date'}
                          error={findErrors('end_date', i)}
                          value={watch(`agency_hours[${i}].end_date`)}
                          options={{
                            // enable: [function (date) { return enableFutureDates(date) }, edit?.agency_hours[i]?.end_date, new Date()]
                            // minDate: addDay(new Date(watch(`agency_hours[${i}].start_date`)), 1) ?? null
                            minDate: new Date(watch(`agency_hours[${i}].start_date`)) ?? null
                          }}
                          onChangeValue={(e) => setUpdated(e)}
                          setValue={setValue}
                          className='mb-1'
                          control={control}
                          rules={{ required }}
                        />
                      </Col>

                      <Col md='1' className='d-flex align-items-center justify-content-center p-0'>
                        <Show IF={fields.length - 1 === i}>
                          <BsTooltip
                            Tag={Plus}
                            title={FM('new-date')}
                            size={18}
                            className='me-1'
                            role='button'
                            color='green'
                            onClick={() => {
                              append({
                                name: '',
                                assigned_hours_per_day: '',
                                assigned_hours_per_month: '',
                                assigned_hours_per_week: '',
                                assigned_hours: '',
                                start_date: '',
                                end_date: ''
                              })
                            }}
                          />
                        </Show>

                        <Hide IF={i === 0}>
                          <BsTooltip
                            i={i}
                            Tag={X}
                            title={FM('remove')}
                            size={18}
                            color='red'
                            role='button'
                            className=''
                            onClick={(e) => {
                              remove(i)
                            }}
                          />
                        </Hide>
                      </Col>
                      {watch(`agency_hours[${i}].assigned_hours_per_day`) ? (
                        <Row className='mb-2'>
                          <Col md='3'>
                            <StatsHorizontal
                              className={'white'}
                              icon={<HourglassEmptyOutlined size={30} />}
                              color='primary'
                              stats={
                                watch(`agency_hours[${i}].assigned_hours_per_day`) ? (
                                  <span
                                    className={
                                      watch(`agency_hours[${i}].assigned_hours_per_day`) > 24 * 60
                                        ? 'text-danger'
                                        : ''
                                    }
                                  >
                                    {' '}
                                    {viewInHours(
                                      watch(`agency_hours[${i}].assigned_hours_per_day`)
                                    )}{' '}
                                  </span>
                                ) : (
                                  '0'
                                )
                              }
                              statTitle={FM('hours-per-day')}
                            />
                          </Col>
                          <Col md='3'>
                            <StatsHorizontal
                              className={'white'}
                              icon={<ViewWeek size={30} />}
                              color='info'
                              stats={
                                watch(`agency_hours[${i}].assigned_hours_per_week`)
                                  ? viewInHours(watch(`agency_hours[${i}].assigned_hours_per_week`))
                                  : '0'
                              }
                              statTitle={FM('hours-per-week')}
                            />
                          </Col>
                          <Col md='3'>
                            <StatsHorizontal
                              className={'white'}
                              icon={<Calendar size={30} />}
                              color='success'
                              stats={
                                watch(`agency_hours[${i}].assigned_hours_per_month`)
                                  ? viewInHours(
                                      watch(`agency_hours[${i}].assigned_hours_per_month`)
                                    )
                                  : '0'
                              }
                              statTitle={FM('hours-per-month')}
                            />
                          </Col>
                          <Col md='3'>
                            <StatsHorizontal
                              className={'white'}
                              icon={<HourglassEmptyOutlined size={30} />}
                              color='primary'
                              stats={
                                watch(`agency_hours[${i}].assigned_hours`)
                                  ? viewInHours(watch(`agency_hours[${i}].assigned_hours`) * 60)
                                  : '0'
                              }
                              statTitle={FM('total-hours')}
                            />
                          </Col>
                        </Row>
                      ) : (
                        ''
                      )}
                    </Row>
                  </div>
                ))}
              </CardBody>
            </Card>
          </Show>
          <Row>
            {/* <Col md="12" className='mb-3' >
                            <FormGroupCustom
                                label={FM("Avatar")}
                                name={"avatar"}
                                type={"hidden"}
                                errors={errors}
                                control={control}
                                rules={{ required: false }}
                                values={imgAvatar} />
                            <DropZone value={edit?.avatar} name={edit?.avatar} onSuccess={e => setValue("avatar", [{ file_url: e[0]?.file_name, file_name: e[0]?.uploading_file_name }])} />

                        </Col> */}
            <Col md='12'>
              <FormGroupCustom
                noLabel
                name={'documents'}
                type={'hidden'}
                errors={errors}
                control={control}
                rules={{ required: false }}
                values={watch('documents')}
              />
              <DropZone
                multiple
                maxFiles={5}
                value={
                  isValidArray(edit?.admin_files)
                    ? edit?.admin_files?.map((d) => ({ name: d?.file_name, url: d?.file_path }))
                    : null
                }
                onSuccess={(e) => {
                  // log(e)
                  if (isValidArray(e)) {
                    setValue(
                      'documents',
                      e?.map((d, i) => {
                        return {
                          file_name: d?.uploading_file_name,
                          file_url: d?.file_name
                        }
                      })
                    )
                  } else {
                    setValue('documents', [])
                  }
                }}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}

export default UserStep6
