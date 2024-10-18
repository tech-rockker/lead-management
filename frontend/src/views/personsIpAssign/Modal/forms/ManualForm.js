import { Print } from '@material-ui/icons'
import React, { useState } from 'react'
import { Button, ButtonGroup, Col, Row } from 'reactstrap'
import { ipFollowupsPrint } from '../../../../utility/apis/ip'
import { FM } from '../../../../utility/helpers/common'
import ConfirmAlert from '../../../../utility/helpers/ConfirmAlert'
import { Permissions } from '../../../../utility/Permissions'
import Show from '../../../../utility/Show'

function ManualForm({
  data,
  control,
  handleSubmit = () => {},
  errors,
  reset,
  setValue,
  watch,
  getValues,
  setError
}) {
  const [enableUpload, setEnableUpload] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <>
      <Row>
        <Col>
          <ButtonGroup>
            <Show IF={Permissions.requestsAdd}>
              <Button.Ripple
                className='btn btn-info btn-sm'
                onClick={() => (!enableUpload ? setEnableUpload(true) : setEnableUpload(false))}
              >
                {FM('upload')}
              </Button.Ripple>
              <ConfirmAlert
                title={FM('print')}
                item={data}
                color='text-sucess'
                enableNo={false}
                text={'Do you want to take printout?'}
                successTitle={FM('printed')}
                onClickYes={() =>
                  ipFollowupsPrint({ id: data?.id, jsonData: { bankid_verified: 'yes' } })
                }
                // eslint-disable-next-line no-undef
                onClickNo={() =>
                  ipFollowupsPrint({ id: data?.id, jsonData: { bankid_verified: 'no' } })
                }
                className='btn btn-outline-dark btn-sm'
                id={`grid-print-${data?.id}`}
              >
                <Print />
              </ConfirmAlert>
            </Show>
          </ButtonGroup>
        </Col>
      </Row>
    </>
  )
}

export default ManualForm
