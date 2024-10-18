import React from 'react'
import { Bookmark, Calendar, Sliders } from 'react-feather'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { iconsData } from '../../examples/components/timeline/data'
import { FM } from '../../utility/helpers/common'
import Timeline from '../components/timeline'
import Header from '../header'

const activity = () => {
  return (
    <>
      <Header
        subHeading={
          <div className='text-uppercase'>
            <Bookmark size='18' /> 12 Aug, 2021
          </div>
        }
      >
        <UncontrolledTooltip placement='bottom' target='calendar'>
          {FM('calendar')}
        </UncontrolledTooltip>
        <Button.Ripple
          id='calendar'
          size='sm'
          color='primary'
          outline
          className='d-flex align-items-center text-uppercase'
        >
          <Calendar size='16' />
        </Button.Ripple>
        <UncontrolledTooltip placement='bottom' target='filter'>
          {FM('filter')}
        </UncontrolledTooltip>
        <Button.Ripple
          id='filter'
          size='sm'
          color='primary'
          outline
          className='d-flex align-items-center ms-1 text-uppercase'
        >
          <Sliders size='16' />
        </Button.Ripple>
      </Header>
      <Timeline data={iconsData} />
    </>
  )
}

export default activity
