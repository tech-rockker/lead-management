import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Badge, CardBody, Col } from 'reactstrap'
import {
  assignedEmpToBranchs,
  assignEmpToBranch,
  loadUser,
  viewUser
} from '../../../../utility/apis/userManagement'
import { UserTypes } from '../../../../utility/Const'
import { FM, isValid, isValidArray } from '../../../../utility/helpers/common'
import { createAsyncSelectOptions } from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'
import CenteredModal from '../../../components/modal/CenteredModal'

export default function AssignUserBranchModal({
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
  const [editData, setEditData] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState([])
  const dispatch = useDispatch()
  const [empBranch, setEmpBranch] = useState([])
  const [emploading, setEmpLoading] = useState(false)
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

  const loadDetails = () => {
    if (isValid(edit?.id)) {
      viewUser({
        id: edit?.id,
        loading: setEmpLoading,
        success: (d) => {
          const branchArr = d?.employee_branches?.map((d) => d?.branch_id)
          setEditData(branchArr)
        }
      })
    }
  }

  useEffect(() => {
    loadDetails()
  }, [edit])
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
      jsonData: { name: search, user_type_id: UserTypes.branch }
    })
    return createAsyncSelectOptions(res, page, 'branch_name', 'id', setUser)
  }

  const handleClose = (_from = null) => {
    handleModal()
  }

  const handleSave = (form) => {
    assignEmpToBranch({
      jsonData: {
        ...form,
        employee_id: edit?.id
      },
      loading: setLoading,
      dispatch,
      success: (_data) => {
        // SuccessToast("Assigned Successfully!")
        handleModal()
        onSuccess()
        // setReload(true)
      }
    })
  }

  const AssignedBranch = () => {
    if (edit?.id) {
      assignedEmpToBranchs({
        jsonData: {
          employee_id: edit?.id
        },
        loading: setLoading,
        dispatch,
        success: (e) => {
          setEmpBranch(e?.payload)
          setValue(
            'branch_ids',
            e?.payload?.map((a) => a?.branch?.id)
          )
        }
      })
    }
  }

  useEffect(() => {
    if (open) {
      AssignedBranch()
    }
  }, [open, edit])

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

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
        title={FM('assign-branch')}
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
                key={`change-${edit?.branch_id}`}
                label={FM('branch')}
                type={'select'}
                async
                isMulti
                value={isValidArray(editData) ? editData : null}
                defaultOptions
                control={control}
                options={user}
                loadOptions={loadUserData}
                name='branch_ids'
                rules={{ required: true }}
              />
            </Col>
          </CardBody>
        </form>
      </CenteredModal>
    </>
  )
}
