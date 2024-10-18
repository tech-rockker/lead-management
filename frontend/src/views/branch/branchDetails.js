import '@styles/react/apps/app-users.scss'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { log } from '../../utility/helpers/common'
import Shimmer from '../components/shimmers/Shimmer'
import Tab from './View/tabs/Tab'
import UserInfo from './View/UserInfo'

const BranchDetail = ({ edit }) => {
  const dispatch = useDispatch()
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue
  } = form
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState('1')

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  log('com', edit)
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
              <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                <UserInfo edit={edit} loadingDetails={loading} />
              </Col>
              <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
                <Tab edit={edit} loadingDetails={loading} active={active} toggleTab={toggleTab} />
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  )
}
export default BranchDetail
