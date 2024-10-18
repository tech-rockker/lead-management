import React, { useEffect, useState } from 'react'
import { Modules } from '../Const'
import { isValid } from '../helpers/common'
import useUser from './useUser'

const useModules = () => {
  const user = useUser()
  const [mods, setMods] = useState()

  useEffect(() => {
    if (isValid(user)) {
      setMods({
        schedule: !!user?.assigned_module?.find((a) => a?.module?.name === Modules.schedule),
        deviation: !!user?.assigned_module?.find((a) => a?.module?.name === Modules.deviation),
        journal: !!user?.assigned_module?.find((a) => a?.module?.name === Modules.journal),
        activity: !!user?.assigned_module?.find((a) => a?.module?.name === Modules.activity),
        stampling: !!user?.assigned_module?.find((a) => a?.module?.name === Modules.stampling),
        fileManagement: !!user?.assigned_module?.find(
          (a) => a?.module?.name === Modules.fileManagement
        )
      })
    }
  }, [user])

  return {
    ViewSchedule: mods?.schedule,
    ViewDeviation: mods?.deviation,
    ViewJournal: mods?.journal,
    ViewActivity: mods?.activity,
    ViewStampling: mods?.stampling,
    ViewFileManagement: mods?.fileManagement
  }
}

export default useModules
