import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { isValid } from '../helpers/common'

const usePackage = () => {
  const pack = useSelector((s) => s.pack.pack)
  const [t, setT] = useState(null)

  useEffect(() => {
    if (isValid(pack)) {
      setT(pack)
    }
  }, [pack])

  return t
}

export default usePackage
