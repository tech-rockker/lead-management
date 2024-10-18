import { QuestionAnswerOutlined, Rotate90DegreesCcw } from '@material-ui/icons'
import { useState } from 'react'
import { Folder, Info, User } from 'react-feather'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FM, isValid } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import UserInfoTab from '../../../userManagement/patient/patientViews/view/Tabs/Info'
import IpDetailsTab from '../../ip/fragment/Tabs'
import Files from './Files'
import InfoTab from './InfoTab'
import QuestionsTab from './QuestionsTab'

const FollowUpTabs = ({ step = 1, vertical = false, followup, cashier, user }) => {
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
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <Rotate90DegreesCcw className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('plan')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <Folder className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('docs')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <QuestionAnswerOutlined className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('questions')}</span>
          </NavLink>
        </NavItem>
        <Show IF={isValid(user)}>
          <NavItem>
            <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
              <User className='font-medium-3 me-50' />
              <span className='fw-bold'>{FM('patient')}</span>
            </NavLink>
          </NavItem>
        </Show>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <InfoTab followup={followup} />
        </TabPane>
        <TabPane tabId='2'>
          <IpDetailsTab open vertical hideUserInfo ipId={followup?.ip_id} />
        </TabPane>
        <TabPane tabId='3'>
          <Files followup={followup} />
        </TabPane>
        <TabPane tabId='4'>
          <QuestionsTab followup={followup} />
        </TabPane>
        <TabPane tabId='5'>
          <UserInfoTab user={user} />
        </TabPane>
      </TabContent>
    </div>
  )
}

export default FollowUpTabs
