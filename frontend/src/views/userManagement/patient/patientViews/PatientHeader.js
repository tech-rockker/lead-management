import React, { useState } from 'react'
import { AlignJustify, Edit, Image, Info, Rss, Users } from 'react-feather'
import { Link } from 'react-router-dom'
import { Button, Card, CardImg, Collapse, Nav, Navbar, NavItem } from 'reactstrap'
import { getPath } from '../../../../router/RouteHelper'
import { FM } from '../../../../utility/helpers/common'

function PatientHeader({ data = null }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)
  return (
    <Card className='profile-header mb-2'>
      <div className='profile-header-nav'>
        <Navbar
          container={false}
          className='justify-content-end justify-content-md-between w-100'
          expand='md'
          light
        >
          <Button color='' className='btn-icon navbar-toggler' onClick={toggle}>
            <AlignJustify size={21} />
          </Button>
          <Collapse isOpen={isOpen} navbar>
            <div className='profile-tabs d-flex justify-content-between flex-wrap mt-1 mt-md-0'>
              <Nav className='mb-0' pills>
                <NavItem>
                  <Link to={getPath('master.tasks')} className='btn btn-primary btn-sm ms-1' active>
                    <span className='d-none d-md-block'>{FM('tasks')}</span>
                    <Rss className='d-block d-md-none' size={14} />
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className='btn btn-primary btn-sm ms-1' to={getPath('branch')}>
                    <span className='d-none d-md-block'>{FM('branch')}</span>
                    <Info className='d-block d-md-none' size={14} />
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className='btn btn-primary btn-sm ms-1' to={getPath('users.patients')}>
                    <span className='d-none d-md-block'>{FM('Patients')}</span>
                    <Image className='d-block d-md-none' size={14} />
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className='btn btn-primary btn-sm ms-1' to={getPath('activity')}>
                    <span className='d-none d-md-block'>{FM('activities')}</span>
                    <Users className='d-block d-md-none' size={14} />
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className='btn btn-primary btn-sm ms-1' to={getPath('implementations')}>
                    <span className='d-none d-md-block'>{FM('implementations')}</span>
                    <Users className='d-block d-md-none' size={14} />
                  </Link>
                </NavItem>
              </Nav>
              <Link
                className='btn btn-primary btn-sm ms-1'
                to={{ pathname: getPath('companies.update'), id: data?.id, state: data }}
              >
                <Edit className='d-block d-md-none' size={14} />
                <span className='fw-bold d-none d-md-block'>{FM('edit')}</span>
              </Link>
            </div>
          </Collapse>
        </Navbar>
      </div>
    </Card>
  )
}

export default PatientHeader
