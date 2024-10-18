import {
  AccessibleOutlined,
  PeopleOutlineSharp,
  ReceiptOutlined,
  SecurityOutlined,
  TimelapseOutlined,
  WorkOutline
} from '@material-ui/icons'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import classNames from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import {
  Activity,
  Bookmark,
  CheckSquare,
  Edit,
  Eye,
  File,
  FileText,
  Flag,
  Home,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  RefreshCcw,
  Sliders,
  Trash2,
  Upload,
  UserPlus
} from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Badge, Button, ButtonGroup, Card, CardBody, CardFooter, Col, Row } from 'reactstrap'
import { userDelete } from '../../../redux/reducers/userManagement'
import { deleteUser, loadUser } from '../../../utility/apis/userManagement'
import {
  forDecryption,
  IconSizes,
  incompletePatientFields,
  userFields,
  UserTypes
} from '../../../utility/Const'
// ** Styles
import { FM, isValidArray } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../../utility/Permissions'
import Show, { Can } from '../../../utility/Show'
import {
  countPlus,
  decryptObject,
  getAge,
  incompleteSteps,
  isAllTrue,
  jsonDecodeAll,
  truncateText
} from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import DropDownMenu from '../../components/dropdown'
import Shimmer from '../../components/shimmers/Shimmer'
import TableGrid from '../../components/tableGrid'
import BsTooltip from '../../components/tooltip'
import Header from '../../header'
import UserModal from '../fragment/UserModal'
import FakePassword from './fakePassword'
import ImportPatient from './ImportPatient'
import PatientFilter from './patientFilter'
import PatientViewModal from './PatientViewModal'

