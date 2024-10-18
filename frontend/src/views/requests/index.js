import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  CheckCircle,
  HelpCircle,
  Mail,
  MapPin,
  PhoneCall,
  Plus,
  RefreshCcw,
  User,
  XCircle
} from 'react-feather'
import { useLocation } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { LoadRequest } from '../../utility/apis/requests'
import { forDecryption, UserTypes } from '../../utility/Const'
import { FM, isValid } from '../../utility/helpers/common'
import Hide from '../../utility/Hide'
import useUser from '../../utility/hooks/useUser'
import Show from '../../utility/Show'
import { decryptObject, formatDate } from '../../utility/Utils'
import TableGrid from '../components/tableGrid'
import MiniTable from '../components/tableGrid/miniTable'
import BsTooltip from '../components/tooltip'
import Header from '../header'
import ApproveModal from './fragment/ApproveModal'
import RequestModalForm from './fragment/RequestModalForm'
const CompanyTypes = () => {
  const { colors } = useContext(ThemeColors)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [edit, setEdit] = useState([])
  const user = useUser()
  const [response, setResponse] = useState([])
  const [filterData, setFilterData] = useState(null)
  const [replyModal, setReplyModal] = useState(false)
  const location = useLocation()
  const notification = location?.state?.notification
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
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
  }, [response])

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  useEffect(() => {
    if (notification?.data_id) {
      setEdit({
        id: notification?.data_id
      })
    }
    window.history.replaceState({ fffff: 'kj' }, document.title)
  }, [notification])

  const gridView = (data, index) => {
    const item = {
      ...data,
      user: decryptObject(forDecryption, data?.user)
    }
    return (
      <>
        <Card
          className={classNames({
            'animate__animated animate__bounceIn': index === 0 && item.id === added,
            'border border-primary border-5': item?.id === notification?.data_id
          })}
        >
          <CardBody className='mb-0'>
            <Row className='align-items-center'>
              <Col xs='12'>
                <p className='m-0 text-primary'>
                  <span className='text-truncate text-dark fw-bolder h6 m-0 mb-3px'>
                    {FM('name')}
                  </span>
                  : {item?.user?.name}
                </p>
                <p className='m-0 text-primary'>
                  <span className='text-truncate text-dark fw-bolder h6 m-0 mb-3px'>
                    {FM('Modules')}
                  </span>
                  : {item?.module_names}
                </p>
                <p className='m-0 text-primary'>
                  <span className='text-truncate text-dark fw-bolder h6 m-0 mb-3px'>
                    {FM('status')}
                  </span>
                  :{' '}
                  {item?.status === '1' ? (
                    <span className='text-success'>{FM('approved')}</span>
                  ) : item?.status === '2' ? (
                    <span className='text-danger'>{FM('rejected')}</span>
                  ) : (
                    <span className='text-danger'>{FM('pending')}</span>
                  )}
                </p>
                <p className='mb-0 text-primary'>
                  <span className='text-truncate text-dark fw-bolder h6 m-0 mb-3px'>
                    {FM('date')}
                  </span>
                  : {formatDate(item?.created_at, 'DD MMMM, YYYY')}
                </p>
                <p className=' mt-1 mb-0 text-primary'>
                  <span className='text-truncate text-dark fw-bolder h6 m-0 mb-3px'>
                    {FM('comment')}
                  </span>
                  : {item?.request_comment}
                </p>
              </Col>
            </Row>
            <Show IF={user?.user_type_id === UserTypes.company && isValid(item?.reply_comment)}>
              <p className='m-0 text-primary'>
                <span className='text-truncate text-dark fw-bolder h6 m-0 mb-3px'>
                  {FM('reply-comment')}
                </span>
                : {item?.reply_comment ?? 'N/A'}
              </p>
            </Show>
          </CardBody>
          <Hide IF={user?.user_type_id !== UserTypes.admin}>
            <CardBody className='p-0 pb-1 border-top'>
              <Hide IF={item?.status === '1'}>
                <Row noGutters className='d-flex align-items-start justify-content-center'>
                  <Hide IF={item?.status === '2'}>
                    <Col md='2' xs='2' className='mt-0'>
                      <BsTooltip title={FM('rejected')}>
                        <div role='button' className={classNames('text-center')}>
                          <div className='d-flex justify-content-center mt-1'>
                            <div
                              className='position-relative'
                              onClick={() => {
                                setEdit({ ...item, status: '2' })
                                setReplyModal(true)
                              }}
                            >
                              <XCircle className='text-danger' style={{ width: 25, height: 25 }} />
                            </div>
                          </div>
                        </div>
                      </BsTooltip>
                    </Col>
                  </Hide>
                  <Hide IF={item?.status === '2'}>
                    <Col md='2' xs='2' className='mt-0'>
                      <BsTooltip title={FM('approved')}>
                        <div role='button' className={classNames('text-center')}>
                          <div className='d-flex justify-content-center mt-1'>
                            <div
                              className='position-relative'
                              onClick={() => {
                                setEdit({ ...item, status: '1' })
                                setReplyModal(true)
                              }}
                            >
                              <CheckCircle
                                className='text-success'
                                style={{ width: 25, height: 25 }}
                              />
                            </div>
                          </div>
                        </div>
                      </BsTooltip>
                    </Col>
                  </Hide>
                </Row>
              </Hide>
              <Show IF={item?.status === '1'}>
                <Row>
                  <Col className='ms-2 mt-1'>
                    <BsTooltip title={`${FM('reply')}`}>{item?.reply_comment}</BsTooltip>
                  </Col>
                </Row>
              </Show>
              <Show IF={item?.status === '2'}>
                <Row>
                  <Col className='ms-2 mt-1'>
                    <BsTooltip title={`${FM('reply')}`}>{item?.reply_comment}</BsTooltip>
                  </Col>
                </Row>
              </Show>
            </CardBody>
          </Hide>
        </Card>
      </>
    )
  }

  return (
    <>
      <ApproveModal
        responseData={(e) => {
          setReload(true)
          setFilterData({ a: '' })
        }}
        showModal={replyModal}
        setShowModal={(e) => setReplyModal(e)}
        followId={edit?.id}
        edit={edit}
        noView
      />
      <Header icon={<HelpCircle size={25} />} subHeading={<>{FM('request-log')}</>}>
        {/* Buttons */}

        <ButtonGroup>
          <Hide IF={user?.user_type_id !== UserTypes.company}>
            <RequestModalForm
              responseData={() => {
                setReload(true)
                setFilterData({ a: '' })
              }}
              Component={Button.Ripple}
              size='sm'
              color='primary'
              id='create-button'
            >
              <Plus size='16' />
            </RequestModalForm>
          </Hide>

          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setReload(true)
              setFilterData({ a: '' })
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
        loadFrom={LoadRequest}
        jsonData={{ ...filterData }}
        selector='requests'
        state='requests'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default CompanyTypes
