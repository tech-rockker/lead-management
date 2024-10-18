/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Edit, Plus, RefreshCcw, Save, Sliders, Trash2, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { departmentDelete } from '../../../redux/reducers/departments'
import { deleteDep, editDep, loadDep, addDep } from '../../../utility/apis/departments'
import { Patterns } from '../../../utility/Const'
import { FM, getInitials } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'
import DepartmentFilter from './departmentFilter'

const Department = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [deptFilter, setDeptFilter] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(null)
  const [deletedId, setDeletedId] = useState(null)
  const [failed, setFailed] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [department, setDepartment] = useState(null)
  const [filterData, setFilterData] = useState(null)

  const showForm = () => {
    setFormVisible(!formVisible)
  }

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  const onSubmitNew = (jsonData) => {
    addDep({
      jsonData,
      loading: setLoading,
      dispatch,
      success: (data) => {
        showForm()
        setAdded(data?.payload?.id)
        reset()
      }
    })
  }

  const onSubmitEdit = (jsonData) => {
    jsonData.status = jsonData?.status ? 1 : 0

    if (jsonData.name !== edit.name) {
      editDep({
        id: edit.id,
        jsonData: {
          ...jsonData
        },
        dispatch,
        loading: setLoading,
        success: () => {
          setEdit(null)
          reset()
        }
      })
    } else {
      setEdit(null)
      reset()
    }
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)
    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const gridView = (item, index) => {
    return (
      <>
        <div key={`userType-card-${index}`} className='flex-1'>
          {/* <div style={{ border: "3px solid #ffcfcf" }}></div> */}
          <Card className=''>
            <CardBody className='animate__animated animate__flipInX'>
              <Row noGutters className='align-items-center'>
                <Show IF={edit?.id === item?.id}>
                  <Col xs='12'>
                    <div>
                      <Form className='' onSubmit={handleSubmit(onSubmitEdit)}>
                        <FormGroupCustom
                          value={item?.name}
                          noLabel
                          control={control}
                          errors={errors}
                          type='text'
                          name='name'
                          rules={{ required: true, maxLength: 35 }}
                          append={
                            <>
                              <LoadingButton
                                tooltip={FM('save')}
                                loading={loading}
                                type='submit'
                                size='sm'
                                color='primary'
                              >
                                <Save size='14' />
                              </LoadingButton>
                            </>
                          }
                        />
                      </Form>
                    </div>
                  </Col>
                </Show>
                <Hide IF={edit?.id === item?.id}>
                  <Col xs='2'>
                    <Avatar
                      color={item?.status === 1 ? 'light-primary' : 'light-primary'}
                      content={getInitials(item?.name)}
                    />
                  </Col>
                  <Col xs='7'>
                    <p className='text-truncate m-0' title={item?.name}>
                      {item?.name}
                    </p>
                    {/* <p className="m-0 status-text">
                                    {FM("status")}: {item?.status === 1 ? FM("active") : FM("inactive")}
                                </p> */}
                  </Col>

                  <Col xs='3' className='d-flex justify-content-end'>
                    <Show IF={Permissions.departmentsEdit}>
                      <UncontrolledTooltip target={`grid-edit-${item?.id}`} autohide={true}>
                        {FM('edit')}
                      </UncontrolledTooltip>
                      <span
                        role={'button'}
                        id={`grid-edit-${item?.id}`}
                        onClick={() => {
                          setEdit(item)
                        }}
                      >
                        <Edit color={colors.primary.main} size='18' />
                      </span>
                    </Show>
                    <Hide IF={edit?.id === item?.id}>
                      <Show IF={Permissions.departmentsDelete}>
                        <UncontrolledTooltip target={`grid-delete-${item?.id}`}>
                          {FM('delete')}
                        </UncontrolledTooltip>
                        <ConfirmAlert
                          item={item}
                          title={FM('delete-this', { name: item?.name })}
                          color='text-warning'
                          onClickYes={() => deleteDep({ id: item?.id })}
                          onSuccessEvent={(item) => dispatch(departmentDelete(item?.id))}
                          className='ms-1'
                          id={`grid-delete-${item?.id}`}
                        >
                          <Trash2 color={colors.danger.main} size='18' />
                        </ConfirmAlert>
                      </Show>
                    </Hide>
                  </Col>
                </Hide>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <DepartmentFilter
        show={deptFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setDeptFilter(false)
        }}
      />
      <Header>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <Show IF={formVisible}>
          <div class='animate__animated animate__bounceInLeft animate__faster'>
            <Form className='me-1' onSubmit={handleSubmit(onSubmitNew)}>
              <FormGroupCustom
                noLabel
                placeholder={FM('enter-name')}
                type='text'
                name='name'
                control={control}
                errors={errors}
                bsSize='sm'
                rules={{ required: true, maxLength: 35 }}
                append={
                  <>
                    <LoadingButton
                      tooltip={FM('save')}
                      loading={loading}
                      type='submit'
                      size='sm'
                      color='primary'
                    >
                      <Save size='14' />
                    </LoadingButton>
                  </>
                }
              />
            </Form>
          </div>
        </Show>

        {/* Buttons */}
        <ButtonGroup>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Show IF={Permissions.departmentsAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <Button.Ripple
              onClick={showForm}
              size='sm'
              color={formVisible ? 'danger' : 'primary'}
              id='create-button'
            >
              <Show IF={formVisible}>
                <X size='14' />
              </Show>
              <Hide IF={formVisible}>
                <Plus size='14' />
              </Hide>
            </Button.Ripple>
          </Show>
          <Button.Ripple
            onClick={() => setDeptFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='14' />
          </Button.Ripple>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setReload(true)
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>

      {/* Category Types */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadDep}
        jsonData={filterData}
        selector='departments'
        state='department'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default Department
