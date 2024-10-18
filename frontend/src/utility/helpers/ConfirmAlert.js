import React, { useEffect, useState } from 'react'
import { Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Events } from '../Const'
import Emitter from '../Emitter'
import { FM, isValid, log } from './common'

const MySwal = withReactContent(Swal)
/**
 * Show Alert with confirm
 */
const ConfirmAlert = ({
  custom_unique_id = '',
  user = '',
  item = null,
  title = null,
  text = null,
  enableNo = false,
  icon = 'warning',
  confirmButtonText,
  cancelButtonText = null,
  denyButtonText,
  showCancelButton = true,
  successIcon = 'success',
  successTitle = null,
  successText = null,
  failedIcon = 'error',
  failedTitle = null,
  failedText = null,
  onClickYes = () => {},
  onClickNo = () => {},
  children,
  id = '',
  style = {},
  className = {},
  textClass = '',
  disableConfirm = false,
  onFailedEvent = () => {},
  onSuccessEvent = () => {},
  color = 'text-success',
  input = false,
  inputType = 'textarea',
  inputLabel = FM('reason-for-expiry'),
  inputOptions = null,
  uniqueEventId = Events.confirmAlert,
  listItems = []
}) => {
  const [isOpen, setOpen] = useState(true)
  const [reason, setReason] = useState()
  const [payload, setPayload] = useState(null)

  const [onSuccess, setOnsuccess] = useState(null)
  const [onFailed, setOnFailed] = useState(null)

  title = title ? FM(title) : FM('are-you-sure')
  text = text ? FM(text) : FM('you-wont-be-able-to-revert-this')
  confirmButtonText = confirmButtonText ? FM(confirmButtonText) : FM('yes')
  cancelButtonText = cancelButtonText ? FM(cancelButtonText) : FM('cancel')
  denyButtonText = denyButtonText ? FM(denyButtonText) : FM('no')
  // Success
  successTitle = successTitle ? FM(successTitle) : FM('success')
  successText = successText ? FM(successText) : FM('executed-successfully')
  // Failed
  failedTitle = failedTitle ? FM(failedTitle) : FM('failed')
  failedText = failedText ? FM(failedText) : FM('execution-failed')

  useEffect(() => {
    if (isValid(item)) {
      setPayload((i) => ({ ...i, ...item }))
    }
  }, [item])

  useEffect(() => {
    if (isOpen) {
      log('onSuccess', onSuccess)
      // log("onFailed", onFailed)
      // log("isOpen", isOpen)
    }
  }, [onSuccess, onFailed, isOpen])

  useEffect(() => {
    if (isOpen) {
      Emitter.on(uniqueEventId ?? 'test', (e) => {
        setPayload((i) => ({ ...i, ...e?.payload }))
        if (e?.type === 'success') {
          log('success rec', e)
          setOnsuccess(true)
        } else if (e?.type === 'failed') {
          log('failed rec', e)
          setOnFailed(true)
        } else {
          log('no match')
        }
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (onSuccess) {
      MySwal.fire({
        icon: successIcon,
        title: successTitle,
        text: successText,
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        log('successPayload', payload)
        onSuccessEvent(payload)
        setOpen(false)
        setOnsuccess(null)
      })
    }
  }, [onSuccess])

  useEffect(() => {
    if (onFailed) {
      MySwal.fire({
        icon: failedIcon,
        title: failedTitle,
        text: failedText,
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        onFailedEvent(payload)
        log('failedPayload', payload)
        setOpen(false)
        setOnFailed(null)
      })
    }
  }, [onFailed])

  const popup = async () => {
    setOpen(true)
    if (uniqueEventId === `delete-${item?.id}` || custom_unique_id === `delete-${user?.id}`) {
      return await MySwal.fire({
        title,
        text,
        html: `${text}
        <ul style="width:fit-content; margin: 0 auto; text-align:left; padding-top:5px">
          ${listItems.map((item) => `<li>${item}</li>`).join('')}
        </ul>`,
        icon,
        input: 'checkbox',

        inputValidator: (value) => {
          if (inputType === 'textarea') {
            if (!value) {
              setReason(value)
              return 'You need to write a valid reason!'
            }
          }
        },
        inputLabel,
        inputOptions,
        // input: input ? inputType : null,
        inputPlaceholder: FM('yes-i-want-to-delete-this-ip'),
        confirmButtonText: 'Continue <i class="fa fa-arrow-right"></i>',
        inputValidator: (result) => {
          return !result && FM('please-check-the-box-if-you-want-to-delete-this-IP')
        },
        showDenyButton: enableNo,
        showCancelButton,
        cancelButtonText,
        confirmButtonText,
        denyButtonText,
        allowOutsideClick: false,
        customClass: {
          htmlContainer: textClass,
          inputLabel: 'fw-bolder text-dark',
          input: inputType === 'select' ? 'form-select' : 'form-checkbox',
          confirmButton: disableConfirm ? 'btn btn-secondary pe-none' : 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1',
          denyButton: 'btn btn-warning ms-1'
        },
      inputAttributes: {
        autocapitalize: 'off'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value === true || (isValid(result.value) && input)) {
        onClickYes(result.value)

        setOpen(true)

        MySwal.fire({
          title: (
            <>
              <div className=''>
                <Spinner animation='border' color='danger' size={'lg'}>
                  <span className='visually-hidden'>Loading...</span>
                </Spinner>
              </div>
            </>
          ),
            text: FM('Please-Wait'),
            showConfirmButton: false,
            showCancelButton: false,
            allowOutsideClick: false
          })
        }
      })
    } else {
      return await MySwal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        allowOutsideClick: false,
        customClass: {
          htmlContainer: textClass,
          confirmButton: disableConfirm ? 'btn btn-secondary pe-none' : 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ms-1'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          onClickYes()
        } else if (result.isDenied) {
          onClickNo()
        }
      })
    }
  }

  return (
    <>
      <span
        role='button'
        onClick={popup}
        className={className}
        style={style}
        id={id ?? 'delete-button'}
      >
        {children}
      </span>
    </>
  )
}

export default ConfirmAlert
