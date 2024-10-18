import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { Bell, RefreshCcw } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { decreaseUnreadNotification } from '../../redux/reducers/notifications'
import {
  addNotificationCls,
  LoadNotificationCls,
  loadNotifications,
  notificationList,
  readNotification,
  updateNotificationCls
} from '../../utility/apis/notifications'
import { FM, getInitials } from '../../utility/helpers/common'
import { NotificationLocator } from '../../utility/helpers/NotificationLocator'
import { fromNow, GetIcons, SuccessToast } from '../../utility/Utils'
import TableGrid from '../components/tableGrid'
import Header from '../header'

const CompanyTypes = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingRead, setLoadingRead] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const history = useHistory()

  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const onSubmitNew = (jsonData) => {
    addNotificationCls({
      jsonData,
      loading: setLoading,
      dispatch,
      success: (data) => {
        showForm()
        setAdded(data?.payload?.id)
        SuccessToast('done')
      },
      error: () => {}
    })
  }

  const onSubmitEdit = (jsonData) => {}

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

  const read = (id) => {
    readNotification({
      id,
      loading: (e) => setLoadingRead(id),
      dispatch,
      success: () => {
        dispatch(decreaseUnreadNotification())
      }
    })
  }

  const handleRead = (e, item) => {
    e.preventDefault()
    if (item?.read_status === 0) {
      read(item?.id)
    }
    NotificationLocator(item, history)
  }

  const gridView = (item, index) => {
    return (
      <>
        <Card
          className={classNames({
            'animate__animated animate__bounceIn': index === 0 && item.id === added
          })}
        >
          <CardBody className='media-list'>
            <div
              onClick={(e) => handleRead(e, item)}
              className={classNames('list-item d-flex align-items-center', {
                read: item?.read_status
              })}
            >
              <Fragment>
                <div className='me-1'>
                  <Avatar
                    color={
                      item?.read_status === 0 ? `light-${item?.status_code}` : 'light-secondary'
                    }
                    icon={<GetIcons type={item?.type} />}
                  />
                </div>
                <div className='list-item-body flex-grow-1'>
                  <p className='media-heading mb-0'>
                    <span className={classNames('', { 'fw-bolder': item?.read_status === 0 })}>
                      {item?.title}
                    </span>{' '}
                    {item?.sub_title}
                  </p>
                  <small className='notification-text'>{item.message}</small>
                  <p className='text-small-12 notification-text mb-0 mt-3px'>
                    {fromNow(item?.created_at)}
                  </p>
                </div>
              </Fragment>
            </div>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <Header icon={<Bell size={25} />}>
        {/* Buttons */}
        <ButtonGroup>
          {/* <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip> */}
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>

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
        gridClassName='testClass' // add grid class here
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadNotifications}
        selector='notificationCls'
        state='notifications'
        display='grid'
        gridCol='12'
        gridView={gridView}
      />
    </>
  )
}

export default CompanyTypes
