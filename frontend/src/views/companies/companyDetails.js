// // ** Third Party Components
// ** Custom Components
import '@styles/react/apps/app-users.scss'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
// ** Third Party Components
import { Col, Row } from 'reactstrap'
import { viewComp } from '../../utility/apis/companyApis'
import { forDecryption } from '../../utility/Const'
import { isValid } from '../../utility/helpers/common'
import { decryptObject, jsonDecodeAll } from '../../utility/Utils'
import Shimmer from '../components/shimmers/Shimmer'
import Tab from './View/tabs/Tab'
import UserInfo from './View/UserInfo'
const DetailsCard = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const [companyData, setCompanyData] = useState(null)
  const id = parseInt(params.id)
  const [active, setActive] = useState('1')

  // form data
  const formFields = {
    avatar: '',
    user_type_id: '',
    role_id: '',
    company_type_id: 'json',
    name: '',
    email: '',
    contact_number: '',
    gender: '',
    personal_number: '',
    organization_number: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    contact_person_number: '',
    country_id: '',
    zipcode: '',
    city: '',
    postal_code: '',
    full_address: '',
    licence_key: '',
    licence_end_date: '',
    is_substitute: '',
    is_regular: '',
    is_seasonal: '',
    joining_date: '',
    establishment_date: '',
    user_color: '',
    is_file_required: '',
    package_id: '',
    modules: 'json',
    documents: 'json',
    postal_area: '',
    status: '',
    company_name: '',
    company_email: ''
  }

  const loadDetails = () => {
    viewComp({
      id,
      loading: setLoading,
      success: setCompanyData,
      success: (d) => {
        const valuesTemp = jsonDecodeAll(formFields, d)
        const values = { ...valuesTemp, ...decryptObject(forDecryption, valuesTemp) }
        setCompanyData(values)
        // setValues(formFields, values, setValue, modifyField)
      }
    })
  }

  useEffect(() => {
    if (!isValid(companyData)) {
      loadDetails()
    }
  }, [])

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <>
      {loading ? (
        <>
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />

          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
          <Shimmer style={{ height: 25, marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '90%', marginBottom: 4, borderRadius: 2 }} />
          <Shimmer style={{ height: 20, width: '50%', marginBottom: 25, borderRadius: 2 }} />
        </>
      ) : (
        <>
          <div className='app-edit-view'>
            <Row>
              <Col xl='4' lg='4' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                <UserInfo edit={companyData} />
              </Col>
              <Col xl='8' lg='8' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
                <Tab edit={companyData} active={active} toggleTab={toggleTab} />
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  )
}

export default DetailsCard
