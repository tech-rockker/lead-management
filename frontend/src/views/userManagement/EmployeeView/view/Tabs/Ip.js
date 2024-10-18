import React, { useEffect, useState } from 'react'
import ImplementationPlan from '../../../../masters/ip'

const IpTab = ({ user }) => {
  return (
    <>
      <ImplementationPlan user={user} />
    </>
  )
}

export default IpTab
