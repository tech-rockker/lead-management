import {
  QuestionAnswer,
  QuestionAnswerOutlined,
  ReceiptOutlined,
  Rotate90DegreesCcw
} from '@material-ui/icons'
import React, { useState } from 'react'
import { Folder, Info, User } from 'react-feather'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import InfoTab from './Tabs/InfoTab'
import { FM, isValidArray, log } from '../../../../utility/helpers/common'
import LeaveTab from './ScheduleLeaveTab'
import Show from '../../../../utility/Show'

const ScheduleTabs = ({ step = '1', vertical = false, followup, cashier, user }) => {
  const [active, setActive] = useState(step)

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <div className={`white p-25 shadow ${vertical ? 'nav-vertical' : ''}`}>
      <Nav pills className={`mb-2 ${vertical ? 'nav-left' : 'flex-column flex-sm-row '}`}>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <Info className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('info')}</span>
          </NavLink>
        </NavItem>
        <Show IF={isValidArray(followup?.leave_assigned_to)}>
          <NavItem>
            <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
              <Info className='font-medium-3 me-50' />
              <span className='fw-bold'>{FM('assigned-employee')}</span>
            </NavLink>
          </NavItem>
        </Show>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <InfoTab followup={followup} />
        </TabPane>
        <TabPane tabId='2'>
          <LeaveTab followup={followup} />
        </TabPane>
      </TabContent>
    </div>
  )
}

export default ScheduleTabs
