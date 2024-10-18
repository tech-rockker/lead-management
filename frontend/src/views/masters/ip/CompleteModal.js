import React, { useRef, useState } from 'react'
import { Star, X } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
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
import { completeIp } from '../../../utility/apis/ip'
import { FM, isValid } from '../../../utility/helpers/common'
import { SpaceTrim } from '../../../utility/Utils'
import LoadingButton from '../../components/buttons/LoadingButton'
import FormGroupCustom from '../../components/formGroupCustom'

const CompleteModal = ({
  onSuccess = () => {},
  completeModal,
  setCompleteModal,
  handleCompleteModal,
  open,
  setReload,
  edit
}) => {
  const [loading, setLoading] = useState(false)
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form
  const dispatch = useDispatch()
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleCompleteModal} />

  const handleSave = (form) => {
    completeIp({
      jsonData: {
        ...form,
        ip_id: edit?.id,
        status: '2'
      },
      loading: setLoading,
      dispatch,
      success: (data) => {
        onSuccess(data?.payload)
        handleCompleteModal()
      }
    })
  }
  return (
    <Modal isOpen={open} toggle={handleCompleteModal} className='modal-dialog-centered'>
      <ModalHeader toggle={handleCompleteModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title text-primary'> {FM('complete')} </h5>
      </ModalHeader>

      <ModalBody>
        <>
          <Form onSubmit={handleSubmit(handleSave)}>
            <FormGroupCustom
              type={'autocomplete'}
              control={control}
              errors={errors}
              rules={{
                required: true,
                validate: (v) => {
                  return isValid(v) ? !SpaceTrim(v) : true
                }
              }}
              name='comment'
              className='mb-1'
              label={FM('comment')}
            />
            <div className='text-center'>
              <LoadingButton disabled={loading} type='submit' loading={loading} color='primary'>
                {FM('complete')}
              </LoadingButton>
            </div>
          </Form>
        </>
      </ModalBody>
    </Modal>
  )
}

export default CompleteModal
