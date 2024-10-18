// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'
import axios from 'axios'

// ** Menu Items Array
import navigation from '@src/navigation/vertical'
import { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { AbilityContext } from '@src/utility/context/Can'
import Emitter from '../utility/Emitter'
import { isObjEmpty } from '../utility/Utils'
import { login } from '../utility/apis/authenticationApis'
import { Events, Patterns } from '../utility/Const'
import { Alert, Button, Form, Modal, ModalBody, ModalFooter } from 'reactstrap'
import FormGroupCustom from '../views/components/formGroupCustom'
import LoadingButton from '../views/components/buttons/LoadingButton'
import { useForm } from 'react-hook-form'
import { FM, isValid, log } from '../utility/helpers/common'
import { handleLogout } from '../redux/authentication'
import { getPath } from '../router/RouteHelper'

const VerticalLayout = (props) => {
  const [unauthenticated, setUnauthenticated] = useState(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setError
  } = useForm()
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const ability = useContext(AbilityContext)

  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])
  useEffect(() => {
    Emitter.on(Events.Unauthenticated, setUnauthenticated)
    Emitter.on(Events.RedirectMessage, ({ user, message }) => {
      history.push({ pathname: getPath('messages'), state: { user, message } })
    })
    // return () => {
    //     Emitter.off(Events.Unauthenticated, e => setUnauthenticated(false))
    // }
  }, [])

  useEffect(() => {
    if (isValid(unauthenticated)) {
      log(unauthenticated, 'unauthenticated')
      if (unauthenticated) {
      } else {
      }
    }
  }, [unauthenticated])

  /// login
  const onSubmit = (formData) => {
    if (isObjEmpty(errors)) {
      login({
        formData,
        redirect: false,
        loading: setLoading,
        success: (data) => {
          window.location.reload(false)
        },
        dispatch,
        ability,
        history
      })
    }
  }
  return (
    <>
      <Layout menuData={navigation} {...props}>
        {props.children}
      </Layout>
      {unauthenticated ? (
        <>
          <Modal backdropClassName='auth-modal' size='sm' centered isOpen={unauthenticated}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Alert color='danger' className='p-1 mb-0'>
                {FM('session-expired')}
              </Alert>
              <ModalBody className=''>
                <FormGroupCustom
                  autoFocus
                  type='email'
                  name='email'
                  feedback={FM('please-enter-valid-email')}
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{
                    required: true,
                    pattern: Patterns.EmailOnly
                  }}
                />
                <FormGroupCustom
                  type='password'
                  name='password'
                  className='mb-1'
                  errors={errors}
                  control={control}
                  rules={{ required: true }}
                />
              </ModalBody>
              <ModalFooter className=''>
                <Button.Ripple
                  outline
                  size='sm'
                  onClick={(e) => {
                    e.preventDefault()
                    dispatch(handleLogout(history))
                  }}
                >
                  Logout
                </Button.Ripple>
                <LoadingButton size='sm' loading={loading} type='submit' color='primary'>
                  {FM('sign-in')}
                </LoadingButton>
              </ModalFooter>
            </Form>
          </Modal>
        </>
      ) : null}
    </>
  )
}

export default VerticalLayout
