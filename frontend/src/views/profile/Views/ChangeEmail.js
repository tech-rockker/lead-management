import '@styles/react/apps/app-users.scss'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Form } from 'reactstrap'
import { handleLogin } from '../../../redux/authentication'
import { changePassword, FakeEmailChange } from '../../../utility/apis/authenticationApis'
import { FM, isValid, log } from '../../../utility/helpers/common'
import useGeoLocation from '../../../utility/hooks/useGeoLocation'
import useUser from '../../../utility/hooks/useUser'
import FormGroupCustom from '../../components/formGroupCustom'
import CenteredModal from '../../components/modal/CenteredModal'

const ChangeEmail = ({
  edit = null,
  noView = false,
  showModal = false,
  setShowModal = () => {},
  stampTempId = null,
  Component = 'span',
  children = null,
  ...rest
}) => {
  const dispatch = useDispatch()
  const user = useUser()
  const form = useForm()
  const locations = useGeoLocation()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch
  } = form
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [editData, setEditData] = useState(null)
  const [open, setOpen] = useState(null)

  // Handle Modal
  const handleModal = () => {
    setOpen(!open)
    setShowModal(!open)
    reset()
    if (edit === null) setEditData(null)
  }

  const submitData = (data) => {
    FakeEmailChange({
      id: user?.id,
      formData: {
        ...user,
        ...data
      },
      loading: setLoading,
      // dispatch,
      success: (d) => {
        const x = {
          ...user,
          ...d?.payload
        }
        dispatch(handleLogin(x))
        setOpen(false)
        handleModal(false)
      }
    })
    log(data)
  }

  useEffect(() => {
    if (!isValid(edit)) {
      reset()
    }
  }, [edit])

  const handleClose = (from = null) => {
    handleModal()
  }

  useEffect(() => {
    if (showModal) handleModal()
  }, [showModal])

  return (
    <>
      <CenteredModal
        title={FM('change-email')}
        disableSave={loadingDetails}
        loading={loading}
        modalClass={'modal-md'}
        open={open}
        handleModal={handleClose}
        handleSave={handleSubmit(submitData)}
      >
        <Form>
          <div className='p-2'>
            {/* <FormGroupCustom
                            value={edit?.email}
                            placeholder={FM("email")}
                            type="text"
                            name="email"
                            label={FM("email")}
                            className='pe-none mb-1'
                            errors={errors}
                            control={control}
                            rules={{ required: false }}
                        /> */}

            <FormGroupCustom
              key={`NAME${edit}`}
              name={'email'}
              type={'text'}
              errors={errors}
              label={FM('new-email')}
              className='mb-2'
              control={control}
              rules={{ required: true }}
              values={editData}
            />
          </div>
        </Form>
      </CenteredModal>
      {!noView ? (
        <Component role='button' onClick={handleModal} {...rest}>
          {children}
        </Component>
      ) : null}
    </>
  )
}
export default ChangeEmail
