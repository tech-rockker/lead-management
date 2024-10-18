import React, { useEffect, useState } from 'react'
import { Col, Row } from 'reactstrap'
import Shimmer from '../../components/shimmers/Shimmer'
// import UserInfoCard from './activityView/views/UserInfoCard'
import { viewActivity } from '../../../utility/apis/activity'
import { forDecryption } from '../../../utility/Const'
import { isValid } from '../../../utility/helpers/common'
import { decryptObject, jsonDecodeAll } from '../../../utility/Utils'
import UserInfoCard from '../../userManagement/patient/patientViews/view/UserInfoCard'
import Tabs from './views/Tabs'

const ActivityView = ({ step = '1', id = null }) => {
  const [user, setUser] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [edit, setEditData] = useState(null)

  const [active, setActive] = useState(step)

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  // form data
  const formFields = {
    ip_id: '',
    patient_id: '',
    category_id: '',
    subcategory_id: '',
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    is_repeat: '',
    every: '',
    repetition_type: '',
    week_days: 'json',
    month_day: '',
    end_date: '',
    end_time: '',
    address_url: '',
    video_url: '',
    information_url: '',
    file: '',
    remind_before_start: '',
    before_minutes: '',
    before_is_text_notify: '',
    before_is_push_notify: '',
    remind_after_end: '',
    after_minutes: '',
    after_is_text_notify: '',
    after_is_push_notify: '',
    is_emergency: '',
    emergency_minutes: '',
    emergency_is_text_notify: '',
    emergency_is_push_notify: '',
    in_time: '',
    in_time_is_text_notify: '',
    in_time_is_push_notify: '',
    employees: '',
    how_many_time_array: 'json',
    task: {
      type_id: '',
      title: '',
      parent_id: '',
      description: '',
      start_date: '',
      start_time: '',
      is_repeat: '',
      every: '',
      repetition_type: '',
      week_days: 'json',
      month_day: '',
      end_date: '',
      end_time: '',
      employees: ''
    }
  }

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewActivity({
        id,
        loading: setLoadingDetails,
        success: (a) => {
          const d = {
            ...a
          }
          const valuesT = jsonDecodeAll(formFields, d)
          const values = {
            ...valuesT,
            assign_employee: valuesT?.assign_employee?.map((a) => ({
              ...a,
              employee: decryptObject(forDecryption, a?.employee)
            }))
          }
          setEditData(values)
        }
      })
    }
  }
  useEffect(() => {
    loadDetails(id)
  }, [id])

  return (
    <>
      {loadingDetails ? (
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
              <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                <UserInfoCard userId={edit?.patient_id} setUserData={setUser} />
              </Col>
              <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
                <Tabs user={user} edit={edit} active={active} toggleTab={toggleTab} comments={[]} />
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  )
}

export default ActivityView
