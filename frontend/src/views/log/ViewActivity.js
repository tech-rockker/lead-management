import React, { useEffect, useState } from 'react'
import { X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { JsonToTable } from 'react-json-to-table'
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Label,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from 'reactstrap'

import { getActivityLog } from '../../utility/apis/log'
import { FM, isValid } from '../../utility/helpers/common'
import Show from '../../utility/Show'
import { isObjEmpty } from '../../utility/Utils'
const ViewActivity = ({ open, formModal, setFormModal, handleViewModal, handleFilter, edit }) => {
  const [loading, setLoading] = useState(false)
  const [activity, setActivity] = useState(null)
  const [currentPage, setCurrentPage] = useState('1')
  const [rowsPerPage, setRowsPerPage] = useState('2')
  const form = useForm()
  const [filterData, setFilterData] = useState({
    per_page_record: 15
  })
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form

  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleViewModal} />

  const submitHandler = (data) => {
    if (isObjEmpty(errors)) {
      getActivityLog({
        id: edit?.id,
        jsonData: data,
        loading: setLoading,
        success: () => {
          // onClose()
          setFormModal(false)
        }
      })
    }
  }
  const preload = (data) => {
    if (edit?.id) {
      getActivityLog({
        id: edit?.id,
        page: currentPage,
        perPage: rowsPerPage,
        success: setActivity,
        jsonData: filterData
      })
    }
  }

  console.log(edit?.properties)

  useEffect(() => {
    preload()
  }, [])

  return (
    <Modal
      size='lg'
      style={{ maxWidth: '60%', width: '100%' }}
      isOpen={formModal}
      close={CloseBtn}
      toggle={() => setFormModal(!formModal)}
      className='modal-dialog-centered'
    >
      <ModalHeader className='' toggle={() => setFormModal(!formModal)}>
        {FM('activity-log')}
      </ModalHeader>
      <ModalBody className='flex-grow-1 p-0'>
        <Card className='mb-0'>
          <Form onSubmit={handleSubmit(submitHandler)}>
            <CardBody className='p-1'>
              <Row>
                <Col sm='12' md='6'>
                  <ListGroup className='ml-2 py-2'>
                    <ListGroupItem className='d-flex justify-content-between align-items-center'>
                      {/* <p>{edit?.log_name}</p> */}
                      <span className='fw-bolder'> {FM('log-name')} :</span>
                      <span className='fw-bolder'>{edit?.log_name}</span>
                      {/* <p>{edit?.properties?.attributes}</p> */}
                    </ListGroupItem>
                    <ListGroupItem className='d-flex justify-content-between align-items-center'>
                      <span className='fw-bolder'>{FM('description')}:</span>
                      <span className='fw-bolder'>{edit?.description}</span>
                    </ListGroupItem>
                    <ListGroupItem className='d-flex justify-content-between align-items-center'>
                      <span className='fw-bolder'>{FM('subject-type')} :</span>
                      <span className='fw-bolder'>{edit?.subject_type}</span>
                    </ListGroupItem>
                  </ListGroup>
                </Col>
                <Col sm='12' md='6'>
                  <ListGroup className='mr-2 py-2'>
                    <ListGroupItem className='d-flex justify-content-between align-items-center'>
                      <span className='fw-bolder'>{FM('subject-id')} :</span>
                      <span className='fw-bolder'>{edit?.subject_id}</span>
                    </ListGroupItem>
                    <ListGroupItem className='d-flex justify-content-between align-items-center'>
                      <span className='fw-bolder'>{FM('causer-type')} :</span>
                      <span className='fw-bolder'>{edit?.causer_type}</span>
                    </ListGroupItem>
                  </ListGroup>
                </Col>
              </Row>

              <Col md='12' className='p-0'>
                <Show IF={isValid(edit?.properties?.attributes)}>
                  <div>
                    <Label> {FM('attributes')} </Label>
                  </div>
                  <div>
                    <JsonToTable json={edit?.properties?.attributes} />
                  </div>
                </Show>
                <Show IF={isValid(edit?.properties?.old)}>
                  <div className='mt-2'>
                    <Label> {FM('properties')} </Label>
                  </div>
                  <JsonToTable json={edit?.properties?.old} />
                </Show>
              </Col>
            </CardBody>
          </Form>
        </Card>
      </ModalBody>
    </Modal>
  )
}

export default ViewActivity
