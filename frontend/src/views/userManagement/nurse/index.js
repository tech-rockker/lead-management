import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Calendar,
  Eye,
  Lock,
  Mail,
  MessageSquare,
  MoreVertical,
  PhoneCall,
  Plus,
  RefreshCcw,
  Send,
  Sliders,
  Trash2,
  UserCheck,
  Users
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  UncontrolledTooltip
} from 'reactstrap'
import { getPath } from '../../../router/RouteHelper'
import { loadUser } from '../../../utility/apis/userManagement'
import { IconSizes } from '../../../utility/Const'
// ** Styles
import { FM, getInitials } from '../../../utility/helpers/common'
import { formatDate } from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import EmployeeFilter from './employeeFilter'

const Nurse = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(true)
  const [added, setAdded] = useState(null)
  const [employeeFilter, setEmployeeFilter] = useState(false)
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

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])
  ////////////////
  const gridViewDetails = (item, index) => {
    return (
      <>
        <Card className={classNames('')}>
          <CardHeader className='border-bottom'>
            <div className='flex-1'>
              <Row className='align-items-center'>
                <Col xs='2'>
                  <Avatar
                    color='light-primary'
                    contentStyles={{
                      fontSize: 'calc(20px)',
                      width: '100%',
                      height: '100%'
                    }}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 8
                    }}
                    content={getInitials(item.name)}
                  />
                </Col>
                <Col xs='8' className=''>
                  <h5 className='text-truncate m-0 text-capitalize' title={item?.name}>
                    {item?.name}
                  </h5>
                  <p className='text-truncate m-0 text-small-12 fw-bold'>
                    {item?.company_type?.name}
                  </p>
                </Col>

                <Col xs='2' className='d-flex align-items-center justify-content-end pe-1'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      {
                        icon: <Eye size={14} />,
                        to: {
                          pathname: getPath('users.nurses.detail', { id: item?.id }),
                          state: { data: item }
                        },
                        name: FM('view')
                      },
                      {
                        icon: <Edit size={14} />,
                        to: {
                          pathname: getPath('users.nurses.update', { id: item?.id }),
                          state: { data: item }
                        },
                        name: FM('edit')
                      },
                      {
                        icon: <Trash2 size={14} />,
                        name: FM('delete'),
                        onClick: () => {}
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
            </div>
          </CardHeader>
          <CardBody>
            <Row className='pt-1'>
              <Col md='12'>
                {item?.contact_number ? (
                  <div className='info-list'>
                    <BsTooltip title={FM('all-patients')}>
                      <a className='text-dark' href={`tel:${item?.contact_number}`}>
                        <span className='me-1'>
                          <PhoneCall className='text-primary' size={IconSizes.CardListIcon} />
                        </span>
                        {item?.contact_number}
                      </a>
                    </BsTooltip>
                  </div>
                ) : null}
                {item?.email ? (
                  <div className='info-list'>
                    <BsTooltip title={FM('send-email')}>
                      <a className='text-dark' href={`mailto:${item?.email}`}>
                        <span className='me-1'>
                          <Mail className='text-primary' size={IconSizes.CardListIcon} />
                        </span>
                        {item?.email}
                      </a>
                    </BsTooltip>
                  </div>
                ) : null}
                {item?.joining_date ? (
                  <div className='info-list'>
                    <BsTooltip title={FM('joining-date')}>
                      <span className='me-1'>
                        <Calendar className='text-primary' size={IconSizes.CardListIcon} />
                      </span>
                      {formatDate(item?.joining_date, 'DD MMMM, YYYY')}
                    </BsTooltip>
                  </div>
                ) : null}
                {item?.gov_id ? (
                  <div className='info-list'>
                    <BsTooltip title={FM('gov-id')}>
                      <span className='me-1'>
                        <UserCheck className='text-primary' size={IconSizes.CardListIcon} />
                      </span>
                      {item?.gov_id}
                    </BsTooltip>
                  </div>
                ) : null}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    )
  }

  //////////////////
  // const gridView = (item, index) => {
  //     return (<>
  //         <Card className={classNames("animate__animated animate__bounceIn")}>
  //             <CardBody>
  //                 <Row className="align-items-center">
  //                     <Col lg="3" xs="3" md='4' >
  //                         <Avatar color='light-primary'
  //                             contentStyles={{
  //                                 borderRadius: 0,
  //                                 fontSize: 'calc(36px)',
  //                                 width: '100%',
  //                                 height: '100%'
  //                             }}
  //                             style={{
  //                                 height: '60px',
  //                                 width: '60px'
  //                             }}
  //                             content={getInitials(item.name)} />
  //                     </Col>
  //                     <Col xs="6" md='6' lg='8'>
  //                         <h5 className="text-truncate m-0" title={item?.name}>
  //                             {item?.name}
  //                         </h5>
  //                         <p className="text-truncate m-0">
  //                             {item?.email}
  //                         </p>

  //                         <p className="text-truncate m-0">
  //                             {FM("contact_number")}: {item?.contact_number}
  //                         </p>
  //                         <p className="text-truncate m-0">
  //                             {FM("astablishment_date")}: {item?.astablishment_date}
  //                         </p>
  //                     </Col>
  //                     <UncontrolledTooltip target={`grid-edit-${item.id}`} autohide={true}>
  //                         {FM(`details`)}
  //                     </UncontrolledTooltip>

  //                     <Link className="d-flex justify-content-end" onClick={() => { dispatch(commonAction(types.viewCompany, item)) }} to={{ pathname: getPath('companies.detail', { id: item.id }), state: { data: item } }} role={"button"} id={`grid-edit-${item.id}`} >
  //                         <Edit color={colors.primary.main} size="18px" />
  //                     </Link>
  //                 </Row>
  //             </CardBody>
  //         </Card>
  //     </>)
  // }

  return (
    <>
      <EmployeeFilter
        show={employeeFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setEmployeeFilter(false)
        }}
      />
      <Header icon={<Users size='25' />} subHeading={FM('all-nurse')}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <ButtonGroup color='dark'>
          <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Link
            to={getPath('users.nurses.create')}
            className='btn btn-outline-dark btn-sm'
            id='create-button'
          >
            <Plus size='14' />
          </Link>
          <Button.Ripple
            onClick={() => setEmployeeFilter(true)}
            size='sm'
            outline
            color='dark'
            id='filter'
          >
            <Sliders size='14' />
          </Button.Ripple>
          <Button.Ripple
            size='sm'
            outline
            color='dark'
            id='reload'
            onClick={() => {
              setFilterData({})
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
        loadFrom={loadUser}
        jsonData={{
          user_type_id: 5,
          filterData
        }}
        selector='userManagement'
        state='users'
        display='grid'
        gridCol='4'
        gridView={gridViewDetails}
      />
    </>
  )
}

export default Nurse
