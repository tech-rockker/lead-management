// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Third Party Components
import classnames from 'classnames'

// ** Store & Actions
import { handleContentWidth, handleMenuCollapsed, handleMenuHidden } from '@store/layout'
import { useDispatch, useSelector } from 'react-redux'

// ** Styles
import 'animate.css/animate.css'
import { useTranslation } from 'react-i18next'
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner'
import Show from '../../../../utility/Show'
import Emitter from '../../../../utility/Emitter'

const LayoutWrapper = (props) => {
  // ** Props
  const { layout, children, appLayout, wrapperClass, transition, routeMeta } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState()

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector((state) => state)

  const navbarStore = store.navbar
  const contentWidth = store.layout.contentWidth

  //** Vars
  const Tag = layout === 'HorizontalLayout' && !appLayout ? 'div' : Fragment

  // ** Clean Up Function
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth('full'))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(!routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(!routeMeta.menuHidden))
      }
    }
  }

  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth))
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed))
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(routeMeta.menuHidden))
      }
    }
    return () => cleanUp()
  }, [])

  useEffect(() => {
    Emitter.on('resettingBranch', (e) => {
      setLoading(e)
    })
  }, [])

  return (
    <>
      <Show IF={loading}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000000,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            background: '#fff'
          }}
        >
          <SpinnerComponent />
        </div>
      </Show>

      <div
        className={classnames('app-content content overflow-hidden', {
          [wrapperClass]: wrapperClass,
          'show-overlay': navbarStore.query.length
        })}
      >
        <div className='content-overlay'></div>
        <div className='header-navbar-shadow' />
        <div
          className={classnames({
            'content-wrapper': !appLayout,
            'content-area-wrapper': appLayout,
            'container-xxl p-0': contentWidth === 'boxed',
            [`animate__animated animate__${transition}`]: transition !== 'none' && transition.length
          })}
        >
          <Tag
            /*eslint-disable */
            {...(layout === 'HorizontalLayout' && !appLayout
              ? { className: classnames({ 'content-body': !appLayout }) }
              : {})}
            /*eslint-enable */
          >
            {children}
          </Tag>
        </div>
      </div>
    </>
  )
}

export default LayoutWrapper
