import React, { useState } from 'react'
import { Col, Row } from 'reactstrap'
import Shimmer from '../../components/shimmers/Shimmer'
import Tab from './view/tabs/Tab'
import UserInfo from './view/UserInfo'

const TaskView = ({
  step = 1,
  activity = null,
  activityForEmp = null,
  setDisplay = () => {},
  loadingDetails = false,
  resLabel = null,
  ipRes = null,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  const [active, setActive] = useState(step)

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
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
              {/* <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
                                <UserInfo edit={edit?.type_id} loadingDetails={loadingDetails} />
                            </Col> */}
              <Col xl='12' lg='12' xs={{ order: 1 }} md={{ order: 0, size: 11 }}>
                <Tab
                  edit={edit}
                  loadingDetails={loadingDetails}
                  active={active}
                  toggleTab={toggleTab}
                />
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  )
}

export default TaskView
