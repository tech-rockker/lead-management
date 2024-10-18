import React, { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Layers, Plus, RefreshCcw, X } from 'react-feather'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, UncontrolledTooltip } from 'reactstrap'
import { loadRole } from '../../../utility/apis/roles'
import { FM, isValid } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import AddEditRole from './AddEditRole'

const Roles = () => {
  const [selected, setSelected] = useState(null)
  const [reload, setReload] = useState(false)
  const user = useSelector((state) => state.auth.userData)

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setSelected(null)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)
    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const gridView = (item, index) => {
    return (
      <Card className='animate__animated animate__fadeIn'>
        <CardBody>
          <div className='d-flex justify-content-between'>
            <span>{FM('total-permissions-assigned', { count: item?.permissions?.length })}</span>
          </div>
          <div className='d-flex justify-content-between align-items-end pt-25'>
            <div className='role-heading'>
              <h4 className='fw-bolder mb-1 mt-1'>{item.se_name}</h4>
              <Link
                to='/'
                className='role-edit-modal'
                onClick={(e) => {
                  window.history.pushState('page2', 'Title', '#')
                  e.preventDefault()
                  if (!selected) setSelected(item)
                  else setSelected(null)
                }}
              >
                <small className='fw-bolder'>{FM('edit')}</small>
              </Link>
            </div>
            {/* <Link to='' className='text-body' onClick={e => {
                            window.history.pushState('page2', 'Title', '#')
                            e.preventDefault()
                            if (!selected) setSelected(item)
                            else setSelected(null)
                        }}>
                            <BsTooltip title={FM("manage-permissions")}>
                                <Key className='font-medium-5' />
                            </BsTooltip>
                        </Link> */}
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      <Header
        icon={selected ? <ArrowLeft onClick={() => setSelected(null)} /> : <Layers size={25} />}
        subHeading={<>{FM('manage-roles')}</>}
        description={FM('roles-description')}
      >
        {/* Tooltips */}
        {/* <UncontrolledTooltip target="filter">{FM("filter")}</UncontrolledTooltip> */}
        {/* Buttons */}
        <ButtonGroup>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          {/* <Button.Ripple size="sm" outline color="dark" id="filter">
                        <Sliders size="14" />
                    </Button.Ripple> */}
          <Hide IF={selected}>
            <Show IF={Permissions.rolesAdd}>
              <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
              <Button.Ripple
                size='sm'
                color='primary'
                id='create-button'
                onClick={() => {
                  window.history.pushState('page2', 'Title', '#')
                  setSelected(true)
                }}
              >
                <Plus size='14' />
              </Button.Ripple>
            </Show>
          </Hide>
          <Show IF={isValid(selected)}>
            <BsTooltip
              Tag={Button.Ripple}
              title={FM('close')}
              size='sm'
              outline
              color='danger'
              onClick={() => {
                setSelected(null)
              }}
            >
              <X size='14' />
            </BsTooltip>
          </Show>
          <Hide IF={isValid(selected)}>
            <Button.Ripple
              size='sm'
              color='dark'
              id='reload'
              onClick={() => {
                setReload(true)
              }}
            >
              <RefreshCcw size='14' />
            </Button.Ripple>
          </Hide>
        </ButtonGroup>
      </Header>
      <Show IF={selected !== null}>
        <AddEditRole saved={setSelected} editData={selected} />
      </Show>
      <Hide IF={selected}>
        <TableGrid
          refresh={reload}
          isRefreshed={setReload}
          loadFrom={loadRole}
          jsonData={{
            top_most_parent_id: user?.top_most_parent_id
          }}
          selector='roles'
          state='roles'
          display='grid'
          gridCol='4'
          gridView={gridView}
        />
      </Hide>
    </>
  )
}

export default Roles
