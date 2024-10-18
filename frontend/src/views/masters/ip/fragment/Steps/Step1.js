import { Email, VerifiedUserOutlined } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check, Edit, PhoneCall, Plus, Tag, User, X } from 'react-feather'
import { Card, CardBody, CardHeader, Col, Form, InputGroupText, Row } from 'reactstrap'
import Avatar from '@components/avatar'
import { useDispatch } from 'react-redux'
import { editUser, loadUser, viewUser } from '../../../../../utility/apis/userManagement'
import {
  forDecryption,
  incompletePatientFields,
  incompletePatientSteps,
  UserTypes
} from '../../../../../utility/Const'
import { FM, isValid, isValidArray } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import { Permissions } from '../../../../../utility/Permissions'
import Show from '../../../../../utility/Show'
import {
  createAsyncSelectOptions,
  decryptObject,
  formatDate,
  incompletePatient,
  jsonDecodeAll
} from '../../../../../utility/Utils'
import FormGroupCustom from '../../../../components/formGroupCustom'
import Shimmer from '../../../../components/shimmers/Shimmer'
import MiniTable from '../../../../components/tableGrid/miniTable'
import BsTooltip from '../../../../components/tooltip'
import PersonModal from '../../../../userManagement/fragment/PersonModal'
import UserModal from '../../../../userManagement/fragment/UserModal'

