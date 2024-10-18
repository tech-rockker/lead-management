// ** React Imports
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useEffect } from 'react'
import { Button, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { FM } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import LoadingButton from '../buttons/LoadingButton'

const CenteredModal = ({
  extraFooterComponent = null,
  id,
  hideSave = false,
  footerComponent = null,
  display = true,
  scrollControl = true,
  disableHeader = false,
  disableFooter = false,
  loading = false,
  modalClass,
  open,
  disableSave = false,
  handleModal,
  children,
  handleSave,
  handleSign,
  fullscreen,
  title = 'modal-title',
  sign = 'sign',
  done = 'save',
  close = 'close',
  extraButtons = null
}) => {
  useEffect(() => {
    if (open !== null) {
      if (open === true) {
        setTimeout(() => {
          document.body.setAttribute('no-scroll', 1)
        }, 500)
      } else {
        document.body.removeAttribute('no-scroll')
      }
      const modal = document.getElementsByClassName('modal show')
      if (modal.length > 1) {
        setTimeout(() => {
          document.body.setAttribute('no-scroll', 1)
        }, 500)
      } else {
        // document.body.removeAttribute("no-scroll")
      }
    }
  }, [open])

  useEffect(() => {
    if (open === false || open === null) {
      document.body.removeAttribute('no-scroll')
    }
  }, [open])

  return (
    <Modal
      zIndex={open ? '1050' : '1049'}
      wrapClassName={`animatedOpacity ${display ? '' : 'send-left'}`}
      isOpen={open}
      toggle={(e) => handleModal(null)}
      backdrop='static'
      scrollable={scrollControl}
      keyboard={false}
      isVisible={open}
      className={`modal-dialog-centered ${modalClass} ${open ? 'visible' : ''}`}
      fullscreen={fullscreen}
    >
      <Hide IF={disableHeader}>
        <ModalHeader className='' toggle={(e) => handleModal(null)}>
          {title}
        </ModalHeader>
      </Hide>
      <ModalBody className='flex-grow-1 p-0' id={id}>
        {children}
      </ModalBody>
      <Hide IF={disableFooter}>
        <ModalFooter>
          {extraFooterComponent}
          <Hide IF={footerComponent}>
            <div className=''>
              <ButtonGroup className='btn-block'>
                <Button.Ripple
                  color='secondary'
                  onClick={(e) => handleModal('from-button')}
                  outline
                >
                  {FM(close)}
                </Button.Ripple>
                <Hide IF={hideSave}>
                  <LoadingButton
                    disabled={disableSave}
                    loading={loading}
                    color='primary'
                    outline={extraButtons !== null}
                    onClick={handleSave}
                  >
                    {FM(done)}
                  </LoadingButton>
                </Hide>

                {extraButtons}
              </ButtonGroup>
            </div>
          </Hide>
          {footerComponent}
        </ModalFooter>
      </Hide>
    </Modal>
  )
}

export default CenteredModal
