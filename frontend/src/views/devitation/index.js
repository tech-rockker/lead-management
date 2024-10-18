// ** React Imports
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext } from 'react'
import 'react-vertical-timeline-component/style.min.css'
import Hide from '../../utility/Hide'
import useModules from '../../utility/hooks/useModules'
import Show from '../../utility/Show'
import NoActiveModule from '../components/NoModule'
import BasicTimelines from './BasicTimeline'

const TimelineDevitation = () => {
  const { colors } = useContext(ThemeColors)
  const { ViewDeviation } = useModules()
  return (
    <>
      <Show IF={ViewDeviation}>
        <BasicTimelines />
      </Show>
      <Hide IF={ViewDeviation}>
        <NoActiveModule module='deviation' />
      </Hide>
    </>
  )
}

export default TimelineDevitation
