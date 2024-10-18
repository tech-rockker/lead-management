import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Form, FormFeedback, Label, Row } from 'reactstrap'
import { addActivityAction, approveActivity, assignActivity } from '../../../utility/apis/activity'
import { FM, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../router/RouteHelper'
import { loadUser } from '../../../utility/apis/userManagement'
import { markAsComplete, monthDaysOptions, UserTypes } from '../../../utility/Const'
import { addDay, createAsyncSelectOptions, createConstSelectOptions } from '../../../utility/Utils'
import BsTooltip from '../../components/tooltip'

export default function RepeatModal({
  edit = null,
  noView = false,
  showModal = false,
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

  const handleSave = (form) => {
    // addComments({
    //     jsonData: {
    //         ...form,
    //         parent_id: "",
    //         source_id: edit,
    //         source_name: "Activity"
    //     },
    //     loading: setLoading,
    //     dispatch,
    //     success: (data) => {
    //         // showForm()
    //         // setAdded(data?.payload?.id)
    //         // SuccessToast("done")
    //         // history.push(getPath("activity"))
    //         // handleModal()
    //         reset()
    //         loadCommentData()
    //     }
    // })
  }

  const ekSaalHoGaya = () => {
    if (edit?.is_repeat === 1 && edit?.end_date === null) {
      const endDate = new Date(addDay(new Date(edit?.start_date), 365))
      const currentDate = new Date()
      log('start_date', edit?.start_date)
      log('end_date', endDate)
      log('currentDate', currentDate)
      if (endDate >= currentDate) {
        log('bada hai')
        return true
      }
    }
    return false
  }

  useEffect(() => {
    if (edit !== null) {
      ekSaalHoGaya()
    }
  }, [edit])

  return (
    <>
      {!noView ? (
        <BsTooltip className='position-relative ms-1 mb-1' title={FM('repeat')}>
          <Component role='button' onClick={handleModal} {...rest}>
            {children}
          </Component>{' '}
        </BsTooltip>
      ) : null}
      <CenteredModal
        loading={loading}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('repeat-activity')}
      >
        <Form>
          <CardBody>
            <Label> {FM('do-you-want-to-repeat-this-activity')} </Label>
            <Row>
              <Col md='4'>
                <FormGroupCustom
                  label={'yes'}
                  name={'option'}
                  type={'radio'}
                  errors={errors}
                  value={'1'}
                  className='mt-1'
                  control={control}
                />
              </Col>
              {/* 
                            <Col md="4">
                                <FormGroupCustom
                                    label={"no"}
                                    name={"option"}
                                    type={"radio"}
                                    errors={errors}
                                    value={"0"}
                                    className="mt-1"
                                    control={control}
                                />
                            </Col> */}
            </Row>
          </CardBody>
        </Form>
      </CenteredModal>
    </>
  )
}
