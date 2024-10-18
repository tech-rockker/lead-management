/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import { useCallback, useContext, useEffect, useState } from 'react'
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
  InputGroupText,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { activitiesDelete } from '../../../redux/reducers/activityClassification'
import {
  addActivityCls,
  deleteActivityCls,
  editActivityCls,
  loadActivityCls
} from '../../../utility/apis/activityCls'
import { Patterns } from '../../../utility/Const'

import { FM, getInitials } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { SuccessToast } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'

const ActivityClassification = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(null)
  const [failed, setFailed] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)

  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const onSubmitNew = (jsonData) => {
    addActivityCls({
      jsonData,
      loading: setLoading,
      dispatch,
      success: (data) => {
        showForm()
        setAdded(data?.payload?.id)
      },
      error: () => {}
    })
  }

  const onSubmitEdit = (jsonData) => {
    jsonData.status = jsonData?.status ? 1 : 0

    if (jsonData.name !== edit.name || jsonData.status !== edit.status) {
      editActivityCls({
        id: edit.id,
        jsonData: {
          ...jsonData,
          id: edit.id
        },
        dispatch,
        loading: setLoading,
        success: () => {
          setEdit(null)
          SuccessToast('done')
        }
      })
    } else {
      setEdit(null)
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
        <Card
          className={classNames({
            'animate__animated animate__bounceIn': index === 0 && item?.id === added
          })}
        >
          <CardBody>
            <Row className='align-items-center'>
              <Show IF={edit?.id === item?.id}>
                <Col xs='12'>
                  <div class='animate__animated animate__bounceIn animate__faster'>
                    <Form className='' onSubmit={handleSubmit(onSubmitEdit)}>
                      <FormGroupCustom
                        prepend={
                          <>
                            <InputGroupText>
                              <FormGroupCustom
                                noLabel
                                noGroup
                                value={item?.status}
                                control={control}
                                name='status'
                                message={FM('change-status')}
                                type={'checkbox'}
                                errors={errors}
                              />
                            </InputGroupText>
                          </>
                        }
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
                  <p className='m-0 status-text'>
                    {FM('status')}: {item?.status === 1 ? FM('active') : FM('inactive')}
                  </p>
                </Col>

                <Col xs='3' className='d-flex justify-content-end'>
                  <Show IF={Permissions.activitiesClsEdit}>
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
                    <Show IF={Permissions.activitiesClsDelete}>
                      <UncontrolledTooltip target={`grid-delete-${item?.id}`}>
                        {FM('delete')}
                      </UncontrolledTooltip>
                      <ConfirmAlert
                        item={item}
                        title={FM('delete-this', { name: item?.name })}
                        color='text-warning'
                        onClickYes={() => deleteActivityCls({ id: item?.id })}
                        onSuccessEvent={(item) => dispatch(activitiesDelete(item?.id))}
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
      </>
    )
  }

  return (
    <>
      <Header subHeading={<>{FM('activities')}</>}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <Show IF={formVisible}>
          <div className='animate__animated animate__bounceInLeft animate__faster'>
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
          <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Button.Ripple
            onClick={showForm}
            size='sm'
            outline
            color={formVisible ? 'danger' : 'dark'}
            id='create-button'
          >
            <Show IF={formVisible}>
              <X size='14' />
            </Show>
            <Hide IF={formVisible}>
              <Plus size='14' />
            </Hide>
          </Button.Ripple>
          <Button.Ripple size='sm' outline color='dark' id='filter'>
            <Sliders size='14' />
          </Button.Ripple>
          <Button.Ripple
            size='sm'
            outline
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
        loadFrom={loadActivityCls}
        selector='activityCls'
        state='activitiesCls'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default ActivityClassification
