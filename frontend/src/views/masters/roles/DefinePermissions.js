import React, { useEffect, useState } from 'react'
import { Loader, RotateCcw } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Form, Input, Label, Row } from 'reactstrap'
import {
  addAllPermission,
  loadAllPermissions,
  loadPermissions
} from '../../../utility/apis/permissions'
import { addRole, editRole } from '../../../utility/apis/roles'
import { BelongsTo, Patterns, roleTypes, UserTypes } from '../../../utility/Const'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import { createConstSelectOptions, ErrorToast } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import Shimmer from '../../components/shimmers/Shimmer'

const DefinePermissions = ({ editData = null, saved = () => {} }) => {
  const user = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()
  const [selected, setSelected] = useState(null)
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
  const [password, setPassword] = useState('qaz121wsx')
  const [pass, setPass] = useState('qaz121wsx')
  const [type, setType] = useState(3)
  const [belongsTo, setBelongsTo] = useState()
  const history = useHistory()

  useEffect(() => {
    setBelongsTo(user?.top_most_parent?.user_type_id === UserTypes.admin ? 'admin' : 'company')
  }, [user])

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
    if (selectedPermissions?.length > 0) {
      addAllPermission({
        jsonData: {
          ...jsonData,
          permissions: selectedPermissions
        },
        loading: setLoading,
        dispatch,
        success: () => {
          saved(null)
        }
      })
    } else {
      ErrorToast('permission-required')
    }
  }
  const fetchPermissionsType = (type) => {
    if (isValid(type)) {
      setSelectedPermissions([])
      loadPermissions({
        jsonData: {
          // belongs_to: (user?.top_most_parent?.user_type_id === UserTypes.admin ? 1 : 2),
          user_type_id: type
        },
        loading: setLoading,
        success: (d) => {
          if (isValidArray(d?.payload)) {
            setSelectedPermissions(d?.payload?.map((x) => x?.permission_id))
          }
        },
        error: () => {}
      })
    }
  }
  const fetchPermissions = (type = 'all') => {
    if (isValid(type)) {
      setPermissions(null)
      loadAllPermissions({
        jsonData: {
          // belongs_to: (user?.top_most_parent?.user_type_id === UserTypes.admin ? 1 : 2)
          // user_type_id: type
        },
        loading: setLoading,
        success: (d) => {
          const permission = {}
          d?.payload?.permissions?.forEach((per) => {
            if (permission[per?.group_name] === undefined) {
              permission[per?.group_name] = []
            }
            permission[per?.group_name].push(per)
          })
          setPermissions(permission)
        },
        error: () => {}
      })
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  useEffect(() => {
    if (selected?.permissions) {
      setSelectedPermissions(
        selected?.permissions?.map((per) => {
          return per?.id
        })
      )
    }
  }, [selected])

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
    if (editData === null) {
      if (isValid(watch('user_type_id'))) {
        fetchPermissionsType(watch('user_type_id'))
        setType(watch('user_type_id'))
      }
    }
  }, [watch('user_type_id')])

  if (pass !== password) {
    return (
      <>
        <Input
          type='password'
          placeholder='password'
          onChange={(e) => {
            setPass(e?.target?.value)
          }}
        />
      </>
    )
  } else {
    return (
      <div className='animate__animated animate__flipInX animate__faster'>
        {loading && !permissions ? (
          <>
            <Row>
              <Col md='8' className='d-flex align-items-stretch'>
                <Card>
                  <CardHeader tag={'h4'}>{FM('assign-permission')}</CardHeader>
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
                  <CardHeader tag={'h4'}>{FM('user-type')}</CardHeader>
                  <CardBody>
                    <Shimmer style={{ height: 50 }} />
                    <Shimmer style={{ height: 50, marginTop: 15 }} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Form onSubmit={handleSubmit(saveRole)}>
            <Row>
              <Col md='8' className='d-flex align-items-stretch'>
                <Card>
                  <CardHeader tag={'h4'}>
                    <h4 className='card-title'>{FM('assign-permission')}</h4>
                  </CardHeader>
                  <CardBody>
                    <h6>{FM('assign-permissions')}</h6>
                    {renderGroups()}
                  </CardBody>
                </Card>
              </Col>
              <Col md='4' className='d-flex align-items-stretch'>
                <Card>
                  <CardHeader tag={'h4'}>{FM('user-type')}</CardHeader>
                  <CardBody>
                    <Row>
                      {/* <Col md="12">
                                            <FormGroupCustom
                                                errors={errors}
                                                type="select"
                                                noLabel
                                                options={createConstSelectOptions(BelongsTo, FM)}
                                                value={type}
                                                control={control}
                                                className="mb-2"
                                                placeholder={FM("belongs-to")}
                                                name={"belongs_to"}
                                                rules={{ required: true }}
                                            />
                                        </Col> */}
                      <Col md='12'>
                        <FormGroupCustom
                          errors={errors}
                          type='select'
                          noLabel
                          options={createConstSelectOptions(UserTypes, FM)}
                          value={type}
                          control={control}
                          className='mb-2'
                          placeholder={FM('user-type')}
                          name={'user_type_id'}
                          rules={{ required: true }}
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
}

export default DefinePermissions
