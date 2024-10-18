import React, { useState } from 'react'
import { Edit, PenTool } from 'react-feather'
import { useDispatch } from 'react-redux'
import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import { actionJournalAction } from '../../../utility/apis/journal'
import { forDecryption } from '../../../utility/Const'
import { FM, isValid, isValidArray } from '../../../utility/helpers/common'
import ConfirmAlert from '../../../utility/helpers/ConfirmAlert'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import { Permissions } from '../../../utility/Permissions'
import Show from '../../../utility/Show'
import { decryptObject, formatDate } from '../../../utility/Utils'
import BsTooltip from '../../components/tooltip'
import ActionModal from '../ActionModal'

const ActionList = ({ edit, onSuccess = () => {} }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [jid, setJid] = useState(null)
  const [failed, setFailed] = useState(false)
  const user = useUser()
  // const journal_action_id = edit?.payload?.map((d, i) => {
  //     return (
  //         d?.journal_id
  //     )
  // })

  const signJournal = (data) => {
    actionJournalAction({
      jsonData: {
        journal_action_ids: [data?.id],
        is_signed: 1
      },
      loading: setLoading,
      success: (e) => {
        setDeleted(e)
        onSuccess()
      },
      error: setFailed,
      dispatch
    })
  }
  // console.log(journal_action_id)
  return (
    <>
      {edit?.payload?.map((d, index) => {
        const item = {
          ...decryptObject(forDecryption, d),
          signed_by: decryptObject(forDecryption, d?.signed_by)
        }
        return (
          <>
            <Card className=''>
              <Card className=''>
                <CardBody className='pb-0'>
                  <Row>
                    <Col md='10'>
                      <div>
                        <div className='h5 text-dark fw-bolder'>{FM('action')}</div>
                        {/* <Show IF={item?.comment_action !== null}> */}
                        <p className=''> {item?.comment_action ?? 'N/A'} </p>
                        {/* </Show> */}
                        {/* <Show IF={item?.comment_action === null}>
                                                    <p className=''> ................................................................. </p>
                                                </Show> */}
                      </div>
                    </Col>
                    <Col md='2' className='d-flex justify-content-end'>
                      <span>
                        <Show IF={Permissions.journalSelfAction}>
                          {/* <ButtonGroup size='12'> */}
                          <Show IF={item?.is_signed === 0}>
                            <ActionModal onSuccess={onSuccess} edit={item} journalId={item?.id}>
                              <BsTooltip
                                className={'me-0'}
                                title={FM('edit-action/result')}
                                Tag={Button.Ripple}
                                size='sm'
                                color='primary'
                              >
                                <Edit size={14} className='ml-2' />
                              </BsTooltip>
                            </ActionModal>
                          </Show>
                          <Show IF={item?.is_signed === 0}>
                            <BsTooltip className='ms-25' title={FM('click-to-sign')}>
                              {/* <ConfirmAlert
                                item={item}
                                enableNo
                                uniqueEventId={`journal-action-event-${item?.id}`}
                                confirmButtonText={'via-bank-id'}
                                disableConfirm={!isValid(user?.personal_number)}
                                textClass='text-danger fw-bold text-small-12'
                                text={
                                  !isValid(user?.personal_number)
                                    ? 'please-add-your-personal-number'
                                    : 'how-would-you-like-to-sign'
                                }
                                denyButtonText={'normal'}
                                title={FM('sign-this-journal', {
                                  name: item?.patient?.name
                                })}
                                color='text-warning'
                                successTitle={'signed'}
                                successText={'journal is signed'}
                                onClickYes={() => {
                                  actionJournalAction({
                                    jsonData: {
                                      id: item?.id,
                                      signed_method: 'bankid',
                                      journal_action_ids: [item?.id],
                                      is_signed: 1
                                    }
                                  })
                                }}
                                onClickNo={() =>
                                  actionJournalAction({
                                    jsonData: {
                                      id: item?.id,
                                      signed_method: 'normal',
                                      journal_action_ids: [item?.id],
                                      is_signed: 1
                                    }
                                  })
                                }
                                onSuccessEvent={(item) => {
                                  onSuccess()
                                }}
                                className=''
                                id={`grid-delete-${item?.id}`}
                              >
                                <Button.Ripple
                                  size='sm'
                                  color={item?.is_signed ? 'success' : 'success'}
                                >
                                  <PenTool size='14' />
                                </Button.Ripple>
                              </ConfirmAlert> */}
                              <ConfirmAlert
                                item={item}
                                // enableNo
                                uniqueEventId={`journal-action-event-${item?.id}`}
                                // confirmButtonText={'via-bank-id'}
                                // disableConfirm={!isValid(user?.personal_number)}
                                textClass='text-danger fw-bold text-small-12'
                                // text={
                                //   !isValid(user?.personal_number)
                                //     ? 'please-add-your-personal-number'
                                //     : 'how-would-you-like-to-sign'
                                // }
                                denyButtonText={'normal'}
                                title={FM('sign-this-journal', {
                                  name: item?.patient?.name
                                })}
                                color='text-warning'
                                successTitle={'signed'}
                                successText={'journal is signed'}
                                // onClickYes={() => {
                                //   actionJournalAction({
                                //     jsonData: {
                                //       id: item?.id,
                                //       signed_method: 'bankid',
                                //       journal_action_ids: [item?.id],
                                //       is_signed: 1
                                //     }
                                //   })
                                // }}
                                onClickYes={() =>
                                  actionJournalAction({
                                    jsonData: {
                                      id: item?.id,
                                      // signed_method: 'normal',
                                      journal_action_ids: [item?.id],
                                      is_signed: 1
                                    }
                                  })
                                }
                                onSuccessEvent={(item) => {
                                  onSuccess()
                                }}
                                className=''
                                id={`grid-delete-${item?.id}`}
                              >
                                <Button.Ripple
                                  size='sm'
                                  color={item?.is_signed ? 'success' : 'success'}
                                >
                                  <PenTool size='14' />
                                </Button.Ripple>
                              </ConfirmAlert>

                              {/* <ConfirmSignAction
                                                                title={FM("sign-this-journal", { name: item?.patient?.name })}
                                                                color='text-warning'
                                                                onClickYes={() => signJournal(item)}
                                                                onSuccess={deleted}
                                                                onFailed={failed}
                                                                onClose={() => { setDeleted(null); setFailed(null) }}
                                                                className=""
                                                                id={`grid-delete-${item?.id}`}>

                                                                <PenTool size={14} />
                                                            </ConfirmSignAction> */}
                            </BsTooltip>
                          </Show>
                          {/* </ButtonGroup> */}
                        </Show>
                      </span>
                    </Col>
                    <Col md='12'>
                      <div>
                        <div className='h5 text-dark fw-bolder'>{FM('result')}</div>
                        <p className=''> {item?.comment_result ?? 'N/A'} </p>
                      </div>
                    </Col>
                    {/* <Show IF={item?.reason_for_editing !== null} >
                                            <Col md="12">
                                                <div className='mb-2'>
                                                    <div className='h5 text-dark fw-bolder'>
                                                        {FM("reason")}
                                                    </div>
                                                    <p className=''> {item?.reason_for_editing} </p>
                                                </div>

                                            </Col>
                                        </Show> */}
                    <Col md='3'>
                      <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
                        <p className=''>{formatDate(item?.created_at, 'YYYY-MM-DD hh:mm A')} </p>
                      </div>
                    </Col>
                    <Col md='3'>
                      <div className='mb-2'>
                        <div className='h5 text-dark fw-bolder'>{FM('edited-at')}</div>
                        <p className=''> {formatDate(item?.edit_date, 'YYYY-MM-DD hh:mm A')} </p>
                      </div>
                    </Col>
                    <Show IF={item?.is_signed === 1}>
                      <Col md='3'>
                        <div className='mb-2'>
                          <div className='h5 text-dark fw-bolder'>{FM('sign-by')}</div>
                          <p className=''> {item?.signed_by?.name} </p>
                        </div>
                      </Col>
                      <Col md='3'>
                        <div className='mb-2'>
                          <div className='h5 text-dark fw-bolder'>{FM('sign-at')}</div>
                          <p className=''>
                            {formatDate(item?.signed_date, 'DD MMMM YYYY hh : mm A')}{' '}
                          </p>
                        </div>
                      </Col>
                    </Show>
                    <Show IF={item?.is_signed === 0}>
                      <Col md='3'>
                        <div className='mb-2'>
                          <div className='h5 text-dark fw-bolder'>{FM('sign')}</div>
                          <p className=''> {item?.is_signed === 0 ? FM('not-signed') : ''} </p>
                        </div>
                      </Col>
                    </Show>
                    {/* <Col md="4">
                                    <div className='mb-2'>
                                        <div className='h5 text-dark fw-bolder'>
                                            {FM("sign-")}
                                        </div>
                                        <p className=''> {item?.is_signed === 1 ? FM("yes") : FM("no")} </p>
                                    </div>
                                </Col> */}
                  </Row>
                </CardBody>

                <Hide IF={!isValidArray(item?.journal_action_logs)}>
                  <CardBody className=' m-2 mb-0 shadow white'>
                    <div className='d-flex justify-content-start fw-bolder mb-2'>{FM('logs')}</div>

                    {item?.journal_action_logs.map((j, i) => {
                      return (
                        <Row className='border-bottom mb-2'>
                          <Col md='12'>
                            <div className='mb-2'>
                              <div className='h5 text-dark fw-bolder'>{FM('action')}</div>
                              <p className='' style={{ textDecoration: 'line-through' }}>
                                {' '}
                                {j?.comment_action}{' '}
                              </p>
                            </div>
                          </Col>
                          <Col md='12'>
                            <div className='mb-2'>
                              <div className='h5 text-dark fw-bolder'>{FM('result')}</div>
                              <p className='' style={{ textDecoration: 'line-through' }}>
                                {' '}
                                {j?.comment_result}{' '}
                              </p>
                            </div>
                          </Col>
                          {/* <Col md="12">
                                                        <div className='mb-2'>
                                                            <div className='h5 text-dark fw-bolder'>
                                                                {FM("reason")}
                                                            </div>
                                                            <p className='' style={{ textDecoration: "line-through" }}> {j?.reason_for_editing} </p>
                                                        </div>

                                                    </Col> */}
                          <Col md='4'>
                            <div className='mb-2'>
                              <div className='h5 text-dark fw-bolder'>{FM('created-at')}</div>
                              <p className=''>
                                {formatDate(j?.created_at, 'DD MMMM YYYY hh : mm A')}{' '}
                              </p>
                            </div>
                          </Col>
                          <Col md='4'>
                            <div className='mb-2'>
                              <div className='h5 text-dark fw-bolder'>{FM('edited-at')}</div>
                              <p className=''>
                                {' '}
                                {formatDate(j?.comment_created_at, 'DD MMMM YYYY hh : mm A')}{' '}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      )
                    })}
                  </CardBody>
                </Hide>
              </Card>
              {/* <div className='d-flex justify-content-start'>
                                Logs
                            </div>
                            <hr />
                            {item?.journal_action_logs?.map(a => a.comment_action)} */}
            </Card>
          </>
        )
      })}
    </>
  )
}

export default ActionList
