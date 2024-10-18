/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Edit, Plus, RefreshCcw, Save, Sliders, Trash2, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import {
  deleteCompTypeId,
  editCompType,
  loadCompanyType,
  saveNewComp
} from '../../../utility/apis/compTypeApis'
import { patientTypeListLoad } from '../../../utility/apis/commons'
import { Patterns } from '../../../utility/Const'
import { FM, getInitials, log } from '../../../utility/helpers/common'
import { createSelectOptions } from '../../../utility/Utils'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'

const CompanyTypes = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
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
    saveNewComp({
      jsonData,
      loading: setLoading,
      dispatch,
      success: (data) => {
        showForm()
        setAdded(data?.payload?.id)
        reset()
      }
    })
  }

  const onSubmitEdit = (jsonData) => {
    jsonData.status = jsonData?.status ? 1 : 0

    if (jsonData.name !== edit.name) {
      editCompType({
        id: edit.id,
        jsonData: {
          ...jsonData
        },
        dispatch,
        loading: setLoading,
        success: () => {
          setEdit(null)
          reset()
        }
      })
    } else {
      setEdit(null)
      reset()
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
        <Card
          className={classNames({
            'animate__animated animate__bounceIn': index === 0 && item?.id === added
          })}
        >
          <CardBody>
            <Row className='align-items-center'>
              {/* <Show IF={(edit?.id === item?.id)}>
                            <Col xs="12">
                                <div class="animate__animated animate__bounceIn animate__faster">
                                    <Form className="" onSubmit={handleSubmit(onSubmitEdit)}>
                                        <FormGroupCustom
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
                                    </Form >
                                </div >
                            </Col >
                        </Show > */}
              {log('hello', item)}
              <Hide IF={edit?.id === item?.id}>
                <Col xs='2'>
                  <Avatar
                    color={item?.status === 1 ? 'light-primary' : 'light-primary'}
                    content={getInitials(item?.designation)}
                  />
                </Col>
                <Col xs='7'>
                  <p className='text-truncate m-0' title={item?.designation}>
                    {item?.designation}
                  </p>
                  {/* <p className="m-0 status-text">
                                    {FM("status")}: {item?.status === 1 ? FM("active") : FM("inactive")}
                                </p> */}
                </Col>
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
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
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
                    </Button.Ripple> */}
          <Button.Ripple size='sm' outline color='dark' id='filter'>
            <Sliders size='14' />
          </Button.Ripple>
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
        refresh={loading}
        isRefreshed={setLoading}
        loadFrom={patientTypeListLoad}
        selector={'common'}
        state={'common'}
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default CompanyTypes
