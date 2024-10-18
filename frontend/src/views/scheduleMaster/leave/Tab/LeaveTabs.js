import {
  QuestionAnswer,
  QuestionAnswerOutlined,
  ReceiptOutlined,
  Rotate90DegreesCcw
} from '@material-ui/icons'
import React, { useState } from 'react'
import { Folder, Info, User } from 'react-feather'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FM, log } from '../../../../utility/helpers/common'
import InfoTab from './Info'
const LeaveTabs = ({ step = '1', vertical = false, leaveItem, cashier, user }) => {
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
      </Nav>

      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <InfoTab leaveItem={leaveItem} />
        </TabPane>
      </TabContent>
    </div>
  )
}

export default LeaveTabs
