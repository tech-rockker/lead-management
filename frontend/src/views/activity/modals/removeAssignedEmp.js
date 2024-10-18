import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Badge, Card, CardBody, Col, Row } from 'reactstrap'
import {
  approveActivity,
  assignActivity,
  assignActivityRemove
} from '../../../utility/apis/activity'
import { FM, isValid, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../router/RouteHelper'
import { loadUser } from '../../../utility/apis/userManagement'
import { forDecryption, monthDaysOptions, UserTypes } from '../../../utility/Const'
import { createAsyncSelectOptions, decryptObject } from '../../../utility/Utils'

export default function RemoveAssignedEmp({
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

  const loadUserData = async (search, _loadedOptions, { page }) => {
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

  const handleClose = (_from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    assignActivityRemove({
      jsonData: {
        ...form,
        activity_id: isValid(edit?.id) ? edit?.id : null
      },
      loading: setLoading,
      // dispatch,
      success: (_data) => {
        handleModal()
        setReload(true)
      }
    })
  }
  const assE = edit?.assign_employee?.map((a) => a.id)?.name ?? []

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
        title={FM('remove-employee')}
      >
        <form>
          <CardBody>
            <Col md='12'>
              {edit?.assign_employee?.map((a) => (
                <Badge className='me-1 mb-1' color='primary'>
                  {' '}
                  {a?.employee?.name}{' '}
                </Badge>
              ))}
            </Col>
            <Col md='12' xs='12'>
              <FormGroupCustom
                type={'select'}
                async
                defaultOptions
                loadOptions={loadUserData}
                control={control}
                options={user}
                errors={errors}
                value={edit?.assign_employee?.map((a) => a?.employee?.id)}
                rules={{ required: true }}
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
