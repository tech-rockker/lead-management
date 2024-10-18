// ** ThemeConfig Import
import themeConfig from '@configs/themeConfig'

// ** Returns Initial Menu Collapsed State
const initialMenuCollapsed = () => {
  const item = window.localStorage.getItem('menuCollapsed')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed
}

// ** Returns Initial Menu Collapsed State
const initialMenuCollapsedBox = () => {
  const item = window.localStorage.getItem('menuCollapsedBox')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsedBox
}

// ** Returns Initial Layout Skin
const initialLayoutSkin = () => {
  const item = window.localStorage.getItem('skin')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.skin
}

// ** Initial State
const initialState = {
  skin: initialLayoutSkin(),
  isRTL: themeConfig.layout.isRTL,
  menuCollapsed: initialMenuCollapsed(),
  menuCollapsedBox: initialMenuCollapsedBox(),
  menuHidden: themeConfig.layout.menu.isHidden,
  contentWidth: themeConfig.layout.contentWidth
}

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'HANDLE_CONTENT_WIDTH':
      return { ...state, contentWidth: action.value }
    case 'HANDLE_MENU_COLLAPSED':
      window.localStorage.setItem('menuCollapsed', action.value)
      return { ...state, menuCollapsed: action.value }
    case 'HANDLE_MENU_COLLAPSED_BOX':
      window.localStorage.setItem('menuCollapsedBox', action.value)
      return { ...state, menuCollapsedBox: action.value }
    case 'HANDLE_MENU_HIDDEN':
      return { ...state, menuHidden: action.value }
    case 'HANDLE_RTL':
      return { ...state, isRTL: action.value }
    case 'HANDLE_SKIN':
      return { ...state, skin: action.value }
    default:
      return state
  }
}

export default layoutReducer
