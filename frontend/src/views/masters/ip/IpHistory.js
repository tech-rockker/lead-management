import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Edit,
  Eye,
  Lock,
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
import { getPath } from '../../../router/RouteHelper'
import { deletePatientPlan, loadPatientPlanList, ipHistoryEdit } from '../../../utility/apis/ip'
import { IconSizes } from '../../../utility/Const'
// ** Styles
import { FM } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { formatDate, numberFormat, WarningToast } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import TableGrid from '../../components/tableGrid'
import MiniTable from '../../components/tableGrid/miniTable'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'

const ImplementationHistory = () => {
  const { colors } = useContext(ThemeColors)
  const params = useParams()
  const id = parseInt(params.id)
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(null)
  const [reload, setReload] = useState(true)
  const [added, setAdded] = useState(null)
  const showForm = () => {
    setFormVisible(!formVisible)
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
            'animate__animated animate__bounceIn': index === 0 && item.id === added
          })}
        >
          <CardBody>
            <div className='role-heading'>
              <Row>
                <Col xs='10'>
                  <BsTooltip
                    title={item?.what_happened}
                    Tag={'h4'}
                    className='fw-bolder text-truncate  mb-0 mt-0 text-capitalize'
                  >
                    {item?.what_happened}
                  </BsTooltip>
                </Col>
                <Col xs='2' className='d-flex align-items-center justify-content-end pe-1'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      // {
                      //     IF: Permissions.ipSelfRead,
                      //     icon: <Eye size={14} />,
                      //     to: { pathname: getPath('implementations.detail', { id: item.id }), state: { data: item } },
                      //     name: FM("view")
                      // },
                      {
                        IF: Permissions.ipSelfEdit,
                        icon: <Send size={14} />,
                        to: {
                          pathname: getPath('implementations.update', { id: item.id }),
                          state: { data: item }
                        },
                        name: FM('edit')
                      },
                      {
                        IF: Permissions.ipSelfDelete,
                        icon: <Trash2 size={14} />,
                        name: FM('delete'),
                        onClick: () => {
                          const confirmBox = window.confirm(
                            FM(' Do you really want to delete this Implementation Plan?')
                          )
                          if (confirmBox === true) {
                            deletePatientPlan({
                              id: item?.id,
                              loading: setLoading,
                              success: WarningToast('Data Deleted'),
                              error: setFailed
                            })
                          }
                        }
                      }
                    ]}
                  />
                </Col>
              </Row>
              <p className='text-truncate text-primary text-small-12 fw-bold'>
                {item?.how_it_happened}
              </p>
              <p className='mb-0 mt-1'>
                <MiniTable
                  labelProps={{ md: '4' }}
                  valueProps={{ md: 7 }}
                  label={'goal'}
                  value={item?.goal}
                />
                <MiniTable
                  labelProps={{ md: '4' }}
                  valueProps={{ md: 7 }}
                  label={'remark'}
                  value={item?.remark}
                />
                <MiniTable
                  labelProps={{ md: '4' }}
                  valueProps={{ md: 7 }}
                  label={'added-date'}
                  value={formatDate(item?.created_at, 'DD MMMM, YYYY')}
                />
                <MiniTable
                  labelProps={{ md: '4' }}
                  valueProps={{ md: 7 }}
                  label={'what-to-do'}
                  value={item?.what_to_do}
                />
              </p>
            </div>
            <div className='d-flex mt-1 text-muted justify-content-between'>
              <span>
                {item?.reason_for_editing ? item?.reason_for_editing : item?.activity_message}
              </span>
            </div>
            <div className='d-flex d-none justify-content-end align-items-end mt-1'>
              <Show IF={Permissions.ipSelfEdit}>
                <BsTooltip
                  Tag={Link}
                  title={FM('edit')}
                  role={'button'}
                  to={{
                    pathname: getPath('implementations.update', { id: item.id }),
                    state: { data: item }
                  }}
                >
                  <Edit color={colors.primary.main} size='18' />
                </BsTooltip>
              </Show>
              <Show IF={Permissions.ipSelfEdit}>
                <BsTooltip
                  className='ms-1'
                  Tag={Link}
                  title={FM('view')}
                  role={'button'}
                  to={{
                    pathname: getPath('companies.detail', { id: item.id }),
                    state: { data: item }
                  }}
                >
                  <Eye color={colors.info.main} size='18' />
                </BsTooltip>
              </Show>
            </div>
          </CardBody>
        </Card>
      </>
    )
  }
  return (
    <>
      <Header icon={<Users size='25' />}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <ButtonGroup color='dark'>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Show IF={Permissions.ipSelfAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <Link
              to='/implementation-plans/create'
              className='btn btn-outline-dark btn-sm'
              id='create-button'
            >
              <Plus size='14' />
            </Link>
          </Show>
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
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={ipHistoryEdit}
        jsonData={{
          parent_id: id
        }}
        selector='ip'
        state='ip'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default ImplementationHistory
