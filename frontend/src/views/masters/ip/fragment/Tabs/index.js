import React, { useEffect, useState } from 'react'
import { Col, Row } from 'reactstrap'
import { viewPatientPlan } from '../../../../../utility/apis/ip'
import { forDecryption, ipFields } from '../../../../../utility/Const'
import { isValid } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import Show from '../../../../../utility/Show'
import { decryptObject, jsonDecodeAll } from '../../../../../utility/Utils'
import UserInfoCard from '../../../../userManagement/patient/patientViews/view/UserInfoCard'
import IpTabs from './IpTabs'

const IpDetailsTab = ({
  old = false,
  step = '1',
  vertical = false,
  hideUserInfo = false,
  ipId,
  open = false
}) => {
  const [user, setUser] = useState(null)
  const [editData, setEditData] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(null)

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewPatientPlan({
        id,
        params: { log: old ? 'yes' : 'no' },
        loading: setLoadingDetails,
        success: (d) => {
          const valuesTemp = jsonDecodeAll(ipFields, d)
          const values = {
            ...valuesTemp,
            patient: decryptObject(forDecryption, valuesTemp?.patient),
            employee: decryptObject(forDecryption, valuesTemp?.employee),
            branch: decryptObject(forDecryption, valuesTemp?.branch)
          }
          setEditData(values)
        }
      })
    }
  }

  useEffect(() => {
    if (open) {
      loadDetails(ipId)
    }
  }, [open, ipId])

  return (
    <div className='app-user-view p-1'>
      <Row>
        <Hide IF={hideUserInfo}>
          <Col xl='3' lg='3' xs={{ order: 0 }} md={{ order: 1, size: 4 }}>
            <UserInfoCard setUserData={setUser} userId={editData?.user_id} />
          </Col>
          <Col xl='9' lg='9' xs={{ order: 1 }} md={{ order: 0, size: 7 }}>
            <IpTabs step={step} vertical={vertical} user={user} data={editData} />
          </Col>
        </Hide>
        <Show IF={hideUserInfo}>
          <Col md='12'>
            <IpTabs
              step={step}
              vertical={vertical}
              hideUserInfo={hideUserInfo}
              user={user}
              data={editData}
            />
          </Col>
        </Show>
      </Row>
    </div>
  )
}

export default IpDetailsTab
