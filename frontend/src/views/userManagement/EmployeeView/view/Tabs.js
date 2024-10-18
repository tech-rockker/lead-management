// ** React Imports
import { Receipt, ReceiptOutlined, WarningOutlined } from '@material-ui/icons'
// ** Icons Imports
import { Activity, Bookmark, FileText, Flag, Folder, User, UserPlus } from 'react-feather'
// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FM, isValidArray } from '../../../../utility/helpers/common'
import ActivityTab from './Tabs/Activity'
import AssignedBranch from './Tabs/assignedBranch'
import AssignedPatient from './Tabs/assignedPatient'
import Cashier from './Tabs/cashier'
import DeviationTab from './Tabs/DeviationTab'
import DocsTab from './Tabs/Docs'
import UserInfoTab from './Tabs/Info'
import IpTab from './Tabs/Ip'
import JournalTabs from './Tabs/JournalTabs'
import TaskTab from './Tabs/Task'

const UserTabs = ({ vertical = false, user, active, toggleTab, cashier }) => {
  return (
    <div className={`white p-25 shadow ${vertical ? 'nav-vertical' : ''}`}>
      <Nav pills className={`mb-2 ${vertical ? 'nav-left' : 'flex-column flex-sm-row '}`}>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <User className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('info')}</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink active={active === '7'} onClick={() => toggleTab('7')}>
            <Folder className='font-medium-3 me-50' />
            <span className='fw-bold'>{FM('docs')}</span>
          </NavLink>
        </NavItem>
        {isValidArray(user?.employee_patients) ? (
          <NavItem>
            <NavLink active={active === '12'} onClick={() => toggleTab('12')}>
              <ReceiptOutlined className='font-medium-3 me-50' />
              <span className='fw-bold'>{FM('assigned-patient')}</span>
            </NavLink>
          </NavItem>
        ) : null}
        {isValidArray(user?.employee_branches) ? (
          <NavItem>
            <NavLink active={active === '13'} onClick={() => toggleTab('13')}>
              <ReceiptOutlined className='font-medium-3 me-50' />
              <span className='fw-bold'>{FM('assigned-branch')}</span>
            </NavLink>
          </NavItem>
        ) : null}
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <UserInfoTab user={user} />
        </TabPane>
        <TabPane tabId='7'>
          <DocsTab user={user} />
        </TabPane>
        <TabPane tabId='12'>
          <AssignedPatient user={user} />
        </TabPane>
        <TabPane tabId='13'>
          <AssignedBranch user={user} />
        </TabPane>
      </TabContent>
    </div>
  )
}
export default UserTabs
