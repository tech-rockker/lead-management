import { AccountBalance } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  DollarSign,
  Eye,
  Lock,
  Mail,
  MessageSquare,
  MoreVertical,
  Plus,
  RefreshCcw,
  Send,
  Sliders,
  Trash2,
  Users
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { bankDelete } from '../../../redux/reducers/bank'
import { getPath } from '../../../router/RouteHelper'
import { deleteBank, loadBank } from '../../../utility/apis/banks'
import { IconSizes } from '../../../utility/Const'
// ** Styles
import { FM, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { formatDate } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import TableGrid from '../../components/tableGrid'
import MiniTable from '../../components/tableGrid/miniTable'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import BankAddUpdate from './bankAddUpdate'
import DetailView from './detailView'

const Bank = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [viewAdd, setViewAdd] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const params = useParams()
  const prent = parseInt(params?.id)
  const [filterData, setFilterData] = useState(null)
  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
    }
  }, [])

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(false)
      setViewAdd(false)
      // setEdit(null)
    }
  }

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
    log(item)
    return (
      <>
        <Card className='animate__animated animate__fadeInUp'>
          <CardBody>
            <div className='role-heading'>
              <Row>
                <Col xs='10'>
                  <BsTooltip
                    title={item?.bank_name}
                    Tag={'h4'}
                    className='fw-bolder text-truncate  mb-0 mt-0 text-capitalize'
                  >
                    {item?.bank_name}
                  </BsTooltip>
                </Col>
                <Col xs='2' className='d-flex align-items-center justify-content-end pe-1'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      {
                        IF: Permissions.bankRead,
                        icon: <Eye size={14} />,
                        onClick: () => {
                          setViewAdd(true)
                          setEdit(item)
                        },
                        name: FM('view')
                      },
                      {
                        IF: Permissions.bankEdit,
                        icon: <Send size={14} />,
                        onClick: () => {
                          setShowAdd(true)
                          setEdit(item)
                        },
                        name: FM('edit')
                      },
                      {
                        IF: Permissions.bankDelete,
                        icon: <Trash2 size={14} />,
                        name: (
                          <ConfirmAlert
                            item={item}
                            title={FM('delete-this', { name: item?.bank_name })}
                            color='text-warning'
                            onClickYes={() => deleteBank({ id: item?.id, dispatch })}
                            onSuccessEvent={(item) => {
                              dispatch(bankDelete(item?.id))
                            }}
                            className=''
                            id={`grid-delete-${item?.id}`}
                          >
                            {FM('delete')}
                          </ConfirmAlert>
                        )
                      }
                      // {
                      //     icon: <Lock size={14} />,
                      //     name: FM("license"),
                      //     onClick: () => {

                      //     }
                      // },
                      // {
                      //     icon: <MessageSquare size={14} />,
                      //     name: FM("Message"),
                      //     onClick: () => {

                      //     }
                      // }
                    ]}
                  />
                </Col>
              </Row>
              <p className='mb-0 mt-1'>
                <MiniTable
                  labelProps={{ md: '4' }}
                  valueProps={{ md: 7 }}
                  label={'account-number'}
                  value={item?.account_number}
                />
                <MiniTable
                  labelProps={{ md: '4' }}
                  valueProps={{ md: 7 }}
                  label={'clearance-number'}
                  value={item?.clearance_number}
                />
                <MiniTable
                  labelProps={{ md: '4' }}
                  valueProps={{ md: 7 }}
                  label={'added-date'}
                  value={formatDate(item?.created_at, 'DD MMMM, YYYY')}
                />
              </p>
            </div>
          </CardBody>
        </Card>
      </>
    )
  }
  return (
    <>
      <BankAddUpdate
        isEdit
        showModal={showAdd}
        setShowModal={handleClose}
        bankId={edit?.id}
        noView
      />
      <DetailView showModals={viewAdd} setShowModals={handleClose} bankId={edit?.id} noView />
      <Header icon={<AccountBalance size='30' />}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
        <ButtonGroup color='dark'>
          <Show IF={Permissions.bankAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <BankAddUpdate Component={Button.Ripple} size='sm' color='primary' id='create-button'>
              <Plus size='16' />
            </BankAddUpdate>
          </Show>
          <Button.Ripple size='sm' color='secondary' id='filter'>
            <Sliders size='14' />
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

      {/* Category Types */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadBank}
        jsonData={{
          ...filterData
        }}
        selector='bank'
        state='bank'
        display='grid'
        gridCol='6'
        gridView={gridView}
      />
    </>
  )
}

export default Bank
