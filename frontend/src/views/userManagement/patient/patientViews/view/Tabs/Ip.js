import React, { useEffect, useState } from 'react'
import ImplementationPlan from '../../../../../masters/ip'
import IpDetailsTab from '../../../../../masters/ip/fragment/Tabs'

const IpTab = ({ user }) => {
  return (
    <div className='p-2 pt-0'>
      <ImplementationPlan user={user} />
    </div>
  )
}

export default IpTab
