/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Edit, RefreshCcw, Save, Trash2, Users } from 'react-feather'
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
import { deleteModule } from '../../../utility/apis/moduleApis'
import { addUserTypes, editUserTypes, loadUserTypes } from '../../../utility/apis/userTypes'
import { Patterns } from '../../../utility/Const'
import { FM, getInitials } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import { SuccessToast } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'

const UserTypes = () => {
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

  const onSubmitNew = (jsonData) => {
    addUserTypes({
      jsonData,
      dispatch,
      loading: setLoading
    })
  }

  // Edit
  const onSubmitEdit = (jsonData) => {
    jsonData.status = jsonData?.status ? 1 : 0

    if (jsonData.name !== edit.name || jsonData.status !== edit.status) {
      editUserTypes({
        id: edit.id,
        loading: setLoading,
        jsonData: {
          ...jsonData,
          id: edit.id
        },
        dispatch
      })
    }
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
    }
  }, [])

  // Esc key
  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)
    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const gridView = (item, index) => {
    const avatar =
      item?.gender === 'male'
        ? require('../../../assets/images/avatars/Originals/male2.png')
        : require('../../../assets/images/avatars/Originals/company.png')
    return (
      <>
        <div key={`userType-card-${index}`} className='flex-1'>
          {/* <div style={{ border: "3px solid #ffcfcf" }}></div> */}
          <Card className=''>
            <CardBody className='animate__animated animate__flipInX'>
              <Row noGutters className='align-items-center'>
                <Show IF={edit?.id === item?.id}>
                  <Col xs='12'>
                    <Form className='' onSubmit={handleSubmit(onSubmitEdit)}>
                      <FormGroupCustom
                        prepend={
                          <>
                            <InputGroupText>
                              <FormGroupCustom
                                noLabel
                                noGroup
                                value={item?.status}
                                control={control}
                                name='status'
                                message={FM('change-status')}
                                type={'checkbox'}
                                errors={errors}
                              />
                            </InputGroupText>
                          </>
                        }
                        value={item?.name}
                        noLabel
                        control={control}
                        errors={errors}
                        type='text'
                        name='name'
                        rules={{ required: true, maxLength: 35 }}
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
                          </>
                        }
                      />
                    </Form>
                  </Col>
                </Show>
                <Hide IF={edit?.id === item.id}>
                  <Col xs='2'>
                    <Avatar color='light-primary' content={getInitials(item?.name)} />
                  </Col>
                  <Col xs='7'>
                    <p className='text-truncate m-0' title={item?.name}>
                      {item?.name}
                    </p>
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
      <Header icon={<Users size={25} />} subHeading={<>{FM('usertypes')}</>}>
        {/* Tooltips */}

        <Show IF={formVisible}>
          <div class='animate__animated animate__bounceInLeft animate__faster'>
            <Form className='me-1' onSubmit={handleSubmit(onSubmitNew)}>
              <FormGroupCustom
                noLabel
                placeholder={FM('enter-name')}
                type='text'
                name='name'
                control={control}
                errors={errors}
                bsSize='sm'
                rules={{ required: true, maxLength: 35 }}
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
                  </>
                }
              />
            </Form>
          </div>
        </Show>

        {/* Buttons */}
        <ButtonGroup>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
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
        loadFrom={loadUserTypes}
        selector='userTypesApis'
        state='userType'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}
export default UserTypes
