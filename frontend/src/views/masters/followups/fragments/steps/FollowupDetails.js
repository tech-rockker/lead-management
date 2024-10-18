// ** React Imports
import { Fragment, useEffect, useReducer, useState } from 'react'
// ** Reactstrap Imports
import { Button, ButtonGroup, Col, Form, Input, InputGroupText, Row, Spinner } from 'reactstrap'
import { loadPatientPlanList } from '../../../../../utility/apis/ip'
import { loadUser } from '../../../../../utility/apis/userManagement'
import {
  monthDaysOptions,
  Patterns,
  repetitionType,
  UserTypes,
  weekDays
} from '../../../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'
import Show from '../../../../../utility/Show'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  createSelectOptions,
  enableFutureDates,
  removeByIndex,
  SpaceTrim,
  toggleArray
} from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import Shimmer from '../../../../components/shimmers/Shimmer'
import Repeater from '@components/repeater'
import { SlideDown } from 'react-slidedown'
import { X, Plus } from 'react-feather'
import BsTooltip from '../../../../components/tooltip'
import Hide from '../../../../../utility/Hide'
// ** Styles
import 'react-slidedown/lib/slidedown.css'
import RepeaterForm from '../../../../components/RepeaterForm'
import DateTime from './DateTime'
import BadWordsFilter from '../../../../components/badWords'
import AcComponent from '../../../../components/AcComponent'
import DropZone from '../../../../components/buttons/fileUploader'

