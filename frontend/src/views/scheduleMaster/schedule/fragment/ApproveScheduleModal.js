import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { approveActivity, assignActivity } from '../../../../utility/apis/activity'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import FormGroupCustom from '../../../components/formGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../../router/RouteHelper'
import { loadUser } from '../../../../utility/apis/userManagement'
import { monthDaysOptions, UserTypes } from '../../../../utility/Const'
import { createAsyncSelectOptions } from '../../../../utility/Utils'

export default function ApproveScheduleModal({
  edit = null,
  noView = false,
  showModal = false,
  setReload,
  setShowModal = () => {},
  Component = 'span',
  children = null,
  ...rest
}) {
  const [open, setOpen] = useState(false)
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
    return createAsyncSelectOptions(res, page, 'name', 'id', setUser)
  }

  const handleClose = (from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    assignActivity({
      jsonData: {
        ...form,
        activity_id: isValid(edit?.id) ? edit?.id : null
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        handleModal()
        setReload(true)
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
        scrollControl={false}
        handleModal={handleClose}
        handleSave={handleSubmit(handleSave)}
        title={FM('approve-leave')}
      >
        <form>
          <CardBody>
            <Col md='12' xs='12'>
              <FormGroupCustom
                type={'select'}
                async
                isClearable
                // isMulti
                defaultOptions
                loadOptions={loadUserData}
                control={control}
                options={user}
                errors={errors}
                // value={edit?.assign_employee?.map(a => a?.employee?.id)}
                rules={{ required: true }}
                isOptionDisabled={(op, val) => {
                  return edit?.user_id === op?.value
                }}
                name='user_id'
                className='mb-1'
                label={FM('user')}
              />
            </Col>
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
