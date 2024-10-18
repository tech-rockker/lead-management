// ** React Imports
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useContext } from 'react'
import useUser from '../../../utility/hooks/useUser'
import { UserTypes } from '../../../utility/Const'
import 'react-vertical-timeline-component/style.min.css'
import Hide from '../../../utility/Hide'
import useModules from '../../../utility/hooks/useModules'
import Show from '../../../utility/Show'
import NoActiveModule from '../../components/NoModule'
import UploadFile from './UploadFile'

const TimelineDevitation = () => {
  const { colors } = useContext(ThemeColors)
  const user = useUser()
  const { ViewFileManagement } = useModules()

  return (
    <>
     
        <Show IF={ViewFileManagement || user?.role_id === UserTypes.admin}>
          <UploadFile />
        </Show>
        <Hide IF={ViewFileManagement || user?.role_id === UserTypes.admin}>
          <NoActiveModule module='manage-files' />
        </Hide>
  
    </>
  )
}

export default TimelineDevitation
