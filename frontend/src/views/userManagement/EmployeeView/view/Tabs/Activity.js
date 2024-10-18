import React from 'react'
import { Col, Container, Row } from 'reactstrap'
import BasicTimeline from '../../../../masters/timeline/BasicTimeline'

const ActivityTab = ({ user }) => {
  return (
    <>
      <Container>
        <BasicTimeline
          filters={{
            patient_id: user?.id
          }}
          noFilter
          noHeader
        />
      </Container>
    </>
  )
}

export default ActivityTab
