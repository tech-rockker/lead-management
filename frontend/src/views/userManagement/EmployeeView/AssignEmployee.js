import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { HourglassEmptyOutlined, ViewWeek } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { Calendar, Info } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Row } from 'reactstrap'
import { addAssignWorking, assignWorking } from '../../../utility/apis/userManagement'
import { Patterns } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import { setValues, viewInHours } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import BsTooltip from '../../components/tooltip'

export default function AssignHoursEmployee({
  onSuccess = () => {},
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

  const handleClose = (from = null) => {
    handleModal()
  }
  const handleSave = (data) => {
    if (edit?.assigned_work === null) {
      addAssignWorking({
        // id: edit?.assigned_work?.id,
        jsonData: {
          // id: edit?.assigned_work?.id,
          emp_id: edit?.id,
          ...data
        },
        loading: setLoading,
        dispatch,
        success: (e) => {
          handleModal()
          onSuccess()
        }
      })
    } else {
      assignWorking({
        id: edit?.assigned_work?.id,
        jsonData: {
          id: edit?.assigned_work?.id,
          emp_id: edit?.id,
          ...data
        },
        loading: setLoading,
        dispatch,
        success: (e) => {
          handleModal()
          onSuccess()
        }
      })
    }
  }
  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    if (edit !== null) {
      setEditData({
        ...edit
      })

      if (isValid(edit?.assigned_work)) {
        setValues(
          {
            assigned_working_hour_per_week: '',
            working_percent: ''
          },
          edit?.assigned_work,
          setValue
        )
        // setValues(edit)
      }
    }
  }, [edit])
  const calculation = Math.floor(
    watch('assigned_working_hour_per_week') * (watch('working_percent') / 100) * 60
  )
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
        scrollControl={false}
        modalClass='modal-sm'
        handleModal={handleClose}
        hideSave
        extraButtons={
          <>
            <LoadingButton loading={loading} color='primary' onClick={handleSubmit(handleSave)}>
              {FM('save')}
            </LoadingButton>
          </>
        }
        // handleSave={handleSubmit(handleSave)}
        title={FM('alloted-time')}
      >
        <form>
          <CardBody>
            <Row>
              <Col md='6'>
                <FormGroupCustom
                  label={FM('hour-per-week')}
                  type={'number'}
                  value={edit?.assigned_work?.assigned_working_hour_per_week}
                  control={control}
                  rules={{ required: true, pattern: Patterns.NumberOnly, min: 0, max: 40 }}
                  errors={errors}
                  name={'assigned_working_hour_per_week'}
                  className='mb-2'
                />
              </Col>

              <Col md='6'>
                <FormGroupCustom
                  label={FM('work-percentage')}
                  type={'number'}
                  value={edit?.assigned_work?.working_percent}
                  control={control}
                  // rules={{ required: isValid(watch("contract_type")), pattern: Patterns.NumberOnly, min: 0 }}
                  errors={errors}
                  name={'working_percent'}
                  className='mb-2'
                  rules={{ required: false, min: 0, max: 100, pattern: Patterns.NumberOnly }}
                />
              </Col>
              <Col md='12' className=''>
                <Row className=''>
                  <Col md='12'>
                    <StatsHorizontal
                      className={'white mb-5px'}
                      icon={<ViewWeek size={30} />}
                      color='info'
                      stats={calculation ? viewInHours(calculation) : 0}
                      statTitle={
                        <>
                          {FM('hours-per-week')}
                          <BsTooltip
                            className='ms-25'
                            title={
                              <>
                                {`((${watch('assigned_working_hour_per_week')} x (${watch(
                                  'working_percent'
                                )} / 100)) x 60) = ${calculation} minutes`}
                              </>
                            }
                          >
                            <Info className='text-primary' size={14} />
                          </BsTooltip>
                        </>
                      }
                    />
                  </Col>
                  <Col md='12'>
                    <StatsHorizontal
                      className={'white mb-5px'}
                      icon={<HourglassEmptyOutlined size={30} />}
                      color='primary'
                      key={
                        (watch('assigned_working_hour_per_week') *
                          (watch('working_percent') / 100)) /
                        5
                          ? viewInHours(
                              ((watch('assigned_working_hour_per_week') *
                                (watch('working_percent') / 100)) /
                                5) *
                                60
                            )
                          : '0'
                      }
                      stats={calculation ? viewInHours(Math.floor(calculation / 5)) : 0}
                      statTitle={
                        <>
                          {FM('hours-per-day')}
                          <BsTooltip
                            className='ms-25'
                            title={<>{`${calculation} / 5 = ${calculation / 5} minutes`}</>}
                          >
                            <Info className='text-primary' size={14} />
                          </BsTooltip>
                        </>
                      }
                    />
                  </Col>
                  <Col md='12'>
                    <StatsHorizontal
                      className={'white mb-5px'}
                      icon={<Calendar size={30} />}
                      color='success'
                      stats={calculation ? viewInHours((calculation / 5) * 20) : 0}
                      statTitle={
                        <>
                          {FM('hours-per-month')}
                          <BsTooltip
                            className='ms-25'
                            title={
                              <>
                                {`${calculation / 5} x 20 = ${
                                  Math.floor(calculation / 5) * 20
                                } minutes`}
                              </>
                            }
                          >
                            <Info className='text-primary' size={14} />
                          </BsTooltip>
                        </>
                      }
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
