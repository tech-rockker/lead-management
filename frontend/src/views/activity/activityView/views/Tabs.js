import React from 'react'
import { FileText, Folder, Info, User, Users } from 'react-feather'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FM, isValid } from '../../../../utility/helpers/common'
import Hide from '../../../../utility/Hide'
import Show from '../../../../utility/Show'
import UserInfoTab from '../../../userManagement/patient/patientViews/view/Tabs/Info'
import ActivityDetail from './tabs/ActivityDetail'
import Employee from './tabs/Employee'
import Files from './tabs/Files'
import Ip from './tabs/Ip'

const Tabs = ({ active, toggleTab, user, edit, comments }) => {
  return (
    <div className='white p-25 shadow p-25'>
      <Nav pills className='mb-2  flex-column flex-sm-row'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <Info className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('info')} </span>
          </NavLink>
        </NavItem>
        <Hide IF={edit?.assign_employee?.length <= 0}>
          <NavItem>
            <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
              <Users className='font-medium-3 me-50' />
              <span className='fw-bold'> {FM('assigned-to')} </span>
            </NavLink>
          </NavItem>
        </Hide>
        <Show IF={isValid(edit?.ip_id)}>
          <NavItem>
            <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
              <FileText className='font-medium-3 me-50' />
              <span className='fw-bold'> {FM('iP')} </span>
            </NavLink>
          </NavItem>
        </Show>
        {/* <NavItem>
            <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
                <ReceiptOutlined className='font-medium-3 me-50' />
                <span className='fw-bold'> {FM("assign-by-employee")} </span>
            </NavLink>
        </NavItem> */}

        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('patient')} </span>
          </NavLink>
        </NavItem>
        <NavItem>
          {/* <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
                <Activity className='font-medium-3 me-50' />
                <span className='fw-bold'> {FM("comment-&-replies")} </span>
            </NavLink>
        </NavItem>
        <NavItem>
            <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
                <Bookmark className='font-medium-3 me-50' />
                <span className='fw-bold'>Journal</span>
            </NavLink>
        </NavItem>
        <NavItem>
            <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
                <WarningOutlined className='font-medium-3 me-50' />
                <span className='fw-bold'>Deviation</span>
            </NavLink>
        </NavItem>
        <NavItem> */}
          {/* <NavLink active={active === '7'} onClick={() => toggleTab('7')}>
                        <Folder className='font-medium-3 me-50' />
                        <span className='fw-bold'>{FM("docs")}</span>
                    </NavLink> */}
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <ActivityDetail edit={edit} comments={comments} />
        </TabPane>
        <TabPane tabId='2'>
          <Ip edit={edit} />
        </TabPane>
        <Hide IF={edit?.assign_employee?.length <= 0}>
          <TabPane tabId='3'>
            <Employee edit={edit} />
          </TabPane>
        </Hide>
        {/* <TabPane tabId='7'>
                    <Files edit={edit} />
                </TabPane> */}
        <TabPane tabId='4'>
          <UserInfoTab user={user} />
        </TabPane>
      </TabContent>
    </div>
  )
}

export default Tabs
