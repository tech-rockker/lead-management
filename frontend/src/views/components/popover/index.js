import React, { useState } from 'react'
import { PopoverBody, PopoverHeader, UncontrolledPopover } from 'reactstrap'
import { isValid } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { getUniqId } from '../../../utility/Utils'

const BsPopover = ({
  bodyClass = '',
  title = null,
  trigger = 'legacy',
  Tag = 'span',
  content = null,
  children,
  placement = 'top',
  ...rest
}) => {
  const [id, setId] = useState(getUniqId('popover'))

  if (isValid(content)) {
    return (
      <>
        <UncontrolledPopover trigger={trigger} placement={placement} target={id}>
          <Show IF={isValid(title)}>
            <PopoverHeader>{title}</PopoverHeader>
          </Show>
          <PopoverBody className={bodyClass}>{content}</PopoverBody>
        </UncontrolledPopover>
        <Tag id={id} {...rest}>
          {children}
        </Tag>
      </>
    )
  } else {
    return (
      <Tag id={id} {...rest}>
        {children}
      </Tag>
    )
  }
}

export default BsPopover
