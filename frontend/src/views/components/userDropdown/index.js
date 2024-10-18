import React, { useEffect } from 'react'
import { userLoadDropdown } from '../../../redux/reducers/userManagement'
import { useRedux } from '../../../redux/useRedux'
import { loadUser } from '../../../utility/apis/userManagement'
import { log } from '../../../utility/helpers/common'
import { createAsyncSelectOptions } from '../../../utility/Utils'

const UserDropdown = async ({ search, page, user_type_id }) => {
  const {
    reduxStates: {
      userManagement: { userDropdown }
    },
    dispatch
  } = useRedux()
  log('called me')
  useEffect(() => {
    log('load')
    loadUser({
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id },
      success: (data) => {
        dispatch(userLoadDropdown({ ...data?.payload }))
      }
    })
  }, [search, page, user_type_id])

  const send = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userDropdown?.options?.length > 0) {
          resolve(userDropdown)
        } else {
          reject(userDropdown)
        }
      }, 5000)
    })
  }

  try {
    return send()
  } catch (error) {
    log(error)
  }
}

export default UserDropdown
