// ** React Imports
import { Receipt, ReceiptOutlined, Rotate90DegreesCcw, WarningOutlined } from '@material-ui/icons'
// ** Icons Imports
import {
  Activity,
  Bookmark,
  DownloadCloud,
  FileText,
  Flag,
  Folder,
  Target,
  TrendingUp,
  User,
  UserPlus
} from 'react-feather'
// ** Reactstrap Imports
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { FM } from '../../../utility/helpers/common'
import ActivityTab from '../../userManagement/patient/patientViews/view/Tabs/Activity'
import Cashier from '../../userManagement/patient/patientViews/view/Tabs/cashier'
import DeviationTab from '../../userManagement/patient/patientViews/view/Tabs/DeviationTab'
import DocsTab from '../../userManagement/patient/patientViews/view/Tabs/Docs'
import Info from './Tabs/Info'
import IpTab from '../../userManagement/patient/patientViews/view/Tabs/Ip'
import JournalTabs from '../../userManagement/patient/patientViews/view/Tabs/JournalTabs'
import TaskTab from '../../userManagement/patient/patientViews/view/Tabs/Task'
import Stats from '../../stats'
import useModules from '../../../utility/hooks/useModules'
import Show from '../../../utility/Show'
import { UserTypes } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
const Tabs = ({ vertical = false, user, active, toggleTab, cashier }) => {
  const { ViewActivity, ViewDeviation, ViewJournal, ViewSchedule } = useModules()

  return (
    <div className={`white p-25 shadow ${vertical ? 'nav-vertical' : ''}`}>
      <Container className='p-2 mb-0'>
        <Nav pills className={`mb-2 ${vertical ? 'nav-left mt-1' : 'flex-column flex-sm-row '}`}>
          <NavItem>
            <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
              <User className='font-medium-3 me-50' />
              <span className='fw-bold'>{FM('info')}</span>
            </NavLink>
          </NavItem>

          {/* <NavItem>
                    <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
                        <Activity className='font-medium-3 me-50' />
                        <span className='fw-bold'> {FM("activity")}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
                        <Target className='font-medium-3 me-50' />
                        <span className='fw-bold'>{FM("task")}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
                        <FileText className='font-medium-3 me-50' />
                        <span className='fw-bold'> {FM("journal")}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
                        <Flag className='font-medium-3 me-50' />
                        <span className='fw-bold'>{FM("deviation")}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink active={active === '6'} onClick={() => toggleTab('6')}>
                        <Rotate90DegreesCcw className='font-medium-3 me-50' />
                        <span className='fw-bold'>{FM("plans")}</span>
                    </NavLink>
                </NavItem> */}
          <Show
            IF={
              user?.user_type_id === UserTypes.company ||
              user?.user_type_id === UserTypes.branch ||
              user?.user_type_id === UserTypes.employee ||
              user?.user_type_id === UserTypes.patient
            }
          >
            <NavItem>
              <NavLink active={active === '7'} onClick={() => toggleTab('7')}>
                <Folder className='font-medium-3 me-50' />
                <span className='fw-bold'>{FM('docs')}</span>
              </NavLink>
            </NavItem>
          </Show>
          {/* <NavItem>
                    <NavLink active={active === '8'} onClick={() => toggleTab('8')}>
                        <ReceiptOutlined className='font-medium-3 me-50' />
                        <span className='fw-bold'>{FM("cashier")}</span>
                    </NavLink>
                </NavItem> */}
          {/* <Show IF={user?.user_type_id === UserTypes?.patient}>
                    <NavItem>
                        <NavLink active={active === '9'} onClick={() => toggleTab('9')}>
                            <TrendingUp className='font-medium-3 me-50' />
                            <span className='fw-bold'>{FM("statistics")}</span>
                        </NavLink>
                    </NavItem>
                </Show> */}
        </Nav>
      </Container>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <Info edit={user} />
        </TabPane>

        {/* <TabPane tabId='2'>
                    <ActivityTab user={user} />
                </TabPane>
                <TabPane tabId='3'>
                    <TaskTab user={user} />
                </TabPane> */}
        {/* <TabPane tabId='4'>
                    <JournalTabs user={user} />
                </TabPane>
                <TabPane tabId='5'>
                    <DeviationTab user={user} />
                </TabPane>
                <TabPane tabId='6'>
                    <IpTab user={""} />
                </TabPane> */}
        {/* <TabPane tabId='8'>
                    <Cashier user={user} />
                </TabPane> */}
        <TabPane tabId='7'>
          <DocsTab user={user} />
        </TabPane>
        {/* <Show IF={user?.user_type_id === UserTypes?.patient}>
                    <TabPane tabId='9'>
                        <Stats user={user} showPatient={false} showAction={false} />
                    </TabPane>
                </Show> */}
      </TabContent>
    </div>
  )
}
export default Tabs
