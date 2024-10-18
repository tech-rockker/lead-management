/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'

import { ThemeColors } from '@src/utility/context/ThemeColors'

import { useParams } from 'react-router-dom'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Edit, Filter, Plus, RefreshCcw, Save, Search, Sliders, Trash2, X } from 'react-feather'
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

import { Patterns } from '../../../../utility/Const'
import {
  languageLabelLoad,
  languageLabelDelete,
  languageLabelSave,
  languageLabelEdit,
  languageListGet,
  languageDelete
} from '../../../../utility/apis/languageLabel'
import { FM, getInitials, isValid, log } from '../../../../utility/helpers/common'
import ConfirmAlert from '../../../../utility/helpers/ConfirmAlert'
import Hide from '../../../../utility/Hide'
import { Permissions } from '../../../../utility/Permissions'
import Show from '../../../../utility/Show'
// import { SuccessToast } from '../../../../utility/Utils'
import LoadingButton from '../../../components/buttons/LoadingButton'
import FormGroupCustom from '../../../components/formGroupCustom'
import TableGrid from '../../../components/tableGrid'
import BsTooltip from '../../../components/tooltip'
import Header from '../../../header'
import { SuccessToast } from '../../../../utility/Utils'

const Label = () => {
  const params = useParams()
  const id = params?.id
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const {
    formState: { errors },
    handleSubmit,
    control
  } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(null)
  const [failed, setFailed] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [filterData, setFilterData] = useState({
    label_value: '',
    label_name: '',
    page: 1
  })
  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const onSubmitNew = (data) => {
    setFilterData(data)
    // languageLabelSave({
    //     jsonData: {

    //     },
    //     loading: setLoading,
    //     dispatch,
    //     success: (data) => {
    //         showForm()
    //         setAdded(data?.payload?.id)
    //     },
    //     error: () => { }
    // })
  }

  const onSubmitEdit = (data) => {
    // jsonData.status = jsonData?.status ? 1 : 0
    languageLabelEdit({
      id: edit.id,
      jsonData: {
        ...edit,
        language_id: isValid(id) ? id : edit?.language_id,
        label_value: isValid(data?.label_value) ? data?.label_value : edit?.label_value,
        id: edit.id
      },
      dispatch,
      loading: setLoading,
      success: () => {
        setEdit(null)

        SuccessToast('done')
      }
    })
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

  useEffect(() => {
    setReload(true)
  }, [filterData])
  const gridView = (item, index) => {
    return (
      <>
        <div key={`userType-card-${index}`} className='flex-1'>
          <Card className=''>
            <CardBody className='animate__animated animate__flipInX'>
              <Row noGutters className='align-items-center'>
                <Show IF={edit?.id === item?.id}>
                  <Col xs='12'>
                    <div>
                      <Form className='' onSubmit={handleSubmit(onSubmitEdit)}>
                        <FormGroupCustom
                          value={item?.label_value}
                          noLabel
                          control={control}
                          errors={errors}
                          type='text'
                          name='label_value'
                          label={FM('enter-value')}
                          placeholder={FM('enter-value')}
                          rules={{ required: true }}
                          append={
                            <>
                              <LoadingButton
                                tooltip={FM('save')}
                                loading={loading}
                                type='submit'
                                size='sm'
                                color='primary'
                              >
                                <Save size='14' />
                              </LoadingButton>
                              <Button.Ripple
                                size='sm'
                                color='danger'
                                id='reload'
                                onClick={() => {
                                  setEdit(null)
                                }}
                              >
                                <X size='14' />
                              </Button.Ripple>
                            </>
                          }
                        />
                      </Form>
                    </div>
                  </Col>
                </Show>
                <Hide IF={edit?.id === item?.id}>
                  {/* <Col xs="2" className='d-flex'>
                                        <Avatar color={item?.status === 1 ? 'light-primary' : 'light-primary'} content={getInitials(item?.label_value)} />
                                    </Col> */}
                  <Col xs='9'>
                    <p className=' m-0 text-primary' title={item?.label_value}>
                      {item?.label_value}
                    </p>
                    <p className='m-0 text-small-12 text-muted' title={item?.label_name}>
                      {item?.label_name}
                    </p>
                  </Col>

                  <Col xs='3' className='d-flex justify-content-end'>
                    <Show IF={Permissions.importLanguage}>
                      <UncontrolledTooltip target={`grid-edit-${item?.id}`} autohide={true}>
                        {FM('edit')}
                      </UncontrolledTooltip>
                      <span
                        role={'button'}
                        id={`grid-edit-${item?.id}`}
                        onClick={() => {
                          setEdit(item)
                        }}
                      >
                        <Edit color={colors.primary.main} size='18' />
                      </span>
                    </Show>
                  </Col>
                </Hide>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Header>
        {/* Tooltips */}

        <Show IF={formVisible}>
          <div className='animate__animated animate__bounceInLeft animate__faster'>
            <Form className='me-1' onSubmit={handleSubmit(onSubmitNew)}>
              <FormGroupCustom
                noLabel
                placeholder={FM('enter-word')}
                type='text'
                name='label_value'
                control={control}
                errors={errors}
                bsSize='sm'
                // rules={{ required: true, maxLength: 35  }}
                append={
                  <>
                    <LoadingButton
                      tooltip={FM('save')}
                      loading={loading}
                      type='submit'
                      size='sm'
                      color='primary'
                    >
                      <Search size='14' />
                    </LoadingButton>
                  </>
                }
              />
            </Form>
          </div>
        </Show>

        {/* Buttons */}
        <ButtonGroup>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Show IF={Permissions.importLanguage}>
            <BsTooltip
              title={formVisible ? FM('close') : FM('search')}
              Tag={Button.Ripple}
              onClick={showForm}
              size='sm'
              color={formVisible ? 'danger' : 'primary'}
            >
              <Show IF={formVisible}>
                <X size='14' />
              </Show>
              <Hide IF={formVisible}>
                <Sliders size='14' />
              </Hide>
            </BsTooltip>
          </Show>

          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setReload(true)
              setEdit(null)
              setFilterData(null)
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
        loadFrom={languageLabelLoad}
        selector='languageLabel'
        params={{
          ...filterData
        }}
        jsonData={{
          ...filterData,
          page: filterData?.page,
          // label_name: filterData?.label_value ?? null,
          // label_value: filterData?.label_value ?? null,
          language_id: id
        }}
        state='label'
        display='grid'
        gridCol='6'
        gridView={gridView}
      />
    </>
  )
}

export default Label
