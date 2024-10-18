// ** Third Party Components
import { MoreHorizontal } from 'react-feather'
import { FM } from '../../../../../utility/helpers/common'

const VerticalNavMenuSectionHeader = ({ item }) => {
  return (
    <li className='navigation-header'>
      <span>{FM(item.header)}</span>
      <MoreHorizontal className='feather-more-horizontal' />
    </li>
  )
}

export default VerticalNavMenuSectionHeader
