import BasicTimeline from './BasicTimeline'
// ** Custom Components
import Hide from '../../../utility/Hide'
import useModules from '../../../utility/hooks/useModules'
import Show from '../../../utility/Show'
import NoActiveModule from '../../components/NoModule'

const Timeline = () => {
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()
  return (
    <>
      <Show IF={ViewActivity}>
        <BasicTimeline />
      </Show>
      <Hide IF={ViewActivity}>
        <NoActiveModule module='activity' />
      </Hide>
    </>
  )
}

export default Timeline
