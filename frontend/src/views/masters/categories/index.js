import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Cpu, Edit, List, Plus, RefreshCcw, Sliders, Trash2 } from 'react-feather'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { delCategories } from '../../../redux/reducers/categories'
import { getPath } from '../../../router/RouteHelper'
// import Hide from '../../../utility/Hide'
import { categoriesDelete, categoriesLoad } from '../../../utility/apis/categories'
import { IconSizes } from '../../../utility/Const'
import { FM, getInitials } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import AddCategory from './addOrUpdateCategory'
import CategoryFilter from './categoryFilter'

const Categories = () => {
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
  const [categoryFilter, setCategoryFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

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
        <Card>
          <CardBody className='animate__animated animate__flipInX'>
            <Row className='align-items-center'>
              <Col xs='2'>
                <Avatar
                  // color={item?.status === 1 ? 'light-primary' : 'light-warning'}
                  style={{ backgroundColor: `${item.category_color}` }}
                  content={getInitials(item?.name)}
                />
              </Col>
              <Col xs='6'>
                <Link
                  to={{
                    state: { name: item?.name },
                    pathname: getPath('master.categories.sub-categories', {
                      id: item?.id,
                      name: item?.name,
                      type: item?.category_type_id ?? ''
                    })
                  }}
                >
                  <p className='text-truncate m-0 text-dark' title={item?.name}>
                    {FM(item?.name)}
                  </p>
                  <p className='text-truncate m-0 status-text'>{item?.category_type?.name}</p>
                </Link>
              </Col>

              <Col xs='4' className='d-flex align-items-end justify-content-end'>
                <Show IF={Permissions.categoriesEdit}>
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
                <Show IF={Permissions.categoriesDelete}>
                  <UncontrolledTooltip target={`grid-delete-${item.id}`}>
                    {FM('delete')}
                  </UncontrolledTooltip>
                  <ConfirmAlert
                    uniqueEventId={`cate-${item?.id}`}
                    item={item}
                    title={FM('delete-this', { name: item.name })}
                    color='text-warning'
                    onClickYes={() => categoriesDelete({ id: item?.id })}
                    onSuccessEvent={(item) => dispatch(delCategories(item?.id), setReload(true))}
                    className='ms-1'
                    id={`grid-delete-${item.id}`}
                  >
                    <Trash2 color={colors.danger.main} size='18' />
                  </ConfirmAlert>
                </Show>
                <Show IF={Permissions.categoriesRead}>
                  <BsTooltip
                    Tag={Link}
                    to={{
                      pathname: getPath('master.categories.sub-categories', {
                        id: item?.id,
                        type: item?.category_type_id ?? ''
                      }),
                      state: { name: item?.name, category_type_id: item?.category_type_id }
                    }}
                    role={'button'}
                    title={FM('view-sub-categories')}
                    className='ms-1'
                  >
                    <List size={IconSizes.MenuVertical} color={colors.info.main} />
                  </BsTooltip>
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
      <CategoryFilter
        show={categoryFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setCategoryFilter(false)
        }}
      />
      <AddCategory
        show={showAdd}
        edit={edit}
        handleModal={() => {
          setShowAdd(false)
          setEdit(null)
        }}
      />
      <Header icon={<Cpu size={25} />} subHeading={<>{FM('manage-categories')}</>}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
        {/* Buttons */}
        <ButtonGroup>
          <Show IF={Permissions.categoriesAdd}>
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
          <Button.Ripple
            onClick={() => setCategoryFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='16' />
          </Button.Ripple>
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
        </ButtonGroup>
      </Header>
      {/* Categories */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={categoriesLoad}
        jsonData={filterData}
        selector='categories'
        state='categories'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default Categories
