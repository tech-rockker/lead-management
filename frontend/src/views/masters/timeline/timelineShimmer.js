import React from 'react'
import { Card } from 'reactstrap'
import Shimmer from '../../components/shimmers/Shimmer'

const TimelineShimmer = () => {
  return (
    <Card className='shadow shimmer'>
      <Shimmer
        style={{ width: '100%', height: 50, marginBottom: 5, borderRadius: '0px 20px 0px 0px' }}
      />
      <Shimmer style={{ width: '100%', height: 150, marginBottom: 5 }} />
      <Shimmer style={{ width: '100%', height: 50, borderRadius: '0px 0px 0px 20px' }} />
    </Card>
  )
}

export default TimelineShimmer
