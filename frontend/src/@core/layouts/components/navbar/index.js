// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { handleLogout } from '../../../../redux/authentication'
import { licenseStatus } from '../../../../utility/apis/licenseApis'
import { UserTypes } from '../../../../utility/Const'
import useUser from '../../../../utility/hooks/useUser'
import TermsModal from '../../../../views/activity/modals/TermsModal'
import Birthday from '../../../../views/birthday'
import NavbarBookmarks from './NavbarBookmarks'
// ** Custom Components
import NavbarUser from './NavbarUser'
import { storageUsageDetails } from '../../../../utility/apis/commons'
import StorageBar from './StorageBar'

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props
  const [licenseStat, setLicenseStat] = useState('active')
  const [currentStorage, setCurrentStorage] = useState('')
  const user = useUser()
  const dispatch = useDispatch()
  const history = useHistory()

  const x = useSelector((s) => s?.fileupload)
  console.log(x)

  const preload = () => {
    licenseStatus({
      success: (e) => {
        setLicenseStat(e)
      },
      error: (e) => {
        dispatch(handleLogout(history))
      }
    })
  }

  const storageCheck = () => {
    storageUsageDetails({
      success: (e) => {
        setCurrentStorage(e?.payload)
      }
    })
  }

  useEffect(() => {
    if (
      user?.user_type_id === UserTypes.company ||
      user?.user_type_id === UserTypes.employee ||
      user?.user_type_id === UserTypes.patient ||
      user?.user_type_id === UserTypes.contactPerson ||
      user?.user_type_id === UserTypes.caretaker ||
      user?.user_type_id === UserTypes.familyMember
    ) {
      if (licenseStat === 'active') {
        const res = setInterval(() => {
          preload()
        }, 900000)
        return () => clearInterval(res)
      } else {
        setTimeout(() => {
          dispatch(handleLogout(history))
        }, 400)
      }
    }
  }, [user, licenseStat, UserTypes])

  useEffect(() => {
    storageCheck()
  }, [x])

  return (
    <Fragment>
      <TermsModal />
      <Birthday />
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
        {/* <span className="text-dark fw-bold">{time}</span> */}
      </div>
      <StorageBar
        totalStorage={currentStorage?.total_storage}
        usedStorage={currentStorage?.used_storage}
      />
      <NavbarUser skin={skin} setSkin={setSkin} />
      {/* <IntlDropdown /> */}
    </Fragment>
  )
}

export default ThemeNavbar
