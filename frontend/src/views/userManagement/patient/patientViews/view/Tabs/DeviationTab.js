/* eslint-disable no-unneeded-ternary */
import React from 'react'
import { Container } from 'reactstrap'
import Hide from '../../../../../../utility/Hide'
import useModules from '../../../../../../utility/hooks/useModules'
import Show from '../../../../../../utility/Show'
import NoActiveModule from '../../../../../components/NoModule'
import BasicTimelines from '../../../../../devitation/BasicTimeline'

const DeviationTab = ({ user }) => {
  const { ViewJournal, ViewActivity, ViewDeviation, ViewSchedule } = useModules()

  return (
    <>
      <Container>
        <Show IF={ViewDeviation}>
          <BasicTimelines dUser={user ? true : false} user={user} />
        </Show>
        <Hide IF={ViewDeviation}>
          <NoActiveModule module='deviation' />
        </Hide>
      </Container>
    </>
  )
}

export default DeviationTab
