// ** React Imports
// ** Custom Components
import Avatar from '@components/avatar'
// ** Blank Avatar Image
import blankAvatar from '@src/assets/images/avatars/avatar-blank.png'
import { Menu, MoreVertical, Search } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link } from 'react-router-dom'
// ** Reactstrap Imports
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupText,
  UncontrolledDropdown
} from 'reactstrap'

const Tasks = (props) => {
  // ** Props
  const {
    query,
    tasks,
    params,
    setSort,
    dispatch,
    getTasks,
    setQuery,
    updateTask,
    selectTask,
    reOrderTasks,
    handleTaskSidebar,
    handleMainSidebar
  } = props

  // ** Function to selectTask on click
  const handleTaskClick = (obj) => {
    dispatch(selectTask(obj))
    handleTaskSidebar()
  }

  // ** Returns avatar color based on task tag
  const resolveAvatarVariant = (tags) => {
    if (tags.includes('high')) return 'light-primary'
    if (tags.includes('medium')) return 'light-warning'
    if (tags.includes('low')) return 'light-success'
    if (tags.includes('update')) return 'light-danger'
    if (tags.includes('team')) return 'light-info'
    return 'light-primary'
  }

  // ** Renders task tags
  const renderTags = (arr) => {
    const badgeColor = {
      team: 'light-primary',
      low: 'light-success',
      medium: 'light-warning',
      high: 'light-danger',
      update: 'light-info'
    }

    return arr.map((item) => (
      <Badge className='text-capitalize' key={item} color={badgeColor[item]} pill>
        {item}
      </Badge>
    ))
  }

  // ** Renders Avatar
  const renderAvatar = (obj) => {
    const item = obj.assignee

    if (item.avatar === undefined || item.avatar === null) {
      return <Avatar img={blankAvatar} imgHeight='32' imgWidth='32' />
    } else if (item.avatar !== '') {
      return <Avatar img={item.avatar} imgHeight='32' imgWidth='32' />
    } else {
      return <Avatar color={resolveAvatarVariant(obj.tags)} content={item.fullName} initials />
    }
  }

  const renderTasks = () => {
    return (
      <PerfectScrollbar
        className='list-group todo-task-list-wrapper'
        options={{ wheelPropagation: false }}
        containerRef={(ref) => {
          if (ref) {
            ref._getBoundingClientRect = ref.getBoundingClientRect

            ref.getBoundingClientRect = () => {
              const original = ref._getBoundingClientRect()

              return { ...original, height: Math.floor(original.height) }
            }
          }
        }}
      ></PerfectScrollbar>
    )
  }

  // ** Function to getTasks based on search query
  const handleFilter = (e) => {
    setQuery(e.target.value)
    dispatch(getTasks(params))
  }

  // ** Function to getTasks based on sort
  const handleSort = (e, val) => {
    e.preventDefault()
    setSort(val)
    dispatch(getTasks({ ...params }))
  }

  return (
    <div className='todo-app-list'>
      <div className='app-fixed-search d-flex align-items-center'>
        <div
          className='sidebar-toggle cursor-pointer d-block d-lg-none ms-1'
          onClick={handleMainSidebar}
        >
          <Menu size={21} />
        </div>
        <div className='d-flex align-content-center justify-content-between w-100'>
          <InputGroup className='input-group-merge'>
            <InputGroupText>
              <Search className='text-muted' size={14} />
            </InputGroupText>
            <Input placeholder='Search task' value={query} onChange={handleFilter} />
          </InputGroup>
        </div>
        <UncontrolledDropdown>
          <DropdownToggle
            className='hide-arrow me-1'
            tag='a'
            href='/'
            onClick={(e) => e.preventDefault()}
          >
            <MoreVertical className='text-body' size={16} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem tag={Link} to='/' onClick={(e) => handleSort(e, 'title-asc')}>
              Sort A-Z
            </DropdownItem>
            <DropdownItem tag={Link} to='/' onClick={(e) => handleSort(e, 'title-desc')}>
              Sort Z-A
            </DropdownItem>
            <DropdownItem tag={Link} to='/' onClick={(e) => handleSort(e, 'assignee')}>
              Sort Assignee
            </DropdownItem>
            <DropdownItem tag={Link} to='/' onClick={(e) => handleSort(e, 'due-date')}>
              Sort Due Date
            </DropdownItem>
            <DropdownItem tag={Link} to='/' onClick={(e) => handleSort(e, '')}>
              Reset Sort
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      {renderTasks()}
    </div>
  )
}

export default Tasks
