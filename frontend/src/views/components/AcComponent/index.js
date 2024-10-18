// ** React Imports
import { Fragment, useEffect } from 'react'
// ** Third Party Components
import Prism from 'prismjs'
// ** Demo Components
import AutoCompleteAjax from './AutoCompleteAjax'

const AcComponent = () => {
  useEffect(() => {
    Prism.highlightAll()
  }, [])
  return (
    <Fragment>
      <AutoCompleteAjax />
    </Fragment>
  )
}
export default AcComponent
