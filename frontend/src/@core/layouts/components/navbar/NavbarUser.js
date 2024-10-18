// ** Dropdowns Imports
import { useCallback, useEffect, useState } from 'react'
// ** Third Party Components
import { MessageSquare, Moon, Sun } from 'react-feather'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
// ** Reactstrap Imports
import { Badge, NavItem, NavLink } from 'reactstrap'
import { useRedux } from '../../../../redux/useRedux'
import { getPath } from '../../../../router/RouteHelper'
import { UserTypes } from '../../../../utility/Const'
import useModules from '../../../../utility/hooks/useModules'
import useUserType from '../../../../utility/hooks/useUserType'
import Show from '../../../../utility/Show'
import StampModule from '../../../../views/stampling/StampModule'
import IntlDropdown from './IntlDropdown'
import NotificationDropdown from './NotificationDropdown'
import UserDropdown from './UserDropdown'

const NavbarUser = (props) => {
  // ** Props
  const { skin, setSkin } = props
  const usertype = useUserType()
  const history = useHistory()
  const { ViewStampling } = useModules()
  const {
    reduxStates: {
      chat: { totalUnreadMessages }
    }
  } = useRedux()
  const [formVisible, setFormVisible] = useState(false)
  const id = useSelector((s) => s.stampling.stampling.data)
  const [edit, setEdit] = useState(null)

  // Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
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

  const handleMessage = (e) => {
    e?.preventDefault()
    history.push(getPath('messages'))
  }
  return (
    <>
      <ul className='nav navbar-nav align-items-center ms-auto'>
        <StampModule />
        <IntlDropdown />
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <ThemeToggler />
          </NavLink>
        </NavItem>
        <NavItem className='d-none d-lg-block'>
          <NavLink onClick={handleMessage} className='nav-link-style'>
            <MessageSquare />
            <Show IF={totalUnreadMessages > 0}>
              <Badge pill color='danger' className='badge-up' style={{ right: 0 }}>
                {totalUnreadMessages}
              </Badge>
            </Show>
          </NavLink>
        </NavItem>
        <NotificationDropdown />
        <UserDropdown />
      </ul>
    </>
  )
}
export default NavbarUser
