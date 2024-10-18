// ** Reactstrap Imports
import { Button, Form, Input, Row, Col } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Styles
import '@styles/base/pages/page-misc.scss'
import themeConfig from '../../../configs/themeConfig'
import { FM } from '../../../utility/helpers/common'

const Maintenance = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration = skin === 'dark' ? 'under-maintenance-dark.svg' : 'under-maintenance.svg',
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
          <h2 className='mb-1'>{FM('under-maintenance')} 🛠</h2>
          <p className='mb-3'>
            {FM('sorry-for-the-inconvenience-but-we-re-performing-some-maintenance-at-the-moment')}
          </p>
          <Form
            tag={Row}
            onSubmit={(e) => e.preventDefault()}
            className='row-cols-md-auto justify-content-center align-items-center m-0 mb-2 gx-3'
          >
            <Col sm='12' className='m-0 mb-1'>
              <Input placeholder='john@example.com' />
            </Col>
            <Col sm='12' className='d-md-block d-grid ps-md-0 ps-auto'>
              <Button className='mb-1 btn-sm-block' color='primary'>
                {FM('notify')}
              </Button>
            </Col>
          </Form>
          <img className='img-fluid' src={source} alt='Under maintenance page' />
        </div>
      </div>
    </div>
  )
}
export default Maintenance
