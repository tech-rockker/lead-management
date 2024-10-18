// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'

// ** Custom Components
import UILoader from '@components/ui-loader'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams, useLocation } from 'react-router-dom'
// ** Reactstrap Imports
import { Row, Col, Button, ButtonGroup, Card, CardBody } from 'reactstrap'
// ** Styles
import '@styles/react/pages/page-profile.scss'
import { FM, isValid, log } from '../../utility/helpers/common'
import FinalProfileView from './Views/Index'
import Header from '../header'
import BsTooltip from '../components/tooltip'
import { PenTool, Plus } from 'react-feather'
import ProfileUpdateModal from './Views/ProfileUpdateModal'
import { useSelector } from 'react-redux'
import { viewUser } from '../../utility/apis/userManagement'
import { decryptObject, jsonDecodeAll } from '../../utility/Utils'
import { forDecryption, userFields } from '../../utility/Const'
const Profile = () => {
  const params = useParams()
  const id = params?.id
  // ** States
  const [tempData, setTempData] = useState([])
  const [block, setBlock] = useState(false)
  const [step, setStep] = useState('1')
  const [loading, setLoadingDetails] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(e)
    }
  }
  const handleBlock = () => {
    setBlock(true)
    setTimeout(() => {
      setBlock(false)
    }, 2000)
  }

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewUser({
        id,
        loading: setLoadingDetails,
        success: (d) => {
          const s = {
            ...d,
            country_id: d?.country?.id ?? '',
            patient_type_id: typeof d?.patient_type_id === 'object' ? d?.patient_type_id : [],
            ...d?.patient_information,
            ...d?.patient_information?.patient_id
          }
          const valuesTemp = jsonDecodeAll(userFields, s)
          const values = { ...valuesTemp, ...decryptObject(forDecryption, valuesTemp) }

          setTempData(values)
        }
      })
    }
  }

  useEffect(() => {
    loadDetails(id)
  }, [])

  return (
    <Fragment>
      <ProfileUpdateModal
        showModal={showAdd}
        reloadDetails={() => {
          loadDetails(id)
        }}
        setShowModal={handleClose}
        edit={tempData}
      />
      <Header title={FM('profile')}>
        <ButtonGroup color='dark' className='me-2'>
          <Button.Ripple size='sm' color='primary' onClick={() => setShowAdd(true)}>
            <PenTool size='14' className='align-middle' /> {FM('update-profile')}
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      {tempData !== null ? (
        <div id='user-profile'>
          <FinalProfileView step={step} user={tempData} />
        </div>
      ) : null}
    </Fragment>
  )
}

export default Profile
