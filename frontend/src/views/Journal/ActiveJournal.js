import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from 'reactstrap'
import { activeJournal } from '../../utility/apis/journal'
import { loadUser } from '../../utility/apis/userManagement'
import { UserTypes } from '../../utility/Const'
import { FM } from '../../utility/helpers/common'
import { createAsyncSelectOptions } from '../../utility/Utils'
import FormGroupCustom from '../components/formGroupCustom'

const ActiveJournal = ({
  loadJournal = () => {},
  active,
  setActive,
  handleActive,
  patient_id,
  item
}) => {
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()

  const handleSave = (data) => {
    activeJournal({
      jsonData: {
        ...data,
        journal_id: item?.id,
        is_active: 1
      },
      loading: setLoading,

      success: (d) => {
        handleActive()
        loadJournal()
      }
    })
  }
  return (
    <Modal isOpen={active} toggle={() => setActive(!active)}>
      <ModalHeader toggle={() => setActive(!active)}>Active</ModalHeader>
      <Form onSubmit={handleSubmit(handleSave)}>
        <ModalBody>
          <Row>
            <Col md='12'>
              {FM('do-you-want-to-active-this-journal')}
              Do you really want to active this Journal
            </Col>
            {/* <Col md = "12">
                <FormGroupCustom
                                name={"print_with_secret"}
                                label={FM("print-secret")}
                                type={"checkbox"}
                                errors={errors}
                                className="mb-2"
                                control={control}
                                rules={{ required: false }}
                                 />
                        </Col> */}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' type='submit'>
            {loading ? <Spinner size='sm' /> : FM('yes')}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default ActiveJournal
