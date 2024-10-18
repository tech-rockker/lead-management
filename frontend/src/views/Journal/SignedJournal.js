import React, { useState } from 'react'
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
import { actionJournalAction } from '../../utility/apis/journal'
import { FM } from '../../utility/helpers/common'

const SignedJournal = ({ loadJournal = () => {}, signed, setSigned, handleSigned, item }) => {
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
    actionJournalAction({
      jsonData: {
        ...data,
        journal_action_ids: [item?.id],
        is_signed: 1
      },
      loading: setLoading,

      success: (d) => {
        handleSigned()
        loadJournal()
      }
    })
  }
  return (
    <Modal isOpen={signed} toggle={() => setSigned(!signed)}>
      <ModalHeader toggle={() => setSigned(!signed)}>Sign</ModalHeader>
      <Form onSubmit={handleSubmit(handleSave)}>
        <ModalBody>
          <Row>
            <Col md='12'>{FM('do-you-really-want-to-sign-this-journal?')}</Col>
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

export default SignedJournal
