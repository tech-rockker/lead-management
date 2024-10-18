import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { createAsyncSelectOptions, genderType } from '../../../utility/Utils'
import { categoriesLoad, categoryChildList } from '../../../utility/apis/categories'
import { patientTypeListLoad } from '../../../utility/apis/commons'
import { loadCompanyType } from '../../../utility/apis/compTypeApis'
import { loadDep } from '../../../utility/apis/departments'
import { loadPatientPlanList } from '../../../utility/apis/ip'
import { loadUser } from '../../../utility/apis/userManagement'
import { FM } from '../../../utility/helpers/common'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import { UserTypes } from '../../../utility/Const'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import SideModal from '../../components/sideModal/sideModal'

const PatientFilter = ({ userType = null, show, handleFilterModal, setFilterData, filterData }) => {
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
  const user = useUser()
  const [open, setOpen] = useState(show)
  const [loading, setLoading] = useState(false)
  const [comp, setComp] = useState(null)
  const [subCategory, setSubCategory] = useState([])
  const [dept, setDept] = useState([])
  const [patientType, setPatientType] = useState([])
  const [category, setCategory] = useState([])
  const [branch, setBranch] = useState([])
  const [ip, setIp] = useState([])

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

  const loadAllCategory = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setCategory)
  }

  const loadAllDepartment = async (search, loadedOptions, { page }) => {
    const res = await loadDep({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setDept)
  }

  const loadPatientTypeOption = async (search, loadedOptions, { page }) => {
    const res = await patientTypeListLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'designation', 'id', setPatientType)
  }
  const loadCategoryData = async (search, loadedOptions, { page }) => {
    const res = await categoriesLoad({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'name', 'id', setCategory)
  }

  const loadCatOptions = async (search, loadedOptions, { page }) => {
    if (watch('category_id')) {
      const res = await categoryChildList({
        async: true,
        page,
        perPage: 100,
        jsonData: { name: search, parent_id: watch('category_id') }
      })
      return createAsyncSelectOptions(res, page, 'name', 'id', setSubCategory)
    } else {
      return {
        options: [],
        hasMore: false
      }
    }
  }

  const loadAllBranch = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: 11 }
    })
    return createAsyncSelectOptions(res, page, 'branch_name', 'id', setBranch)
  }

  const loadIpOption = async (search, loadedOptions, { page }) => {
    const res = await loadPatientPlanList({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search }
    })
    return createAsyncSelectOptions(res, page, 'title', 'id', setIp)
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
      title={'patient-filter'}
      done='filter'
    >
      <Form>
        <FormGroupCustom
          type={'select'}
          isClearable
          async
          loadOptions={loadIpOption}
          control={control}
          options={ip}
          errors={errors}
          rules={{ required: false }}
          name='ip_id'
          className='mb-1'
          label={FM('ip-plans')}
        />

        {/* <FormGroupCustom
                    type={"select"}
                    key={watch("category_id")}
                    async
                    // defaultOptions
                    loadOptions={loadCatOptions}
                    control={control}
                    options={subCategory}
                    errors={errors}
                    rules={{ required: false }}
                    name="subcategory_id"
                    className='mb-1'
                    label={FM("sub-category")}

                /> */}
        <Hide IF={user?.user_type_id === UserTypes.patient}>
          <FormGroupCustom
            options={branch}
            isClearable
            name={'branch_id'}
            type={'select'}
            async
            // defaultOptions
            className='mb-2'
            control={control}
            loadOptions={loadAllBranch}
          />
        </Hide>

        <FormGroupCustom
          label={'patient-type'}
          options={patientType}
          name={'patient_type_id'}
          type={'select'}
          async
          // defaultOptions
          className='mb-2'
          control={control}
          loadOptions={loadPatientTypeOption}
        />
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

        <FormGroupCustom
          placeholder={FM('personal_number')}
          type='number'
          name='personal_number'
          label={FM('personal_number')}
          className='mb-1'
          control={control}
          rules={{ required: false }}
        />

        <FormGroupCustom
          label={'gender'}
          type={'select'}
          isClearable
          control={control}
          options={genderType()}
          name={'gender'}
          rules={{}}
          className='mb-2'
        />
      </Form>
    </SideModal>
  )
}

export default PatientFilter
