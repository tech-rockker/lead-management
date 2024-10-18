import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Form } from 'reactstrap'
import FormGroupCustom from '../../components/formGroupCustom'
import SideModal from '../../components/sideModal/sideModal'

//import { categoryChildList } from '../../utility/apis/commons'

const FileAccessFilter = ({
  user = null,
  show,
  handleFilterModal,
  setFilterData,
  filterData,
  title = 'Modal Title'
}) => {
  const [open, setOpen] = useState(show)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
    setError
  } = useForm()

  const submitFilter = (d) => {
    setFilterData({
      ...filterData,
      ...d
    })
  }
  useEffect(() => {
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  return (
    <>
      <SideModal
        loading={loading}
        handleSave={handleSubmit(submitFilter)}
        open={open}
        handleModal={() => {
          setOpen(false)
          handleFilterModal(false)
        }}
        title={title}
        done='filter'
      >
        <Form>
          <FormGroupCustom
            label={'title'}
            name={'title'}
            type={'text'}
            errors={errors}
            control={control}
            className={'mb-2'}
          />
        </Form>
      </SideModal>
    </>
  )
}

export default FileAccessFilter
