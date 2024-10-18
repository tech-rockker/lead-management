import React from 'react'
import { Col, Container, Row } from 'reactstrap'
import Hide from '../../../../../../utility/Hide'
import useModules from '../../../../../../utility/hooks/useModules'
import Show from '../../../../../../utility/Show'
import NoActiveModule from '../../../../../components/NoModule'
import BasicTimeline from '../../../../../masters/timeline/BasicTimeline'

const ActivityTab = ({ user }) => {
  const { ViewActivity } = useModules()

  return (
    <>
      <Container>
        <Show IF={ViewActivity}>
          <BasicTimeline
            filters={{
              patient_id: user?.id
            }}
            noFilter
            noHeader
            user={user}
          />
        </Show>
        <Hide IF={ViewActivity}>
          <NoActiveModule module='activity' />
        </Hide>
      </Container>
    </>
  )
}

export default ActivityTab
