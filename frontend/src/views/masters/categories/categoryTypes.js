/* eslint-disable no-unused-vars */
import classNames from 'classnames'
import { isEmptyObject } from 'jquery'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  Edit,
  PlayCircle,
  Plus,
  RefreshCcw,
  Save,
  Send,
  Sliders,
  Trash2,
  X,
  MoreVertical
} from 'react-feather'
import { useForm } from 'react-hook-form'

import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import {
  deleteCatTypeId,
  editCatType,
  loadCatTypes,
  submitNewCatType
} from '../../../utility/apis/masterApis'
import { FM, getInitials, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import LoadingButton from '../../components/buttons/LoadingButton'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'
import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import {
  loadCategoriesTypes,
  deleteCategoriesTypes,
  editCategoriesTypes,
  addCategoriesTypes
} from '../../../utility/apis/categoriesTypes'
import { Patterns, IconSizes } from '../../../utility/Const'
import FormGroupCustom from '../../components/formGroupCustom'

const categoryTypes = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(null)
  const [failed, setFailed] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)

  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const onSubmitNew = (jsonData) => {
    addCategoriesTypes({
      jsonData,
      loading: setLoading,
      dispatch,
      success: (data) => {
        showForm()
        setAdded(data?.payload?.id)
      }
    })
  }

  const onSubmitEdit = (jsonData) => {
    jsonData.status = jsonData?.status ? 1 : 0

    if (jsonData.name !== edit.name || jsonData.status !== edit.status) {
      editCategoriesTypes({
        id: edit.id,
        jsonData: {
          ...jsonData,
          id: edit.id
        },
        dispatch,
        loading: setLoading,
        success: () => {
          setEdit(null)
        }
      })
    } else {
      setEdit(null)
    }
  }

  const columns = useMemo(() => {
    return [{}]
  }, [])

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
        <Card
          className={classNames({
            'animate__animated animate__bounceIn': index === 0 && item.id === added
          })}
        >
          <CardBody>
            <Row className='align-items-center'>
              {/* <Show IF={(edit?.id === item.id)}>
                            <Col xs="12">
                                <div class="animate__animated animate__bounceIn animate__faster">
                                    <Form className="" onSubmit={handleSubmit(onSubmitEdit)}>
                                        <FormGroupCustom
                                            prepend={
                                                <>
                                                    <InputGroupText>
                                                        <FormGroupCustom
                                                            noLabel
                                                            noGroup
                                                            value={item?.status}
                                                            control={control}
                                                            name="status"
                                                            message={FM("change-status")}
                                                            type={"checkbox"}
                                                            errors={errors}
                                                        />
                                                    </InputGroupText>
                                                </>
                                            }
                                            value={item?.name}
                                            noLabel
                                            control={control}
                                            errors={errors}
                                            type="text"
                                            name="name"
                                            rules={{ required: true, maxLength: 35  }}
                                            append={<>
                                                <LoadingButton tooltip={FM("save")} loading={loading} type="submit" size="sm" color="primary">
                                                    <Save size="14" />
                                                </LoadingButton>
                                            </>
                                            }
                                        />
                                    </Form>
                                </div>
                            </Col>
                        </Show> */}
              <Hide IF={edit?.id === item.id}>
                <Col xs='2'>
                  <Avatar
                    color={item?.status === 1 ? 'light-primary' : 'light-primary'}
                    content={getInitials(item?.name)}
                  />
                </Col>
                <Col xs='7'>
                  <p className='text-truncate m-0' title={item?.name}>
                    {item?.name}
                  </p>
                  {/* <p className="m-0 status-text">
                                    {FM("status")}: {item?.status === 1 ? FM("active") : FM("inactive")}
                                </p> */}
                </Col>
                {/* <UncontrolledTooltip target={`grid-edit-${item.id}`} autohide={true}>
                                {FM("edit")}
                            </UncontrolledTooltip>
                            <UncontrolledTooltip target={`grid-delete-${item.id}`}>
                                {FM("delete")}
                            </UncontrolledTooltip>
                            <Col xs="3" className="d-flex justify-content-end">
                                <span role={"button"} id={`grid-edit-${item.id}`} onClick={() => {
                                    setEdit(item)
                                }}>
                                    <Edit color={colors.primary.main} size="18" />
                                </span>
                                <Hide IF={(edit?.id === item.id)}>
                                    <ConfirmAlert
                                        title={FM("delete-this", { name: item.name })}
                                        color='text-warning'
                                        onClickYes={() => deleteCategoriesTypes({ id: item?.id, dispatch = () => { } , loading: setLoading, success: setDeleted, error: setFailed })}
                                        onSuccess={deleted}
                                        onFailed={failed}
                                        onClose={() => { setDeleted(null); setFailed(null) }}
                                        className="ms-1"
                                        id={`grid-delete-${item.id}`}>
                                        <Trash2 color={colors.danger.main} size="18" />
                                    </ConfirmAlert>
                                </Hide>
                            </Col> */}
              </Hide>
            </Row>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <Header>
        {/* Tooltips */}
        {/* <UncontrolledTooltip target="filter">{FM("filter")}</UncontrolledTooltip> */}
        {/* <Show IF={formVisible}>
                    <div class="animate__animated animate__bounceInLeft animate__faster">
                        <Form className="me-1" onSubmit={handleSubmit(onSubmitNew)}>
                            <FormGroupCustom
                                noLabel
                                placeholder={FM("enter-name")}
                                type="text"
                                name="name"
                                control={control}
                                errors={errors}
                                bsSize="sm"
                                rules={{ required: true, maxLength: 35  }}
                                append={<>
                                    <LoadingButton tooltip={FM("save")} loading={loading} type="submit" size="sm" color="primary">
                                        <Save size="14" />
                                    </LoadingButton>
                                </>}
                            />
                        </Form>
                    </div>
                </Show> */}

        {/* Buttons */}
        <ButtonGroup>
          {/* <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip> */}
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          {/* <Button.Ripple onClick={showForm} size="sm" outline color={formVisible ? "danger" : "dark"} id="create-button">
                        <Show IF={formVisible}>
                            <X size="14" />
                        </Show>
                        <Hide IF={formVisible}>
                            <Plus size="14" />
                        </Hide>
                    </Button.Ripple>
                    <Button.Ripple size="sm" outline color="dark" id="filter">
                        <Sliders size="14" />
                    </Button.Ripple> */}
          <Button.Ripple
            size='sm'
            outline
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

      {/* Category Types */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadCategoriesTypes}
        selector='categoriesTypes'
        state='categoryTypes'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default categoryTypes
