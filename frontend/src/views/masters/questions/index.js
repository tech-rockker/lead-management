import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
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
  UserCheck
} from 'react-feather'
import { FM, getInitials, log } from '../../../utility/helpers/common'
import TableGrid from '../../components/tableGrid'
import Header from '../../header'
import AddUpdateQues from './AddUpdateQuestion'
import { Link } from 'react-router-dom'
import Avatar from '@components/avatar'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { useDispatch } from 'react-redux'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import {
  currencyFormat,
  ErrorToast,
  formatDate,
  numberFormat,
  SuccessToast
} from '../../../utility/Utils'
import DropDownMenu from '../../components/dropdown'
import { getPath } from '../../../router/RouteHelper'

import { IconSizes } from '../../../utility/Const'
import MiniTable from '../../components/tableGrid/miniTable'
import BsTooltip from '../../components/tooltip'
// import Hide from '../../../utility/Hide'

import { loadFollowUp } from '../../../utility/apis/followup'
import { deleteWorkShift, loadWorkShift } from '../../../utility/apis/companyWorkShift'
import QuestionFilter from './QuestionFilter'
import { loadQuestion } from '../../../utility/apis/questions'
import { Item } from 'react-contexify'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { QuestionAnswer } from '@material-ui/icons'

const Branches = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [edit, setEdit] = useState(null)
  const [questionFilter, setQuesFilter] = useState(false)
  const params = {
    group_by: 'no'
  }
  const [filterData, setFilterData] = useState(params)
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
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

  //////////////new////
  const gridView1 = (item, index) => {
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
                    title={item?.question}
                    Tag={'h4'}
                    className='fw-bolder text-primary  mb-0 mt-0 text-capitalize'
                  >
                    {item?.question}
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
                      //     icon: <Eye size={14} />,
                      //     to: { pathname: getPath('companies.detail', { id: item.id }), state: { data: item } },
                      //     name: FM("view")
                      // },
                      {
                        IF: Permissions.questionsEdit,
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowAdd(true)
                          setEdit(item)
                        },
                        name: FM('edit')
                      }
                      // {
                      //     icon: <Trash2 size={14} />,
                      //     name: FM("delete"),
                      //     onClick: () => {
                      //         const confirmBox = window.confirm(
                      //             FM(" Do you really want to delete this Work Shift?")
                      //         )
                      //         if (confirmBox === true) {
                      //             deleteWorkShift({ id: item?.id, dispatch = () => { } , success: ErrorToast("work-shift-deleted"), error: setFailed })
                      //         }

                      //     }
                      // },
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
                {/* 
                            <MiniTable
                                labelProps={{ md: "4" }}
                                valueProps={{ md: 7 }}
                                label={"email"}
                                value={(item?.email)}
                            />
                            <MiniTable
                                labelProps={{ md: "4" }}
                                valueProps={{ md: 7 }}
                                label={"start-time"}
                                value={item?.start_date}
                            /> */}
                <MiniTable
                  labelProps={{ md: '4' }}
                  valueProps={{ md: 7 }}
                  label={'group-name'}
                  value={item?.group_name}
                />
              </p>
            </div>
            {/* <div className='d-flex mt-1 text-warning justify-content-between'>
                        <span>{formatDate(item?.created_at, "DD MMMM, YYYY")}</span>
                    </div> */}
            {/* <div className='d-flex d-none justify-content-end align-items-end mt-1'>
                        <BsTooltip Tag={Link} title={FM("edit")} role={"button"} to={{ pathname: getPath('companies.update', { id: item.id }), state: { data: item } }}>
                            <Edit color={colors.primary.main} size="18" />
                        </BsTooltip>

                    </div> */}
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      {/* <QuestionFilter show={questionFilter} filterData={filterData} setFilterData={setFilterData} handleFilterModal={() => { setQuesFilter(false) }} /> */}
      <AddUpdateQues
        show={showAdd}
        edit={edit}
        handleModal={(e) => {
          setShowAdd(false)
          setEdit(null)
        }}
      />
      <Header icon={<QuestionAnswer size={25} />}>
        {/* Tooltips */}
        {/* <UncontrolledTooltip target="filter">{FM("filter")}</UncontrolledTooltip> */}

        <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>

        {/* Buttons */}
        <ButtonGroup>
          <Show IF={Permissions.questionsAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <Button.Ripple
              onClick={() => setShowAdd(true)}
              size='sm'
              color='primary'
              id='create-button'
            >
              <Plus size='16' />
            </Button.Ripple>
          </Show>
          {/* <Button.Ripple onClick={() => setQuesFilter(true)} size="sm" color="secondary" id="filter">
                        <Sliders size="16" />
                    </Button.Ripple> */}
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setFilterData(params)
              setReload(!reload)
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      {/* Categories */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadQuestion}
        jsonData={filterData}
        selector='questions'
        state='questions'
        display='grid'
        gridCol='4'
        gridView={gridView1}
      />
    </>
  )
}

export default Branches
