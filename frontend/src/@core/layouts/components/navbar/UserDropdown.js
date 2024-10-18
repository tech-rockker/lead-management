// ** React Imports
import { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils

// ** Store & Actions
import { useDispatch } from 'react-redux'
// import { handleLogout } from '@store/authentication'

// ** Third Party Components
import { ChevronDown, Power, User } from 'react-feather'

// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/other.png'
import { useForm } from 'react-hook-form'
import { handleLogout } from '../../../../redux/authentication'
import { getPath } from '../../../../router/RouteHelper'
import { assignedEmpToBranchs, switchBranch } from '../../../../utility/apis/userManagement'
import { UserTypes } from '../../../../utility/Const'
import { Socket } from '../../../../utility/context/Socket'
import Emitter from '../../../../utility/Emitter'
import { FM, isValid, isValidArray } from '../../../../utility/helpers/common'
import useUser from '../../../../utility/hooks/useUser'
import useUserType from '../../../../utility/hooks/useUserType'
import Show from '../../../../utility/Show'
import { decrypt } from '../../../../utility/Utils'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const { disconnect } = useContext(Socket)
  const usertype = useUserType()

  const history = useHistory()
  const user = useUser()
  const [branch, setBranch] = useState([])
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
  //** Vars
  const userAvatar = (user && user?.avatar) || defaultAvatar
  const handleSave = (e, branch) => {
    e?.preventDefault()
    Emitter.emit('resettingBranch', true)
    localStorage.setItem('branch_id_aceuss', branch?.branch_name)
    switchBranch({
      jsonData: {
        branch_id: branch?.id
      },
      loading: (e) => {},
      success: (_data) => {
        window.location.reload()
      }
    })
  }

  const LoadBranch = () => {
    if (isValid(user?.id)) {
      assignedEmpToBranchs({
        jsonData: {
          employee_id: user?.id
        },
        success: (e) => {
          if (isValidArray(e?.payload)) {
            setBranch(e?.payload)
          }
        }
      })
    }
  }

  useEffect(() => {
    if (
      (usertype === UserTypes.company,
      usertype === UserTypes.branch,
      usertype === UserTypes.employee)
    ) {
      LoadBranch()
    }
  }, [user])

  const getName = (id) => {
    return isValid(localStorage.getItem('branch_id_aceuss')) ? (
      <>{localStorage.getItem('branch_id_aceuss')} </>
    ) : null
  }
  const getBranch = () => {
    if (usertype === UserTypes.branch) {
      return user?.branch_name
    } else if (usertype === UserTypes?.employee) {
      return getName() ?? user?.branch?.branch_name
    } else if (usertype === UserTypes?.company) {
      return user?.branch_name
    } else if (usertype === UserTypes?.adminEmployee) {
      return <>{FM('admin')}</>
    } else if (usertype === UserTypes.admin) {
      return <>{FM('admin')}</>
    } else if (usertype === UserTypes.patient) {
      return getName() ?? user?.branch?.branch_name
    } else if (usertype === UserTypes.contactPerson) {
      return getName() ?? user?.branch?.branch_name
    } else if (usertype === UserTypes.caretaker) {
      return getName() ?? user?.branch?.branch_name
    } else if (usertype === UserTypes.familyMember) {
      return getName() ?? user?.branch?.branch_name
    } else if (usertype === UserTypes.other) {
      return getName() ?? user?.branch?.branch_name
    } else if (usertype === UserTypes.guardian) {
      return getName() ?? user?.branch?.branch_name
    }
  }
  return (
    <>
      <UncontrolledDropdown href='/' tag='li' className='dropdown-user nav-item me-0'>
        <DropdownToggle
          href='/'
          disabled={branch?.length === 0 && usertype !== UserTypes.employee}
          tag='a'
          className='nav-link dropdown-user-link'
          onClick={(e) => e.preventDefault()}
        >
          <div className='user-nav d-sm-flex d-none me-0'>
            <span className='user-name fw-bold' title={(user && user['role_name']) || ''}>
              {decrypt(FM(user && user['name']) || '')}
            </span>

            <span className='user-status text-end'>
              {getBranch()}{' '}
              {branch?.length > 0 && usertype === UserTypes.employee ? (
                <ChevronDown size={14} />
              ) : null}
            </span>
          </div>
        </DropdownToggle>
        <Show IF={branch?.length > 0}>
          <DropdownMenu end>
            {branch?.map((item, index) => {
              return (
                <DropdownItem href='/' tag='a' onClick={(e) => handleSave(e, item?.branch)}>
                  <span className='ms-0'> {item?.branch?.branch_name} </span>
                </DropdownItem>
              )
            })}
          </DropdownMenu>
        </Show>
      </UncontrolledDropdown>
      <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
        <DropdownToggle
          href='/'
          tag='a'
          className='nav-link dropdown-user-link'
          onClick={(e) => e.preventDefault()}
        >
          <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' />
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem
            tag={Link}
            to={{ pathname: getPath('master.profile', { id: user?.id }), state: { data: user } }}
          >
            <User size={14} className='me-75' />
            <span className='align-middle'>{FM('profile')}</span>
          </DropdownItem>
          <DropdownItem
            tag={Link}
            to='/'
            onClick={(e) => {
              e.preventDefault()
              disconnect()
              dispatch(handleLogout(history))
            }}
          >
            <Power size={14} className='me-75' />
            <span className='align-middle'>{FM('logout')}</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  )
}

export default UserDropdown
