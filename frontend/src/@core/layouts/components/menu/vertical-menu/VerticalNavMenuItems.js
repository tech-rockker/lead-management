// ** Vertical Menu Components
import VerticalNavMenuGroup from './VerticalNavMenuGroup'
import VerticalNavMenuLink from './VerticalNavMenuLink'
import VerticalNavMenuSectionHeader from './VerticalNavMenuSectionHeader'

// ** Utils
import {
  canViewMenuGroup,
  canViewMenuItem,
  resolveVerticalNavMenuItemComponent as resolveNavItemComponent
} from '@layouts/utils'
import useModules from '../../../../../utility/hooks/useModules'
import { isValid, log } from '../../../../../utility/helpers/common'

const VerticalMenuNavItems = (props) => {
  const modules = useModules()

  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader
  }

  // ** Render Nav Menu Items
  const RenderNavItemsOnly = () => {
    const on = []
    props.items.map((item, index) => {
      const TagName = Components[resolveNavItemComponent(item)]
      if (item.children) {
        if (canViewMenuGroup(item, modules)) {
          on.push(item)
        }
      } else {
        if (canViewMenuItem(item, modules)) {
          on.push(item)
        }
      }
    })
    return on
  }
  const RenderNavItems = RenderNavItemsOnly().map((item, index) => {
    if (item) {
      let next = true
      const TagName = Components[resolveNavItemComponent(item)]
      if (item.hasOwnProperty('header')) {
        if (RenderNavItemsOnly()[index + 1]) {
          if (RenderNavItemsOnly()[index + 1].hasOwnProperty('id')) {
            next = true
          } else next = false
        } else {
          next = false
        }
      } else {
        next = true
      }
      if (item.children) {
        return (
          canViewMenuGroup(item, modules) &&
          next && <TagName item={item} index={index} key={item.id} {...props} />
        )
      }
      return (
        canViewMenuItem(item, modules) &&
        next && <TagName key={item.id || item.header} item={item} {...props} />
      )
    }
  })

  return RenderNavItems
}

export default VerticalMenuNavItems
