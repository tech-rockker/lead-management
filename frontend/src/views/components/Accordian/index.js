import React, { useState, useEffect } from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap'
import './style.scss'
import FormGroupCustom from '../formGroupCustom'
import { decrypt } from '../../../utility/Utils'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import useUser from '../../../utility/hooks/useUser'
import Hide from '../../../utility/Hide'
const Accordian = ({
  userData,
  fileData,
  setValue = null,
  control = null,
  watch,
  setSelectedEmployees,
  selectedEmployees
  // setAllEmployees = null
}) => {
  const user = useUser()
  const [open, setOpen] = useState('')
  const [selectAllEmployees, setSelectAllEmployees] = useState(false)

  useEffect(() => {
    if (fileData?.signing_files?.length > 0) {
      const signingEmp = fileData?.signing_files.map(
        (fileSignEmployee) => fileSignEmployee.employee_id
      )
      setSelectedEmployees(signingEmp)
    } else if (fileData?.view_only_admin_files?.length > 0) {
      const viewEmp = fileData?.view_only_admin_files.map(
        (fileViewEmployee) => fileViewEmployee.employee_id
      )
      setSelectedEmployees(viewEmp)
    }
  }, [fileData?.signing_files, fileData?.view_only_admin_files, setSelectedEmployees])

  const toggle = (id) => {
    open === id ? setOpen('') : setOpen(id)
  }

  const handleEmployeeCheckboxChange = (employeeId) => {
    setSelectedEmployees((prevSelected) => {
      if (prevSelected.includes(employeeId)) {
        // Unchecking the employee, so remove the employeeId
        return prevSelected.filter((id) => id !== employeeId)
      } else {
        // Checking the employee, add the employeeId
        return [...prevSelected, employeeId]
      }
    })
  }
  const handleBranchCheckboxChange = () => {
    if (selectAllEmployees) {
      setSelectedEmployees([]) // Unchecking the branch, so clear the selected employees
    } else {
      const branchEmployeeIds = userData.employees
        .filter((employee) => employee.id !== user.id)
        .map((employee) => employee.id)
      setSelectedEmployees([...selectedEmployees, ...branchEmployeeIds]) // Checking the branch, add the employee IDs
    }
    setSelectAllEmployees(!selectAllEmployees) // Toggle the branch checkbox
  }

  return (
    <Accordion className={`accordion-border ${open ? 'open' : ''}`} open={open} toggle={toggle}>
      <AccordionItem className='accordion-item'>
        <AccordionHeader targetId='1' className='accordion-title'>
          <label className='checkbox-label'>
            <FormGroupCustom
              name={'employee_list'}
              type={'checkbox'}
              label={userData?.branch?.branch_name}
              classNameLabel={'w-100'}
              className='mb-2'
              control={control}
              rules={{ required: false }}
              onChangeValue={(e) => {
                handleBranchCheckboxChange()
              }}
              checked={selectAllEmployees}
              forceValue
              setValue={setValue}
              value={selectedEmployees}
            />
          </label>
        </AccordionHeader>

        <AccordionBody accordionId='1' className='accordion-content'>
          <ul>
            {userData.employees.map((employee) => (
              <Hide IF={employee?.id === user?.id}>
                <li key={employee.id}>
                  <div className='accordian-employee'>
                    <label className='checkbox-label'>
                      <FormGroupCustom
                        name={'employee_list'}
                        type={'checkbox'}
                        label={decrypt(employee.name)}
                        classNameLabel={'w-100'}
                        className='mb-2'
                        control={control}
                        rules={{ required: false }}
                        onChangeValue={(e) => {
                          handleEmployeeCheckboxChange(employee.id)
                        }}
                        checked={selectedEmployees.includes(employee.id)}
                        forceValue
                        setValue={setValue}
                        value={selectedEmployees}
                      />
                    </label>
                  </div>
                </li>
              </Hide>
            ))}
          </ul>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  )
}
export default Accordian
