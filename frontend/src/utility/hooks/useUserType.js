import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isValid } from '../helpers/common'

const useUserType = () => {
  const user = useSelector((s) => s.auth?.userData)
  const [t, setT] = useState(null)

  useEffect(() => {
    if (isValid(user)) {
      setT(user?.user_type_id)
    }
  }, [user])

  return t
}

export default useUserType
