// ** React Imports
import { Link } from 'react-router-dom'
import { Fragment, useEffect, useState } from 'react'

// ** Third Party Components
import * as Icon from 'react-feather'
import * as MCIon from '@material-ui/icons'
import classnames from 'classnames'

// ** Custom Component
import Autocomplete from '@components/autocomplete'

// ** Reactstrap Imports
import {
  NavItem,
  NavLink,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown
} from 'reactstrap'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getBookmarks, updateBookmarked, handleSearchQuery } from '@store/navbar'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import BsTooltip from '../../../../views/components/tooltip'
import useUser from '../../../../utility/hooks/useUser'
import adminNavigations from '../../../../navigation/AceussNavigations/adminNavigations'
import { fastLoop } from '../../../../utility/Utils'
import { createBookmarkLink } from '../../../../utility/apis/commons'
import Show from '../../../../utility/Show'

const NavbarBookmarks = (props) => {
  // ** Props
  const { setMenuVisibility } = props
  const user = useUser()
  // ** State
  const [value, setValue] = useState('')
  const [openSearch, setOpenSearch] = useState(false)

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state.navbar)

  // ** ComponentDidMount
  useEffect(() => {
    if (isValid(user?.id)) {
      dispatch(getBookmarks())
    }
  }, [user])

  const bookmarksCreate = () => {
    if (isValid(user?.id)) {
      const nav = adminNavigations
      const suggestion = store.suggestion
      const final = []
      fastLoop(nav, (n, i) => {
        if (isValid(n?.navLink) && !isValid(suggestion?.find((a) => a.link === n?.navLink))) {
          const a = {
            user_types: n?.userTypes,
            icon_type: isValid(n?.icon?.type?.render?.displayName)
              ? 'feather'
              : isValid(n?.icon?.type?.type?.render?.displayName)
              ? 'material'
              : 'unknown',
            icon: n?.icon?.type?.type?.render?.displayName
              ? String(n?.icon?.type?.type?.render?.displayName).replace('Icon', '')
              : n?.icon?.type?.render?.displayName ?? 'Circle',
            link: n?.navLink ?? '#',
            target: `${n?.id}-bookmark`,
            title: n?.title
          }
          // createBookmarkLink({
          //     jsonData: a
          // })
        }
      })
      // log('nav', final)
    }
  }

  useEffect(() => {
    bookmarksCreate()
  }, [user, store.suggestion])

  // ** Loops through Bookmarks Array to return Bookmarks
  const renderBookmarks = () => {
    if (store?.bookmarks?.length) {
      return store?.bookmarks
        .map((item) => {
          const IconTag =
            item?.icon_type === 'feather'
              ? Icon[item.icon]
              : item?.icon_type === 'material'
              ? MCIon[item?.icon]
              : null
          return (
            <NavItem key={item.target} className='d-none d-lg-block'>
              <NavLink tag={Link} to={item.link} id={item.target}>
                <Show IF={isValid(IconTag)}>
                  <IconTag className='ficon' />
                </Show>
                <Show IF={!isValid(IconTag)}>{item?.title}</Show>
                <UncontrolledTooltip target={item.target}>{FM(item.title)}</UncontrolledTooltip>
              </NavLink>
            </NavItem>
          )
        })
        .slice(0, 10)
    } else {
      return null
    }
  }

  // ** If user has more than 10 bookmarks then add the extra Bookmarks to a dropdown
  const renderExtraBookmarksDropdown = () => {
    if (store?.bookmarks?.length && store?.bookmarks?.length >= 11) {
      return (
        <NavItem className='d-none d-lg-block'>
          <NavLink tag='span'>
            <UncontrolledDropdown>
              <DropdownToggle tag='span'>
                <Icon.ChevronDown className='ficon' />
              </DropdownToggle>
              <DropdownMenu end>
                {store.bookmarks
                  .map((item) => {
                    const IconTag =
                      item?.icon_type === 'feather'
                        ? Icon[item.icon]
                        : item?.icon_type === 'material'
                        ? MCIon[item?.icon]
                        : null
                    return (
                      <DropdownItem tag={Link} to={item.link} key={item.id}>
                        <Show IF={isValid(IconTag)}>
                          <IconTag className='me-50' size={14} />
                        </Show>
                        <Show IF={!isValid(IconTag)}>
                          <Icon.Circle className='me-50' size={14} />
                        </Show>
                        <span className='align-middle'>{item.title}</span>
                      </DropdownItem>
                    )
                  })
                  .slice(10)}
              </DropdownMenu>
            </UncontrolledDropdown>
          </NavLink>
        </NavItem>
      )
    } else {
      return null
    }
  }

  // ** Removes query in store
  const handleClearQueryInStore = () => dispatch(handleSearchQuery(''))

  // ** Loops through Bookmarks Array to return Bookmarks
  const onKeyDown = (e) => {
    if (e.keyCode === 27 || e.keyCode === 13) {
      setTimeout(() => {
        setOpenSearch(false)
        handleClearQueryInStore()
      }, 1)
    }
  }

  // ** Function to toggle Bookmarks
  const handleBookmarkUpdate = (item) =>
    dispatch(updateBookmarked({ bookmark_master_id: item?.id }))

  // ** Function to handle Bookmarks visibility
  const handleBookmarkVisibility = () => {
    // if (store.suggestions.length > 0) {
    setOpenSearch(!openSearch)
    setValue('')
    handleClearQueryInStore()
    // }
  }

  // ** Function to handle Input change
  const handleInputChange = (e) => {
    setValue(e.target.value)
    dispatch(handleSearchQuery(e.target.value))
  }

  // ** Function to handle external Input click
  const handleExternalClick = () => {
    if (openSearch === true) {
      setOpenSearch(false)
      handleClearQueryInStore()
    }
  }

  // ** Function to clear input value
  const handleClearInput = (setUserInput) => {
    if (!openSearch) {
      setUserInput('')
      handleClearQueryInStore()
    }
  }

  return (
    <Fragment>
      <ul className='navbar-nav d-xl-none'>
        <NavItem className='mobile-menu me-auto'>
          <NavLink
            className='nav-menu-main menu-toggle hidden-xs is-active'
            onClick={() => setMenuVisibility(true)}
          >
            <Icon.Menu className='ficon' />
          </NavLink>
        </NavItem>
      </ul>
      <ul className='nav navbar-nav bookmark-icons'>
        {renderBookmarks()}
        {renderExtraBookmarksDropdown()}
        <NavItem className='nav-item d-none d-lg-block'>
          <NavLink className='bookmark-star' onClick={handleBookmarkVisibility}>
            <BsTooltip title={FM('bookmarks')}>
              <Icon.Star className='ficon text-warning' />
            </BsTooltip>
          </NavLink>
          {/*  { show: openSearch } */}
          <div className={classnames('bookmark-input search-input', { show: openSearch })}>
            <div className='bookmark-input-icon'>
              <Icon.Search size={14} />
            </div>
            {openSearch && (store?.suggestions?.length || store?.bookmarks?.length) ? (
              <Autocomplete
                wrapperClass={classnames('search-list search-list-bookmark', {
                  show: openSearch
                })}
                className='form-control'
                suggestions={
                  !value.length
                    ? store.bookmarks
                    : store.suggestions?.filter((a) => a.user_types?.includes(user?.user_type_id))
                }
                filterKey='title'
                autoFocus={true}
                defaultSuggestions
                suggestionLimit={!value?.length ? store?.bookmarks?.length : 6}
                placeholder='Search...'
                externalClick={handleExternalClick}
                clearInput={(userInput, setUserInput) => handleClearInput(setUserInput)}
                onKeyDown={onKeyDown}
                value={value}
                onChange={handleInputChange}
                customRender={(
                  item,
                  i,
                  filteredData,
                  activeSuggestion,
                  onSuggestionItemClick,
                  onSuggestionItemHover
                ) => {
                  const IconTag =
                    item?.icon_type === 'feather'
                      ? Icon[item.icon]
                      : item?.icon_type === 'material'
                      ? MCIon[item?.icon]
                      : null
                  return (
                    <li
                      key={i}
                      onMouseEnter={() => onSuggestionItemHover(filteredData?.indexOf(item))}
                      className={classnames(
                        'suggestion-item d-flex align-items-center justify-content-between',
                        {
                          active: filteredData?.indexOf(item) === activeSuggestion
                        }
                      )}
                    >
                      <Link
                        to={item?.link}
                        className='d-flex align-items-center justify-content-between p-0'
                        onClick={() => {
                          setOpenSearch(false)
                          handleClearQueryInStore()
                        }}
                        style={{
                          width: 'calc(90%)'
                        }}
                      >
                        <div className='d-flex justify-content-start align-items-center overflow-hidden'>
                          <Show IF={isValid(IconTag)}>
                            <IconTag className='me-75' size={17.5} />
                          </Show>
                          <Show IF={!isValid(IconTag)}>
                            <Icon.Circle className='me-75' size={17.5} />
                          </Show>
                          <span className='text-truncate'>{FM(item.title)}</span>
                        </div>
                      </Link>
                      <Icon.Star
                        size={17.5}
                        className={classnames('bookmark-icon float-end', {
                          'text-warning': item?.isBookmarked
                        })}
                        onClick={() => handleBookmarkUpdate(item)}
                      />
                    </li>
                  )
                }}
              />
            ) : null}
          </div>
        </NavItem>
      </ul>
    </Fragment>
  )
}

export default NavbarBookmarks
