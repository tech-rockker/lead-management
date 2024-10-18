import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Edit, Plus, Sliders, Trash2 } from 'react-feather'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { deleteCategoryById, loadCategories } from '../../utility/apis/masterApis'
import { FM, getInitials } from '../../utility/helpers/common'
import SideModal from '../components/sideModal/sideModal'
import TableGrid from '../components/tableGrid'
import Header from '../header'
import AddCategory from './addOrUpdateWorkShift'
import Avatar from '@components/avatar'
import ConfirmAlert from '../../utility/helpers/ConfirmAlert'
import { useDispatch } from 'react-redux'
import { ThemeColors } from '@src/utility/context/ThemeColors'
// import Hide from '../../../utility/Hide'
import { deleteWorkShift, loadWorkShift } from '../../utility/apis/companyWorkShift'
import { Permissions } from '../../utility/Permissions'
import Show from '../../utility/Show'
import { workshiftDelete } from '../../redux/reducers/companyWorkShift'

const WorkShift = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [edit, setEdit] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [deletedId, setDeletedId] = useState(null)
  const [failed, setFailed] = useState(null)
  const [loading, setLoading] = useState(false)

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
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
      <>
        <Card
          className={classNames({
            'animate__animated animate__bounceIn': index === 0 && item.id === added
          })}
        >
          <CardBody>
            <Row className='align-items-center'>
              <Col xs='2'>
                <Avatar
                  color={item?.status === 1 ? 'light-primary' : 'light-warning'}
                  content={getInitials(item?.name)}
                />
              </Col>
              <Col xs='7'>
                <p className='text-truncate m-0' title={item?.name}>
                  {item?.name}
                </p>
                <p className='m-0 status-text'>
                  {FM('type')}: {item?.category_type?.name}
                </p>
                <span
                  className='badge-small-custom'
                  style={{ backgroundColor: `${item.category_color}` }}
                ></span>
              </Col>

              <Col xs='3' className='d-flex justify-content-end'>
                <Show IF={Permissions.workShiftEdit}>
                  <UncontrolledTooltip target={`grid-edit-${item.id}`} autohide={true}>
                    {FM('edit')}
                  </UncontrolledTooltip>
                  <span
                    role={'button'}
                    id={`grid-edit-${item.id}`}
                    onClick={() => {
                      setShowAdd(true)
                      setEdit(item)
                    }}
                  >
                    <Edit color={colors.primary.main} size='18' />
                  </span>
                </Show>
                <Show IF={Permissions.workShiftDelete}>
                  <UncontrolledTooltip target={`grid-delete-${item.id}`}>
                    {FM('delete')}
                  </UncontrolledTooltip>
                  <ConfirmAlert
                    item={item}
                    title={FM('delete-this', { name: item.name })}
                    color='text-warning'
                    onClickYes={() => deleteWorkShift({ id: item?.id })}
                    onSuccessEvent={(item) => dispatch(workshiftDelete(item?.id))}
                    className='ms-1'
                    id={`grid-delete-${item.id}`}
                  >
                    <Trash2 color={colors.danger.main} size='18' />
                  </ConfirmAlert>
                </Show>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <AddCategory
        show={showAdd}
        edit={edit}
        handleModal={() => {
          setShowAdd(false)
          setEdit(null)
        }}
      />
      <Header>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>

        {/* Buttons */}
        <ButtonGroup>
          <Show IF={Permissions.workShiftAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <Button.Ripple
              onClick={() => {
                setShowAdd(true)
              }}
              size='sm'
              color='primary'
              id='create-button'
            >
              <Plus size='16' />
            </Button.Ripple>
          </Show>
          <Button.Ripple size='sm' color='dark' id='filter'>
            <Sliders size='16' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      {/* Categories */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadWorkShift}
        selector='companyWorkShift'
        state='workShift'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default WorkShift
