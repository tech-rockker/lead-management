import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Col, Form, Row } from 'reactstrap'
import { categoriesLoad, categoryChildList } from '../../../utility/apis/categories'
import { loadUser } from '../../../utility/apis/userManagement'
import { UserTypes } from '../../../utility/Const'
import { FM, isValid } from '../../../utility/helpers/common'
import Show from '../../../utility/Show'
import { createAsyncSelectOptions } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import SideModal from '../../components/sideModal/sideModal'

//import { categoryChildList } from '../../utility/apis/commons'

const FilterActivityLog = ({
  user = null,
  show,
  handleFilterModal,
  setFilterData,
  filterData,
  title = 'Modal Title'
}) => {
  const [open, setOpen] = useState(show)
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
            label={'log-name'}
            name={'log_name'}
            type={'text'}
            className={'mb-2'}
            errors={errors}
            control={control}
          />

          <FormGroupCustom
            label={'subject-type'}
            name={'subject_type'}
            type={'text'}
            className={'mb-2'}
            errors={errors}
            control={control}
          />

          <FormGroupCustom
            label={'causer-type'}
            name={'causer_type'}
            type={'text'}
            className={'mb-2'}
            errors={errors}
            control={control}
          />
        </Form>
      </SideModal>
    </>
  )
}

export default FilterActivityLog
