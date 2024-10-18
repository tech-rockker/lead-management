import React, { useEffect, useState } from 'react'
import { isUserLoggedIn } from '../Utils'

const useRole = () => {
  const [role, setRole] = useState()
  const user = isUserLoggedIn()

  useEffect(() => {
    if (user) {
      try {
        const u = JSON.parse(user)
        setRole(String(u.role).toLocaleLowerCase())
        // console.log(u)
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  return role
}

export default useRole
