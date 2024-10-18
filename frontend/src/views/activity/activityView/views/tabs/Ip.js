import React from 'react'
import { Col, Row } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'
import IpDetailsTab from '../../../../masters/ip/fragment/Tabs'

const Ip = ({ edit }) => {
  return (
    <>
      <IpDetailsTab vertical open={true} hideUserInfo ipId={edit?.ip_id} />
    </>
  )
}

export default Ip
