/* eslint-disable no-unneeded-ternary */
import React from 'react'
import { Container } from 'reactstrap'
import Hide from '../../../../../../utility/Hide'
import useModules from '../../../../../../utility/hooks/useModules'
import Show from '../../../../../../utility/Show'
import NoActiveModule from '../../../../../components/NoModule'
import Journal from '../../../../../Journal/Journal'
import Basic from '../../../../../Journal/journalLineCard/Basic'

const JournalTabs = ({ user }) => {
  const { ViewJournal, ViewActivity, ViewDeviation, ViewSchedule } = useModules()

  return (
    <>
      <Container>
        <Show IF={ViewJournal}>
          <Basic dUser={user ? true : false} user={user?.id} />
        </Show>
        <Hide IF={ViewJournal}>
          <NoActiveModule module='journal' />
        </Hide>
      </Container>
    </>
  )
}

export default JournalTabs
