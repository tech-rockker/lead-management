import React, { useState } from 'react'
import { X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { Button, Form, Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap'
import { importOv } from '../../../../utility/apis/ovhour'
import { FM, isValid, log } from '../../../../utility/helpers/common'
import { SuccessToast } from '../../../../utility/Utils'
import FormGroupCustom from '../../../components/formGroupCustom'

const ImportOv = ({ handleImport, open, setReload }) => {
  const [loading, setLoading] = useState(false)
  const { register, errors, handleSubmit, control, reset } = useForm()
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleImport} />

  const submitHandler = (data) => {
    const f = {}
    for (const [key, val] of Object.entries(data?.file)) {
      f[`file`] = val
    }
    if (isValid(f?.file) && data) {
      importOv({
        formData: {
          ...data,
          ...f
        },
        loading: setLoading,
        success: (e) => {
          setReload(true)
          handleImport()
          log(e)
          SuccessToast(null, {}, <div dangerouslySetInnerHTML={{ __html: e }} />)
          reset()
        }
      })
    }
  }

  return (
    <Modal
      isOpen={open}
      toggle={handleImport}
      className='sidebar-sm'
      size='lg'
      style={{ maxWidth: '500px', width: '100%' }}
    >
      <ModalHeader toggle={handleImport} close={CloseBtn} tag='div'>
        <h5 className='modal-title text-primary'> {FM('import-ov')} </h5>
      </ModalHeader>

      <ModalBody>
        <>
          <div className='text-center'>
            <p className=''> {FM('you-can-choose-a-xlsx-file-to-import')}</p>
          </div>
          <Form onSubmit={handleSubmit(submitHandler)}>
            <FormGroupCustom
              type={'file'}
              control={control}
              errors={errors}
              rules={{ required: true }}
              name='file'
              className='mb-1'
              label={FM('file')}
            />
            <div className='text-center'>
              <Button.Ripple type='submit' color='primary'>
                {loading ? <Spinner size='sm' /> : FM('upload')}
              </Button.Ripple>
            </div>
          </Form>
        </>
      </ModalBody>
    </Modal>
  )
}

export default ImportOv
