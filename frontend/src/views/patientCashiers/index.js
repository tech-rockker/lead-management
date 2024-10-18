import { ThemeColors } from '@src/utility/context/ThemeColors'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Book,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  File,
  Home,
  Plus,
  RefreshCcw,
  Sliders
} from 'react-feather'
import { useForm } from 'react-hook-form'
import 'react-image-lightbox/style.css'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, ButtonGroup, Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { loadPatientCashier } from '../../utility/apis/patientCashiers'
import { loadUser } from '../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../utility/Const'
import { FM, log } from '../../utility/helpers/common'
import useUser from '../../utility/hooks/useUser'
// ** Styles
import useUserType from '../../utility/hooks/useUserType'
import { Permissions } from '../../utility/Permissions'
import Show from '../../utility/Show'
import {
  createAsyncSelectOptions,
  decryptObject,
  formatDate,
  truncateText
} from '../../utility/Utils'
import FormGroupCustom from '../components/formGroupCustom'
import BsPopover from '../components/popover'
import TableGrid from '../components/tableGrid'
import BsTooltip from '../components/tooltip'
import Header from '../header'
import AddPatientCashier from './addPatientCashier'
import CashierFilter from './cashierFilter'

const PatientCashier = ({ filters = {}, user = null }) => {
  const { colors } = useContext(ThemeColors)
  const dispatch = useDispatch()
  const userType = useUserType()
  const userData = useUser()
  const patients = useSelector((s) => s.patientCashiers)
  const { register, errors, handleSubmit, control } = useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [edit, setEdit] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showAddFile, setShowAddFile] = useState(false)
  const [viewAdd, setViewAdd] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [deletedd, setDeletedd] = useState(false)
  const [failed, setFailed] = useState(false)
  const [failedd, setFailedd] = useState(false)
  const [open, setOpen] = useState(null)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const params = useParams()
  const prent = parseInt(params?.id)
  const [patient, setPatient] = useState([])
  const [workShiftFilter, setWorkShiftFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)

  const showForm = () => {
    setFormVisible(!formVisible)
  }

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setEdit(null)
      setFormVisible(false)
    }
  }, [])

  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
  }

  const handleClose = (e) => {
    if (e === false) {
      setShowAdd(false)
      setViewAdd(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  const CashierCard = (d, index) => {
    const avatar =
      d?.patient?.gender === 'male'
        ? require('../../assets/images/avatars/male2.png')
        : require('../../assets/images/avatars/female2.png')
    const user = {
      ...d,
      ...decryptObject(forDecryption, d),
      patient: decryptObject(forDecryption, d?.patient)
    }
    return (
      <>
        <div key={`patient-card-${index}`} className='flex-1'>
          <Card className='animate__animated animate__slideInUp'>
            <CardBody>
              <Row noGutters className='align-items-center'>
                <Col xs='2' className='d-flex align-items-center justify-content-center'>
                  <img
                    className=' shadow rounded-circle'
                    src={avatar?.default}
                    style={{ width: 55, height: 55 }}
                  />
                </Col>
                <Col xs='9' className='ps-1 d-flex align-items-center'>
                  <div className='flex-1'>
                    <h5 className='mb-0 fw-bolder text-primary text-truncate'>
                      <span className='position-relative text-capitalize'>
                        {user?.patient?.name ?? ''}
                      </span>
                    </h5>
                    <p
                      className='mb-0'
                      style={{
                        marginTop: 3,
                        backgroundColor: user?.patient?.user_color,
                        width: 50,
                        height: 5,
                        borderRadius: 8
                      }}
                    ></p>
                  </div>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='border-top'>
              <Row className='align-items-center'>
                {user?.file ? (
                  <BsTooltip
                    className='d-flex justify-content-center mb-1'
                    Tag={'a'}
                    role={'button'}
                    target={'_blank'}
                    href={user?.file}
                    title={FM('document')}
                  >
                    <Eye size='35' />
                  </BsTooltip>
                ) : (
                  <BsTooltip
                    className='d-flex justify-content-center mb-1'
                    title={FM('no-document')}
                  >
                    <EyeOff size='35' />
                  </BsTooltip>
                )}
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('receipt-no')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <Book size={14} /> {user?.receipt_no}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('amount')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary'>
                      <DollarSign size={14} /> {user?.amount}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 mt-1 text-dark fw-bolder'>{FM('type')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Home size={14} /> {user?.type === '1' ? FM('in') : FM('out')}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 mt-1 text-dark fw-bolder'>{FM('added-date')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Calendar size={14} /> {formatDate(user?.created_at, 'DD MMMM, YYYY')}
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='border-top'>
              <Row className='align-items-center'>
                <Col md='12'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('comment')}</p>
                  {/* <p className='mb-0 fw-bold text-secondary text-truncate'>
                                        <Edit2 size={14} /> {" "} {user?.comment}
                                    </p> */}
                  <BsPopover title={FM('reason')} content={truncateText(user?.comment, 250)}>
                    <p className='mb-0 fw-bold text-secondary text-truncate'>
                      <a className='text-secondary'> {truncateText(user?.comment, 40) ?? 'N/A'} </a>
                    </p>
                  </BsPopover>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }
  return (
    <>
      <AddPatientCashier
        isEdit
        showModal={showAdd}
        setShowModal={handleClose}
        setReload={(e) => {
          setFilterData(true)
          setReload(e)
        }}
        noView
      />
      <CashierFilter
        show={workShiftFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setWorkShiftFilter(false)
        }}
      />
      <Header icon={<File size='25' />} subHeading={filterData?.patient_name ?? ''}>
        {/* Tooltips */}

        <ButtonGroup color='dark'>
          {userType === UserTypes.patient ? null : (
            <FormGroupCustom
              noGroup
              noLabel
              type={'select'}
              async
              isClearable
              value={filterData?.patient_id}
              // defaultOptions
              control={control}
              matchWith='id'
              onChangeValue={(v) => {
                setFilterData({
                  ...filterData,
                  patient_id: v,
                  patient_name: patient?.find((a) => a.value?.id === v)?.value?.name
                })
              }}
              options={patient}
              loadOptions={loadPatientOption}
              name={'patient_id'}
              placeholder={'Select Patient'}
              className='mb-2 flex-1 outline-dark'
            />
          )}
          <Show IF={Permissions.patientCashiersAdd}>
            <UncontrolledTooltip target='create-button'>{FM('create-new')}</UncontrolledTooltip>
            <AddPatientCashier
              setFilterData={setFilterData}
              setReload={(e) => {
                log('dsadasas', e)
                setFilterData(true)
              }}
              Component={Button.Ripple}
              size='sm'
              color='primary'
              id='create-button'
            >
              <Plus size='16' />
            </AddPatientCashier>
          </Show>
          <Button.Ripple
            onClick={() => setWorkShiftFilter(true)}
            size='sm'
            color='secondary'
            id='filter'
          >
            <Sliders size='16' />
          </Button.Ripple>
          <UncontrolledTooltip target='reload'>{FM('refresh-data')}</UncontrolledTooltip>
          <Button.Ripple
            size='sm'
            color='dark'
            id='reload'
            onClick={() => {
              setFilterData(true)
            }}
          >
            <RefreshCcw size='14' />
          </Button.Ripple>
        </ButtonGroup>
      </Header>
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadPatientCashier}
        jsonData={{
          ...filterData,
          ...filters,
          patient_id: userType === UserTypes.patient ? userData?.id : filterData?.patient_id
        }}
        selector='patientCashiers'
        state='patientCashier'
        display='grid'
        gridCol='4'
        gridView={CashierCard}
      />
    </>
  )
}

export default PatientCashier
