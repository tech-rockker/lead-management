import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isValid, log } from '../helpers/common'

const useLicence = () => {
  const user = useSelector((s) => s.auth?.userData)
  const [licence, setLicence] = useState(null)

  useEffect(() => {
    if (isValid(user)) {
      setLicence(user?.licence_status)
    }
  }, [user])

  return licence
}

export default useLicence
