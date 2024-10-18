import React, { useEffect, useState } from 'react'
import { Col, Row } from 'reactstrap'
import { assignedBranchToEmp } from '../../../../utility/apis/userManagement'
import { forDecryption } from '../../../../utility/Const'
import { FM, isValid, isValidArray } from '../../../../utility/helpers/common'
import { decryptObject } from '../../../../utility/Utils'

const AssignedEmployee = ({ edit }) => {
  const [branchEmp, setBranchEmp] = useState(null)

  const AssignedBranches = () => {
    if (isValid(edit?.id)) {
      assignedBranchToEmp({
        jsonData: {
          branch_id: edit?.id
        },
        success: (e) => {
          if (isValidArray(e?.payload)) {
            const data = e?.payload?.map((d) => {
              return { ...d, employee: decryptObject(forDecryption, d?.employee) }
            })
            setBranchEmp(data)
          }
        }
      })
    }
  }

  useEffect(() => {
    AssignedBranches()
  }, [edit])

  const [activeTab, setActiveTab] = useState(false)
  const toggleTab = () => {
    setActiveTab(!activeTab)
  }

  const render = () => {
    const re = []
    branchEmp?.map((d, i) => {
      re.push(
        <>
          <Row className='p-1' key={`te-${i}`}>
            <Col md='4'>
              <div className='mb-0' key={i}>
                <div className='h5 text-dark fw-bolder'>{FM('name')}</div>
                <p className=''> {d?.employee?.name ?? 'N/A'} </p>
              </div>
            </Col>
            <Col md='4'>
              <div className='mb-0' key={i}>
                <div className='h5 text-dark fw-bolder'>{FM('email')}</div>
                <p className=''> {d?.employee?.email ?? 'N/A'} </p>
              </div>
            </Col>
          </Row>
        </>
      )
    })
    return re
  }
  return render()
}

export default AssignedEmployee
