import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Form } from 'reactstrap'
import { categoriesLoad, categoryChildList } from '../../utility/apis/categories'
//import { categoryChildList } from '../../utility/apis/commons'
import { loadUser } from '../../utility/apis/userManagement'
import { forDecryption, UserTypes } from '../../utility/Const'
import { FM, isValid } from '../../utility/helpers/common'
import Hide from '../../utility/Hide'
import useUserType from '../../utility/hooks/useUserType'
import Show from '../../utility/Show'
import { createAsyncSelectOptions, decryptObject } from '../../utility/Utils'
import FormGroupCustom from '../components/formGroupCustom'
import SideModal from '../components/sideModal/sideModal'

const FilterJournal = ({ user = null, show, handleFilterModal, setFilterData, filterData }) => {
  const [open, setOpen] = useState(show)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [branch, setBranch] = useState([])
  const usertype = useUserType()
  const [patient, setPatient] = useState(null)

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

  const loadPatientOption = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: UserTypes.patient }
    })
    return createAsyncSelectOptions(res, page, 'name', null, setPatient, (x) => {
      return decryptObject(forDecryption, x)
    })
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
  const loadBranchOptions = async (search, loadedOptions, { page }) => {
    const res = await loadUser({
      async: true,
      page,
      perPage: 100,
      jsonData: { name: search, user_type_id: 11 }
    })
    return createAsyncSelectOptions(res, page, 'branch_name', 'id', setBranch, (x) => {
      return decryptObject(forDecryption, x)
    })
  }
  const submitFilter = (d) => {
    setFilterData({
      ...filterData,
      ...d,
      patient_id: d?.patient_id?.id,
      patient_name: d?.patient_id?.name,
      patient: d?.patient_id,
      is_signed: d?.is_signed === 1 ? 'yes' : null,
      is_active: d?.is_active === 1 ? 'yes' : null,
      is_secret: d?.is_secret === 1 ? 'yes' : null,
      with_activity: d?.with_activity === 1 ? 'yes' : null
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
        title={'journal-filter'}
        done='filter'
      >
        <Form>
          <Show IF={!isValid(user)}>
            <FormGroupCustom
              label={'patient'}
              type={'select'}
              async
              isClearable
              // defaultOptions
              control={control}
              options={patient}
              loadOptions={loadPatientOption}
              name={'patient_id'}
              className='mb-2'
              rules={{ required: false }}
            />
          </Show>
          <Hide IF={usertype === UserTypes.patient}>
            <FormGroupCustom
              type={'select'}
              isClearable
              async
              // defaultOptions
              loadOptions={loadCategoryData}
              control={control}
              options={category}
              errors={errors}
              rules={{ required: false }}
              name='category_id'
              className='mb-1'
              label={FM('category')}
            />
            <FormGroupCustom
              type={'select'}
              key={watch('category_id')}
              async
              // defaultOptions
              loadOptions={loadCatOptions}
              control={control}
              options={subCategory}
              errors={errors}
              rules={{ required: false }}
              name='subcategory_id'
              className='mb-1'
              label={FM('sub-category')}
            />
          </Hide>
          <FormGroupCustom
            label={'branch'}
            type={'select'}
            async
            isClearable
            // defaultOptions
            control={control}
            options={branch}
            loadOptions={loadBranchOptions}
            name={'branch_id'}
            noLabel={branch.length === 0}
            className={classNames('mb-1 ', {
              'd-block': branch.length > 0,
              'd-none': branch.length === 0
            })}
          />
          
          <FormGroupCustom
            name={'data_of'}
            type={'date'}
            errors={errors}
            label={FM('date')}
            dateFormat={'YYYY-MM-DD'}
            setValue={setValue}
            className='mb-2'
            control={control}
            rules={{ required: false }}
          />
          {/* <Row>
                    <Col md="6">
                        <FormGroupCustom
                            label={"secret-journal"}
                            name={"is_secret"}
                            type={"checkbox"}
                            errors={errors}
                            className="mb-2"
                            control={control}
                        />
                    </Col>
                    <Col md="6">
                        <FormGroupCustom
                            label={"active"}
                            name={"is_active"}
                            type={"checkbox"}
                            errors={errors}
                            className="mb-2"
                            control={control}
                        />
                    </Col>
                </Row> */}
          <FormGroupCustom
            label={'secret-journal'}
            name={'is_secret'}
            type={'checkbox'}
            errors={errors}
            control={control}
          />

          <FormGroupCustom
            label={'active'}
            name={'is_active'}
            type={'checkbox'}
            errors={errors}
            control={control}
          />

          <FormGroupCustom
            label={'signed'}
            name={'is_signed'}
            type={'checkbox'}
            errors={errors}
            control={control}
          />
          <FormGroupCustom
            label={'activity'}
            name={'with_activity'}
            type={'checkbox'}
            errors={errors}
            control={control}
          />
          {/* <FormGroupCustom
                        label={"implementations title"}
                        type={"select"}
                        async
                        isClearable
                        // defaultOptions
                        control={control}
                        options={ip}
                        loadOptions={loadIpOption}
                        name={"ip_id"}
                        className="mb-2"
                    /> */}
        </Form>
      </SideModal>
    </>
  )
}

export default FilterJournal