const Patient = () => {
  const canEditPatient = Can(Permissions.patientsEdit)
  const { colors } = useContext(ThemeColors)
  const pat = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()
  const [showModal, setShowModal] = useState(false)
  const [showModalFake, setShowModalFake] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [reload, setReload] = useState(false)
  const [added, setAdded] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [patientFilter, setPatientFilter] = useState(false)
  const [filterData, setFilterData] = useState(null)
  const [deleted, setDeleted] = useState(false)
  const [step, setStep] = useState(1)
  const [steps, setSteps] = useState('1')
  const [importModal, setImportModal] = useState(null)
  const location = useLocation()
  const notification = location?.state?.notification

  //import patient modal
  const handleImport = () => setImportModal(!importModal)
  const handleClose = (e) => {
    if (e === false) {
      setEdit(null)

      setShowModal(false)
      setShowViewModal(false)
      setShowModalFake(false)
      setSteps('1')
      setStep(1)
    }
  }

  const handleViewClose = (e) => {
    if (e === false) {
      setEdit(null)

      setShowViewModal(false)
      setStep(1)
    }
  }

  useEffect(() => {
    if (filterData !== null) setReload(true)
  }, [filterData])

  const viewActivityModal = (user, step) => {
    setShowViewModal(!showViewModal)
    setEdit(user)
    setStep(step)
  }

  const openEditModal = (user, step) => {
    setShowModal(!showModal)
    setEdit(user)
    setStep(step)
  }

  useEffect(() => {
    if (notification?.data_id && notification?.type === 'patient') {
      // setShowViewModal(true)
      setEdit({
        id: notification?.data_id
      })
    }
  }, [notification])

  const PatientView = (e, index) => {
    const user = decryptObject(forDecryption, e)
    const d = jsonDecodeAll(userFields, { ...user, ...user?.patient_information })
    const test = incompleteSteps(incompletePatientFields, d)
    // log("ssss", d)

    const info = isAllTrue(test['personal-details'], 'success', 'warning', 'danger')
    const relative = isAllTrue(test['relative-caretaker'], 'success', 'warning', 'danger')
    const diseases = isAllTrue(test['disability-details'], 'success', 'warning', 'danger')
    const work = isAllTrue(test['studies-work'], 'success', 'warning', 'danger')
    const decision = isAllTrue(test['decision-document'], 'success', 'warning', 'danger')

    return (
      <>
        <div key={`patient-card-${index}`} className='flex-1'>
          <Card
            className={classNames({
              'animate__animated animate__bounceIn': index === 0 && user.id === added,
              'border border-primary border-5': user?.id === notification?.data_id
            })}
          >
            <CardBody className='animate__animated animate__fade'>
              <Row noGutters className='align-items-center'>
                <Col xs='2' className='d-flex align-items-center justify-content-center'>
                  <img
                    className=' shadow rounded-circle'
                    src={user?.avatar}
                    style={{ width: 55, height: 55 }}
                  />
                </Col>
                <Col xs='8' className='ps-1 d-flex align-items-center'>
                  <div className='flex-1'>
                    <h5 className='mb-0 fw-bolder text-primary text-truncate'>
                      <span className='position-relative'>{truncateText(user?.name, 30)}</span>
                    </h5>
                    <p className='mb-0 text-small-12 text-muted fw-bold'>
                      {getAge(user?.personal_number, FM)}
                    </p>
                    <p
                      className='mb-0'
                      style={{
                        marginTop: 3,
                        backgroundColor: user?.user_color,
                        width: 50,
                        height: 5,
                        borderRadius: 8
                      }}
                    ></p>
                  </div>
                </Col>
                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <Show IF={user?.is_secret}>
                    <BsTooltip title={FM('secret-patient')}>
                      <SecurityOutlined
                        style={{ width: 22, height: 22 }}
                        className={'text-danger'}
                      />
                    </BsTooltip>
                  </Show>
                </Col>
                <Col xs='1' className='d-flex justify-content-end align-items-centers'>
                  <DropDownMenu
                    tooltip={FM(`menu`)}
                    component={
                      <MoreVertical color={colors.primary.main} size={IconSizes.MenuVertical} />
                    }
                    options={[
                      {
                        IF: Permissions.patientsRead,
                        icon: <Eye size={14} />,
                        //to: { pathname: getPath('users.patients.detail', { id: item.id }), state: { data: item } },
                        name: FM('view'),
                        onClick: () => {
                          setShowViewModal(!showViewModal)
                          setEdit(user)
                          setStep('1')
                        }
                      },
                      {
                        IF: Permissions.patientsEdit,
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowModal(!showModal)
                          setEdit(user)
                        },
                        name: FM('edit')
                      },
                      {
                        IF: Can(Permissions.patientsEdit),
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setShowModalFake(!showModalFake)
                          setEdit(user)
                        },
                        name: FM('change-password')
                      },
                      {
                        // IF: Permissions.patientsDelete,
                        IF: Can(Permissions.patientsDelete) && pat?.id !== user?.id,
                        // icon: <Trash2 size={14} />,
                        noWrap: true,
                        name: (
                          <ConfirmAlert
                            item={user}
                            title={FM('delete-this', { name: user?.name })}
                            color='text-warning'
                            onClickYes={() => deleteUser({ id: user?.id })}
                            onSuccessEvent={(item) => dispatch(userDelete(item?.id))}
                            className='dropdown-item'
                            id={`grid-delete-${user?.id}`}
                          >
                            <Trash2 size={14} />
                            <span className='ms-1'>{FM('delete')}</span>
                          </ConfirmAlert>
                        )
                      }
                    ]}
                  />
                </Col>
              </Row>
            </CardBody>
            <CardBody className='animate__animated animate__flipInX border-top'>
              <Row className='align-items-center mb-1'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('patient-id')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <File size={14} /> {user?.custom_unique_id}
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('branch')}</p>
                  <p className='mb-0 fw-bold text-secondary text-truncate'>
                    <Home size={14} /> {user?.branch?.branch_name ?? FM('main-branch')}
                  </p>
                </Col>
              </Row>
              <Row className='align-items-center'>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('email')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary' href={`mailto:${user?.email}`}>
                      <Mail size={14} /> {user?.email}
                    </a>
                  </p>
                </Col>
                <Col md='6'>
                  <p className='mb-0 text-dark fw-bolder'>{FM('contact-number')}</p>
                  <p className='mb-0 fw-bold text-truncate'>
                    <a className='text-secondary' href={`tel:${user?.contact_number ?? 'N/A'}`}>
                      <Phone size={14} /> {user?.contact_number ?? 'N/A'}
                    </a>
                  </p>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='animate__animated animate__flipInX p-0 pt-1 pb-1 border-top'>
              <Row noGutters className='d-flex align-items-start justify-content-between'>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip role='button' title={''}>
                    <div
                      onClick={() => {
                        viewActivityModal(user, '2')
                      }}
                      role='button'
                      className='text-center'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.patientActivityCount)}
                          </Badge>
                          <Activity className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark    fw-bold text-step-title'>{FM('activity')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip role='button' title={''}>
                    <div
                      onClick={() => {
                        viewActivityModal(user, '3')
                      }}
                      role='button'
                      className='text-center'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.patientTaskCount)}
                          </Badge>
                          <CheckSquare
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark    fw-bold text-step-title'>{FM('task')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip role='button' title={''}>
                    <div
                      onClick={() => {
                        viewActivityModal(user, '6')
                      }}
                      role='button'
                      className='text-center'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.ipCount)}
                          </Badge>
                          <Bookmark className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark    fw-bold text-step-title'>{FM('plan')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip role='button' title={''}>
                    <div
                      onClick={() => {
                        viewActivityModal(user, '4')
                      }}
                      role='button'
                      className='text-center'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.journals_count)}
                          </Badge>
                          <FileText className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark    fw-bold text-step-title'>{FM('journals')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip role='button' title={''}>
                    <div
                      onClick={() => {
                        viewActivityModal(user, '5')
                      }}
                      role='button'
                      className='text-center'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color='primary' className='badge-up'>
                            {countPlus(user?.deviations_count)}
                          </Badge>
                          <Flag className='text-secondary' style={{ width: 25, height: 25 }} />
                        </div>
                      </div>
                      <span className='text-dark    fw-bold text-step-title'>
                        {FM('deviation')}
                      </span>
                    </div>
                  </BsTooltip>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='animate__animated animate__flipInX p-0 pt-1 pb-1 border-top'>
              <Row noGutters className='d-flex align-items-start justify-content-between'>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={info === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        canEditPatient ? openEditModal(user, 1) : ''
                      }}
                      role='button'
                      className='text-center stepCol'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={info} className='badge-up'></Badge>
                          <ReceiptOutlined
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark    fw-bold text-step-title'>{FM('info')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={relative === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        canEditPatient ? openEditModal(user, 2) : ''
                      }}
                      role='button'
                      className='text-center stepCol'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={relative} className='badge-up'>
                            {countPlus(user?.personCount)}
                          </Badge>
                          <PeopleOutlineSharp
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark   fw-bold text-step-title'>{FM('relatives')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={diseases === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        canEditPatient ? openEditModal(user, 3) : ''
                      }}
                      role='button'
                      className='text-center stepCol'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={diseases} className='badge-up'></Badge>
                          <AccessibleOutlined
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark   fw-bold text-step-title'>{FM('diseases')}</span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={work === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        canEditPatient ? openEditModal(user, 4) : ''
                      }}
                      role='button'
                      className='text-center stepCol'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={work} className='badge-up'></Badge>
                          <WorkOutline
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark   fw-bold text-step-title'>
                        {FM('work-study')}
                      </span>
                    </div>
                  </BsTooltip>
                </Col>
                <Col md='2' xs='2' className='position-relative'>
                  <BsTooltip
                    role='button'
                    title={decision === 'success' ? null : FM('incomplete-details')}
                  >
                    <div
                      onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        canEditPatient ? openEditModal(user, 6) : ''
                      }}
                      role='button'
                      className='text-center'
                    >
                      <div className='d-flex justify-content-center mt-1'>
                        <div className='position-relative'>
                          <Badge pill color={decision} className='badge-up'></Badge>
                          <TimelapseOutlined
                            className='text-secondary'
                            style={{ width: 25, height: 25 }}
                          />
                        </div>
                      </div>
                      <span className='text-dark   fw-bold text-step-title'>{FM('decisions')}</span>
                    </div>
                  </BsTooltip>
                </Col>
              </Row>
            </CardBody>
            <Show IF={isValidArray(user?.patient_types)}>
              <CardFooter className='animate__animated animate__flipInX border-top p-1 ps-2 pe-2'>
                <Row noGutters className='d-flex align-items-centers'>
                  <Col xs='10' className='d-flex justify-content-start align-items-centers'>
                    {user?.patient_types?.map((d, i) => {
                      return (
                        <Badge className='me-1' color='light-primary'>
                          {d?.designation}
                        </Badge>
                      )
                    })}
                  </Col>
                </Row>
              </CardFooter>
            </Show>
          </Card>
        </div>
      </>
    )
  }
  const PatientShimmer = () => {
    return (
      <>
        <div style={{ padding: 5 }}>
          <Shimmer style={{ width: '100%', height: 92, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 145, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 97, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 97, marginBottom: 5 }} />
          <Shimmer style={{ width: '100%', height: 45 }} />
        </div>
      </>
    )
  }
  return (
    <>
      <FakePassword
        showModal={showModalFake}
        setShowModal={handleClose}
        userType={UserTypes.patient}
        edit={edit?.id}
        noView
      />
      <PatientViewModal
        key={`view-${edit?.id}`}
        pId={edit?.id}
        step={step}
        edit={edit}
        disableSave
        showModal={showViewModal}
        setShowModal={handleViewClose}
        color={colors.info.main}
        size='18'
      />
      <UserModal
        onSuccess={() => {
          setFilterData({ k: 5 })
        }}
        step={step}
        showModal={showModal}
        setShowModal={(e) => {
          handleClose(e)
          setFilterData({ k: 5 })
        }}
        userType={UserTypes.patient}
        userId={edit?.id}
        noView
      />
      <PatientFilter
        show={patientFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        handleFilterModal={() => {
          setPatientFilter(false)
        }}
      />
      <Header icon={<UserPlus size='25' />} subHeading={FM('all-patients')}>
        <Show IF={Permissions.patientsAdd}>
          <ButtonGroup color='dark' className='me-1'>
            <Button.Ripple size='sm' color='primary' onClick={handleImport}>
              <Upload size='14' className='align-middle' /> {FM('import-patient')}
            </Button.Ripple>
          </ButtonGroup>
        </Show>
        <ButtonGroup color='dark'>
          <Show IF={Permissions.patientsAdd}>
            <BsTooltip
              title={FM('create-new')}
              Tag={UserModal}
              onSuccess={() => {
                setFilterData({ k: 5 })
              }}
              userType={UserTypes.patient}
              Component={Button.Ripple}
              color='primary'
              size='sm'
            >
              <Plus size='14' />
            </BsTooltip>
          </Show>
          <LoadingButton
            onClick={() => setPatientFilter(true)}
            size='sm'
            color='secondary'
            tooltip={FM('filter')}
          >
            <Sliders size='14' />
          </LoadingButton>
          <LoadingButton
            size='sm'
            color='dark'
            tooltip={FM('refresh-data')}
            onClick={() => {
              setFilterData({})
              setReload(true)
            }}
          >
            <RefreshCcw size='14' />
          </LoadingButton>
        </ButtonGroup>
      </Header>
      <ImportPatient
        open={importModal}
        setImportModal={setImportModal}
        handleImport={handleImport}
        refresh={reload}
        setReload={setReload}
      />
      <TableGrid
        refresh={reload}
        isRefreshed={setReload}
        loadFrom={loadUser}
        jsonData={{
          user_type_id: UserTypes.patient,
          ...filterData
        }}
        selector='userManagement'
        state='users'
        display='grid'
        gridCol='6'
        gridView={PatientView}
        shimmer={<PatientShimmer />}
      />
    </>
  )
}

export default Patient
