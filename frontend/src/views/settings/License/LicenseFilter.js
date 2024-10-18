import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { loadComp, loadCompOnly } from '../../../utility/apis/companyApis'
import { loadModule } from '../../../utility/apis/moduleApis'
import { loadPackages } from '../../../utility/apis/packagesApis'
import { FM } from '../../../utility/helpers/common'
import { accountStatus, createAsyncSelectOptions } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
import SideModal from '../../components/sideModal/sideModal'

const LicenseFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
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
    reset,
    setValue
  } = useForm()
  const history = useHistory()
  // States
  const [open, setOpen] = useState(show)
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(false)
  const [ip, setIp] = useState([])
  const [comp, setComp] = useState([])
  const [module, setModule] = useState([])
  const [packaged, setPackaged] = useState([])

  const loadTypeOptions = async (search, loadedOptions, { page }) => {
    const res = await loadCompOnly({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'company_name', 'user_id', setComp)
  }

  const loadModulesOptions = async (search, loadedOptions, { page }) => {
    const res = await loadModule({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setModule)
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
    setFilterData({
      ...d,
      is_used: d?.is_used === 0 ? 'No' : 'Yes',
      group_by: 'test'
    })
    console.log(d)
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
      title={FM('licence-filter')}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          label={'company'}
          type={'select'}
          async
          defaultOptions
          isClearable
          control={control}
          options={comp}
          loadOptions={loadTypeOptions}
          name={'user_id'}
          className='mb-2'
        />

        {/* <FormGroupCustom
                    key={`module-${module}`}
                    name={"modules"}
                    errors={errors}
                    type={"select"}
                    isClearable
                    async
                    isMulti
                    className="mb-2"
                    defaultOptions
                    control={control}
                    options={module}
                    loadOptions={loadModulesOptions}
                />
                <FormGroupCustom
                    name={"package"}
                    errors={errors}
                    type={"select"}
                    isClearable
                    async
                    className="mb-2"
                    defaultOptions
                    control={control}
                    options={packaged}
                    loadOptions={loadPackageOptions}
                /> */}

        <FormGroupCustom
          name={'active_from'}
          type={'date'}
          errors={errors}
          label={FM('from-date')}
          dateFormat={'YYYY-MM-DD'}
          setValue={setValue}
          className='mb-2'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          name={'expired_at'}
          type={'date'}
          errors={errors}
          label={FM('to-date')}
          dateFormat={'YYYY-MM-DD'}
          setValue={setValue}
          className='mb-2'
          options={{
            minDate: new Date(watch('active_from'))
          }}
          control={control}
          rules={{ required: false }}
        />

        {/* <FormGroupCustom
                    placeholder={FM("license-key")}
                    type="text"
                    name={"license_key"}
                    label={FM("license-key")}
                    className='mb-1'
                    control={control}
                    rules={{ required: false }}
                /> */}

        <FormGroupCustom
          label={'is-used'}
          type={'checkbox'}
          name={'is_used'}
          errors={errors}
          className='mb-1'
          control={control}
          rules={{ required: false }}
          // defaultChecked={filterData?.is_used === "no"}
        />
      </Form>
    </SideModal>
  )
}

export default LicenseFilter
