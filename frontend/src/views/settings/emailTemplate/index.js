import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Edit,
  Eye,
  Lock,
  Mail,
  MessageSquare,
  MoreVertical,
  Plus,
  RefreshCcw,
  Send,
  Sliders,
  Users
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { getPath } from '../../../router/RouteHelper'
import { loadEmailTemplate } from '../../../utility/apis/emailTemplate'
import { IconSizes } from '../../../utility/Const'
// ** Styles
import { FM, log } from '../../../utility/helpers/common'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { formatDate } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import TableGrid from '../../components/tableGrid'
import MiniTable from '../../components/tableGrid/miniTable'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import DetailView from './detailView'
import EmailAddUpdate from './emailAddUpdate'

const EmailTemplate = () => {
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
    }
    setEdit(null)
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
                    title={item?.mail_sms_for}
                    Tag={'h4'}
                    className='fw-bolder text-truncate  mb-0 mt-0 text-capitalize'
                  >
                    {item?.mail_sms_for}
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
                        IF: Permissions.emailTemplateRead,
                        icon: <Eye size={14} />,
                        onClick: () => {
                          setViewAdd(true)
                          setEdit(item)
                        },
                        name: FM('view')
                      },
                      {
                        IF: Permissions.emailTemplateEdit,
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowAdd(true)
                          setEdit(item)
                        },
                        name: FM('edit')
                      }
                    ]}
                  />
                </Col>
              </Row>
              <p className='mb-0 mt-1'>
                <MiniTable
                  labelProps={{ md: '4' }}
                  valueProps={{ md: 7 }}
                  label={'mail-subject'}
                  value={item?.mail_subject}
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
                  label={'mail-body'}
                  value={item?.mail_body}
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
      <EmailAddUpdate
        isEdit
        showModal={showAdd}
        setShowModal={handleClose}
        emailTemplateId={edit?.id}
        noView
      />
      <DetailView
        showModals={viewAdd}
        setShowModals={handleClose}
        emailTemplateId={edit?.id}
        noView
      />
      <Header icon={<Mail size='25' />}>
        {/* Tooltips */}
        {/* <UncontrolledTooltip target="filter">{FM("filter")}</UncontrolledTooltip> */}

        <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
        <ButtonGroup color='dark'>
          {/* <Show IF={Permissions.emailTemplateAdd}>
                        <UncontrolledTooltip target="create-button">{FM("create-new")}</UncontrolledTooltip>
                        <EmailAddUpdate Component={Button.Ripple} size="sm" color="primary" id="create-button">
                            <Plus size="16" />
                        </EmailAddUpdate>
                    </Show> */}
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
        loadFrom={loadEmailTemplate}
        jsonData={{
          ...filterData
        }}
        selector='emailTemplate'
        state='emailTemplate'
        display='grid'
        gridCol='6'
        gridView={gridView}
      />
    </>
  )
}

export default EmailTemplate
