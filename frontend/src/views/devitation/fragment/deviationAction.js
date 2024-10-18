import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col, Row } from 'reactstrap'
import { addDevitationAction, loadDevitation } from '../../../utility/apis/devitation'
import { FM, isValid } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import {
  createAsyncSelectOptions,
  createConstSelectOptions,
  SuccessToast
} from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

export default function DeviationActionModal({
  responseData = () => {},
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
  const [dev, setDev] = useState([])
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

  const loadDevOption = async (search, loadedOptions, { page }) => {
    const res = await loadDevitation({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setDev)
  }

  const handleModal = () => {
    reset()
    setOpen(!open)
    setShowModal(!open)
    if (edit === null) setEditData(null)
  }
  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    addDevitationAction({
      jsonData: {
        ...form,
        id: edit?.id,
        is_signed: form?.is_signed === 1 ? 1 : 0,
        is_completed: form?.is_completed === 1 ? 1 : 0,
        deviation_ids: [edit?.id]
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
      setValue('is_completed', edit?.is_completed)
      setValue('is_signed', edit?.is_signed)
    }
  }, [edit])

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
            <FormGroupCustom
              label={'is-signed'}
              name={'is_signed'}
              type={'checkbox'}
              errors={errors}
              className={edit?.is_signed === 1 ? 'd-none' : ''}
              setValue={setValue}
              value={edit?.is_signed === 1 ? 1 : 0}
              control={control}
            />
            {edit?.is_signed === 1 ? (
              <FormGroupCustom
                label={'is-completed'}
                name={'is_completed'}
                type={'checkbox'}
                className={edit?.is_completed === 1 ? 'd-none' : ''}
                errors={errors}
                setValue={setValue}
                value={edit?.is_completed === 1 ? 1 : 0}
                control={control}
              />
            ) : null}

            {/* </Hide> */}
          </Row>
        </CardBody>
      </CenteredModal>
    </>
  )
}
