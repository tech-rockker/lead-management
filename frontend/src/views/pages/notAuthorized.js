import React from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import notAuthImg from '@src/assets/images/pages/not-authorized.svg'

import '@styles/base/pages/page-misc.scss'
import { FM } from '../../utility/helpers/common'
const NotAuthorized = () => {
  return (
    <div className='misc-wrapper'>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>{FM('not-authorized')} 🔐</h2>
          <p className='mb-2'>{FM('no-permission-message')}</p>
          <img className='img-fluid' src={notAuthImg} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}

export default NotAuthorized
