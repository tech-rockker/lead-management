// ** React Imports
// ** Custom Components
import Avatar from '@components/avatar'
import { useSkin } from '@hooks/useSkin'
// ** Third Party Components
import classnames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Bell, CheckSquare, Eye, RefreshCcw } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
// ** Reactstrap Imports
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown,
  UncontrolledDropdown
} from 'reactstrap'
import {
  decreaseUnreadNotification,
  setUnreadNotification
} from '../../../../redux/reducers/notifications'
import { useRedux } from '../../../../redux/useRedux'
import { getPath } from '../../../../router/RouteHelper'
import {
  loadLatestNotifications,
  loadNotifications,
  loadUnreadCount,
  readNotification,
  readNotificationAll
} from '../../../../utility/apis/notifications'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import { NotificationLocator } from '../../../../utility/helpers/NotificationLocator'
import useUser from '../../../../utility/hooks/useUser'
import Show from '../../../../utility/Show'
import { countPlus, fromNow, GetIcons } from '../../../../utility/Utils'
import Shimmer from '../../../../views/components/shimmers/Shimmer'
import BsTooltip from '../../../../views/components/tooltip'
import Hide from './../../../../utility/Hide'

const NotificationDropdown = () => {
  // ** Notification Array
  const {
    dispatch,
    reduxStates: {
      notificationCls: { latestNotification, unreadNotification }
    }
  } = useRedux()
  const notifications = latestNotification
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [loadingRead, setLoadingRead] = useState(null)
  const [open, setOpen] = useState(null)
  const [perPage, setPerPage] = useState(10)
  const { skin } = useSkin()
  const user = useUser()

  const loadNotificationList = () => {
    loadLatestNotifications({
      page: 1,
      perPage,
      loading: setLoading,
      dispatch,
      success: (data) => {
        dispatch(
          setUnreadNotification(data?.payload?.data?.filter((a) => a.read_status === 0)?.length)
        )
      }
    })
  }

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
  const getUnreadCount = () => {
    loadUnreadCount({})
  }
  useEffect(() => {
    if (isValid(user?.id)) {
      loadNotificationList()
      getUnreadCount()
    }
  }, [user])

  useEffect(() => {
    if (notifications?.data?.length > 0) {
      setOpen(false)
    }
  }, [notifications])

  const handleRead = (e, item) => {
    e.preventDefault()
    document.body.click()
    if (item?.read_status === 0) {
      read(item?.id)
      setOpen(false)
    }
    NotificationLocator(item, history)
  }

  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {notifications?.data?.map((item, index) => {
          return (
            <a key={index} className='d-flex' href='/' onClick={(e) => handleRead(e, item)}>
              <div
                className={classnames('list-item d-flex align-items-center', {
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
                    <p className='media-heading'>
                      <span className={classnames('', { 'fw-bolder': item?.read_status === 0 })}>
                        {FM(item?.title)}
                      </span>
                    </p>
                    <p className='notification-text text-small-12 mb-0 mt-5px'>{item.message}</p>
                    <p className='text-small-12 notification-text mb-0 mt-3px'>
                      {fromNow(item?.created_at)}
                    </p>
                  </div>
                </Fragment>
              </div>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }

  const handleClick = (e) => {
    e.preventDefault()
    // setOpen(true)
  }
  const toggleDropdown = () => {
    setOpen(!open)
  }
  const handleReadAll = () => {
    readNotificationAll({
      loading: setLoadingRead,
      dispatch,
      success: () => {
        loadNotificationList()
      }
    })
  }

  return (
    <UncontrolledDropdown
      isOpen={open}
      toggle={toggleDropdown}
      tag='li'
      className='dropdown-notification nav-item me-25'
    >
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={handleClick}>
        <Bell size={21} />
        <Hide IF={unreadNotification <= 0}>
          <Badge pill color='danger' className='badge-up'>
            {countPlus(unreadNotification, 100)}
          </Badge>
        </Hide>
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>{FM('notifications')}</h4>
            <Show IF={unreadNotification > 0}>
              <BsTooltip
                title={FM('mark-as-read-all', { count: unreadNotification })}
                onClick={handleReadAll}
                role='button'
              >
                <CheckSquare size={20} />
              </BsTooltip>
            </Show>
            {/* <BsTooltip className="ms-1" onClick={() => {
                            loadNotificationList()
                        }} title={FM("reload")} role="button">
                            <RefreshCcw size={18} />
                        </BsTooltip> */}
          </DropdownItem>
        </li>
        <Show IF={loading}>
          <Shimmer
            style={{
              height: 64,
              borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
            }}
          />
          <Shimmer
            style={{
              height: 64,
              borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
            }}
          />
          <Shimmer
            style={{
              height: 64,
              borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
            }}
          />
          <Shimmer
            style={{
              height: 64,
              borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
            }}
          />
          <Shimmer
            style={{
              height: 64,
              borderBottom: skin === 'dark' ? '1px solid #3b4253' : '1px solid #ebe9f1'
            }}
          />
        </Show>

        <Hide IF={loading}>{renderNotificationItems()}</Hide>
        <Show IF={notifications?.total > perPage}>
          <li className='dropdown-menu-footer'>
            <Link
              to={getPath('notifications')}
              onClick={() => {
                document.body.click()
              }}
              className='btn btn-primary d-block btn-block'
            >
              {FM('view-all-notifications')}
            </Link>
          </li>
        </Show>

        {/* <li className='dropdown-menu-footer'>
                    <Button onClick={() => setRead(false)} color={"primary"} className="btn btn-primary " block>
                        {read ? FM("read-all-notifications") : FM("no-notifications")}
                    </Button>
                </li> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
