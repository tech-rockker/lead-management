/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'
import { SignalCellular0Bar } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Edit, Plus, RefreshCcw, Save, Trash2, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
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
import { wordDelete } from '../../../redux/reducers/redWord'
import { addWord, deleteWord, editWord, loadWord, loadWordAll } from '../../../utility/apis/redWord'

import { FM, getInitials } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'

const RedWord = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const {
    formState: { errors },
    handleSubmit,
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
  const user = useUser()
  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const onSubmitNew = (jsonData) => {
    addWord({
      jsonData,
      loading: setLoading,
      dispatch,
      success: (data) => {
        showForm()
        reset()
        setAdded(data?.payload?.id)
        loadWordAll({
          dispatch
        })
      },
      error: () => {}
    })
  }

  const onSubmitEdit = (jsonData) => {
    jsonData.status = jsonData?.status ? 1 : 0

    if (jsonData.name !== edit.name || jsonData.status !== edit.status) {
      editWord({
        id: edit.id,
        jsonData: {
          ...jsonData,
          id: edit.id
        },
        dispatch,
        loading: setLoading,
        success: () => {
          setEdit(null)
          reset()
          loadWordAll({
            dispatch
          })
          // SuccessToast("done")
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
        <div key={`userType-card-${index}`} className='flex-1'>
          {/* <div style={{ border: "3px solid #ffcfcf" }}></div> */}
          <Card className=''>
            <CardBody className='animate__animated animate__flipInX'>
              <Row noGutters className='align-items-center'>
                <Show IF={edit?.id === item?.id}>
                  <Col xs='12'>
                    <div>
                      <Form className='' onSubmit={handleSubmit(onSubmitEdit)}>
                        <FormGroupCustom
                          value={item?.name}
                          noLabel
                          control={control}
                          errors={errors}
                          type='text'
                          name='name'
                          label={FM('enter-word')}
                          placeholder={FM('enter-word')}
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
                  </Col>
                </Show>
                <Hide IF={edit?.id === item?.id}>
                  <Col xs='2'>
                    <Avatar
                      color={item?.status === 1 ? 'light-primary' : 'light-primary'}
                      content={getInitials(item?.name)}
                    />
                  </Col>
                  <Col xs='7'>
                    <p className='text-truncate m-0 text-danger' title={item?.name}>
                      {item?.name}
                    </p>
                  </Col>

                  <Show IF={Can(Permissions.wordsDelete) || Can(Permissions.wordsEdit)}>
                    <Col xs='3' className='d-flex justify-content-end'>
                      <Show
                        IF={
                          Permissions.wordsEdit &&
                          item.top_most_parent_id === user?.top_most_parent_id
                        }
                      >
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
                      <Show
                        IF={
                          Permissions.wordsDelete &&
                          item.top_most_parent_id === user?.top_most_parent_id
                        }
                      >
                        <UncontrolledTooltip target={`grid-delete-${item?.id}`}>
                          {FM('delete')}
                        </UncontrolledTooltip>
                        <Hide IF={edit?.id === item?.id}>
                          <ConfirmAlert
                            item={item}
                            title={FM('delete-this', { name: item?.name })}
                            color='text-warning'
                            onClickYes={() => deleteWord({ id: item?.id })}
                            onSuccessEvent={(item) =>
                              dispatch(wordDelete(item?.id), setReload(true))
                            }
                            className='ms-1'
                            id={`grid-delete-${item?.id}`}
                          >
                            <Trash2 color={colors.danger.main} size='18' />
                          </ConfirmAlert>
                        </Hide>
                      </Show>
                    </Col>
                  </Show>
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
      <Header icon={<SignalCellular0Bar size={25} />}>
        {/* Tooltips */}

        <Show IF={formVisible}>
          <div className='animate__animated animate__bounceInLeft animate__faster'>
            <Form className='me-1' onSubmit={handleSubmit(onSubmitNew)}>
              <FormGroupCustom
                noLabel
                placeholder={FM('enter-word')}
                type='text'
                name='name'
                control={control}
                errors={errors}
                bsSize='sm'
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
                  </>
                }
              />
            </Form>
          </div>
        </Show>

        {/* Buttons */}
        <ButtonGroup>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Show IF={Permissions.wordsAdd}>
            <BsTooltip
              title={formVisible ? FM('close') : FM('create-new')}
              Tag={Button.Ripple}
              onClick={showForm}
              size='sm'
              color={formVisible ? 'danger' : 'primary'}
            >
              <Show IF={formVisible}>
                <X size='14' />
              </Show>
              <Hide IF={formVisible}>
                <Plus size='14' />
              </Hide>
            </BsTooltip>
          </Show>

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
        loadFrom={loadWord}
        selector='redWord'
        state='word'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default RedWord
