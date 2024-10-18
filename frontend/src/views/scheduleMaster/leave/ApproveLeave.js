import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Input, Label, Row } from 'reactstrap'
import { approveActivity, assignActivity } from '../../../utility/apis/activity'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
// import FormGroupCustom from '../../../components/formGroupCustom'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../router/RouteHelper'
import { loadUser } from '../../../utility/apis/userManagement'
import {
  approveTo,
  empType,
  forDecryption,
  monthDaysOptions,
  UserTypes
} from '../../../utility/Const'
// import { createAsyncSelectOptions } from '../../../../utility/Utils'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  createSelectOptions,
  decryptObject,
  formatDate,
  JsonParseValidate,
  truncateText
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import Show from '../../../utility/Show'
import { approveLeave } from '../../../utility/apis/leave'
import Hide from '../../../utility/Hide'
import BsPopover from '../../components/popover'

export default function ApproveLeave({
  notification = null,
  edit = null,
  noView = false,
  showModal = false,
  setReload,
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) {
  const [open, setOpen] = useState(null)
  const [setALll, setAll] = useState(false)
  const [setALllMc, setAllMc] = useState(false)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState([])
  const dispatch = useDispatch()
  const form = useForm()

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    if (edit === null) setEditData(null)
  }

  const loadUserData = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, branch_id: edit?.branch_id, user_type_id: UserTypes.employee }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setUser, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (data) => {
    log(data)
    let _data = {}
    if (data?.notify_employees === false) {
      _data = {
        // leave_group_id: isValid(data?.leave_group_id) ? data?.leave_group_id : null,
        notify_employees: isValid(data?.notify_employees) ? data?.notify_employees : false,
        employee_type: isValidArray(data?.employee_type) ? data?.employee_type : null,
        leaves: data?.leaves
      }
    } else {
      _data = {
        // leave_group_id: isValid(data?.leave_group_id) ? data?.leave_group_id : null,
        notify_employees: true,
        leaves: null,
        employee_id: null,
        employee_type: isValidArray(data?.employee_type) ? data?.employee_type : null
      }
    }
    approveLeave({
      jsonData: {
        ..._data,
        user_id: edit?.user_id,
        leave_group_id: edit?.leave_group_id
        // leave_group_id: edit?.leave_group_id
        // notify_employees : !!isValid(data?.approve_to === 2)
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        handleModal()
        setReload(true)
      }
    })
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    if (edit !== null) {
      setEditData(edit)
      // setValues(formFields, values, setValue, modifyField)
      // setValues(edit)
    }
  }, [edit])

  useEffect(() => {
    if (open === false || open === null) {
      document.body.removeAttribute('no-scroll')
    }
  }, [open])

  const loadEmp = (branch_id) => {
    loadUser({
      jsonData: {
        branch_id,
        user_type_id: UserTypes.employee
      },
      loading: setLoading,
      // dispatch,
      success: (e) => {
        setUser(
          createSelectOptions(e?.payload, 'name', 'id', (x) => {
            return decryptObject(forDecryption, x)
          })
        )
      }
    })
  }

  useEffect(() => {
    loadEmp(edit?.user?.branch_id)
  }, [edit])

  log('notifyData', edit)

  return (
    <>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        loading={loading}
        open={open}
        // scrollControl={false}
        handleModal={handleClose}
        hideSave
        extraButtons={
          <>
            <LoadingButton loading={loading} color='primary' onClick={handleSubmit(handleSave)}>
              {FM('approve')}
            </LoadingButton>
          </>
        }
        // handleSave={handleSubmit(handleSave)}
        title={FM('approve-leave-&-assign-employee')}
      >
        <form>
          <CardBody>
            <Show IF={edit?.event}>
              <Row>
                <Col>
                  <p className='mb-0 text-dark fw-bolder h4'>{edit?.leave_object?.user?.name}</p>
                  {/* <Show IF={user?.user_type_id === UserTypes.employee}> */}
                  {/* {formatDate(edit?.created_at)} */}
                  {/* </Show> */}
                </Col>

                <Col>
                  <p className='mb-0 text-dark fw-bolder'>{FM('date')}</p>
                  <BsPopover title={FM('reason')} content={edit?.leave_object?.shift_date}>
                    <p className='mb-0 fw-bold text-truncate'>
                      <a className='text-secondary'> {edit?.leave_object?.shift_date} </a>
                    </p>
                  </BsPopover>
                </Col>
              </Row>
              {/* <Row className='mt-1 mb-2'>
                                <Col>
                                    <p className='mb-0 text-dark fw-bolder'>
                                        {FM("reason")}
                                    </p>
                                    <BsPopover title={FM("reason")} content={edit?.leave_reason}>
                                        <p className='mb-0 fw-bold text-truncate'>
                                            <a className='text-secondary'>  {truncateText(edit?.leave_reason, 50) ?? FM("vacation")} </a>
                                        </p>
                                    </BsPopover>

                                </Col>
                            </Row> */}
            </Show>
            <Col md='12'>
              <FormGroupCustom
                // values={weekCount}
                // key={`every-${dates}`}
                type={'select'}
                control={control}
                // placeholder={FM(`max-week-accept-${weekCount}`)}
                // message={FM("choose-wether")}
                name='notify_employees'
                isClearable
                errors={errors}
                label={FM('approve-by')}
                options={createConstSelectOptions(approveTo, FM)}
              />
            </Col>

            {watch('notify_employees') === true ? (
              <Col md='12' xs='12' className='mt-1'>
                <FormGroupCustom
                  type={'select'}
                  isClearable
                  isMulti
                  defaultOptions
                  // loadOptions={loadUserData}
                  control={control}
                  errors={errors}
                  // isOptionDisabled={(op, val) => {
                  //     return ((edit?.user_id) === op?.value)
                  // }}
                  // value={edit?.assign_employee?.map(a => a?.employee?.id)}
                  rules={{ required: false }}
                  name='employee_type'
                  className='mb-1'
                  label={FM('employee-type')}
                  options={createConstSelectOptions(empType, FM)}
                />
              </Col>
            ) : (
              ''
            )}

            {watch('notify_employees') === false ? (
              <Row className='mt-1'>
                {/* <FormGroupCustom
                                type="checkbox"
                               

                                control={control}
                                name="all_users"
                                onChangeValue={e => setAll(e)}
                                className='ms-2'
                                errors={errors}
                                rules={{ required: false }}
                                label={FM("assign-work-to-single-employee")}
                            /> */}

                {/* {(watch("all_users") ? <Row>
                                <Col md="12">

                                    <FormGroupCustom
                                        type={"select"}
                                        control={control}
                                        options={user?.filter(a => a.value !== edit?.user_id)}
                                        errors={errors}
                                        // value={watch(`leaves[${index}]['employee_id']`)}
                                        isOptionDisabled={(op, val) => {
                                            return ((edit?.user_id) === op?.value)
                                        }}
                                        // onChangeValue={(e) => {
                                        //     log(e)
                                        //     setValue(`leaves[${index}]['employee_id']`, e)
                                        // }}
                                        rules={{ required: false }}
                                        name={"employee_ids"}
                                        className='mb-1'
                                        label={FM("assign-employee")}
                                    />

                                </Col>
                            </Row> : "")} */}
                <Hide IF={!isValidArray(edit?.leaves)}>
                  <div className='row' key={`set-all-mc-${setALll}`}>
                    {isValidArray(edit?.leaves)
                      ? edit?.leaves?.map((item, index) => {
                          return (
                            <>
                              <Col md='6' className='mt-1'>
                                <p className='mb-0 text-dark fw-bolder '>{FM('date')}</p>

                                <Input
                                  type='text'
                                  value={formatDate(item?.shift_date)}
                                  // readOnly
                                  className='pe-none'
                                />

                                <FormGroupCustom
                                  noLabel
                                  noGroup
                                  type={'hidden'}
                                  control={control}
                                  options={user}
                                  errors={errors}
                                  rules={{ required: false }}
                                  name={`leaves[${index}]['schedule_id']`}
                                  value={item?.id}
                                  className='mb-1'
                                  label={FM('assign-employee')}
                                />
                              </Col>

                              <Col md='6' className='mt-1'>
                                <FormGroupCustom
                                  type={'select'}
                                  control={control}
                                  options={user?.filter((a) => a.value !== edit?.user_id)}
                                  errors={errors}
                                  value={
                                    setALll ? setALllMc : watch(`leaves[${index}]['employee_id']`)
                                  }
                                  isOptionDisabled={(op, val) => {
                                    return edit?.user_id === op?.value
                                  }}
                                  onChangeValue={(e) => {
                                    log(e)
                                    setAllMc(e)
                                    setValue(`leaves[${index}]['employee_id']`, e)
                                  }}
                                  rules={{ required: false }}
                                  name={`leaves[${index}]['employee_id']`}
                                  className='mb-1'
                                  label={FM('assign-employee')}
                                />
                              </Col>
                              <Show IF={index === 0}>
                                <FormGroupCustom
                                  type='checkbox'
                                  // noLabel
                                  control={control}
                                  value={setALll ? 1 : 0}
                                  // name="all_users"
                                  name={`leaves[${index[0]}]['all_users']`}
                                  onChangeValue={(e) => setAll(e)}
                                  className='ms-5'
                                  errors={errors}
                                  rules={{ required: false }}
                                  label={FM('assign-work-to-single-employee')}
                                />
                              </Show>
                            </>
                          )
                        })
                      : null}
                  </div>
                </Hide>
                <Show IF={edit?.leave_group_id && isValid(notification)}>
                  <div className='row' key={`set-all-mc-${setALll}`}>
                    <Col md='6' className='mt-1'>
                      <p className='mb-0 text-dark fw-bolder '>{FM('date')}</p>

                      <Input
                        type='text'
                        value={formatDate(edit?.leave_object?.shift_date)}
                        // readOnly
                        className='pe-none'
                      />

                      <FormGroupCustom
                        noLabel
                        noGroup
                        type={'hidden'}
                        control={control}
                        options={user}
                        errors={errors}
                        rules={{ required: false }}
                        // name={`leaves[${index}]['schedule_id']`}
                        value={edit?.id}
                        className='mb-1'
                        label={FM('assign-employee')}
                      />
                    </Col>

                    <Col md='6' className='mt-1'>
                      <FormGroupCustom
                        type={'select'}
                        control={control}
                        options={user?.filter((a) => a.value !== edit?.user_id)}
                        errors={errors}
                        // value={setALll ? setALllMc : watch(`leaves[${index}]['employee_id']`)}
                        isOptionDisabled={(op, val) => {
                          return edit?.user_id === op?.value
                        }}
                        onChangeValue={(e) => {
                          log(e)
                          setAllMc(e)
                          setValue(`leaves['employee_id']`, e)
                        }}
                        rules={{ required: false }}
                        name={`leaves['employee_id']`}
                        className='mb-1'
                        label={FM('assign-employee')}
                      />
                    </Col>
                    {/* <Show IF={index === 0} >
                                        <FormGroupCustom
                                            type="checkbox"
                                            // noLabel
                                            control={control}
                                            // name="all_users"
                                            name={`leaves[${index[0]}]['all_users']`}
                                            onChangeValue={e => setAll(e)}
                                            className='ms-5'
                                            errors={errors}
                                            rules={{ required: false }}
                                            label={FM("assign-work-to-single-employee")}
                                        />
                                    </Show> */}
                  </div>
                </Show>
              </Row>
            ) : (
              ''
            )}
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
