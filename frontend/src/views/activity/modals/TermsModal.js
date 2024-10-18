import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Form } from 'reactstrap'
import { acceptTerms } from '../../../utility/apis/dashboard'
import { UserTypes } from '../../../utility/Const'
import { FM, isValid, log } from '../../../utility/helpers/common'
import { setViewDone } from '../../../utility/apis/commons'

const TermsModal = () => {
  const [basicModal, setBasicModal] = useState(false)
  const [centeredModal, setCenteredModal] = useState(false)
  const [disabledModal, setDisabledModal] = useState(false)
  const [disabledAnimation, setDisabledAnimation] = useState(false)
  const [dark, setDark] = React.useState(localStorage.getItem('accept-terms') === 'true')
  const [currentIndex, setCurrentIndex] = useState(0)
  React.useEffect(() => {
    localStorage.setItem('accept-terms', dark)
  }, [dark])

  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue
  } = form

  const toggleDarkMode = () => {
    setDark(!dark)
  }

  const user = useSelector((state) => state.auth.userData)
  console.log('user data: ', user)
  const handleModal = () => setDisabledModal(!disabledModal)

  useEffect(() => {
    if (!isValid(localStorage.getItem('accept-terms'))) {
      if (isValid(user?.user_type_id) && user?.user_type_id !== UserTypes.admin) {
        if (disabledModal !== null) {
          if (disabledModal) {
            document.body.style.overflow = 'hidden'
          } else {
            document.body.style.overflowY = 'visible'
          }
        }
      }
    }
  }, [disabledModal])

  // useEffect(() => {
  //     if (localStorage.getItem('accept-terms') === 'false') {
  //         const timer = setTimeout(() => {
  //             setDisabledModal(!disabledModal)
  //         }, 5000)
  //     }
  // }, [])
  useEffect(() => {
    if (user?.file_access !== null) {
      if (isValid(user?.user_type_id) && user?.user_type_id !== UserTypes.admin) {
        if (JSON.parse(localStorage.getItem('accept-terms')) === false) {
          log(JSON.parse(localStorage.getItem('accept-terms')))
          const timer = setTimeout(() => {
            setDisabledModal(!disabledModal)
          }, 400)
        }
      }
    }
  }, [user])

  const handleSubmits = () => {
    acceptTerms({
      jsonData: {
        admin_file_id: user?.file_access[currentIndex]?.id
      },
      success: () => {
        localStorage.setItem('accept-terms', 'true')
        if (currentIndex + 1 < user?.file_access.length) {
          setCurrentIndex(currentIndex + 1)
        } else {
          handleModal()
          setDisabledModal(!disabledModal)
        }
      }
    })
    setViewDone({
      jsonData: {
        admin_file_id: user?.file_access[currentIndex]?.id,
        employee_id: user?.id
      }
    })
  }

  const onSubmit = (data) => {
    // console.log(data)
    toggleDarkMode()
  }
  if (user?.file_access && user?.file_access.length > 0) {
    return (
      <div className='disabled-backdrop-modal'>
        <React.Fragment>
          <Modal
            isOpen={disabledModal}
            toggle={() => setDisabledModal(!disabledModal)}
            className='modal-fullscreen modal-dialog-centered'
            backdrop={false}
          >
            <ModalHeader>{FM('please-accept-following-terms-condition')}</ModalHeader>
            <ModalBody className='p-0'>
              <div>
                <div>
                  <iframe
                    src={user?.file_access[currentIndex]?.file_path}
                    className='d-flex'
                    style={{ width: '100%', height: '83vh' }}
                    frameborder='0'
                  ></iframe>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color='primary' type='submit' onClick={() => handleSubmits()}>
                {FM('accept')}
              </Button>{' '}
            </ModalFooter>
          </Modal>
        </React.Fragment>
      </div>
    )
  } else return null
}

export default TermsModal
