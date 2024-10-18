import { PartyMode } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Edit,
  Lock,
  MessageSquare,
  MoreVertical,
  Plus,
  RefreshCcw,
  Send,
  Sliders,
  Trash2
} from 'react-feather'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { pargraphDelete } from '../../../redux/reducers/paragraph'
import { getPath } from '../../../router/RouteHelper'
// import Hide from '../../../utility/Hide'
import { deleteParagraph, loadParagraph } from '../../../utility/apis/paragraph'
import { IconSizes } from '../../../utility/Const'
import { FM, log } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import DropDownMenu from '../../components/dropdown'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import AddUpdateParagraph from './AddUpdatePara'

const Paragraph = () => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [deletedId, setDeletedId] = useState(null)
  const [failed, setFailed] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [edit, setEdit] = useState(null)
  const [workShiftFilter, setWorkShiftFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const user = useUser()
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
  // log("Edit", edit)
  //////////////new////
  const gridView1 = (item, index) => {
    return (
      <>
        <Card className=''>
          <CardBody>
            <div className='role-heading'>
              <Row>
                <Col xs='10'>{item?.paragraph}</Col>
                <Show
                  IF={
                    (Can(Permissions.paragraphsEdit) || Can(Permissions.paragraphsDelete)) &&
                    item.top_most_parent_id === user?.top_most_parent_id
                  }
                >
                  <Col xs='2' className='d-flex align-items-start justify-content-end pe-1'>
                    <DropDownMenu
                      tooltip={FM(`menu`)}
                      component={
                        <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                      }
                      options={[
                        {
                          icon: <Edit size={14} />,
                          onClick: () => {
                            setShowAdd(true)
                            setEdit(item)
                          },
                          name: FM('edit')
                        },
                        {
                          // icon: <Trash2 size={14} />,
                          noWrap: true,
                          name: (
                            <ConfirmAlert
                              key={`delete-${item?.id}`}
                              item={item}
                              title={FM('delete-this', { name: FM('paragraph') })}
                              color='text-warning'
                              onClickYes={() => deleteParagraph({ id: item?.id })}
                              onSuccessEvent={(item) => dispatch(pargraphDelete(item?.id))}
                              className='dropdown-item'
                              id={`grid-delete-${item?.id}`}
                            >
                              <Trash2 size={14} />
                              <span className='ms-1'>{FM('delete')}</span>
                            </ConfirmAlert>
                          )
                        }
                      ]}
                    />
                  </Col>
                </Show>
              </Row>
            </div>
          </CardBody>
        </Card>
      </>
    )
  }

  return (
    <>
      <AddUpdateParagraph
        show={showAdd}
        edit={edit}
        handleModal={() => {
          setShowAdd(false)
          setEdit(null)
        }}
      />
      <Header icon={<PartyMode size={25} />}>
        {/* Tooltips */}
        {/* <UncontrolledTooltip target="filter">{FM("filter")}</UncontrolledTooltip> */}

        <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>

        {/* Buttons */}
        <ButtonGroup>
          <Show IF={Permissions.paragraphsAdd}>
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
          {/* <Button.Ripple onClick={() => setWorkShiftFilter(true)} size="sm" color="secondary" id="filter">
                        <Sliders size="16" />
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
      {/* Categories */}
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadParagraph}
        selector='paragraph'
        state='paragraph'
        display='grid'
        gridCol='12'
        gridView={gridView1}
      />
    </>
  )
}

export default Paragraph
