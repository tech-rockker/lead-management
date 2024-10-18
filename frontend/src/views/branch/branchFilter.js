import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { FM } from '../../../src/utility/helpers/common'
import { countryListLoad } from '../../utility/apis/commons'
import { loadCompanyType } from '../../utility/apis/compTypeApis'
import { createAsyncSelectOptions, createSelectOptions } from '../../utility/Utils'
import FormGroupCustom from '../../views/components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../views/components/sideModal/sideModal'

const BranchFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
  // Dispatch
  const dispatch = useDispatch()

  // Form Validation
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    watch,
    reset
  } = useForm()
  const history = useHistory()
  // States

  const [open, setOpen] = useState(show)
  const [loading, setLoading] = useState(false)
  const [comp, setComp] = useState(null)
  const [country, setCountry] = useState([])

  const submitFilter = (d) => {
    setFilterData(d)
    console.log(d)
  }

  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCompanyType({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setComp)
  }

  const loadCountryTypes = () => {
    countryListLoad({
      loading: setLoading,
      success: (d) => {
        setCountry(createSelectOptions(d?.payload, 'name', 'id'))
      }
    })
  }

  // Show/Hide Modal
  useEffect(() => {
    loadCountryTypes()
    if (show) setOpen(true)
    if (!show) reset()
  }, [show])

  return (
    <SideModal
      loading={loading}
      handleSave={handleSubmit(submitFilter)}
      open={open}
      handleModal={() => {
        setOpen(false)
        handleFilterModal(false)
      }}
      title={'branch-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          label={'company-types'}
          type={'select'}
          async
          // defaultOptions
          control={control}
          options={comp}
          loadOptions={loadTypeOptions}
          name={'company_type_id'}
          className='mb-2'
        />

        {/* <FormGroupCustom
                    options={country}
                    name={"country_id"}
                    type={"select"}
                    className="mb-2"
                    isDisabled={loading}
                    isLoading={loading}
                    control={control}
                    loadOptions={loadCountryTypes}
                    rules={{ required: false }}
                    errors={errors}
                /> */}

        <FormGroupCustom
          placeholder={FM('name')}
          type='text'
          name='name'
          label={FM('name')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          placeholder={FM('email')}
          type='text'
          name='email'
          label={FM('email')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          placeholder={FM('contact_number')}
          type='number'
          name='contact_number'
          label={FM('contact_number')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        {/* <FormGroupCustom
                    placeholder={FM("organization_number")}
                    type="number"
                    name="organization_number"
                    label={FM("organization_number")}
                    className='mb-1'
                    control={control}
                    rules={{ required: false }}
                /> */}
      </Form>
    </SideModal>
  )
}

export default BranchFilter
