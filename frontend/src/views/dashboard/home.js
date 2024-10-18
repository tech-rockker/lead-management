import React from 'react'
import { UserTypes } from '../../utility/Const'
import useUserType from '../../utility/hooks/useUserType'
import AdminHome from './fragments/AdminHome'
import CompanyHome from './fragments/CompanyHome'
import EmployeeHome from './fragments/EmployeeHome'
import PatientHome from './fragments/PatientHome'

const home = () => {
  const userType = useUserType()

  if (userType === UserTypes.admin) {
    return <AdminHome />
  } else if (userType === UserTypes.company || userType === UserTypes.branch) {
    return <CompanyHome />
  } else if (
    userType === UserTypes.patient ||
    userType === UserTypes.caretaker ||
    userType === UserTypes.contactPerson ||
    userType === UserTypes.familyMember ||
    userType === UserTypes.careTakerFamily ||
    userType === UserTypes.guardian ||
    userType === UserTypes.other
  ) {
    return <PatientHome />
  } else if (userType === UserTypes.employee) {
    return <EmployeeHome />
  } else if (userType === UserTypes.adminEmployee) {
    return <AdminHome />
  } else return null
}

export default home
