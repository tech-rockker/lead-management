import { Fragment, useEffect, useState } from 'react'
// ** Reactstrap Imports
import { Button, ButtonGroup, Card, CardBody, Col, Row } from 'reactstrap'
import { FM, log } from '../../../../../utility/helpers/common'
import Hide from '../../../../../utility/Hide'
import { Permissions } from '../../../../../utility/Permissions'
import Show from '../../../../../utility/Show'
import PersonsForm from '../../../../common/personsForm'
import FormGroupCustom from '../../../../components/formGroupCustom'
import MiniTable from '../../../../components/tableGrid/miniTable'

const AddPersons = ({
  actionType = null,
  requiredEnabled,
  showForms,
  setShowForms,
  watch,
  setValue,
  edit,
  onSubmit,
  control,
  errors
}) => {
  const [persons, setPersons] = useState([])
  const [index, setIndex] = useState(-1)
  const [isEdit, setIsEdit] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (showForm) setShowForms(showForm)
  }, [showForm])

  useEffect(() => {
    if (edit) setIndex(edit?.persons?.length - 1)
  }, [edit])

  useEffect(() => {
    if (watch('persons')) {
      setPersons(watch('persons'))
    }
  }, [watch('persons')])

  const addNew = () => {
    setIndex(index + 1)
    setShowForm(true)
  }
  const editPerson = (index) => {
    setIndex(index)
    setShowForm(true)
    setIsEdit(true)
  }
  const deletePerson = (x) => {
    const p = persons
    p?.splice(x, 1)
    // log("x", p)
    // log("persons", p)
    setValue('persons', p)
    // setPersons([...n])
    setIndex(index - 1)
  }

  useEffect(() => {
    if (showForms === false) {
      setShowForm(showForms)
      setIsEdit(false)
    }
  }, [showForms])

  useEffect(() => {
    if (actionType === 'close') {
      if (!isEdit) deletePerson(index)
    }
  }, [actionType])

  return (
    <Fragment>
      <Hide IF={showForm}>
        <Show IF={persons?.length === 0}>
          <div className='person-add-bg'>
            <div className='text-center bg-white p-2 shadow'>
              <h5 className='mt-2'>{FM('add-persons')}</h5>
              <p className='mb-0'>{FM('add-person-optional')}</p>
              <Show IF={Permissions.personsAdd}>
                <Button.Ripple
                  onClick={() => {
                    addNew()
                  }}
                  className='mt-2'
                  color='primary'
                  size='sm'
                >
                  {FM('add')}
                </Button.Ripple>
              </Show>
            </div>
          </div>
        </Show>
        <Hide IF={persons?.length === 0}>
          <Row>
            <Col md='8'>
              <div className='content-header'>
                <h5 className='mb-0'>{FM('added-persons')}</h5>
                <small>{FM('edit-persons-info')}</small>
              </div>
            </Col>
            <Col md='4' className='d-flex align-items-center justify-content-end'>
              <Show IF={Permissions.personsEdit}>
                <Button.Ripple
                  onClick={() => {
                    addNew()
                  }}
                  className=''
                  color='primary'
                  size='sm'
                >
                  {FM('add')}
                </Button.Ripple>
              </Show>
            </Col>
            {persons?.map((p, i) => {
              return (
                <>
                  <Col md='6'>
                    <Card>
                      <CardBody>
                        <h4 className='mb-1'>{`${FM('person')} ${i + 1}`}</h4>
                        <MiniTable labelProps={{ md: 3 }} label={FM('name')} value={p?.name} />
                        <MiniTable labelProps={{ md: 3 }} label={FM('email')} value={p?.email} />
                        <MiniTable
                          labelProps={{ md: 3 }}
                          label={FM('contact_number')}
                          value={p?.contact_number}
                        />
                        <MiniTable labelProps={{ md: 3 }} label={FM('city')} value={p?.city} />
                        <MiniTable
                          labelProps={{ md: 3 }}
                          label={FM('country')}
                          value={p?.country_name}
                        />

                        <ButtonGroup className='btn-block mt-1'>
                          <Show IF={Permissions.personsEdit}>
                            <Button.Ripple
                              onClick={() => {
                                editPerson(i)
                              }}
                              className=''
                              color='primary'
                              size='sm'
                            >
                              {FM('edit')}
                            </Button.Ripple>
                          </Show>
                          <Show IF={Permissions.personsDelete}>
                            <Button.Ripple
                              onClick={() => {
                                deletePerson(i)
                              }}
                              className=''
                              color='danger'
                              size='sm'
                            >
                              {FM('delete')}
                            </Button.Ripple>
                          </Show>
                        </ButtonGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </>
              )
            })}
          </Row>
        </Hide>
      </Hide>
      <Show IF={showForm}>
        <FormGroupCustom
          noGroup
          noLabel
          type={'hidden'}
          control={control}
          errors={errors}
          name={'persons'}
          className='d-none'
          value={edit?.persons ?? []}
          rules={{ required: requiredEnabled }}
        />
        <PersonsForm
          index={index}
          requiredEnabled={requiredEnabled}
          watch={watch}
          setValue={setValue}
          edit={persons[index]}
          onSubmit={(e) => console.log(e)}
          control={control}
          errors={errors}
        />
      </Show>
    </Fragment>
  )
}

export default AddPersons
