import React from 'react'
import { Plus, RefreshCcw, Server, ShoppingBag, Sliders, Users } from 'react-feather'
import { Link } from 'react-router-dom'
import { Badge, Button, ButtonGroup, UncontrolledTooltip } from 'reactstrap'
import { getPath } from '../../../router/RouteHelper'
import { FM } from '../../../utility/helpers/common'
import Header from '../../header'
// ** Custom Components
import TimelineBase from '@components/timeline'
import Avatar from '../../../examples/components/avatar'
import AvatarGroup from '@components/avatar-group'
import user1 from '@src/assets/images/portrait/small/avatar-s-25.jpg'
import user2 from '@src/assets/images/portrait/small/avatar-s-7.jpg'
import user3 from '@src/assets/images/portrait/small/avatar-s-10.jpg'
import { Permissions } from '../../../../utility/Permissions'

const Timeline = () => {
  return (
    <>
      <Header icon={<Users size='25' />} subHeading={FM('all-activity')}>
        {/* Tooltips */}
        <ButtonGroup color='dark'>
          <Show IF={Permissions.activitySelfAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <Link
              to={getPath('activity.create')}
              className='btn btn-outline-dark btn-sm'
              id='create-button'
            >
              <Plus size='14' />
            </Link>
          </Show>
          {/* <UncontrolledTooltip target="create-activity">{FM("create-new")}</UncontrolledTooltip>
                    <FollowUpModal Component={Button.Ripple} size="sm" outline color="dark" id="create-activity">
                        <Plus size="16" />
                    </FollowUpModal> */}
          {/* <UncontrolledTooltip target="filter">{FM("filter")}</UncontrolledTooltip>
                    <Button.Ripple onClick={() => setActivityFilter(true)} size="sm" outline color="dark" id="filter">
                        <Sliders size="14" />
                    </Button.Ripple>
                    <UncontrolledTooltip target="reload">{FM("refresh-data")}</UncontrolledTooltip>
                    <Button.Ripple size="sm" outline color="dark" id="reload" onClick={() => { setReload(true) }}>
                        <RefreshCcw size="14" />
                    </Button.Ripple> */}
        </ButtonGroup>
      </Header>
    </>
  )
}

export default Timeline
