import { Email, Person, Phone } from '@material-ui/icons'
import { Fragment, useEffect, useState } from 'react'
import {
  Code,
  Edit,
  Edit2,
  Globe,
  Mail,
  Map,
  MapPin,
  PenTool,
  PhoneCall,
  Plus,
  Send,
  Star,
  Trash2,
  User,
  X
} from 'react-feather'
import { useForm } from 'react-hook-form'
// ** Reactstrap Imports
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Row,
  CardHeader,
  Label,
  Badge,
  Form
} from 'reactstrap'
import { personApprovalAdd } from '../../../utility/apis/userManagement'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import { isObjEmpty } from '../../../utility/Utils'
import PersonsForm from '../../common/personsForm'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'
import MiniTable from '../../components/tableGrid/miniTable'
import BsTooltip from '../../components/tooltip'
import PersonCard from './PersonCard'

const PersonApprovalModal = ({
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
  const [index, setIndex] = useState(-1)
  const [isEdit, setIsEdit] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [incom, setIncomp] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm()

  useEffect(() => {
    if (edit) {
      setIndex(edit?.persons?.length - 1)
      setPersons(edit?.persons)
      setIncomp(incomplete)
    }
  }, [edit])

  useEffect(() => {
    setValue('persons', persons)
    onSuccess(persons)
  }, [persons])

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
  }
  const editPerson = (index) => {
    setIndex(index)
    setShowForm(true)
    setIsEdit(true)
  }
  const deletePerson = (x) => {
    const p = persons
    p?.splice(x, 1)
    log('x', p)
    log('persons', p)
    setPersons(p)
    // setPersons([...n])
    setIndex(index - 1)
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
  }

  const handleAdd = (e) => {
    // log(e)
    if (isObjEmpty(errors)) {
      log('add Called')
      setPersons(e?.persons)
      setShowForm(false)
    }
  }

  // const onSubmit = (d) => {

  //     personApprovalAdd({
  //         jsonData: {
  //             d
  //         },
  //         loading: setLoading,

  //         success: (data) => {
  //             onSuccess(data?.payload)
  //             //  setPatientRes(data?.payload)
  //         }
  //     })
  // }

  const renderPersonType = (person) => {
    let re = ''
    if (person?.is_family_member) {
      re += `${FM('is-family-member')}, `
    }
    if (person?.is_contact_person) {
      re += `${FM('is-contact-person')}, `
    }
    if (person?.is_caretaker) {
      re += `${FM('is-caretaker')}, `
    }
    if (person?.is_guardian) {
      re += `${FM('is-guardian')}, `
    }
    if (person?.is_other) {
      re += person?.is_other_name
    }
    return re
  }
  return (
    <Fragment>
      {/* <Hide IF={showForm}>
                <Row className='align-items-start'>
                    <Col md="10">
                        <div className='content-header'>
                            <h5 className='mb-0'>{FM("person")}</h5>
                            <small className='text-muted'>{FM("add-person-optional")}</small>
                        </div>
                    </Col>
                    <Col md="2" className='d-flex justify-content-end'>
                        <Hide IF={hideAdd}>
                            <BsTooltip title={FM("add-person")} Tag={Button.Ripple} onClick={() => { addNew() }} className="" color="primary" outline size="sm">
                                <Plus size={16} />
                            </BsTooltip>
                        </Hide>
                    </Col>
                </Row>
            </Hide> */}
      <FormGroupCustom
        name={`manual-approval`}
        type={'checkbox'}
        //   defaultChecked={watch("seasonal_regular") === "seasonal"}
        value={1}
        errors={errors}
        label={FM('manual')}
        className='mb-2 me-2'
        control={control}
        rules={{ required: false }}
        values={persons}
      />
      <Hide IF={persons?.length <= 0 || showForm}>
        <Row className='mb-2'>
          <Col md='12' className='mb-2'>
            <Row>
              {persons?.map((p, i) => {
                return (
                  <>
                    <PersonCard
                      handleSubmit={handleSubmit}
                      watch={watch}
                      errors={errors}
                      control={control}
                      showForm={showForm}
                      isManual={watch('manual')}
                      renderPersonType={renderPersonType}
                      data={p}
                      index={i}
                    />
                  </>
                )
              })}
            </Row>
          </Col>
        </Row>
      </Hide>

      {/* <Show IF={showForm}>
                <Row>
                    <Col md="12 mb-2">
                        <div className='pb-2 border-bottom'>
                            <PersonsForm
                                fromIp={fromIp}
                                key={index}
                                index={index}
                                requiredEnabled={true}
                                watch={watch}
                                setValue={setValue}
                                edit={persons && persons[index]}
                                control={control}
                                errors={errors}
                            />
                            <div className='d-flex justify-content-end'>
                                <ButtonGroup className='mt-2'>
                                    <Button.Ripple color="danger" size="sm" outline onClick={handleClose}>
                                        {FM("delete")}
                                    </Button.Ripple>
                                    <Button.Ripple color="primary" size="sm" onClick={handleSubmit(handleAdd)}>
                                        {FM("save-person")}
                                    </Button.Ripple>
                                </ButtonGroup>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Show> */}
    </Fragment>
  )
}

export default PersonApprovalModal