const Step1 = ({
  form,
  path = 1,
  users = null,
  setSaveLoading = () => {},
  isSaved = false,
  action = null,
  setActiveIndex = () => {},
  setAction = () => {},
  setAddPatients = () => {},
  handleStepBg = () => {},
  createFor = null,
  setDisplay = () => {},
  loadingDetails = false,
  requiredEnabled,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  const [patient, setPatient] = useState([])
  const [personSelected, setPersonsSelected] = useState([])
  const [patientSelected, setPatientSelected] = useState(null)
  const [addPatient, setAddPatient] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [user, setUser] = useState(false)
  const dispatch = useDispatch()
  const [totalSteps, setTotalSteps] = useState({
    category_id: null,
    subcategory_id: null,
    user_id: null
  })
  const [incompleteField, setIncompleteField] = useState(null)
  const [step, setStep] = useState(path)

  //patient
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

  const formFields = {
    user_type_id: '',
    role_id: '',
    custom_unique_id: '',
    category_id: '',
    country_id: '',
    branch_id: '',
    dept_id: '',
    govt_id: '',
    patient_type_id: '',
    working_from: '',
    working_to: '',
    place_name: '',
    agency_hours: '',
    name: '',
    email: '',
    password: '',
    'confirm-password': '',
    contact_number: '',
    gender: '',
    personal_number: '',
    organization_number: '',
    city: '',
    postal_code: '',
    zipcode: '',
    full_address: '',
    license_key: '',
    license_end_date: '',
    is_substitute: '',
    is_regular: '',
    is_seasonal: '',
    is_secret: '',
    joining_date: '',
    establishment_date: '',
    user_color: '',
    is_file_required: '',
    persons: '',
    disease_description: '',
    postal_area: '',
    who_give_support: 'json'
  }

  // const handleNewPatient = (e) => {
  //     // log("eeeee, e", e)
  //     loadPatientOption()
  //     setPatientSelected({
  //         label: e?.name,
  //         value: e?.id
  //     })
  //     setValue("patient_id", e?.id)
  // }

  const handleSteps = (name, value) => {
    setTotalSteps({
      ...totalSteps,
      [name]: value
    })
  }

  const checkIfNull = () => {
    Object.values(totalSteps).every((value) => {
      if (value === null || value === undefined || value === '') {
        handleStepBg(0, 'bg-danger')
        return true
      }
      if (value !== null || value !== undefined || value !== '') {
        handleStepBg(0, 'bg-success')
        return true
      } else {
        handleStepBg(0, 'bg-warning')
        return false
      }
    })
  }

  useEffect(() => {
    handleSteps('user_id', watch('user_id'))
  }, [watch('user_id')])

  useEffect(() => {
    handleSteps('category_id', watch('category_id'))
  }, [watch('category_id')])

  useEffect(() => {
    handleSteps('subcategory_id', watch('subcategory_id'))
  }, [watch('subcategory_id')])

  useEffect(() => {
    checkIfNull()
  }, [totalSteps])

  useEffect(() => {
    setAddPatients(addPatient)
  }, [addPatient])

  const loadDetails = (id) => {
    if (isValid(id)) {
      viewUser({
        id,
        loading: setLoadingUser,
        success: (d) => {
          const s = {
            ...d,
            country_id: d?.country?.id ?? '',
            patient_type_id: typeof d?.patient_type_id === 'object' ? d?.patient_type_id : [],
            ...d?.patient_information,
            id: d?.patient_information?.patient_id
          }
          const valuesTemp = jsonDecodeAll(formFields, s)
          const values = {
            ...decryptObject(forDecryption, valuesTemp),
            patient: decryptObject(forDecryption, valuesTemp?.patient),
            employee: decryptObject(forDecryption, valuesTemp?.employee),
            branch: decryptObject(forDecryption, valuesTemp?.branch)
          }
          setUser(values)
          setIncompleteField(incompletePatient(incompletePatientFields, values))
        }
      })
    }
  }

  useEffect(() => {
    loadDetails(watch('user_id'))
  }, [watch('user_id')])

  useEffect(() => {
    if (createFor !== null) {
      setValue('user_id', createFor?.value)
    }
  }, [createFor])

  const renderStatusPatient = () => {
    if (incompleteField) {
      const re = []
      for (const [key, val] of Object.entries(incompleteField)) {
        re.push(
          <>
            <MiniTable
              rowProps={{
                className: val ? 'mb-5px text-success' : 'mb-5px text-danger',
                role: 'button',
                onClick: () => {
                  setStep(incompletePatientSteps[key])
                  setAddPatient(true)
                }
              }}
              separatorProps={{ className: 'd-none' }}
              labelProps={{ md: 1 }}
              valueProps={{ md: 10, className: 'fw-bold' }}
              icon={val ? <Check size={18} /> : <X size={18} />}
              value={FM(key)}
            />
          </>
        )
      }
      return re
    } else {
      return null
    }
  }
  const handleNewPatient = (e) => {
    //log("handleNewPatient", e)
    loadPatientOption()
    setPatientSelected({
      label: e?.name,
      value: e?.id
    })
    setValue('user_id', e?.id)
    loadDetails(e?.id)
    setAddPatient(false)
  }

  const handleSave = (id, e) => {
    const object = {
      ...user,
      persons: e ?? []
    }

    if (isValid(id)) {
      editUser({
        id,
        jsonData: object,
        dispatch,
        loading: setLoadingUser,
        success: (d) => {
          loadDetails(id)
        }
      })
    }
  }
  return (
    <div className='overflow-x-hidden'>
      {loadingDetails ? (
        <Row>
          <Col md='12' className='d-flex align-items-stretch'>
            <Card>
              <CardBody>
                <Row>
                  <Col md='6'>
                    <Shimmer style={{ height: 40 }} />
                  </Col>
                  <Col md='6'>
                    <Shimmer style={{ height: 40 }} />
                  </Col>
                  <Col md='12' className='mt-2'>
                    <Shimmer style={{ height: 320 }} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          <Show IF={addPatient}>
            <Card className='mb-0 shadow-none'>
              <CardHeader className='border-bottom pt-1 pb-1'>
                <div role='button' className=''>
                  <h5
                    className='mb-0'
                    onClick={() => {
                      setAddPatient(false)
                    }}
                  >
                    <BsTooltip role='button' Tag={ArrowLeft} size={16} title={FM('cancel')} />{' '}
                    {FM('add-patient')}
                  </h5>
                </div>
              </CardHeader>
              <CardBody className='p-0'>
                <UserModal
                  fromIp
                  setAction={setAction}
                  action={action}
                  setActiveIndex={setActiveIndex}
                  Component={Plus}
                  size={18}
                  step={step}
                  showModal={true}
                  noModal
                  noView
                  userId={watch('user_id') ? watch('user_id') : null}
                  setSaveLoading={setSaveLoading}
                  enableSaveIp={false}
                  onSuccess={handleNewPatient}
                  userType={UserTypes.patient}
                  scrollControl={false}
                />
              </CardBody>
            </Card>
          </Show>
          <Hide IF={addPatient}>
            <Form onSubmit={onSubmit} className='p-2'>
              <Row>
                <Show IF={!isValid(createFor)}>
                  <Col md='12'>
                    <div className='content-header'>
                      <h5 className='mb-0'>{FM('patient')}</h5>
                      <small className='text-muted'>{FM('select-add-patient')}</small>
                    </div>
                    <Hide IF={isSaved}>
                      <FormGroupCustom
                        append={
                          !createFor ? (
                            <Show IF={Permissions.patientsAdd}>
                              {' '}
                              <BsTooltip
                                role='button'
                                title={!isValid(watch('user_id')) ? FM('add-new') : FM('edit')}
                                onClick={() => {
                                  setAddPatient(true)
                                }}
                                Tag={InputGroupText}
                              >
                                {!isValid(watch('user_id')) ? (
                                  <Plus size={18} />
                                ) : (
                                  <Edit size={18} />
                                )}
                              </BsTooltip>{' '}
                            </Show>
                          ) : null
                        }
                        isDisabled={createFor !== null || users !== null}
                        //  key={`${edit?.user_id}-user_id`}
                        type={'select'}
                        control={control}
                        errors={errors}
                        name={'user_id'}
                        defaultOptions
                        matchWith='id'
                        async
                        isClearable
                        onChangeValue={(e) => {
                          setPatientSelected(null)
                        }}
                        cacheOptions
                        loadOptions={loadPatientOption}
                        value={patientSelected?.value ?? edit?.user_id ?? users}
                        options={patient}
                        label={FM('patient')}
                        rules={{ required: true }}
                        className='mb-1'
                      />
                    </Hide>
                  </Col>
                </Show>
              </Row>
              <Show IF={watch('user_id')}>
                <Show IF={loadingUser}>
                  <Shimmer style={{ height: 50 }} />
                  <Shimmer style={{ height: 250, marginTop: 25 }} />
                </Show>
                <Hide IF={loadingUser}>
                  <Card className='border-primary white'>
                    <CardBody>
                      <Row className='mb-5px align-items-center'>
                        <Col md='2' className='d-flex justify-content-center'>
                          <Avatar
                            initials={false}
                            color={'primary'}
                            className='shadow'
                            img={user?.avatar}
                            // size='xl'
                            imgHeight={100}
                            imgWidth={100}
                            // content={user?.name ?? 'A'}
                            // contentStyles={{
                            //     borderRadius: 0,
                            //     fontSize: 'calc(36px)',
                            //     width: '100%',
                            //     height: '100%'
                            // }}
                            // style={{
                            //     height: '90px',
                            //     width: '90px'
                            // }}
                          />
                        </Col>
                        <Col md='5'>
                          <MiniTable
                            rowProps={{ className: 'mb-5px text-primary' }}
                            separatorProps={{ className: 'd-none' }}
                            labelProps={{ md: 1 }}
                            valueProps={{ md: 10, className: 'fw-bold text-primary' }}
                            icon={<User size={18} />}
                            value={user?.name}
                          />
                          <MiniTable
                            rowProps={{ className: 'mb-5px' }}
                            separatorProps={{ className: 'd-none' }}
                            labelProps={{ md: 1 }}
                            valueProps={{ md: 10 }}
                            icon={<VerifiedUserOutlined size={18} />}
                            value={user?.personal_number}
                          />
                          <MiniTable
                            rowProps={{ className: 'mb-5px' }}
                            separatorProps={{ className: 'd-none' }}
                            labelProps={{ md: 1 }}
                            valueProps={{ md: 10 }}
                            icon={<Tag size={18} />}
                            value={user?.gender}
                          />
                          <MiniTable
                            rowProps={{ className: 'mb-5px' }}
                            separatorProps={{ className: 'd-none' }}
                            labelProps={{ md: 1 }}
                            valueProps={{ md: 10 }}
                            icon={<PhoneCall size={18} />}
                            value={user?.contact_number}
                          />
                          <MiniTable
                            rowProps={{ className: 'mb-5px' }}
                            separatorProps={{ className: 'd-none' }}
                            labelProps={{ md: 1 }}
                            valueProps={{ md: 10 }}
                            icon={<Email size={18} />}
                            value={user?.email}
                            v={{
                              how_helped: 'test',
                              id: 5,
                              is_participated: true,
                              is_presented: true
                            }}
                          />
                        </Col>
                        <Col md='5'>{renderStatusPatient()}</Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <FormGroupCustom
                    key={`${personSelected?.length}-persons`}
                    noGroup
                    noLabel
                    type={'hidden'}
                    control={control}
                    errors={errors}
                    name={'persons'}
                    className='d-none'
                    value={personSelected}
                    rules={{ required: false }}
                  />
                  <PersonModal
                    form={form}
                    ip={edit}
                    onSelectPerson={(e) => {
                      setValue('persons', e)
                      setPersonsSelected(e)
                    }}
                    fromIp
                    hideAdd={true}
                    customButton={
                      <>
                        <BsTooltip
                          onClick={() => {
                            setStep(incompletePatientSteps['relative-caretaker'])
                            setAddPatient(true)
                          }}
                          Tag={Edit}
                          title={FM('edit')}
                          role={'button'}
                          size={18}
                        />
                      </>
                    }
                    edit={user}
                    onEdit={(e) => {
                      handleSave(user?.patient_id, e)
                      //  log("onSUc", e)
                    }}
                  />
                  <div className='mt-1'>
                    <Show
                      IF={
                        isValid(user?.disease_description) ||
                        isValid(user?.patient_information?.aids) ||
                        isValid(user?.patient_information?.special_information)
                      }
                    >
                      <Card className='shadow'>
                        <CardHeader className=''>
                          <Row className='flex-1'>
                            <Col md='8'>
                              <h5 className='mb-0'>{FM('disability-details')}</h5>
                            </Col>
                            <Col md='4' className='d-flex align-items-center justify-content-end'>
                              <BsTooltip
                                onClick={() => {
                                  setStep(incompletePatientSteps['disability-details'])
                                  setAddPatient(true)
                                }}
                                Tag={Edit}
                                title={FM('edit')}
                                role={'button'}
                                size={18}
                              />
                            </Col>
                          </Row>
                        </CardHeader>
                        <CardBody>
                          <Hide IF={!isValid(user?.disease_description)}>
                            <div className='mb-2'>
                              <div className='h6'>{FM('disease-description')}</div>
                              <p className=''> {user?.disease_description} </p>
                            </div>
                          </Hide>
                          <Hide IF={user?.patient_information?.aids === null}>
                            <div className='mb-2'>
                              <div className='h6 '>{FM('aids')}</div>
                              <p className=''> {user?.patient_information?.aids} </p>
                            </div>
                          </Hide>
                          <Hide IF={user?.patient_information?.special_information === null}>
                            <div className='mb-2'>
                              <div className='h6  '>{FM('special-information')}</div>
                              <p className=''> {user?.patient_information?.special_information} </p>
                            </div>
                          </Hide>
                        </CardBody>
                      </Card>
                    </Show>
                    <Show IF={isValid(user?.institute_name) || isValid(user?.company_name)}>
                      <Card className='shadow'>
                        <CardHeader className=''>
                          <Row className='flex-1'>
                            <Col md='8'>
                              <h5 className='mb-0'>{FM('studies-work')}</h5>
                            </Col>
                            <Col md='4' className='d-flex align-items-center justify-content-end'>
                              <BsTooltip
                                onClick={() => {
                                  setStep(incompletePatientSteps['studies-work'])
                                  setAddPatient(true)
                                }}
                                Tag={Edit}
                                title={FM('edit')}
                                role={'button'}
                                size={18}
                              />
                            </Col>
                          </Row>
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Hide IF={!isValid(user?.institute_name)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('institute-name')}</div>
                                  <p className=''> {user?.institute_name} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.institute_contact_number)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('institute-phone')}</div>
                                  <p className=''> {user?.institute_contact_number} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.institute_full_address)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('institute-address')}</div>
                                  <p className=''> {user?.institute_full_address} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.classes_from)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('time-from')}</div>
                                  <p className=''> {formatDate(user?.classes_from, 'HH:mm')} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.classes_to)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('time-to')}</div>
                                  <p className=''> {formatDate(user?.classes_to, 'HH:mm')} </p>
                                </div>
                              </Col>
                            </Hide>
                          </Row>
                          <hr className='mt-0 mb-2' />
                          <Row className=''>
                            <Hide IF={!isValid(user?.company_name)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('company-name')}</div>
                                  <p className=''> {user?.company_name} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.company_contact_number)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('company-phone')}</div>
                                  <p className=''> {user?.company_contact_number} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.company_full_address)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('company-address')}</div>
                                  <p className=''> {user?.company_full_address} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.from_timing)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('working-from')}</div>
                                  <p className=''> {formatDate(user?.from_timing, 'HH:mm')} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.to_timing)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('work-to')}</div>
                                  <p className=''> {formatDate(user?.to_timing, 'HH:mm')} </p>
                                </div>
                              </Col>
                            </Hide>
                          </Row>
                        </CardBody>
                      </Card>
                    </Show>
                    <Show IF={isValid(user?.another_activity)}>
                      <Card className='shadow'>
                        <CardHeader className=''>
                          <Row className='flex-1'>
                            <Col md='8'>
                              <h5 className='mb-0 fw-bold '>{FM('other-activities')}</h5>
                            </Col>
                            <Col md='4' className='d-flex align-items-center justify-content-end'>
                              <BsTooltip
                                onClick={() => {
                                  setStep(incompletePatientSteps['other-activities'])
                                  setAddPatient(true)
                                }}
                                Tag={Edit}
                                title={FM('edit')}
                                role={'button'}
                                size={18}
                              />
                            </Col>
                          </Row>
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Hide IF={!isValid(user?.another_activity)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('activity-type')}</div>
                                  <p className=''> {user?.another_activity} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.another_activity_name)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('name')}</div>
                                  <p className=''> {user?.another_activity_name} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.activitys_contact_number)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('phone')}</div>
                                  <p className=''> {user?.activitys_contact_number} </p>
                                </div>
                              </Col>
                            </Hide>
                            <Hide IF={!isValid(user?.activitys_full_address)}>
                              <Col md='4'>
                                <div className='mb-2'>
                                  <div className='h6 '>{FM('address')}</div>
                                  <p className=''> {user?.activitys_full_address} </p>
                                </div>
                              </Col>
                            </Hide>
                          </Row>
                        </CardBody>
                      </Card>
                    </Show>
                    <Show IF={isValidArray(user?.agency_hours)}>
                      <Card className='shadow'>
                        <CardHeader className=''>
                          <Row className='flex-1'>
                            <Col md='8'>
                              <h5 className='mb-0 fw-bold '>{FM('decision-document')}</h5>
                            </Col>
                            <Col md='4' className='d-flex align-items-center justify-content-end'>
                              <BsTooltip
                                onClick={() => {
                                  setStep(incompletePatientSteps['decision-document'])
                                  setAddPatient(true)
                                }}
                                Tag={Edit}
                                title={FM('edit')}
                                role={'button'}
                                size={18}
                              />
                            </Col>
                          </Row>
                        </CardHeader>
                        <CardBody>
                          {user?.agency_hours?.map((d, i) => {
                            return (
                              <>
                                <Row>
                                  <Hide IF={!isValid(d?.name)}>
                                    <Col md='3'>
                                      <div className='mb-2'>
                                        <div className='h6 '>{FM('agency')}</div>
                                        <p className=''> {d?.name} </p>
                                      </div>
                                    </Col>
                                  </Hide>
                                  <Hide IF={!isValid(d?.assigned_hours)}>
                                    <Col md='3'>
                                      <div className='mb-2'>
                                        <div className='h6 '>{FM('hours')}</div>
                                        <p className=''> {d?.assigned_hours} </p>
                                      </div>
                                    </Col>
                                  </Hide>
                                  <Hide IF={!isValid(d?.start_date)}>
                                    <Col md='3'>
                                      <div className='mb-2'>
                                        <div className='h6 '>{FM('start-date')}</div>
                                        <p className=''> {d?.start_date} </p>
                                      </div>
                                    </Col>
                                  </Hide>
                                  <Hide IF={!isValid(d?.end_date)}>
                                    <Col md='3'>
                                      <div className='mb-2'>
                                        <div className='h6 '>{FM('end-date')}</div>
                                        <p className=''> {d?.end_date} </p>
                                      </div>
                                    </Col>
                                  </Hide>
                                </Row>
                              </>
                            )
                          })}
                        </CardBody>
                      </Card>
                    </Show>
                  </div>
                </Hide>
              </Show>
            </Form>
          </Hide>
        </>
      )}
    </div>
  )
}

export default Step1
