import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from 'reactstrap'
import {
  approveActivity,
  assignActivity,
  assignActivityRemove
} from '../../../utility/apis/activity'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'
import { useDispatch } from 'react-redux'
import { getPath } from '../../../router/RouteHelper'
import { loadUser } from '../../../utility/apis/userManagement'
import { forDecryption, monthDaysOptions, UserTypes } from '../../../utility/Const'
import { createAsyncSelectOptions, decrypt, decryptObject } from '../../../utility/Utils'
import { Bell, X } from 'react-feather'
import Show from '../../../utility/Show'

export default function AssignUserModal({
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
  const [rloading, setRLoading] = useState(false)
  const [user, setUser] = useState([])
  const dispatch = useDispatch()
  const form = useForm()
  const [assEmpId, setAssEmpId] = useState(null)
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form

  const [basicModal, setBasicModal] = useState(false)

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
    assignActivity({
      jsonData: {
        ...form,
        activity_id: isValid(edit?.id) ? edit?.id : null
      },
      loading: setLoading,
      dispatch,
      success: (_data) => {
        handleModal()
        setReload(true)
      }
    })
  }

  const handleSaveRemove = () => {
    assignActivityRemove({
      jsonData: {
        user_id: assEmpId?.employee?.id,
        activity_id: isValid(edit?.id) ? edit?.id : null
      },
      loading: setRLoading,
      // dispatch,
      success: (_data) => {
        handleModal()
        setReload(true)
      }
    })
  }

  useEffect(() => {
    if (isValid(assEmpId)) {
      handleSaveRemove()
    }
  }, [assEmpId])
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
        title={FM('assign-employee')}
      >
        <form>
          <CardBody>
            <Show IF={isValidArray(edit?.assign_employee)}>
              <Col md='12' className='mb-1'>
                {FM('click-to-remove')}
              </Col>
            </Show>
            <Col md='12'>
              {edit?.assign_employee?.map((a) => (
                <Button
                  color='danger'
                  className='text-nowrap justify-content-between px-1 me-1 mb-1'
                  onClick={() => setAssEmpId(a)}
                  outline
                >
                  {' '}
                  <span>{decrypt(a?.employee?.name)}</span> <X size={14} className='me-50' />{' '}
                </Button>
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
                label={FM('assign-employee')}
              />
            </Col>
          </CardBody>
        </form>
      </CenteredModal>

      <div className='basic-modal'>
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalBody>
            <h5>Are You Sure You want to delete it.</h5>
          </ModalBody>
          <ModalFooter>
            <Button color='primary'>Yes</Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  )
}
