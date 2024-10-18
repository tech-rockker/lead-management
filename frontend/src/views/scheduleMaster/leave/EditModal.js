import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CardBody, Col } from 'reactstrap'
import { editLeave } from '../../../utility/apis/leave'
import { FM, isValid } from '../../../utility/helpers/common'
import { formatDate } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

export default function EditModal({
  scrollControl = true,
  edit = null,
  noView = false,
  setReload,
  showModal = false,
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) {
  const [open, setOpen] = useState(null)
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState([])
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

  const handleSave = (data) => {
    if (isValid(edit?.id)) {
      editLeave({
        id: edit?.id,
        jsonData: {
          ...data
        },
        loading: setLoading,
        dispatch,
        success: (d) => {
          handleModal()
          // onSuccess()
          // loadJournal()
          console.log(d)
        }
      })
    }
  }

  const handleClose = (from = null) => {
    handleModal()
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

  return (
    <>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
      <CenteredModal
        loading={loading}
        modalClass={'modal-sm'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('leave')}
      >
        <CardBody>
          <Col md='12'>
            <p className='mb-0 text-dark fw-bolder'>{FM('date')}</p>
            <p className='mb-0 fw-bold text-truncate'>
              <a className='text-dark fw-bolder'>
                <Calendar size={14} /> {formatDate(edit?.date, 'DD MMMM, YYYY') ?? 'N/A'}
              </a>
            </p>
          </Col>

          <Col md='12' className='mt-1'>
            <FormGroupCustom
              label={FM('reason')}
              name={'reason'}
              type={'autocomplete'}
              errors={errors}
              className='mb-2'
              control={control}
              rules={{ required: true }}
            />
          </Col>
        </CardBody>
      </CenteredModal>
    </>
  )
}

// export default EditModal
