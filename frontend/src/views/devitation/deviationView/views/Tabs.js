import React from 'react'
import { Airplay, GitMerge, User } from 'react-feather'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FM, isValid } from '../../../../utility/helpers/common'
import Show from '../../../../utility/Show'
import Branch from './tabs/branch'
import DevDetail from './tabs/DevDetail'
import Investigation from './tabs/Investigation'

const Tabs = ({ active, toggleTab, edit }) => {
  return (
    <div className='white p-25 shadow p-2'>
      <Nav pills className='mb-2  flex-column flex-sm-row'>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'> {FM('info')} </span>
          </NavLink>
        </NavItem>
        {/* <NavItem>
                    <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
                        <GitMerge className='font-medium-3 me-50' />
                        <span className='fw-bold'> {FM("branch")} </span>
                    </NavLink>
                </NavItem> */}
        <Show IF={isValid(edit?.further_investigation)}>
          <NavItem>
            <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
              <Airplay className='font-medium-3 me-50' />
              <span className='fw-bold'> {FM('investigation')} </span>
            </NavLink>
          </NavItem>
        </Show>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <DevDetail edit={edit} />
        </TabPane>
        {/* <TabPane tabId='2'>
                    <Branch edit={edit} />
                </TabPane> */}
        <TabPane tabId='3'>
          <Investigation edit={edit} />
        </TabPane>
      </TabContent>
    </div>
  )
}

export default Tabs
