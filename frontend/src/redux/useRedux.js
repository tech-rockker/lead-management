import { useDispatch, useSelector } from 'react-redux'
import { store } from './store'

/**
 * Custom redux hook
 * @returns method to dispatch and redux states
 */
const UseRedux = () => {
  const dispatch = useDispatch()
  let reduxStates = store.getState()
  reduxStates = useSelector((s) => s)
  return {
    dispatch,
    reduxStates
  }
}
export const useRedux = UseRedux
