// ** React Imports
import { Fragment } from 'react'

// ** Icons Imports
import { ArrowLeft } from 'react-feather'

// ** Reactstrap Imports
import { Label, Row, Col, Form, Input, Button } from 'reactstrap'
import { FM } from '../../../../../utility/helpers/common'

const Preview = ({ stepper, type }) => {
  return (
    <Fragment>
      <div className='person-add-bg'>
        <div className='text-center bg-white p-2 shadow-sm'>
          <h5 className='mt-2'>{FM('under-development')}</h5>
        </div>
      </div>
    </Fragment>
  )
}

export default Preview
