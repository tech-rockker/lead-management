import React from 'react'
import { Activity, Briefcase, User } from 'react-feather'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FM } from '../../../../utility/helpers/common'
import Company from './company'
import Info from './info'
import ChartJS from './stats/chart'

const Tab = ({ active, toggleTab, edit }) => {
  return (
    <div className='white p-25 shadow p-2'>
      <Nav pills className='mb-2  flex-column flex-sm-row'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('info')} </span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <Briefcase className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('subscription')} </span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <Activity className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('statistics')} </span>
          </NavLink>
        </NavItem>

        {/* <NavItem>
                    <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
                        <Activity className='font-medium-3 me-50' />
                        <span className='fw-bold'> {FM("bankid-logs")} </span>
                    </NavLink>
                </NavItem> */}
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <Info edit={edit} />
        </TabPane>
        <TabPane tabId='2'>
          <Company edit={edit} />
        </TabPane>
        <TabPane tabId='3'>
          <ChartJS edit={edit} />
        </TabPane>
        {/* <TabPane tabId='4'>
                    <File edit={edit} />
                </TabPane> */}
      </TabContent>
    </div>
  )
}

export default Tab
