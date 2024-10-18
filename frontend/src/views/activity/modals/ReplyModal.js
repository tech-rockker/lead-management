import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { addActivityAction, approveActivity, assignActivity } from '../../../utility/apis/activity'
import { FM, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../router/RouteHelper'
import { loadUser } from '../../../utility/apis/userManagement'
import { monthDaysOptions, UserTypes } from '../../../utility/Const'
import { createAsyncSelectOptions } from '../../../utility/Utils'
import { addComments } from '../../../utility/apis/comment'
export default function ReplyModal({
  source = null,
  source_id = null,
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
    addComments({
      jsonData: {
        ...form,
        parent_id: edit?.id,
        source_id: edit?.source_id,
        source_name: 'Activity'
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        // showForm()
        // setAdded(data?.payload?.id)
        // SuccessToast("done")
        // history.push(getPath("activity"))
        handleModal()
      }
    })
  }

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
        title={'comment'}
      >
        <form>
          <CardBody>
            <Col md='12'>
              <FormGroupCustom
                label={'comment'}
                name={'comment'}
                type={'textarea'}
                errors={errors}
                className='mb-2'
                control={control}
                rules={{ required: true }}
              />
            </Col>
            {/* <Col md="12" xs="12" >
                            <FormGroupCustom
                                type={"select"}

                                async
                                defaultOptions
                                loadOptions={loadUserData}
                                control={control}

                                options={user}
                                errors={errors}
                                rules={{ required: true }}
                                name="replied_to"
                                className='mb-1'
                                label={FM("replies-to")}

                            />
                        </Col> */}

            {/* <Col md="12" xs="12" className="">
                            <FormGroupCustom
                                noGroup
                                type={"select"}
                                control={control}
                                errors={errors}
                                name={"assignment_day"}

                                options={monthDaysOptions(FM)}
                                label={FM("select-day")}
                                rules={{ required: true }}
                            />
                        </Col> */}
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
