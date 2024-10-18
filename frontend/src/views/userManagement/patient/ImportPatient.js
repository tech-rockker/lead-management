import React, { useRef, useState } from 'react'
import { Star, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import {
  Button,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from 'reactstrap'
import { getSampleFile, importPatient } from '../../../utility/apis/userManagement'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { formatDateTimeByFormat, isObjEmpty, SuccessToast } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'

const ImportPatient = ({ importModal, setImportModal, handleImport, open, setReload }) => {
  const [loading, setLoading] = useState(false)
  const { register, errors, handleSubmit, control } = useForm()
  const [loadingSample, setLoadingSample] = useState(false)
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleImport} />

  const submitHandler = (data) => {
    log(data)
    const f = {}
    for (const [key, val] of Object.entries(data?.file)) {
      f[`file`] = val
    }
    if (isValid(f?.file)) {
      importPatient({
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
        }
      })
    }
  }

  const sampleBooking = () => {
    getSampleFile({
      loading: setLoadingSample,
      success: (e) => {
        window.open(e?.filepath, '_blank')
      }
    })
  }

  return (
    <Modal
      isOpen={open}
      toggle={handleImport}
      className='sidebar-sm'
      // modalClassName='modal-slide-back'
      // contentClassName='pt-0'
      // className='modal-dialog-centered'
      size='lg'
      style={{ maxWidth: '500px', width: '100%' }}
    >
      <ModalHeader toggle={handleImport} close={CloseBtn} tag='div'>
        <h5 className='modal-title text-primary'> {FM('import-record')} </h5>
      </ModalHeader>

      <ModalBody>
        <>
          <div className='text-center'>
            <Star size={20} />
            <p className='mt-2'>
              {' '}
              {FM(
                'Please-download-this-Excel-file-and-fill-all-the-details-accordingly.-After-that-you-can-upload-the-file-to-import-your-items.'
              )}
            </p>
          </div>
          <div className='text-center mb-1'>
            {loadingSample ? (
              <h6>
                {' '}
                <Spinner type='grow' color='primary' />
                <Spinner className='ms-1' type='grow' color='secondary' />
                <Spinner className='ms-1' type='grow' color='success' />
                <Spinner className='ms-1' type='grow' color='danger' />
                <Spinner className='ms-1' type='grow' color='warning' />
                <Spinner className='ms-1' type='grow' color='info' />
                <Spinner className='ms-1' type='grow' color='light' />
              </h6>
            ) : (
              <u onClick={sampleBooking} style={{ cursor: 'pointer' }}>
                {' '}
                {FM('download-sample-file')}{' '}
              </u>
            )}
            {/* <u onClick={sampleBooking} style={{ cursor: "pointer" }}> {FM("download-sample-file")} </u> */}
          </div>
          {/* <FormGroup>
                        <Label for='file'>Select File</Label>
                        <FormGroupCustom  type='file' id='file' name='file'  />
                    
                    </FormGroup> */}
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

export default ImportPatient
