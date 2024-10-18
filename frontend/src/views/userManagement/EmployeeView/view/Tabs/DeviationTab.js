import React from 'react'
import BasicTimelines from '../../../../devitation/BasicTimeline'

const DeviationTab = ({ user }) => {
  return (
    <>
      <BasicTimelines user={user} noFilter noHeader />
    </>
  )
}

export default DeviationTab
