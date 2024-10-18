import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Form } from 'reactstrap'
import { loadComp, loadCompOnly } from '../../../utility/apis/companyApis'
import { UserTypes } from '../../../utility/Const'
import { createAsyncSelectOptions } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import SideModal from '../../components/sideModal/sideModal'

const FilterBankIdLog = ({
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
  const [company, setCompany] = useState(null)

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

  const loadCompanyOption = async (search, loadedOptions, { page }) => {
    const res = await loadCompOnly({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.company }
    })
    return createAsyncSelectOptions(res, page, 'company_name', 'id', setCompany)
  }

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
            label={'company'}
            type={'select'}
            async
            isClearable
            // defaultOptions
            control={control}
            options={company}
            loadOptions={loadCompanyOption}
            name={'top_most_parent_id'}
            className='mb-2'
            rules={{ required: false }}
          />
          <FormGroupCustom
            label={'name'}
            name={'name'}
            type={'text'}
            className={'mb-2'}
            errors={errors}
            control={control}
          />
          <FormGroupCustom
            label={'personnel-number'}
            name={'personnel_number'}
            type={'number'}
            errors={errors}
            control={control}
          />
        </Form>
      </SideModal>
    </>
  )
}

export default FilterBankIdLog
