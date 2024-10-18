import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isValid } from '../helpers/common'

const useUser = () => {
  const user = useSelector((s) => s.auth?.userData)
  const [t, setT] = useState(null)

  useEffect(() => {
    if (isValid(user)) {
      setT(user)
    }
  }, [user])

  return t
}

export default useUser
