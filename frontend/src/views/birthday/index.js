import React, { useState, useEffect } from 'react'
import { Award } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import {
  Button,
  Card,
  CardBody,
  CardText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import decorationLeft from '@src/assets/images/elements/decore-left.png'
import decorationRight from '@src/assets/images/elements/decore-right.png'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { FM, isValid, log } from '../../utility/helpers/common'
import { UserTypes } from '../../utility/Const'
import { formatDate, personalNumberToDob } from '../../utility/Utils'
import { Cake } from '@material-ui/icons'

const Birthday = () => {
  const [disabledModal, setDisabledModal] = useState(false)
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue
  } = form
  const user = useSelector((state) => state.auth.userData)

  const handleModal = () => setDisabledModal(!disabledModal)

  useEffect(() => {
    if (!isValid(localStorage.getItem('dob'))) {
      if (user?.user_type_id !== UserTypes.admin) {
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

  useEffect(() => {
    const DOB = user?.personal_number

    const f = personalNumberToDob(DOB)
    const a = formatDate(new Date(f), 'MM-DD')
    const today = formatDate(new Date(), 'MM-DD')
    if (today === a) {
      if (JSON.parse(localStorage.getItem('dob')) === false) {
        log(JSON.parse(localStorage.getItem('dob')))
        const timer = setTimeout(() => {
          setDisabledModal(!disabledModal)
        }, 400)
      }
    }
    // localStorage.setItem('dob', false)
  }, [user])

  const handleSubmits = () => {
    localStorage.setItem('dob', 'true')
    handleModal()
    setDisabledModal(!disabledModal)
  }

  return (
    <div className='disabled-backdrop-modal'>
      <>
        <Modal
          isOpen={disabledModal}
          toggle={() => setDisabledModal(!disabledModal)}
          className='modal-fullscreen modal-dialog-centered'
          backdrop={false}
        >
          {/* <ModalHeader>
                        Birthday Greeting
                    </ModalHeader> */}
          <ModalBody className='p-0'>
            <Card className='card-congratulations'>
              <CardBody className='text-center'>
                {/* <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
                                <img className='congratulations-img-right' src={decorationRight} alt='decor-right' /> */}
                <img
                  className=''
                  src='https://cdn.pixabay.com/photo/2020/10/06/21/54/cake-5633461__480.png'
                  alt='birthday'
                  class='birthday'
                />
                {/* <Avatar icon={<Cake size={28} />} className='shadow' color='primary' size='xl' /> */}
                <div className='text-center mt-1'>
                  <h1 className='mb-1 text-white'>
                    {FM('happy-birthday')}{' '}
                    <span className='text-success fw-bolder'>{user?.name}</span>
                  </h1>
                  <CardText className='m-auto w-75'>{FM('have-a-great-future-ahead')}</CardText>
                </div>
              </CardBody>
            </Card>
            {/* <Card className="card-congratulations">
                            <img src="https://cdn.pixabay.com/photo/2020/10/06/21/54/cake-5633461__480.png" alt="birthday" class="birthday" />
                            <div className="text-center">
                                <h1>Happy Birthday <span className="fw-bolder">{user?.name}</span>!</h1>
                                <p>Have a great future ahead..!</p>
                            </div>
                            <div className="space"></div>
                        </Card> */}
          </ModalBody>
          <ModalFooter>
            <Button color='primary' type='submit' onClick={() => handleSubmits()}>
              {FM('close')}
            </Button>{' '}
          </ModalFooter>
        </Modal>
      </>
    </div>
  )
}

export default Birthday
