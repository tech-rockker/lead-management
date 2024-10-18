// ** React Imports
import { Receipt, ReceiptOutlined, Rotate90DegreesCcw, WarningOutlined } from '@material-ui/icons'
// ** Icons Imports
import {
  Activity,
  Bookmark,
  Clock,
  FileText,
  Flag,
  Folder,
  Target,
  TrendingUp,
  User,
  UserPlus
} from 'react-feather'
// ** Reactstrap Imports
import { Col, Nav, NavItem, NavLink, TabContent, TabPane, Row } from 'reactstrap'
import { FM, isValid, isValidArray, log } from '../../../../../utility/helpers/common'
import ActivityTab from './Tabs/Activity'
import Cashier from './Tabs/cashier'
import DeviationTab from './Tabs/DeviationTab'
import DocsTab from './Tabs/Docs'
import UserInfoTab from './Tabs/Info'
import IpTab from './Tabs/Ip'
import JournalTabs from './Tabs/JournalTabs'
import TaskTab from './Tabs/Task'
import Stats from '../../../../stats'
import useModules from '../../../../../utility/hooks/useModules'
import Show from '../../../../../utility/Show'
import DeductionHours from './Tabs/DeductionHours'
import Hide from '../../../../../utility/Hide'
import { companyTypes } from '../../../../../utility/Const'
import AssignedEmployee from './Tabs/assignedEmployee'
const UserTabs = ({ vertical = false, user, active, toggleTab, cashier }) => {
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()

  return (
    <div className={`white p-25 shadow ${vertical ? 'nav-vertical' : ''}`}>
      <Nav pills className={`mb-2 ${vertical ? 'nav-left' : 'flex-column flex-sm-row '}`}>
        <NavItem>
          <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
            <User className='font-medium-3  me-50' />
            <span className='fw-bold'>{FM('info')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '6'} onClick={() => toggleTab('6')}>
            <Rotate90DegreesCcw className='font-medium-3  me-50' />
            <span className='fw-bold'>{FM('plans')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <Activity className='font-medium-3 me-50 ' />
            <span className='fw-bold'> {FM('activity')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <Target className='font-medium-3  me-50' />
            <span className='fw-bold'>{FM('task')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <FileText className='font-medium-3  me-50' />
            <span className='fw-bold'> {FM('journals')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
            <Flag className='font-medium-3  me-50' />
            <span className='fw-bold'>{FM('deviation')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '7'} onClick={() => toggleTab('7')}>
            <Folder className='font-medium-3  me-50' />
            <span className='fw-bold'>{FM('docs')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '8'} onClick={() => toggleTab('8')}>
            <ReceiptOutlined className='font-medium-3  me-50' />
            <span className='fw-bold'>{FM('cashier')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '9'} onClick={() => toggleTab('9')}>
            <TrendingUp className='font-medium-3  me-50' />
            <span className='fw-bold'>{FM('stats')}</span>
          </NavLink>
        </NavItem>
        <Hide
          IF={
            isValidArray(user?.company_type_id) && user?.company_type_id[0] === companyTypes.group
          }
        >
          <NavItem>
            <NavLink active={active === '10'} onClick={() => toggleTab('10')}>
              <Clock className='font-medium-3  me-50' />
              <span className='fw-bold'>{FM('hours')}</span>
            </NavLink>
          </NavItem>
        </Hide>
        {isValidArray(user?.patient_employees) ? (
          <NavItem>
            <NavLink active={active === '11'} onClick={() => toggleTab('11')}>
              <TrendingUp className='font-medium-3  me-50' />
              <span className='fw-bold'>{FM('assigned-employee')}</span>
            </NavLink>
          </NavItem>
        ) : null}
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <UserInfoTab user={user} hours={user} />
        </TabPane>

        <TabPane tabId='2'>
          <ActivityTab user={user} />
        </TabPane>

        <TabPane tabId='6'>
          <IpTab user={user} />
        </TabPane>
        <TabPane tabId='8'>
          <Cashier checkId key={`${user?.id}-cad`} user={user} />
        </TabPane>
        <TabPane tabId='3'>
          <TaskTab user={user} />
        </TabPane>
        <TabPane tabId='7'>
          <DocsTab user={user} />
        </TabPane>
        <TabPane tabId='4'>
          <JournalTabs user={user} />
        </TabPane>

        <TabPane tabId='5'>
          <DeviationTab user={user} />
        </TabPane>
        <TabPane tabId='9'>
          <Stats user={user} />
        </TabPane>
        <TabPane tabId='10'>
          <DeductionHours user={user} />
        </TabPane>
        <TabPane tabId='11'>
          <AssignedEmployee user={user} />
        </TabPane>
      </TabContent>
    </div>
  )
}
export default UserTabs
