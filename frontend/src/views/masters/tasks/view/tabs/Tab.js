import React from 'react'
import {
  Activity,
  FileText,
  Folder,
  Info,
  RefreshCcw,
  StopCircle,
  User,
  UserPlus,
  Users
} from 'react-feather'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { selectCategoryType } from '../../../../../utility/Const'
import { FM } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import Show from '../../../../../utility/Show'
import ActivityDetail from '../../../../activity/activityView/views/tabs/ActivityDetail'
import DevDetail from '../../../../devitation/deviationView/views/tabs/DevDetail'
import UserInfoTab from '../../../../userManagement/patient/patientViews/view/Tabs/Info'
import InfoTab from '../../../followups/Tabs/InfoTab'
import Employee from './Employee'
import FilesTab from './Files'
import Infos from './Infos'

const Tab = ({ active, toggleTab, user, edit, hideUserInfo = false }) => {
  return (
    <div className='white p-25 shadow p-2'>
      <Nav pills className='mb-2  flex-column flex-sm-row'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <Info className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('info')} </span>
          </NavLink>
        </NavItem>
        {/* <NavItem>
                    <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
                        <Folder className='font-medium-3 me-50' />
                        <span className='fw-bold'> Docs </span>
                    </NavLink>
                </NavItem> */}
        <Hide IF={edit?.assign_employee?.length === 0}>
          <NavItem>
            <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
              <Users className='font-medium-3 me-50' />
              <span className='fw-bold'> {FM('assign-employee')} </span>
            </NavLink>
          </NavItem>
        </Hide>

        {/* <Hide IF={edit?.type_id !== selectCategoryType.activity}>
                    <NavItem>
                        <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
                            <Activity className='font-medium-3 me-50' />
                            <span className='fw-bold'> {FM("linked-activity")} </span>
                        </NavLink>
                    </NavItem>
                </Hide>
                <Hide IF={edit?.type_id !== selectCategoryType.implementation}>
                    <NavItem>
                        <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
                            <RefreshCcw className='font-medium-3 me-50' />
                            <span className='fw-bold'> {FM("linked-ip")} </span>
                        </NavLink>
                    </NavItem>
                </Hide>
                <Hide IF={edit?.type_id !== selectCategoryType.followups}>
                    <NavItem>
                        <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
                            <StopCircle className='font-medium-3 me-50' />
                            <span className='fw-bold'> {FM("linked-followup")} </span>
                        </NavLink>
                    </NavItem>
                </Hide>
                <Hide IF={edit?.type_id !== selectCategoryType.patient || edit?.resource_data?.patient === null}>
                    <NavItem>
                        <NavLink active={active === '6'} onClick={() => toggleTab('6')}>
                            <UserPlus className='font-medium-3 me-50' />
                            <span className='fw-bold'> {FM("linked-patient")} </span>
                        </NavLink>
                    </NavItem>
                </Hide>
                <Hide IF={edit?.type_id !== selectCategoryType.deviation}>
                    <NavItem>
                        <NavLink active={active === '7'} onClick={() => toggleTab('7')}>
                            <FileText className='font-medium-3 me-50' />
                            <span className='fw-bold'> {FM("linked-deviation")} </span>
                        </NavLink>
                    </NavItem>
                </Hide> */}
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <Infos edit={edit} />
        </TabPane>
        <TabPane tabId='2'>
          <Employee edit={edit} />
        </TabPane>
        {/* <TabPane tabId='3'>
                    <FilesTab edit={edit} />
                </TabPane> */}
        {/* <TabPane tabId='3'>
                    <ActivityDetail edit={edit?.resource_data?.activity?.id} />
                </TabPane>
                <TabPane tabId='4'>
                    <UserInfoTab defaultOpen="0" hideUserInfo={hideUserInfo} user={edit?.resource_data?.ip?.id} />
                </TabPane>
                <TabPane tabId='5'>
                    <InfoTab followup={edit?.resource_data?.follow_up?.id} />
                </TabPane>
                <TabPane tabId='6'>
                    <UserInfoTab user={edit?.resource_data?.patient?.id} />
                </TabPane>
                <TabPane tabId='7'>
                    <DevDetail edit={edit?.resource_data?.deviation?.id} />
                </TabPane> */}
      </TabContent>
    </div>
  )
}

export default Tab
