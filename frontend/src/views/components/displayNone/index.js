import classNames from 'classnames'
import React from 'react'

const DisplayNone = ({ display = true, children }) => {
  return <div className={classNames({ 'display-none': display })}>{children}</div>
}

export default DisplayNone
