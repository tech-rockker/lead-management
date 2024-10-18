import React, { Children, useState } from 'react'
import { log } from '../../../utility/helpers/common'
import { toggleArray } from '../../../utility/Utils'

const RepeaterForm = ({ children = () => {} }) => {
  const [array, setArray] = useState([0])
  let x = -1
  const onRemove = (index) => {
    log('index', index)
    toggleArray(index, array, setArray)
  }
  const onAdd = () => {
    toggleArray(array?.length, array, setArray)
  }
  const renderChild = () => {
    return array?.map((d, i) => {
      x++
      return children(
        i,
        () => {
          onRemove(i)
        },
        onAdd,
        array.length,
        x
      )
    })
  }
  return <>{renderChild()}</>
}

export default RepeaterForm
