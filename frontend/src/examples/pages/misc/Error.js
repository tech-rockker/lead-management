// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Styles
import '@styles/base/pages/page-misc.scss'
import themeConfig from '../../../configs/themeConfig'
import { FM } from '../../../utility/helpers/common'

const Error = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration = skin === 'dark' ? 'error-dark.svg' : 'error.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <h2 className='brand-text text-primary ms-1'>
          <img
            style={{ width: 30, height: 25 }}
            className='img-fluid'
            src={require('../../../assets/images/logo/logo.png').default}
          />
          {themeConfig.app.appName}
        </h2>
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>{FM('page-not-found')} 🕵🏻‍♀️</h2>
          <p className='mb-2'>
            {FM('oops')} 😖 {FM('the-requested-url-was-not-found-on-this-server')}.
          </p>
          <Button tag={Link} to='/' color='primary' className='btn-sm-block mb-2'>
            {FM('back-to-home')}
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default Error
