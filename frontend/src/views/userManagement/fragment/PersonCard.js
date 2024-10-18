import React, { useState } from 'react'
import { Edit, Mail, Trash, User } from 'react-feather'
import { useForm } from 'react-hook-form'
import { Button, Card, CardBody, CardHeader, Col, Form, Row } from 'reactstrap'
import { personApprovalAdd } from '../../../utility/apis/userManagement'
import { CategoryType } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import Show from '../../../utility/Show'
import FormGroupCustom from '../../components/formGroupCustom'
import MiniTable from '../../components/tableGrid/miniTable'
import BsTooltip from '../../components/tooltip'

const PersonCard = ({
  showForm = false,
  renderPersonType = () => {},
  handleSubmit = () => {},
  errors,
  watch,
  control,
  setValue,
  data = null,
  index
}) => {
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState(false)
  const onSubmit = (d) => {
    personApprovalAdd({
      jsonData: {
        is_approval_requested: 1,
        approval_type: watch('manual-approval') ? 1 : parseInt(d?.approval_type),
        request_type: CategoryType?.implementation,
        request_type_id: data?.ip_id,
        requested_to: data?.id,
        reason_for_requesting: 'Implementation Person Approval'
      },
      loading: setLoading,

      success: (e) => {
        setRes(true)
        console.log(e)
        window.open(e?.filepath, '_blank')

        //  onSuccess(data?.payload)
        //  setPatientRes(data?.payload)
      }
    })
  }
  return (
    <>
      <Col md='6' className='mb-2'>
        <div className='shadow'>
          <CardHeader className='pb-0 pt-1'>
            <Row className='align-items-center'>
              <Col xs='8'>
                <h5 className='mb-0 fw-bold text-primary'>{`${FM('person')}`}</h5>
                <p className='text-muted text-small-12 mb-0'>{renderPersonType()} </p>
              </Col>
              {/* <Col xs="4" className='d-flex justify-content-end'>

                                <BsTooltip Tag={Edit} size={18} title={FM("edit")} className="" color="black" role="button" />
                                {" "}
                                <BsTooltip Tag={Trash} size={18} title={FM("delete")} className="" color="red" role="button" />

                            </Col> */}
            </Row>
          </CardHeader>
          <CardBody>
            <MiniTable
              rowProps={{ className: 'mb-5px' }}
              separatorProps={{ className: 'd-none' }}
              labelProps={{ md: 1 }}
              valueProps={{ md: 11 }}
              icon={<User size={16} />}
              value={data?.name}
            />
            <MiniTable
              rowProps={{ className: 'mb-5px' }}
              separatorProps={{ className: 'd-none' }}
              labelProps={{ md: 1 }}
              valueProps={{ md: 11 }}
              icon={<Mail size={16} />}
              value={data?.email}
            />
            <p className='text-danger text-small-12 mb-0 mt-1 fw-bold'>
              {data?.is_presented ? <>{FM('presented')}</> : ''}
              {data?.is_participated ? (
                <>
                  {' '}
                  {FM('and')} {FM('participated')}
                </>
              ) : (
                ''
              )}
            </p>
            {data?.is_approval_requested === 0 && !res ? (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col>
                    <Col md='12'>
                      <FormGroupCustom
                        name={`${index}.selected_request_type`}
                        label={FM('request-for-approval')}
                        type={'checkbox'}
                        control={control}
                        errors={errors}
                        className='mb-2'
                        rules={{ required: false }}
                        values={data}
                      />
                    </Col>
                  </Col>
                  <Show IF={watch(`${index}.selected_request_type`)}>
                    <Col md='12'>
                      <div className='d-flex'>
                        {/* <FormGroupCustom
                                                name={`approval_type`}
                                                type={"radio"}
                                                //   defaultChecked={watch("seasonal_regular") === "seasonal"}
                                                value={1}
                                                errors={errors}
                                                label={FM('manual')}
                                                className="mb-2 me-2"
                                                control={control}
                                                rules={{ required: false }}
                                                values={data} /> */}
                        {!watch('manual-approval') ? (
                          <>
                            <FormGroupCustom
                              name={`approval_type`}
                              type={'radio'}
                              //  defaultChecked={watch("seasonal_regular") === "seasonal"}
                              value={2}
                              errors={errors}
                              label={FM('mobile-bank')}
                              className='mb-2 me-2'
                              control={control}
                              rules={{ required: true }}
                              values={data}
                            />
                            <FormGroupCustom
                              name={`approval_type`}
                              type={'radio'}
                              //  defaultChecked={watch("seasonal_regular") === "regular"}
                              value={3}
                              label={FM('digital-signature')}
                              errors={errors}
                              className='mb-2'
                              control={control}
                              rules={{ required: true }}
                              values={data}
                            />
                          </>
                        ) : null}
                      </div>
                    </Col>
                  </Show>
                  <Show IF={watch(`${index}.selected_request_type`)}>
                    <Col md='12'>
                      <Button.Ripple type='button' color='primary' onClick={handleSubmit(onSubmit)}>
                        {FM('send')}
                      </Button.Ripple>
                    </Col>
                  </Show>
                </Row>
              </Form>
            ) : (
              <p className='text-success text-small-12 mb-0 mt-1 fw-bold'>{FM('request-sent')}</p>
            )}
          </CardBody>
        </div>
      </Col>
    </>
  )
}

export default PersonCard
