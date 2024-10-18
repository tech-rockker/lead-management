import React, { useState } from 'react'
import { Button, Spinner, UncontrolledTooltip } from 'reactstrap'
import { getUniqId } from '../../../utility/Utils'

const LoadingButton = ({ id = null, loading = false, tooltip = null, ...props }) => {
  const [uId, setId] = useState(props?.id ?? getUniqId('button'))
  return (
    <>
      {tooltip ? <UncontrolledTooltip target={uId}>{tooltip}</UncontrolledTooltip> : null}
      <Button.Ripple id={uId} {...{ ...props, loading: 'false' }} disabled={loading}>
        {loading ? (
          <>
            <Spinner animation='border' size={'sm'}>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </>
        ) : (
          props.children
        )}
      </Button.Ripple>
    </>
  )
}

export default LoadingButton
