import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Row } from 'reactstrap'
import { actionTask } from '../../../../utility/apis/task'
import { FM, isValid } from '../../../../utility/helpers/common'
import FormGroupCustom from '../../../components/formGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'

export default function TaskActionModal({
  activity = null,
  activityForEmp = null,
  onSuccess = () => {},
  handleToggle = () => {},
  edit = null,
  ipRes = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  activityId = null,
  sourceId = null,
  Component = 'span',
  children = null,
  ...rest
}) {
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const form = useForm({
    option: null
  })
  const [response, setResponse] = useState(null)
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form

  // const loadDevOption = async (search, loadedOptions, { page }) => {
  //     const res = await loadDevitation({
  //         async: true,
  //         page,
  //         perPage: 100,
  //         jsonData: { name: search }
  //     })
  //     return createAsyncSelectOptions(res, page, "name", "id", setDev)
  // }

  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
  }
  const handleClose = (from = null) => {
    handleModal()
    reset()
    if (edit === null) setEditData(null)
  }

  const handleSave = (form) => {
    actionTask({
      jsonData: {
        ...form,
        task_id: edit,
        status: 1
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        handleModal()
      }
    })
  }

  useEffect(() => {
    if (isValid(edit)) {
      setValue('comment', edit?.comment)
    }
  }, [edit])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  useEffect(() => {
    handleToggle(open)
  }, [open])

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
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('action')}
      >
        <CardBody>
          <Row>
            <Col md='12'>
              <FormGroupCustom
                label={'comment'}
                name={'comment'}
                type={'autocomplete'}
                errors={errors}
                className='mb-1'
                setValue={setValue}
                value={edit?.comment}
                control={control}
              />
            </Col>
          </Row>
        </CardBody>
      </CenteredModal>
    </>
  )
}
