import React, { useEffect, useState } from 'react'
import { Loader, RotateCcw } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Form, Input, Label, Row } from 'reactstrap'
import { loadPermissions } from '../../../utility/apis/permissions'
import { addRole, editRole } from '../../../utility/apis/roles'
import { Patterns, roleTypes, UserTypes } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useTopMostParent from '../../../utility/hooks/useTopMostParent'
import useUser from '../../../utility/hooks/useUser'
import { createConstSelectOptions, ErrorToast, SuccessToast } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'

const AddEditRole = ({ editData = null, saved = () => {} }) => {
  const topMostParent = useTopMostParent()
  const dispatch = useDispatch()
  const [selected, setSelected] = useState(null)
  const [allPermissions, setAllPermissions] = useState(null)
  const [checkedAll, setCheckedAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState(null)
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const {
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    reset
  } = useForm()
  const [locationKeys, setLocationKeys] = useState([])
  const [type, setType] = useState(null)
  const [belongsTo, setBelongsTo] = useState('company')
  const history = useHistory()
  const user = useUser()
  useEffect(() => {
    setBelongsTo(topMostParent?.user_type_id === UserTypes.admin ? 'admin' : 'company')
  }, [topMostParent])

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === 'PUSH') {
        setLocationKeys([location.key])
      }

      if (history.action === 'POP') {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys)
          // Handle forward event
        } else {
          setLocationKeys((keys) => [location.key, ...keys])
          // Handle back event
          // history.goForward(window.location.href)
          saved(null)
        }
      }
    })
  }, [locationKeys])

  const saveRole = (jsonData) => {
    if (isValid(topMostParent)) {
      if (selected === true) {
        if (selectedPermissions?.length > 0) {
          addRole({
            jsonData: {
              ...jsonData,
              permissions: selectedPermissions,
              user_type_id:
                topMostParent?.user_type_id === UserTypes.admin
                  ? UserTypes.adminEmployee
                  : UserTypes.employee
            },
            loading: setLoading,
            dispatch,
            success: () => {
              // SuccessToast("roles-added")
              saved(null)
            }
          })
        } else {
          ErrorToast('permission-required')
        }
      } else if (selected?.id) {
        editRole({
          id: selected?.id,
          jsonData: {
            ...jsonData,
            permissions: selectedPermissions
          },
          dispatch,
          loading: setLoading,
          success: () => {
            // SuccessToast("roles-edited")
            saved(null)
          }
        })
      }
    }
  }

  const fetchPermissions = (type) => {
    if (isValid(type)) {
      setPermissions(null)
      let bt = topMostParent?.user_type_id === UserTypes.admin ? 1 : 2
      if (type === UserTypes.company) {
        bt = 2
      }
      loadPermissions({
        jsonData: {
          belongs_to: bt,
          user_type_id: type
        },
        loading: setLoading,
        success: (d) => {
          const selected = []
          const permission = {}
          d?.payload?.forEach((per) => {
            if (permission[per?.permission?.group_name] === undefined) {
              permission[per?.permission?.group_name] = []
            }
            if (per?.permission?.entry_mode === 'required') {
              selected.push(per?.permission?.id)
            } else {
              if (editData?.permissions) {
                editData?.permissions?.map((p) => {
                  if (p?.id === per?.permission?.id) {
                    selected.push(p?.id)
                  }
                })
              }
            }
            permission[per?.permission?.group_name].push(per?.permission)
          })
          setAllPermissions(d?.payload)
          setPermissions(permission)
          if (editData?.permissions) {
            // setSelectedPermissions([...editData?.permissions?.map((per) => { return per?.id }), ...sel])
            setSelectedPermissions(selected)
          }
        },
        error: () => {}
      })
    }
  }

  useEffect(() => {
    if (editData?.id) {
      setSelected(editData)
      setValue('user_type_id', editData?.user_type_id)
      setValue('se_name', editData?.se_name)
      fetchPermissions(editData?.user_type_id)
      // setType(editData?.user_type_id)
    } else {
      setSelected(editData)
      setType(
        topMostParent?.user_type_id === UserTypes.admin
          ? UserTypes.adminEmployee
          : UserTypes.employee
      )
      fetchPermissions(
        topMostParent?.user_type_id === UserTypes.admin
          ? UserTypes.adminEmployee
          : UserTypes.employee
      )
    }
  }, [editData, topMostParent])

  // useEffect(() => {
  //     if (selected?.permissions) {
  //         setSelectedPermissions(selected?.permissions?.map((per) => { return per?.id }))
  //     }
  // }, [selected])
  const toggleAllPermission = () => {
    const getIds = allPermissions?.map((d) => d?.permission_id)
    // log(getIds)
    if (checkedAll) {
      setSelectedPermissions([])
      setCheckedAll(false)
    } else {
      setSelectedPermissions(getIds)
      setCheckedAll(true)
    }
  }

  const togglePermission = (permission) => {
    const i = selectedPermissions?.findIndex((p) => p === permission?.id)
    if (i === -1) {
      if (permission) {
        setSelectedPermissions([...selectedPermissions, permission?.id])
      }
    } else {
      const per = selectedPermissions ?? []
      per.splice(i, 1)
      setSelectedPermissions([...per])
    }
  }

  const isChecked = (permission) => {
    const i = selectedPermissions?.findIndex((p) => p === permission?.id)

    if (i !== undefined && i > -1) {
      return true
    } else {
      return false
    }
  }
  const renderPermissions = (per = []) => {
    const re = []
    if (per) {
      per.forEach((permission, index) => {
        re.push(
          <>
            <div className='form-check form-check-inline'>
              <Input
                // disabled={permission?.entry_mode === "required"}
                checked={isChecked(permission)}
                id={permission?.se_name}
                type={'checkbox'}
                onChange={(e) => togglePermission(permission)}
              />
              <Label for={permission?.se_name}>{permission?.se_name}</Label>
            </div>
          </>
        )
      })
    }
    return re
  }

  const renderGroups = () => {
    const re = []
    if (permissions) {
      for (const [key, value] of Object.entries(permissions)) {
        re.push(
          <>
            <div className='mb-2'>
              <h5 className='border-bottom pb-1 pt-1 mb-1 text-capitalize'>{key}</h5>
              {renderPermissions(value)}
            </div>
          </>
        )
      }
    }
    return re
  }

  useEffect(() => {
    if (editData === true) {
      if (isValid(watch('user_type_id'))) {
        fetchPermissions(watch('user_type_id'))
        setType(watch('user_type_id'))
      }
    }
  }, [watch('user_type_id')])

  return (
    <div>
      {loading && !permissions ? (
        <>
          <Row>
            <Col md='8' className='d-flex align-items-stretch'>
              <Card>
                <CardHeader tag={'h4'}>
                  {selected === true ? FM('add-role') : FM('edit-role')}
                </CardHeader>
                <CardBody>
                  <Shimmer style={{ height: 20 }} />
                  <Shimmer style={{ height: 20, marginTop: 15 }} />
                  <Shimmer style={{ height: 20, marginTop: 15 }} />
                  <Shimmer style={{ height: 20, marginTop: 15 }} />
                  <Shimmer style={{ height: 20, marginTop: 15 }} />
                  <Shimmer style={{ height: 20, marginTop: 15 }} />
                  <Shimmer style={{ height: 20, marginTop: 15 }} />
                  <Shimmer style={{ height: 20, marginTop: 15 }} />
                </CardBody>
              </Card>
            </Col>
            <Col md='4' className='d-flex align-items-stretch'>
              <Card>
                <CardHeader tag={'h4'}>{FM('role-name')}</CardHeader>
                <CardBody>
                  {/* <Shimmer style={{ height: 50 }} /> */}
                  <Shimmer style={{ height: 50, marginTop: 15 }} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Form onSubmit={handleSubmit(saveRole)}>
          <Row className='animate__animated animate__fadeIn'>
            <Col md='8' className='d-flex align-items-stretch'>
              <Card>
                <CardHeader tag={'h4'}>
                  <h4 className='card-title'>
                    {' '}
                    {selected === true ? FM('add-role') : FM('edit-role')}
                  </h4>
                  <Button.Ripple color='primary' className='round' onClick={toggleAllPermission}>
                    {checkedAll ? FM('uncheck-all') : FM('check-all')}
                  </Button.Ripple>
                </CardHeader>
                <CardBody>
                  <h6>{FM('assign-permissions')}</h6>
                  {renderGroups()}
                </CardBody>
              </Card>
            </Col>
            <Col md='4' className='d-flex align-items-stretch'>
              <Card>
                <CardHeader tag={'h4'}>{FM('role-name')}</CardHeader>
                <CardBody>
                  <Row>
                    {/* <Hide IF={isValid(editData?.id)}>
                                            <Col md="12">
                                                <FormGroupCustom
                                                    errors={errors}
                                                    type="select"
                                                    options={createConstSelectOptions(roleTypes[belongsTo], FM)}
                                                    value={type}
                                                    control={control}
                                                    label={'user-type'}
                                                    className="mb-2"
                                                    placeholder={FM("user-type")}
                                                    name={"user_type_id"}
                                                    rules={{ required: true }}
                                                />
                                            </Col>
                                        </Hide> */}
                    <Col md='12'>
                      <FormGroupCustom
                        errors={errors}
                        values={selected}
                        control={control}
                        noLabel
                        placeholder={FM('role-name')}
                        name={'se_name'}
                        rules={{ required: true, pattern: Patterns.AlphaNumericOnl, maxLength: 50 }}
                      />
                    </Col>
                  </Row>

                  <LoadingButton
                    block
                    type='submit'
                    className='mt-1'
                    loading={loading}
                    color='primary'
                  >
                    {FM('save')}
                  </LoadingButton>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  )
}

export default AddEditRole
