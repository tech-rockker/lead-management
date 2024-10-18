/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ArrowLeft, Edit, Plus, RefreshCcw, Save, Sliders, Trash2, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Form,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { delCategories, loadCategories } from '../../../../redux/reducers/categories'
import { getPath } from '../../../../router/RouteHelper'
import {
  categoriesDelete,
  categoriesEdit,
  categoriesSave,
  subCategoriesList,
  categoryChildList
} from '../../../../utility/apis/categories'

import { deleteModule } from '../../../../utility/apis/moduleApis'
import { Patterns } from '../../../../utility/Const'
import { FM, getInitials, isValid, log } from '../../../../utility/helpers/common'
import ConfirmAlert from '../../../../utility/helpers/ConfirmAlert'
import Hide from '../../../../utility/Hide'
import { Permissions } from '../../../../utility/Permissions'
import Show from '../../../../utility/Show'
import { SuccessToast } from '../../../../utility/Utils'
import LoadingButton from '../../../components/buttons/LoadingButton'
import FormGroupCustom from '../../../components/formGroupCustom'
import TableGrid from '../../../components/tableGrid'
import Header from '../.././../header'
import AddCategory from '../addOrUpdateCategory'
import SubCategoryFilter from './subCatFilter'

const SubCategory = () => {
  const params = useParams()
  const location = useLocation()

  const catTypeId = location.state.category_type_id
  const id = params.id
  const name = params.name
  const type = params.type
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
    reset
  } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  //  const [loadingSave, setLoadingSave] = useState(false)
  const [deleted, setDeleted] = useState(null)
  const [deletedId, setDeletedId] = useState(null)
  const [failed, setFailed] = useState(null)
  const [reload, setReload] = useState(true)
  const [added, setAdded] = useState(null)
  const [category, setCategory] = useState(null)
  const [subCategoryFilter, setSubCategoryFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    if (filterData !== null) setLoading(true)
  }, [filterData])

  const showForm = () => {
    setFormVisible(!formVisible)
  }

  // log(loadActivityCls)
  const onSubmitNew = (formData) => {
    categoriesSave({
      jsonData: {
        ...formData,
        parent_id: parseInt(id),
        category_type_id: type
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        showForm()
        // setLoading(true)
        reset()
        setAdded(data?.payload?.id)
        SuccessToast('done')
      },
      error: () => {}
    })
  }

  const onSubmitEdit = (jsonData) => {
    if (jsonData.name !== edit.name) {
      categoriesEdit({
        id: edit.id,
        jsonData: {
          ...jsonData,
          id: edit.id,
          parent_id: id,
          category_type_id: type
        },
        dispatch,
        loading: setLoading,
        success: () => {
          // setLoading(true)
          setEdit(null)
          SuccessToast('done')
        }
      })
    } else {
      setEdit(null)
    }
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
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
        <Card key={`${item?.id}-item`}>
          <CardBody className='animate__animated animate__flipInX'>
            <Row className='align-items-center'>
              {/* <Show IF={(edit?.id === item.id)}>
                            <Col xs="12">
                                <div class="animate__animated animate__bounceIn animate__faster">
                                    <Form onSubmit={handleSubmit(onSubmitEdit)}>
                                        <FormGroupCustom
                                            key={edit?.id}
                                            control={control}
                                            value={item?.name}
                                            autoFocus={true}
                                            noLabel
                                            placeholder={FM("enter-name")}
                                            type="text"
                                            name="name"
                                            errors={errors}
                                            className='mb-0'
                                            rules={{ required: true , maxLength: 35 }}
                                            append={
                                                <>
                                                    <LoadingButton tooltip={FM("save")} loading={loadingSave} type="submit" size="sm" color="primary">
                                                        <Save size="14" />
                                                    </LoadingButton>
                                                </>
                                            }
                                        />
                                    </Form>
                                </div>
                            </Col>
                        </Show> */}
              {/* <Hide IF={(edit?.id === item?.id)}> */}
              <Col xs='2'>
                {/* <Avatar color={item?.status === 1 ? 'light-primary' : 'light-primary'} content={getInitials(item?.name ?? "")} /> */}
                <Avatar
                  // color={item?.status === 1 ? 'light-primary' : 'light-warning'}
                  style={{ backgroundColor: `${item.category_color}` }}
                  content={getInitials(item?.name)}
                />
              </Col>
              <Col xs='7'>
                <p className='text-truncate m-0' title={item?.name}>
                  {item?.name}
                </p>
              </Col>

              <Col xs='3' className='d-flex justify-content-end'>
                <Show IF={Permissions.categoriesEdit}>
                  <UncontrolledTooltip target={`grid-edit-${item?.id}`}>
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
                <Hide IF={edit?.id === item?.id}>
                  <Show IF={Permissions.categoriesDelete}>
                    <UncontrolledTooltip target={`grid-delete-${item?.id}`}>
                      {FM('delete')}
                    </UncontrolledTooltip>
                    <ConfirmAlert
                      uniqueEventId={`cate-${item?.id}`}
                      item={item}
                      title={FM('delete-this', { name: item?.name })}
                      color='text-warning'
                      onClickYes={() => categoriesDelete({ id: item?.id })}
                      onSuccess={deleted}
                      onFailed={failed}
                      onSuccessEvent={(item) => dispatch(delCategories(item?.id), setLoading(true))}
                      className='ms-1'
                      id={`grid-delete-${item?.id}`}
                    >
                      <Trash2 color={colors.danger.main} size='18' />
                    </ConfirmAlert>
                  </Show>
                </Hide>
              </Col>
              {/* </Hide> */}
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
        parentId={id}
        typeId={type}
      />
      <SubCategoryFilter
        show={subCategoryFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setSubCategoryFilter(false)
        }}
      />
      <Header
        icon={
          <>
            <Link to={getPath('master.categories')}>
              <ArrowLeft />
            </Link>
          </>
        }
        title={name}
        subHeading={<>{FM('manage-sub-categories')}</>}
      >
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <Show IF={formVisible}>
          <div class='animate__animated animate__bounceInLeft animate__faster'>
            <Form className='me-1' onSubmit={handleSubmit(onSubmitNew)}>
              <FormGroupCustom
                size='sm'
                control={control}
                autoFocus={true}
                placeholder={FM('enter-name')}
                type='text'
                name='name'
                noLabel
                errors={errors}
                rules={{ required: true, maxLength: 35 }}
                append={
                  <LoadingButton
                    tooltip={FM('save')}
                    loading={loading}
                    type='submit'
                    size='sm'
                    color='primary'
                  >
                    <Save size='14' />
                  </LoadingButton>
                }
              />
            </Form>
          </div>
        </Show>

        {/* Buttons */}
        <ButtonGroup>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Show IF={Permissions.categoriesAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <Button.Ripple
              id='create-button'
              onClick={() => {
                setShowAdd(true)
                // setEdit(item)
              }}
              size='sm'
              color={formVisible ? 'danger' : 'primary'}
            >
              <Show IF={formVisible}>
                <X size='14' />
              </Show>
              <Hide IF={formVisible}>
                <Plus size='14' />
              </Hide>
            </Button.Ripple>
          </Show>
          <Button.Ripple
            onClick={() => setSubCategoryFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='14' />
          </Button.Ripple>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setLoading(true)
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      {/* Category Types */}
      <TableGrid
        force
        refresh={loading}
        jsonData={{
          parent_id: isValid(id) ? id : '',
          ...filterData
        }}
        isRefreshed={setLoading}
        loadFrom={categoryChildList}
        selector='categories'
        state='categories'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}
export default SubCategory
