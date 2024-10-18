import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form } from 'reactstrap'
import { useRedux } from '../../../redux/useRedux'
import { categoriesLoad } from '../../../utility/apis/categories'
import { patientTypeListLoad } from '../../../utility/apis/commons'
import { loadCompanyType } from '../../../utility/apis/compTypeApis'
import { loadDep } from '../../../utility/apis/departments'
import { loadUser } from '../../../utility/apis/userManagement'
import { UserTypes } from '../../../utility/Const'
import { FM } from '../../../utility/helpers/common'
import Hide from '../../../utility/Hide'
import useUser from '../../../utility/hooks/useUser'
import { createAsyncSelectOptions, gender, genderType } from '../../../utility/Utils'
import FormGroupCustom from '../../components/formGroupCustom'
// import Select from '../components/select'
import SideModal from '../../components/sideModal/sideModal'

const EmployeeFilter = ({ show, handleFilterModal, setFilterData, filterData }) => {
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
  const {
    reduxStates: {
      auth: { userData }
    }
  } = useRedux()
  const [open, setOpen] = useState(show)
  const [loading, setLoading] = useState(false)
  const [comp, setComp] = useState(null)
  const [dept, setDept] = useState([])
  const [category, setCategory] = useState([])
  const [branch, setBranch] = useState([])
  const user = useUser()

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

  const loadAllBranch = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: 11 }
    })
    return createAsyncSelectOptions(res, page, 'branch_name', 'id', setBranch)
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
      title={'employee-filter'}
      done='filter'
    >
      <Form>
        {/* <FormGroupCustom
                    label={"company-types"}
                    type={"select"}
                    async
                    // defaultOptions
                    control={control}
                    options={comp}
                    loadOptions={loadTypeOptions}
                    name={"company_type_id"}
                    className="mb-2"
                /> */}

        {/* <FormGroupCustom
                    options={dept}
                    name={"department"}
                    type={"select"}
                    async
                    // defaultOptions
                    className="mb-2"
                    control={control}
                    loadOptions={loadAllDepartment}
                /> */}
        <Hide
          IF={
            user?.user_type_id === UserTypes.adminEmployee || user?.user_type_id === UserTypes.admin
          }
        >
          <FormGroupCustom
            options={branch}
            name={'branch_id'}
            type={'select'}
            async
            isClearable
            label={FM('branch')}
            // defaultOptions
            className='mb-2'
            control={control}
            loadOptions={loadAllBranch}
          />
        </Hide>
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
          rules={
            {
              // required: required()
            }
          }
          className='mb-2'
        />

        <FormGroupCustom
          type='checkbox'
          name='status'
          value={1}
          label={FM('employee-status')}
          className='mb-1'
          errors={errors}
          control={control}
        />
      </Form>
    </SideModal>
  )
}

export default EmployeeFilter
