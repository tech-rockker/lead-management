/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar'
import { Language } from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useContext, useState } from 'react'
import { Edit, Plus, RefreshCcw, Trash2 } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { deleteLanguage } from '../../../redux/reducers/languageLabel'
import { getPath } from '../../../router/RouteHelper'
import { DefaultLanguage } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { languageDelete, languageListGet } from '../../../utility/apis/languageLabel'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { FM, getInitials, isValid } from '../../../utility/helpers/common'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import ImportLangModal from './ImportLang'

const Languages = () => {
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
  const [showEdit, setShowEdit] = useState(false)
  const showForm = () => {
    setFormVisible(!formVisible)
  }

  const handleClose = (e) => {
    if (e === false) {
      setShowEdit(e)
    }
  }

  const gridView = (item, index) => {
    return (
      <>
        <div key={`userType-card-${index}`} className='flex-1'>
          {/* <div style={{ border: "3px solid #ffcfcf" }}></div> */}
          <Card className=''>
            <CardBody className='animate__animated animate__fadeIn'>
              <Row noGutters className='align-items-center'>
                <Col xs='2'>
                  <Avatar
                    color={item?.status === 1 ? 'light-primary' : 'light-primary'}
                    content={getInitials(isValid(item?.title) ? item?.title : FM('N/A'))}
                  />
                </Col>

                <Col xs='7'>
                  <Link to={{ pathname: getPath('master.language.labels', { id: item?.id }) }}>
                    <p
                      className='text-truncate m-0'
                      title={isValid(item?.title) ? item?.title : FM('N/A')}
                    >
                      {isValid(item?.title) ? item?.title : FM('N/A')}
                    </p>
                  </Link>
                </Col>
                <Hide IF={item?.value === DefaultLanguage.English}>
                  <Col xs='3' className='d-flex justify-content-end'>
                    <Show IF={Permissions.importLanguage}>
                      <UncontrolledTooltip target={`grid-edit-${item?.id}`} autohide={true}>
                        {FM('edit')}
                      </UncontrolledTooltip>
                      <ImportLangModal
                        responseData={() => setReload(true)}
                        edit={item}
                        id={`grid-edit-${item?.id}`}
                      >
                        <Edit color={colors.primary.main} size='18' />
                      </ImportLangModal>
                      {/* <span key={index} role={"button"} id={`grid-edit-${item?.id}`} onClick={() => {
                                            setEdit(item); setShowEdit(true)
                                        }}>
                                            <Edit color={colors.primary.main} size="18" />
                                        </span> */}
                    </Show>
                    <Show IF={Permissions.importLanguage}>
                      <UncontrolledTooltip target={`grid-delete-${item?.id}`}>
                        {FM('delete')}
                      </UncontrolledTooltip>
                      {/* <Hide IF={(edit?.id === item?.id)}> */}
                      <ConfirmAlert
                        item={item}
                        title={FM('delete-this', {
                          name: isValid(item?.title) ? item?.title : FM('N/A')
                        })}
                        color='text-warning'
                        onClickYes={() => languageDelete({ id: item?.id })}
                        onSuccessEvent={(item) => {
                          dispatch(deleteLanguage(item?.id))
                          setReload(true)
                        }}
                        className='ms-1'
                        id={`grid-delete-${item?.id}`}
                      >
                        <Trash2 color={colors.danger.main} size='18' />
                      </ConfirmAlert>
                      {/* </Hide> */}
                    </Show>
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
      <ImportLangModal
        setReload={setReload}
        edit={edit}
        showModal={showEdit}
        setShowModal={handleClose}
      />
      <Header icon={<Language size={25} />} title={FM('languages')}>
        <ButtonGroup>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Show IF={Permissions.importLanguage}>
            <BsTooltip
              Tag={ImportLangModal}
              role='button'
              title={FM('import')}
              setReload={setReload}
              color='primary'
              size='sm'
              Component={Button.Ripple}
              edit={edit}
            >
              <Plus size='14' />
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
        loadFrom={languageListGet}
        selector='languageLabel'
        state='language'
        display='grid'
        gridCol='4'
        gridView={gridView}
      />
    </>
  )
}

export default Languages
