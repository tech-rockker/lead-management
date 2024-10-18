import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import { handleLogout } from '../../../redux/authentication'
import { UserTypes } from '../../../utility/Const'
import { isValid } from '../../../utility/helpers/common'

const License = () => {
  const user = useSelector((state) => state.auth.userData)
  const [disabledModal, setDisabledModal] = useState(false)
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue
  } = form
  const toggleDarkMode = () => {
    // setDark(!dark)
  }
  const [licenceStatus, setLicenceStatus] = useState({
    license_status: user?.license_status
  })
  const dispatch = useDispatch()

  useEffect(() => {
    setLicenceStatus()
  }, [user])

  const history = useHistory()
  const handleModal = () => setDisabledModal(!disabledModal)

  useEffect(() => {
    if (!isValid(user?.license_status !== 1)) {
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
    if (user?.license_status !== 1) {
      const timer = setTimeout(() => {
        setDisabledModal(!disabledModal)
      }, 400)
    }
  }, [user])

  const onSubmit = (data) => {
    toggleDarkMode()
  }

  return (
    <div className='disabled-backdrop-modal'>
      <React.Fragment>
        <Modal
          isOpen={disabledModal}
          toggle={() => setDisabledModal(!disabledModal)}
          className='modal-lg modal-dialog-centered'
          backdrop={false}
        >
          <ModalHeader>
            <h5> License</h5>
          </ModalHeader>
          <ModalBody className='p-2'>
            <Card>
              <CardHeader>
                <CardTitle tag='h4'>Our License Usage</CardTitle>
              </CardHeader>
              <CardBody>
                <CardText className='mb-2 pb-1'>
                  Use of any product you buy from PIXINVENT is bound by the license you purchase. It
                  will allow you the non-exclusive access to use it in your personal as well as
                  client projects.
                </CardText>
                <h5 className='mt-3'>Single License</h5>
                <ul className='ps-25 ms-1'>
                  <li>You have rights to use our product for your personal or client project.</li>
                  <li>
                    You can modify our product as per your needs and use it for your personal or
                    client project.
                  </li>
                </ul>
                <CardText className='mb-2 pb-75'>
                  With Single License you will be able to use our product for yourself or your
                  client project for 1 time. If you want to use it for multiple times, you need to
                  buy another regular license every time. Ownership and Copyright of our template
                  will stay with ThemeSelection after purchasing single license. That means you are
                  allowed to use our template in your project and use for one client or yourself,
                </CardText>
                <h5>Multiple License</h5>
                <ul className='ps-25 ms-1'>
                  <li>You can use our product for your personal or client project. 😎</li>
                  <li>
                    You can use our product for unlimited projects when end users are not charged.
                  </li>
                </ul>
                <CardText className='mb-2 pb-75'>
                  With Multiple Use License you will be able to use our product for yourself as well
                  as your client projects. You can use product for unlimited projects. Ownership and
                  Copyright of our template will stay with ThemeSelection after purchasing multiple
                  use license. That means you are allowed to use our template in your project and
                  use for multiple clients and yourself, but you are not allowed to create SaaS
                  application and sell that,
                </CardText>
                <h5>Extended License</h5>
                <ul className='ps-25 ms-1'>
                  <li>You can use our product for your personal or client project.</li>
                  <li>
                    You cannot resell, redistribute, lease, license or offer the product to any
                    third party.
                  </li>
                </ul>
                <CardText className='mb-2 pb-1'>
                  With Extended License you will be able to use our product for yourself or your
                  client project for one time. You can use it for building one project. Ownership
                  and Copyright of our template will remain with ThemeSelection and that means, you
                  are not allowed to sell, distribute or lease our template as it is to anyone
                </CardText>
                <Alert color='primary'>
                  <div className='alert-body d-flex align-items-center justify-content-between flex-wrap p-2'>
                    <div className='me-1'>
                      <h4 className='fw-bolder text-primary'>Do you need custom license? 👩🏻‍💻</h4>
                      <p className='fw-normal mb-1 mb-lg-0'>
                        If you’ve mass production demand and other custom use cases than we’re here
                        to help you.
                      </p>
                    </div>
                    <Button color='primary'>Contact Us</Button>
                  </div>
                </Alert>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Form>
              <Button
                color='primary'
                type='submit'
                onClick={() => {
                  dispatch(handleLogout(history))
                }}
              >
                Accept
              </Button>{' '}
            </Form>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    </div>
  )
}

export default License
