import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Edit2, Mail, MapPin, PhoneCall, Plus, Trash2, User } from 'react-feather'
import { useForm } from 'react-hook-form'
import SlideDown from 'react-slidedown'
// ** Reactstrap Imports
import { Button, ButtonGroup, CardBody, CardHeader, Col, Row } from 'reactstrap'
import { forDecryption } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import {
  decryptObject,
  fastLoop,
  isObjEmpty,
  renderPersonType,
  truncateText
} from '../../../utility/Utils'
import { deletePersonApi } from '../../../utility/apis/userManagement'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import { FM, isValid, isValidArray, log } from '../../../utility/helpers/common'
import PersonsForm from '../../common/personsForm'
import FormGroupCustom from '../../components/formGroupCustom'
import MiniTable from '../../components/tableGrid/miniTable'
import BsTooltip from '../../components/tooltip'

const PersonModal = ({
  form = null,
  ip = null,
  onSelectPerson = () => {},
  hideEdit = false,
  fromView = false,
  hideHeader = false,
  onEdit = () => {},
  customButton = null,
  fromIp = false,
  hideAdd = false,
  incomplete = null,
  scrollControl = true,
  userType = null,
  onSuccess = () => {},
  edit = null,
  noView = false,
  handleToggle = () => {},
  showModal = false,
  setShowModal = () => {},
  userId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const [persons, setPersons] = useState([])
  const [personsSelected, setPersonsSelected] = useState([])
  const [index, setIndex] = useState(-1)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError
  } = useForm()

  useEffect(() => {
    if (edit) {
      setIndex(edit?.persons?.length - 1)
      setPersons(
        edit?.persons?.map((a) => ({
          ...a,
          ...a?.user,
          ...decryptObject(forDecryption, a),
          ...decryptObject(forDecryption, a?.user)
        }))
      )
    }
  }, [edit])

  useEffect(() => {
    // setValue("persons", persons)
    onSuccess(persons)
  }, [persons])

  useEffect(() => {
    // setValue("persons", persons)
    onSelectPerson(personsSelected)
  }, [personsSelected])

  const toggleSelected = (personId, value, type, how = null, person = {}) => {
    log(personId, value, type)
    const ifSelected = personsSelected?.findIndex((a) => a.id === personId)
    if (ifSelected !== -1) {
      log('added')
      const p = personsSelected[ifSelected]
      // update
      if (type === 'participated') {
        if (p?.is_presented) {
          if (value === false) {
            personsSelected[ifSelected] = {
              ...personsSelected[ifSelected],
              id: personId,
              is_participated: false,
              is_presented: true,
              how_helped: null
            }
          } else {
            personsSelected[ifSelected] = {
              ...personsSelected[ifSelected],
              id: personId,
              is_participated: true,
              is_presented: true,
              how_helped: how ?? personsSelected[ifSelected]?.how
            }
          }
        } else {
          if (value === false) {
            // personsSelected.splice(ifSelected, 1)
            personsSelected[ifSelected] = {
              ...personsSelected[ifSelected],
              id: personId,
              is_participated: false,
              is_presented: false,
              how_helped: null
            }
          } else {
            personsSelected[ifSelected] = {
              ...personsSelected[ifSelected],
              id: personId,
              is_participated: true,
              is_presented: true,
              how_helped: how
            }
          }
        }
      }
      if (type === 'presented') {
        // if (per?.is_participated) {
        if (value === false) {
          // personsSelected.splice(ifSelected, 1)
          personsSelected[ifSelected] = {
            ...personsSelected[ifSelected],
            id: personId,
            is_participated: false,
            is_presented: false,
            how_helped: null
          }
        }
        // }
      }
      setPersonsSelected([...personsSelected])
    } else {
      log('add')
      //add
      const a = {
        ...person,
        id: personId,
        is_participated: type === 'participated' ? value : false,
        is_presented: type === 'presented' ? value : type === 'participated'
      }
      log(a)
      setPersonsSelected([...personsSelected, a])
    }
  }

  useEffect(() => {
    if (isValidArray(ip?.persons) && isValidArray(persons)) {
      fastLoop(ip?.persons, (d, i) => {
        const fullDetails = persons?.find((a) => a.id === d?.user_id)
        toggleSelected(
          d?.user_id,
          d?.is_presented || d?.is_participated,
          d?.is_participated ? 'participated' : 'presented',
          d?.how_helped,
          fullDetails
        )
      })
    }
  }, [ip, persons])

  useEffect(() => {
    if (isValidArray(ip?.persons) && isValidArray(persons)) {
      fastLoop(persons, (d, i) => {
        const index = ip?.persons?.findIndex((a) => a.user_id === d?.id)
        if (index !== -1) {
          const p = ip?.persons[index]
          setValue(`persons.${i}.is_presented`, p?.is_presented)
          setValue(`persons.${i}.is_participated`, p?.is_participated)
          setValue(`persons.${i}.how_helped`, p?.how_helped)
          toggleSelected(
            p?.user_id,
            p?.is_presented || p?.is_participated,
            p?.is_participated ? 'participated' : 'presented',
            p?.how_helped,
            d
          )
        }
        // const fullDetails = ip?.persons?.find(a => a.user_id === d?.id)
      })
    }
  }, [ip, persons])

  const addNew = () => {
    setIndex(index + 1)
    setShowForm(true)
    setPersons([
      ...persons,
      {
        city: '',
        contact_number: '',
        country_id: '',
        email: '',
        full_address: '',
        postal_area: '',
        is_caretaker: false,
        is_contact_person: false,
        is_family_member: false,
        is_guardian: false,
        name: '',
        zipcode: ''
      }
    ])
    // setValue("persons", persons)
  }
  // useEffect(() => {
  //     if (!isValidArray(persons) && !fromIp) {
  //         addNew()
  //     }
  // }, [fromIp, persons])

  const editPerson = (index) => {
    setIndex(index)
    setShowForm(true)
    setIsEdit(true)
  }
  const deletePerson = (x, id) => {
    const p = [...persons]
    p?.splice(x, 1)

    if (isValid(id)) {
      deletePersonApi({
        id
      })
    }
    setPersons(p)
    setValue('persons', p)
    setIndex(p?.length - 1)
    log('x', p)
    log('persons', persons)
    log('i', x)
    log('id', id)
    setPersons(p)
    setValue('persons', p)
    setIndex(p?.length - 1)
    // setPersons(p)
    // onEdit(p)
    // setPersons([...n])
    // setIndex(index - 1)
    // setIndex(p?.length - 1)
    // setValue("persons", p)
  }

  // useEffect(() => {
  //     if (showForms === false) {
  //         setShowForm(showForms)
  //         setIsEdit(false)
  //     }
  // }, [showForms])

  // useEffect(() => {
  //     if (actionType === "close") {
  //         if (!isEdit) deletePerson(index)
  //     }
  // }, [actionType])

  const handleClose = () => {
    setShowForm(false)
    deletePerson(index)
    reset()
  }

  const handleAdd = (e) => {
    // log(e)
    if (isObjEmpty(errors)) {
      log('add Called', e)
      const a = persons
      a[index] = e?.persons[index]
      setPersons([...a])
      setIndex(a?.length - 1)
      onEdit([...a])
      setShowForm(false)
    }
  }

  return (
    <Fragment>
      <Hide IF={showForm}>
        {/* <Row className='d-flex align-items-start justify-content-start mb-2'>
                    {isValid(incom) ? <>  {!incom?.personal_details ? <Col md="3" >
                        <Badge color='danger' className='badge-glow '>

                            <span className='align-middle ms-25'>{FM("kfdgfhgfg")}</span>
                        </Badge>
                    </Col> : null}
                        {!incom?.relative_caretaker ? <Col md="3" >
                            <Badge color='danger' className='badge-glow '> <X size={18} className='align-middle me-25' /><span>{FM("relative-caretaker")}</span></Badge>
                        </Col> : null}
                        {!incom?.disability_details ? <Col md="3" >
                            <Badge color='danger' className='badge-glow'><X size={18} className='align-middle me-25' /><span>{FM("disability-details")}</span></Badge>
                        </Col> : null}
                        {!incom?.studies_work ? <Col md="6" >
                            <Badge color='danger' className='badge-glow '><X size={18} className='align-middle me-25' /><span>{FM("studies-work")}</span></Badge>
                        </Col> : null}
                        {!incom?.decision_document ? <Col md="6" >
                            <Badge color='danger' className='badge-glow'><X size={18} className='align-middle me-25' /><span>{FM("decision-document")}</span></Badge>
                        </Col> : null}</> : null}
                </Row> */}
        <Hide IF={hideHeader}>
          <Row className='align-items-start'>
            <Col md='10'>
              <div className='content-header'>
                <h5 className='mb-0'>{FM('persons')}</h5>
                <small className='text-muted'>{FM('add-person-optional')}</small>
              </div>
            </Col>
            <Col md='2' className='d-flex justify-content-end'>
              {customButton}
              <Hide IF={hideAdd}>
                <Show IF={Permissions.personsAdd}>
                  <BsTooltip
                    title={FM('add-person')}
                    Tag={Button.Ripple}
                    onClick={() => {
                      addNew()
                    }}
                    className=''
                    color='primary'
                    outline
                    size='sm'
                  >
                    <Plus size={16} />
                  </BsTooltip>
                </Show>
              </Hide>
            </Col>
          </Row>
        </Hide>
      </Hide>
      <Hide IF={persons?.length <= 0 || showForm}>
        <Row className=''>
          <Col md='12' className=''>
            <Row>
              {persons?.map((p, i) => {
                return (
                  <>
                    <Col md='6' className='mb-2'>
                      <div
                        className={classNames({ 'border rounded': fromView, shadow: !fromView })}
                      >
                        <CardHeader className='pb-1 pt-1'>
                          <Row className='align-items-center flex-1'>
                            <Col xs='8'>
                              <h5 className='mb-0 fw-bold text-primary'>{`${FM('person')} ${
                                i + 1
                              }`}</h5>
                              <p className='text-muted text-small-12 mb-0'>
                                {renderPersonType(p)}{' '}
                              </p>
                            </Col>
                            <Col xs='4' className='d-flex justify-content-end'>
                              <Hide IF={showForm || hideEdit}>
                                <ButtonGroup>
                                  <Show IF={Permissions.personsEdit}>
                                    <BsTooltip
                                      Tag={Button.Ripple}
                                      size={'sm'}
                                      title={FM('edit')}
                                      onClick={() => {
                                        editPerson(i)
                                      }}
                                      color='primary'
                                    >
                                      <Edit2 size={15} />
                                    </BsTooltip>
                                  </Show>
                                  <Show IF={Permissions.personsDelete}>
                                    <Hide IF={isValid(p?.id)}>
                                      <BsTooltip
                                        Tag={Button.Ripple}
                                        size={'sm'}
                                        title={FM('delete')}
                                        onClick={() => {
                                          deletePerson(i, p?.id)
                                        }}
                                        color='danger'
                                      >
                                        <Trash2 size={15} />
                                      </BsTooltip>
                                    </Hide>
                                    <Show IF={isValid(p?.id)}>
                                      <BsTooltip
                                        Tag={Button.Ripple}
                                        size={'sm'}
                                        title={FM('delete')}
                                        color='danger'
                                      >
                                        <ConfirmAlert
                                          item={p}
                                          title={FM('delete-this', { name: p?.name })}
                                          color='text-warning'
                                          onClickYes={() =>
                                            deletePersonApi({
                                              id: p?.id,
                                              success: (e) => {
                                                deletePerson({ i, id: null })
                                              }
                                            })
                                          }
                                          onSuccessEvent={() => {}}
                                          className=''
                                          id={`grid-delete-${p?.id}`}
                                        >
                                          <Trash2 size={15} />
                                        </ConfirmAlert>
                                      </BsTooltip>
                                    </Show>
                                  </Show>
                                </ButtonGroup>
                              </Hide>
                            </Col>
                          </Row>
                        </CardHeader>
                        <CardBody>
                          <MiniTable
                            rowProps={{ className: 'mb-5px' }}
                            separatorProps={{ className: 'd-none' }}
                            labelProps={{ md: 1 }}
                            valueProps={{ md: 11 }}
                            icon={<User size={16} />}
                            value={truncateText(p?.name, 35)}
                          />
                          <MiniTable
                            rowProps={{ className: 'mb-5px' }}
                            separatorProps={{ className: 'd-none' }}
                            labelProps={{ md: 1 }}
                            valueProps={{ md: 11 }}
                            icon={<Mail size={16} />}
                            value={p?.email}
                          />
                          <MiniTable
                            rowProps={{ className: 'mb-5px' }}
                            separatorProps={{ className: 'd-none' }}
                            labelProps={{ md: 1 }}
                            valueProps={{ md: 11 }}
                            icon={<PhoneCall size={16} />}
                            value={p?.contact_number ?? 'N/A'}
                          />
                          <MiniTable
                            rowProps={{ className: 'mb-5px' }}
                            separatorProps={{ className: 'd-none' }}
                            labelProps={{ md: 1 }}
                            valueProps={{ md: 11 }}
                            icon={<MapPin size={16} />}
                            value={`${truncateText(p?.full_address, 30) ?? 'N/A'} ${
                              p?.city ?? ''
                            } ${p?.country_name ?? ''} ${p?.postal_area ?? ''} ${p?.zipcode ?? ''}`}
                          />
                          {/* <p className='text-danger text-small-12 mb-0 mt-1 fw-bold'>
                                                            {p?.is_presented ? <>{FM("presented")}</> : ''}
                                                            {p?.is_participated ? <> {FM("and")} {FM("participated")}</> : ''}
                                                        </p> */}
                          <Show IF={fromIp}>
                            <div className='content-header mt-3 mb-1'>
                              <h5 className='mb-0'>{FM('present-participated')}</h5>
                              <small>{FM('present-participated-details')}</small>
                            </div>
                            <Row
                              key={`sddsdcke-${isValid(
                                personsSelected?.find((a) => a.id === p?.id)
                              )}-${personsSelected?.length}`}
                            >
                              <Col md='3'>
                                <FormGroupCustom
                                  key={`cke-${isValid(
                                    personsSelected?.find((a) => a.id === p?.id)
                                  )}-${personsSelected?.length}`}
                                  name={`persons.${i}.is_presented`}
                                  type={'checkbox'}
                                  label={'presented'}
                                  // error={findErrors('is_presented')}
                                  classNameLabel={'w-100'}
                                  className='mb-2'
                                  control={control}
                                  onChangeValue={(e) => {
                                    toggleSelected(p?.id, e, 'presented', null, p)
                                    if (!e) {
                                      setValue(`persons.${i}.is_participated`, 0)
                                    }
                                  }}
                                  value={watch(`persons.${i}.is_presented`)}
                                />
                              </Col>
                              <Col md='3'>
                                <FormGroupCustom
                                  name={`persons.${i}.is_participated`}
                                  type={'checkbox'}
                                  label={'participated'}
                                  // error={findErrors('is_participated')}
                                  classNameLabel={'w-100'}
                                  className='mb-2'
                                  control={control}
                                  onChangeValue={(e) => {
                                    toggleSelected(p?.id, e, 'participated', null, p)
                                    if (e) {
                                      setValue(`persons.${i}.is_presented`, 1)
                                    }
                                  }}
                                  value={watch(`persons.${i}.is_participated`)}
                                />
                              </Col>
                              <Show IF={watch(`persons.${i}.is_participated`)}>
                                <SlideDown>
                                  <Col md='12'>
                                    <FormGroupCustom
                                      name={`persons.${i}.how_helped`}
                                      label={FM('how-participated')}
                                      type={'autocomplete'}
                                      onChangeValue={(e) => {
                                        toggleSelected(p?.id, true, 'participated', e, p)
                                      }}
                                      className='mb-2'
                                      control={control}
                                      rules={{ required: false }}
                                      value={watch(`persons.${i}.how_helped`)}
                                    />
                                  </Col>
                                </SlideDown>
                              </Show>
                            </Row>
                          </Show>
                        </CardBody>
                      </div>
                    </Col>
                  </>
                )
              })}
            </Row>
          </Col>
        </Row>
      </Hide>

      <Show IF={showForm}>
        <Row>
          <Col md='12 mb-2'>
            <div className='pb-2 border-bottom'>
              <Show IF={isValidArray(persons)}>
                <PersonsForm
                  fromIp={fromIp}
                  key={`${index}-person`}
                  index={index}
                  requiredEnabled={true}
                  watch={watch}
                  setValue={setValue}
                  edit={persons && persons[index]}
                  personsCard={persons}
                  control={control}
                  errors={errors}
                />
              </Show>
              <div className='d-flex justify-content-end'>
                <ButtonGroup className='contact-person-btn'>
                  <Button.Ripple color='danger' size='sm' outline onClick={handleClose}>
                    {FM('delete')}
                  </Button.Ripple>
                  <Button.Ripple color='primary' size='sm' onClick={handleSubmit(handleAdd)}>
                    {FM('save-person')}
                  </Button.Ripple>
                </ButtonGroup>
              </div>
            </div>
          </Col>
        </Row>
      </Show>
    </Fragment>
  )
}

export default PersonModal
