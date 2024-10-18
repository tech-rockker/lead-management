import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Form } from 'reactstrap'
import { FM } from '../../../src/utility/helpers/common'
import {
  accountStatus,
  createAsyncSelectOptions,
  enableFutureDates,
  Status
} from '../../../src/utility/Utils'
import { loadCompanyType } from '../../utility/apis/compTypeApis'
import { loadPackages } from '../../utility/apis/packagesApis'
import FormGroupCustom from '../../views/components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../views/components/sideModal/sideModal'

const CompanyFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
  const dispatch = useDispatch()
  const form = useForm()
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    getValues
  } = form
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(show)
  const [companyData, setCompanyData] = useState(null)
  //states
  const [_class, setClass] = useState([])
  // Company
  const [comp, setComp] = useState([])
  // Package
  const [packaged, setPackaged] = useState([])

  ///////////////

  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCompanyType({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setComp)
  }

  const loadPackageOptions = async (search, loadedOptions, { page }) => {
    const res = await loadPackages({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setPackaged)
  }

  const submitFilter = (d) => {
    // eslint-disable-next-line prefer-template
    // setFilterData({...d, company_type_id : `[${d.company_type_id}]`})
    setFilterData(d)
    console.log({ ...d, company_type_id: `[${d.company_type_id}]` })
  }

  // Show/Hide Modal
  useEffect(() => {
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
      title={'company-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          type={'select'}
          isClearable
          async
          // isMulti
          // defaultOptions
          loadOptions={loadTypeOptions}
          control={control}
          options={comp}
          errors={errors}
          rules={{ required: false }}
          name='company_type_id'
          className='mb-1'
          label={FM('company-types')}
        />

        <FormGroupCustom
          label={'package'}
          type={'select'}
          async
          isClearable
          // defaultOptions
          control={control}
          options={packaged}
          loadOptions={loadPackageOptions}
          name={'package_id'}
          className='mb-2'
        />

        <FormGroupCustom
          placeholder={FM('name')}
          type='text'
          name='name'
          label={FM('company-name')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          placeholder={FM('phone-number')}
          type='number'
          name='contact_number'
          label={FM('phone-number')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          placeholder={FM('email')}
          type='email'
          name='email'
          label={FM('email')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          placeholder={FM('organization_number')}
          type='number'
          name='organization_number'
          label={FM('organization_number')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          name={'licence_end_date'}
          type={'date'}
          setValue={setValue}
          errors={errors}
          label={FM('license-end-date')}
          options={{
            enable: [
              function (date) {
                return enableFutureDates(date)
              },
              companyData?.licence_end_date,
              new Date()
            ]
          }}
          className='mb-2'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          label={'status'}
          type={'select'}
          isClearable
          control={control}
          options={accountStatus()}
          name={'status'}
          className='mb-2'
        />
      </Form>
    </SideModal>
  )
}

export default CompanyFilter
