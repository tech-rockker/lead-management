/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Bluetooth, RefreshCcw } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { addModule, editModule, loadModule } from '../../../utility/apis/moduleApis'
import { FM, getInitials, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import { SuccessToast } from '../../../utility/Utils'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'

const Modules = () => {
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
  const [deleted, setDeleted] = useState(null)
  const [failed, setFailed] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)

  const showForm = () => {
    setFormVisible(!formVisible)
  }
  // log(loadActivityCls)
  const onSubmitNew = (jsonData) => {
    addModule({
      jsonData,
      loading: setLoading,
      dispatch,
      success: (data) => {
        showForm()
        reset()
        setAdded(data?.payload?.id)
        SuccessToast('done')
      },
      error: () => {}
    })
  }

  const onSubmitEdit = (jsonData) => {
    log(jsonData)
    jsonData.status = jsonData?.status ? 1 : 0

    if (jsonData.name !== edit.name || jsonData.status !== edit.status) {
      editModule({
        id: edit.id,
        jsonData: {
          ...jsonData,
          id: edit.id
        },
        dispatch,
        loading: setLoading,
        success: () => {
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
                                            prepend={
                                                <InputGroupText>
                                                    <FormGroupCustom
                                                        control={control}
                                                        name="status"
                                                        errors={errors}
                                                        value={item?.status}
                                                        noLabel
                                                        noGroup
                                                        message={FM("change-status")}
                                                        type="checkbox"
                                                    />
                                                </InputGroupText>
                                            }
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
              <Hide IF={edit?.id === item?.id}>
                <Col xs='2'>
                  <Avatar
                    color={item?.status === 1 ? 'light-primary' : 'light-warning'}
                    content={getInitials(item.name)}
                  />
                </Col>
                <Col xs='7'>
                  <p className='text-truncate m-0' title={item?.name}>
                    {item?.name}
                  </p>
                  <p className='m-0 status-text'>
                    {FM('status')}: {item?.status === 1 ? FM('active') : FM('inactive')}
                  </p>
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
      <Header icon={<Bluetooth size={25} />} title={FM('Modules')}>
        {/* Tooltips */}
        {/* <UncontrolledTooltip target="filter">{FM("filter")}</UncontrolledTooltip> */}
        {/* <Show IF={formVisible}>
                    <div class="animate__animated animate__bounceInLeft animate__faster">
                        <Form className="me-1" onSubmit={handleSubmit(onSubmitNew)}>
                            <FormGroupCustom
                                size="sm"
                                control={control}
                                autoFocus={true}
                                placeholder={FM("enter-name")}
                                type="text"
                                name="name"
                                noLabel
                                errors={errors}
                                rules={{ required: true , maxLength: 35 }}
                                append={
                                    <LoadingButton tooltip={FM("save")} loading={loading} type="submit" size="sm" color="primary">
                                        <Save size="14" />
                                    </LoadingButton>
                                }
                            />
                        </Form>
                    </div>
                </Show> */}

        {/* Buttons */}
        <ButtonGroup>
          {/* <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip> */}
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          {/* <Button.Ripple id="create-button" onClick={showForm} size="sm" outline color={formVisible ? "danger" : "dark"}>
                        <Show IF={formVisible}>
                            <X size="14" />
                        </Show>
                        <Hide IF={formVisible}>
                            <Plus size="14" />
                        </Hide>
                    </Button.Ripple> */}
          {/* <Button.Ripple size="sm" color="secondary" id="filter">
                        <Sliders size="14" />
                    </Button.Ripple> */}
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
      {/* Category Types */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadModule}
        selector='moduleApis'
        state='module'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}
export default Modules
