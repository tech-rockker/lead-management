import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Item } from 'react-contexify'
import { Edit, Plus, Sliders, Trash2 } from 'react-feather'
import { useDispatch } from 'react-redux'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { deletePermission, loadPermissions, addPermission } from '../../utility/apis/permissions'
import { FM, getInitials, log } from '../../utility/helpers/common'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'

import TableGrid from '../components/tableGrid'
import Header from '../header'
import AddPermission from './addUpdatePermission'
import PermissionFilter from './permissionFilter'

const Packages = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [edit, setEdit] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [failed, setFailed] = useState(null)
  const [permissionFilter, setPermissionFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
    }
  }, [])

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const gridView = (item, index) => {
    return (
      <>
        <Card
          className={classNames({
            'animate__animated animate__bounceIn': index === 0 && item.id === added
          })}
        >
          <CardBody>
            <Row className='align-items-center'>
              <Col xs='2'></Col>
              <Col xs='7'>
                <p className='text-truncate m-0' title={item?.permission?.name}>
                  {FM(item?.permission?.se_name)}
                </p>
                <p className='m-0 status-text font-weight-bold'>{FM(item?.permission?.se_name)}</p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <PermissionFilter
        show={permissionFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setPermissionFilter(false)
        }}
      />
      <AddPermission
        key={edit?.id}
        show={showAdd}
        edit={edit}
        handleModal={() => {
          setShowAdd(false)
          setEdit(null)
        }}
      />
      <Header>
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        {/* <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip> */}
        {/* Buttons */}
        <ButtonGroup>
          <Button.Ripple
            size='sm'
            onClick={() => {
              setShowAdd(true)
            }}
            outline
            color='dark'
            id='create-button'
          >
            <Plus size='16' />
          </Button.Ripple>
          <Button.Ripple
            onClick={() => setPermissionFilter(true)}
            size='sm'
            outline
            color='dark'
            id='filter'
          >
            <Sliders size='16' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      {/* Categories */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadPermissions}
        jsonData={filterData}
        selector='Permissions'
        state='permission'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default Packages
