import Avatar from '@components/avatar'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Edit,
  Plus,
  RefreshCcw,
  Sliders,
  Users,
  MoreVertical,
  Edit3,
  Delete,
  Trash2,
  Eye,
  Edit2,
  BookOpen,
  Send,
  Lock,
  MessageSquare,
  PhoneCall,
  Mail,
  Calendar,
  User,
  UserCheck,
  DollarSign,
  Key,
  Wind
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
import { IconSizes } from '../../utility/Const'
// ** Styles
import { FM, getInitials, log } from '../../utility/helpers/common'
import TableGrid from '../components/tableGrid'
import BsTooltip from '../components/tooltip'
import Header from '../header'
import { loadSalaryDetail } from '../../utility/apis/salary'

const Salary = () => {
  const { colors } = useContext(ThemeColors)
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)

  const [reload, setReload] = useState(false)
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
                    <BsTooltip title={FM('country')}>
                      {' '}
                      <span> {item?.name}</span>{' '}
                    </BsTooltip>
                  </h5>

                  <p className='text-truncate m-0 text-small-12 fw-bold'>
                    <BsTooltip title={FM('currency')}>
                      {' '}
                      <span> {item?.currency}</span>
                    </BsTooltip>{' '}
                  </p>
                </Col>
              </Row>
            </div>
          </CardHeader>
          <CardBody>
            <Row className='pt-1'>
              <Col md='12'>
                {item?.dial_code ? (
                  <div className='info-list'>
                    <BsTooltip title={FM('dial_code')}>
                      <span className='me-1'>
                        <PhoneCall className='text-primary' size={IconSizes.CardListIcon} />
                      </span>
                      {item?.dial_code}
                    </BsTooltip>
                  </div>
                ) : null}
                {item?.currency_code ? (
                  <div className='info-list'>
                    <BsTooltip title={FM('currency_code')}>
                      <span className='me-1'>
                        <Wind className='text-primary' size={IconSizes.CardListIcon} />
                      </span>
                      {item?.currency_code}
                    </BsTooltip>
                  </div>
                ) : null}
                {item?.currency_symbol ? (
                  <div className='info-list'>
                    <BsTooltip title={FM('currency_symbol')}>
                      <span className='me-1'>
                        <DollarSign className='text-primary' size={IconSizes.CardListIcon} />
                      </span>
                      {item?.currency_symbol}
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

  return (
    <>
      <Header icon={<Users size='25' />} Heading={FM('country-list')}>
        {/* Tooltips */}
        <UncontrolledTooltip target='filter'>{FM('filter')}</UncontrolledTooltip>
        <ButtonGroup color='dark'>
          <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Link to='/companies/create' className='btn btn-outline-dark btn-sm' id='create-button'>
            <Plus size='14' />
          </Link>
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
        loadFrom={loadSalaryDetail}
        selector='salary'
        state='salary'
        display='grid'
        gridCol='4'
        gridView={gridViewDetails}
      />
    </>
  )
}

export default Salary
