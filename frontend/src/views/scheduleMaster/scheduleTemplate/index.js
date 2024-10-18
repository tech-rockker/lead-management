/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Anchor,
  Edit,
  Eye,
  FilePlus,
  MoreVertical,
  Plus,
  RefreshCcw,
  Save,
  Sunset,
  Trash2
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Form,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { scheduleTempDelete } from '../../../redux/reducers/scheduleTemplate'
import { getPath } from '../../../router/RouteHelper'
import {
  addScTemplate,
  deleteScTemplate,
  editScTemplate,
  loadScTemplate
} from '../../../utility/apis/scheduleTemplate'
import { IconSizes } from '../../../utility/Const'
import { FM, getInitials, isValid, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Show from '../../../utility/Show'
import { formatDate, SuccessToast, truncateText } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import DropDownMenu from '../../components/dropdown'
import FormGroupCustom from '../../components/formGroupCustom'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import ScheduleModal from '../schedule/fragment/ScheduleModal'
import ActiveModal from './fragments/ActiveModal'
import ChangeModal from './fragments/ChangeModal'
import ScheduleTemplateModal from './fragments/scheduleTemplateModal'

const ScheduleTemplates = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
    reset
  } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(null)
  const [activate, setActivate] = useState(null)
  const [tempId, setTempId] = useState(null)
  const [failed, setFailed] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [changeModal, setChangeModal] = useState(false)
  const [activeModal, setActiveModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [templateView, setTemplateView] = useState(false)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(null)
  const [statusAction, setStatusAction] = useState(1)
  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const handleClose = (e) => {
    if (e === false) {
      setChangeModal(e)
      setEditModal(e)
      setActiveModal(e)
      setTemplateView(e)
      reset(e)
    }
  }
  // log(loadActivityCls)
  const onSubmitNew = (d) => {
    addScTemplate({
      jsonData: {
        ...d,
        status: 0
      },
      loading: setReload,
      //dispatch,
      success: (data) => {
        showForm()
        reset()
        setAdded(data?.payload?.id)
        SuccessToast('done')
      },
      error: () => {}
    })
  }

  const onSubmitEdit = (jsonData) => {
    log(jsonData)
    jsonData.status = jsonData?.status ? 1 : 0

    if (jsonData.title !== edit.title || jsonData.status !== edit.status) {
      editScTemplate({
        id: edit.id,
        jsonData: {
          ...jsonData,
          id: edit.id
        },
        dispatch,
        loading: setReload,
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
        <Card key={`${item?.id}-item`}>
          <CardBody className='animate__animated '>
            <Row className='align-items-center'>
              {/* <Show IF={(edit?.id === item.id)}>
                            <Col xs="12">
                                <div class="animate__animated animate__bounceIn animate__faster">
                                    <Form onSubmit={handleSubmit(onSubmitEdit)}>
                                        <FormGroupCustom
                                            key={edit?.id}
                                            prepend={
                                                <InputGroupText>
                                                    <FormGroupCustom
                                                        control={control}
                                                        name="status"
                                                        errors={errors}
                                                        value={item?.status}
                                                        noLabel
                                                        noGroup
                                                        message={FM("change-status")}
                                                        type="checkbox"
                                                    />
                                                </InputGroupText>
                                            }
                                            control={control}
                                            value={item?.title}
                                            autoFocus={true}
                                            noLabel
                                            placeholder={FM("title")}
                                            type="text"
                                            name="title"
                                            errors={errors}
                                            className='mb-0'
                                            rules={{ required: true, maxLength: 35 }}
                                            append={
                                                <>
                                                    <LoadingButton tooltip={FM("save")} loading={loading} type="submit" size="sm" color="primary">
                                                        <Save size="14" />
                                                    </LoadingButton>
                                                </>
                                            }
                                        />
                                    </Form>
                                </div>
                            </Col>                                                                                                                               
                        </Show> */}
              {/* <Hide IF={(edit?.id === item?.id)}> */}
              <Col xs='2'>
                <Avatar
                  color={item?.status === 1 ? 'light-primary' : 'light-primary'}
                  content={isValid(item.title) ? getInitials(item.title) : 'A'}
                />
              </Col>
              <Col xs='8'>
                <Link
                  to={{
                    pathname: `${getPath('schedule.calender.view', {
                      id: item.id,
                      status: item?.status
                    })}`,
                    state: { data: item }
                  }}
                  ta
                  className='text-truncate m-0'
                  title={item?.title}
                >
                  <h5 className='mb-0 text-capitalize text-primary'>
                    {truncateText(item?.title, 20)}
                  </h5>
                </Link>
                <p
                  className={
                    item?.status === 1
                      ? `m-0 text-small-12 text-success fw-bold`
                      : `m-0 text-small-12 text-danger fw-bold`
                  }
                >
                  {isValid(item?.deactivation_date) ? (
                    <>
                      {FM('deactivated-on')} : {formatDate(item?.deactivation_date)}
                    </>
                  ) : (
                    <>{item?.status === 1 ? FM('active') : FM('inactive')}</>
                  )}
                </p>
              </Col>
              <Col xs='2' className='d-flex justify-content-end align-items-centers'>
                <DropDownMenu
                  tooltip={FM(`menu`)}
                  component={
                    <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                  }
                  options={[
                    {
                      IF: item?.status === 1,
                      icon: <Eye size={14} />,
                      to: {
                        pathname: `${getPath('schedule.calender.view', {
                          id: item.id,
                          status: item?.status
                        })}`,
                        state: { data: item }
                      },
                      name: FM('view-in-calender')
                    },
                    {
                      icon: <FilePlus size={14} />,
                      onClick: () => {
                        setChangeModal(true)
                        setData(item)
                      },
                      name: FM('create-a-copy')
                    },
                    {
                      IF: !isValid(item?.deactivation_date),
                      icon: <Sunset size={14} />,
                      onClick: () => {
                        setStatusAction(item?.status === 0 ? 1 : 0)
                        setActiveModal(true)
                        setData(item)
                      },
                      name: item?.status === 0 ? FM('activate-template') : FM('inactivate-template')
                    },
                    {
                      IF: !isValid(item?.deactivation_date),
                      icon: <Edit size={14} />,
                      onClick: () => {
                        setEditModal(true)
                        setData(item)
                      },
                      name: FM('rename')
                    },
                    {
                      IF: item?.status === 0 || isValid(item?.deactivation_date),
                      noWrap: true,
                      name: (
                        <ConfirmAlert
                          item={item}
                          title={FM('delete-this', { name: item?.title })}
                          color='text-warning'
                          onClickYes={() => deleteScTemplate({ id: item?.id })}
                          onSuccessEvent={(item) => dispatch(scheduleTempDelete(item?.id))}
                          className='ms-0 dropdown-item'
                          id={`grid-delete-${item?.id}`}
                        >
                          <Trash2 size={14} className='me-1' />
                          {FM('delete')}
                        </ConfirmAlert>
                      )
                    }
                  ]}
                />
              </Col>
              {/* </Hide> */}
            </Row>
          </CardBody>
        </Card>
      </>
    )
  }
  return (
    <>
      <Header icon={<Anchor />}>
        {/* Tooltips */}

        <ActiveModal
          status={statusAction}
          responseData={(e) => setReload(e)}
          showModal={activeModal}
          setShowModal={handleClose}
          followId={data?.id}
          edit={data}
          noView
        />
        <ScheduleTemplateModal
          responseData={(e) => setReload(e)}
          showModal={editModal}
          setShowModal={handleClose}
          followId={data?.id}
          edit={data}
          noView
        />
        <ChangeModal
          responseData={(e) => setReload(e)}
          showModal={changeModal}
          setShowModal={handleClose}
          followId={data?.id}
          edit={data}
          noView
        />
        {/* <UncontrolledTooltip target="filter">{FM("filter")}</UncontrolledTooltip> */}
        <Show IF={formVisible}>
          <div class='animate__animated animate__bounceInLeft animate__faster'>
            <Form className='me-1' onSubmit={handleSubmit(onSubmitNew)}>
              <FormGroupCustom
                size='sm'
                control={control}
                autoFocus={true}
                placeholder={FM('title')}
                type='text'
                name='title'
                noLabel
                errors={errors}
                rules={{ required: true, maxLength: 35 }}
                append={
                  <LoadingButton
                    tooltip={FM('save')}
                    loading={loading}
                    type='submit'
                    size='sm'
                    color='primary'
                  >
                    <Save size='14' />
                  </LoadingButton>
                }
              />
            </Form>
          </div>
        </Show>
        <ButtonGroup className='me-2'>
          <BsTooltip
            onClick={() => {
              setStatus(null)
              setReload(true)
            }}
            Tag={Button.Ripple}
            title={FM('view-all')}
            color='primary'
            outline={status !== null}
          >
            {FM('all')}
          </BsTooltip>
          <BsTooltip
            onClick={() => {
              setStatus('active')
              setReload(true)
            }}
            Tag={Button.Ripple}
            title={FM('view-active')}
            color='primary'
            outline={status !== 'active'}
          >
            {FM('active')}
          </BsTooltip>
          <BsTooltip
            onClick={() => {
              setStatus('inactive')
              setReload(true)
            }}
            Tag={Button.Ripple}
            title={FM('view-inactive')}
            color='primary'
            outline={status !== 'inactive'}
          >
            {FM('inactive')}
          </BsTooltip>
        </ButtonGroup>
        {/* Buttons */}
        <ButtonGroup>
          <UncontrolledTooltip target='create-button'>{FM('create-schedule')}</UncontrolledTooltip>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          {/* <Button.Ripple id="create-button" onClick={showForm} size="sm" outline color={formVisible ? "danger" : "primary"}>
                        <Show IF={formVisible}>
                            <X size="14" />
                        </Show>
                        <Hide IF={formVisible}>
                            <Plus size="14" />
                        </Hide>
                    </Button.Ripple> */}
          {/* <ScheduleTemplateModal Component={Button.Ripple} size="sm" color="primary" id="create-button">
                        <Plus size="16" />
                    </ScheduleTemplateModal> */}
          <ScheduleModal Component={Button.Ripple} size='sm' color='primary' id='create-button'>
            <Plus size='16' />
          </ScheduleModal>
          {/* <Button.Ripple size="sm" color="secondary" id="filter">
                        <Sliders size="14" />
                    </Button.Ripple> */}
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setReload(true)
              setEdit({})
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
        loadFrom={loadScTemplate}
        jsonData={{
          status
        }}
        selector='scheduleTemplate'
        state='scheduleTemplate'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}
export default ScheduleTemplates
