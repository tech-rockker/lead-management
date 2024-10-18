import { Info, WorkOutline } from '@material-ui/icons'
import React, { useState } from 'react'
import { Award, File, Home, ThumbsUp, User } from 'react-feather'
import { Nav, NavItem, TabContent, TabPane, NavLink } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import UserInfoTab from '../../../../userManagement/patient/patientViews/view/Tabs/Info'
import ConnectedPerson from './conectedPerson'
import DetailsTab from './DetailsTab'
import Files from './Files'
import OverallGoal from './OverallGoal'
import RelatedFactors from './RelatedFactors'
import WorkingTab from './WorkingTab'

const IpTabs = ({ step = '1', vertical = false, data = null, user, hideUserInfo = false }) => {
  const [active, setActive] = useState(step)

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <div className={`white p-25 ${vertical ? 'nav-vertical' : 'shadow'}`}>
      <Nav tabs className={`mb-2 ${vertical ? 'nav-left' : 'flex-column flex-sm-row '}`}>
        <Hide IF={hideUserInfo}>
          <NavItem>
            <NavLink active={active === '6'} onClick={() => toggleTab('6')}>
              <User className='font-medium-3 me-50' />
              <span className='fw-bold'>{FM('patient')}</span>
            </NavLink>
          </NavItem>
        </Hide>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <Home className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('living-area')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <Award className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('ip-overall-goal')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <ThumbsUp className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('ip-related-factors')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <WorkOutline className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('ip-treatment-working')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
            <File className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('decision')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '7'} onClick={() => toggleTab('7')}>
            <File className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('connected-person')}</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <Hide IF={hideUserInfo}>
          <TabPane tabId='6'>
            <UserInfoTab defaultOpen='0' user={user} />
          </TabPane>
        </Hide>
        <TabPane tabId='1'>
          <DetailsTab ip={data} />
        </TabPane>
        <TabPane tabId='2'>
          <OverallGoal ip={data} />
        </TabPane>
        <TabPane tabId='3'>
          <RelatedFactors ip={data} />
        </TabPane>
        <TabPane tabId='4'>
          <WorkingTab ip={data} />
        </TabPane>
        <TabPane tabId='5'>
          <Files ip={data} />
        </TabPane>
        <TabPane tabId='7'>
          <ConnectedPerson ip={data} />
        </TabPane>
      </TabContent>
    </div>
  )
}

export default IpTabs