const FollowupDetails = ({
  ips = null,
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
  const [ip, setIp] = useState([])
  const [branch, setBranch] = useState([])
  const [action, setAction] = useState(false)
  const [index, setIndex] = useState(-1)

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'repeat_datetime' // unique name for your Field Array
  })

  // Reducer State
  const disabledInit = {
    ip: false
  }

  /** @returns {disabledInit} */
  const stateReducer = (o, n) => ({ ...o, ...n })
  const [disabled, setDisabled] = useReducer(stateReducer, disabledInit)

  // Ip Options
  const loadIpAsync = async (search, loadedOptions, { page }) => {
    const res = await loadPatientPlanList({
      async: true,
      page,
      perPage: 1000,
      jsonData: { title: search }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setIp)
  }

  const deleteForm = (e) => {
    e.preventDefault()
    const slideDownWrapper = e.target.closest('.react-slidedown'),
      form = e.target.closest('form')
    if (slideDownWrapper) {
      slideDownWrapper.remove()
    } else {
      form.remove()
    }
  }
  const findErrors = (name, index) => {
    let x = false
    if (errors && errors?.repeat_datetime && errors?.repeat_datetime[index]) {
      const a = errors?.repeat_datetime[index]
      x = a?.hasOwnProperty(name)
    }
    return x
  }
  const getValidData = () => {
    const r = watch('repeat_datetime') ?? []
    r?.filter((d) => {})
    return r
  }
  useEffect(() => {
    log('repeat_datetime', watch('repeat_datetime'))
  }, [watch('repeat_datetime')])

  useEffect(() => {
    if (edit?.id) {
      remove(0)
      append({ ...edit?.repeat_datetime[0] })
      setDisabled({
        ip: true
      })
      setIp([
        {
          label: edit?.patient_implementation_plan?.title,
          value: edit?.patient_implementation_plan?.id
        }
      ])
    } else if (edit === null) {
      if (fields?.length === 0) {
        append({
          start_date: '',
          start_time: '',
          end_date: '',
          end_time: ''
        })
      }
    }
  }, [edit])

  useEffect(() => {
    if (isValid(ipRes)) {
      setValue('ip_id', ipRes[0]?.id)
      setIp([
        {
          label: ipRes[0]?.title,
          value: ipRes[0]?.id
        }
      ])
      setDisabled({
        ip: true
      })
    }
  }, [ipRes])

  return (
    <Fragment>
      {loadingDetails ? (
        <>
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
        </>
      ) : (
        <Form onSubmit={onSubmit}>
          <Row>
            <Col md='6' xs='12'>
              <FormGroupCustom
                value={edit?.title}
                placeholder={FM('title')}
                type='text'
                name='title'
                label={FM('title')}
                className='mb-1'
                errors={errors}
                control={control}
                rules={{
                  required: requiredEnabled,
                  validate: (v) => {
                    return isValid(v) ? !SpaceTrim(v) : true
                  }
                }}
              />
            </Col>
            <Col md='6' xs='12'>
              <FormGroupCustom
                type={'select'}
                control={control}
                errors={errors}
                name={'ip_id'}
                defaultOptions
                cacheOptions
                isClearable
                async={!isValid(edit) && !isValidArray(ipRes)}
                loadOptions={loadIpAsync}
                value={isValidArray(ipRes) ? ipRes[0]?.id : edit?.ip_id}
                options={ip}
                isDisabled={disabled?.ip}
                feedback={FM('please-select-ip-plan')}
                label={FM('select-ip')}
                rules={{ required: requiredEnabled }}
                className='mb-1'
              />
            </Col>

            <Col md='6' xs='12'>
              <FormGroupCustom
                key={`description-${edit?.description}`}
                value={edit?.description}
                placeholder={FM('description')}
                type='autocomplete'
                name='description'
                setValue={setValue}
                label={FM('description')}
                className='mb-1'
                errors={errors}
                control={control}
                rules={{
                  required: true,
                  validate: (v) => {
                    return isValid(v) ? !SpaceTrim(v) : true
                  }
                }}
              />
              {/* <BadWordsFilter text={watch("description")} /> */}
            </Col>
            <Col md='6' xs='12'>
              <FormGroupCustom
                value={edit?.remarks}
                placeholder={FM('comment')}
                type='autocomplete'
                name='remarks'
                label={FM('comment')}
                className='mb-1'
                errors={errors}
                control={control}
                rules={{
                  required: false,
                  validate: (v) => {
                    return isValid(v) ? !SpaceTrim(v) : true
                  }
                }}
              />
              {/* <BadWordsFilter text={watch("remarks")} /> */}
            </Col>
            {/* <Show IF={isValid(edit)}>
                            <Col md="6" xs="12">
                                <FormGroupCustom
                                    style={{ height: "116px" }}
                                    value={edit?.reason_for_editing}
                                    placeholder={FM("reason-for-editing")}
                                    type="autocomplete"
                                    name="reason_for_editing"
                                    label={FM("reason-for-editing")}
                                    className='mb-1'
                                    errors={errors}
                                    control={control}
                                    rules={{ required: requiredEnabled }}
                                />
                              
                            </Col>
                        </Show> */}
          </Row>
          {fields.map((field, i) => (
            <>
              <SlideDown key={field?.id} className='mb-1'>
                <Row className='mt-1'>
                  <Col md='12' className='pt-0 mb-1 pb-1 border-bottom'>
                    <Row>
                      <Col md='8' className='fw-bold'>
                        {FM('followup-date-time')} {i + 1}
                      </Col>
                    </Row>
                  </Col>
                  <Col md='12' xs='12'>
                    <Row>
                      <Col md='3' xs='12'>
                        <FormGroupCustom
                          key={`start-date-${edit?.repeat_datetime[i]?.start_date}`}
                          value={
                            edit?.repeat_datetime[i]?.start_date ??
                            getValues(`repeat_datetime.${i}.start_date`)
                          }
                          placeholder={FM('start-date')}
                          type='date'
                          options={{
                            enable: [
                              function (date) {
                                return enableFutureDates(date)
                              },
                              edit?.start_date,
                              new Date()
                            ]
                          }}
                          name={`repeat_datetime.${i}.start_date`}
                          label={FM('start-date')}
                          // className='mb-1'
                          error={findErrors('start_date', i)}
                          control={control}
                          rules={{
                            required: requiredEnabled
                          }}
                        />
                      </Col>

                      <Col md='3' xs='12'>
                        <FormGroupCustom
                          key={`start-time-${edit?.repeat_datetime[i]?.start_time}`}
                          value={
                            isValid(edit?.repeat_datetime[i]?.end_date)
                              ? edit?.repeat_datetime[i]?.end_date
                              : getValues(`repeat_datetime.${i}.end_date`)
                          }
                          placeholder={FM('end-date')}
                          type='date'
                          name={`repeat_datetime.${i}.end_date`}
                          options={{
                            enable: [
                              function (date) {
                                return enableFutureDates(date)
                              },
                              edit?.start_date,
                              new Date()
                            ],
                            minDate: watch(`repeat_datetime.${i}.start_date`)
                              ? watch(`repeat_datetime.${i}.start_date`)
                              : undefined
                          }}
                          label={FM('end-date')}
                          // className='mb-1'
                          errors={errors}
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>

                      <Col md='3' xs='12'>
                        <FormGroupCustom
                          value={
                            edit?.repeat_datetime[i]?.start_time ??
                            getValues(`repeat_datetime.${i}.start_time`)
                          }
                          placeholder={FM('start-time')}
                          type='date'
                          defaultDate={watch('start_date')}
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            time_24hr: true
                          }}
                          dateFormat={'HH:mm'}
                          name={`repeat_datetime.${i}.start_time`}
                          label={FM('start-time')}
                          // className='mb-1'
                          error={findErrors('start_time', i)}
                          control={control}
                          rules={{ required: requiredEnabled }}
                        />
                      </Col>

                      <Col md='3' xs='12'>
                        <FormGroupCustom
                          value={
                            edit?.repeat_datetime[i]?.end_time ??
                            getValues(`repeat_datetime.${i}.end_time`)
                          }
                          placeholder={FM('end-time')}
                          type='date'
                          defaultDate={watch('end_date')}
                          options={{
                            enableTime: true,
                            noCalendar: true,
                            minDate: watch(`repeat_datetime.${i}.start_time`),
                            time_24hr: true
                          }}
                          dateFormat={'HH:mm'}
                          name={`repeat_datetime.${i}.end_time`}
                          label={FM('end-time')}
                          // className='mb-1'
                          errors={errors}
                          control={control}
                          rules={{ required: false }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md='12' className='d-flex justify-content-end mt-1'>
                    <Show IF={!edit}>
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
                              start_date: '',
                              start_time: '',
                              end_date: '',
                              end_time: ''
                            })
                          }}
                        />
                      </Show>
                      <Hide IF={i === 0}>
                        <BsTooltip
                          Tag={X}
                          title={FM('remove')}
                          size={18}
                          color='red'
                          role='button'
                          className=''
                          onClick={(e) => {
                            remove(i)
                            // removeByIndex(x, getValues("repeat_datetime"), e => setValue("repeat_datetime", e))
                          }}
                        />
                      </Hide>
                    </Show>
                  </Col>
                </Row>
              </SlideDown>
            </>
          ))}

          <Row>
            <Col md='12'>
              <FormGroupCustom
                label={FM('add-attachment')}
                name={'documents'}
                type={'hidden'}
                errors={errors}
                control={control}
                rules={{ required: false }}
                values={edit}
              />
              {/* <DropZone value={isValidArray(edit?.documents) ? edit?.documents[0]?.file_url : null} name={edit?.documents[0]?.file_name} onSuccess={e => setValue("documents", [{ file_url: e[0]?.file_name, file_name: e[0]?.uploading_file_name }])} /> */}
              <DropZone
                key={`file-${edit?.documents?.length}`}
                value={isValidArray(edit?.documents) ? edit?.documents[0]?.file_url : null}
                name={isValidArray(edit?.documents) ? edit?.documents[0]?.file_name : ''}
                // onSuccess={e => setValue("documents", [{ file_url: e?.file_name, file_name: e?.uploading_file_name }])}
                onSuccess={(e) => {
                  if (isValidArray(e)) {
                    setValue('documents', [
                      { file_url: e[0]?.file_name, file_name: e[0]?.uploading_file_name }
                    ])
                  } else {
                    setValue('documents', [])
                  }
                }}
              />
              {/* <DropZone multiple maxFiles={1} value={isValidArray(edit?.documents) ? edit?.documents?.map(d => ({ name: d?.file_name, url: d?.file_url })) : null} onSuccess={e => {
                                // log(e)
                                setValue("documents", e?.map((d, i) => {
                                    return {
                                        file_name: d?.uploading_file_name,
                                        file_url: d?.file_name
                                    }
                                }))
                            }
                            } /> */}
            </Col>
          </Row>
          <Input type='submit' value={'test'} className='d-none' />
        </Form>
      )}
    </Fragment>
  )
}

export default FollowupDetails
